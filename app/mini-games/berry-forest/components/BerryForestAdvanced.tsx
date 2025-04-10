import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Timer, Star, Heart, Dice6 } from 'lucide-react';
import WinnerPage from './WinnerPage';

interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface BerryForestAdvancedProps {
  selectedCharacter: Character | null;
  onReturnToLanding: () => void;
}

interface SpecialTile {
  type: string;
  description: string;
  effect: number | string;
  symbol: string;
}

interface SpecialTiles {
  [key: number]: SpecialTile;
}

const TOTAL_TILES = 48;
const INITIAL_POSITION = 0;
const INITIAL_LIVES = 3;
const BERRY_TYPES = {
  NORMAL: { image: '/images/mini-games/berry-forest/Red_Berry.webp', points: 1, color: 'bg-transparent' },
  GOLDEN: { image: '/images/mini-games/berry-forest/Red_Berry.webp', points: 3, color: 'bg-transparent' },
  POISON: { image: '/images/mini-games/berry-forest/Red_Berry.webp', points: -1, color: 'bg-transparent' }
};

// Define base special tiles that appear in all difficulty levels
const BASE_SPECIAL_TILES: SpecialTiles = {
  3: { type: 'berry', description: 'Golden berry! +3 points', effect: 3, symbol: '🌟' },
  8: { type: 'honey', description: 'Sweet honey! +4 points', effect: 4, symbol: '🍯' },
  15: { type: 'wood', description: 'Wood logs! +2 points', effect: 2, symbol: '🪵' },
  21: { type: 'honey', description: 'Honey pot! +4 points', effect: 4, symbol: '🍯' },
  28: { type: 'wood', description: 'Wood bundle! +2 points', effect: 2, symbol: '🪵' },
  31: { type: 'berry', description: 'Golden berry! +3 points', effect: 3, symbol: '🌟' },
  37: { type: 'honey', description: 'Honeycomb! +4 points', effect: 4, symbol: '🍯' },
  42: { type: 'wood', description: 'Wood stack! +2 points', effect: 2, symbol: '🪵' },
  45: { type: 'finalBerry', description: 'Final Berry! +1 point', effect: 1, symbol: '1' },
  46: { type: 'finalBerry', description: 'Final Berry! +2 points', effect: 2, symbol: '2' },
  47: { type: 'finalBerry', description: 'Final Berry! +3 points', effect: 3, symbol: '3' }
};

// Difficulty-specific tiles to be added based on level (20 levels)
const DIFFICULTY_TILES = {
  level1: {
    // Level 1 - Challenging but not overwhelming
    5: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    16: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    20: { type: 'slow', description: 'Thorny bush! Next roll max 3', effect: 3, symbol: '🐢' },
    30: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
  },
  level2: {
    // Level 2 - Even more difficult than level 1
    3: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    8: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    15: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    19: { type: 'slow', description: 'Thorny bush! Next roll max 3', effect: 3, symbol: '🐢' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    32: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    35: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level3: {
    // Level 3 - Multiple hazards tightly packed
    4: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    10: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    15: { type: 'slow', description: 'Thorny bush! Next roll max 3', effect: 3, symbol: '🐢' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    30: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    40: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level4: {
    // Three hunter spaces
    5: { type: 'hunter', description: 'Hunter spotted! Move back 1 space', effect: -1, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    40: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
  },
  level5: {
    // Adding a slow effect space
    5: { type: 'hunter', description: 'Hunter spotted! Move back 1 space', effect: -1, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 3', effect: 3, symbol: '🐢' },
    40: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
  },
  level6: {
    // Moving the rotten berry earlier in the path
    5: { type: 'hunter', description: 'Hunter spotted! Move back 1 space', effect: -1, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 3', effect: 3, symbol: '🐢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
  },
  level7: {
    // Adding a second rotten berry, but far apart
    5: { type: 'hunter', description: 'Hunter spotted! Move back 1 space', effect: -1, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 3', effect: 3, symbol: '🐢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
  },
  level8: {
    // Increasing hunter effects
    5: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 3', effect: 3, symbol: '🐢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
  },
  level9: {
    // Adding another slow effect space
    5: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 3', effect: 3, symbol: '🐢' },
    12: { type: 'slow', description: 'Slippery slope! Next roll max 2', effect: 2, symbol: '🐢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
  },
  level10: {
    // Level 10 - Very difficult mid-point
    7: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    13: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    19: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    25: { type: 'slow', description: 'Thorny bush! Next roll max 2', effect: 2, symbol: '🐢' },
    30: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    37: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    40: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level11: {
    // Moving poison berry to an earlier position
    5: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 3', effect: 3, symbol: '🐢' },
    12: { type: 'slow', description: 'Slippery slope! Next roll max 2', effect: 2, symbol: '🐢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    38: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level12: {
    // Adding another hunter space
    5: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 2 spaces', effect: -2, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    40: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 3', effect: 3, symbol: '🐢' },
    12: { type: 'slow', description: 'Slippery slope! Next roll max 2', effect: 2, symbol: '🐢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    38: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level13: {
    // Increasing hunter effects
    5: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    13: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    40: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 2', effect: 2, symbol: '🐢' },
    12: { type: 'slow', description: 'Slippery slope! Next roll max 2', effect: 2, symbol: '🐢' },
    9: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    27: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    33: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
    43: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level14: {
    // Increasing rotten berries
    5: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    40: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 2', effect: 2, symbol: '🐢' },
    12: { type: 'slow', description: 'Slippery slope! Next roll max 2', effect: 2, symbol: '🐢' },
    9: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    27: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    38: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level15: {
    // Moving the poison berry earlier
    5: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    40: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 2', effect: 2, symbol: '🐢' },
    12: { type: 'slow', description: 'Slippery slope! Next roll max 2', effect: 2, symbol: '🐢' },
    9: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    27: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    33: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level16: {
    // Adding second poison berry
    5: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    40: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 2', effect: 2, symbol: '🐢' },
    12: { type: 'slow', description: 'Slippery slope! Next roll max 2', effect: 2, symbol: '🐢' },
    9: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    27: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    33: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
    43: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level17: {
    // Five hunter spots
    5: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    13: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    40: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 2', effect: 2, symbol: '🐢' },
    12: { type: 'slow', description: 'Slippery slope! Next roll max 2', effect: 2, symbol: '🐢' },
    9: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    27: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    33: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
    43: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level18: {
    // Moving poison berries to more challenging positions
    5: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    13: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    40: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 2', effect: 2, symbol: '🐢' },
    12: { type: 'slow', description: 'Slippery slope! Next roll max 1', effect: 1, symbol: '🐢' },
    9: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    27: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    24: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
    38: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level19: {
    // Adding a third poison berry
    5: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    13: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    18: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    25: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    40: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    34: { type: 'slow', description: 'Thorny bush! Next roll max 1', effect: 1, symbol: '🐢' },
    12: { type: 'slow', description: 'Slippery slope! Next roll max 1', effect: 1, symbol: '🐢' },
    9: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    15: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    27: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    36: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    24: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  33: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
    38: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  },
  level20: {
    // Level 20 - Nearly impossible challenge
    4: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    9: { type: 'hunter', description: 'Hunter spotted! Move back 3 spaces', effect: -3, symbol: '⚠️' },
    14: { type: 'hunter', description: 'Hunter spotted! Move back 4 spaces', effect: -4, symbol: '⚠️' },
    19: { type: 'slow', description: 'Thorny bush! Next roll max 1', effect: 1, symbol: '🐢' },
    24: { type: 'slow', description: 'Thorny bush! Next roll max 1', effect: 1, symbol: '🐢' },
    29: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    34: { type: 'rotten', description: 'Rotten berry! Back to start!', effect: 'restart', symbol: '🤢' },
    38: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
    42: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
    46: { type: 'poison', description: 'Poison berry! Game Over!', effect: 'gameOver', symbol: '☠️' },
  }
};

// Define types for our difficulty levels
type DifficultyLevel = 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6' | 'level7' | 'level8' | 'level9' | 'level10' | 'level11' | 'level12' | 'level13' | 'level14' | 'level15' | 'level16' | 'level17' | 'level18' | 'level19' | 'level20';

function BerryForestAdvanced({ selectedCharacter, onReturnToLanding }: BerryForestAdvancedProps) {
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [score, setScore] = useState(0);
  const [resources, setResources] = useState({
    wood: 0,
    honey: 0,
    goldenBerry: 0,
    berry: 0
  });
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState('');
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('level1');
  const [maxRoll, setMaxRoll] = useState(6);
  
  // Generate special tiles based on the selected difficulty
  const getSpecialTiles = () => {
    const specialTiles = { ...BASE_SPECIAL_TILES };
    
    // Add difficulty-specific tiles
    Object.entries(DIFFICULTY_TILES[difficulty]).forEach(([position, tile]) => {
      specialTiles[parseInt(position)] = tile;
    });
    
    return specialTiles;
  };
  
  const [specialTiles, setSpecialTiles] = useState<SpecialTiles>(getSpecialTiles());
  
  // Update special tiles when difficulty changes
  useEffect(() => {
    setSpecialTiles(getSpecialTiles());
  }, [difficulty]);

  const rollDice = () => {
    if (!playerTurn || isRolling) return;
    
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    setIsRolling(true);
    const roll = Math.floor(Math.random() * maxRoll) + 1;
    setDiceRoll(roll);
    
    // Reset maxRoll after rolling
    if (maxRoll !== 6) {
      setMaxRoll(6);
    }
    
    setTimeout(() => {
      setIsRolling(false);
      movePlayer(roll);
    }, 1000);
  };

  const movePlayer = (spaces: number) => {
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
    const specialTile = specialTiles[newPosition];
    if (specialTile) {
      handleSpecialTile(specialTile);
    } else {
      // Regular tile - no resources on empty spaces
      setMessage('Empty space - no resources here');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setPlayerTurn(true);
      }, 2000);
    }
  };

  const handleSpecialTile = (tile: SpecialTile) => {
    setMessage(tile.description);
    setShowMessage(true);
    
    switch (tile.type) {
      case 'hunter':
        setPosition(prev => Math.max(0, prev + (tile.effect as number)));
        setTimeout(() => {
          setShowMessage(false);
          setPlayerTurn(true);
        }, 2000);
        break;
      case 'poison':
        setGameStatus('lost');
        break;
      case 'slow':
        // Set max roll for next turn
        setMaxRoll(tile.effect as number);
        setTimeout(() => {
          setShowMessage(false);
          setPlayerTurn(true);
        }, 2000);
        break;
      case 'rotten':
        setPosition(0);
        setTimeout(() => {
          setShowMessage(false);
          setPlayerTurn(true);
        }, 2000);
        break;
      case 'finalBerry':
        // Collect berries and add to total score
        const berryPoints = tile.effect as number;
        setResources(prev => ({
          ...prev,
          berry: prev.berry + berryPoints
        }));
        setScore(prev => prev + berryPoints);
        setTimeout(() => {
          setShowMessage(false);
          setGameStatus('won');
        }, 2000);
        break;
      case 'berry':
        // Collect golden berries
        const goldenBerryPoints = tile.effect as number;
        setResources(prev => ({
          ...prev,
          goldenBerry: prev.goldenBerry + 1
        }));
        setScore(prev => prev + goldenBerryPoints);
        setTimeout(() => {
          setShowMessage(false);
          setPlayerTurn(true);
        }, 2000);
        break;
      case 'honey':
        // Collect honey
        const honeyPoints = tile.effect as number;
        setResources(prev => ({
          ...prev,
          honey: prev.honey + 1
        }));
        setScore(prev => prev + honeyPoints);
        setTimeout(() => {
          setShowMessage(false);
          setPlayerTurn(true);
        }, 2000);
        break;
      case 'wood':
        // Collect wood
        const woodPoints = tile.effect as number;
        setResources(prev => ({
          ...prev,
          wood: prev.wood + 1
        }));
        setScore(prev => prev + woodPoints);
        setTimeout(() => {
          setShowMessage(false);
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
    setResources({
      wood: 0,
      honey: 0,
      goldenBerry: 0,
      berry: 0
    });
    setLives(INITIAL_LIVES);
    setGameStatus('playing');
    setMessage('');
    setDiceRoll(null);
    setPlayerTurn(true);
  };
  
  // Change difficulty level
  const changeDifficulty = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 p-8">
      {gameStatus === 'won' ? (
        <WinnerPage 
          score={score}
          resources={resources}
          onReturnToLanding={onReturnToLanding}
          onPlayAgain={resetGame}
        />
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/mini-games/berry-forest/berry.webp" 
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-semibold text-green-700">{score} pts</span>
              </div>
              <div className="flex items-center px-2 py-1 bg-yellow-100 rounded-lg">
                <span className="text-lg font-semibold mr-1">🪵</span>
                <span className="text-md">{resources.wood}</span>
              </div>
              <div className="flex items-center px-2 py-1 bg-yellow-100 rounded-lg">
                <span className="text-lg font-semibold mr-1">🍯</span>
                <span className="text-md">{resources.honey}</span>
              </div>
              <div className="flex items-center px-2 py-1 bg-yellow-100 rounded-lg">
                <span className="text-lg font-semibold mr-1">🌟</span>
                <span className="text-md">{resources.goldenBerry}</span>
              </div>
              <div className="flex items-center px-2 py-1 bg-red-100 rounded-lg">
                <span className="text-lg font-semibold mr-1">🍓</span>
                <span className="text-md">{resources.berry}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-red-500" />
                <span className="text-xl font-semibold text-green-700">{lives}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 transform transition-all hover:shadow-2xl overflow-hidden">
            <div className="relative h-[600px]">
              {/* Forest background - now fills entire container */}
              <div 
                className="absolute inset-0 bg-[url('/images/mini-games/berry-forest/forest-map.jpg')] bg-cover bg-center"
              ></div>
              
              {/* Stone path texture style */}
              <style jsx>{`
                .stone-path {
                  position: relative;
                }
                .stone-path::before {
                  content: "";
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
                  opacity: 0.5;
                  z-index: 1;
                  pointer-events: none;
                }
              `}</style>
              
              {/* Game path - now using snake pattern with better padding */}
              <div className="relative" style={{ top: '40%', left: '10%', right: '10%' }}>
                <div className="grid grid-cols-8 gap-1" style={{ width: '80%' }}>
                  {Array.from({ length: TOTAL_TILES }).map((_, index) => {
                    const isPlayer = index === position;
                    const specialTile = specialTiles[index];
                    const isPast = index < position;
                    const isFinalBerry = index >= 45;
                    
                    // Calculate row and column for snake pattern
                    const row = Math.floor(index / 8);
                    const isEvenRow = row % 2 === 0;
                    const col = isEvenRow ? index % 8 : 7 - (index % 8);
                    
                    // Calculate size based on position (increases from top to bottom)
                    const sizeScale = 1 + (row * 0.05); // 5% increase per row
                    const baseWidth = 60;
                    const baseHeight = 40;
                    let stoneWidth = baseWidth * sizeScale;
                    let stoneHeight = baseHeight * sizeScale;
                    
                    // Make stones 1-8 smaller, stones 9-16 smaller, stones 17-24 smaller, and stones 33-48 bigger
                    if (index >= 0 && index <= 7) { // Stones 1-8
                        stoneWidth = baseWidth * sizeScale * 0.85;
                        stoneHeight = baseHeight * sizeScale * 0.85;
                    } else if (index >= 8 && index <= 15) { // Stones 9-16
                        stoneWidth = baseWidth * sizeScale * 0.9;
                        stoneHeight = baseHeight * sizeScale * 0.9;
                    } else if (index >= 16 && index <= 23) { // Stones 17-24
                        stoneWidth = baseWidth * sizeScale * 0.95;
                        stoneHeight = baseHeight * sizeScale * 0.95;
                    } else if (index >= 32 && index <= 39) { // Stones 33-40
                        stoneWidth = baseWidth * sizeScale * 1.08;
                        stoneHeight = baseHeight * sizeScale * 1.08;
                    } else if (index === 40) { // Stone 41
                        stoneWidth = baseWidth * sizeScale * 1.1;
                        stoneHeight = baseHeight * sizeScale * 1.1;
                    } else if (index === 41) { // Stone 42
                        stoneWidth = baseWidth * sizeScale * 1.12;
                        stoneHeight = baseHeight * sizeScale * 1.12;
                    } else if (index === 42) { // Stone 43
                        stoneWidth = baseWidth * sizeScale * 1.14;
                        stoneHeight = baseHeight * sizeScale * 1.14;
                    } else if (index === 43) { // Stone 44
                        stoneWidth = baseWidth * sizeScale * 1.16;
                        stoneHeight = baseHeight * sizeScale * 1.16;
                    } else if (index === 44) { // Stone 45
                        stoneWidth = baseWidth * sizeScale * 1.18;
                        stoneHeight = baseHeight * sizeScale * 1.18;
                    } else if (index === 45 || index === 46 || index === 47) { // Stones 46, 47, and 48
                        stoneWidth = baseWidth * sizeScale * 1.3;
                        stoneHeight = baseHeight * sizeScale * 1.3;
                    }
                    
                    // Calculate offset for snake pattern with rounded turns
                    const rowOffset = Math.sin(row * 0.5) * 40; // More pronounced sine wave
                    const colOffset = isEvenRow ? 0 : 15; // Decreased vertical offset for alternating rows
                    
                    // Add curve to the end of each row with more space on left turns
                    const isEndOfRow = isEvenRow ? col === 7 : col === 0;
                    const curveOffset = isEndOfRow ? (isEvenRow ? 20 : -25) : 0; // Decreased left turn offset
                    
                    // Add more vertical curve at left-side transitions
                    const rowTransitionOffset = isEndOfRow ? (isEvenRow ? 10 : 10) : 0; // Decreased vertical offset for left turns
                    
                    // Add specific offsets for individual stones
                    let specificOffset = { x: 0, y: 0 };
                    if (index === 0) { // First stone
                        specificOffset = { x: 0, y: 20 }; // Move down 20px
                    } else if (index === 1) { // Second stone
                        specificOffset = { x: 0, y: 10 }; // Move down 10px
                    } else if (index === 2) { // Third stone
                        specificOffset = { x: 0, y: 5 }; // Move down 5px
                    } else if (index === 3) { // Fourth stone
                        specificOffset = { x: 0, y: -3 }; // Move up 3px
                    } else if (index === 4) { // Fifth stone
                        specificOffset = { x: 0, y: -5 }; // Move up 5px
                    } else if (index === 5) { // Sixth stone
                        specificOffset = { x: 0, y: -3 }; // Move up 3px
                    } else if (index === 6) { // Seventh stone
                        specificOffset = { x: 0, y: -2 }; // Move up 2px
                    } else if (index === 7) { // Eighth stone
                        specificOffset = { x: -10, y: 3 }; // Move left 10px and down 3px
                    } else if (index === 8) { // Ninth stone
                        specificOffset = { x: 5, y: -6 }; // Move right 5px and up 6px
                    } else if (index === 9) { // Tenth stone
                        specificOffset = { x: 0, y: -6 }; // Move up 6px
                    } else if (index === 10) { // Eleventh stone
                        specificOffset = { x: 0, y: -7 }; // Move up 7px
                    } else if (index === 11) { // Twelfth stone
                        specificOffset = { x: 0, y: -11 }; // Move up 11px
                    } else if (index === 12) { // Thirteenth stone
                        specificOffset = { x: 0, y: -13 }; // Move up 13px
                    } else if (index === 13) { // Fourteenth stone
                        specificOffset = { x: 0, y: -16 }; // Move up 16px
                    } else if (index === 14) { // Fifteenth stone
                        specificOffset = { x: -10, y: -9 }; // Move left 10px and up 9px
                    } else if (index === 15) { // Sixteenth stone
                        specificOffset = { x: -5, y: -8 }; // Move left 5px and up 8px
                    } else if (index === 16) { // Seventeenth stone
                        specificOffset = { x: 0, y: 10 }; // Move down 10px
                    } else if (index === 17) { // Eighteenth stone
                        specificOffset = { x: -5, y: 11 }; // Move left 5px and down 11px
                    } else if (index === 18) { // Nineteenth stone
                        specificOffset = { x: -8, y: 8 }; // Move left 8px and down 8px
                    } else if (index === 19) { // Twentieth stone
                        specificOffset = { x: -12, y: 5 }; // Move left 12px and down 5px
                    } else if (index === 20) { // Twenty-first stone
                        specificOffset = { x: -15, y: 3 }; // Move left 15px and down 3px
                    } else if (index === 21) { // Twenty-second stone
                        specificOffset = { x: -10, y: 4 }; // Move left 10px and down 4px
                    } else if (index === 22) { // Twenty-third stone
                        specificOffset = { x: 5, y: 5 }; // Move right 5px and down 5px
                    } else if (index === 23) { // Twenty-fourth stone
                        specificOffset = { x: -19, y: 2 }; // Move left 19px and down 2px
                    } else if (index === 24) { // Twenty-fifth stone
                        specificOffset = { x: 35, y: -13 }; // Move right 35px and up 13px
                    } else if (index === 25) { // Twenty-sixth stone
                        specificOffset = { x: 35, y: 0 }; // Move right 35px
                    } else if (index === 26) { // Twenty-seventh stone
                        specificOffset = { x: 36, y: -5 }; // Move right 36px and up 5px
                    } else if (index === 27) { // Twenty-eighth stone
                        specificOffset = { x: 35, y: -13 }; // Move right 35px and up 13px
                    } else if (index === 28) { // Twenty-ninth stone
                        specificOffset = { x: 35, y: -14 }; // Move right 35px and up 14px
                    } else if (index === 29) { // Thirtieth stone
                        specificOffset = { x: 35, y: -10 }; // Move right 35px and up 10px
                    } else if (index === 30) { // Thirty-first stone
                        specificOffset = { x: 37, y: -7 }; // Move right 37px and up 7px
                    } else if (index === 31) { // Thirty-second stone
                        specificOffset = { x: 62, y: -10 }; // Move right 62px and up 10px
                    } else if (index === 32) { // Thirty-third stone
                        specificOffset = { x: -25, y: -10 }; // Move left 25px and up 10px
                    } else if (index === 33) { // Thirty-fourth stone
                        specificOffset = { x: -50, y: 20 }; // Move left 50px and down 20px
                    } else if (index === 34) { // Thirty-fifth stone
                        specificOffset = { x: -45, y: 18 }; // Move left 45px and down 18px
                    } else if (index === 35) { // Thirty-sixth stone
                        specificOffset = { x: -45, y: 12 }; // Move left 45px and down 12px
                    } else if (index === 36) { // Thirty-seventh stone
                        specificOffset = { x: -50, y: 0 }; // Move left 50px
                    } else if (index === 37) { // Thirty-eighth stone
                        specificOffset = { x: -45, y: 0 }; // Move left 45px
                    } else if (index === 38) { // Thirty-ninth stone
                        specificOffset = { x: -45, y: 0 }; // Move left 45px
                    } else if (index === 39) { // Fortieth stone
                        specificOffset = { x: -70, y: -5 }; // Move left 70px and up 5px
                    } else if (index === 40) { // Forty-first stone
                        specificOffset = { x: -7, y: -27 }; // Move left 7px and up 27px
                    } else if (index === 41) { // Forty-second stone
                        specificOffset = { x: 19, y: 0 }; // Move right 19px
                    } else if (index === 42) { // Forty-third stone
                        specificOffset = { x: 18, y: 2 }; // Move right 18px and down 2px
                    } else if (index === 43) { // Forty-fourth stone
                        specificOffset = { x: 20, y: -8 }; // Move right 20px and up 8px
                    } else if (index === 44) { // Forty-fifth stone
                        specificOffset = { x: 15, y: 6 }; // Move right 15px and down 6px (was -4px up)
                    } else if (index === 45) { // Forty-sixth stone
                        specificOffset = { x: 45, y: 50 }; // Move right 45px and down 50px
                    } else if (index === 46) { // Forty-seventh stone
                        specificOffset = { x: 236, y: 50 }; // Move right 236px and down 50px
                    } else if (index === 47) { // Forty-eighth stone
                        specificOffset = { x: 450, y: 40 }; // Move right 450px and down 40px
                    }
                    
                    return (
                      <div
                        key={index}
                        className={`stone-path aspect-square rounded-full border-2 shadow-md flex items-center justify-center transform transition-all duration-200
                          ${isPlayer ? 'scale-110 bg-green-500 border-green-600' : ''}
                          ${isPast ? 'bg-green-200 border-green-300' : 'bg-gray-100 border-gray-200'}
                          ${specialTile && !isFinalBerry ? 'bg-yellow-100 border-yellow-200' : ''}
                          ${specialTile?.type === 'poison' ? 'bg-red-200 border-red-300' : ''}
                          ${specialTile?.type === 'slow' ? 'bg-orange-100 border-orange-200' : ''}
                          ${isFinalBerry ? 'bg-red-50 border-red-200' : ''}
                          hover:shadow-lg`}
                        style={{
                          width: `${stoneWidth}px`,
                          height: `${stoneHeight}px`,
                          clipPath: 'ellipse(50% 30% at 50% 50%)',
                          gridColumn: `${col + 1} / span 1`,
                          gridRow: `${row + 1} / span 1`,
                          transform: `translate(${rowOffset + curveOffset + specificOffset.x}px, ${colOffset + rowTransitionOffset + specificOffset.y}px)`,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 0 8px rgba(0,0,0,0.1)',
                          borderColor: 'rgba(0,0,0,0.2)',
                          borderWidth: '1px',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(200,200,200,0.9))',
                          opacity: 0.9,
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        {/* Add stone texture overlay */}
                        <div 
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23000000\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                            opacity: 0.6,
                            zIndex: 2
                          }}
                        />
                        
                        {isPlayer ? (
                          <div className="transform transition-transform duration-200 z-10" style={{ transform: `scale(${sizeScale})` }}>
                            <div className="w-3/4 h-3/4 rounded-full border-4 border-green-500 shadow-lg overflow-hidden bg-white">
                              <img 
                                src={selectedCharacter?.image}
                                alt="Player" 
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                          </div>
                        ) : isFinalBerry ? (
                          <div className="relative flex items-center justify-center" style={{ transform: `scale(${sizeScale})` }}>
                            <img 
                              src="/images/mini-games/berry-forest/berry.webp" 
                              alt="Final Berry" 
                              className="w-6 h-6"
                            />
                            <div className="absolute text-lg font-bold text-green-800" style={{ 
                              top: '50%', 
                              left: '50%', 
                              transform: 'translate(-50%, -50%)',
                              textShadow: '0 0 3px white, 0 0 3px white, 0 0 3px white'
                            }}>
                              {specialTile?.symbol}
                            </div>
                          </div>
                        ) : specialTile ? (
                          <div className="text-center text-xl font-bold text-green-800" style={{ transform: `scale(${sizeScale})` }}>
                            {specialTile.symbol}
                          </div>
                        ) : isPast ? (
                          <div className="text-green-500 text-lg" style={{ transform: `scale(${sizeScale})` }}>✓</div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
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
    </div>
  );
}

export default BerryForestAdvanced;
