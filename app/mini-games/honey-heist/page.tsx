"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import HoneyHeistGame from './components/HoneyHeistGame'
import CharacterSelect from './components/CharacterSelect'

export default function HoneyHeistPage() {
  const [gameState, setGameState] = useState<'menu' | 'character-select' | 'playing' | 'won' | 'gameOver'>('menu')
  const [selectedCharacter, setSelectedCharacter] = useState<string>('carlo-bear')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)

  // Reset game state when navigating back to this page
  useEffect(() => {
    setGameState('menu')
  }, [])

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character)
    setGameState('playing')
  }

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore)
    setGameState('gameOver')
  }

  const handleGameWon = (finalScore: number) => {
    setScore(finalScore)
    setGameState('won')
  }

  const handleRestart = () => {
    setGameState('menu')
    setScore(0)
  }

  const handleNextLevel = () => {
    setLevel(prev => prev + 1)
    setGameState('playing')
  }

  return (
    <div className="min-h-screen bg-[#FFF6E9] flex flex-col">
      {/* Header with navigation back to mini-games */}
      <header className="bg-[#74C480] p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Honey Heist</h1>
        <Link href="/mini-games">
          <Button variant="outline" className="bg-white hover:bg-[#FFC078]/80 text-[#734739] border-[#734739]">
            Back to Mini Games
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {gameState === 'menu' && (
          <div className="bg-white rounded-xl border-2 border-[#FFC078] shadow-lg p-6 max-w-md w-full text-center">
            <h2 className="text-3xl font-bold mb-6 text-[#734739]">Honey Heist</h2>
            <p className="mb-6 text-[#734739]">
              Sneak through the forest to collect honey while avoiding the bees! Use stealth mode to move quietly, but watch your energy!
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-[#734739]">Difficulty</h3>
              <div className="flex justify-center gap-2">
                <Button 
                  onClick={() => setDifficulty('easy')}
                  className={`${difficulty === 'easy' ? 'bg-[#74C480] text-white' : 'bg-[#FFF6E9] text-[#734739]'} border-2 border-[#734739]`}
                >
                  Easy
                </Button>
                <Button 
                  onClick={() => setDifficulty('medium')}
                  className={`${difficulty === 'medium' ? 'bg-[#FFC078] text-white' : 'bg-[#FFF6E9] text-[#734739]'} border-2 border-[#734739]`}
                >
                  Medium
                </Button>
                <Button 
                  onClick={() => setDifficulty('hard')}
                  className={`${difficulty === 'hard' ? 'bg-[#E36F6F] text-white' : 'bg-[#FFF6E9] text-[#734739]'} border-2 border-[#734739]`}
                >
                  Hard
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={() => setGameState('character-select')}
              className="w-full bg-[#74C480] hover:bg-[#6FB5FF] text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white"
            >
              Start Game
            </Button>
          </div>
        )}

        {gameState === 'character-select' && (
          <CharacterSelect onSelect={handleCharacterSelect} />
        )}

        {gameState === 'playing' && (
          <div className="w-[800px] h-[600px] relative overflow-hidden border-4 border-[#734739] rounded-lg">
            <HoneyHeistGame 
              difficulty={difficulty}
              character={selectedCharacter}
              onGameOver={handleGameOver}
              onGameWon={handleGameWon}
              level={level}
            />
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="bg-white rounded-xl border-2 border-[#E36F6F] shadow-lg p-6 max-w-md w-full text-center">
            <h2 className="text-3xl font-bold mb-4 text-[#E36F6F]">Game Over!</h2>
            <p className="mb-6 text-[#734739]">
              Oh no! The bees caught you. Better luck next time!
            </p>
            <p className="text-xl mb-6 text-[#734739]">
              Your score: <span className="font-bold">{score}</span>
            </p>
            <Button 
              onClick={handleRestart}
              className="w-full bg-[#74C480] hover:bg-[#6FB5FF] text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white"
            >
              Try Again
            </Button>
          </div>
        )}

        {gameState === 'won' && (
          <div className="bg-white rounded-xl border-2 border-[#74C480] shadow-lg p-6 max-w-md w-full text-center">
            <h2 className="text-3xl font-bold mb-4 text-[#74C480]">Level Complete!</h2>
            <p className="mb-6 text-[#734739]">
              Great job! You've collected enough honey to complete this level!
            </p>
            <p className="text-xl mb-6 text-[#734739]">
              Your score: <span className="font-bold">{score}</span>
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={handleNextLevel}
                className="flex-1 bg-[#74C480] hover:bg-[#6FB5FF] text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white"
              >
                Next Level
              </Button>
              <Button 
                onClick={handleRestart}
                className="flex-1 bg-[#FFC078] hover:bg-[#FFC078]/80 text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white"
              >
                Main Menu
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
