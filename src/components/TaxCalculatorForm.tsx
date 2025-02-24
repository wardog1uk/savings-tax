import React from 'react';
import { Info } from 'lucide-react';
import { FormData } from '../types';

interface Props {
  formData: FormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export function TaxCalculatorForm({ formData, onSubmit, onChange, onReset, errors }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            Savings Interest (£)
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded shadow-lg w-64">
                Total interest earned from all savings accounts during the tax year
              </div>
            </div>
          </div>
        </label>
        <input
          type="number"
          name="savingsInterest"
          value={formData.savingsInterest}
          onChange={onChange}
          min="0"
          step="0.01"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
            errors.savingsInterest ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.savingsInterest && (
          <p className="mt-1 text-sm text-red-600">{errors.savingsInterest}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            Other Income (£)
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded shadow-lg w-64">
                Total income from other sources like salary, pensions, etc.
              </div>
            </div>
          </div>
        </label>
        <input
          type="number"
          name="otherIncome"
          value={formData.otherIncome}
          onChange={onChange}
          min="0"
          step="0.01"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
            errors.otherIncome ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.otherIncome && (
          <p className="mt-1 text-sm text-red-600">{errors.otherIncome}</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Calculate Tax
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Reset
        </button>
      </div>
    </form>
  );
}