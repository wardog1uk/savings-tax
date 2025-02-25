import React from "react";
import { Info } from "lucide-react";
import { FormData } from "../types";

interface Props {
  formData: FormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export function TaxCalculatorForm({
  formData,
  onSubmit,
  onChange,
  onReset,
  errors,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            Savings Income (£)
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded-lg shadow-lg w-64 z-10">
                Total interest earned from all savings accounts during the tax
                year
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
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.savingsInterest ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="0.00"
        />
        {errors.savingsInterest && (
          <p className="mt-2 text-sm text-red-600">{errors.savingsInterest}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            Other Income (£)
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded-lg shadow-lg w-64 z-10">
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
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.otherIncome ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="0.00"
        />
        {errors.otherIncome && (
          <p className="mt-2 text-sm text-red-600">{errors.otherIncome}</p>
        )}
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Calculate Tax
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
