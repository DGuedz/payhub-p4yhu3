export const brand = {
  colors: {
    // Base — Lucid Dark Financial
    bg: '#0B0F1A',
    surface: '#121829',
    surface2: '#1B2138',

    // Text
    text: '#FFFFFF',
    textSubtle: '#CBD5E1',
    textMuted: '#94A3B8',

    // Brand
    primary: '#3E2A7E',
    primaryHover: '#4A348F',

    // Accents
    accentGreen: '#22C55E',
    accentCyan: '#22D3EE',

    // System
    border: '#334155',
    success: '#059669',
    danger: '#EF4444',
  },
  radii: {
    sm: 8,
    md: 12,
  },
} as const;

export type Brand = typeof brand;