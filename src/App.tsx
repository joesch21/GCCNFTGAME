import React, { useState, useEffect } from "react";
import SlotMachine from "./components/SlotMachine";
import InstructionsModal from "./components/InstructionsModal";
import "./App.css";
import navbarBackground from "./assets/condortransparent.png";
import onboard, { connectWallet, disconnectWallet } from "./utils/walletProvider";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { CONTRACT_ADDRESSES } from "./constants";
import ClaimButton from "./components/ClaimButton";

const App: React.FC = () => {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<any | null>(null);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [cooldownMessage, setCooldownMessage] = useState<string>(
    "You are eligible to claim your tokens."
  );
  const [isInstructionsVisible, setIsInstructionsVisible] = useState(false);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    const { account, web3Provider, signer } = await connectWallet();
    if (account && web3Provider && signer) {
      setConnectedAccount(account);
      setProvider(web3Provider);
      setSigner(signer);
      await preApproveHighSpendingCap(signer, account);
      await checkCooldown(signer, account);
    }
  };

  // Handle wallet disconnection
  const handleDisconnectWallet = async () => {
    await disconnectWallet();
    setConnectedAccount(null);
    setProvider(null);
    setSigner(null);
  };

  // Pre-approve spending cap
  const preApproveHighSpendingCap = async (signer: any, account: string) => {
    if (!signer) return;

    try {
      setApprovalLoading(true);
      const gctTokenContract = new Contract(
        CONTRACT_ADDRESSES.GCC_TOKEN,
        require("./GCCToken.json"),
        signer
      );

      const tokenVaultAddress = CONTRACT_ADDRESSES.TOKEN_VAULT;
      const approveAmount = parseUnits("10000", 18);

      const currentAllowance = await gctTokenContract.allowance(account, tokenVaultAddress);

      if (BigInt(currentAllowance) < BigInt(approveAmount)) {
        const approveTx = await gctTokenContract.approve(tokenVaultAddress, approveAmount);
        await approveTx.wait();
      }
    } catch (error) {
      console.error("Failed to approve spending cap:", error);
      alert("Failed to approve spending cap. Please try again.");
    } finally {
      setApprovalLoading(false);
    }
  };

  // Check cooldown status
  const checkCooldown = async (signer: any, account: string) => {
    try {
      const gctTokenContract = new Contract(
        CONTRACT_ADDRESSES.GCC_TOKEN,
        require("./GCCToken.json"),
        signer
      );

      const lastClaimed = await gctTokenContract.getLastClaimed(account);
      const cooldownPeriod = await gctTokenContract.cooldownPeriod();
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime < Number(lastClaimed) + Number(cooldownPeriod)) {
        const waitTime = Number(lastClaimed) + Number(cooldownPeriod) - currentTime;
        setCooldownMessage(`Please wait ${waitTime} seconds before claiming again.`);
      } else {
        setCooldownMessage("You are eligible to claim your tokens.");
      }
    } catch (error) {
      console.error("Failed to check cooldown:", error);
      setCooldownMessage("Error checking cooldown. Please try again later.");
    }
  };

  // Open Binance Testnet Faucet
  const openFaucet = () => {
    window.open(
      "https://testnet.binance.org/faucet-smart",
      "_blank",
      "width=800,height=600,scrollbars=yes"
    );
  };

  // Auto-check on wallet connection
  useEffect(() => {
    if (connectedAccount && signer) {
      checkCooldown(signer, connectedAccount);
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
                onClick={connectedAccount ? handleDisconnectWallet : handleConnectWallet}
                className="wallet-button"
              >
                {connectedAccount ? "Disconnect Wallet" : "Connect Wallet"}
              </button>
            </li>
            <li>
              <button
                onClick={() => setIsInstructionsVisible(true)}
                className="instructions-button"
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
        <SlotMachine
          account={connectedAccount || ""}
          provider={provider}
          signer={signer}
        />
        <div className="faucet-section">
          <p>Once you have Test BNB, claim your GCC tokens to start playing.</p>
          <ClaimButton />
          <p style={{ color: "red", fontSize: "14px" }}>{cooldownMessage}</p>
          <button onClick={openFaucet} className="faucet-button">
            Get Free BNB from Faucet
          </button>
        </div>
      </main>
      <footer>
        <p>Enjoy playing! Good luck!</p>
      </footer>
      <InstructionsModal
        isVisible={isInstructionsVisible}
        onClose={() => setIsInstructionsVisible(false)}
      />
    </div>
  );
};

export default App;
