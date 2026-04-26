import {
  backupPayloadSchema,
  settingsFormSchema,
} from "@/modules/settings/schemas/settings.schema";

describe("settingsFormSchema", () => {
  const base = {
    clinic_name: "Clínica Saúde",
    currency: "BRL",
    default_session_minutes: 50,
  };

  it("valida configurações completas", () => {
    const result = settingsFormSchema.safeParse({
      ...base,
      default_business_hours: "08:00-18:00",
    });

    expect(result.success).toBe(true);
  });

  it("valida configurações sem horário de funcionamento", () => {
    const result = settingsFormSchema.safeParse(base);

    expect(result.success).toBe(true);
  });

  it("rejeita clinic_name vazio", () => {
    const result = settingsFormSchema.safeParse({ ...base, clinic_name: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("obrigatorio");
    }
  });

  it("rejeita currency fora do padrão ISO de 3 letras", () => {
    const result = settingsFormSchema.safeParse({ ...base, currency: "US" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("ISO");
    }
  });

  it("rejeita default_session_minutes menor que 5", () => {
    const result = settingsFormSchema.safeParse({
      ...base,
      default_session_minutes: 4,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("5");
    }
  });

  it("rejeita default_session_minutes maior que 240", () => {
    const result = settingsFormSchema.safeParse({
      ...base,
      default_session_minutes: 241,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("240");
    }
  });

  it("rejeita default_business_hours com formato inválido", () => {
    const result = settingsFormSchema.safeParse({
      ...base,
      default_business_hours: "8h-18h",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("HH:mm");
    }
  });

  it("aceita default_business_hours digitado apenas com numeros", () => {
    const result = settingsFormSchema.safeParse({
      ...base,
      default_business_hours: "08001800",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.default_business_hours).toBe("08:00-18:00");
    }
  });

  it("rejeita default_business_hours com hora invalida", () => {
    const result = settingsFormSchema.safeParse({
      ...base,
      default_business_hours: "28:00-18:00",
    });

    expect(result.success).toBe(false);
  });

  it("converte currency para maiúsculas automaticamente", () => {
    const result = settingsFormSchema.safeParse({ ...base, currency: "brl" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currency).toBe("BRL");
    }
  });

  it("processa default_session_minutes como string numérica", () => {
    const result = settingsFormSchema.safeParse({
      ...base,
      default_session_minutes: "60",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.default_session_minutes).toBe(60);
    }
  });
});

describe("backupPayloadSchema", () => {
  const validPayload = {
    patients: [{ id: 1, name: "Maria Silva", phone: null, notes: null }],
    appointments: [
      {
        id: 1,
        patient_id: 1,
        title: "Consulta inicial",
        notes: null,
        start_date: "2026-04-28T10:00:00.000Z",
        status: "agendado",
      },
    ],
    financial_entries: [
      {
        id: 1,
        title: "Sessão",
        amount: 150,
        kind: "entrada",
        entry_date: "2026-04-28T10:00:00.000Z",
        notes: null,
      },
    ],
    settings: {
      clinic_name: "Minha Clínica",
      currency: "BRL",
      default_session_minutes: 50,
    },
  };

  it("valida um backup completo e válido", () => {
    const result = backupPayloadSchema.safeParse(validPayload);

    expect(result.success).toBe(true);
  });

  it("valida backup com arrays vazios", () => {
    const result = backupPayloadSchema.safeParse({
      patients: [],
      appointments: [],
      financial_entries: [],
      settings: {
        clinic_name: "",
        currency: "BRL",
        default_session_minutes: 50,
      },
    });

    expect(result.success).toBe(true);
  });

  it("rejeita quando patients não é array", () => {
    const result = backupPayloadSchema.safeParse({
      ...validPayload,
      patients: "invalido",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita appointment com status inválido", () => {
    const result = backupPayloadSchema.safeParse({
      ...validPayload,
      appointments: [{ ...validPayload.appointments[0], status: "pendente" }],
    });

    expect(result.success).toBe(false);
  });

  it("rejeita financial_entry com kind inválido", () => {
    const result = backupPayloadSchema.safeParse({
      ...validPayload,
      financial_entries: [
        { ...validPayload.financial_entries[0], kind: "pagamento" },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejeita appointment com start_date inválida", () => {
    const result = backupPayloadSchema.safeParse({
      ...validPayload,
      appointments: [
        { ...validPayload.appointments[0], start_date: "nao-e-data" },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejeita payload sem campo obrigatório (financial_entries)", () => {
    const { financial_entries: _omit, ...withoutEntries } = validPayload;
    const result = backupPayloadSchema.safeParse(withoutEntries);

    expect(result.success).toBe(false);
  });
});
