//SlotItem.tsx

import React, { useState, useEffect } from 'react';
import { StyledSlot, FlickerImage } from './Slot.styles';

interface SlotItemProps {
  revealed: boolean;
  spinning: boolean; // Prop to handle spinning animation
  good: boolean; // Indicates if the slot item is part of a win
  itemImage: string; // The image to display when revealed
}

const SlotItem: React.FC<SlotItemProps> = ({ revealed, spinning, good, itemImage }) => {
  const [displayedImage, setDisplayedImage] = useState<string>(itemImage); // Image being displayed
  const [flickering, setFlickering] = useState<boolean>(true); // Flickering animation state

  // Placeholder images for random animation during spin
  const placeholderImages = [
    `${process.env.PUBLIC_URL}/slot-unicorn.png`,
    `${process.env.PUBLIC_URL}/slot-emoji-cool.png`,
    `${process.env.PUBLIC_URL}/slot-wojak.png`,
    `${process.env.PUBLIC_URL}/slot-smiley.png`,
    `${process.env.PUBLIC_URL}/slot-emoji-hearts.png`,
    `${process.env.PUBLIC_URL}/slot-2x.png`,
  ];

  useEffect(() => {
    let flickerInterval: NodeJS.Timeout;

    if (spinning) {
      // While spinning, set random images from placeholders
      setFlickering(true);
      flickerInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * placeholderImages.length);
        setDisplayedImage(placeholderImages[randomIndex]);
      }, 100); // Change image every 100ms
    } else if (revealed) {
      // Stop flickering and show the final image
      setFlickering(false);
      setDisplayedImage(itemImage);
    }

    return () => clearInterval(flickerInterval); // Cleanup interval on unmount
  }, [spinning, revealed, itemImage, placeholderImages]);

  return (
    <StyledSlot $spinning={spinning} $good={good}>
      <FlickerImage
        src={displayedImage}
        alt="slot item"
        $flickering={spinning} // Flickering only during spinning
        onError={() => setDisplayedImage(`${process.env.PUBLIC_URL}/slot-unicorn.png`)} // Fallback image
      />
    </StyledSlot>
  );
};

export default SlotItem;
