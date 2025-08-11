"use client";

import * as React from "react";
import {
    RainbowKitProvider,
    getDefaultWallets,
    getDefaultConfig,
    darkTheme,
    lightTheme,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import { kairos } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { useTheme } from "next-themes";
import NoSSR from "@/components/no-ssr";
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
    ssr: true, // Enable SSR support
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Disable retries on server side to avoid hydration issues
            retry: (failureCount, error) => {
                if (typeof window === 'undefined') return false;
                return failureCount < 3;
            },
        },
    },
});

export function WalletProviders({ children }: { children: React.ReactNode }) {
    return (
        <NoSSR fallback={<div className="min-h-screen bg-background" />}>
            <WalletProvidersInner>{children}</WalletProvidersInner>
        </NoSSR>
    );
}

function WalletProvidersInner({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();

    const rainbowKitTheme = resolvedTheme === 'dark'
        ? darkTheme({
            accentColor: "#ff8800",
            accentColorForeground: "white",
            borderRadius: "medium",
        })
        : lightTheme({
            accentColor: "#ff8800",
            accentColorForeground: "white",
            borderRadius: "medium",
        });

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    initialChain={kairos}
                    showRecentTransactions={true}
                    theme={rainbowKitTheme}
                    locale="en-US"
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
