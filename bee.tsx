import React from 'react';

interface BeeProps {
  x: number;
  y: number;
  isAlerted: boolean;
}

export const Bee: React.FC<BeeProps> = ({ x, y, isAlerted }) => {
  return (
    <div
      className={`absolute w-8 h-8 transition-all duration-200 ${
        isAlerted ? 'scale-110' : 'scale-100'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <img 
        src="/images/beefren.webp"
        alt="Bee"
        className={`w-full h-full object-contain transition-all duration-200 ${
          isAlerted ? 'filter hue-rotate-60' : ''
        }`}
      />
    </div>
  );
}; 