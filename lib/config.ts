// Environment configuration
export const config = {
  // Wallet & RainbowKit
  walletConnect: {
    projectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
      "455a9939d641d79b258424737e7f9205",
  },

  // Contract
  contract: {
    logisticsAddress:
      process.env.NEXT_PUBLIC_LOGISTICS_CONTRACT_ADDRESS ||
      "0x5c872245116f8ec780dea1156f35bd43b4084871", // Updated to match the contract address used in RemixIDE
  },

  // Network
  network: {
    kairos: {
      rpcUrl:
        process.env.NEXT_PUBLIC_KAIROS_RPC_URL ||
        "https://rpc.ankr.com/klaytn_testnet",
      chainId: parseInt(process.env.NEXT_PUBLIC_KAIROS_CHAIN_ID || "1001"),
      explorerUrl:
        process.env.NEXT_PUBLIC_KAIROS_EXPLORER_URL ||
        "https://kairos.kaiascope.com",
    },
  },

  // Application
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Freireli Logistics",
    description:
      process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
      "Hệ thống theo dõi logistics sử dụng blockchain technology",
  },

  // External URLs
  external: {
    faucetUrl:
      process.env.NEXT_PUBLIC_FAUCET_URL ||
      "https://kairos.wallet.klaytn.foundation/faucet",
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

// Type-safe environment variables
export const env = {
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_LOGISTICS_CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_LOGISTICS_CONTRACT_ADDRESS,
  NEXT_PUBLIC_KAIROS_RPC_URL: process.env.NEXT_PUBLIC_KAIROS_RPC_URL,
  NEXT_PUBLIC_KAIROS_CHAIN_ID: process.env.NEXT_PUBLIC_KAIROS_CHAIN_ID,
  NEXT_PUBLIC_KAIROS_EXPLORER_URL: process.env.NEXT_PUBLIC_KAIROS_EXPLORER_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  NEXT_PUBLIC_FAUCET_URL: process.env.NEXT_PUBLIC_FAUCET_URL,
  NODE_ENV: process.env.NODE_ENV,
} as const;
