# backend/main.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import sqlite3

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 👇 Add this middleware config before defining any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = joblib.load("backend/model/model.pkl")

# SQLite setup 
conn = sqlite3.connect("backend/db/predictions.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    square_footage INTEGER,
    bedrooms INTEGER,
    predicted_price REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)''')
conn.commit()

class PredictionRequest(BaseModel):
    squareFootage: int
    bedrooms: int

@app.post("/predict")
def predict(req: PredictionRequest):
    features = np.array([[req.squareFootage, req.bedrooms]])
    prediction = model.predict(features)[0]

    # Log to SQLite
    cursor.execute(
        "INSERT INTO predictions (square_footage, bedrooms, predicted_price) VALUES (?, ?, ?)",
        (req.squareFootage, req.bedrooms, prediction)
    )
    conn.commit()

    # Fetch all rows and print
    # cursor.execute("SELECT * FROM predictions")
    # rows = cursor.fetchall()
    # for row in rows:
    #    print(row)


    return {"predictedPrice": round(prediction, 2)}
