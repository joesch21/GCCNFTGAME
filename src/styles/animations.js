import { keyframes } from 'styled-components';

// Spinner animation
export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Slot box spin animation
export const boxSpinAnimation = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(10px, -10px) rotate(360deg); }
`;

// Flicker animation
export const flickerAnimation = keyframes`
  0% { opacity: 0.5; transform: scale(1); }
  100% { opacity: 1; transform: scale(1.1); }
`;

// Streaming animations
export const streamHorizontal = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
`;

export const streamVertical = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(100%); }
`;

// Frame movement animation
export const frameMoveAnimation = keyframes`
  0% { transform: translate(0, 0); }
  100% { transform: translate(-10px, -10px); }
`;

// Ball-like random motion
export const ballMotion = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(10px, 10px); }
  50% { transform: translate(-10px, 10px); }
  75% { transform: translate(10px, -10px); }
  100% { transform: translate(0, 0); }
`;

// Vertical spin animation
export const verticalSpin = keyframes`
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
`;

// Horizontal spin animation
export const horizontalSpin = keyframes`
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
`;