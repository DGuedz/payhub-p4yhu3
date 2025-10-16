# P4YHU3 (PAYHUB) — The Privacy‑First Payment Agent

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18%2B-green.svg)
![Express.js](https://img.shields.io/badge/express.js-4.x-orange.svg)
![XRPL](https://img.shields.io/badge/XRPL-stable-brightgreen.svg)

PAYHUB é um hub de pagamentos com abstração de conta que unifica PIX, Cartão, Stablecoins e XRPL (XRP), priorizando privacidade, segurança e escalabilidade. Este repositório contém o MVP focado em pagamentos com Escrow na XRP Ledger.

## Sobre o Projeto

PAYHUB foi desenvolvido com a visão de criar uma camada de abstração de pagamentos que simplifica a interação com múltiplas formas de liquidação, mantendo a privacidade do usuário como pilar central.

- **Privacidade em Primeiro Lugar:** Nenhuma informação sensível é armazenada on-chain. Apenas hashes e indicadores são utilizados.
- **Abstração de Pagamentos:** Permite que clientes paguem em Reais (PIX) ou criptomoedas, com a liquidação ocorrendo de forma transparente na XRP Ledger.
- **Hub Inteligente:** O sistema é projetado para arbitrar provedores e taxas, otimizando a rota de pagamento para eficiência e baixo custo.

## Começando

Para executar o projeto localmente, siga os passos abaixo.

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm

### Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/payhub.git
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Crie um arquivo `.env` a partir do `.env.example` e preencha as variáveis de ambiente necessárias.

## Uso

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`. Você pode verificar o status do serviço acessando `http://localhost:3000/health`.

### Endpoints da API

- `GET /health`: Verifica o status do serviço.
- `POST /escrow/create`: Cria um Escrow em XRP.
- `POST /escrow/finish`: Finaliza um Escrow.
- `POST /xrpl/setup`: Configura contas, trustlines e emissão de RLUSD na Testnet.
- `POST /escrow/rlusd/create`: Cria um Escrow de RLUSD (ou fallback para Payment).
- `POST /escrow/rlusd/finish`: Finaliza um Escrow de RLUSD.

Para exemplos detalhados de `curl`, consulte a versão anterior deste README.

## Roadmap

- [ ] Suporte completo a IOUs/Stablecoins (RLUSD) com `trustline` e `issuer` configuráveis.
- [ ] Integração com PIX e provedores de off-ramp para funding automático do Escrow.
- [ ] Desenvolvimento de um widget de checkout e um painel de reconciliação.

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
