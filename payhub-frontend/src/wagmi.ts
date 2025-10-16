// src/wagmi.ts

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, arbitrum, sepolia } from "wagmi/chains";
import { http } from "wagmi";

// ** IMPORTANTE: Para produção, substitua por seu Project ID do WalletConnect Cloud **
// Para o hackathon, usando um ID de demonstração
const projectId = "2f05a7cac472ced85b0c3d0c6f74f0f2"; 

export const config = getDefaultConfig({
  appName: "P4YHU3 - PAYHUB",
  projectId: projectId,
  chains: [mainnet, polygon, arbitrum, sepolia], // Chains EVM suportadas
  ssr: false, // Para aplicações client-side
});