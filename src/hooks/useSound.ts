import { useMemo } from 'react';

export function useSound() {
  const sounds = useMemo(
    () => ({
      win: new Audio(require('../assets/win.mp3')),
      lose: new Audio(require('../assets/lose.mp3')),
      spin: new Audio(require('../assets/spin.mp3')),
      play: new Audio(require('../assets/play.mp3')),
      reveal: new Audio(require('../assets/reveal.mp3')),
    }),
    []
  );

  const playSound = (effect: keyof typeof sounds) => {
    sounds[effect].play();
  };

  return playSound;
}
