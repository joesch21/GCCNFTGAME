// Slots.styles.ts

import styled from 'styled-components';

export const StyledSlots = styled.div`
  perspective: 100px;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the entire slots container */
  justify-content: center;

  .slots {
    display: flex;
    gap: 15px; /* Adjust gap for spacing between slot items */
    justify-content: center; /* Center the slot items horizontally */
    align-items: center; /* Center the slot items vertically */
    width: 100%;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 20px; /* Add padding if needed for spacing */
  }

  .slotImage {
    aspect-ratio: 1 / 1;
    max-width: 100px; /* Set a fixed width for the images */
    max-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #333;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    background-color: #444;
  }

  .slot-machine {
    background-color: #444;
    border: 4px solid #333;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 500px; /* Limit width on desktop */
    position: relative;
  }

  

  /* Additional styles if needed */
  /* Responsive adjustments for smaller screens */
  @media (max-width: 600px) {
    .slotImage {
      max-width: 80px; /* Adjust image size for mobile */
      max-height: 80px;
    }
    .slots {
      gap: 10px; /* Reduce gap for smaller screens */
    }
  }
`;
