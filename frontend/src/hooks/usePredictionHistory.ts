import { useState, useEffect } from 'react';

export interface Prediction {
  id: number;
  squareFootage: number;
  bedrooms: number;
  predictedPrice: number;
  createdAt: string;
}

export function usePredictionHistory() {
  const [predictionHistory, setPredictionHistory] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/history');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: Prediction[] = await response.json();
      setPredictionHistory(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load prediction history');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {predictionHistory, setPredictionHistory, isLoading, error };
}