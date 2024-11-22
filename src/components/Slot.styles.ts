import styled, { css } from 'styled-components';
import {
  spin,
  flickerAnimation,
  streamHorizontal,
  streamVertical,
  frameMoveAnimation,
} from '../styles/animations';
import { ballMotion } from '../styles/animations';

// Styled Slot
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

// Flicker Image
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

// Spinner Overlay
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

// Loader Spinner
export const Loader = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 10px;
`;

// Streaming Symbols Container
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

// Streaming Symbols
export const StreamingSymbol = styled.div<{ direction: 'horizontal' | 'vertical' }>`
  animation: ${({ direction }) =>
    direction === 'horizontal' ? streamHorizontal : streamVertical} 3s linear infinite;

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }
`;

// Slot Grid
export const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// Slot Item with bouncing animation
export const StyledSlotItem = styled.div<{ $spinning: boolean }>`
  width: 100px;
  height: 120px;
  border: 2px solid #444;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background-color: #1a1a2e;

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    ${({ $spinning }) =>
      $spinning &&
      css`
        animation: ${ballMotion} 2s infinite ease-in-out;
      `}
  }
`;