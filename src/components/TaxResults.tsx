import { TAX_BANDS, TaxCalculation } from "../types";
import { CheckCircle, Info } from "lucide-react";

interface TaxResultsProps {
  results: TaxCalculation;
}

export function TaxResults({ results }: TaxResultsProps) {
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
        <div className="flex justify-between py-3 border-b border-gray-100">
          <span className="flex-1 text-gray-600">
            <div className="flex items-center gap-2">
              Personal Savings Allowance
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded-lg shadow-lg w-64 z-10">
                  Amount of interest you can earn on savings without paying tax.
                </div>
              </div>
            </div>
          </span>
          <span className="font-medium text-right">
            {formatCurrency(results.personalSavingsAllowance)}
          </span>
        </div>

        <div className="flex justify-between py-3 border-b border-gray-100">
          <span className="flex-1 text-gray-600">
            <div className="flex items-center gap-2">
              Starting Rate for Savings
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded-lg shadow-lg w-64 z-10">
                  Additional tax-free allowance.
                </div>
              </div>
            </div>
          </span>
          <span className="font-medium text-right">
            {formatCurrency(results.startingSavingsRate)}
          </span>
        </div>

        <div className="flex justify-between py-3 border-b border-gray-100">
          <span className="flex-1 text-gray-600">Taxable Savings Amount</span>
          <span className="font-medium text-right">
            {formatCurrency(results.taxableAmount)}
          </span>
        </div>

        <div className="flex justify-between py-3 border-b border-gray-100">
          <span className="flex-1 text-gray-600">
            {results.taxBand === TAX_BANDS.BASIC
              ? "Basic Rate Tax Band"
              : results.taxBand === TAX_BANDS.HIGHER
              ? "Higher Rate Tax Band"
              : "Additional Rate Tax Band"}
          </span>
          <span className="font-medium text-right">
            {results.taxBand * 100}%
          </span>
        </div>

        <div className="flex justify-between py-4 mt-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-4">
          <span className="flex-1 text-lg font-semibold text-gray-800">
            Tax Due on Savings
          </span>
          <span className="text-lg font-bold text-blue-600 text-right">
            {formatCurrency(results.taxDue)}
          </span>
        </div>
      </div>
    </div>
  );
}
