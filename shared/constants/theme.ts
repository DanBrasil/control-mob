export const theme = {
  colors: {
    background: "#f7f7fb",
    surface: "#ffffff",
    surfaceAlt: "#eef2ff",
    primary: "#4f46e5",
    primaryDark: "#4338ca",
    primarySoft: "#e0e7ff",
    text: "#0f172a",
    textMuted: "#64748b",
    border: "#ebeef3",
    success: "#059669",
    successSoft: "#d1fae5",
    warning: "#d97706",
    warningSoft: "#fef3c7",
    danger: "#e11d48",
    dangerSoft: "#ffe4e6",
  },
  gradients: {
    primary: ["#6366f1", "#4f46e5", "#4338ca"] as const,
    mint: ["#34d399", "#10b981"] as const,
    coral: ["#fb7185", "#f43f5e"] as const,
  },
  radii: {
    sm: 12,
    md: 20,
    lg: 28,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: { size: 28, weight: "800" as const },
    h2: { size: 24, weight: "800" as const },
    body: { size: 14, weight: "600" as const },
    caption: { size: 12, weight: "600" as const },
  },
  shadows: {
    md: {
      shadowColor: "#0f172a",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    glowPrimary: {
      shadowColor: "#4f46e5",
      shadowOpacity: 0.28,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
  },
};

export type AppTheme = typeof theme;
