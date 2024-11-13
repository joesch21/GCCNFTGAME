// constants.ts
import IMAGE_2X from './assets/slot-2x.png';
import IMAGE_3X from './assets/slot-3x.png';
import IMAGE_5X from './assets/slot-5x.png';
import IMAGE_COOL from './assets/slot-emoji-cool.png';
import IMAGE_HEARTS from './assets/slot-emoji-hearts.png';
import IMAGE_UNICORN from './assets/slot-unicorn.png';
import IMAGE_WOJAK from './assets/slot-wojak.png';

export interface SlotItem {
  multiplier: number;
  image: string;
}

export const SLOT_ITEMS: SlotItem[] = [
  { multiplier: 7, image: IMAGE_UNICORN },
  { multiplier: 5, image: IMAGE_5X },
  { multiplier: 3, image: IMAGE_3X },
  { multiplier: 2, image: IMAGE_2X },
  { multiplier: 1, image: IMAGE_COOL },
  { multiplier: 0.5, image: IMAGE_WOJAK },
];

export const NUM_SLOTS = 10;
export const SPIN_DELAY = 500;
