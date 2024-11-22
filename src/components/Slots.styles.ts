import styled, { css, keyframes } from 'styled-components';

// Random movement animation for slot items during spinning
const randomMovement = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(10px, -10px); }
  50% { transform: translate(-10px, 10px); }
  75% { transform: translate(5px, -5px); }
  100% { transform: translate(0, 0); }
`;

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
      animation: ${randomMovement} 1s infinite linear;
    `}
`;

// Flicker Image with independent animation
export const FlickerImage = styled.img<{ $flickering: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;

  ${({ $flickering }) =>
    $flickering &&
    css`
      animation: ${randomMovement} 0.6s infinite ease-in-out;
    `}
`;
