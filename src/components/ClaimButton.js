import React from "react";
import { ethers, Contract } from "ethers";
import contractABI from "../contracts/contractABI.json"; // Adjust the path as necessary

const contractAddress = "0xb4a96eba881c1e06a80b68c3bf22bc6c934dfc6a"; // Replace with your contract's address

const ClaimButton = () => {
  const claimTokens = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install it to use this feature.");
      return;
    }

    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create an ethers provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Check TBNB balance
      const balance = await signer.getBalance();
      const balanceInEther = ethers.utils.formatEther(balance);

      if (parseFloat(balanceInEther) < 0.01) { // Replace 0.01 with an appropriate gas threshold
        alert("Insufficient TBNB balance to cover gas fees. Please top up your wallet.");
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
      alert(`Failed to claim tokens: ${error.message}`);
    }
  };

  return (
    <button
      onClick={claimTokens}
      style={{
        padding: "10px 20px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1em",
        margin: "10px 0",
      }}
    >
      Claim 100 GCCT Tokens
    </button>
  );
};

export default ClaimButton;
