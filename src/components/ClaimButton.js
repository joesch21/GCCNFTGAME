import React, { useState } from "react";
import { ethers, Contract } from "ethers";
import contractABI from "../contracts/contractABI.json"; // Adjust the path as necessary

const contractAddress = "0xb4a96eba881c1e06a80b68c3bf22bc6c934dfc6a"; // Replace with your contract's address

const ClaimButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const claimTokens = async () => {
    if (isProcessing) return;

    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install it to use this feature.");
      return;
    }

    try {
      setIsProcessing(true);

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create an ethers provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Check network
      const network = await provider.getNetwork();
      if (network.chainId !== 97) { // 97 = Binance Smart Chain Testnet
        alert("Please connect to Binance Smart Chain Testnet.");
        return;
      }

      // Check TBNB balance
      const balance = await signer.getBalance();
      const gasPrice = await provider.getGasPrice();
      const estimatedGas = ethers.BigNumber.from("21000");
      const requiredGas = ethers.utils.formatEther(gasPrice.mul(estimatedGas));

      if (balance.lt(gasPrice.mul(estimatedGas))) {
        alert(`Insufficient TBNB balance. You need at least ${requiredGas} TBNB to cover gas fees.`);
        return;
      }

      // Create contract instance
      const contract = new Contract(contractAddress, contractABI, signer);

      // Call the claimTokens function
      const tx = await contract.claimTokens();
      console.log("Transaction sent:", tx.hash);
      await tx.wait(); // Wait for the transaction to be mined

      alert("Tokens claimed successfully!");
    } catch (error) {
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
