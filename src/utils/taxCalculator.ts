import {
  TaxCalculation,
  TAX_THRESHOLDS,
  PSA_ALLOWANCES,
  TAX_BANDS,
  STARTING_SAVINGS_RATE_LIMIT,
  PERSONAL_ALLOWANCE,
} from "../types";

/**
 * Calculate the starting savings rate
 *
 * @param otherIncome - Income not from interest on savings
 * @returns The starting savings rate
 */
function calculateStartingRate(otherIncome: number): number {
  return otherIncome > PERSONAL_ALLOWANCE
    ? Math.max(
        PERSONAL_ALLOWANCE + STARTING_SAVINGS_RATE_LIMIT - otherIncome,
        0
      )
    : STARTING_SAVINGS_RATE_LIMIT;
}

/**
 * Get the tax band from the total income
 *
 * @param income - The total income
 * @returns The tax band
 * */
function getTaxBand(income: number): number {
  if (income > TAX_THRESHOLDS.HIGHER_RATE_LIMIT) return TAX_BANDS.ADDITIONAL;
  if (income > TAX_THRESHOLDS.BASIC_RATE_LIMIT) return TAX_BANDS.HIGHER;
  return TAX_BANDS.BASIC;
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
  const remaining = Math.max(PERSONAL_ALLOWANCE - otherIncome, 0);

  // Get the starting savings rate
  const startingSavingsRate = calculateStartingRate(otherIncome);

  // Get the personal savings allowance
  const personalSavingsAllowance =
    taxBand === TAX_BANDS.ADDITIONAL
      ? PSA_ALLOWANCES.ADDITIONAL
      : taxBand === TAX_BANDS.HIGHER
      ? PSA_ALLOWANCES.HIGHER
      : PSA_ALLOWANCES.BASIC;

  // Calculate the taxable amount
  const taxableAmount = Math.max(
    savingsIncome - remaining - startingSavingsRate - personalSavingsAllowance,
    0
  );

  return {
    personalSavingsAllowance,
    startingSavingsRate,
    taxableAmount,
    taxBand,
    taxDue: taxableAmount * taxBand,
  };
}
