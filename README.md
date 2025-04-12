# Housing Price Predictor

A full-stack application that predicts housing prices using machine learning. The project consists of a React frontend built with Vite and a Python backend using FastAPI.

## Project Structure

```
housing-price-predictor/
├── backend/               # Python FastAPI backend
│   ├── main.py           # FastAPI application entry point
│   ├── api/              # API routes
│   ├── model/            # ML model training and prediction
│   ├── db/               # Database setup and operations
│   └── requirements.txt  # Python dependencies
│
└── frontend/             # React frontend
    ├── index.html        # Entry HTML file
    ├── src/              # Source code
    └── vite.config.js    # Vite configuration
```

## Setup

### Backend Setup
1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

## Features
- Machine learning model for housing price prediction
- React-based user interface
- FastAPI backend with SQLite logging
- Real-time price predictions

## Technologies Used
- Frontend: React, Vite
- Backend: Python, FastAPI
- Database: SQLite
- ML: scikit-learn