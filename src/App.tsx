import React, { useState, useEffect } from "react";
import SlotMachine from "./components/SlotMachine";
import InstructionsModal from "./components/InstructionsModal";
import "./App.css";
import navbarBackground from "./assets/condortransparent.png";
import onboard from "./utils/walletProvider"; // Import walletProvider
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES } from "./constants"; // Import constants
import ClaimButton from "./components/ClaimButton"; // Import ClaimButton component

const App: React.FC = () => {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [approvalLoading, setApprovalLoading] = useState(false); // State for spending cap approval
  const [cooldownMessage, setCooldownMessage] = useState<string>(""); // Cooldown status message
  const [isInstructionsVisible, setIsInstructionsVisible] = useState(false); // Modal visibility state

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
        const walletSigner = web3Provider.getSigner();
        setSigner(walletSigner);

        // Initiate spending cap approval immediately after connecting
        preApproveHighSpendingCap(walletSigner, account);
        checkCooldown(walletSigner, account); // Check cooldown status after connecting
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Preemptively approve a high spending cap for ease of use
  const preApproveHighSpendingCap = async (
    signer: ethers.providers.JsonRpcSigner,
    account: string
  ) => {
    if (!signer) return;

    try {
      setApprovalLoading(true);

      const gctTokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.GCC_TOKEN,
        require("./GCCToken.json"),
        signer
      );

      const tokenVaultAddress = CONTRACT_ADDRESSES.TOKEN_VAULT;
      const approveAmount = ethers.utils.parseUnits("10000", 18); // Approve 10,000 tokens

      const currentAllowance = await gctTokenContract.allowance(account, tokenVaultAddress);

      if (currentAllowance.lt(approveAmount)) {
        console.log(`Current allowance (${currentAllowance.toString()}) is insufficient. Approving...`);
        const approveTx = await gctTokenContract.approve(tokenVaultAddress, approveAmount);
        console.log("Approval transaction submitted. Waiting for confirmation...");
        await approveTx.wait();
        console.log("High spending cap approved (10,000 tokens)!");
      } else {
        console.log("Sufficient allowance already exists. Skipping approval.");
      }
    } catch (error) {
      console.error("Failed to approve high spending cap:", error);
      alert("Failed to approve spending cap. Please try again.");
    } finally {
      setApprovalLoading(false);
    }
  };

  // Function to switch to BNB Testnet
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

  // Check the cooldown period status
  const checkCooldown = async (signer: ethers.providers.JsonRpcSigner, account: string) => {
    try {
      const gctTokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.GCC_TOKEN,
        require("./GCCToken.json"),
        signer
      );

      const lastClaimed = await gctTokenContract.getLastClaimed(account); // Replace with actual contract method
      const cooldownPeriod = await gctTokenContract.cooldownPeriod(); // Replace with actual contract method
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime < lastClaimed + cooldownPeriod) {
        const waitTime = lastClaimed + cooldownPeriod - currentTime;
        setCooldownMessage(
          `Please wait ${waitTime} seconds before claiming again.`
        );
      } else {
        setCooldownMessage("You are eligible to claim your tokens.");
      }
    } catch (error) {
      console.error("Failed to check cooldown period:", error);
      setCooldownMessage("Error fetching cooldown status. Please try again.");
    }
  };

  // Open Faucet Link in a Popup Window
  const openFaucet = () => {
    window.open(
      "https://testnet.binance.org/faucet-smart",
      "_blank",
      "width=800,height=600,scrollbars=yes"
    );
  };

  useEffect(() => {
    if (connectedAccount && signer) {
      checkCooldown(signer, connectedAccount); // Check cooldown on account change
      switchToTestnet(); // Switch to BNB Testnet automatically after connecting
    }
  }, [connectedAccount, signer]);

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
            <li>
              <button
                onClick={() => setIsInstructionsVisible(true)}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(45deg, #ffa500, #ff4500)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1em",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                How to Play
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        {approvalLoading && (
          <div className="approval-loading">
            <p>Approving spending cap... Please wait.</p>
          </div>
        )}
        <h2 className="subtitle">Gimp GCC Game</h2>
        <p style={{ color: "blue", textAlign: "center" }}>{cooldownMessage}</p>
        <SlotMachine
          account={connectedAccount}
          provider={provider}
          signer={signer}
        />
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p>Once you have Test BNB, claim your GCC tokens to start playing.</p>
          <ClaimButton />
          <button
            onClick={openFaucet}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#f0ad4e",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1em",
            }}
          >
            Get Free BNB from Faucet
          </button>
        </div>
      </main>
      <footer>
        <p>Enjoy playing! Good luck!</p>
      </footer>
      {/* Add Modal */}
      <InstructionsModal
        isVisible={isInstructionsVisible}
        onClose={() => setIsInstructionsVisible(false)}
      />
    </div>
  );
};

export default App;
