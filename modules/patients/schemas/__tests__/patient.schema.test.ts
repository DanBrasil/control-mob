import { patientSchema } from "@/modules/patients/schemas/patient.schema";

describe("patientSchema", () => {
  it("valida um paciente com todos os campos preenchidos", () => {
    const result = patientSchema.safeParse({
      name: "Maria Silva",
      phone: "11999990000",
      notes: "Retorno em 30 dias",
    });

    expect(result.success).toBe(true);
  });

  it("valida um paciente apenas com nome", () => {
    const result = patientSchema.safeParse({ name: "Ana Lima" });

    expect(result.success).toBe(true);
  });

  it("rejeita nome vazio", () => {
    const result = patientSchema.safeParse({ name: "" });

    expect(result.success).toBe(false);
  });

  it("rejeita nome com menos de 3 caracteres", () => {
    const result = patientSchema.safeParse({ name: "Ma" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Nome deve ter ao menos 3 caracteres.",
      );
    }
  });

  it("rejeita telefone com mais de 20 caracteres", () => {
    const result = patientSchema.safeParse({
      name: "Maria Silva",
      phone: "1".repeat(21),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("20");
    }
  });

  it("rejeita observacoes com mais de 400 caracteres", () => {
    const result = patientSchema.safeParse({
      name: "Maria Silva",
      notes: "x".repeat(401),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("400");
    }
  });

  it("aplica trim no nome e retorna valor limpo", () => {
    const result = patientSchema.safeParse({ name: "  Maria Silva  " });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Maria Silva");
    }
  });

  it("aceita phone e notes como undefined (campos opcionais)", () => {
    const result = patientSchema.safeParse({
      name: "Carlos Souza",
      phone: undefined,
      notes: undefined,
    });

    expect(result.success).toBe(true);
  });
});
