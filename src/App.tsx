import React, { useState, useEffect } from "react";
import SlotMachine from "./components/SlotMachine";
import "./App.css";
import navbarBackground from "./assets/condortransparent.png";
import onboard from "./utils/walletProvider"; // Import walletProvider
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES } from "./constants"; // Import constants

const App: React.FC = () => {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);

  // Function to connect to MetaMask using Web3-Onboard
  const connectWallet = async () => {
    try {
      const wallets = await onboard.connectWallet();
      if (wallets && wallets.length > 0) {
        const account = wallets[0].accounts[0].address;
        setConnectedAccount(account);
        console.log("Wallet connected:", account);

        const web3Provider = new ethers.providers.Web3Provider(wallets[0].provider);
        setProvider(web3Provider);
        setSigner(web3Provider.getSigner());
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Function to disconnect from MetaMask using Web3-Onboard
  const disconnectWallet = async () => {
    try {
      if (connectedAccount) {
        await onboard.disconnectWallet({ label: "MetaMask" });
        setConnectedAccount(null);
        setProvider(null);
        setSigner(null);
        console.log("Wallet disconnected");
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  // Automatically switch to BNB Testnet if not already connected
  const switchToTestnet = async () => {
    if (!provider) return;

    try {
      await provider.send("wallet_switchEthereumChain", [
        { chainId: "0x61" }, // BNB Testnet chain ID
      ]);
      console.log("Switched to BNB Testnet");
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.send("wallet_addEthereumChain", [
            {
              chainId: "0x61",
              chainName: "Binance Smart Chain Testnet",
              rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
              nativeCurrency: {
                name: "Test BNB",
                symbol: "tBNB",
                decimals: 18,
              },
              blockExplorerUrls: ["https://testnet.bscscan.com/"],
            },
          ]);
          console.log("BNB Testnet added and switched successfully");
        } catch (addError) {
          console.error("Failed to add BNB Testnet:", addError);
        }
      } else {
        console.error("Failed to switch network:", switchError);
      }
    }
  };

  useEffect(() => {
    if (connectedAccount && provider) {
      switchToTestnet(); // Switch to BNB Testnet automatically after connecting
    }
  }, [connectedAccount, provider]);

  return (
    <div className="app">
      <header
        className="navbar"
        style={{
          backgroundImage: `url(${navbarBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="title">Gold Condor Capital</h1>
        <nav>
          <ul>
            <li>
              <button
                onClick={connectedAccount ? disconnectWallet : connectWallet}
                style={{
                  background: connectedAccount
                    ? "linear-gradient(45deg, #ff4d4d, #8b0000)" // Red for connected
                    : "linear-gradient(45deg, #28d850, #ffdd44)", // Green for default
                  color: "#fff",
                  border: connectedAccount
                    ? "2px solid #ff4d4d"
                    : "2px solid #28d850",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "1em",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "transform 0.2s, background 0.2s",
                  margin: "5px",
                  maxWidth: "90%",
                }}
              >
                {connectedAccount ? "Connected" : "Connect Wallet"}
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <h2 className="subtitle">Glimp GCC Game</h2>
        <SlotMachine
          account={connectedAccount}
          provider={provider}
          signer={signer}
        />
      </main>
      <footer>
        <p>Enjoy playing! Good luck!</p>
      </footer>
    </div>
  );
};

export default App;
