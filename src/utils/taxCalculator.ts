import { TaxCalculation, TAX_THRESHOLDS, TAX_RATES, PSA_ALLOWANCES } from '../types';

export function calculateTax(savingsInterest: number, otherIncome: number): TaxCalculation {
  const totalIncome = savingsInterest + otherIncome;
  
  // Determine tax band based on total income
  const isBasicRate = totalIncome <= TAX_THRESHOLDS.BASIC_RATE_LIMIT;
  const isHigherRate = totalIncome > TAX_THRESHOLDS.BASIC_RATE_LIMIT && totalIncome <= TAX_THRESHOLDS.HIGHER_RATE_LIMIT;
  const isAdditionalRate = totalIncome > TAX_THRESHOLDS.HIGHER_RATE_LIMIT;

  // Calculate Personal Savings Allowance
  let personalSavingsAllowance = 0;
  if (isBasicRate) personalSavingsAllowance = PSA_ALLOWANCES.BASIC;
  else if (isHigherRate) personalSavingsAllowance = PSA_ALLOWANCES.HIGHER;
  // Additional rate gets no PSA

  // Calculate Starting Rate for Savings
  let startingSavingsRate = 0;
  if (otherIncome < TAX_THRESHOLDS.PERSONAL_ALLOWANCE) {
    const availableStartingRate = Math.max(
      0,
      TAX_THRESHOLDS.STARTING_SAVINGS_RATE_LIMIT - (otherIncome - TAX_THRESHOLDS.PERSONAL_ALLOWANCE)
    );
    startingSavingsRate = Math.min(availableStartingRate, savingsInterest);
  }

  // Calculate taxable amount after allowances
  const taxableAmount = Math.max(
    0,
    savingsInterest - personalSavingsAllowance - startingSavingsRate
  );

  // Calculate tax at different rates
  let remainingTaxable = taxableAmount;
  let basicRateTax = 0;
  let higherRateTax = 0;
  let additionalRateTax = 0;

  if (isBasicRate) {
    basicRateTax = remainingTaxable * TAX_RATES.BASIC;
  } else if (isHigherRate) {
    higherRateTax = remainingTaxable * TAX_RATES.HIGHER;
  } else {
    additionalRateTax = remainingTaxable * TAX_RATES.ADDITIONAL;
  }

  return {
    personalSavingsAllowance,
    startingSavingsRate,
    taxableAmount,
    basicRateTax,
    higherRateTax,
    additionalRateTax,
    totalTaxDue: basicRateTax + higherRateTax + additionalRateTax,
  };
}