import React, { useState } from 'react';
import SlotItem from './SlotItem';
import { useSound } from '../hooks/useSound';
import { SLOT_ITEMS, NUM_SLOTS } from '../constants';
import { getSlotCombination, calculatePayout } from '../utils/utils';

const SlotMachine: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [displayedCombination, setDisplayedCombination] = useState(
    Array(NUM_SLOTS).fill(SLOT_ITEMS[0])
  );
  const [points, setPoints] = useState(0); // Points state
  const playSound = useSound();

  const spinSlots = () => {
    if (spinning) return;
    setSpinning(true);
    playSound('spin');

    const spinInterval = setInterval(() => {
      const newCombination = getSlotCombination(NUM_SLOTS);
      setDisplayedCombination(newCombination);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      setSpinning(false);

      const finalCombination = getSlotCombination(NUM_SLOTS);
      setDisplayedCombination(finalCombination);

      const payoutMultiplier = calculatePayout(finalCombination);

      if (payoutMultiplier > 0) {
        console.log(`You win! Payout multiplier: ${payoutMultiplier}x`);
        playSound('win');
        setPoints(prevPoints => prevPoints + payoutMultiplier * 10); // Update points
      } else {
        console.log("No win. Better luck next time!");
        playSound('lose');
      }
    }, 2000);
  };

  return (
    <div className="slot-game">
      <div className="score-board">
        <h2>Points: {points}</h2>
      </div>
      <button onClick={spinSlots} disabled={spinning}>Spin</button>
      <div className="slots">
        {displayedCombination.map((item, index) => (
          <SlotItem
            key={index}
            revealed={true} 
            good={false} 
            itemImage={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default SlotMachine;
