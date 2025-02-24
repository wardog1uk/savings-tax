import { TaxCalculation, TAX_THRESHOLDS, TAX_RATES, PSA_ALLOWANCES } from '../types';

// Calculate the starting savings rate
export function calculateStartingRate(otherIncome: number): number {
  if (otherIncome > TAX_THRESHOLDS.PERSONAL_ALLOWANCE) {
    return Math.max(TAX_THRESHOLDS.PERSONAL_ALLOWANCE + TAX_THRESHOLDS.STARTING_SAVINGS_RATE_LIMIT - otherIncome, 0);
  }

  return TAX_THRESHOLDS.STARTING_SAVINGS_RATE_LIMIT;
}

// Calculate the tax on savings income given the other income
export function calculateTax(savingsIncome: number, otherIncome: number): TaxCalculation {
  // Calculate how much of the personal savings allowance is remaining
  let remaining = Math.max(TAX_THRESHOLDS.PERSONAL_ALLOWANCE - otherIncome, 0);

  // Get the starting savings rate
  let rate = calculateStartingRate(otherIncome);

  // Set the personal savings allowance
  let allowance = PSA_ALLOWANCES.BASIC;

  // Calculate the taxable amount
  let taxableAmount = Math.max(savingsIncome - remaining - rate - allowance, 0);

  // Calculate the tax due
  let basicRateTax = taxableAmount * TAX_RATES.BASIC;
  let higherRateTax = 0;
  let additionalRateTax= 0;

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