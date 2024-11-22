import styled, { css } from 'styled-components';
import {
  spin,
  flickerAnimation,
  streamHorizontal,
  streamVertical,
  frameMoveAnimation,
  verticalSpin,
  horizontalSpin,
} from '../styles/animations';

export const StyledSlotItem = styled.div<{ $spinning: boolean; $good: boolean }>`
  width: 100px;
  height: 100px;
  border: 2px solid #444;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background-color: #1a1a2e;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);

  ${({ $good }) =>
    $good &&
    css`
      border-color: #4caf50;
    `}

  /* Mobile-specific styles */
  @media (max-width: 768px) {
    width: 80px;
    height: 80px; /* Reduce size slightly for smaller screens */
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4); /* Adjust shadow */
  }

  @media (max-width: 480px) {
    width: 70px;
    height: 70px; /* Further reduce size for very small screens */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`;


// Wrapper for rotating images (handles animation direction)
export const RotatingImageWrapper = styled.div<{ $spinning: boolean; $direction: 'vertical' | 'horizontal' }>`
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'vertical' ? 'column' : 'row')};
  overflow: hidden;
  position: relative;
  width: 80%;
  height: 80%;

  ${({ $spinning, $direction }) =>
    $spinning &&
    css`
      animation: ${$direction === 'vertical' ? verticalSpin : horizontalSpin} 0.05s linear infinite;
    `}
`;

// Individual rotating image
export const RotatingImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  flex-shrink: 0;

  &:not(:first-child) {
    margin-top: -10%; /* Adds smooth overlap */
    margin-left: -10%; /* Adds smooth overlap for horizontal */
  }
`;

export const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Always 3 columns */
  grid-gap: 10px;
  justify-items: center;
  align-items: center;
  width: 100%;

  /* Mobile-specific styles */
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr); /* Keep it 3x3 on mobile */
    grid-gap: 8px; /* Adjust spacing for smaller screens */
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr); /* Still 3 columns */
    grid-gap: 5px; /* Further reduce spacing */
  }
`;


// Flickering Image for Slot Items
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

// Spinner Overlay for deposit or cash-out loading states
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

// Loader Spinner for loading animations
export const Loader = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 10px;
`;

// Streaming Symbols Container for winning animations
export const StreamingSymbolsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 80%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 1000;
`;

// Individual Streaming Symbol Animation
export const StreamingSymbol = styled.div<{ direction: 'horizontal' | 'vertical' }>`
  animation: ${({ direction }) =>
    direction === 'horizontal' ? streamHorizontal : streamVertical} 5s linear infinite;

  img {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
`;

// Styled Slot Container for individual slot frames
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
      animation: ${frameMoveAnimation} 0.1s infinite linear;
    `}
`;
