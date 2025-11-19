"use client";
import { chains } from "@lens-chain/sdk/viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { createContext, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { lens } from "wagmi/chains";
import { ErrorData, SuccessData } from "./components/types/common.types";

const queryClient = new QueryClient();

export const ModalContext = createContext<
  | {
      showSuccess: (message: string, txHash?: string) => void;
      showError: (message: string) => void;
      hideSuccess: () => void;
      hideError: () => void;
      successData: SuccessData | null;
      errorData: ErrorData | null;
    }
  | undefined
>(undefined);

export const config = createConfig(
  getDefaultConfig({
    appName: "Genesis",
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    appUrl: "https://genesis.digitalax.xyz",
    appIcon: "https://genesis.digitalax.xyz/favicon.ico",
    chains: [chains.mainnet],
    connectors: [],
    transports: {
      [lens.id]: http(),
    },
    ssr: true,
  })
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);

  const showSuccess = (message: string, txHash?: string) => {
    setSuccessData({ message, txHash });
  };

  const showError = (message: string) => {
    setErrorData({ message });
  };

  const hideSuccess = () => {
    setSuccessData(null);
  };

  const hideError = () => {
    setErrorData(null);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-font-family": '"Nerd Semi", cursive',
          }}
        >
          <ModalContext.Provider
            value={{
              showSuccess,
              showError,
              hideSuccess,
              hideError,
              successData,
              errorData,
            }}
          >
            {children}
          </ModalContext.Provider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
