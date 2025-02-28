import React, { useState } from "react";
import { PoundSterling } from "lucide-react";
import { TaxCalculatorForm } from "./components/TaxCalculatorForm";
import { TaxResults } from "./components/TaxResults";
import { calculateTax } from "./utils/taxCalculator";
import Footer from "./components/Footer";
import type { FormData, TaxCalculation } from "./types";
import Disclaimer from "./components/Disclaimer";
import Header from "./components/Header";
import EmptyResults from "./components/EmptyResults";

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    otherIncome: 0,
    savingsInterest: 0,
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
        <Header />

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
            {results ? <TaxResults results={results} /> : <EmptyResults />}
          </div>
        </div>

        <Disclaimer />
      </div>
      <Footer />
    </div>
  );
}
