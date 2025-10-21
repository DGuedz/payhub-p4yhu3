import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, /* base, */ zora } from 'wagmi/chains';

// Custom XRPL EVM Sidechain configuration
const xrplEvmSidechain = {
  id: 1440002,
  name: 'XRPL EVM Sidechain',
  network: 'xrpl-evm-sidechain',
  nativeCurrency: {
    name: 'XRP',
    symbol: 'XRP',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-evm-sidechain.xrpl.org'] },
    public: { http: ['https://rpc-evm-sidechain.xrpl.org'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://evm-sidechain.xrpl.org/' },
  },
} as const;

// Get project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'YOUR_PROJECT_ID';

// Create wagmi config using RainbowKit's getDefaultConfig
// This simplifies the configuration and avoids import issues
export const config = getDefaultConfig({
  appName: 'PAYHUB Demo',
  projectId: projectId,
  // Removed Base chain to prevent COOP checks from @base-org/account
  chains: [mainnet, polygon, optimism, arbitrum, zora, xrplEvmSidechain],
  // Optional: Configure RPC URLs for specific chains if needed
  transports: {
    [xrplEvmSidechain.id]: { http: 'https://rpc-evm-sidechain.xrpl.org' },
  },
  // Optional: Configure other settings
  ssr: true, // Enable server-side rendering
});