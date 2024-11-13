import styled from 'styled-components';

export const StyledSpinner = styled.div`
  // Animation for spinning effect
  @keyframes spinning {
    0% {
      top: 0;
    }
    100% {
      top: calc(var(--num-items) * -100%);
    }
  }

  --num-items: 5;
  --spin-speed: 0.6s;

  position: absolute;
  width: 100%;
  height: 100%;
  transition: opacity 0.1s 0.1s ease;
  animation: spinning var(--spin-speed) 0.1s linear infinite;
  opacity: 0;

  // Ensure spinner is visible while spinning
  &[data-spinning="true"] {
    opacity: 1;
  }

  & > div {
    color: white;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 15px;
    font-size: 2rem; // Base font size for desktop

    // Add subtle flashing effect to the spinner
    animation: pulse 1s infinite alternate;
  }

  // Adding flashing lights effect around each slot
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 5px #ffec63, 0 0 15px #ffec63;
    }
    50% {
      box-shadow: 0 0 10px #63ffb7, 0 0 20px #63ffb7;
    }
  }

  // Responsive styling for mobile screens
  @media (max-width: 600px) {
    --spin-speed: 0.8s; // Slower spin speed for better visibility on smaller screens

    & > div {
      font-size: 1.5rem; // Smaller font size for mobile screens
      padding: 10px; // Reduced padding for better fit
    }
  }

  @media (max-width: 400px) {
    --spin-speed: 1s; // Slow down even more on very small screens

    & > div {
      font-size: 1.2rem; // Further reduced font size for very small screens
      padding: 8px;
    }
  }
`;
