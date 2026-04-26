import { appointmentSchema } from "@/modules/appointments/schemas/appointment.schema";

describe("appointmentSchema", () => {
  const base = {
    patient_id: 1,
    title: "Retorno clínico",
    start_date: "2026-04-30T10:00",
    status: "agendado" as const,
  };

  it("valida um agendamento completo e válido", () => {
    const result = appointmentSchema.safeParse({
      ...base,
      end_date: "2026-04-30T11:00",
      notes: "Observação",
    });

    expect(result.success).toBe(true);
  });

  it("valida agendamento sem campos opcionais", () => {
    const result = appointmentSchema.safeParse(base);

    expect(result.success).toBe(true);
  });

  it("rejeita quando patient_id está ausente", () => {
    const result = appointmentSchema.safeParse({
      ...base,
      patient_id: undefined,
    });

    expect(result.success).toBe(false);
  });

  it("rejeita titulo com menos de 3 caracteres", () => {
    const result = appointmentSchema.safeParse({ ...base, title: "Ab" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Título deve ter ao menos 3 caracteres.",
      );
    }
  });

  it("rejeita start_date inválida", () => {
    const result = appointmentSchema.safeParse({
      ...base,
      start_date: "nao-e-data",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Data inicial inválida.");
    }
  });

  it("rejeita start_date vazia", () => {
    const result = appointmentSchema.safeParse({ ...base, start_date: "" });

    expect(result.success).toBe(false);
  });

  it("rejeita end_date anterior a start_date (validacao cruzada)", () => {
    const result = appointmentSchema.safeParse({
      ...base,
      start_date: "2026-04-30T10:00",
      end_date: "2026-04-30T09:00",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Data final não pode ser menor que data inicial.",
      );
    }
  });

  it("aceita end_date igual a start_date", () => {
    const result = appointmentSchema.safeParse({
      ...base,
      start_date: "2026-04-30T10:00",
      end_date: "2026-04-30T10:00",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita status inválido", () => {
    const result = appointmentSchema.safeParse({ ...base, status: "invalido" });

    expect(result.success).toBe(false);
  });

  it("aceita todos os status válidos", () => {
    for (const status of ["agendado", "concluido", "cancelado"] as const) {
      const result = appointmentSchema.safeParse({ ...base, status });
      expect(result.success).toBe(true);
    }
  });
});
