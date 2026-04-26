export const toISODateTime = (date = new Date()): string => date.toISOString();

export const toISODate = (date = new Date()): string =>
  date.toISOString().slice(0, 10);

const pad2 = (value: number): string => String(value).padStart(2, "0");

const isValidLocalDateTime = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): boolean => {
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute
  );
};

export const maskPtBrDateTimeInput = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 12);

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  const hour = digits.slice(8, 10);
  const minute = digits.slice(10, 12);

  let output = "";

  if (day) {
    output += day;
  }

  if (month) {
    output += `/${month}`;
  }

  if (year) {
    output += `/${year}`;
  }

  if (hour) {
    output += ` ${hour}`;
  }

  if (minute) {
    output += `:${minute}`;
  }

  return output;
};

export const normalizeDateTimeInput = (value: string): string | null => {
  const raw = value.trim();

  if (!raw) {
    return null;
  }

  const brMatch = raw.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s(\d{2}):(\d{2}))?$/,
  );

  if (brMatch) {
    const day = Number(brMatch[1]);
    const month = Number(brMatch[2]);
    const year = Number(brMatch[3]);
    const hour = Number(brMatch[4] ?? "0");
    const minute = Number(brMatch[5] ?? "0");

    if (!isValidLocalDateTime(year, month, day, hour, minute)) {
      return null;
    }

    return `${year}-${pad2(month)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}`;
  }

  const isoMatch = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/,
  );

  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    const hour = Number(isoMatch[4] ?? "0");
    const minute = Number(isoMatch[5] ?? "0");

    if (!isValidLocalDateTime(year, month, day, hour, minute)) {
      return null;
    }

    return `${year}-${pad2(month)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}`;
  }

  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(
    parsed.getDate(),
  )}T${pad2(parsed.getHours())}:${pad2(parsed.getMinutes())}`;
};

export const formatDateTimeForPtBrInput = (value: string): string => {
  const normalized = normalizeDateTimeInput(value);

  if (!normalized) {
    return "";
  }

  const [datePart, timePart] = normalized.split("T");
  const [year, month, day] = datePart.split("-");

  return `${day}/${month}/${year} ${timePart}`;
};

export const maskTimeInput = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  const hour = digits.slice(0, 2);
  const minute = digits.slice(2, 4);

  if (!minute) {
    return hour;
  }

  return `${hour}:${minute}`;
};

export const maskPtBrDateInput = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  let output = "";

  if (day) {
    output += day;
  }

  if (month) {
    output += `/${month}`;
  }

  if (year) {
    output += `/${year}`;
  }

  return output;
};

export const normalizeDateInput = (value: string): string | null => {
  const raw = value.trim();

  if (!raw) {
    return null;
  }

  const brMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (brMatch) {
    const day = Number(brMatch[1]);
    const month = Number(brMatch[2]);
    const year = Number(brMatch[3]);

    if (!isValidLocalDateTime(year, month, day, 0, 0)) {
      return null;
    }

    return `${year}-${pad2(month)}-${pad2(day)}`;
  }

  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);

    if (!isValidLocalDateTime(year, month, day, 0, 0)) {
      return null;
    }

    return `${year}-${pad2(month)}-${pad2(day)}`;
  }

  return null;
};

export const formatDateForPtBrInput = (value: string): string => {
  const normalized = normalizeDateInput(value);

  if (!normalized) {
    return "";
  }

  const [year, month, day] = normalized.split("-");

  return `${day}/${month}/${year}`;
};

const isValidHourMinute = (hour: number, minute: number): boolean =>
  hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;

export const maskBusinessHoursInput = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  const startHour = digits.slice(0, 2);
  const startMinute = digits.slice(2, 4);
  const endHour = digits.slice(4, 6);
  const endMinute = digits.slice(6, 8);

  let output = "";

  if (startHour) {
    output += startHour;
  }

  if (startMinute) {
    output += `:${startMinute}`;
  }

  if (endHour) {
    output += `-${endHour}`;
  }

  if (endMinute) {
    output += `:${endMinute}`;
  }

  return output;
};

export const normalizeBusinessHoursInput = (value: string): string | null => {
  const raw = value.trim();

  if (!raw) {
    return "";
  }

  const maskedMatch = raw.match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);

  if (maskedMatch) {
    const startHour = Number(maskedMatch[1]);
    const startMinute = Number(maskedMatch[2]);
    const endHour = Number(maskedMatch[3]);
    const endMinute = Number(maskedMatch[4]);

    if (
      !isValidHourMinute(startHour, startMinute) ||
      !isValidHourMinute(endHour, endMinute)
    ) {
      return null;
    }

    return `${pad2(startHour)}:${pad2(startMinute)}-${pad2(endHour)}:${pad2(endMinute)}`;
  }

  const digitsMatch = raw.match(/^\d{8}$/);

  if (digitsMatch) {
    return normalizeBusinessHoursInput(maskBusinessHoursInput(raw));
  }

  return null;
};

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
