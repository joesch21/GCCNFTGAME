import React, { useState } from 'react';
import { ethers } from 'ethers';
import SlotItem from './SlotItem';
import { SLOT_ITEMS, SPIN_COST, NUM_SLOTS, CONTRACT_ADDRESSES } from '../constants';
import { calculatePayout } from '../utils/utils';
import { SpinnerOverlay, Loader } from './Slot.styles';

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
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(100);

  const tokenVault = signer
    ? new ethers.Contract(CONTRACT_ADDRESSES.TOKEN_VAULT, require('../TokenVault.json'), signer)
    : null;

  const gctToken = signer
    ? new ethers.Contract(CONTRACT_ADDRESSES.GCC_TOKEN, require('../GCCToken.json'), signer)
    : null;

  const playSound = (soundFile: string) => {
    const sound = new Audio(soundFile);
    sound.play();
  };

  const depositTokens = async () => {
    if (!gctToken || !tokenVault || depositAmount <= 0) return;

    try {
      setDepositLoading(true);
      playSound('/money.mp3'); // Play deposit sound

      const tokenAmount = ethers.utils.parseUnits(depositAmount.toString(), 18);
      const currentAllowance = await gctToken.allowance(account, CONTRACT_ADDRESSES.TOKEN_VAULT);

      if (currentAllowance.lt(tokenAmount)) {
        console.log('Approving spending cap...');
        const approveTx = await gctToken.approve(CONTRACT_ADDRESSES.TOKEN_VAULT, tokenAmount);
        await approveTx.wait();
      }

      const depositTx = await tokenVault.deposit(tokenAmount);
      await depositTx.wait();
      console.log(`Deposited ${depositAmount} GCCT tokens.`);

      setPoints((prevPoints) => prevPoints + depositAmount);
    } catch (error: any) {
      console.error('Deposit failed:', error);
      alert(error.message || 'Failed to deposit tokens. Please try again.');
    } finally {
      setDepositLoading(false);
    }
  };

  const cashOut = async () => {
    if (!tokenVault || points <= 0) return;

    try {
      setLoading(true);

      const tokenAmount = ethers.utils.parseUnits(points.toString(), 18);
      const withdrawTx = await tokenVault.withdraw(tokenAmount);
      await withdrawTx.wait();
      setPoints(0);
    } catch (error: any) {
      console.error('Cash out failed:', error);
      alert(error.message || 'Cash out failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const spinSlots = () => {
    if (spinning || points < SPIN_COST) {
      if (points < SPIN_COST) {
        alert("You don't have enough points to spin. Deposit more tokens!");
      }
      return;
    }
  
    playSound('/play.mp3'); // Play spin button sound
  
    setSpinning(true);
    setPoints((prevPoints) => prevPoints - SPIN_COST);
  
    playSound('/spin.mp3'); // Play spinning sound
  
    // Create spinning effect
    const spinInterval = setInterval(() => {
      const newCombination = Array.from({ length: NUM_SLOTS }).map(() =>
        SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)]
      );
      setDisplayedCombination(newCombination);
    }, 100);
  
    // Stop spinning and calculate results
    setTimeout(() => {
      clearInterval(spinInterval);
      setSpinning(false);
  
      const finalCombination = Array.from({ length: NUM_SLOTS }).map(() =>
        SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)]
      );
      setDisplayedCombination(finalCombination);
  
      playSound('/reveal.mp3'); // Play reveal sound
  
      const payoutMultiplier = calculatePayout(finalCombination);
      if (payoutMultiplier > 0) {
        const winnings = payoutMultiplier * SPIN_COST;
        setPoints((prevPoints) => prevPoints + winnings);
        playSound('/win.mp3'); // Play win sound
      } else {
        playSound('/lose.mp3'); // Play lose sound
      }
    }, 3000);
  };
  

  return (
    <div className="slot-game">
      {(loading || depositLoading) && (
        <SpinnerOverlay>
          <Loader />
          <p>{loading ? 'Processing Cash Out...' : 'Processing Deposit...'}</p>
        </SpinnerOverlay>
      )}
      <div className="score-board">
        <h2>Points: {points}</h2>
      </div>
      <input
        type="number"
        value={depositAmount}
        onChange={(e) => setDepositAmount(Number(e.target.value))}
        disabled={depositLoading}
      />
      <button onClick={depositTokens} disabled={depositLoading || depositAmount <= 0}>
        {depositLoading ? 'Depositing...' : `Deposit ${depositAmount} Tokens`}
      </button>
      <button onClick={spinSlots} disabled={spinning || points < SPIN_COST}>
        {spinning ? 'Spinning NOW...' : `Spin (Cost: ${SPIN_COST} GCCT)`}
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
