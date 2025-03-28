import React from 'react';
import { Star, Award } from 'lucide-react';

function WinnerPage({ score, onReturnToLanding, onPlayAgain }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-8">
          <img 
            src="/gifs/berryGoodGifs/hooray-berries-bg-blank.gif" 
            alt="Celebration" 
            className="w-48 h-48 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-green-800 mb-4">🎉 Congratulations! 🎉</h1>
          <p className="text-xl text-gray-700 mb-6">
            You've successfully completed the Berry Forest Journey!
          </p>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Star className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-green-700">Final Score: {score}</span>
          </div>
        </div>

        <div className="bg-yellow-100 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Award className="w-8 h-8 text-yellow-600" />
            <h2 className="text-2xl font-bold text-yellow-800">New Collectible Unlocked!</h2>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <img 
              src="/Red_Berry.webp" 
              alt="Berry Picker Badge" 
              className="w-24 h-24 mx-auto mb-3"
            />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Berry Picker Badge</h3>
            <p className="text-gray-600">
              You've proven yourself as a master berry collector in the forest!
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onPlayAgain}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors transform hover:scale-105"
          >
            Play Again
          </button>
          <button
            onClick={onReturnToLanding}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-105"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default WinnerPage; 