"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

// Define your card images
const cardImages = [
    "/images/mini-games/match/card_1.webp",
    "/images/mini-games/match/card_2.webp",
    "/images/mini-games/match/card_3.webp",
  ]

// Create a pair of each image
const cards = cardImages.flatMap(img => [img, img])
  .sort(() => Math.random() - 0.5) // Shuffle the cards

export default function MatchGamePage() {
// State variables
const [selectedCards, setSelectedCards] = useState<{ card: string; index: number }[]>([])
const [matchedCards, setMatchedCards] = useState<string[]>([])
const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing")
const [timer, setTimer] = useState(0)
const [startTime, setStartTime] = useState<number | null>(null)
const [isTimerRunning, setIsTimerRunning] = useState(false)
const [points, setPoints] = useState(0)

useEffect(() => {
  let timerId: NodeJS.Timeout
  if (isTimerRunning && startTime) {
    timerId = setInterval(() => {
      setTimer(Date.now() - startTime)
    }, 10)
  }
  return () => clearInterval(timerId)
}, [isTimerRunning, startTime])

const formatTime = (ms: number) => {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const milliseconds = ms % 1000
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds
    .toString()
    .padStart(3, "0")}`
}

const handleCardClick = (card: string, index: number) => {
  if (
    gameState !== "playing" ||
    selectedCards.some(sc => sc.index === index) ||
    selectedCards.length === 2
  )
    return

  if (!isTimerRunning) {
    setStartTime(Date.now())
    setIsTimerRunning(true)
  }

  
  
    const newSelectedCards = [...selectedCards, { card, index }];
    setSelectedCards(newSelectedCards);
  
    if (newSelectedCards.length === 2) {
      const [first, second] = newSelectedCards;
      if (first.card === second.card) {
        setMatchedCards(prev => [...prev, first.card]);
        setPoints(prev => prev + 1);
        // Check win condition, accounting for the new match
        if (matchedCards.length + 1 === cards.length / 2) {
            console.log(gameState)
          setGameState("won");
          setIsTimerRunning(false);
        }
        setSelectedCards([]);
      } else {
        setTimeout(() => {
          setSelectedCards([]);
        }, 1000);
      }
    }
  };
  
  

  const startGame = () => {
    // Shuffle cards
    const shuffledCards = cards.sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
    setSelectedCards([])
    setMatchedCards([])
    setGameState("playing")
    setTimer(0)
    setIsTimerRunning(true)
  }

  const getCardClassName = (card: string, index: number) => {
    if (matchedCards.includes(card)) {
      return "opacity-0"
    }
    if (selectedCards.includes(card)) {
      return "bg-[#74C480] border-[#734739]"
    }
    return "bg-[#FFF6E9] border-[#734739]"
  }

  return (
    <div className="min-h-screen bg-[#FFF6E9] text-[#734739]">
      <header className="bg-[#74C480] p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Match Game</h1>
        </div>
        <Link href="/mini-games">
          <Button variant="outline" className="bg-white hover:bg-[#FFC078]/80 text-[#734739] border-[#734739]">
            Back to Games
          </Button>
        </Link>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Find the Matches!</h2>
            <p className="text-lg mb-4">
              Click on cards to find matching pairs. Complete all matches to win!
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <span className="font-bold">{formatTime(timer)}</span>

              </div>
              
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
  {cards.map((card, index) => (
    <Card 
      key={index}
      className={`border-2 cursor-pointer transition-all ${getCardClassName(card, index)}`}
      onClick={() => handleCardClick(card, index)}
    >
    <CardContent className="p-0">
        {selectedCards.some(sc => sc.index === index) ? (
        <Image
            src={card}
            alt="Card"
            width={100}
            height={100}
            className="w-full h-full object-cover"
            priority={true}
        />
        ) : matchedCards.includes(card) ? (
        <Image
            src={card}
            alt="Card"
            width={100}
            height={100}
            className="w-full h-full object-cover"
            priority={true}
        />
        ) : (
        <Image
            src="/images/mini-games/match/card_bg.png"
            alt="Card Back"
            width={100}
            height={100}
            className="w-full h-full object-cover"
            priority={true}
        />
        )}

        </CardContent>
    </Card>
  ))}
</div>

            {gameState === "won" && (
            <div className="mt-8 text-center">aasdasd
                <h2 className="text-3xl font-bold mb-4 text-[#74C480]">🎉 You Won! 🎉</h2>
                <h1 className="text-6xl font-bold mb-4">{formatTime(timer)}</h1>
                <Button
                onClick={startGame}
                className="bg-[#74C480] hover:bg-[#6FB5FF] text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white"
                >
                Play Again
                </Button>
            </div>
            )}

        </div>
      </main>
    </div>
  )
}