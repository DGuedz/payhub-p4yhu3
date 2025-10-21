export const theme = {
  colors: {
    // Base — CRYFIN/Lucid Dark (preto/azul profundo)
    bg: '#0B0F14',        // fundo de tela
    surface: '#11161C',   // cartões/inputs
    surface2: '#141A22',  // superfícies secundárias

    // Texto
    text: '#E5E7EB',        // principal (quase branco)
    textSubtle: '#94A3B8',  // secundário
    textMuted: '#64748B',   // descritivo/suporte

    // Ação primária (ciano CRYFIN)
    primary: '#06B6D4',
    primaryHover: '#0891B2',

    // Acentos
    accentGreen: '#22C55E', // positivo
    accentCyan: '#06B6D4',

    // Sistema
    border: '#1F2937',
    success: '#22C55E',     // verde para % positivas
    danger: '#EF4444',      // vermelho para % negativas
    textOnPrimary: '#FFFFFF'// texto em botões primários
  },
  radii: {
    sm: 8,
    md: 12,
  },
}
export type Theme = typeof theme