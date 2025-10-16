# P4YHU3 (PAYHUB) — The Privacy‑First Payment Agent

PAYHUB é um hub de pagamentos com abstração de conta que unifica PIX, Cartão, Stablecoins e XRPL (XRP), priorizando privacidade, segurança e escalabilidade. Este repositório contém o MVP focado em pagamentos com Escrow na XRP Ledger, preparado para o Vega House Hackathon.

## Visão
- Privacidade em primeiro lugar: nada sensível on-chain; apenas hashes/indicadores.
- Abstração de pagamentos: cliente paga em R$ (PIX) ou cripto; liquidação ocorre na XRPL.
- Hub inteligente: arbitra provedores e taxas, oferecendo melhor rota de pagamento.

## Trilha do Hackathon
- Trilha sugerida: XRPL (pagamentos + Escrow + abstração de adoção).
- Entregáveis: código público (MIT), demo em vídeo (≤5 min), URL pública, README detalhado.

## Funcionalidades do MVP
- Criação de Escrow na XRPL (XRP por padrão; suporte a IOUs/Stablecoins em fase seguinte).
- Finalização de Escrow após prova de serviço/entrega (tempo/condição).
- API simples pronta para embedar um widget de checkout.

## Arquitetura (MVP)
- `API Gateway (Express)`: recebe pedidos, expõe endpoints de Escrow.
- `XRPL Client (xrpl.js)`: conecta Testnet/Devnet, assina e envia transações.
- `Serviço Off‑Chain`: valida evento de entrega (webhook/log) antes de finalizar Escrow.

## Endpoints (propostos)
- `POST /escrow/create` — cria um Escrow na XRPL
  - body: `{ destination, amount_xrp, finish_after_seconds }`
  - retorno: `{ txHash, sequence, owner }`
- `POST /escrow/finish` — finaliza um Escrow (após tempo/condição)
  - body: `{ offerSequence, owner }`
  - retorno: `{ txHash }`
- `GET /health` — status do serviço

## Fluxo XRPL (simplificado)
1. Comércio envia pedido com destino e valor.
2. PAYHUB cria Escrow (`EscrowCreate`) a partir da conta operadora.
3. Serviço é validado off‑chain; PAYHUB dispara `EscrowFinish`.

## Como rodar
1. Pré‑requisitos: Node.js 18+, npm, acesso à internet.
2. Crie o arquivo `.env` com base em `.env.example`.
3. Instale dependências e inicie:
   ```bash
   npm install
   npm run dev
   ```
4. Acesse `http://localhost:3000/health`.

## Variáveis de Ambiente
- `XRPL_SERVER_URL` — WebSocket do nó (ex.: `wss://s.altnet.rippletest.net:51233`).
- `PAYHUB_OPERATOR_SEED` — seed da conta operadora (apenas para Testnet em desenvolvimento).
- `PORT` — porta do servidor (default 3000).

## Próximos Passos (além do MVP)
- Suporte a IOUs/Stablecoins (RLUSD) com trustline e issuer configurável.
- Integração PIX/off‑ramp para funding automático do Escrow.
- Widget de checkout e painel de reconciliação.

## Licença
MIT — uso aberto para o hackathon e além.