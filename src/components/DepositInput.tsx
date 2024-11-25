import React, { useState } from "react";
import { ethers } from "ethers";

interface DepositInputProps {
  account: string | null;
  signer: ethers.Signer | null;
  gctTokenAddress: string;
  withdrawalContractAddress: string;
  onDepositSuccess: (amount: number) => void;
  fetchContractBalance: () => void;
}

const DepositInput: React.FC<DepositInputProps> = ({
  account,
  signer,
  gctTokenAddress,
  withdrawalContractAddress,
  onDepositSuccess,
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

      const gctToken = new ethers.Contract(
        gctTokenAddress,
        require("../GCCToken.json"),
        signer
      );

      const withdrawalContract = new ethers.Contract(
        withdrawalContractAddress,
        require("../WithdrawWinnings.json"),
        signer
      );

      const tokenAmount = ethers.utils.parseUnits(depositAmount.toString(), 18);
      const currentAllowance = await gctToken.allowance(account, withdrawalContractAddress);

      if (currentAllowance.lt(tokenAmount)) {
        const approveTx = await gctToken.approve(withdrawalContractAddress, tokenAmount);
        await approveTx.wait();
      }

      const depositTx = await withdrawalContract.addPoints(account, tokenAmount);
      await depositTx.wait();

      // Notify the parent about the successful deposit
      onDepositSuccess(depositAmount);

      // Refresh the contract balance
      fetchContractBalance();
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
