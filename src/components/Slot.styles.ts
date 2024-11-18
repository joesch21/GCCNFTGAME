import styled, { keyframes } from 'styled-components';

// Keyframe for the spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// The full-screen overlay for loading
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

// The actual spinner circle
export const Loader = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 10px;
`;

// Style for the slot grid container (3x3 layout)
export const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns for the 3x3 layout */
  grid-gap: 15px; /* Space between slots */
  justify-items: center;
  align-items: center;
  margin: 20px auto; /* Center the grid on the page */
  padding: 10px;
  background: rgba(34, 34, 34, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  width: 100%; /* Full-width for responsiveness */
  max-width: 300px; /* Optional: limit the max width */
`;

// Style for individual slot items
export const StyledSlot = styled.div<{ $good: boolean }>`
  width: 100px;
  height: 80px;
  border: 2px solid ${({ $good }) => ($good ? '#4CAF50' : '#2d2d57')};
  background-color: rgba(68, 68, 255, 0.1);
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
`;

// Style for slot images (with flicker effect)
export const FlickerImage = styled.img<{ $flickering: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: ${({ $flickering }) =>
    $flickering
      ? `${keyframes`
        0% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
        100% { opacity: 0.2; transform: scale(1); }
      `} 0.2s infinite`
      : 'none'};
`;
