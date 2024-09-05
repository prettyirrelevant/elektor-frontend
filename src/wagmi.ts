import { http, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [
    injected(),
    // coinbaseWallet(),
    // walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [polygonAmoy.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
