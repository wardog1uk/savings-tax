import React, { useState } from "react";
import { PoundSterling } from "lucide-react";
import { TaxCalculatorForm } from "./components/TaxCalculatorForm";
import { TaxResults } from "./components/TaxResults";
import { calculateTax } from "./utils/taxCalculator";
import Footer from "./components/Footer";
import Disclaimer from "./components/Disclaimer";
import Header from "./components/Header";
import EmptyResults from "./components/EmptyResults";
import type { FormData, IncomeDraft, TaxCalculation } from "./types";

function enteredAmount(value: string): number | null {
  if (value === "") return 0;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export default function App() {
  const [formData, setFormData] = useState<IncomeDraft>({
    otherIncome: "",
    savingsInterest: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [results, setResults] = useState<TaxCalculation | null>(null);

  const validateForm = (data: FormData): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (data.savingsInterest < 0) {
      newErrors.savingsInterest = "Savings interest cannot be negative";
    }
    if (data.otherIncome < 0) {
      newErrors.otherIncome = "Other income cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const savingsInterest = enteredAmount(formData.savingsInterest);
    const otherIncome = enteredAmount(formData.otherIncome);
    if (savingsInterest === null || otherIncome === null) return;

    const entered: FormData = { savingsInterest, otherIncome };

    if (!validateForm(entered)) return;

    const wholePounds: FormData = {
      savingsInterest: Math.trunc(entered.savingsInterest),
      otherIncome: Math.trunc(entered.otherIncome),
    };

    setFormData({
      savingsInterest: String(wholePounds.savingsInterest),
      otherIncome: String(wholePounds.otherIncome),
    });
    setResults(
      calculateTax(wholePounds.savingsInterest, wholePounds.otherIncome),
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== "savingsInterest" && name !== "otherIncome") return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({ savingsInterest: "", otherIncome: "" });
    setErrors({});
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-12 flex-grow">
        <Header />

        <div className="grid gap-8 lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,450px] items-start">
          <div className="tab-page">
            <div className="flex items-center gap-3 mb-6">
              <PoundSterling size={24} className="text-blue-600" />
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
