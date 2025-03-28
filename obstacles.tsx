import React from 'react';

interface ObstacleProps {
  x: number;
  y: number;
  type: 'tree' | 'rock';
}

export const Obstacle: React.FC<ObstacleProps> = ({ x, y, type }) => {
  const size = type === 'tree' ? 'w-16 h-20' : 'w-12 h-12';
  const image = type === 'tree' ? 'tree.webp' : 'quarry.webp';

  return (
    <div
      className={`absolute ${size}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <img 
        src={`/images/${image}`}
        alt={type}
        className="w-full h-full object-contain"
      />
    </div>
  );
}; 