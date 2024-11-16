import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SlotItem from './SlotItem';
import { useSound } from '../hooks/useSound';
import { SLOT_ITEMS, SPIN_COST, CONTRACT_ADDRESSES } from '../constants'; // Import constants
import { getSlotCombination, calculatePayout } from '../utils/utils';
import onboard from '../utils/walletProvider'; // Import walletProvider
import { SpinnerOverlay, Loader } from './Slot.styles'; // Import styled spinner components

interface SlotMachineProps {
  account: string | null;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ account }) => {
  const [spinning, setSpinning] = useState(false);
  const [displayedCombination, setDisplayedCombination] = useState(Array(3).fill(SLOT_ITEMS[0]));
  const [points, setPoints] = useState(0);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenVault, setTokenVault] = useState<ethers.Contract | null>(null);
  const [gctToken, setGctToken] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false); // For loading states
  const [depositLoading, setDepositLoading] = useState(false); // Separate loading state for deposits
  const [depositAmount, setDepositAmount] = useState<number>(10); // New state for user-input deposit amount

  const playSound = useSound();

  // Connect to MetaMask and set up contract instances
  const connectWallet = async () => {
    const wallets = await onboard.connectWallet();
    if (wallets && wallets.length > 0) {
      const walletAccount = wallets[0].accounts[0].address;
      setWalletAddress(walletAccount);
      console.log("Wallet connected:", walletAccount);

      const provider = new ethers.providers.Web3Provider(wallets[0].provider);
      const signer = provider.getSigner();

      const tokenVaultContract = new ethers.Contract(
        CONTRACT_ADDRESSES.TOKEN_VAULT,
        require('../TokenVault.json'),
        signer
      );
      setTokenVault(tokenVaultContract);

      const gctTokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.GCC_TOKEN,
        require('../GCCToken.json'),
        signer
      );
      setGctToken(gctTokenContract);

      // Fetch initial points balance
      updatePoints();
    }
  };

  // Fetch and update points balance from the contract
  const updatePoints = async () => {
    if (!tokenVault || !walletAddress) return;

    try {
      const balance = await tokenVault.balances(walletAddress);
      const formattedBalance = parseFloat(ethers.utils.formatUnits(balance, 18));
      setPoints(formattedBalance);
    } catch (error) {
      console.error('Failed to fetch points:', error);
      alert("Failed to fetch points balance. Please try again.");
    }
  };

  useEffect(() => {
    if (account) {
      setWalletAddress(account);
    } else {
      connectWallet();
    }
  }, [account]);

  const depositTokens = async () => {
    if (!gctToken || !tokenVault || depositAmount <= 0) return;

    try {
      setDepositLoading(true); // Show spinner during the deposit process

      const tokenAmount = ethers.utils.parseUnits(depositAmount.toString(), 18);

      // Step 1: Subtle approval process
      console.log(`Checking approval for ${depositAmount} GCCT tokens...`);
      const currentAllowance = await gctToken.allowance(walletAddress, CONTRACT_ADDRESSES.TOKEN_VAULT);

      if (currentAllowance.lt(tokenAmount)) {
        console.log(`Current allowance (${currentAllowance.toString()}) is insufficient. Approving...`);
        const approveTx = await gctToken.approve(CONTRACT_ADDRESSES.TOKEN_VAULT, tokenAmount);
        console.log("Approval transaction submitted. Waiting for confirmation...");
        await approveTx.wait();
        console.log("Approval successful!");
      } else {
        console.log("Sufficient allowance already exists. Skipping approval step.");
      }

      // Step 2: Proceed to deposit
      console.log("Depositing tokens...");
      const depositTx = await tokenVault.deposit(tokenAmount);
      await depositTx.wait();
      console.log(`Deposited ${depositAmount} GCCT tokens.`);

      // Update user's points after deposit
      setPoints(prevPoints => prevPoints + depositAmount);
      updatePoints(); // Refresh points from the contract
    } catch (error) {
      console.error("Deposit failed:", error);
      alert(
        "Something went wrong! Please check your wallet and try again. If the spending cap is pending, wait for it to complete."
      );
    } finally {
      setDepositLoading(false); // Hide spinner
    }
  };

  const cashOut = async () => {
    if (!tokenVault || points <= 0) return;

    try {
      setLoading(true); // Show spinner during cash-out process

      const tokenAmount = ethers.utils.parseUnits(points.toString(), 18);
      const withdrawTx = await tokenVault.withdraw(tokenAmount);
      await withdrawTx.wait();

      console.log(`Successfully cashed out ${points} tokens.`);
      setPoints(0); // Reset points after successful cash-out
    } catch (error) {
      console.error("Cash out failed:", error);
      alert("Cash out failed. Please try again.");
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  // Handle slot machine spin
  const spinSlots = () => {
    if (spinning || points < SPIN_COST) return; // Prevent spin if already spinning or insufficient points
    setSpinning(true);
    setPoints(prevPoints => prevPoints - SPIN_COST); // Deduct spin cost
    playSound('spin');

    const spinInterval = setInterval(() => {
      const newCombination = getSlotCombination();
      setDisplayedCombination(newCombination);
    }, 100); // Speed of spin animation

    setTimeout(() => {
      clearInterval(spinInterval);
      setSpinning(false);

      const finalCombination = getSlotCombination();
      setDisplayedCombination(finalCombination);

      const payoutMultiplier = calculatePayout(finalCombination);
      if (payoutMultiplier > 0) {
        playSound('win');
        const winnings = payoutMultiplier * SPIN_COST;
        console.log(`You win! Payout multiplier: ${payoutMultiplier}x, winnings: ${winnings} points`);
        setPoints(prevPoints => prevPoints + winnings);
      } else {
        playSound('lose');
        console.log("No win. Better luck next time!");
      }
    }, 3000); // Duration of spin
  };

  return (
    <div className="slot-game">
      {(loading || depositLoading) && (
        <SpinnerOverlay>
          <Loader />
          <p>{loading ? "Processing Cash Out..." : "Processing Deposit..."}</p>
        </SpinnerOverlay>
      )}
      <div className="score-board">
        <h2>Points: {points}</h2>
      </div>
      <div>
        <label htmlFor="depositAmount" style={{ marginRight: "10px" }}>
          Enter Deposit Amount:
        </label>
        <input
          type="number"
          id="depositAmount"
          value={depositAmount}
          onChange={(e) => setDepositAmount(Number(e.target.value))}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #28d850",
            marginBottom: "10px",
          }}
        />
      </div>
      <button onClick={depositTokens} disabled={depositLoading || depositAmount <= 0}>
        {depositLoading ? "Depositing..." : `Deposit ${depositAmount} Tokens`}
      </button>
      <button onClick={spinSlots} disabled={spinning || points < SPIN_COST}>
        {spinning ? "Spinning..." : "Spin"}
      </button>
      <button onClick={cashOut} disabled={loading || points === 0}>
        {loading ? "Processing Cash Out..." : "Cash Out"}
      </button>
      <div className="slots">
        {displayedCombination.map((item, index) => (
          <SlotItem key={index} revealed={!spinning} good={item.good || false} itemImage={item.image} />
        ))}
      </div>
    </div>
  );
};

export default SlotMachine;
