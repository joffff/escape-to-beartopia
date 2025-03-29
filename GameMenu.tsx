import React, { useState, useEffect } from 'react';

interface GameMenuProps {
  gameStatus: 'menu' | 'character-select' | 'won' | 'gameOver';
  score: number;
  level: number;
  onStartGame: () => void;
  onNextLevel: () => void;
  onRestart: () => void;
}

const goodGifs = [
  'yesss-brown-bg.gif',
  'yesss-pink-bg.gif',
  'clap-bg.gif',
  'clap-bg-faster.gif',
  'chad-bear.gif',
  'cheerleader.gif',
  'clap-v2.gif'
];

const badGifs = [
  'sheesh-caption.gif',
  'oof-bg.gif',
  'Rain-Animation.gif',
  'sadbear.gif'
];

const getRandomGif = (type: 'good' | 'bad'): string => {
  const gifs = type === 'good' ? goodGifs : badGifs;
  const randomIndex = Math.floor(Math.random() * gifs.length);
  return `/gifs/${type}Gifs/${gifs[randomIndex]}`;
};

export const GameMenu: React.FC<GameMenuProps> = ({
  gameStatus,
  score,
  level,
  onStartGame,
  onNextLevel,
  onRestart
}) => {
  const [showGif, setShowGif] = useState(false);
  const [currentGif, setCurrentGif] = useState('');

  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'gameOver') {
      const gifType = gameStatus === 'won' ? 'good' : 'bad';
      setCurrentGif(getRandomGif(gifType));
      setShowGif(true);
      
      const timer = setTimeout(() => {
        setShowGif(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gameStatus]);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-auto">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/beartopia-scene-background.jpg")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>
      
      {/* Menu Content */}
      <div className="relative z-10 max-w-4xl mx-4 my-8 flex flex-col items-center space-y-8">
        {gameStatus === 'menu' && (
          <div className="flex flex-col items-center space-y-6">
            {/* Main Logo and Title */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <img 
                  src="/images/beehive.webp" 
                  alt="Beehive" 
                  className="w-32 h-32 object-contain animate-bounce"
                />
                <div className="absolute -top-4 -right-4">
                  <img 
                    src="/images/beefren.webp" 
                    alt="Bee" 
                    className="w-16 h-16 object-contain animate-pulse"
                  />
                </div>
              </div>
              <h1 className="text-6xl font-bold text-yellow-400 drop-shadow-lg mb-2">
                Honey Hills
              </h1>
              <p className="text-xl text-yellow-200 drop-shadow-lg">
                A Bear's Sweet Adventure
              </p>
            </div>

            {/* Start Button */}
            <button
              onClick={onStartGame}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-12 rounded-full text-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Play Now
            </button>
          </div>
        )}

        {gameStatus === 'character-select' && (
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl">
            <div className="flex flex-col items-center mb-6">
              <img 
                src="/images/beehive.webp" 
                alt="Beehive" 
                className="w-20 h-20 object-contain mb-4"
              />
              <h2 className="text-3xl font-bold text-yellow-800 mb-2">Choose Your Bear</h2>
              <p className="text-gray-600">Select your character and learn the controls</p>
            </div>

            {/* Character Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-yellow-50 p-4 rounded-lg text-center hover:bg-yellow-100 cursor-pointer transition-colors">
                <img 
                  src="/images/scotty-bear.webp" 
                  alt="Scotty Bear" 
                  className="w-24 h-24 mx-auto mb-2"
                />
                <h3 className="font-bold text-lg">Scotty Bear</h3>
                <p className="text-sm text-gray-600">The Adventurous One</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center hover:bg-yellow-100 cursor-pointer transition-colors">
                <img 
                  src="/images/toli-bear.webp" 
                  alt="Toli Bear" 
                  className="w-24 h-24 mx-auto mb-2"
                />
                <h3 className="font-bold text-lg">Toli Bear</h3>
                <p className="text-sm text-gray-600">The Stealthy One</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center hover:bg-yellow-100 cursor-pointer transition-colors">
                <img 
                  src="/images/carlo-bear.webp" 
                  alt="Carlo Bear" 
                  className="w-24 h-24 mx-auto mb-2"
                />
                <h3 className="font-bold text-lg">Carlo Bear</h3>
                <p className="text-sm text-gray-600">The Brave One</p>
              </div>
            </div>

            {/* Controls Section */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-xl text-blue-800 mb-4 text-center">Game Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Movement</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="bg-gray-200 px-2 py-1 rounded mr-2">WASD</span>
                      Move your bear
                    </li>
                    <li className="flex items-center">
                      <span className="bg-gray-200 px-2 py-1 rounded mr-2">C</span>
                      Toggle Stealth Mode
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Game Actions</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="bg-gray-200 px-2 py-1 rounded mr-2">Space</span>
                      Start/Restart game
                    </li>
                    <li className="flex items-center">
                      <span className="bg-gray-200 px-2 py-1 rounded mr-2">Esc</span>
                      Pause game
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Start Game Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={onStartGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-200 transform hover:scale-105"
              >
                Start Game
              </button>
            </div>
          </div>
        )}
        
        {gameStatus === 'won' && (
          <div className="flex flex-col items-center space-y-8">
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl text-center">
              <h1 className="text-4xl font-bold mb-4 text-green-600">Level Complete!</h1>
              <p className="text-xl mb-4">Score: {score}</p>
              <p className="text-lg mb-6">Level {level} Completed!</p>
              <button
                onClick={onNextLevel}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-200 transform hover:scale-105"
              >
                Next Level
              </button>
            </div>
            {showGif && (
              <div className="mt-8">
                <img
                  src={currentGif}
                  alt="Reaction"
                  className="max-w-md max-h-96 object-contain"
                />
              </div>
            )}
          </div>
        )}
        
        {gameStatus === 'gameOver' && (
          <div className="flex flex-col items-center space-y-8">
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl text-center">
              <h1 className="text-4xl font-bold mb-4 text-red-600">Game Over</h1>
              <p className="text-xl mb-4">Final Score: {score}</p>
              <p className="text-lg mb-6">Reached Level {level}</p>
              <button
                onClick={onRestart}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
            {showGif && (
              <div className="mt-8">
                <img
                  src={currentGif}
                  alt="Reaction"
                  className="max-w-md max-h-96 object-contain"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 