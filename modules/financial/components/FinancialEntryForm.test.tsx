import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { FinancialEntryForm } from "@/modules/financial/components/FinancialEntryForm";

describe("FinancialEntryForm", () => {
  it("parses decimal amount and submits valid payload", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = render(
      <FinancialEntryForm onSubmit={onSubmit} defaultValues={{ kind: "entrada" }} />,
    );

    fireEvent.changeText(getByPlaceholderText("Ex.: Consulta particular"), "Consulta");
    fireEvent.changeText(getByPlaceholderText("Ex.: 150.00"), "100,5");
    fireEvent.changeText(getByPlaceholderText("AAAA-MM-DDTHH:mm"), "2026-04-30T08:00");
    fireEvent.press(getByText("Salvar lançamento"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Consulta",
        amount: 100.5,
        kind: "entrada",
        entry_date: "2026-04-30T08:00",
        notes: "",
      });
    });
  });

  it("shows validation error when amount is invalid", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = render(
      <FinancialEntryForm onSubmit={onSubmit} defaultValues={{ kind: "entrada" }} />,
    );

    fireEvent.changeText(getByPlaceholderText("Ex.: Consulta particular"), "Consulta");
    fireEvent.changeText(getByPlaceholderText("Ex.: 150.00"), "0");
    fireEvent.changeText(getByPlaceholderText("AAAA-MM-DDTHH:mm"), "2026-04-30T08:00");
    fireEvent.press(getByText("Salvar lançamento"));

    await waitFor(() => {
      expect(getByText("Valor deve ser maior que zero.")).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
