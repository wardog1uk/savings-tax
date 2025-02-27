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

  const taxRate =
    taxBand === TAX_BANDS.BASIC
      ? TAX_RATES.BASIC
      : taxBand === TAX_BANDS.HIGHER
      ? TAX_RATES.HIGHER
      : TAX_RATES.ADDITIONAL;

  return {
    personalSavingsAllowance,
    startingSavingsRate,
    taxableAmount,
    taxBand,
    taxRate,
    taxDue: taxableAmount * taxRate,
  };
}
