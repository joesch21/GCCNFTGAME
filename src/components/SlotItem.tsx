import React, { useState, useEffect } from 'react';
import { StyledSlot, FlickerImage } from './Slot.styles';

interface SlotItemProps {
  revealed: boolean;
  spinning: boolean; // New prop for spinning state
  good: boolean;
  itemImage: string;
}

const SlotItem: React.FC<SlotItemProps> = ({ revealed, spinning, good, itemImage }) => {
  const [displayedImage, setDisplayedImage] = useState<string>(itemImage);
  const [flickering, setFlickering] = useState(true);

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

    if (!revealed) {
      setFlickering(true);
      flickerInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * placeholderImages.length);
        setDisplayedImage(placeholderImages[randomIndex]);
      }, 100);
    } else {
      setFlickering(false);
      setDisplayedImage(itemImage); // Show final image when revealed
    }

    return () => clearInterval(flickerInterval); // Cleanup interval on unmount
  }, [revealed, itemImage]);

  return (
    <StyledSlot $spinning={spinning} $good={good}>
      <FlickerImage
        src={displayedImage}
        alt="slot item"
        onError={() => setDisplayedImage(`${process.env.PUBLIC_URL}/slot-unicorn.png`)}
        $flickering={spinning}
      />
    </StyledSlot>
  );
};

export default SlotItem;
