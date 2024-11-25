import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import SlotItem from "./SlotItem";
import { SLOT_ITEMS, SPIN_COST, NUM_SLOTS, CONTRACT_ADDRESSES } from "../constants";
import WithdrawWinningsABI from "../contracts/WithdrawWinningsABI.json"; // Ensure correct path
import { calculatePayout } from "../utils/utils";
import {
  SpinnerOverlay,
  Loader,
  StreamingSymbolsContainer,
  StreamingSymbol,
  SlotGrid,
} from "../components/Slot.styles";

interface SlotMachineProps {
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.providers.JsonRpcSigner | null;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ account, provider, signer }) => {
  const [spinning, setSpinning] = useState(false);
  const [displayedCombination, setDisplayedCombination] = useState(
    Array(NUM_SLOTS).fill(SLOT_ITEMS[0])
  );
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [streamingSymbols, setStreamingSymbols] = useState<string[]>([]);
  const [streamDirection, setStreamDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [contractBalance, setContractBalance] = useState<string>("0");

  // Contract instances
  const withdrawContract = signer
    ? new ethers.Contract(CONTRACT_ADDRESSES.WITHDRAWAL, WithdrawWinningsABI, signer)
    : null;

  const gctToken = signer
    ? new ethers.Contract(CONTRACT_ADDRESSES.GCC_TOKEN, require("../GCCToken.json"), signer)
    : null;

  // Fetch contract token balance
  const fetchContractBalance = async () => {
    if (!gctToken) return;
    try {
      const balance = await gctToken.balanceOf(CONTRACT_ADDRESSES.WITHDRAWAL);
      setContractBalance(ethers.utils.formatUnits(balance, 18));
    } catch (error) {
      console.error("Failed to fetch contract balance:", error);
    }
  };

  // Fetch contract balance on component mount or provider change
  useEffect(() => {
    if (provider) fetchContractBalance();
  }, [provider]);

  // Play sound helper
  const playSound = (soundFile: string) => {
    const sound = new Audio(soundFile);
    sound.play().catch((error) => console.error(`Failed to play sound: ${error.message}`));
  };

  // Deposit tokens
  const depositTokens = async () => {
    if (!gctToken || !withdrawContract || depositAmount <= 0) {
      alert("Invalid deposit amount or wallet not connected.");
      return;
    }

    try {
      setLoading(true);
      playSound("/money.mp3");

      const tokenAmount = ethers.utils.parseUnits(depositAmount.toString(), 18);
      const currentAllowance = await gctToken.allowance(account, CONTRACT_ADDRESSES.WITHDRAWAL);

      if (currentAllowance.lt(tokenAmount)) {
        const approveTx = await gctToken.approve(CONTRACT_ADDRESSES.WITHDRAWAL, tokenAmount);
        await approveTx.wait();
      }

      const depositTx = await withdrawContract.addPoints(account, tokenAmount);
      await depositTx.wait();
      setPoints((prevPoints) => prevPoints + depositAmount);

      fetchContractBalance(); // Refresh contract balance
    } catch (error: any) {
      console.error("Deposit failed:", error);
      alert(error.message || "Failed to deposit tokens.");
    } finally {
      setLoading(false);
    }
  };

  // Withdraw winnings
  const withdrawWinnings = async () => {
    if (!withdrawContract || points <= 0) {
      alert("No points to withdraw or wallet not connected.");
      return;
    }

    try {
      setLoading(true);

      const tx = await withdrawContract.withdrawWinnings();
      console.log("Transaction sent:", tx.hash);

      await tx.wait();
      alert("Winnings withdrawn successfully!");
      setPoints(0); // Reset points after successful withdrawal

      fetchContractBalance(); // Refresh contract balance
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      alert(error.message || "Failed to withdraw winnings.");
    } finally {
      setLoading(false);
    }
  };

  // Spin the slot machine
  const spinSlots = () => {
    if (spinning || points < SPIN_COST) {
      if (points < SPIN_COST) alert("You don't have enough points to spin.");
      return;
    }

    playSound("/play.mp3");
    setSpinning(true);
    setPoints((prevPoints) => prevPoints - SPIN_COST);
    playSound("/spin.mp3");

    const spinInterval = setInterval(() => {
      const newCombination = Array.from({ length: NUM_SLOTS }).map(
        () => SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)]
      );
      setDisplayedCombination(newCombination);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      setSpinning(false);

      const finalCombination = Array.from({ length: NUM_SLOTS }).map(
        () => SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)]
      );
      setDisplayedCombination(finalCombination);
      playSound("/reveal.mp3");

      const payoutMultiplier = calculatePayout(finalCombination);
      if (payoutMultiplier > 0) {
        const winnings = payoutMultiplier * SPIN_COST;
        setPoints((prevPoints) => prevPoints + winnings);
        playSound("/win.mp3");

        const winningSymbols = finalCombination.map((item) => item.image);
        setStreamingSymbols(winningSymbols);
        setStreamDirection(Math.random() > 0.5 ? "horizontal" : "vertical");

        setTimeout(() => setStreamingSymbols([]), 3000);
      } else {
        playSound("/lose.mp3");
      }
    }, 3000);
  };

  return (
    <div className="slot-game">
      {/* Loading overlay */}
      {loading && (
        <SpinnerOverlay>
          <Loader />
          <p>Processing...</p>
        </SpinnerOverlay>
      )}

      {/* Scoreboard */}
      <div className="score-board">
        <h2>Winnings: {points}</h2>
        <h3>Prize Pool: {contractBalance} GCCT</h3>
      </div>

      {/* Slot grid */}
      <SlotGrid>
        {displayedCombination.map((item, index) => (
          <SlotItem
            key={index}
            spinning={spinning}
            revealed={!spinning}
            good={item.good || false}
            itemImage={item.image}
          />
        ))}
      </SlotGrid>

      {/* Controls */}
      <div className="controls">
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(Number(e.target.value))}
          disabled={loading}
          placeholder="Deposit Amount"
        />
        <button onClick={depositTokens} disabled={loading || depositAmount <= 0}>
          Deposit {depositAmount} Tokens
        </button>
        <button onClick={spinSlots} disabled={spinning || points < SPIN_COST}>
          {spinning ? "Spinning..." : `Spin (Cost: ${SPIN_COST} GCCT)`}
        </button>
        <button onClick={withdrawWinnings} disabled={loading || points === 0}>
          Withdraw Winnings
        </button>
      </div>

      {/* Streaming symbols for winning spins */}
      {streamingSymbols.length > 0 && (
        <StreamingSymbolsContainer>
          {streamingSymbols.map((symbol, index) => (
            <StreamingSymbol key={index} direction={streamDirection}>
              <img src={symbol} alt="streaming-symbol" />
            </StreamingSymbol>
          ))}
        </StreamingSymbolsContainer>
      )}
    </div>
  );
};

export default SlotMachine;
