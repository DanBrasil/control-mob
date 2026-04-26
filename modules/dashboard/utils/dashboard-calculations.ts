import { endOfMonth, format, startOfMonth, subDays } from "date-fns";

export type DateRange = {
  startDate: string;
  endDate: string;
};

export const getCurrentMonthRange = (baseDate = new Date()): DateRange => ({
  startDate: format(startOfMonth(baseDate), "yyyy-MM-dd"),
  endDate: format(endOfMonth(baseDate), "yyyy-MM-dd"),
});

export const getTodayDate = (baseDate = new Date()): string =>
  format(baseDate, "yyyy-MM-dd");

export const getNowIsoDateTime = (baseDate = new Date()): string =>
  baseDate.toISOString();

export const getRecentCutoffIsoDateTime = (
  days = 7,
  baseDate = new Date(),
): string => subDays(baseDate, days).toISOString();

export const calculateMonthlyBalance = (
  entries: number,
  exits: number,
): number => entries - exits;

export const summarizeText = (
  text: string | null,
  maxLength = 60,
): string | null => {
  if (!text?.trim()) {
    return null;
  }

  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1)}…`;
};

const safeDate = (value: string): Date | null => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDashboardDate = (value: string): string => {
  const date = safeDate(value);
  return date ? format(date, "dd/MM") : value;
};

export const formatDashboardTime = (value: string): string => {
  const date = safeDate(value);
  return date ? format(date, "HH:mm") : value;
};
