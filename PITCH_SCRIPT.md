# PAYHUB — Pitch (script)

## One‑liner
Parcelado sem desconto. Liquidez na hora, com yield — Built on XRPL.

## Pitch de 60 segundos
LATAM vive de parcelado, mas o comerciante perde margem e fica sem caixa: MDR alto e “desconto da parcela” prendem o dinheiro por 30–60 dias. O problema não é a maquininha; é o risco do parcelamento. O PAYHUB resolve na origem: usa o motor RXP para precificar risco, liquidez exclusivamente via AMM do ecossistema XRP e XRPL para liquidação trustless com Escrow. Resultado: a venda parcelada vira liquidez imediata em RLUSD, sem desconto — e o caixa rende 5–8% APY automaticamente. Já temos POC real: mobile (Expo) e portal (Next.js) chamando a API em produção local. Em `POST /simulate/hybrid`, geramos `txHash` e `sequence`; em `POST /escrow/rlusd/finish`, liberamos o escrow no ledger. É simples: checkout → risco calibrado → escrows on‑chain → liquidação agora. PAYHUB: a plataforma que destrava capital e dá previsibilidade ao mercado de eventos.

## Pitch de 2 minutos
- Problema: taxas altas e liquidez travada no parcelado; fluxo de caixa imprevisível mata eventos e empreendedores.
- Insight (RXP): risco do parcelamento deve ser precificado e compartilhado, não empurrado ao comerciante.
- Solução: RXP (pricing/underwriting) + AMM do ecossistema XRP (liquidez on‑chain) + XRPL (Escrow trustless). Liquidação imediata para o merchant; yield automático no excedente de caixa. Observação: a Vega organiza o hackathon; não provê liquidez.
- Produto: Soft‑POS (Expo) e Portal (Next.js) com monitor de escrow e simulador de transações. API Node com endpoints reais: `/xrpl/setup`, `/simulate/hybrid`, `/escrow/rlusd/create|finish`, `/fees/quote`, `/defi/tokenize|borrow`.
- Prova: a demo retorna `txHash` e `sequence` on‑chain; `fees/quote` demonstra redução de custo no crédito parcelado, evitando o “desconto da parcela”. O diagrama `pitch-flow-rxp-vega-xrpl.svg` mostra o processo completo (liquidez via AMM do ecossistema XRP).
- Mercado: eventos e marketplaces B2B2C na LATAM — alta penetração de parcelamento e dor de capital de giro.
- Modelo: take rate por transação (1,5–2,5%), fee de liquidação (escrow) e spread opcional de yield sobre recebíveis tokenizados.
- Go‑to‑market: pilotos com 2–3 eventos âncora e integrações com gateways/ticketing.
- Ask: captação para risco, compliance e pilotos; parceiros de liquidez.

## Claims verificáveis (POC)
- Liquidação imediata com Escrow XRPL: `POST /simulate/hybrid` + `POST /escrow/rlusd/finish` → `txHash`, `sequence`.
- Economia no parcelado: `POST /fees/quote` com `risk_segment=mid` mostra fee total inferior ao “desconto da parcela”.
- Liquidez com haircut: `POST /defi/tokenize` → `token_id`; `POST /defi/borrow` libera RLUSD com haircut 4% (configurável).

## Como demonstrar (roteiro rápido)
1) Rodar `xrpl/setup` e usar o `merchant.address` retornado.
2) Rodar `simulate/hybrid` com `fiat_value_brl` e capturar `sequence`.
3) Rodar `escrow/rlusd/finish` usando a `sequence`.
4) Rodar `fees/quote` para crédito parcelado e comparar com prática de mercado.
5) Rodar `defi/tokenize` + `defi/borrow` e mostrar RLUSD com haircut no escrow.

## Links locais
- Frontend: `http://localhost:3010/` • SVG: `http://localhost:3010/pitch-flow-rxp-vega-xrpl.svg`
- Expo Web: `http://localhost:8086/`
- Deck com slides: `~/Documents/PAYHUB (P4YHU3)/PITCH_DECK.md`