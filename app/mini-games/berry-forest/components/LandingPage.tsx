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
        <div className="text-center mb-12 bg-white/90 rounded-lg p-6">
          <div className="flex justify-center mb-6">
            <img src="/BEARISH3D_1.png" alt="Bearish Logo" className="w-48 h-48 object-contain" />
          </div>
          <h1 className="text-6xl font-bold text-green-800 mb-4 flex items-center justify-center">
            <img src="/images/mini-games/berry-forest/berry.webp" alt="Berry" className="w-12 h-12 mr-3" /> 
            Berry Forest Game
          </h1>
          <p className="text-xl text-green-600">A delightful adventure of berry collecting!</p>
        </div>

        <div className="bg-white/95 rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-green-800 mb-6">Welcome to the Forest!</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-2xl font-semibold text-green-700 mb-3">About the Game</h3>
              <p className="text-gray-600 leading-relaxed">
                Join our adorable bears on their berry-collecting adventure in the magical forest! 
                Choose your favorite character and help them gather berries while avoiding dangers.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-green-700 mb-3">Game Rules</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Move your character using the arrow keys to collect berries</li>
                <li>Regular berries (🍓) are worth 1 point</li>
                <li>Golden berries (⭐) are worth 3 points</li>
                <li>Avoid poison berries (☠️) - they cost you a life and -1 point</li>
                <li>You have 3 lives (<Heart className="w-4 h-4 inline text-red-500" />) to start</li>
                <li>Collect as many berries as you can before time runs out!</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-green-700 mb-3">How to Play</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Controls:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-center">
                      <ArrowUp className="w-8 h-8 text-green-600" />
                      <div className="flex space-x-2">
                        <ArrowLeft className="w-8 h-8 text-green-600" />
                        <ArrowDown className="w-8 h-8 text-green-600" />
                        <ArrowRight className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    <span className="text-gray-600">Move your character</span>
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
