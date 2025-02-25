import { TaxCalculation } from "../types";

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
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Tax Calculation Results
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-600">Personal Savings Allowance:</span>
          <span className="font-medium">
            {formatCurrency(results.personalSavingsAllowance)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-600">Starting Rate for Savings:</span>
          <span className="font-medium">
            {formatCurrency(results.startingSavingsRate)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-600">Taxable Amount:</span>
          <span className="font-medium">
            {formatCurrency(results.taxableAmount)}
          </span>
        </div>

        {results.basicRateTax > 0 && (
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Basic Rate Tax (20%):</span>
            <span className="font-medium">
              {formatCurrency(results.basicRateTax)}
            </span>
          </div>
        )}

        {results.higherRateTax > 0 && (
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Higher Rate Tax (40%):</span>
            <span className="font-medium">
              {formatCurrency(results.higherRateTax)}
            </span>
          </div>
        )}

        {results.additionalRateTax > 0 && (
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Additional Rate Tax (45%):</span>
            <span className="font-medium">
              {formatCurrency(results.additionalRateTax)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-3 border-t-2 border-blue-500">
          <span className="text-lg font-semibold text-gray-800">
            Total Tax Due:
          </span>
          <span className="text-lg font-bold text-blue-600">
            {formatCurrency(results.totalTaxDue)}
          </span>
        </div>
      </div>
    </div>
  );
}
