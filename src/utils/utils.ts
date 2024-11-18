import { SLOT_ITEMS, SlotItem, NUM_SLOTS } from '../constants';

// Utility function to pick a random item from an array
const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generates a simplified bet array for a given wager amount and max payout.
 * Returns an array of multipliers for the given conditions.
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

  console.log("Generated Bet Array:", arr);
  return arr;
};

/**
 * Generates a random slot combination based on the number of slots.
 * Returns an array of `SlotItem` objects matching the specified number of slots.
 */
export const getSlotCombination = (): SlotItem[] => {
  return Array.from({ length: NUM_SLOTS }).map(() => {
    const randomItem = pickRandom(SLOT_ITEMS);
    return { ...randomItem }; // Return a new object for each item
  });
};

/**
 * Calculates the payout based on the final combination of slot items.
 * Determines if there's a match and returns a payout multiplier.
 */
export const calculatePayout = (combination: SlotItem[]): number => {
  if (combination.length !== NUM_SLOTS) {
    console.error(`Invalid slot combination length. Expected ${NUM_SLOTS} items.`);
    return 0;
  }

  const itemCounts: Record<string, number> = {};

  // Count occurrences of each image in the combination
  combination.forEach((item) => {
    itemCounts[item.image] = (itemCounts[item.image] || 0) + 1;
  });

  // Debugging log to check counts
  console.log("Item counts:", itemCounts);

  // Get the highest count of matches
  const maxMatchCount = Math.max(...Object.values(itemCounts));

  // Determine payout based on the number of matches
  switch (maxMatchCount) {
    case 10:
      console.log("Jackpot! All symbols match.");
      return combination[0].multiplier * 50; // Jackpot payout
    case 9:
      console.log("Very high payout! 9 symbols match.");
      return combination.find(item => itemCounts[item.image] === 9)!.multiplier * 25;
    case 8:
      console.log("High payout! 8 symbols match.");
      return combination.find(item => itemCounts[item.image] === 8)!.multiplier * 15;
    case 7:
      console.log("Medium-high payout! 7 symbols match.");
      return combination.find(item => itemCounts[item.image] === 7)!.multiplier * 10;
    case 6:
      console.log("Medium payout! 6 symbols match.");
      return combination.find(item => itemCounts[item.image] === 6)!.multiplier * 7;
    case 5:
      console.log("Low payout! 5 symbols match.");
      return combination.find(item => itemCounts[item.image] === 5)!.multiplier * 5;
    case 4:
      console.log("Small payout! 4 symbols match.");
      return combination.find(item => itemCounts[item.image] === 4)!.multiplier * 2;
    default:
      console.log("No matches, no payout.");
      return 0; // No payout
  }
};

