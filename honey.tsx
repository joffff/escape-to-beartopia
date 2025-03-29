import React from 'react';

interface HoneyProps {
  x: number;
  y: number;
  isCollected: boolean;
}

export const Honey: React.FC<HoneyProps> = ({ x, y, isCollected }) => {
  if (isCollected) return null;

  return (
    <div
      className="absolute w-16 h-16"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <img 
        src="/images/beehive.webp"
        alt="Beehive"
        className="w-full h-full object-contain"
      />
    </div>
  );
}; 