"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface CharacterSelectProps {
  onSelect: (character: string) => void
}

export default function CharacterSelect({ onSelect }: CharacterSelectProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  
  const characters = [
    {
      id: 'carlo-bear',
      name: 'Carlo Bear',
      description: 'Fast & Agile',
      image: '/images/carlo-bear.webp',
      stats: {
        speed: 4,
        stealth: 2,
        energy: 3
      }
    },
    {
      id: 'beefren',
      name: 'Bee Fren',
      description: 'Bee Whisperer',
      image: '/images/beefren.webp',
      stats: {
        speed: 2,
        stealth: 4,
        energy: 3
      }
    },
    {
      id: 'chad-bear',
      name: 'Chad Bear',
      description: 'Strong & Durable',
      image: '/images/chad-bear.gif',
      stats: {
        speed: 2,
        stealth: 1,
        energy: 5
      }
    }
  ]

  return (
    <div className="bg-white rounded-xl border-2 border-[#FFC078] shadow-lg p-6 max-w-4xl w-full">
      <h2 className="text-3xl font-bold mb-6 text-[#734739] text-center">Choose Your Bear</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {characters.map(character => (
          <div 
            key={character.id}
            className={`
              p-4 rounded-lg cursor-pointer transition-all
              ${selectedCharacter === character.id 
                ? 'bg-[#FFC078]/30 border-2 border-[#734739] transform scale-105' 
                : 'bg-[#FFF6E9] border-2 border-transparent hover:border-[#FFC078]'}
            `}
            onClick={() => setSelectedCharacter(character.id)}
          >
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-lg border-2 border-[#734739]">
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h3 className="text-xl font-bold text-[#734739]">{character.name}</h3>
              <p className="text-[#734739] mb-2">{character.description}</p>
              
              <div className="w-full grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-[#734739]">Speed</p>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-2 h-2 rounded-full mx-0.5 ${i < character.stats.speed ? 'bg-[#74C480]' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#734739]">Stealth</p>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-2 h-2 rounded-full mx-0.5 ${i < character.stats.stealth ? 'bg-[#B080FF]' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#734739]">Energy</p>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-2 h-2 rounded-full mx-0.5 ${i < character.stats.energy ? 'bg-[#FFC078]' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button
          onClick={() => selectedCharacter && onSelect(selectedCharacter)}
          disabled={!selectedCharacter}
          className="bg-[#74C480] hover:bg-[#6FB5FF] text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Adventure
        </Button>
      </div>
    </div>
  )
}
