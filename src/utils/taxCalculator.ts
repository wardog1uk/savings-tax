import { TaxCalculation, TAX_THRESHOLDS, TAX_RATES, PSA_ALLOWANCES } from '../types';

export function calculateTax(savingsInterest: number, otherIncome: number): TaxCalculation {
  let remainingSavings = savingsInterest;
  let remainingPersonalAllowance = TAX_THRESHOLDS.PERSONAL_ALLOWANCE - otherIncome;

  // Apply Personal Allowance first
  if (remainingPersonalAllowance > 0) {
    const allowanceUsed = Math.min(remainingPersonalAllowance, remainingSavings);
    remainingSavings -= allowanceUsed;
  }

  // Calculate Starting Rate for Savings
  let startingSavingsRate = 0;
  if (otherIncome < TAX_THRESHOLDS.PERSONAL_ALLOWANCE) {
    const availableStartingRate = Math.min(TAX_THRESHOLDS.STARTING_SAVINGS_RATE_LIMIT, remainingSavings);
    startingSavingsRate = availableStartingRate;
    remainingSavings -= availableStartingRate;
  }

  // Determine tax band based on total income
  const totalIncome = savingsInterest + otherIncome;
  const isBasicRate = totalIncome <= TAX_THRESHOLDS.BASIC_RATE_LIMIT;
  const isHigherRate = totalIncome > TAX_THRESHOLDS.BASIC_RATE_LIMIT && totalIncome <= TAX_THRESHOLDS.HIGHER_RATE_LIMIT;

  // Calculate Personal Savings Allowance
  let personalSavingsAllowance = 0;
  if (isBasicRate) personalSavingsAllowance = PSA_ALLOWANCES.BASIC;
  else if (isHigherRate) personalSavingsAllowance = PSA_ALLOWANCES.HIGHER;

  const psaUsed = Math.min(personalSavingsAllowance, remainingSavings);
  remainingSavings -= psaUsed;

  // Calculate taxable amount after allowances
  const taxableAmount = remainingSavings;

  // Calculate tax at different rates
  let basicRateTax = 0;
  let higherRateTax = 0;
  let additionalRateTax = 0;
  let remainingTaxable = taxableAmount;

  if (remainingTaxable > 0) {
    const basicRateLimit = TAX_THRESHOLDS.BASIC_RATE_LIMIT - otherIncome;
    if (remainingTaxable > basicRateLimit) {
      basicRateTax = basicRateLimit * TAX_RATES.BASIC;
      remainingTaxable -= basicRateLimit;
    } else {
      basicRateTax = remainingTaxable * TAX_RATES.BASIC;
      remainingTaxable = 0;
    }
  }

  if (remainingTaxable > 0) {
    const higherRateLimit = TAX_THRESHOLDS.HIGHER_RATE_LIMIT - TAX_THRESHOLDS.BASIC_RATE_LIMIT;
    if (remainingTaxable > higherRateLimit) {
      higherRateTax = higherRateLimit * TAX_RATES.HIGHER;
      remainingTaxable -= higherRateLimit;
    } else {
      higherRateTax = remainingTaxable * TAX_RATES.HIGHER;
      remainingTaxable = 0;
    }
  }

  if (remainingTaxable > 0) {
    additionalRateTax = remainingTaxable * TAX_RATES.ADDITIONAL;
  }

  return {
    personalSavingsAllowance: psaUsed,
    startingSavingsRate,
    taxableAmount,
    basicRateTax,
    higherRateTax,
    additionalRateTax,
    totalTaxDue: basicRateTax + higherRateTax + additionalRateTax,
  };
}