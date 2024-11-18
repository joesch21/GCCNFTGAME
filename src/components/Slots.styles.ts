import styled from 'styled-components';

export const StyledSlots = styled.div`
  perspective: 120px;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the entire slots container */
  justify-content: center;

.slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 10px;
  padding: 10px; /* Consistent padding */
  justify-content: center;
  align-content: center;
  background-color: rgba(34, 34, 34, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}



.slotImage {
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: clamp(80px, 10vw, 120px);
  max-height: clamp(80px, 10vw, 120px);
  object-fit: cover;
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
    max-width: 500px; /* Limit the width on larger screens */
    position: relative;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .slots {
      grid-template-columns: repeat(3, 1fr); /* Keep 3 columns for mobile */
      grid-template-rows: repeat(3, auto); /* Create 3 rows for 9 slots */
      gap: 10px; /* Adjust gap for smaller screens */
    }

    .slotImage {
      max-width: 100px; /* Reduce size for mobile screens */
      max-height: 100px;
    }
  }

  @media (max-width: 480px) {
    .slots {
      grid-template-columns: repeat(3, 1fr); /* Retain 3 columns for very small screens */
      grid-template-rows: repeat(3, auto); /* 3 rows for 9 slots */
      gap: 8px;
      justify-content: center; /* Ensure slots are evenly distributed */
    }

    .slotImage {
      max-width: 100px; /* Further adjust for very small screens */
      max-height: 80px;
    }
  }
`;
