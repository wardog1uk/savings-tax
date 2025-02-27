import { TAX_BANDS, TaxCalculation } from "../types";
import { CheckCircle } from "lucide-react";

interface Props {
  results: TaxCalculation;
}

export function TaxResults({ results }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6 h-full">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <CheckCircle className="h-6 w-6 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-800">
          Tax Calculation Results
        </h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
          <span className="text-gray-600">Personal Savings Allowance</span>
          <span className="font-medium text-right">
            {formatCurrency(results.personalSavingsAllowance)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
          <span className="text-gray-600">Starting Rate for Savings</span>
          <span className="font-medium text-right">
            {formatCurrency(results.startingSavingsRate)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
          <span className="text-gray-600">Taxable Amount</span>
          <span className="font-medium text-right">
            {formatCurrency(results.taxableAmount)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
          <span className="text-gray-600">
            {results.taxBand === TAX_BANDS.BASIC
              ? "Basic Rate Tax Band"
              : results.taxBand === TAX_BANDS.HIGHER
              ? "Higher Rate Tax Band"
              : "Additional Rate Tax Band"}
          </span>
          <span className="font-medium text-right">
            {results.taxRate * 100}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 mt-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-4">
          <span className="text-lg font-semibold text-gray-800">
            Total Tax Due
          </span>
          <span className="text-lg font-bold text-blue-600 text-right">
            {formatCurrency(results.taxDue)}
          </span>
        </div>
      </div>
    </div>
  );
}
