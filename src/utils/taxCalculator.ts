import {
  TaxCalculation,
  TAX_THRESHOLDS,
  TAX_RATES,
  PSA_ALLOWANCES,
  TAX_BANDS,
} from "../types";

/**
 * Calculate the starting savings rate
 *
 * @param otherIncome - Income not from interest on savings
 * @returns The starting savings rate
 */
function calculateStartingRate(otherIncome: number): number {
  return otherIncome > TAX_THRESHOLDS.PERSONAL_ALLOWANCE
    ? Math.max(
        TAX_THRESHOLDS.PERSONAL_ALLOWANCE +
          TAX_THRESHOLDS.STARTING_SAVINGS_RATE_LIMIT -
          otherIncome,
        0
      )
    : TAX_THRESHOLDS.STARTING_SAVINGS_RATE_LIMIT;
}

/**
 * Get the tax band from the total income
 *
 * @param income - The total income
 * @returns The tax band
 * */
function getTaxBand(income: number): number {
  return income > TAX_THRESHOLDS.HIGHER_RATE_LIMIT
    ? TAX_BANDS.ADDITIONAL
    : income > TAX_THRESHOLDS.BASIC_RATE_LIMIT
    ? TAX_BANDS.HIGHER
    : TAX_BANDS.BASIC;
}

/**
 * Calculate the tax on savings income given the other income
 *
 * @param savingsIncome - Income from interest on savings
 * @param otherIncome - Income not from interest on savings
 * @returns The TaxCalculation object
 */
export function calculateTax(
  savingsIncome: number,
  otherIncome: number
): TaxCalculation {
  const taxBand = getTaxBand(savingsIncome + otherIncome);

  // Calculate how much of the personal savings allowance is remaining
  const remaining = Math.max(
    TAX_THRESHOLDS.PERSONAL_ALLOWANCE - otherIncome,
    0
  );

  // Get the starting savings rate
  const rate = calculateStartingRate(otherIncome);

  // Get the personal savings allowance
  const allowance =
    taxBand === TAX_BANDS.ADDITIONAL
      ? PSA_ALLOWANCES.ADDITIONAL
      : taxBand === TAX_BANDS.HIGHER
      ? PSA_ALLOWANCES.HIGHER
      : PSA_ALLOWANCES.BASIC;

  // Calculate the taxable amount
  const taxableAmount = Math.max(
    savingsIncome - remaining - rate - allowance,
    0
  );

  const basicRateTax =
    taxBand === TAX_BANDS.BASIC ? taxableAmount * TAX_RATES.BASIC : 0;

  const higherRateTax =
    taxBand === TAX_BANDS.HIGHER ? taxableAmount * TAX_RATES.HIGHER : 0;

  const additionalRateTax =
    taxBand === TAX_BANDS.ADDITIONAL ? taxableAmount * TAX_RATES.ADDITIONAL : 0;

  return {
    personalSavingsAllowance: allowance,
    startingSavingsRate: rate,
    taxableAmount,
    basicRateTax,
    higherRateTax,
    additionalRateTax,
    totalTaxDue: basicRateTax + higherRateTax + additionalRateTax,
  };
}
