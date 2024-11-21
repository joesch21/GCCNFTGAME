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

      // Ensure connected to the correct network (BNB Testnet)
      const switchNetwork = async () => {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x61" }], // Example: BNB Testnet
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            alert("Please add the network to MetaMask and try again.");
          } else {
            console.error("Failed to switch network:", switchError);
            throw switchError;
          }
        }
      };
      await switchNetwork();

      // Get the signer
      const signer = provider.getSigner();

      // Create contract instance
      const contract = new Contract(contractAddress, contractABI, signer);

      // Call the claimTokens function
      const tx = await contract.claimTokens();
      await tx.wait(); // Wait for the transaction to be mined

      alert("Tokens claimed successfully!");
    } catch (error) {
      console.error("Error claiming tokens:", error);
      alert(`Failed to claim tokens: ${error.message}`);
    }
  };

  return <button onClick={claimTokens}>Claim 100 GCCT Tokens</button>;
};

export default ClaimButton;
