import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

function incomeFields() {
  const [savingsInterest, otherIncome] = screen.getAllByRole("textbox");
  return {
    savingsInterest: savingsInterest as HTMLInputElement,
    otherIncome: otherIncome as HTMLInputElement,
  };
}

function taxDue(): string {
  const amount = screen.getByText("Tax Due on Savings").nextElementSibling;
  if (!amount?.textContent) {
    throw new Error("Tax due amount missing");
  }
  return amount.textContent;
}

describe("calculate the pounds the person submitted", () => {
  afterEach(() => {
    cleanup();
  });

  it("truncates £1,001.90 of savings interest and £20,000.40 of other income to whole pounds and taxes those pounds", () => {
    render(<App />);
    const { savingsInterest, otherIncome } = incomeFields();

    fireEvent.change(savingsInterest, { target: { value: "1001.90" } });
    fireEvent.change(otherIncome, { target: { value: "20000.40" } });
    expect(savingsInterest.value).toBe("1001.90");
    expect(otherIncome.value).toBe("20000.40");

    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(savingsInterest.value).toBe("1001");
    expect(otherIncome.value).toBe("20000");
    expect(taxDue()).toBe("£0.20");
  });

  it("treats cleared fields as zero and shows tax due of £0.00", () => {
    render(<App />);
    const { savingsInterest, otherIncome } = incomeFields();

    fireEvent.change(savingsInterest, { target: { value: "1001.90" } });
    fireEvent.change(otherIncome, { target: { value: "20000.40" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    fireEvent.change(savingsInterest, { target: { value: "" } });
    fireEvent.change(otherIncome, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(screen.queryByText("Savings interest cannot be negative")).toBeNull();
    expect(screen.queryByText("Other income cannot be negative")).toBeNull();
    expect(taxDue()).toBe("£0.00");
  });

  it("shows the savings interest error and leaves the existing tax due when savings interest is negative", () => {
    render(<App />);
    const { savingsInterest, otherIncome } = incomeFields();

    fireEvent.change(savingsInterest, { target: { value: "1001.90" } });
    fireEvent.change(otherIncome, { target: { value: "20000.40" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    fireEvent.change(savingsInterest, { target: { value: "-0.40" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(screen.getByText("Savings interest cannot be negative")).toBeDefined();
    expect(screen.queryByText("Other income cannot be negative")).toBeNull();
    expect(taxDue()).toBe("£0.20");
  });

  it("shows the other income error and leaves the existing tax due when other income is negative", () => {
    render(<App />);
    const { savingsInterest, otherIncome } = incomeFields();

    fireEvent.change(savingsInterest, { target: { value: "1001.90" } });
    fireEvent.change(otherIncome, { target: { value: "20000.40" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    fireEvent.change(otherIncome, { target: { value: "-0.40" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(screen.getByText("Other income cannot be negative")).toBeDefined();
    expect(screen.queryByText("Savings interest cannot be negative")).toBeNull();
    expect(taxDue()).toBe("£0.20");
  });

  it("shows both errors and leaves the existing tax due when both figures are negative", () => {
    render(<App />);
    const { savingsInterest, otherIncome } = incomeFields();

    fireEvent.change(savingsInterest, { target: { value: "1001.90" } });
    fireEvent.change(otherIncome, { target: { value: "20000.40" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    fireEvent.change(savingsInterest, { target: { value: "-2" } });
    fireEvent.change(otherIncome, { target: { value: "-3.50" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(screen.getByText("Savings interest cannot be negative")).toBeDefined();
    expect(screen.getByText("Other income cannot be negative")).toBeDefined();
    expect(taxDue()).toBe("£0.20");
  });

  it("shows the field error and no tax due when a negative figure is the first calculation", () => {
    render(<App />);
    const { savingsInterest } = incomeFields();

    fireEvent.change(savingsInterest, { target: { value: "-1" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(screen.getByText("Savings interest cannot be negative")).toBeDefined();
    expect(screen.queryByText("Tax Due on Savings")).toBeNull();
  });

  it("does not tax an unfinished amount as zero", () => {
    render(<App />);
    const { savingsInterest, otherIncome } = incomeFields();

    fireEvent.change(savingsInterest, { target: { value: "1001.90" } });
    fireEvent.change(otherIncome, { target: { value: "20000.40" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    fireEvent.change(savingsInterest, { target: { value: "-" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(savingsInterest.value).toBe("-");
    expect(screen.queryByText("Savings interest cannot be negative")).toBeNull();
    expect(taxDue()).toBe("£0.20");

    fireEvent.change(savingsInterest, { target: { value: "." } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(savingsInterest.value).toBe(".");
    expect(taxDue()).toBe("£0.20");
  });

  it("allows an empty field and rejects text that is not a number", () => {
    render(<App />);
    const { savingsInterest, otherIncome } = incomeFields();

    fireEvent.change(savingsInterest, { target: { value: "12" } });
    fireEvent.change(savingsInterest, { target: { value: "" } });
    expect(savingsInterest.value).toBe("");

    fireEvent.change(otherIncome, { target: { value: "34" } });
    fireEvent.change(otherIncome, { target: { value: "abc" } });
    expect(otherIncome.value).toBe("34");
  });
});
