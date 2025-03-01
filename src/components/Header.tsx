import { Calculator } from "lucide-react";

export default function Header() {
  return (
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
  );
}
