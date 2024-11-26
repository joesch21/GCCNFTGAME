import React, { useState } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import contractABI from "../contracts/contractABI.json"; // Adjust path as needed

const contractAddress = "0xb4a96eba881c1e06a80b68c3bf22bc6c934dfc6a"; // Replace with your contract address

const ClaimButton: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const claimTokens = async () => {
    if (isProcessing) return;

    // Ensure `window.ethereum` exists
    const ethereum = window.ethereum as typeof window.ethereum & {
      request: (args: { method: string; params?: Array<any> }) => Promise<any>;
    };
    if (!ethereum) {
      alert("MetaMask is not installed. Please install it to use this feature.");
      return;
    }

    try {
      setIsProcessing(true);

      // Request account access
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];

      // Create ethers provider using `window.ethereum`
      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      // Check the connected network
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(97)) { // Compare against BigInt `97n`
        alert("Please connect to Binance Smart Chain Testnet.");
        return;
      }

      // Create contract instance
      const contract = new Contract(contractAddress, contractABI, signer);

      // Call the claimTokens function
      const tx = await contract.claimTokens();
      console.log("Transaction sent:", tx.hash);
      await tx.wait(); // Wait for the transaction to be mined

      alert("Tokens claimed successfully!");
    } catch (error: any) {
      console.error("Error claiming tokens:", error);
      if (error.code === 4001) {
        alert("Transaction rejected by the user.");
      } else {
        alert(`Failed to claim tokens: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={claimTokens}
      disabled={isProcessing}
      style={{
        padding: "10px 20px",
        backgroundColor: isProcessing ? "#ccc" : "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: isProcessing ? "not-allowed" : "pointer",
        fontSize: "1em",
        margin: "10px 0",
      }}
    >
      {isProcessing ? "Processing..." : "Claim 100 GCCT Tokens"}
    </button>
  );
};

export default ClaimButton;
