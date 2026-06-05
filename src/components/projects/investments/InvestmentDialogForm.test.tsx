import {describe, expect, it, vi} from "vitest"
import InvestmentDialogForm from "@/components/projects/investments/InvestmentDialogForm.tsx";
import {render, screen, fireEvent, within, act} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {mockCategories} from "@/components/projects/investments/mockData.ts";
import type {InvestmentFormFields} from "@/components/projects/investments/investment.ts";

const mockTitle = "MOCK TITLE";
const mockSubmitLabel = "SUBMIT";
const confirmTitle = "CONFIRM TITLE";
const confirmDescription = "CONFIRM DESCRIPTION";
const confirmActionLabel = "CONFIRM ACTION";
const confirmCancelLabel = "CONFIRM CANCEL"

const renderDialogForm = (open: boolean = true, onSubmit: (fields: InvestmentFormFields) => void = vi.fn(), onCancel: () => void = vi.fn()) => {
  render(
      <InvestmentDialogForm
          isOpen={open}
          categories={mockCategories}
          onSubmit={onSubmit}
          onCancel={onCancel}
          title={mockTitle}
          submitLabel={mockSubmitLabel}
          confirmTitle={confirmTitle}
          confirmDescription={confirmDescription}
          confirmActionLabel={confirmActionLabel}
          confirmCancelLabel={confirmCancelLabel}
      />
  )
};

describe("InvestmentDialogForm", () => {
  const fillDescription = (value: string) => {
    const field = screen.getByLabelText("Description");
    act(() => {
      fireEvent.change(field, {target: {value}});
    });
  };

  const fillCategory = async (name: string) => {
    const trigger = screen.getByLabelText("Category");
    await userEvent.click(trigger);
    const option = await screen.findByRole("option", {name});
    await userEvent.click(option);
  };

  const fillDate = (value: string) => {
    const field = screen.getByLabelText("Date");
    act(() => {
      fireEvent.change(field, {target: {value}});
      fireEvent.blur(field);
    });
  };

  const fillInvestor = (value: string) => {
    const field = screen.getByLabelText("Investor");
    act(() => {
      fireEvent.change(field, {target: {value}});
    });
  };

  const fillAmount = (value: string) => {
    const field = screen.getByLabelText("Amount");
    act(() => {
      fireEvent.change(field, {target: {value}});
      fireEvent.blur(field);
    });
  };

  const clickSubmit = () => {
    const button = screen.getByRole("button", {name: mockSubmitLabel});
    act(() => {
      fireEvent.click(button);
    });
  };

  const clickCancel = () => {
    const button = screen.getByRole("button", {name: "Cancel investment"});
    act(() => {
      fireEvent.click(button);
    });
  };

  const clickConfirmCancel = () => {
    const button = screen.getByRole("button", {name: confirmActionLabel});
    act(() => {
      fireEvent.click(button);
    });
  };

  const clickConfirmBack = () => {
    const button = screen.getByRole("button", {name: confirmCancelLabel});
    act(() => {
      fireEvent.click(button);
    });
  };

  const expectFieldError = (label: string) => {
    expect(screen.getByLabelText(label)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("listitem", {name: `form-error-${label}`})).toBeInTheDocument();
  };

  it("not render with open false", () => {
    renderDialogForm(false);

    const title = screen.queryByText(mockTitle)
    expect(title == null).toBeTruthy();
  });

  it("displays all errors on submit", async () => {
    renderDialogForm();

    clickSubmit();

    expect(await screen.findByRole("alert", {name: "Form errors"})).toBeInTheDocument();

    const fields = ["Description", "Category", "Investor", "Amount"];
    fields.forEach(field => {
      expectFieldError(field);
    })
  });

  it("does not submit on errors", async () => {
    const onSubmit = vi.fn();
    renderDialogForm(true, onSubmit);

    clickSubmit();

    expect(await screen.findByRole("alert", {name: "Form errors"})).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("invalid date shows error", async () => {
    renderDialogForm();

    fillDate("30.02.2025");
    clickSubmit();

    expect(await screen.findByRole("alert", {name: "Form errors"})).toBeInTheDocument();
    expectFieldError("Date");

    fillDate("30/02/2025");
    clickSubmit();
    expectFieldError("Date");
  });

  // Could be done via each test instead
  it("negative amount shows error", async () => {
    renderDialogForm();

    fillAmount("-1");
    clickSubmit();

    expect(await screen.findByRole("alert", {name: "Form errors"})).toBeInTheDocument();
    expectFieldError("Amount");

    fillAmount(Number.MIN_VALUE.toString());
    clickSubmit();

    expect(await screen.findByRole("alert", {name: "Form errors"})).toBeInTheDocument();
    expectFieldError("Amount");
  });

  // Maybe consolidate with negative numbers?
  it("0 amount shows error", async () => {
    renderDialogForm();

    fillAmount("0");
    clickSubmit();

    expect(await screen.findByRole("alert", {name: "Form errors"})).toBeInTheDocument();
    expectFieldError("Amount");
  });

  it("cancel triggers alert dialog", async () => {
    renderDialogForm();

    clickCancel();

    expect(screen.getByText(confirmCancelLabel)).toBeInTheDocument();
    expect(screen.getByText(confirmActionLabel)).toBeInTheDocument();
    expect(screen.getByText(confirmTitle)).toBeInTheDocument();
    expect(screen.getByText(confirmDescription)).toBeInTheDocument();
  });

  it("form cancel requires cancel confirmation", async () => {
    const onCancel = vi.fn();
    renderDialogForm(true, vi.fn(), onCancel);

    clickCancel();
    expect(screen.getByText(confirmTitle)).toBeInTheDocument();

    clickConfirmBack();
    expect(screen.queryByRole(confirmTitle)).not.toBeInTheDocument();
    expect(onCancel).not.toHaveBeenCalled();

    clickCancel();
    clickConfirmCancel();
    expect(onCancel).toHaveBeenCalled();
  });

  it("shows all categories in select", async () => {
    renderDialogForm();

    const trigger = screen.getByLabelText("Category");
    await userEvent.click(trigger);

    const listbox = await screen.findByRole("listbox");
    mockCategories.forEach(cat => {
      expect(within(listbox).getByRole("option", {name: cat.name})).toBeInTheDocument();
    });
  });

  it("formats amount with thousand separator (.) and decimal separator (,)", async () => {
    renderDialogForm();

    fillAmount("1234,56");
    const amountField = screen.getByLabelText("Amount");
    expect(amountField).toHaveValue("1.234,56");

    fillAmount("1000000");
    expect(amountField).toHaveValue("1.000.000,00");
  });

  it("can submit with required fields filled", async () => {
    const onSubmit = vi.fn();
    renderDialogForm(true, onSubmit);

    fillDescription("Test investment");
    await fillCategory("Seed Funding");
    fillDate("01.01.2025");
    fillInvestor("John Doe");
    fillAmount("1000");

    await act(async () => {
      clickSubmit();
    });

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it("submitted date field is in iso format", async () => {
    const onSubmit = vi.fn();
    renderDialogForm(true, onSubmit);

    fillDescription("Test investment");
    await fillCategory("Seed Funding");
    fillDate("01.06.2026");
    fillInvestor("John Doe");
    fillAmount("1000");

    await act(async () => {
      clickSubmit();
    });

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        date: "2026-06-01"
      }));
    });
  });
});