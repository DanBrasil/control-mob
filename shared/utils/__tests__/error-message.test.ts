import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";

describe("getErrorMessage", () => {
  it("retorna error.message quando erro e instancia de Error com mensagem", () => {
    const error = new Error("Falha ao salvar");

    expect(getErrorMessage(error, "fallback")).toBe("Falha ao salvar");
  });

  it("retorna fallback quando erro nao e instancia de Error", () => {
    expect(getErrorMessage("string de erro", "fallback")).toBe("fallback");
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
    expect(getErrorMessage(undefined, "fallback")).toBe("fallback");
    expect(getErrorMessage(42, "fallback")).toBe("fallback");
  });

  it("retorna fallback quando Error tem mensagem vazia", () => {
    const error = new Error("");

    expect(getErrorMessage(error, "fallback padrao")).toBe("fallback padrao");
  });

  it("retorna fallback quando Error tem mensagem so com espacos", () => {
    const error = new Error("   ");

    expect(getErrorMessage(error, "fallback padrao")).toBe("fallback padrao");
  });
});

describe("reportNonSensitiveError", () => {
  it("chama console.error com prefixo de escopo", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    reportNonSensitiveError("modulo.operacao", new Error("Falha interna"));

    expect(spy).toHaveBeenCalledWith("[modulo.operacao] Falha interna");

    spy.mockRestore();
  });

  it("usa 'erro desconhecido' quando erro nao e instancia de Error", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    reportNonSensitiveError("teste.scope", "valor nao-Error");

    expect(spy).toHaveBeenCalledWith("[teste.scope] erro desconhecido");

    spy.mockRestore();
  });

  it("nao lanca excecao independente do tipo do erro", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => reportNonSensitiveError("scope", null)).not.toThrow();
    expect(() => reportNonSensitiveError("scope", undefined)).not.toThrow();
    expect(() =>
      reportNonSensitiveError("scope", { message: "obj" }),
    ).not.toThrow();

    spy.mockRestore();
  });
});
