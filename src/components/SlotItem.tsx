import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

interface SlotProps {
  revealed: boolean;
  good: boolean;
  itemImage: string;
}

const flickerAnimation = keyframes`
  0% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.2; transform: scale(1); }
`;

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
  ${({ $good }) =>
    $good
      ? css`
          animation: ${revealAnimation} 0.5s ease-out forwards;
        `
      : 'none'};
`;

const FlickerImage = styled.img<{ $flickering: boolean }>`
  width: 100%;
  ${({ $flickering }) =>
    $flickering &&
    css`
      animation: ${flickerAnimation} 0.2s infinite;
    `}
`;

const Slot: React.FC<SlotProps> = ({ revealed, good, itemImage }) => {
  const [displayedImage, setDisplayedImage] = useState<string>(itemImage);
  const [flickering, setFlickering] = useState(true);

  // Placeholder images using public paths
  const placeholderImages = [
    process.env.PUBLIC_URL + '/slot-unicorn.png',
    process.env.PUBLIC_URL + '/slot-emoji-cool.png',
    process.env.PUBLIC_URL + '/slot-wojak.png',
  ];

  useEffect(() => {
    let flickerInterval: NodeJS.Timeout;

    if (!revealed) {
      setFlickering(true);
      flickerInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * placeholderImages.length);
        setDisplayedImage(placeholderImages[randomIndex]);
      }, 100); // Adjust interval speed for flicker
    } else {
      setFlickering(false);
      setDisplayedImage(itemImage); // Show final image when revealed
    }

    return () => clearInterval(flickerInterval); // Cleanup interval on unmount
  }, [revealed, itemImage]);

  return (
    <StyledSlot $good={good}>
      <FlickerImage
        src={displayedImage}
        alt="slot item"
        onError={() => setDisplayedImage(process.env.PUBLIC_URL + '/slot-unicorn.png')} // Fallback image
        $flickering={flickering}
      />
    </StyledSlot>
  );
};

export default Slot;
