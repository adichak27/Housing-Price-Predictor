# backend/main.py
from datetime import datetime, timezone
from fastapi import FastAPI, Depends
from pydantic import BaseModel
import joblib
import numpy as np
import sqlite3
from contextlib import contextmanager
from typing import Generator

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the ML model
model = joblib.load("backend/model/model.pkl")

# Database configuration
DATABASE_URL = "backend/db/predictions.db"

@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    conn = sqlite3.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            square_footage INTEGER,
            bedrooms INTEGER,
            predicted_price REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        conn.commit()

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

class PredictionRecord(BaseModel):
    id: int
    squareFootage: int
    bedrooms: int
    predictedPrice: float
    createdAt: str

@app.get("/history", response_model=list[PredictionRecord])
def get_prediction_history():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM predictions ORDER BY created_at DESC")
        rows = cursor.fetchall()
        
        return [
            {
                "id": row[0],   
                "squareFootage": row[1],
                "bedrooms": row[2],
                "predictedPrice": row[3],
                "createdAt": datetime.strptime(row[4], "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc).isoformat()
            }
            for row in rows
        ]

class PredictionInput(BaseModel):
    squareFootage: int
    bedrooms: int

class PredictionResponse(BaseModel):
    id: int
    squareFootage: int
    bedrooms: int
    predictedPrice: float
    createdAt: str

@app.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionInput):
    features = np.array([[req.squareFootage, req.bedrooms]])
    prediction = model.predict(features)[0]

    with get_db() as conn:
        cursor = conn.cursor()
        # Log to SQLite
        cursor.execute(
            "INSERT INTO predictions (square_footage, bedrooms, predicted_price) VALUES (?, ?, ?)",
            (req.squareFootage, req.bedrooms, prediction)
        )
        conn.commit()

        # Get the ID and timestamp of the inserted row
        prediction_id = cursor.lastrowid
        cursor.execute("SELECT created_at FROM predictions WHERE id = ?", (prediction_id,))
        created_at_raw = cursor.fetchone()[0]
        created_at = datetime.strptime(created_at_raw, "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc).isoformat()

        return {
            "id": prediction_id,
            "squareFootage": req.squareFootage,
            "bedrooms": req.bedrooms,
            "predictedPrice": round(prediction, 2),
            "createdAt": created_at
        }
