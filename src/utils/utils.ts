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
 * Generates a random slot combination of `count` items, ensuring variety.
 */
export const getSlotCombination = (count: number): SlotItem[] => {
  return Array.from({ length: count }).map(() => {
    const randomItem = SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)];
    return { ...randomItem }; // Ensure new object reference for each item
  });
};

/**
 * Calculates the payout based on the final combination of slot items.
 * Determines the maximum number of matches and returns a payout multiplier.
 */
export const calculatePayout = (combination: SlotItem[]): number => {
  const itemCounts: { [key: string]: number } = {};

  // Count occurrences of each image in the combination
  combination.forEach((item) => {
    itemCounts[item.image] = (itemCounts[item.image] || 0) + 1;
  });

  // Debugging log to check counts
  console.log("Item counts:", itemCounts);

  // Find the highest match count
  const maxMatchCount = Math.max(...Object.values(itemCounts));

  // Debugging log to check max match count
  console.log("Max match count:", maxMatchCount);

  // Determine payout based on max matches
  switch (maxMatchCount) {
    case 10:
      return 100; // Jackpot
    case 9:
      return 50;
    case 8:
      return 25;
    case 7:
      return 10;
    case 6:
      return 5;
    case 5:
      return 2;
    case 4:
      return 1;    
    default:
      return 0; // No Win
  }
};

