import React from 'react';
import { ArrowRight, ArrowUp, ArrowDown, ArrowLeft, Star, Heart } from 'lucide-react';

interface LandingPageProps {
  onContinue: () => void;
}

function LandingPage({ onContinue }: LandingPageProps) {
  const handleContinueClick = () => {
    console.log('Landing page continue button clicked');
    onContinue();
  };

  return (
    <div className="bg-[url('/images/mini-games/berry-forest/background.webp')] bg-cover bg-center p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <img src="/BEARISH3D_1.png" alt="Bearish Logo" className="w-96 h-96 object-contain" style={{ padding: 0, margin: 0, display: 'block' }} />
          <h1 className="text-6xl font-bold text-green-800 -mt-8 flex items-center justify-center">
            <img src="/images/mini-games/berry-forest/berry.webp" alt="Berry" className="w-12 h-12 mr-3" /> 
            Berry Forest Game
          </h1>
          <p className="text-xl text-green-600 mt-2 mb-8">A delightful adventure of berry collecting!</p>
        </div>

        <div className="bg-white/95 rounded-lg shadow-xl p-6 mt-2">
          <h2 className="text-3xl font-bold text-green-800 mb-6">Welcome to the Forest!</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-2xl font-semibold text-green-700 mb-3">About the Game</h3>
              <p className="text-gray-600 leading-relaxed">
                Join our adorable bears on their berry-collecting adventure in the magical forest! 
Reduce the spacing even further
Adjust any other spacing around the logo                Navigate through the winding stone path to collect berries while avoiding obstacles.
                The path gets more challenging as you progress, with special tiles that can help or hinder your journey.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-green-700 mb-3">Game Rules</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Roll the dice to move along the stone path</li>
                <li>Regular berries (🍓) are worth 1 point</li>
                <li>Golden berries (⭐) are worth 3 points</li>
                <li>Avoid poison berries (☠️) - they cost you a life and -1 point</li>
                <li>You have 3 lives (<Heart className="w-4 h-4 inline text-red-500" />) to start</li>
                <li>Resource Collection:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>When you land on a resource stone, you collect that resource</li>
                    <li>Resources are automatically added to your account</li>
                    <li>Different stones give different amounts of resources</li>
                    <li>Your resource collection is tracked during the game</li>
                    <li>All collected resources are saved to your main account when you finish</li>
                  </ul>
                </li>
                <li>Special tiles can help or hinder your progress:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Slow tiles (🐌) reduce your next roll by 1</li>
                    <li>Bonus tiles (🎲) give you an extra roll</li>
                    <li>Teleport tiles (✨) move you to a random position</li>
                  </ul>
                </li>
                <li>Reach the final berry (1, 2, or 3) to win!</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-green-700 mb-3">How to Play</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Controls:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold text-green-600">🎲</div>
                    </div>
                    <span className="text-gray-600">Click the dice to roll and move</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinueClick}
            className="bg-green-500 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors transform hover:scale-105 flex items-center space-x-2"
          >
            <span>Choose Your Bear</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
