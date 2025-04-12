
# 🏡 Housing Price Predictor

A full-stack web application that uses a simple machine learning model to predict housing prices based on square footage and number of bedrooms. Built with **React + TypeScript** on the frontend and **FastAPI + SQLite + scikit-learn** on the backend.

---

## 🚀 Features

- 🧾 Intuitive UI for entering house details
- 🧠 Real-time ML predictions using linear regression
- 📈 Backend logs every prediction with a timestamp
- 💾 Lightweight SQLite database
- ⚡ Modern stack with Vite, Tailwind, FastAPI, and scikit-learn

---

## 🧠 Tech Stack

| Frontend        | Backend         | ML + Data        | Storage      |
|-----------------|------------------|------------------|--------------|
| React + TypeScript | FastAPI (Python) | scikit-learn + joblib | SQLite       |
| Vite + Tailwind | Uvicorn          | NumPy            | sqlite3 (standard library) |

---

## 📁 Project Structure

```
housing-price-predictor/
├── backend/
│   ├── api/               # FastAPI routes (future use)
│   ├── db/                # SQLite setup
│   ├── model/             # Training script & model
│   ├── main.py            # FastAPI app entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/           # API handler (predict.ts)
│   │   └── main.tsx       # React entry point
│   └── index.html
├── .gitignore
└── README.md
```

---

## 🛠 Installation & Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/housing-price-predictor.git
cd housing-price-predictor
```

---

### 2. Backend Setup (Python + FastAPI)

#### Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate   # macOS/Linux
# OR
venv\Scripts\activate      # Windows
```

#### Install dependencies:

```bash
pip install -r backend/requirements.txt
```

#### Run the FastAPI server:

```bash
uvicorn backend.main:app --reload
```

API will be available at `http://localhost:8000`.

---

### 3. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

App will be available at `http://localhost:3000`.

---

## 🔗 API Endpoint

**POST** `/predict`  
Predict house price based on input:

### Payload:
```json
{
  "squareFootage": 2000,
  "bedrooms": 4
}
```

### Response:
```json
{
  "predictedPrice": 320000.0
}
```

---

## 🗃 Database

- Uses SQLite (`backend/db/predictions.db`) to log:
  - square footage
  - bedrooms
  - predicted price
  - timestamp

> 📝 The DB is auto-created at runtime. No setup needed.

---

## 🧪 Sample Training Data

| Square Footage | Bedrooms | Price ($) |
|----------------|----------|-----------|
| 800            | 2        | 150,000   |
| 1200           | 3        | 200,000   |
| 1500           | 3        | 250,000   |
| 1800           | 4        | 300,000   |
| 2000           | 4        | 320,000   |
| 2200           | 5        | 360,000   |
| 2400           | 4        | 380,000   |
| 2600           | 5        | 400,000   |

---
