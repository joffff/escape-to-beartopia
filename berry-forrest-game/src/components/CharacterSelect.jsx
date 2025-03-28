import React from 'react';

const CHARACTERS = [
  {
    id: 'carlo',
    name: 'Carlo Bear',
    image: '/carlo-bear.jpg',
    description: 'A tough bear with a rebellious spirit and leather jacket'
  },
  {
    id: 'scotty',
    name: 'Scotty Bear',
    image: '/scotty-bear.jpg',
    description: 'A chill bear who keeps it cool with his signature cap'
  },
  {
    id: 'toli',
    name: 'Toli Bear',
    image: '/toli-bear.jpg',
    description: 'A groovy bear spreading good vibes in tie-dye'
  }
];

function CharacterSelect({ onCharacterSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 text-center mb-8">Choose Your Berry Collector</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CHARACTERS.map((character) => (
            <div
              key={character.id}
              className="bg-white rounded-lg shadow-xl p-6 transform transition-all duration-200 hover:shadow-2xl hover:scale-105 cursor-pointer"
              onClick={() => onCharacterSelect(character)}
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-50 flex items-center justify-center">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-48 h-48 object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2 text-center">{character.name}</h2>
              <p className="text-gray-600 text-center">{character.description}</p>
              <button
                className="mt-4 w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors transform hover:scale-105"
              >
                Play as {character.name}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-lg">Each bear has their own unique style!</p>
          <p className="mt-2">Pick your favorite and start collecting berries in the forest.</p>
        </div>
      </div>
    </div>
  );
}

export default CharacterSelect; 