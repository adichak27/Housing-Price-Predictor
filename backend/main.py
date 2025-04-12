# backend/main.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import sqlite3

app = FastAPI()
model = joblib.load("backend/model/model.pkl")

# SQLite setup 
conn = sqlite3.connect("backend/db/predictions.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    square_footage INTEGER,
    bedrooms INTEGER,
    predicted_price REAL
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

    return {"predictedPrice": round(prediction, 2)}
