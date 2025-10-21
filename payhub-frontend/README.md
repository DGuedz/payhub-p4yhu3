# Payment agent simulations

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/dgs-projects-ac3c4a7c/v0-payment-agent-simulations)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/sbABp72fkID)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/dgs-projects-ac3c4a7c/v0-payment-agent-simulations](https://vercel.com/dgs-projects-ac3c4a7c/v0-payment-agent-simulations)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/sbABp72fkID](https://v0.app/chat/projects/sbABp72fkID)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Deploy & Submissão (Hackathon)

- Projeto Vercel: **payhub-p4yhu3-cs**
- Root Directory: `payhub-frontend`
- Envs (Produção):
  - `NEXT_PUBLIC_BACKEND_URL=https://SEU_BACKEND_PUBLICO`
  - `NEXT_PUBLIC_PROJECT_ID=SEU_WALLETCONNECT_PROJECT_ID`
  - `XRPL_WS_URL=wss://s.altnet.rippletest.net:51233/`
  - `XRPL_FAUCET_URL=https://faucet.altnet.rippletest.net/accounts`

### Passos de Deploy (Vercel)
1. Em “payhub-p4yhu3-cs”, verifique `Root Directory = payhub-frontend`.
2. Adicione/atualize as variáveis acima em “Settings → Environment Variables”.
3. Redeploy o projeto. Vercel fará o build e publicará automaticamente.

### Configuração Local
Crie `payhub-frontend/.env.local`:
