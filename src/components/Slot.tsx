// Slot.tsx
import React from 'react';
import styled from 'styled-components';

// Define the props expected by the Slot component
interface SlotProps {
  revealed: boolean;
  good: boolean;
  itemImage: string;
}

// Define styled components
const StyledSlot = styled.div`
  width: 100px;
  height: 150px;
  border: 2px solid #2d2d57;
  background-color: #4444FF11;
  overflow: hidden;
  position: relative;
`;

// Define the Slot component
const Slot: React.FC<SlotProps> = ({ revealed, good, itemImage }) => (
  <StyledSlot>
    {/* Conditionally display the image based on 'revealed' status */}
    {revealed && <img src={itemImage} alt="slot item" style={{ width: '100%' }} />}
  </StyledSlot>
);

export default Slot;
