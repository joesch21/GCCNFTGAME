// useSound.ts
import { useMemo } from 'react';

export function useSound() {
  const sounds = useMemo(
    () => ({
      win: new Audio('/src/assets/win.mp3'),
      lose: new Audio('/src/assets/lose.mp3'),
      spin: new Audio('/src/assets/spin.mp3'),
      play: new Audio('/src/assets/play.mp3'),
      reveal: new Audio('/src/assets/reveal.mp3'),
    }),
    []
  );
  

  const playSound = (effect: keyof typeof sounds) => {
    sounds[effect].play();
  };

  return playSound;
}
