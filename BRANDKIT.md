# PAYHUB (P4YHU3) — Brand Kit

Nome: PAYHUB: Liquidez Ativa e Segura  
Slogan: "Sua camada de pagamentos plug-and-play que transforma faturamento em rendimento (5% a 8% APY), eliminando o D+30."

## Estilo Visual
- Lucid Dark Financial: sofisticação institucional, foco em dados e clareza.
- XRPL como motor silencioso: alto desempenho, baixo custo.
- Dark Mode por padrão: contraste alto e legibilidade.

## Paleta de Cores
- Primária (Deep Digital Purple): `#3E2A7E`
- Primária Hover: `#4A348F`
- Fundo base (Dark): `#0B0F1A`
- Superfície: `#121829`
- Superfície 2: `#1B2138`
- Acento (Neon Green): `#22C55E`
- Acento (Cyan): `#22D3EE`
- Texto: `#FFFFFF`
- Texto sutil: `#CBD5E1`
- Texto muted: `#94A3B8`
- Borda: `#334155`
- Sucesso: `#059669`
- Alerta/erro: `#EF4444`

## Tipografia
- Web: Sans-Serif geométrica (Geist).  
- Mobile: Sans-Serif do sistema (iOS/Android), mantendo legibilidade e peso consistente.

## Tokens Compartilhados
- Mobile (`mobile/src/theme.ts`):
  - `colors.bg`, `colors.surface`, `colors.surface2`, `colors.text`, `colors.textSubtle`, `colors.textMuted`
  - `colors.primary`, `colors.primaryHover`, `colors.accentGreen`, `colors.accentCyan`
  - `colors.border`, `colors.success`, `colors.danger`
  - `radii.sm` (8), `radii.md` (12)
- Web (`payhub-frontend/lib/brand.ts` + CSS Vars):
  - CSS Vars (Dark): `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--accent`, `--border`, `--input`, `--ring`
  - Extras: `--brand-purple`, `--accent-green`, `--accent-cyan`, `--text-primary`, `--text-secondary`, `--text-muted`, `--bg-card`, `--bg-card-hover`, `--bg-tertiary`, `--border-primary`, `--border-accent`, `--shadow-glow`
  - TS Tokens: `brand.colors.*` e `brand.radii.*`

## Aplicação (Web)
- Arquivo: `payhub-frontend/app/globals.css`
  - Variáveis `.dark { ... }` atualizadas para Lucid Dark Financial (roxo primário, verde neon, ciano).
- Tema padrão Dark: `app/providers.tsx` com `defaultTheme="dark"`.
- Tailwind usa tokens via classes (`bg-background`, `text-foreground`, `bg-primary`, `text-primary`, etc.).

## Aplicação (Mobile)
- Arquivo: `mobile/src/theme.ts` — tokens alinhados com web.  
- Uso em telas: `Login.tsx`, `Pos.tsx`, `Dashboard.tsx` já refatoradas para tokens do Brand Kit.

## Guia de Uso
- Primária (roxo):
  - Fundo de cabeçalhos, elementos de identidade e gráficos.
- Acentos:
  - Verde neon: CTAs principais e status de sucesso.
  - Ciano: métricas-chave e elementos interativos (hover, foco, gráficos).
- Dados e métricas:
  - Use `text-foreground` para valores; `text-muted-foreground` para labels.
  - Cards: `bg-card` com `border-border`; hover com `--bg-card-hover` e `--shadow-glow`.
- Toggle de Yield:
  - Visual simples (ligar/desligar) com feedback imediato.
- Ícones-chave:
  - Escrow (cadeado/loop), Fluxo Híbrido (ponte/funil), Carteira Abstraída (cofre/gestão).

## Do / Don’t
- Do: manter alto contraste, foco em métricas, uso consistente de roxo/acentos.
- Don’t: excesso de saturação, sombras pesadas, fundos com baixo contraste.

## Recursos
- Referência visual XRPL: `1. XRPL Logo Kit/XRP Visual Guidelines.pdf`

## Próximos Passos
- Ajustar componentes que usam classes estáticas para tokens (`Header`, etc.).
- Documentar exemplos de gráficos com a paleta (`--chart-*`).
- Criar documentação de componentes compartilhados (botões, cards, métricas).