import React from "react";
import { Info } from "lucide-react";
import type { IncomeDraft } from "../types";

const NUMBER_DRAFT = /^(?:-)?(?:\d+\.?\d*|\.\d*)?$/;

interface TaxCalculatorFormProps {
  formData: IncomeDraft;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  errors: Partial<Record<keyof IncomeDraft, string>>;
}

export function TaxCalculatorForm({
  formData,
  onSubmit,
  onChange,
  onReset,
  errors,
}: TaxCalculatorFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!NUMBER_DRAFT.test(e.target.value)) return;
    onChange(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            Savings Income (£)
            <div className="group relative">
              <Info className="info-icon" />
              <div className="info-box">
                Total interest earned from all savings accounts during the tax
                year
              </div>
            </div>
          </div>
        </label>
        <input
          type="text"
          inputMode="decimal"
          name="savingsInterest"
          value={formData.savingsInterest}
          onChange={handleInputChange}
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
              <Info className="info-icon" />
              <div className="info-box">
                Total income from other sources like salary, pensions, etc.
              </div>
            </div>
          </div>
        </label>
        <input
          type="text"
          inputMode="decimal"
          name="otherIncome"
          value={formData.otherIncome}
          onChange={handleInputChange}
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
          Calculate
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
