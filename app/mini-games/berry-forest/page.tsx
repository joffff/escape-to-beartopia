"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LandingPage from './components/LandingPage';
import CharacterSelect from './components/CharacterSelect';
import BerryForestAdvanced from './components/BerryForestAdvanced';

interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
}

function BerryForest() {
  const [gameState, setGameState] = useState<'landing' | 'character-select' | 'playing'>('landing');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    console.log('Game state changed to:', gameState);
  }, [gameState]);

  const handleContinue = () => {
    console.log('Continue clicked, current state:', gameState);
    setGameState('character-select');
    console.log('State after update:', gameState);
  };

  const handleCharacterSelect = (character: Character) => {
    console.log('Character selected:', character);
    setSelectedCharacter(character);
    setGameState('playing');
  };

  const handleReturnToLanding = () => {
    console.log('Returning to landing page');
    setGameState('landing');
    setSelectedCharacter(null);
  };

  const renderContent = () => {
    switch (gameState) {
      case 'landing':
        return <LandingPage onContinue={handleContinue} />;
      case 'character-select':
        return <CharacterSelect onCharacterSelect={handleCharacterSelect} />;
      case 'playing':
        return (
          <BerryForestAdvanced 
            selectedCharacter={selectedCharacter} 
            onReturnToLanding={handleReturnToLanding}
          />
        );
      default:
        return <LandingPage onContinue={handleContinue} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF6E9] text-[#734739]">
      {/* Header with navigation back to mini-games */}
      <header className="bg-[#74C480] p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/images/BearishLogo.webp"
            alt="Bearish Logo"
            width={50}
            height={50}
          />
          <h1 className="text-2xl font-bold text-white">Berry Forest Game</h1>
        </div>
        <Link href="/mini-games">
          <Button variant="outline" className="bg-white hover:bg-[#FFC078]/80 text-[#734739] border-[#734739]">
            Back to Mini Games
          </Button>
        </Link>
      </header>

      {/* Game content */}
      <div className="app-container">
        {renderContent()}
      </div>
    </div>
  );
}

export default BerryForest;
