import React from 'react';
import { Game } from './game';

function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
      <div 
        className="w-[800px] h-[600px] relative overflow-hidden"
        style={{
          backgroundImage: 'url(/images/bearish-den-map.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Game />
      </div>
    </div>
  );
}

export default App; 