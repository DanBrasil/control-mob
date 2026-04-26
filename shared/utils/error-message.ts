export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
};

export const reportNonSensitiveError = (
  scope: string,
  error: unknown,
): void => {
  const message = error instanceof Error ? error.message : "erro desconhecido";
  console.error(`[${scope}] ${message}`);
};
