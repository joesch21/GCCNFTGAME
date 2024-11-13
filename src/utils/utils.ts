import { SLOT_ITEMS, SlotItem } from '../constants';

// Utility function to pick a random item from an array
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
 * Generates a random slot combination of 3 items for a three-wheel slot machine.
 */
export const getSlotCombination = (): SlotItem[] => {
  return Array.from({ length: 3 }).map(() => {
    const randomItem = SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)];
    return { ...randomItem }; // Ensure new object reference for each item
  });
};

/**
 * Calculates the payout based on the final combination of three slot items.
 * Determines if there's a match and returns a payout multiplier.
 */
export const calculatePayout = (combination: SlotItem[]): number => {
  if (combination.length !== 3) {
    console.error("Invalid slot combination length. Expected 3 items.");
    return 0;
  }

  const itemCounts: { [key: string]: number } = {};

  // Count occurrences of each image in the combination
  combination.forEach((item) => {
    itemCounts[item.image] = (itemCounts[item.image] || 0) + 1;
  });

  // Debugging log to check counts
  console.log("Item counts:", itemCounts);

  // Determine payout based on matches
  const values = Object.values(itemCounts);

  if (values.includes(3)) {
    // All three symbols match — highest payout (Jackpot)
    return combination[0].multiplier * 10;
  } else if (values.includes(2)) {
    // Two symbols match — medium payout
    return combination.find(item => itemCounts[item.image] === 2)!.multiplier * 3;
  } else {
    // No matches — no payout
    return 0;
  }
};
