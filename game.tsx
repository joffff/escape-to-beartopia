import React, { useState, useEffect, useCallback } from 'react';
import { Player } from './player.tsx';
import { Bee } from './bee.tsx';
import { Obstacle } from './obstacles.tsx';
import { Honey } from './honey.tsx';
import { GameUI } from './ui.tsx';
import { CharacterSelect, BearCharacter } from './CharacterSelect.tsx';
import { GameMenu } from './GameMenu.tsx';

type Difficulty = 'easy' | 'medium' | 'hard';

interface GameState {
  beeAwareness: number;
  honeyCollected: number;
  hunnyCollected: number;
  bearEnergy: number;
  bearHealth: number;
  currentStage: number;
  playerX: number;
  playerY: number;
  isStealth: boolean;
  bees: Array<{ x: number; y: number; isAlerted: boolean }>;
  obstacles: Array<{ x: number; y: number; type: 'tree' | 'rock' }>;
  honey: Array<{ x: number; y: number; isCollected: boolean; type: 'honey' | 'hunny' }>;
  gameStatus: 'menu' | 'character-select' | 'playing' | 'won' | 'gameOver';
  score: number;
  difficulty: Difficulty;
  selectedCharacter?: BearCharacter;
  level: number;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BASE_PLAYER_SPEED = 5;
const BASE_STEALTH_SPEED = 2;
const BASE_BEE_SPEED = 2;
const BASE_BEE_DETECTION_RANGE = 100;
const BASE_ENERGY_DRAIN = 0.1;
const BASE_HEALTH_DRAIN = 0.2;

const getLevelSettings = (level: number) => {
  // More gradual multiplier that reaches max at level 20
  const multiplier = 1 + (level - 1) * 0.1; // 10% increase per level, max 2.9x at level 20
  return {
    PLAYER_SPEED: BASE_PLAYER_SPEED,
    STEALTH_SPEED: BASE_STEALTH_SPEED,
    BEE_SPEED: BASE_BEE_SPEED * multiplier,
    BEE_DETECTION_RANGE: BASE_BEE_DETECTION_RANGE * multiplier,
    ENERGY_DRAIN: BASE_ENERGY_DRAIN * multiplier,
    HEALTH_DRAIN: BASE_HEALTH_DRAIN * multiplier,
    // More gradual increase in honey and bees
    HONEY_COUNT: Math.min(3 + Math.floor((level - 1) / 3), 8), // Add 1 honey every 3 levels, max 8
    BEE_COUNT: Math.min(3 + Math.floor((level - 1) / 3), 8), // Add 1 bee every 3 levels, max 8
    // More gradual increase in obstacles
    OBSTACLE_COUNT: Math.min(3 + Math.floor((level - 1) / 4), 10) // Add 1 obstacle every 4 levels, max 10
  };
};

const generateLevel = (level: number) => {
  const settings = getLevelSettings(level);
  
  // Generate bees with better spacing
  const bees = Array.from({ length: settings.BEE_COUNT }, (_, i) => ({
    x: 200 + (i * 180) % (GAME_WIDTH - 200),
    y: 200 + (i * 140) % (GAME_HEIGHT - 200),
    isAlerted: false
  }));

  // Generate honey and hunny with better spacing
  const honey = Array.from({ length: settings.HONEY_COUNT }, (_, i) => {
    const type = Math.random() < 0.7 ? 'honey' as const : 'hunny' as const;
    return {
      x: 150 + (i * 180) % (GAME_WIDTH - 150),
      y: 150 + (i * 140) % (GAME_HEIGHT - 150),
      isCollected: false,
      type
    };
  });

  // Generate obstacles with better spacing and distribution
  const obstacles = Array.from({ length: settings.OBSTACLE_COUNT }, (_, i) => {
    const type = i % 2 === 0 ? 'tree' as const : 'rock' as const;
    return {
      x: 100 + (i * 160) % (GAME_WIDTH - 200),
      y: 100 + (i * 120) % (GAME_HEIGHT - 200),
      type
    };
  });

  return { bees, honey, obstacles };
};

// Add helper function for collision detection
const checkCollision = (x: number, y: number, obstacles: Array<{ x: number; y: number; type: 'tree' | 'rock' }>) => {
  const COLLISION_RADIUS = 30; // Adjust this value based on your obstacle sizes
  return obstacles.some(obstacle => {
    const distance = Math.sqrt(
      Math.pow(x - obstacle.x, 2) + Math.pow(y - obstacle.y, 2)
    );
    return distance < COLLISION_RADIUS;
  });
};

// Add helper function to find valid position
const findValidPosition = (
  currentX: number,
  currentY: number,
  targetX: number,
  targetY: number,
  obstacles: Array<{ x: number; y: number; type: 'tree' | 'rock' }>,
  stepSize: number
) => {
  const angle = Math.atan2(targetY - currentY, targetX - currentX);
  const newX = currentX + Math.cos(angle) * stepSize;
  const newY = currentY + Math.sin(angle) * stepSize;

  if (!checkCollision(newX, newY, obstacles)) {
    return { x: newX, y: newY };
  }

  // Try moving along walls
  const perpendicularAngle = angle + Math.PI / 2;
  const wallX = currentX + Math.cos(perpendicularAngle) * stepSize;
  const wallY = currentY + Math.sin(perpendicularAngle) * stepSize;

  if (!checkCollision(wallX, wallY, obstacles)) {
    return { x: wallX, y: wallY };
  }

  return { x: currentX, y: currentY };
};

// Add this interface declaration at the top of the file, after the imports
declare global {
  interface Window {
    keys: { [key: string]: boolean };
  }
}

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    beeAwareness: 0,
    honeyCollected: 0,
    hunnyCollected: 0,
    bearEnergy: 100,
    bearHealth: 100,
    currentStage: 1,
    playerX: GAME_WIDTH / 2,
    playerY: GAME_HEIGHT / 2,
    isStealth: false,
    bees: [],
    obstacles: [],
    honey: [],
    gameStatus: 'menu',
    score: 0,
    difficulty: 'easy',
    level: 1
  });

  // Initialize level
  useEffect(() => {
    const { bees, honey, obstacles } = generateLevel(gameState.level);
    setGameState(prev => ({
      ...prev,
      bees,
      honey,
      obstacles
    }));
  }, [gameState.level]);

  const handleStartGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'character-select' }));
  };

  const handleNextLevel = () => {
    setGameState(prev => ({
      ...prev,
      level: prev.level + 1,
      gameStatus: 'playing',
      bearEnergy: 100,
      bearHealth: 100,
      beeAwareness: 0,
      playerX: GAME_WIDTH / 2,
      playerY: GAME_HEIGHT / 2,
      isStealth: false,
      ...generateLevel(prev.level + 1)
    }));
  };

  const handleRestart = () => {
    setGameState(prev => ({
      ...prev,
      level: 1,
      gameStatus: 'character-select',
      score: 0,
      bearEnergy: 100,
      bearHealth: 100,
      beeAwareness: 0,
      playerX: GAME_WIDTH / 2,
      playerY: GAME_HEIGHT / 2,
      isStealth: false,
      ...generateLevel(1)
    }));
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState.gameStatus === 'menu' && e.code === 'Space') {
      setGameState(prev => ({ ...prev, gameStatus: 'character-select' }));
      return;
    }

    if (gameState.gameStatus === 'gameOver' && e.code === 'Space') {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'character-select',
        bearHealth: 100,
        bearEnergy: 100,
        honeyCollected: 0,
        score: 0,
        beeAwareness: 0
      }));
          return;
      }

    if (gameState.gameStatus !== 'playing') return;

    switch (e.code) {
      case 'KeyC':
        setGameState(prev => ({ ...prev, isStealth: !prev.isStealth }));
        break;
    }
  }, [gameState.gameStatus]);

  const handleCharacterSelect = (character: BearCharacter) => {
        setGameState(prev => ({
          ...prev,
      selectedCharacter: character,
      gameStatus: 'playing'
        }));
    };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const settings = getLevelSettings(gameState.level);
    const gameLoop = setInterval(() => {
      setGameState(prev => {
        // Handle player movement with obstacle collision
        let newX = prev.playerX;
        let newY = prev.playerY;
        const speed = prev.isStealth ? settings.STEALTH_SPEED : settings.PLAYER_SPEED;

        // Only move if keys are actually pressed
        let targetX = newX;
        let targetY = newY;

        // Check if any movement keys are pressed
        const isMoving = window.keys?.ArrowLeft || window.keys?.KeyA || 
                        window.keys?.ArrowRight || window.keys?.KeyD || 
                        window.keys?.ArrowUp || window.keys?.KeyW || 
                        window.keys?.ArrowDown || window.keys?.KeyS;

        if (isMoving) {
          if (window.keys?.ArrowLeft || window.keys?.KeyA) targetX -= speed;
          if (window.keys?.ArrowRight || window.keys?.KeyD) targetX += speed;
          if (window.keys?.ArrowUp || window.keys?.KeyW) targetY -= speed;
          if (window.keys?.ArrowDown || window.keys?.KeyS) targetY += speed;

          // Keep target in bounds
          targetX = Math.max(0, Math.min(GAME_WIDTH, targetX));
          targetY = Math.max(0, Math.min(GAME_HEIGHT, targetY));

          // Find valid position avoiding obstacles
          const validPosition = findValidPosition(
            newX,
            newY,
            targetX,
            targetY,
            prev.obstacles,
            speed
          );
          newX = validPosition.x;
          newY = validPosition.y;
        }

        // Check for honey/hunny collection
        const newHoney = prev.honey.map(h => {
          const distance = Math.sqrt(
            Math.pow(newX - h.x, 2) + Math.pow(newY - h.y, 2)
          );
          if (distance < 30 && !h.isCollected) {
            if (h.type === 'honey') {
              prev.honeyCollected++;
            } else {
              prev.hunnyCollected++;
            }
            return { ...h, isCollected: true };
          }
          return h;
        });

        // Update bee awareness
        let newBeeAwareness = prev.beeAwareness;
        const allHoneyCollected = newHoney.every(h => h.isCollected);
        
        if (allHoneyCollected) {
          setGameState(prev => ({ ...prev, gameStatus: 'won' }));
          return prev;
        }

        // Update bees with obstacle avoidance
        const newBees = prev.bees.map(bee => {
          const distance = Math.sqrt(
            Math.pow(newX - bee.x, 2) + Math.pow(newY - bee.y, 2)
          );
          const isAlerted = distance < settings.BEE_DETECTION_RANGE;
          
          if (isAlerted) {
            newBeeAwareness = Math.min(100, newBeeAwareness + 1);
          }

          if (isAlerted) {
            // Find valid position for bee movement
            const beeValidPosition = findValidPosition(
              bee.x,
              bee.y,
              newX,
              newY,
              prev.obstacles,
              settings.BEE_SPEED
            );

            return {
              ...bee,
              x: beeValidPosition.x,
              y: beeValidPosition.y,
              isAlerted
            };
          }

          return bee;
        });

        // Check for bee collisions with level-specific damage
        let newHealth = prev.bearHealth;
        let newEnergy = prev.bearEnergy;
        let gameOver = false;

        newBees.forEach(bee => {
          if (bee.isAlerted) {
            const distance = Math.sqrt(
              Math.pow(newX - bee.x, 2) + Math.pow(newY - bee.y, 2)
            );
            if (distance < 20) {
              newHealth -= settings.HEALTH_DRAIN;
              newEnergy -= settings.ENERGY_DRAIN;
              if (newHealth <= 0 || newEnergy <= 0) {
                gameOver = true;
              }
            }
          }
        });

        if (gameOver) {
          setGameState(prev => ({ ...prev, gameStatus: 'gameOver' }));
          return prev;
        }

        // Update score (higher points for hunny)
        const levelBonus = prev.level;
        const basePoints = prev.isStealth ? 2 : 1;
        const hunnyMultiplier = 1.5; // Hunny is worth 50% more
        const newScore = prev.score + basePoints * levelBonus * (prev.hunnyCollected * hunnyMultiplier + prev.honeyCollected);

        return {
          ...prev,
          playerX: newX,
          playerY: newY,
          honey: newHoney,
          bees: newBees,
          beeAwareness: newBeeAwareness,
          bearHealth: newHealth,
          bearEnergy: newEnergy,
          score: newScore
        };
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState.gameStatus, gameState.level]);

  // Track keyboard state
  useEffect(() => {
    // Initialize window.keys if it doesn't exist
    window.keys = window.keys || {};

    const handleKeyDown = (e: KeyboardEvent) => {
      window.keys[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      window.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // Reset all keys when component unmounts
      window.keys = {};
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Game world */}
      <div className="absolute inset-0">
        {/* Obstacles */}
        {gameState.obstacles.map((obstacle, index) => (
          <Obstacle key={index} {...obstacle} />
        ))}
        
        {/* Honey */}
        {gameState.honey.map((honey, index) => (
          <Honey key={index} {...honey} />
        ))}
        
        {/* Bees */}
        {gameState.bees.map((bee, index) => (
          <Bee key={index} {...bee} />
        ))}

        {/* Player */}
        {gameState.selectedCharacter && (
        <Player
          x={gameState.playerX}
          y={gameState.playerY}
          isStealth={gameState.isStealth}
            character={gameState.selectedCharacter}
        />
        )}
      </div>

      {/* Game UI */}
      <GameUI
        beeAwareness={gameState.beeAwareness}
        honeyCollected={gameState.honey.filter(h => h.isCollected).length}
        bearEnergy={gameState.bearEnergy}
        bearHealth={gameState.bearHealth}
        score={gameState.score}
        gameStatus={gameState.gameStatus}
        level={gameState.level}
      />

      {/* Character Selection */}
      {gameState.gameStatus === 'character-select' && (
        <CharacterSelect onSelect={handleCharacterSelect} />
      )}

      {/* Game Menu with Reaction Gifs */}
      {(gameState.gameStatus === 'menu' || 
        gameState.gameStatus === 'won' || 
        gameState.gameStatus === 'gameOver') && (
        <GameMenu
          gameStatus={gameState.gameStatus}
          score={gameState.score}
          level={gameState.level}
          onStartGame={handleStartGame}
          onNextLevel={handleNextLevel}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}; 