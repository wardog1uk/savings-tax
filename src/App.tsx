import React, { useState } from "react";
import { Calculator, PoundSterling, ClipboardList } from "lucide-react";
import { TaxCalculatorForm } from "./components/TaxCalculatorForm";
import { TaxResults } from "./components/TaxResults";
import { calculateTax } from "./utils/taxCalculator";
import Footer from "./components/Footer";
import type { FormData, TaxCalculation } from "./types";
import Disclaimer from "./components/Disclaimer";

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
        formData.savingsInterest || 0,
        formData.otherIncome || 0
      );
      setResults(taxResults);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : parseFloat(value),
    }));
  };

  const handleReset = () => {
    setFormData({ savingsInterest: 0, otherIncome: 0 });
    setErrors({});
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <Calculator className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UK Savings Tax Calculator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Calculate your savings tax liability based on current UK tax rules.
            <br />
            Enter your income details below to get a breakdown of your tax
            obligations.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,450px] items-start">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <PoundSterling className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Enter Your Income
              </h2>
            </div>
            <TaxCalculatorForm
              formData={formData}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onReset={handleReset}
              errors={errors}
            />
          </div>

          <div className="h-full">
            {results ? (
              <TaxResults results={results} />
            ) : (
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                  <ClipboardList className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Your Tax Calculation Results
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Enter your income details and click "Calculate" to see your
                  tax breakdown here
                </p>
              </div>
            )}
          </div>
        </div>

        <Disclaimer />
      </div>
      <Footer />
    </div>
  );
}

export default App;
