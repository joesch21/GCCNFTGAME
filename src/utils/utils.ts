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

  // Determine payout based on matches
  const values = Object.values(itemCounts);

  if (values.includes(6)) {
    // All 6 symbols match — Jackpot
    console.log("Jackpot! All symbols match.");
    return combination[0].multiplier * 20;
  } else if (values.includes(5)) {
    // 5 out of 6 symbols match — High payout
    console.log("High payout! 5 symbols match.");
    const matchingItem = combination.find(item => itemCounts[item.image] === 5);
    return matchingItem ? matchingItem.multiplier * 10 : 0;
  } else if (values.includes(4)) {
    // 4 out of 6 symbols match — Medium payout
    console.log("Medium payout! 4 symbols match.");
    const matchingItem = combination.find(item => itemCounts[item.image] === 4);
    return matchingItem ? matchingItem.multiplier * 5 : 0;
  } else if (values.includes(3)) {
    // 3 out of 6 symbols match — Low payout
    console.log("Low payout! 3 symbols match.");
    const matchingItem = combination.find(item => itemCounts[item.image] === 3);
    return matchingItem ? matchingItem.multiplier * 2 : 0;
  } else {
    // Fewer than 3 matches — No payout
    console.log("No matches, no payout.");
    return 0;
  }
};

