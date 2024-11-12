import React, { useState } from 'react';
import Slot from './Slot';
import { useSound } from '../hooks/useSound';
import { SLOT_ITEMS, NUM_SLOTS } from '../constants';

const Slots: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [displayedCombination, setDisplayedCombination] = useState(
    Array(NUM_SLOTS).fill(SLOT_ITEMS[0])
  );
  const playSound = useSound();

  const spinSlots = () => {
    if (spinning) return;
    setSpinning(true);
    playSound('spin');

    // Start an interval to update `displayedCombination` with random images
    const spinInterval = setInterval(() => {
      const newCombination = Array.from({ length: NUM_SLOTS }).map(() => {
        const randomItem = SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)];
        return { ...randomItem }; // Ensure a new object reference for each item
      });
      setDisplayedCombination(newCombination);
      console.log("Spinning Combination:", newCombination); // Log each update
    }, 100); // Adjust speed for flickering effect

    // Stop spinning after a certain duration
    setTimeout(() => {
      clearInterval(spinInterval);
      setSpinning(false);
      playSound('reveal');
    }, 2000); // Spin duration (2 seconds here)
  };

  return (
    <div className="slot-game">
      <button onClick={spinSlots} disabled={spinning}>Spin</button>
      <div className="slots">
        {displayedCombination.map((item, index) => (
          <Slot
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

export default Slots;
