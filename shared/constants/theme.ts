export const theme = {
  colors: {
    background: "#f3f6fb",
    surface: "#ffffff",
    surfaceAlt: "#e8f0ff",
    primary: "#1f4db8",
    primaryDark: "#163a8b",
    text: "#1f2937",
    textMuted: "#6b7280",
    border: "#d7deea",
    success: "#0f766e",
    warning: "#b45309",
    danger: "#b91c1c",
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 18,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

export type AppTheme = typeof theme;
