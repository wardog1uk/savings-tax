import {
  TaxBandName,
  TaxCalculation,
  TAX_THRESHOLDS,
  PERSONAL_SAVINGS_ALLOWANCE,
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

interface TaxBandAssessment {
  name: TaxBandName;
  percent: number;
  rate: number;
  personalSavingsAllowance: number;
}

function namedBand(
  name: TaxBandName,
  rate: number,
  personalSavingsAllowance: number,
): TaxBandAssessment {
  return {
    name,
    rate,
    percent: Math.round(rate * 100),
    personalSavingsAllowance,
  };
}

/**
 * Name the tax band for a total income.
 *
 * @param income - The total income
 * @returns The band name, the percent shown, the rate used for tax, and the allowance
 */
function assessTaxBand(income: number): TaxBandAssessment {
  if (income > TAX_THRESHOLDS.HIGHER_RATE_LIMIT) {
    return namedBand(
      "Additional Rate Tax Band",
      TAX_BANDS.ADDITIONAL,
      PERSONAL_SAVINGS_ALLOWANCE.ADDITIONAL,
    );
  }
  if (income > TAX_THRESHOLDS.BASIC_RATE_LIMIT) {
    return namedBand(
      "Higher Rate Tax Band",
      TAX_BANDS.HIGHER,
      PERSONAL_SAVINGS_ALLOWANCE.HIGHER,
    );
  }
  return namedBand(
    "Basic Rate Tax Band",
    TAX_BANDS.BASIC,
    PERSONAL_SAVINGS_ALLOWANCE.BASIC,
  );
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
  const taxBand = assessTaxBand(savingsIncome + otherIncome);

  const personalAllowanceUsed = Math.max(PERSONAL_ALLOWANCE - otherIncome, 0);
  const startingSavingsRate = calculateStartingRate(otherIncome);
  const personalSavingsAllowance = taxBand.personalSavingsAllowance;

  const taxableAmount = Math.max(
    savingsIncome -
      personalAllowanceUsed -
      startingSavingsRate -
      personalSavingsAllowance,
    0
  );

  return {
    personalAllowanceUsed,
    personalSavingsAllowance,
    startingSavingsRate,
    taxableAmount,
    taxBandName: taxBand.name,
    taxBandPercent: taxBand.percent,
    taxDue: taxableAmount * taxBand.rate,
  };
}
