//Slot.tsx

import React from 'react';
import styled, { keyframes, css } from 'styled-components';

// Define the props expected by the Slot component
interface SlotProps {
  revealed: boolean;
  good: boolean;
  itemImage: string;
}

// Define a simple animation to apply to the slot when revealed
const revealAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled component for Slot with a transient prop `$good`
const StyledSlot = styled.div<{ $good: boolean }>`
  width: 100px;
  height: 150px;
  border: 2px solid ${({ $good }) => ($good ? '#4CAF50' : '#2d2d57')};
  background-color: #4444FF11;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ $good }) =>
    $good
      ? css`
          ${revealAnimation} 0.5s ease-out forwards
        `
      : 'none'};
`;

// Slot component rendering the image only if 'revealed' is true
const Slot: React.FC<SlotProps> = ({ revealed, good, itemImage }) => (
  <StyledSlot $good={good}>
    {revealed && <img src={itemImage} alt="slot item" style={{ width: '100%' }} />}
  </StyledSlot>
);

export default Slot;

