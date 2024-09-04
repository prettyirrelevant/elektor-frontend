import { http, createConfig } from 'wagmi';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { polygonAmoy, polygon } from 'wagmi/chains';

export const config = createConfig({
  chains: [polygon, polygonAmoy],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
