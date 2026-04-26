import { z } from "zod";

export const parseJsonWithSchema = <TSchema extends z.ZodTypeAny>(
  rawContent: string,
  schema: TSchema,
): z.infer<TSchema> => {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawContent);
  } catch {
    throw new Error("Arquivo JSON invalido.");
  }

  const parsed = schema.safeParse(parsedJson);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path?.join(".") || "raiz";
    throw new Error(
      `Estrutura invalida em ${path}: ${firstIssue?.message || "erro"}.`,
    );
  }

  return parsed.data;
};
