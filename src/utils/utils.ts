import { SLOT_ITEMS, SlotItem } from '../constants';

const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generates a simplified bet array for a given wager amount and max payout.
 */
export const generateBetArray = (
  maxPayout: number,
  wager: number,
  maxLength = 50,
): number[] => {
  const maxMultiplier = Math.floor(maxPayout / wager);
  if (maxMultiplier <= 0) return []; // If no valid multiplier, return an empty array

  // Populate bet array with multipliers from SLOT_ITEMS up to the maxMultiplier
  const arr: number[] = [];
  while (arr.length < maxLength) {
    const item = pickRandom(SLOT_ITEMS);
    if (item.multiplier <= maxMultiplier) {
      arr.push(item.multiplier);
    }
  }

  console.log("Simplified Generated Bet Array:", arr);
  return arr;
};

/**
 * Generates a random slot combination, ensuring varied images if there's no win.
 */
export const getSlotCombination = (
  count: number,
  multiplier: number,
  bet: number[]
): SlotItem[] => {
  if (multiplier > 0) {
    // If there's a win, return the same item in all slots based on the multiplier
    const winningItem = SLOT_ITEMS.find(item => item.multiplier === multiplier) || SLOT_ITEMS[0];
    return new Array(count).fill(winningItem);
  }

  // For non-winning spins, randomly pick items from SLOT_ITEMS
  const combination: SlotItem[] = [];
  for (let i = 0; i < count; i++) {
    let item: SlotItem;
    do {
      item = pickRandom(SLOT_ITEMS);
    } while (combination.includes(item) && combination.length < SLOT_ITEMS.length); // Ensure variety
    combination.push(item);
  }

  console.log("Simplified Slot Combination:", combination);
  return combination;
};
