import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { AppointmentForm } from "@/modules/appointments/components/AppointmentForm";

describe("AppointmentForm", () => {
  it("submits valid appointment data", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText, getAllByPlaceholderText } = render(
      <AppointmentForm
        patients={[{ id: 1, name: "Maria Silva" }]}
        defaultValues={{ patient_id: 1, status: "agendado" }}
        onSubmit={onSubmit}
      />,
    );

    const dateInputs = getAllByPlaceholderText("AAAA-MM-DDTHH:mm");
    fireEvent.changeText(getByPlaceholderText("Ex.: Retorno pós-consulta"), "Retorno clínico");
    fireEvent.changeText(dateInputs[0], "2026-04-30T10:30");
    fireEvent.press(getByText("Salvar agendamento"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        patient_id: 1,
        title: "Retorno clínico",
        notes: "",
        start_date: "2026-04-30T10:30",
        end_date: "",
        status: "agendado",
      });
    });
  });

  it("validates end date not before start date", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText, getAllByPlaceholderText } = render(
      <AppointmentForm
        patients={[{ id: 1, name: "Maria Silva" }]}
        defaultValues={{ patient_id: 1, status: "agendado" }}
        onSubmit={onSubmit}
      />,
    );

    const dateInputs = getAllByPlaceholderText("AAAA-MM-DDTHH:mm");
    fireEvent.changeText(getByPlaceholderText("Ex.: Retorno pós-consulta"), "Retorno");
    fireEvent.changeText(dateInputs[0], "2026-04-30T10:00");
    fireEvent.changeText(dateInputs[1], "2026-04-30T09:00");

    fireEvent.press(getByText("Salvar agendamento"));

    await waitFor(() => {
      expect(getByText("Data final não pode ser menor que data inicial.")).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
