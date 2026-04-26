import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { PatientForm } from "@/modules/patients/components/PatientForm";

describe("PatientForm", () => {
  it("shows validation error for invalid name", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} />);

    fireEvent.changeText(getByPlaceholderText("Ex.: Maria da Silva"), "Ma");
    fireEvent.press(getByText("Salvar paciente"));

    await waitFor(() => {
      expect(getByText("Nome deve ter ao menos 3 caracteres.")).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} />);

    fireEvent.changeText(getByPlaceholderText("Ex.: Maria da Silva"), "Maria Silva");
    fireEvent.changeText(getByPlaceholderText("(11) 99999-0000"), "11999990000");
    fireEvent.changeText(getByPlaceholderText("Notas importantes"), "Retorno em 30 dias");
    fireEvent.press(getByText("Salvar paciente"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Maria Silva",
        phone: "11999990000",
        notes: "Retorno em 30 dias",
      });
    });
  });
});
