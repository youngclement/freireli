import { config } from "./config";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required environment variables
  if (!process.env.NEXT_PUBLIC_LOGISTICS_CONTRACT_ADDRESS) {
    errors.push("NEXT_PUBLIC_LOGISTICS_CONTRACT_ADDRESS is required");
  } else if (
    config.contract.logisticsAddress ===
    "0x1234567890123456789012345678901234567890"
  ) {
    warnings.push(
      "Contract address appears to be the default placeholder. Please update with your deployed contract address."
    );
  }

  if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
    warnings.push(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Using default value."
    );
  }

  if (!process.env.NEXT_PUBLIC_KAIROS_RPC_URL) {
    warnings.push(
      "NEXT_PUBLIC_KAIROS_RPC_URL is not set. Using default value."
    );
  }

  // Validate contract address format
  if (
    config.contract.logisticsAddress &&
    !/^0x[a-fA-F0-9]{40}$/.test(config.contract.logisticsAddress)
  ) {
    errors.push(
      "Invalid contract address format. Must be a valid Ethereum address (0x followed by 40 hex characters)."
    );
  }

  // Validate Chain ID
  if (
    isNaN(config.network.kairos.chainId) ||
    config.network.kairos.chainId !== 1001
  ) {
    warnings.push("Chain ID should be 1001 for Kairos testnet.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Development only: Log validation results
if (config.isDevelopment && typeof window === "undefined") {
  const validation = validateEnvironment();

  if (!validation.isValid) {
    console.error("❌ Environment validation failed:");
    validation.errors.forEach((error) => console.error(`  - ${error}`));
  }

  if (validation.warnings.length > 0) {
    console.warn("⚠️  Environment warnings:");
    validation.warnings.forEach((warning) => console.warn(`  - ${warning}`));
  }

  if (validation.isValid && validation.warnings.length === 0) {
    console.log("✅ Environment validation passed");
  }
}
