export async function predictPrice(squareFootage: number, bedrooms: number): Promise<number> {
  const response = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ squareFootage, bedrooms }),
  });

  const data = await response.json();
  return data.predictedPrice;
}
