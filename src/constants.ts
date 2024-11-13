// constants.ts

import IMAGE_2X from './assets/slot-2x.png';
import IMAGE_3X from './assets/slot-3x.png';
import IMAGE_5X from './assets/slot-5x.png';
import IMAGE_COOL from './assets/slot-emoji-cool.png';
import IMAGE_HEARTS from './assets/slot-emoji-hearts.png';
import IMAGE_UNICORN from './assets/slot-unicorn.png';
import IMAGE_WOJAK from './assets/slot-wojak.png';

// Interface for a slot item with a multiplier and image
export interface SlotItem {
  multiplier: number;
  image: string;
}

// Define slot items with their respective multipliers and images
export const SLOT_ITEMS: SlotItem[] = [
  { multiplier: 7, image: IMAGE_UNICORN },
  { multiplier: 5, image: IMAGE_5X },
  { multiplier: 3, image: IMAGE_3X },
  { multiplier: 2, image: IMAGE_2X },
  { multiplier: 1, image: IMAGE_COOL },
  { multiplier: 0.5, image: IMAGE_WOJAK },
];

// Set number of slots to 3 for the three-wheel slot machine
export const NUM_SLOTS = 3;

// Delay for each spin cycle, adjust for visual effect
export const SPIN_DELAY = 500;
