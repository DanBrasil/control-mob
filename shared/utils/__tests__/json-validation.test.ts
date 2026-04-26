import { backupPayloadSchema } from "@/modules/settings/schemas/settings.schema";
import { parseJsonWithSchema } from "@/shared/utils/json-validation";

describe("parseJsonWithSchema", () => {
  it("lanca erro em JSON malformado", () => {
    expect(() =>
      parseJsonWithSchema("{invalido}", backupPayloadSchema),
    ).toThrow("Arquivo JSON invalido.");
  });

  it("lanca erro quando estrutura nao corresponde ao schema", () => {
    const json = JSON.stringify({ patients: "nao-e-array" });

    expect(() => parseJsonWithSchema(json, backupPayloadSchema)).toThrow(
      /Estrutura invalida/,
    );
  });

  it("lanca erro com caminho do campo invalido na mensagem", () => {
    const json = JSON.stringify({
      patients: [{ id: 1, name: "Maria", phone: null, notes: null }],
      appointments: [
        {
          id: 1,
          patient_id: 1,
          title: "T",
          notes: null,
          start_date: "invalida",
          status: "agendado",
        },
      ],
      financial_entries: [],
      settings: {
        clinic_name: "",
        currency: "BRL",
        default_session_minutes: 50,
      },
    });

    expect(() => parseJsonWithSchema(json, backupPayloadSchema)).toThrow(
      /Estrutura invalida/,
    );
  });

  it("retorna dados tipados quando JSON e schema sao validos", () => {
    const payload = {
      patients: [{ id: 1, name: "Maria", phone: null, notes: null }],
      appointments: [],
      financial_entries: [],
      settings: {
        clinic_name: "",
        currency: "BRL",
        default_session_minutes: 50,
      },
    };

    const result = parseJsonWithSchema(
      JSON.stringify(payload),
      backupPayloadSchema,
    );

    expect(result.patients).toHaveLength(1);
    expect(result.patients[0].name).toBe("Maria");
  });

  it("retorna arrays vazios quando payload tem arrays vazios", () => {
    const payload = {
      patients: [],
      appointments: [],
      financial_entries: [],
      settings: {
        clinic_name: "",
        currency: "BRL",
        default_session_minutes: 50,
      },
    };

    const result = parseJsonWithSchema(
      JSON.stringify(payload),
      backupPayloadSchema,
    );

    expect(result.patients).toHaveLength(0);
    expect(result.appointments).toHaveLength(0);
    expect(result.financial_entries).toHaveLength(0);
  });
});
