import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import WithdrawWinningsABI from "../contracts/WithdrawWinningsABI.json";

interface WithdrawalProps {
  signer: ethers.Signer | null;
  account: string; // Ensure account is always passed as a string
}

const Withdrawal: React.FC<WithdrawalProps> = ({ signer, account }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [playerPoints, setPlayerPoints] = useState<number>(0);

  const CONTRACT_ADDRESS = "0x57229E7F48eb636B166Aeca517766d43E3C0C02a"; // Replace with your deployed contract address

  // Fetch player points
  const fetchPlayerPoints = async () => {
    if (!signer || !account) return;

    try {
      const withdrawWinningsContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        WithdrawWinningsABI,
        signer
      );
      const points = await withdrawWinningsContract.points(account);
      setPlayerPoints(parseFloat(ethers.utils.formatUnits(points, 18))); // Convert from wei to human-readable
    } catch (error) {
      console.error("Failed to fetch player points:", error);
    }
  };

  // Withdraw winnings function
  const withdrawWinnings = async () => {
    if (!signer) {
      alert("Please connect your wallet.");
      return;
    }

    if (playerPoints <= 0) {
      alert("No winnings to withdraw.");
      return;
    }

    try {
      setIsProcessing(true);

      const withdrawWinningsContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        WithdrawWinningsABI,
        signer
      );

      const tx = await withdrawWinningsContract.withdrawWinnings();
      console.log("Transaction sent:", tx.hash);

      await tx.wait(); // Wait for the transaction to be mined
      alert(`Winnings withdrawn successfully! You received ${playerPoints} GCCT.`);

      // Reset points and refresh
      setPlayerPoints(0);
    } catch (error) {
      console.error("Error withdrawing winnings:", error);
      alert("Failed to withdraw winnings. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchPlayerPoints();
  }, [signer, account]); // Refetch points when signer or account changes

  return (
    <div>
      <p>Your Winnings: {playerPoints.toFixed(2)} GCCT</p>
      <button
        onClick={withdrawWinnings}
        disabled={isProcessing || playerPoints === 0}
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
        {isProcessing ? "Processing..." : "Withdraw Winnings"}
      </button>
    </div>
  );
};

export default Withdrawal;
