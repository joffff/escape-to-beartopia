import React from 'react';
import { BearCharacter } from './CharacterSelect';

interface PlayerProps {
  x: number;
  y: number;
  isStealth: boolean;
  character: BearCharacter;
}

export const Player: React.FC<PlayerProps> = ({ x, y, isStealth, character }) => {
  return (
    <div
      className={`absolute w-16 h-16 transition-all duration-200 ${
        isStealth ? 'opacity-50' : 'opacity-100'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <img 
        src={`/images/${character}.webp`}
        alt={character}
        className="w-full h-full object-contain"
      />
    </div>
  );
}; 