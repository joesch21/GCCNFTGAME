import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SlotItem from './SlotItem';
import { useSound } from '../hooks/useSound';
import { SLOT_ITEMS } from '../constants';
import { getSlotCombination, calculatePayout } from '../utils/utils';
import TokenVaultABI from '../TokenVault.json';
import GCCTokenABI from '../GCCToken.json';

const SPIN_COST = 1; // Define the cost per spin

const SlotMachine: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [displayedCombination, setDisplayedCombination] = useState(
    Array(3).fill(SLOT_ITEMS[0])
  );
  const [points, setPoints] = useState(0);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenVault, setTokenVault] = useState<ethers.Contract | null>(null);
  const [gctToken, setGctToken] = useState<ethers.Contract | null>(null);
  const [hasDeposited, setHasDeposited] = useState(false);

  const playSound = useSound();

  // Connect to MetaMask and set up contract instances
  const connectWallet = async () => {
    if (window.ethereum && window.ethereum.request) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        const tokenVaultContract = new ethers.Contract(
          '0x3f8816B08F5968EbEc20000D0963B4A8EBF3C7E5',
          TokenVaultABI,
          signer
        );
        setTokenVault(tokenVaultContract);

        const gctTokenContract = new ethers.Contract(
          '0x07b49c3751ac1Aba1A2B11f2704e974Af6E401A7',
          GCCTokenABI,
          signer
        );
        setGctToken(gctTokenContract);

        // Fetch initial points balance
        updatePoints();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("MetaMask is not installed");
    }
  };

  // Fetch and update points balance from the contract
  const updatePoints = async () => {
    if (!tokenVault || !walletAddress) return;

    try {
      const balance = await tokenVault.balances(walletAddress);
      setPoints(parseFloat(ethers.utils.formatUnits(balance, 18)));
    } catch (error) {
      console.error('Failed to fetch points:', error);
      alert("Failed to fetch points balance. Please try again.");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  // Deposit tokens to start playing
  const depositTokens = async (amount: number) => {
    if (!gctToken || !tokenVault) return;

    try {
      const approveTx = await gctToken.approve(tokenVault.address, ethers.utils.parseUnits(amount.toString(), 18));
      await approveTx.wait();

      const depositTx = await tokenVault.deposit(ethers.utils.parseUnits(amount.toString(), 18));
      await depositTx.wait();

      console.log(`Deposited ${amount} tokens`);
      setPoints(amount); // Set points directly to the deposited amount
      setHasDeposited(true);
    } catch (error) {
      console.error('Deposit failed:', error);
      alert("Deposit failed. Please try again.");
    }
  };

  // Handle slot machine spin
  const spinSlots = () => {
    if (spinning || points < SPIN_COST) return; // Prevent spin if spinning or insufficient points
    setSpinning(true);
    setPoints(prevPoints => prevPoints - SPIN_COST); // Deduct spin cost
    playSound('spin');

    // Randomize slot images as the spin animation
    const spinInterval = setInterval(() => {
      const newCombination = getSlotCombination();
      setDisplayedCombination(newCombination);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      setSpinning(false);

      // Final combination after spin
      const finalCombination = getSlotCombination();
      setDisplayedCombination(finalCombination);

      // Calculate payout multiplier based on final combination
      const payoutMultiplier = calculatePayout(finalCombination);
      if (payoutMultiplier > 0) {
        playSound('win');
        const winnings = payoutMultiplier * SPIN_COST;
        console.log(`You win! Payout multiplier: ${payoutMultiplier}x, winnings: ${winnings} points`);
        setPoints(prevPoints => prevPoints + winnings); // Add winnings to points
      } else {
        playSound('lose');
        console.log("No win. Better luck next time!");
      }
    }, 2000); // Spin duration
  };

  // Withdraw accumulated balance from the vault with confirmation
  const cashOut = async () => {
    if (!tokenVault) return;

    const confirmCashOut = window.confirm("Are you sure you want to cash out your points?");
    if (!confirmCashOut) return; // Exit if user cancels

    try {
      const withdrawTx = await tokenVault.withdraw(points);
      await withdrawTx.wait();

      console.log(`Cashed out ${points} tokens`);
      setPoints(0); // Reset points after withdrawal
    } catch (error) {
      console.error('Cash out failed:', error);
      alert("Cash out failed. Please try again.");
    }
  };

  return (
    <div className="slot-game">
      <div className="score-board">
        <h2>Points: {points}</h2>
      </div>
      <button onClick={() => depositTokens(10)}>Deposit 10 Tokens</button>
      <button onClick={spinSlots} disabled={spinning || points < SPIN_COST}>Spin</button> {/* Disable spin if insufficient points */}
      <button onClick={cashOut} disabled={points === 0}>Cash Out</button>
      <div className="slots">
        {displayedCombination.map((item, index) => (
          <SlotItem
            key={index}
            revealed={!spinning}
            good={item.good || false}
            itemImage={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default SlotMachine;
