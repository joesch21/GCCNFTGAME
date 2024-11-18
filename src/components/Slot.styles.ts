import styled, { keyframes, css } from 'styled-components';

// Spinner animation for loading
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Spinning animation for slot boxes during spinning
const boxSpinAnimation = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, 10px) rotate(90deg);
  }
  50% {
    transform: translate(-10px, 10px) rotate(180deg);
  }
  75% {
    transform: translate(10px, -10px) rotate(270deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
`;

// Flicker animation for images
const flickerAnimation = keyframes`
  0% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.5; transform: scale(1); }
`;

// Streaming symbol animation for horizontal or vertical movement
const streamHorizontal = keyframes`
  from { transform: translateX(-100%); opacity: 0.8; }
  to { transform: translateX(100%); opacity: 0.8; }
`;

const streamVertical = keyframes`
  from { transform: translateY(-100%); opacity: 0.8; }
  to { transform: translateY(100%); opacity: 0.8; }
`;

// Keyframe animation for slot frames moving within the larger container
const frameMoveAnimation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(10px, 10px);
  }
  50% {
    transform: translate(-10px, -10px);
  }
  75% {
    transform: translate(10px, -10px);
  }
  100% {
    transform: translate(0, 0);
  }
`;

// Styled component for slot container with random movement
export const StyledSlot = styled.div<{ $good: boolean; $spinning: boolean }>`
  width: 70px;
  height: 100px;
  border: 2px solid ${({ $good }) => ($good ? '#4CAF50' : '#2d2d57')};
  background-color: rgba(68, 68, 255, 0.1);
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);

  ${({ $spinning }) =>
    $spinning &&
    css`
      animation: ${frameMoveAnimation} 0.5s infinite linear;
    `}
`;

// Styled component for flickering image
export const FlickerImage = styled.img<{ $flickering: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;

  ${({ $flickering }) =>
    $flickering &&
    css`
      animation: ${flickerAnimation} 0.2s infinite;
    `}
`;

// Spinner overlay during loading (e.g., deposit or cash out)
export const SpinnerOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 1.2em;
  z-index: 1000;
`;

// Loader spinner circle
export const Loader = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 10px;
`;

// Streaming symbols container for payout effects
export const StreamingSymbolsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 1000;
`;

// Individual streaming symbol with direction animation
export const StreamingSymbol = styled.div<{ direction: 'horizontal' | 'vertical' }>`
  animation: ${({ direction }) =>
    css`
      ${direction === 'horizontal' ? streamHorizontal : streamVertical} 3s linear infinite
    `};
  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }
`;

// Slot grid for arranging slots in rows and columns
export const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, auto);
  grid-gap: 15px;
  justify-items: center;
  align-items: center;
  margin: 20px auto;
  padding: 10px;
  background: rgba(34, 34, 34, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 300px;
`;
