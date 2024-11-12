// Slots.tsx
import React, { useState } from 'react';
import Slot from './Slot';
import { useSound } from '../hooks/useSound';
import { generateBetArray, getSlotCombination } from '../utils/utils';
import { SLOT_ITEMS, NUM_SLOTS, SPIN_DELAY } from '../constants';
import { SlotItem } from '../constants';

const Slots: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState<number[]>([]);
  const [displayedCombination, setDisplayedCombination] = useState<SlotItem[]>([]);
  const [revealedSlots, setRevealedSlots] = useState(0);
  const [good, setGood] = useState(false);
  const playSound = useSound();

  // Function to place a bet and generate a new bet array
  const placeBet = (wager: number) => {
    const maxPayout = 100;
    const newBetArray = generateBetArray(maxPayout, wager);
    setBet(newBetArray);
  };

  // Function to simulate spinning the slots
  const spinSlots = () => {
    if (spinning) return;
    setSpinning(true);
    setRevealedSlots(0);
    setGood(false);
    playSound('spin');

    // Start displaying random slot items during the spin
    const spinInterval = setInterval(() => {
      setDisplayedCombination(
        Array.from({ length: NUM_SLOTS }).map(() => SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)])
      );
    }, 100);

    // Set the final combination after a delay and stop spinning
    setTimeout(() => {
      clearInterval(spinInterval);
      const newCombination = getSlotCombination(NUM_SLOTS, 1, bet); // Pass 1 as multiplier if unused
      setDisplayedCombination(newCombination);
      setSpinning(false);

      // Reveal each slot with a delay for an animation effect
      newCombination.forEach((_, index) => {
        setTimeout(() => setRevealedSlots(index + 1), SPIN_DELAY * index);
      });

      // Check if all slots are the same for a win
      const allSame = newCombination.every((item) => item === newCombination[0]);
      setGood(allSame);
      playSound(allSame ? 'win' : 'lose');
    }, SPIN_DELAY * NUM_SLOTS);
  };

  return (
    <div className="slot-game">
      <button onClick={() => placeBet(10)} disabled={spinning}>Place Bet</button>
      <button onClick={spinSlots} disabled={spinning}>Spin</button>
      <div className="slots">
        {displayedCombination.map((item, index) => (
          <Slot
            key={index}
            revealed={revealedSlots > index}
            good={good}
            itemImage={item.image} // Ensure item.image is defined in SlotItem
          />
        ))}
      </div>
    </div>
  );
};

export default Slots;
