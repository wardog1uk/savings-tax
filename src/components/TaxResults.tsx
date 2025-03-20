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
    <div className="tab-page">
      <div className="flex items-center gap-3 pb-4">
        <CheckCircle size={24} className="text-green-500" />
        <h2 className="text-xl font-semibold text-gray-800">
          Tax Calculation Results
        </h2>
      </div>

      <div className="space-y-4 text-gray-600">
        <div className="result">
          <span className="flex-1">
            <div className="flex items-center gap-2">
              Personal Savings Allowance
              <div className="group relative">
                <Info className="info-icon" />
                <div className="info-box">
                  Amount of interest you can earn on savings without paying tax.
                </div>
              </div>
            </div>
          </span>
          <span className="font-medium text-right">
            {formatCurrency(results.personalSavingsAllowance)}
          </span>
        </div>

        <div className="result">
          <span className="flex-1">
            <div className="flex items-center gap-2">
              Starting Rate for Savings
              <div className="group relative">
                <Info className="info-icon" />
                <div className="info-box">Additional tax-free allowance.</div>
              </div>
            </div>
          </span>
          <span className="font-medium text-right">
            {formatCurrency(results.startingSavingsRate)}
          </span>
        </div>

        <div className="result">
          <span className="flex-1">Taxable Savings Amount</span>
          <span className="font-medium text-right">
            {formatCurrency(results.taxableAmount)}
          </span>
        </div>

        <div className="result">
          <span className="flex-1">
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

        <div className="flex justify-between py-4 mt-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-4 font-semibold">
          <span className="flex-1 text-lg text-gray-800">
            Tax Due on Savings
          </span>
          <span className="text-lg text-blue-800 text-right">
            {formatCurrency(results.taxDue)}
          </span>
        </div>
      </div>
    </div>
  );
}
