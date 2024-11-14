// Slot.styles.ts

import styled from 'styled-components';

export const StyledSpinner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  animation: spinning 0.6s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;

  @keyframes spinning {
    0% {
      top: 0;
    }
    100% {
      top: calc(var(--num-items) * -100%);
    }
  }

  .slotImage {
    aspect-ratio: 1 / 1;
    max-width: 100%;
    max-height: 100%;
  }

  /* Responsive styling */
  @media (max-width: 600px) {
    .slotImage {
      width: 60px;
      height: 60px;
    }
  }
`;
