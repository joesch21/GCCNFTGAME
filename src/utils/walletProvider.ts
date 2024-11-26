import Onboard from "@web3-onboard/core";
import metamaskModule from "@web3-onboard/metamask";
import { ethers } from "ethers";

// Load Infura Project ID from .env file
const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

// BSC Testnet RPC URL
const BSC_TESTNET_RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545";

// Infura fallback RPC for tBNB Testnet (Example Infura setup)
const INFURA_RPC_URL = `https://bsc-testnet.infura.io/v3/${INFURA_PROJECT_ID}`;

// Initialize Infura Provider for Fallback
const infuraProvider = new ethers.JsonRpcProvider(INFURA_RPC_URL);

// MetaMask Module Initialization
const metamask = metamaskModule({
  options: {
    dappMetadata: {
      name: "Gold Condor Capital Game",
    },
  },
});

// Onboard.js Initialization for Wallet Management
const onboard = Onboard({
  wallets: [metamask],
  chains: [
    {
      id: "0x61", // Chain ID for Binance Smart Chain Testnet
      token: "tBNB", // Symbol for Testnet BNB
      label: "Binance Smart Chain Testnet",
      rpcUrl: BSC_TESTNET_RPC_URL, // BSC Testnet RPC URL
    },
  ],
});

// Utility Functions

/**
 * Connect Wallet via Onboard.js
 */
export const connectWallet = async () => {
  try {
    const wallets = await onboard.connectWallet();
    if (wallets && wallets.length > 0) {
      const account = wallets[0].accounts[0].address;
      const web3Provider = new ethers.BrowserProvider(wallets[0].provider);
      const signer = await web3Provider.getSigner();

      return { account, web3Provider, signer };
    } else {
      throw new Error("No wallet connected");
    }
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    return { account: null, web3Provider: infuraProvider, signer: null }; // Fallback to Infura
  }
};

/**
 * Disconnect Wallet via Onboard.js
 */
export const disconnectWallet = async () => {
  try {
    await onboard.disconnectWallet({ label: "MetaMask" });
    console.log("Wallet disconnected successfully");
  } catch (error) {
    console.error("Failed to disconnect wallet:", error);
  }
};

/**
 * Get Fallback Provider (Infura for tBNB Testnet)
 */
export const getFallbackProvider = () => {
  return infuraProvider;
};

export default onboard;
