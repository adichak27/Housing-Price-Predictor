# backend/model/train_model.py
import joblib
from sklearn.linear_model import LinearRegression
import numpy as np

# Sample training data. Sq ft and bedrooms
X = np.array([
    [800, 2],
    [1200, 3],
    [1500, 3],
    [1800, 4],
    [2000, 4],
    [2200, 5],
    [2400, 4],
    [2600, 5]
])
# Prices for each house in training data
y = np.array([150000, 200000, 250000, 300000, 320000, 360000, 380000, 400000])

# Train the model
model = LinearRegression()
model.fit(X, y)
# Save the model
joblib.dump(model, 'backend/model/model.pkl')
print("Model trained and saved successfully!")