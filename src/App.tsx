import React, { useState } from "react";
import { Calculator } from "lucide-react";
import { TaxCalculatorForm } from "./components/TaxCalculatorForm";
import { TaxResults } from "./components/TaxResults";
import { calculateTax } from "./utils/taxCalculator";
import type { FormData, TaxCalculation } from "./types";

function App() {
  const [formData, setFormData] = useState<FormData>({
    savingsInterest: 0,
    otherIncome: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [results, setResults] = useState<TaxCalculation | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (formData.savingsInterest < 0) {
      newErrors.savingsInterest = "Savings interest cannot be negative";
    }
    if (formData.otherIncome < 0) {
      newErrors.otherIncome = "Other income cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const taxResults = calculateTax(
        formData.savingsInterest,
        formData.otherIncome
      );
      setResults(taxResults);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleReset = () => {
    setFormData({ savingsInterest: 0, otherIncome: 0 });
    setErrors({});
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              UK Savings Tax Calculator
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your savings tax liability based on current UK tax rules.
            Enter your total savings interest and other income to get a detailed
            breakdown.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <TaxCalculatorForm
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onReset={handleReset}
            errors={errors}
          />
        </div>

        {results && (
          <div className="mt-8">
            <TaxResults results={results} />
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p className="text-center">
            Disclaimer: This calculator is for informational purposes only and
            should not be considered as financial advice. Tax rules and
            thresholds may change. Please consult with a qualified tax
            professional for specific advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
