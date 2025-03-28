import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Timer, Star, Heart, Dice6 } from 'lucide-react';
import WinnerPage from './WinnerPage';

const TOTAL_TILES = 48;
const INITIAL_POSITION = 0;
const INITIAL_LIVES = 3;
const BERRY_TYPES = {
  NORMAL: { image: '/Red_Berry.webp', points: 1, color: 'bg-transparent' },
  GOLDEN: { image: '/Red_Berry.webp', points: 3, color: 'bg-transparent' },
  POISON: { image: '/Red_Berry.webp', points: -1, color: 'bg-transparent' }
};

// Define special tiles
const SPECIAL_TILES = {
  3: { type: 'berry', description: 'Golden berry! +3 points', effect: 3, symbol: '🌟' },
  5: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '🏹' },
  8: { type: 'honey', description: 'Sweet honey! +4 points', effect: 4, symbol: '🍯' },
  12: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  15: { type: 'wood', description: 'Wood logs! +2 points', effect: 2, symbol: '🪵' },
  18: { type: 'loseTurn', description: 'Slippery slope! Lose a turn', effect: 'loseTurn', symbol: '⚠️' },
  21: { type: 'honey', description: 'Honey pot! +4 points', effect: 4, symbol: '🍯' },
  25: { type: 'hunter', description: 'Hunter spotted! Move back 5 spaces', effect: -5, symbol: '🏹' },
  28: { type: 'wood', description: 'Wood bundle! +2 points', effect: 2, symbol: '🪵' },
  31: { type: 'berry', description: 'Golden berry! +3 points', effect: 3, symbol: '🌟' },
  34: { type: 'loseTurn', description: 'Thorny bush! Lose a turn', effect: 'loseTurn', symbol: '⚠️' },
  37: { type: 'honey', description: 'Honeycomb! +4 points', effect: 4, symbol: '🍯' },
  40: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '🏹' },
  42: { type: 'wood', description: 'Wood stack! +2 points', effect: 2, symbol: '🪵' },
  // New special tiles
  7: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
  16: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  23: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
  33: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  39: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
  44: { type: 'finalBerry', description: 'Final Berry! +1 point', effect: 1, symbol: '1' },
  45: { type: 'finalBerry', description: 'Final Berry! +2 points', effect: 2, symbol: '2' },
  46: { type: 'finalBerry', description: 'Final Berry! +3 points', effect: 3, symbol: '3' },
  47: { type: 'finalBerry', description: 'Final Berry! +4 points', effect: 4, symbol: '4' }
};

// Add GIF arrays for different outcomes
const GOOD_GIFS = [
  '/gifs/goodGifs/yesss-brown-bg.gif',
  '/gifs/goodGifs/yesss-pink-bg.gif',
  '/gifs/goodGifs/clap-bg.gif',
  '/gifs/goodGifs/clap-bg-faster.gif',
  '/gifs/goodGifs/chad-bear.gif',
  '/gifs/goodGifs/cheerleader.gif',
  '/gifs/goodGifs/clap-v2.gif'
];

const BAD_GIFS = [
  '/gifs/badGifs/sheesh-caption.gif',
  '/gifs/badGifs/oof-bg.gif',
  '/gifs/badGifs/Rain-Animation.gif',
  '/gifs/badGifs/sadbear.gif'
];

const BERRY_GOOD_GIFS = [
  '/gifs/berryGoodGifs/hooray-berries-bg-blank.gif'
];

function BerryForestAdvanced({ selectedCharacter, onReturnToLanding }) {
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [message, setMessage] = useState('');
  const [diceRoll, setDiceRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [currentGif, setCurrentGif] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const rollDice = () => {
    if (!playerTurn || isRolling) return;
    
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    setIsRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
    
    setTimeout(() => {
      setIsRolling(false);
      movePlayer(roll);
    }, 1000);
  };

  const movePlayer = (spaces) => {
    const newPosition = position + spaces;
    
    // If player rolls too high, move backwards
    if (newPosition >= TOTAL_TILES) {
      const spacesToMoveBack = newPosition - (TOTAL_TILES - 1);
      const finalPosition = TOTAL_TILES - 1 - spacesToMoveBack;
      setPosition(finalPosition);
      setMessage(`Rolled too high! Moving back ${spacesToMoveBack} spaces`);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setPlayerTurn(true);
      }, 2000);
      return;
    }
    
    setPosition(newPosition);
    
    // Check for special tile effects
    const specialTile = SPECIAL_TILES[newPosition];
    if (specialTile) {
      handleSpecialTile(specialTile);
    } else {
      // Regular tile - collect normal berry
      setCurrentGif(getRandomGif(GOOD_GIFS));
      setScore(prev => prev + 1);
      setMessage('Collected a berry! +1 point');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setCurrentGif(null);
        setPlayerTurn(true);
      }, 2000);
    }
  };

  const handleSpecialTile = (tile) => {
    setMessage(tile.description);
    setShowMessage(true);
    
    switch (tile.type) {
      case 'hunter':
        setCurrentGif(getRandomGif(BAD_GIFS));
        setPosition(prev => Math.max(0, prev + tile.effect));
        setTimeout(() => {
          setShowMessage(false);
          setCurrentGif(null);
          setPlayerTurn(true);
        }, 2000);
        break;
      case 'poison':
        setCurrentGif(getRandomGif(BAD_GIFS));
        setGameStatus('lost');
        break;
      case 'loseTurn':
        setCurrentGif(getRandomGif(BAD_GIFS));
        setTimeout(() => {
          setShowMessage(false);
          setCurrentGif(null);
          setPlayerTurn(true);
        }, 2000);
        break;
      case 'rotten':
        setCurrentGif(getRandomGif(BAD_GIFS));
        setPosition(0);
        setTimeout(() => {
          setShowMessage(false);
          setCurrentGif(null);
          setPlayerTurn(true);
        }, 2000);
        break;
      case 'finalBerry':
        setCurrentGif(getRandomGif(BERRY_GOOD_GIFS));
        setScore(prev => prev + tile.effect);
        setTimeout(() => {
          setShowMessage(false);
          setCurrentGif(null);
          setGameStatus('won');
        }, 2000);
        break;
      case 'berry':
      case 'honey':
      case 'wood':
        setCurrentGif(getRandomGif(GOOD_GIFS));
        setScore(prev => prev + tile.effect);
        setTimeout(() => {
          setShowMessage(false);
          setCurrentGif(null);
          setPlayerTurn(true);
        }, 2000);
        break;
    }
  };

  // Check for win condition
  useEffect(() => {
    if (lives <= 0) {
      setGameStatus('lost');
    }
  }, [lives]);

  const resetGame = () => {
    setPosition(INITIAL_POSITION);
    setScore(0);
    setLives(INITIAL_LIVES);
    setGameStatus('playing');
    setMessage('');
    setDiceRoll(null);
    setPlayerTurn(true);
  };

  // Add function to get random GIF
  const getRandomGif = (gifArray) => {
    const randomIndex = Math.floor(Math.random() * gifArray.length);
    return gifArray[randomIndex];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
      {gameStatus === 'won' ? (
        <WinnerPage 
          score={score}
          onReturnToLanding={onReturnToLanding}
          onPlayAgain={resetGame}
        />
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="/Red_Berry.webp" 
                  alt="Berry" 
                  className="w-12 h-12 object-contain"
                />
                <h1 className="text-4xl font-bold text-green-800">Berry Forest Journey</h1>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src={selectedCharacter?.image}
                  alt={selectedCharacter?.name}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-lg font-semibold text-green-700">{selectedCharacter?.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-semibold text-green-700">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-red-500" />
                <span className="text-xl font-semibold text-green-700">{lives}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 transform transition-all hover:shadow-2xl overflow-hidden">
            <div className="relative">
              {/* Forest background */}
              <div 
                className="absolute inset-0 bg-[url('/bearish-den-map.jpg')] bg-cover bg-center rounded-lg"
                style={{ opacity: 0.8 }}
              ></div>
              
              {/* Game path */}
              <div className="relative">
                <div className="grid grid-cols-8 gap-2 mb-6">
                  {Array.from({ length: TOTAL_TILES }).map((_, index) => {
                    const isPlayer = index === position;
                    const specialTile = SPECIAL_TILES[index];
                    const isPast = index < position;
                    const isFinalBerry = index >= 44;
                    
                    return (
                      <div
                        key={index}
                        className={`aspect-square rounded-lg flex items-center justify-center transform transition-all duration-200
                          ${isPlayer ? 'scale-110 bg-green-500' : ''}
                          ${isPast ? 'bg-green-200' : 'bg-white'}
                          ${specialTile && !isFinalBerry ? 'bg-yellow-200' : ''}
                          ${isFinalBerry ? 'bg-red-100' : ''}`}
                      >
                        {isPlayer ? (
                          <div className="transform transition-transform duration-200">
                            <div className="w-3/4 h-3/4 rounded-full border-4 border-green-500 shadow-lg overflow-hidden bg-white">
                              <img 
                                src={selectedCharacter?.image}
                                alt="Player" 
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                          </div>
                        ) : isFinalBerry ? (
                          <div className="flex flex-col items-center">
                            <img 
                              src="/Red_Berry.webp" 
                              alt="Final Berry" 
                              className="w-12 h-12 mb-1"
                            />
                            <div className="text-2xl font-bold text-green-800">
                              {specialTile.symbol}
                            </div>
                          </div>
                        ) : specialTile ? (
                          <div className="text-center text-2xl font-bold text-green-800">
                            {specialTile.symbol}
                          </div>
                        ) : isPast ? (
                          <div className="text-green-500 text-2xl">✓</div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            {message && (
              <div className="mb-4 text-xl font-semibold text-green-700 animate-bounce">
                {message}
              </div>
            )}
            
            {gameStatus === 'lost' ? (
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-red-700 mb-2">😢 Game Over</h2>
                <p className="text-gray-600 mb-4">Final Score: {score}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetGame}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors transform hover:scale-105"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onReturnToLanding}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors transform hover:scale-105"
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  {!gameStarted ? "Roll the dice to start!" : 
                   playerTurn ? "Roll the dice to move!" : "Waiting for next turn..."}
                </p>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={rollDice}
                    disabled={!playerTurn || isRolling}
                    className={`bg-green-500 text-white px-6 py-3 rounded-lg transition-colors transform hover:scale-105
                      ${(!playerTurn || isRolling) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Dice6 className="w-6 h-6" />
                      <span>{isRolling ? 'Rolling...' : diceRoll || 'Roll Dice'}</span>
                    </div>
                  </button>
                  <div className="flex justify-center space-x-4">
                    {!gameStarted ? (
                      <button
                        onClick={onReturnToLanding}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-105"
                      >
                        Exit Game
                      </button>
                    ) : (
                      <button
                        onClick={() => setGameStatus('lost')}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors transform hover:scale-105"
                      >
                        Quit Game
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GIF popup */}
      {currentGif && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="relative z-10">
            <img 
              src={currentGif} 
              alt="Outcome GIF" 
              className="w-64 h-64 object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BerryForestAdvanced;