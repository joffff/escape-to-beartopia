import React from 'react';

interface WinnerPageProps {
  score: number;
  onReturnToLanding: () => void;
  onPlayAgain: () => void;
}

function WinnerPage({ score, onReturnToLanding, onPlayAgain }: WinnerPageProps) {
  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 p-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-green-800 mb-6">🎉 You Won! 🎉</h1>
        <p className="text-2xl text-green-700 mb-8">Congratulations on completing the Berry Forest journey!</p>
        
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">Final Score: {score}</h2>
          <p className="text-gray-600 leading-relaxed">
            You collected a total of {score} berries. Great job!
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
