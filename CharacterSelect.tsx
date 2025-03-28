import React from 'react';

export type BearCharacter = 'scotty-bear' | 'toli-bear' | 'carlo-bear';

interface CharacterSelectProps {
  onSelect: (character: BearCharacter) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-6">Choose Your Bear</h2>
        <div className="flex gap-6">
          <div 
            className="cursor-pointer transform hover:scale-110 transition-transform"
            onClick={() => onSelect('scotty-bear')}
          >
            <img 
              src="/images/scotty-bear.webp" 
              alt="Scotty Bear" 
              className="w-32 h-32 rounded-lg mb-2"
            />
            <p className="font-semibold">Scotty Bear</p>
            <p className="text-sm text-gray-600">The Cool One</p>
          </div>
          <div 
            className="cursor-pointer transform hover:scale-110 transition-transform"
            onClick={() => onSelect('toli-bear')}
          >
            <img 
              src="/images/toli-bear.webp" 
              alt="Toli Bear" 
              className="w-32 h-32 rounded-lg mb-2"
            />
            <p className="font-semibold">Toli Bear</p>
            <p className="text-sm text-gray-600">The Hippie One</p>
          </div>
          <div 
            className="cursor-pointer transform hover:scale-110 transition-transform"
            onClick={() => onSelect('carlo-bear')}
          >
            <img 
              src="/images/carlo-bear.webp" 
              alt="Carlo Bear" 
              className="w-32 h-32 rounded-lg mb-2"
            />
            <p className="font-semibold">Carlo Bear</p>
            <p className="text-sm text-gray-600">The Biker One</p>
          </div>
        </div>
        <p className="mt-6 text-gray-600">Click on a bear to select your character</p>
      </div>
    </div>
  );
}; 