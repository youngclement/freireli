"use client";

import * as React from "react";
import {
    RainbowKitProvider,
    getDefaultWallets,
    getDefaultConfig,
    darkTheme,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import { kairos } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { config as appConfig } from "@/lib/config";
import "@rainbow-me/rainbowkit/styles.css";

const { wallets } = getDefaultWallets();

const wagmiConfig = getDefaultConfig({
    appName: appConfig.app.name,
    projectId: appConfig.walletConnect.projectId,
    wallets: [
        ...wallets,
        {
            groupName: "Other",
            wallets: [trustWallet, ledgerWallet],
        },
    ],
    chains: [kairos],
    transports: {
        [kairos.id]: http(appConfig.network.kairos.rpcUrl),
    },
    ssr: true,
});

const queryClient = new QueryClient();

export function WalletProviders({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    initialChain={kairos}
                    showRecentTransactions={true}
                    theme={darkTheme({
                        accentColor: "#ff8800",
                        accentColorForeground: "white",
                        borderRadius: "none",
                    })}
                    locale="en-US"
                >
                    {mounted && children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
