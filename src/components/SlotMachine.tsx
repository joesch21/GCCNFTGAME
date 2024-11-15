// SlotMachine.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SlotItem from './SlotItem';
import { useSound } from '../hooks/useSound';
import { SLOT_ITEMS } from '../constants';
import { getSlotCombination, calculatePayout } from '../utils/utils';
import TokenVaultABI from '../TokenVault.json';
import GCCTokenABI from '../GCCToken.json';
import Onboard from '@web3-onboard/core';
import metamaskModule from '@web3-onboard/metamask';

import { SpinnerOverlay, Loader } from './Slot.styles'; // Import styled spinner components

// Initialize the MetaMask module
const metamask = metamaskModule({ options: {} });

const onboard = Onboard({
  wallets: [metamask],
  chains: [
    {
      id: '0x61', // BSC Testnet Chain ID
      token: 'tBNB', // Testnet BNB token symbol
      label: 'Binance Smart Chain Testnet',
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545', // BSC Testnet RPC URL
    },
  ],
});

const SPIN_COST = 1; // Define the cost per spin

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
  const [loading, setLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);

  const playSound = useSound();

  // Connect to MetaMask and set up contract instances
  const connectWallet = async () => {
    setLoading(true);
    const wallets = await onboard.connectWallet();
    if (wallets && wallets.length > 0) {
      const walletAccount = wallets[0].accounts[0].address;
      setWalletAddress(walletAccount);
      console.log("Wallet connected:", walletAccount);

      const provider = new ethers.providers.Web3Provider(wallets[0].provider);
      const signer = provider.getSigner();

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
      await updatePoints();
    }
    setLoading(false);
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
    if (!walletAddress && account) {
      setWalletAddress(account);
      connectWallet();
    }
  }, [account]);

  // Deposit tokens to start playing
  const depositTokens = async (amount: number) => {
    if (!gctToken || !tokenVault) return;

    setDepositLoading(true);
    try {
      const approveTx = await gctToken.approve(tokenVault.address, ethers.utils.parseUnits(amount.toString(), 18));
      await approveTx.wait();

      const depositTx = await tokenVault.deposit(ethers.utils.parseUnits(amount.toString(), 18));
      await depositTx.wait();

      console.log(`Deposited ${amount} tokens`);
      setPoints(prevPoints => prevPoints + amount); // Increment points by deposit amount
      await updatePoints(); // Immediately update points to reflect deposit
    } catch (error) {
      console.error('Deposit failed:', error);
      alert("Deposit failed. Please try again.");
    }
    setDepositLoading(false);
  };

  // Handle slot machine spin
  const spinSlots = () => {
    if (spinning || points < SPIN_COST) return; // Prevent spin if already spinning or insufficient points
    setSpinning(true);
    setPoints(prevPoints => prevPoints - SPIN_COST); // Deduct spin cost
    playSound('spin');

    // Randomize slot images as the spin animation
    const spinInterval = setInterval(() => {
      const newCombination = getSlotCombination();
      setDisplayedCombination(newCombination);
    }, 100); // Speed of spin animation

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
    }, 3000); // Spin duration increased to 3000ms
  };

  // Withdraw accumulated balance from the vault with confirmation
  const cashOut = async () => {
    if (!tokenVault) return;

    const confirmCashOut = window.confirm("Are you sure you want to cash out your points?");
    if (!confirmCashOut) return; // Exit if user cancels

    setLoading(true);
    try {
      const withdrawAmount = ethers.utils.parseUnits(points.toString(), 18);
      const withdrawTx = await tokenVault.withdraw(withdrawAmount);
      await withdrawTx.wait();

      console.log(`Cashed out ${points} tokens (converted to ${withdrawAmount} units)`);
      setPoints(0); // Reset points after withdrawal
    } catch (error) {
      console.error('Cash out failed:', error);
      alert("Cash out failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="slot-game">
      {(loading || depositLoading) && (
        <SpinnerOverlay>
          <Loader />
          <p>{loading ? 'Connecting to wallet...' : 'Processing deposit...'}</p>
        </SpinnerOverlay>
      )}
      <div className="score-board">
        <h2>Points: {points}</h2>
      </div>
      <button onClick={() => depositTokens(10)} disabled={depositLoading}>
        {depositLoading ? 'Depositing...' : 'Deposit 10 Tokens'}
      </button>
      <button onClick={spinSlots} disabled={spinning || points < SPIN_COST}>
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
      <button onClick={cashOut} disabled={loading || points === 0}>
        {loading ? 'Processing Cash Out...' : 'Cash Out'}
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
