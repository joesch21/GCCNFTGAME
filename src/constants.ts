// Contract Addresses for Token Vault and GCC Token
export const CONTRACT_ADDRESSES = {
  TOKEN_VAULT: '0x3f8816B08F5968EbEc20000D0963B4A8EBF3C7E5',
  GCC_TOKEN: '0x07b49c3751ac1Aba1A2B11f2704e974Af6E401A7',
};

// Define the cost per spin
export const SPIN_COST = 1;

// Define slot items with their respective multipliers and images
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

// Slot items for the slot machine
export const SLOT_ITEMS: SlotItem[] = [
  { multiplier: 7, image: IMAGE_UNICORN },
  { multiplier: 5, image: IMAGE_5X },
  { multiplier: 3, image: IMAGE_3X },
  { multiplier: 2, image: IMAGE_2X },
  { multiplier: 1, image: IMAGE_COOL },
  { multiplier: 0.5, image: IMAGE_WOJAK },
];

// Number of slots for the slot machine
export const NUM_SLOTS = 3;

// Delay for each spin cycle, adjust for visual effect
export const SPIN_DELAY = 500;
