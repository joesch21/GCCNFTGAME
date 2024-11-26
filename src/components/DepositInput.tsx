import React, { useState } from "react";
import { ethers, JsonRpcSigner, parseUnits, toQuantity } from "ethers"; // Updated imports

interface DepositInputProps {
  account: string;
  signer: JsonRpcSigner | null;
  gctTokenAddress: string;
  withdrawalContractAddress: string;
  fetchPoints: () => void;
  fetchContractBalance: () => void;
}

const DepositInput: React.FC<DepositInputProps> = ({
  account,
  signer,
  gctTokenAddress,
  withdrawalContractAddress,
  fetchPoints,
  fetchContractBalance,
}) => {
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [loading, setLoading] = useState(false);

  const depositTokens = async () => {
    if (!signer || !account || depositAmount <= 0) {
      alert("Invalid deposit amount or wallet not connected.");
      return;
    }

    try {
      setLoading(true);

      // Create contract instances
      const gctToken = new ethers.Contract(
        gctTokenAddress,
        require("../contracts/GCCToken.json"),
        signer
      );

      const withdrawalContract = new ethers.Contract(
        withdrawalContractAddress,
        require("../contracts/WithdrawWinningsABI.json"),
        signer
      );

      // Parse deposit amount to token units
      const tokenAmount = parseUnits(depositAmount.toString(), 18);

      // Check current allowance
      const currentAllowance = await gctToken.allowance(account, withdrawalContractAddress);

      // If allowance is insufficient, approve the required amount
      if (currentAllowance < tokenAmount) {
        const approveTx = await gctToken.approve(withdrawalContractAddress, tokenAmount);
        await approveTx.wait();
      }

      // Call the deposit function with a manual gas limit
      const depositTx = await withdrawalContract.addPoints(account, tokenAmount, {
        gasLimit: toQuantity(300000), // Correctly formatted gas limit
      });
      await depositTx.wait();

      // Refresh points and contract balance
      fetchPoints();
      fetchContractBalance();
      alert("Deposit successful!");
    } catch (error: any) {
      console.error("Deposit failed:", error);
      alert(error.message || "Failed to deposit tokens.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-input">
      <input
        type="number"
        value={depositAmount}
        onChange={(e) => setDepositAmount(Number(e.target.value))}
        disabled={loading}
        placeholder="Deposit Amount"
      />
      <button onClick={depositTokens} disabled={loading || depositAmount <= 0}>
        {loading ? "Processing..." : `Deposit ${depositAmount} Tokens`}
      </button>
    </div>
  );
};

export default DepositInput;
