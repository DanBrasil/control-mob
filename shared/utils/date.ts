export const toISODateTime = (date = new Date()): string => date.toISOString();

export const toISODate = (date = new Date()): string =>
  date.toISOString().slice(0, 10);

export const toDateTimeInputValue = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
};

export const toPtBrDateTime = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};
