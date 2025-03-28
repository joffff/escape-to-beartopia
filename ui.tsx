import React from 'react';

export interface GameUIProps {
  score: number;
  level: number;
  honeyCollected: number;
  hunnyCollected: number;
  bearHealth: number;
  bearEnergy: number;
  beeAwareness: number;
  isStealth: boolean;
}

export const GameUI: React.FC<GameUIProps> = ({
  score,
  level,
  honeyCollected,
  hunnyCollected,
  bearHealth,
  bearEnergy,
  beeAwareness,
  isStealth
}) => {
  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-4 rounded-lg text-white">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold">Score:</span>
          <span>{score}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-bold">Level:</span>
          <span>{level}</span>
        </div>
        <div className="flex items-center space-x-2">
          <img src="/images/honey.webp" alt="Honey" className="w-5 h-5" />
          <span className="font-bold">Honey:</span>
          <span>{honeyCollected}</span>
        </div>
        <div className="flex items-center space-x-2">
          <img src="/images/honey.webp" alt="Hunny" className="w-5 h-5" />
          <span className="font-bold">Hunny:</span>
          <span>{hunnyCollected}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-bold">Health:</span>
          <div className="w-32 h-2 bg-red-900 rounded-full">
            <div 
              className="h-full bg-red-500 rounded-full transition-all duration-200"
              style={{ width: `${bearHealth}%` }}
            />
          </div>
          <span>{Math.round(bearHealth)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-bold">Energy:</span>
          <div className="w-32 h-2 bg-yellow-900 rounded-full">
            <div 
              className="h-full bg-yellow-500 rounded-full transition-all duration-200"
              style={{ width: `${bearEnergy}%` }}
            />
          </div>
          <span>{Math.round(bearEnergy)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-bold">Bee Awareness:</span>
          <div className="w-32 h-2 bg-blue-900 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-200"
              style={{ width: `${beeAwareness}%` }}
            />
          </div>
          <span>{Math.round(beeAwareness)}%</span>
        </div>
        {isStealth && (
          <div className="text-green-400 font-bold">
            Stealth Mode Active
          </div>
        )}
      </div>
    </div>
  );
}; 