import styled from 'styled-components';

export const StyledSlots = styled.div`
  perspective: 100px;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the slots in the container */
  justify-content: center;

  & > div {
    display: grid;
    gap: 15px; /* Better suited for mobile */
    transform: rotateX(3deg) rotateY(0deg);
  }

  @keyframes pulse {
    0%, 30% {
      transform: scale(1);
    }
    10% {
      transform: scale(1.3);
    }
  }

  /* Keyframe animations for glowing effects */
  @keyframes reveal-glow {
    0%, 30% {
      border-color: #2d2d57;
      background: #ffffff00;
    }
    10% {
      border-color: white;
      background: #ffffff33;
    }
  }

  @keyframes result-flash {
    25%, 75% {
      background-color: #ffec63;
      color: #333;
    }
    50% {
      background-color: #ffec6311;
      color: #ffec63;
    }
  }

  .result {
    border: none;
    padding: 10px;
    text-transform: uppercase;
    position: relative;
    width: 100%;
    border-radius: 10px;
    border-spacing: 10px;
    border: 1px solid #ffec63;
    background-color: #ffec6311;
    color: #ffec63;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
  }

  .result[data-good="true"] {
    animation: result-flash 5s infinite;
  }

  .slots {
    display: flex;
    gap: 15px; /* Reduced gap for mobile appearance */
    justify-content: center;
    box-sizing: border-box;
    border-radius: 10px;
  }

  .slotImage {
    aspect-ratio: 1 / 1;
    max-width: 100%;
    max-height: 100%;
  }

  .slot-machine {
    background-color: #444;
    border: 4px solid #333;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 500px; /* Limit width on desktop */
    position: relative; /* Necessary for ::before pseudo-element */
  }

  .buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap; /* Wrap buttons for smaller screens */
  }

  .score-board {
    margin-bottom: 10px;
    font-size: 1.5rem;
    color: #4CAF50;
    text-align: center;
  }

  /* Media query for mobile devices */
  @media (max-width: 600px) {
    .result {
      font-size: 0.9rem; /* Adjust font size for smaller screens */
      padding: 8px;
    }

    .slot-machine {
      padding: 15px;
    }

    .slots {
      gap: 10px; /* Smaller gap between slot items */
    }

    .buttons {
      gap: 5px;
      flex-direction: column; /* Stack buttons vertically on mobile */
      align-items: center;
    }

    .score-board {
      font-size: 1.2rem;
    }
  }

  /* Add flashing lights effect around the slot machine container */
  .slot-machine::before {
    content: "";
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border: 4px solid transparent;
    border-radius: 10px;
    animation: flashing-lights 2s infinite alternate;
  }

  @keyframes flashing-lights {
    0% {
      border-color: #ffec63;
      box-shadow: 0 0 10px #ffec63, 0 0 20px #ffec63;
    }
    50% {
      border-color: #ff5d63;
      box-shadow: 0 0 10px #ff5d63, 0 0 20px #ff5d63;
    }
    100% {
      border-color: #63ffb7;
      box-shadow: 0 0 10px #63ffb7, 0 0 20px #63ffb7;
    }
  }
`;
