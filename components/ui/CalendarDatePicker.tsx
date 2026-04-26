import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/constants/theme";

type Props = {
  label: string;
  value: string;
  onChange: (isoDate: string) => void;
  minYear?: number;
  maxYear?: number;
  error?: string;
};

const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

const toIsoDate = (year: number, monthIndex: number, day: number) => {
  const month = String(monthIndex + 1).padStart(2, "0");
  const dayText = String(day).padStart(2, "0");

  return `${year}-${month}-${dayText}`;
};

const parseIsoDate = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);

  if (Number.isNaN(year) || Number.isNaN(monthIndex) || Number.isNaN(day)) {
    return null;
  }

  return { year, monthIndex, day };
};

export function CalendarDatePicker({
  label,
  value,
  onChange,
  minYear = new Date().getFullYear() - 10,
  maxYear = new Date().getFullYear() + 10,
  error,
}: Props) {
  const parsed = parseIsoDate(value);
  const now = new Date();

  const [monthIndex, setMonthIndex] = useState<number>(
    parsed?.monthIndex ?? now.getMonth(),
  );
  const [year, setYear] = useState<number>(parsed?.year ?? now.getFullYear());
  const [openDropdown, setOpenDropdown] = useState<"month" | "year" | null>(
    null,
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    const next = parseIsoDate(value);

    if (!next) {
      return;
    }

    setMonthIndex(next.monthIndex);
    setYear(next.year);
  }, [value]);

  const years = useMemo(() => {
    const options: number[] = [];

    for (let current = minYear; current <= maxYear; current += 1) {
      options.push(current);
    }

    return options;
  }, [maxYear, minYear]);

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();

  const dayCells = useMemo(() => {
    const cells: Array<number | null> = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(day);
    }

    return cells;
  }, [daysInMonth, firstWeekday]);

  const displayValue = useMemo(() => {
    const parsedDate = parseIsoDate(value);

    if (!parsedDate) {
      return "Selecione uma data";
    }

    const day = String(parsedDate.day).padStart(2, "0");
    const month = String(parsedDate.monthIndex + 1).padStart(2, "0");

    return `${day}/${month}/${parsedDate.year}`;
  }, [value]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={styles.triggerButton}
        onPress={() => {
          setIsCalendarOpen((current) => !current);
          setOpenDropdown(null);
        }}
      >
        <Text style={styles.triggerText}>{displayValue}</Text>
        <Text style={styles.triggerChevron}>{isCalendarOpen ? "▲" : "▼"}</Text>
      </Pressable>

      {isCalendarOpen ? (
        <View style={styles.calendarCard}>
          <View style={styles.headerRow}>
            <Pressable
              style={styles.dropdownButton}
              onPress={() =>
                setOpenDropdown((current) =>
                  current === "month" ? null : "month",
                )
              }
            >
              <Text style={styles.dropdownText}>{MONTHS_PT[monthIndex]}</Text>
              <Text style={styles.dropdownChevron}>▼</Text>
            </Pressable>

            <Pressable
              style={styles.dropdownButton}
              onPress={() =>
                setOpenDropdown((current) =>
                  current === "year" ? null : "year",
                )
              }
            >
              <Text style={styles.dropdownText}>{year}</Text>
              <Text style={styles.dropdownChevron}>▼</Text>
            </Pressable>
          </View>

          {openDropdown === "month" ? (
            <ScrollView style={styles.dropdownPanel} nestedScrollEnabled>
              {MONTHS_PT.map((month, idx) => (
                <Pressable
                  key={month}
                  style={[
                    styles.dropdownOption,
                    idx === monthIndex ? styles.dropdownOptionActive : null,
                  ]}
                  onPress={() => {
                    setMonthIndex(idx);
                    setOpenDropdown(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      idx === monthIndex
                        ? styles.dropdownOptionTextActive
                        : null,
                    ]}
                  >
                    {month}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}

          {openDropdown === "year" ? (
            <ScrollView style={styles.dropdownPanel} nestedScrollEnabled>
              {years.map((yearOption) => (
                <Pressable
                  key={yearOption}
                  style={[
                    styles.dropdownOption,
                    yearOption === year ? styles.dropdownOptionActive : null,
                  ]}
                  onPress={() => {
                    setYear(yearOption);
                    setOpenDropdown(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      yearOption === year
                        ? styles.dropdownOptionTextActive
                        : null,
                    ]}
                  >
                    {yearOption}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}

          <View style={styles.weekHeader}>
            {WEEKDAYS.map((weekday, idx) => (
              <Text key={`${weekday}-${idx}`} style={styles.weekdayText}>
                {weekday}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {dayCells.map((day, idx) => {
              if (!day) {
                return <View key={`empty-${idx}`} style={styles.dayCell} />;
              }

              const isoDate = toIsoDate(year, monthIndex, day);
              const selected = isoDate === value;

              return (
                <Pressable
                  key={isoDate}
                  style={[
                    styles.dayCell,
                    selected ? styles.dayCellActive : null,
                  ]}
                  onPress={() => {
                    onChange(isoDate);
                    setIsCalendarOpen(false);
                    setOpenDropdown(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selected ? styles.dayTextActive : null,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  triggerButton: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  triggerText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  triggerChevron: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: "700",
  },
  calendarCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    padding: 10,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    gap: 8,
  },
  dropdownButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#f8fafc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: "600",
  },
  dropdownChevron: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: "700",
  },
  dropdownPanel: {
    maxHeight: 180,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  dropdownOption: {
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dropdownOptionActive: {
    backgroundColor: theme.colors.primarySoft,
  },
  dropdownOptionText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  dropdownOptionTextActive: {
    color: theme.colors.primary,
  },
  weekHeader: {
    flexDirection: "row",
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 6,
  },
  dayCell: {
    width: "14.2857%",
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  dayCellActive: {
    backgroundColor: theme.colors.primary,
  },
  dayText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  dayTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.danger,
    fontWeight: "600",
  },
});
