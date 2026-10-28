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

    const [savingsInterest, otherIncome] = screen.getAllByRole("spinbutton");
    fireEvent.change(savingsInterest, { target: { value: "50270" } });
    fireEvent.change(otherIncome, { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(screen.getByText("Basic Rate Tax Band")).toBeDefined();
    expect(screen.getByText("20%")).toBeDefined();
    expect(screen.getByText("£6,340.00")).toBeDefined();
  });
});
