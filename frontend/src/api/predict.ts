import { Prediction } from "../hooks/usePredictionHistory";

export async function predictPrice(squareFootage: number, bedrooms: number): Promise<Prediction> {
  const response = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ squareFootage, bedrooms }),
  });

  if (!response.ok) throw new Error("Prediction failed");
  const data = await response.json();

  return {
    ...data,
    squareFootage,
    bedrooms,
  }; // returns { id, predictedPrice, createdAt, squareFootage, bedrooms }
}
