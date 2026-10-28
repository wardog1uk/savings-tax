import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
import { calculateTax } from "../utils/taxCalculator";
import { TaxResults } from "./TaxResults";

describe("tax band from the calculation", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows Basic Rate Tax Band at 20% and tax due of £6,340.00 for £50,270 of savings and no other income", () => {
    const result = calculateTax(50270, 0);

    expect(result.taxBandName).toBe("Basic Rate Tax Band");
    expect(result.taxBandPercent).toBe(20);

    render(<TaxResults results={result} />);

    expect(screen.getByText("Basic Rate Tax Band")).toBeDefined();
    expect(screen.getByText("20%")).toBeDefined();
    expect(screen.getByText("£6,340.00")).toBeDefined();
  });

  it("shows Higher Rate Tax Band at 40% and tax due of £12,880.40 for £50,271 of savings and no other income", () => {
    const result = calculateTax(50271, 0);

    expect(result.taxBandName).toBe("Higher Rate Tax Band");
    expect(result.taxBandPercent).toBe(40);

    render(<TaxResults results={result} />);

    expect(screen.getByText("Higher Rate Tax Band")).toBeDefined();
    expect(screen.getByText("40%")).toBeDefined();
    expect(screen.getByText("£12,880.40")).toBeDefined();
  });

  it("shows Additional Rate Tax Band at 45% and tax due of £48,406.95 for £125,141 of savings and no other income", () => {
    const result = calculateTax(125141, 0);

    expect(result.taxBandName).toBe("Additional Rate Tax Band");
    expect(result.taxBandPercent).toBe(45);

    render(<TaxResults results={result} />);

    expect(screen.getByText("Additional Rate Tax Band")).toBeDefined();
    expect(screen.getByText("45%")).toBeDefined();
    expect(screen.getByText("£48,406.95")).toBeDefined();
  });

  it("keeps total income of £125,140 in the higher-rate band", () => {
    const result = calculateTax(125140, 0);

    expect(result.taxBandName).toBe("Higher Rate Tax Band");
    expect(result.taxBandPercent).toBe(40);

    render(<TaxResults results={result} />);

    expect(screen.getByText("Higher Rate Tax Band")).toBeDefined();
    expect(screen.getByText("40%")).toBeDefined();
  });

  it("shows the calculated basic-rate band after the person enters £50,270 of savings and no other income", () => {
    render(<App />);

    const [savingsInterest, otherIncome] = screen.getAllByRole("textbox");
    fireEvent.change(savingsInterest, { target: { value: "50270" } });
    fireEvent.change(otherIncome, { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(screen.getByText("Basic Rate Tax Band")).toBeDefined();
    expect(screen.getByText("20%")).toBeDefined();
    expect(screen.getByText("£6,340.00")).toBeDefined();
  });
});

function amountOnRow(label: string): string {
  const row = screen.getByText(label).closest(".result");
  const amount = row?.querySelector(".font-medium")?.textContent;
  if (!amount) {
    throw new Error(`${label} amount missing`);
  }
  return amount;
}

describe("personal allowance used against savings", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows Personal Allowance used of £2,570.00, the savings allowances, taxable savings of £11,430.00, and tax due of £2,286.00 for £20,000 of savings and £10,000 of other income", () => {
    const result = calculateTax(20000, 10000);

    expect(result.personalAllowanceUsed).toBe(2570);
    expect(result.startingSavingsRate).toBe(5000);
    expect(result.personalSavingsAllowance).toBe(1000);
    expect(result.taxableAmount).toBe(11430);
    expect(result.taxDue).toBe(2286);

    render(<TaxResults results={result} />);

    expect(amountOnRow("Personal Allowance used")).toBe("£2,570.00");
    expect(amountOnRow("Starting Rate for Savings")).toBe("£5,000.00");
    expect(amountOnRow("Personal Savings Allowance")).toBe("£1,000.00");
    expect(amountOnRow("Taxable Savings Amount")).toBe("£11,430.00");
    expect(screen.getByText("Tax Due on Savings").nextElementSibling?.textContent).toBe(
      "£2,286.00",
    );
  });

  it("shows Personal Allowance used of £0.00, the savings allowances, taxable savings of £14,000.00, and tax due of £2,800.00 for £20,000 of savings and £12,570 of other income", () => {
    const result = calculateTax(20000, 12570);

    expect(result.personalAllowanceUsed).toBe(0);
    expect(result.startingSavingsRate).toBe(5000);
    expect(result.personalSavingsAllowance).toBe(1000);
    expect(result.taxableAmount).toBe(14000);
    expect(result.taxDue).toBe(2800);

    render(<TaxResults results={result} />);

    expect(amountOnRow("Personal Allowance used")).toBe("£0.00");
    expect(amountOnRow("Starting Rate for Savings")).toBe("£5,000.00");
    expect(amountOnRow("Personal Savings Allowance")).toBe("£1,000.00");
    expect(amountOnRow("Taxable Savings Amount")).toBe("£14,000.00");
    expect(screen.getByText("Tax Due on Savings").nextElementSibling?.textContent).toBe(
      "£2,800.00",
    );
  });

  it("shows the unused Personal Allowance and taxable savings of £0.00 when savings interest is below the allowances", () => {
    const result = calculateTax(100, 10000);

    expect(result.personalAllowanceUsed).toBe(2570);
    expect(result.startingSavingsRate).toBe(5000);
    expect(result.personalSavingsAllowance).toBe(1000);
    expect(result.taxableAmount).toBe(0);
    expect(result.taxDue).toBe(0);

    render(<TaxResults results={result} />);

    expect(amountOnRow("Personal Allowance used")).toBe("£2,570.00");
    expect(amountOnRow("Taxable Savings Amount")).toBe("£0.00");
    expect(screen.getByText("Tax Due on Savings").nextElementSibling?.textContent).toBe(
      "£0.00",
    );
  });
});
