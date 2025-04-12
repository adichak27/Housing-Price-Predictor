import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Prediction } from '../hooks/usePredictionHistory';
import { formatRelativeTime } from '../utils/dateUtils';

interface PredictionHistoryProps {
  predictionHistory: Prediction[];
  isLoading: boolean;
  error: string | null;
}

const tableHeaderClasses = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-white/95 backdrop-blur-sm';
const tableCellClasses = 'px-6 py-4 whitespace-nowrap text-sm';

export function PredictionHistory({ predictionHistory, isLoading, error }: PredictionHistoryProps): React.ReactElement {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto mt-12"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Prediction History
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-3 border-primary-300 border-t-primary-600 rounded-full"
            />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48 text-red-500">
            {error}
          </div>
        ) : predictionHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <svg
              className="w-12 h-12 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-lg">No predictions yet</p>
            <p className="text-sm text-gray-400">
              Make a prediction to see it here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className={tableHeaderClasses}>
                    Square Footage
                  </th>
                  <th scope="col" className={tableHeaderClasses}>
                    Bedrooms
                  </th>
                  <th scope="col" className={tableHeaderClasses}>
                    Predicted Price
                  </th>
                  <th scope="col" className={tableHeaderClasses}>
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white/50">
              {predictionHistory.map((prediction, idx) => {
                // ✅ Log the raw and parsed date for debugging
                const parsedDate = new Date(prediction.createdAt);
                console.log('🕒 createdAt raw:', prediction.createdAt, '→ parsed:', parsedDate);

                return (
                  <motion.tr
                    key={prediction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className={clsx(
                      'transition-colors duration-150',
                      idx % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30',
                      'hover:bg-primary-50/50'
                    )}
                  >
                    <td className={tableCellClasses}>
                      {prediction.squareFootage.toLocaleString()} sq ft
                    </td>
                    <td className={tableCellClasses}>
                      {prediction.bedrooms}
                    </td>
                    <td className={clsx(tableCellClasses, 'text-primary-600 font-medium')}>
                      ${prediction.predictedPrice.toLocaleString()}
                    </td>
                    <td className={clsx(tableCellClasses, 'text-gray-500')}>
                      {formatRelativeTime(prediction.createdAt)}
                    </td>
                  </motion.tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
} 