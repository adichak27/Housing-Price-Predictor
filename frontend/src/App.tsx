import React from 'react';
import { PriceForm } from './components/PriceForm';
import { PredictionHistory } from './components/PredictionHistory';
import { usePredictionHistory } from './hooks/usePredictionHistory';


export function App(): React.ReactElement {
  const { predictionHistory, setPredictionHistory, isLoading, error } = usePredictionHistory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Housing Price Predictor
          </h1>
          <p className="text-lg text-gray-600">
            Enter your property details to get an estimated price
          </p>
        </header>
        
        <main className="space-y-12">
          <PriceForm setPredictionHistory={setPredictionHistory}/>
          <PredictionHistory 
            predictionHistory={predictionHistory}
            isLoading={isLoading}
            error={error}
          />
        </main>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Housing Price Predictor. All rights reserved.
        </footer>
      </div>
    </div>
  );
} 