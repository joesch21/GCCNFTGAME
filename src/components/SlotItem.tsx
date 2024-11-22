import React, { useEffect, useState } from 'react';
import { StyledSlotItem, RotatingImageWrapper, RotatingImage } from './Slot.styles';

interface SlotItemProps {
  revealed: boolean; // Indicates if the slot has been revealed
  spinning: boolean; // Indicates if the slot is currently spinning
  good: boolean; // Indicates if the slot item is part of a win
  itemImage: string; // The final image to display when revealed
  direction?: 'vertical' | 'horizontal'; // Direction of the spin animation
}

const SlotItem: React.FC<SlotItemProps> = ({
  revealed,
  spinning,
  good,
  itemImage,
  direction = 'vertical',
}) => {
  const [displayedImage, setDisplayedImage] = useState<string>(itemImage);
  const [placeholderImages, setPlaceholderImages] = useState<string[]>([]);

  useEffect(() => {
    // Define placeholder images for spinning animation
    const images = [
      `${process.env.PUBLIC_URL}/slot-unicorn.png`,
      `${process.env.PUBLIC_URL}/slot-emoji-cool.png`,
      `${process.env.PUBLIC_URL}/slot-wojak.png`,
      `${process.env.PUBLIC_URL}/slot-smiley.png`,
      `${process.env.PUBLIC_URL}/slot-emoji-hearts.png`,
      `${process.env.PUBLIC_URL}/slot-2x.png`,
    ];
    setPlaceholderImages(images);
  }, []);

  useEffect(() => {
    if (!spinning && revealed) {
      // Show the final image when spinning stops
      setDisplayedImage(itemImage);
    }
  }, [spinning, revealed, itemImage]);

  return (
    <StyledSlotItem $spinning={spinning} $good={good}>
      <RotatingImageWrapper $spinning={spinning} $direction={direction}>
        {(spinning ? placeholderImages : [displayedImage]).map((image, index) => (
          <RotatingImage
            key={index}
            src={image}
            alt="slot item"
            onError={() =>
              setDisplayedImage(`${process.env.PUBLIC_URL}/slot-unicorn.png`)
            } // Fallback image
          />
        ))}
      </RotatingImageWrapper>
    </StyledSlotItem>
  );
};

export default SlotItem;
