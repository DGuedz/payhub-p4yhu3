# PAYHUB — Pitch Deck (10 slides)

Observação: conteúdo alinhado ao Pitch Deck Template e aos ativos “Built on XRPL”. Bullets curtos, quantificáveis, 3–5 por slide.

## Slide 1 — Capa
- PAYHUB: Liquidez ativa para eventos (LATAM)
- Tagline: Parcelado sem desconto. Liquidez na hora, com yield.
- Built on XRPL • Escrow trustless • Auditável on‑chain
- Logos: `payhub-frontend/public/payhub-logo.svg` + `1. XRPL Logo Kit/svg/XRP Ledger - Horizontal - White.svg`

## Slide 2 — Problema
- MDR alto (3–6%) e “desconto da parcela” corrói margem
- Liquidez travada (30–60 dias); caixa imprevisível em eventos
- Risco do parcelamento é o gargalo, não a maquininha

## Slide 3 — Insight (RXP)
- RXP: o risco do parcelamento é precificado, não empurrado
- Scoring por perfil/evento; underwriting e limites dinâmicos
- Pricing (APR) calibrado pelo segmento de risco: low/mid/high
- Compartilhamento de risco atômico elimina “desconto da parcela”

## Slide 4 — Solução (PAYHUB)
- Motor RXP (risco) + AMM do ecossistema XRP (liquidez) + XRPL (settlement)
- Escrow on‑chain (XRP/RLUSD) com liberação automática
- Liquidação imediata para o merchant; yield DeFi opcional
- Governança e trilha on‑chain (transparência, auditoria)

## Slide 5 — Produto (POC real)
- Soft‑POS mobile (Expo): Login → POS → Dashboard
- Merchant Portal (Next.js): monitor de escrow e simulação
- API Node (Express) rodando em `http://localhost:3000`
- Expo Web ativo em `http://localhost:8086/` (env: `EXPO_PUBLIC_BACKEND_URL`)

## Slide 6 — Prova Técnica (Endpoints)
- Provisionamento: `POST /xrpl/setup` → carteiras issuer/payhub/merchant
- Pagamento híbrido: `POST /simulate/hybrid` → RLUSD + Escrow (txHash/sequence)
- Escrow RLUSD: `POST /escrow/rlusd/create` • `POST /escrow/rlusd/finish`
- DeFi: `POST /defi/tokenize` → token RCV • `POST /defi/borrow` → RLUSD com haircut
- Pricing: `POST /fees/quote` (pix | vista | parcelado) com `risk_segment`, `defi_apy`, `haircut_percent`

## Slide 7 — Modelo de Negócio
- Take rate por transação (1,5–2,5%), competitivo ao MDR
- Fee de liquidação imediata (escrow) + serviços de gateway
- Spread opcional de yield sobre recebíveis tokenizados
- Upsell: analytics, monitor de escrow, relatórios e compliance

## Slide 8 — Mercado
- LATAM eventos: alta penetração de parcelamento e dor de capital de giro
- Nicho inicial B2B2C: promotores e marketplaces de ingressos
- Momento favorável: eficiência financeira, custo de capital menor

## Slide 9 — Tração & POC
- Fluxos operando: Login (setup XRPL), POS (hybrid), Dashboard (tokenize+borrow)
- Mobile: `EXPO_PUBLIC_APR_FACTOR=0.98` • APY ajustável (5–8%)
- Frontend: Escrow Monitor exibindo sequência, valor e status
- Demonstração em XRPL Testnet com endpoints reais e txHash

## Slide 10 — Roadmap & Ask
- Beta com escrows reais XRPL; calibrar risco (dados RXP)
- Compliance/KYC/AML; integrações contábeis e antifraude
- Go‑to‑market: pilotos com 2–3 eventos âncora; canais B2B2C
- Ask: captação para pilotos, risco e compliance; parceiros de liquidez

---

### Anexos e Formatação (para o Template)
- Títulos e bullets: copiar para layouts do PDF; 3–5 bullets/slide
- Visual: cores/tipografia conforme `BRANDKIT.md` e "Built on XRPL"
- Imagens sugeridas: screenshots do Expo (Login/Pos/Dashboard) e do Portal (escrow monitor)
- Diagrama RXP/AMM (XRPL): arquivo `payhub-frontend/public/pitch-flow-rxp-vega-xrpl.svg` — fluxo “Checkout → Escrow XRPL → Split risco → Liquidação”
- Provas: cURLs prontos com retorno `txHash` e `sequence`:

```bash
# 1) Setup XRPL: gera e financia carteiras + trustlines RLUSD
curl -s -X POST http://localhost:3000/xrpl/setup \
  -H "Content-Type: application/json" \
  -d '{"limit":"1000000","issue_value":"1000"}'

# 2) Fluxo híbrido: BRL → RLUSD via Escrow (substitua MERCHANT_ADDRESS)
curl -s -X POST http://localhost:3000/simulate/hybrid \
  -H "Content-Type: application/json" \
  -d '{"merchant":"MERCHANT_ADDRESS","fiat_value_brl":120.00,"rate_brl_per_rlusd":1,"finish_after_seconds":60}'
# Resposta inclui: txHash, sequence

# 3) Finalizar Escrow RLUSD (use sequence retornada)
curl -s -X POST http://localhost:3000/escrow/rlusd/finish \
  -H "Content-Type: application/json" \
  -d '{"offerSequence":SEQUENCE,"owner":"PAYHUB_ADDRESS"}'

# 4) Cotação de taxas (parcelado) com suposições de risco e DeFi
curl -s -X POST http://localhost:3000/fees/quote \
  -H "Content-Type: application/json" \
  -d '{"type":"credit_parcelado","amount_brl":120.00,"installments":12,"risk_segment":"mid","defi_apy":0.08,"haircut_percent":4}'

# 5) Tokenizar recebível e tomar empréstimo (DeFi)
curl -s -X POST http://localhost:3000/defi/tokenize \
  -H "Content-Type: application/json" \
  -d '{"sale_id":"SALE-2025-001","amount_total_brl":120.00,"installments":12,"merchant":"MERCHANT_ADDRESS"}'

curl -s -X POST http://localhost:3000/defi/borrow \
  -H "Content-Type: application/json" \
  -d '{"token_id":"RCV-SALE-2025-001","rate_brl_per_rlusd":1,"haircut_percent":4,"finish_after_seconds":60,"merchant":"MERCHANT_ADDRESS"}'
```