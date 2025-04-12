import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { predictPrice } from '../api/predict';
import { Prediction } from '../hooks/usePredictionHistory';

interface FormData {
  squareFootage: number;
  bedrooms: number;
}
const maxSquareFootage = 100000;
const maxBedrooms = 20;
const labelClasses = 'absolute left-3 transition-all duration-200 pointer-events-none text-gray-500';
const activeLabelClasses = '-top-6 left-0 text-sm text-primary-600';
const inactiveLabelClasses = 'top-2 left-4';
const inputClasses =
  'w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 placeholder:shadow-none';

  interface PriceFormProps {
    setPredictionHistory: React.Dispatch<React.SetStateAction<Prediction[]>>;
  }

export function PriceForm({ setPredictionHistory }: PriceFormProps): React.ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    squareFootage: 0,
    bedrooms: 0
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});


  const validateForm = (data: FormData): boolean => {
    console.log('Validating form...');
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (data.squareFootage < 100) {
      newErrors.squareFootage = 'Square footage must be at least 100';
    } else if (data.squareFootage > maxSquareFootage) {
      newErrors.squareFootage = 'Square footage must be less than ' + maxSquareFootage;
    }

    if (data.bedrooms < 1) {
      newErrors.bedrooms = 'Must have at least 1 bedroom';
    } else if (data.bedrooms > maxBedrooms) {
      newErrors.bedrooms = 'Must have less than ' + maxBedrooms + ' bedrooms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(null); // Reset price when input changes
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formData)) return;

    try {
      console.log('Submitting form...');
      setIsSubmitting(true);
      // API call
      const newPrediction = await predictPrice(formData.squareFootage, formData.bedrooms);
      console.log('Price:', newPrediction.predictedPrice);

      setPrice(newPrediction.predictedPrice); 
      setPredictionHistory(prev => [newPrediction, ...prev]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Predict Housing Price
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="squareFootage"
              className={clsx(
                labelClasses,
                formData.squareFootage > 0 ? activeLabelClasses : inactiveLabelClasses
              )}
            >
              Square Footage
            </label>
            <input
              type="number"
              id="squareFootage"
              name="squareFootage"
              value={formData.squareFootage || ''}
              onChange={handleInputChange}
              min="100"
              max={maxSquareFootage}
              className={clsx(inputClasses, {
                'border-red-500 focus:ring-red-400': errors.squareFootage,
              })}
              //placeholder="Enter square footage"
            />
            {errors.squareFootage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.squareFootage}
              </motion.p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="bedrooms"
              className={clsx(
                labelClasses,
                formData.bedrooms > 0 ? activeLabelClasses : inactiveLabelClasses
              )}
            >
              Number of Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms || ''}
              onChange={handleInputChange}
              min="1"
              max={maxBedrooms}
              className={clsx(inputClasses, {
                'border-red-500 focus:ring-red-400': errors.bedrooms,
              })}
              //placeholder="Enter number of bedrooms"
            />
            {errors.bedrooms && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.bedrooms}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              'w-full py-3 px-6 rounded-lg text-white font-medium',
              'bg-gradient-to-r from-primary-500 to-secondary-500',
              'transform transition-all duration-200',
              'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              </div>
            ) : (
              'Get Price Prediction'
            )}
          </motion.button>
        </form>

        {price !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 rounded-lg text-center"
          >
            <p className="text-green-800 font-medium">
              Estimated Price: ${price.toLocaleString()}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 