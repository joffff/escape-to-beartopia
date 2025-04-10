import React from 'react';

interface WinnerPageProps {
  score: number;
  resources: {
    wood: number;
    honey: number;
    goldenBerry: number;
    berry: number;
  };
  onReturnToLanding: () => void;
  onPlayAgain: () => void;
}

function WinnerPage({ score, resources, onReturnToLanding, onPlayAgain }: WinnerPageProps) {
  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 p-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-green-800 mb-6">🎉 You Won! 🎉</h1>
        <p className="text-2xl text-green-700 mb-8">Congratulations on completing the Berry Forest journey!</p>
        
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">Final Score: {score}</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
              <span className="text-3xl mr-3">🪵</span>
              <div className="text-left">
                <h3 className="font-semibold">Wood</h3>
                <p>{resources.wood} pieces collected</p>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
              <span className="text-3xl mr-3">🍯</span>
              <div className="text-left">
                <h3 className="font-semibold">Honey</h3>
                <p>{resources.honey} pots collected</p>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
              <span className="text-3xl mr-3">🌟</span>
              <div className="text-left">
                <h3 className="font-semibold">Golden Berries</h3>
                <p>{resources.goldenBerry} collected</p>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg flex items-center">
              <span className="text-3xl mr-3">🍓</span>
              <div className="text-left">
                <h3 className="font-semibold">Berries</h3>
                <p>{resources.berry} collected</p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            You earned a total of {score} points from your forest journey. Well done!
          </p>
        </div>

        <div className="flex justify-center space-x-6">
          <button
            onClick={onPlayAgain}
            className="bg-green-500 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors transform hover:scale-105"
          >
            Play Again
          </button>
          <button
            onClick={onReturnToLanding}
            className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors transform hover:scale-105"
          >
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default WinnerPage;
