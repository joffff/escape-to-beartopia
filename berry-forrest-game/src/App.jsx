import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import CharacterSelect from './components/CharacterSelect';
import BerryForestAdvanced from './components/BerryForestAdvanced';

function App() {
  const [gameState, setGameState] = useState('landing'); // 'landing', 'character-select', 'playing'
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    console.log('Game state changed to:', gameState);
  }, [gameState]);

  const handleContinue = () => {
    console.log('Continue clicked, current state:', gameState);
    setGameState('character-select');
    console.log('State after update:', gameState);
  };

  const handleCharacterSelect = (character) => {
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
    <div className="app-container">
      {renderContent()}
    </div>
  );
}

export default App; 