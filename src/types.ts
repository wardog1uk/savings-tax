export interface TaxCalculation {
  personalSavingsAllowance: number;
  startingSavingsRate: number;
  taxableAmount: number;
  taxBand: number;
  taxRate: number;
  taxDue: number;
}

export interface FormData {
  savingsInterest: number;
  otherIncome: number;
}

// 2024/2025 tax year thresholds
export const TAX_THRESHOLDS = {
  PERSONAL_ALLOWANCE: 12570,
  BASIC_RATE_LIMIT: 50270,
  HIGHER_RATE_LIMIT: 125140,
  STARTING_SAVINGS_RATE_LIMIT: 5000,
} as const;

export const TAX_RATES = {
  BASIC: 0.2,
  HIGHER: 0.4,
  ADDITIONAL: 0.45,
} as const;

export const PSA_ALLOWANCES = {
  BASIC: 1000,
  HIGHER: 500,
  ADDITIONAL: 0,
} as const;

export const TAX_BANDS = {
  BASIC: 0,
  HIGHER: 1,
  ADDITIONAL: 2,
};
