"use client"

// Add type declaration for webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Volume2, VolumeX } from "lucide-react"

const bearImages = [
  "/images/mini-games/repeat/card_1.webp",
  "/images/mini-games/repeat/card_2.webp",
  "/images/mini-games/repeat/card_3.webp",
  "/images/mini-games/repeat/card_4.webp",
]

export default function PatternRepeatGame() {
  const [pattern, setPattern] = useState<string[]>([])
  const [userPattern, setUserPattern] = useState<string[]>([])
  const [round, setRound] = useState(0)
  const [gameState, setGameState] = useState<"idle" | "countdown" | "showing" | "userTurn" | "lost" | "won" | "success">("idle")
  const [message, setMessage] = useState("")
  const [flashIndex, setFlashIndex] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(3)
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context on client side
  useEffect(() => {
    // Web Audio API is only available in browser environment
    if (typeof window !== 'undefined') {
      return () => {
        // Cleanup function
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(err => console.error("Error closing audio context:", err))
        }
      }
    }
  }, [])

  // Play boop sound function using Web Audio API
  const playBoopSound = (img?: string) => {
    if (!soundEnabled) return
    
    try {
      // Create a new audio context if it doesn't exist or is closed
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      
      const context = audioContextRef.current
      
      // Create oscillator for the boop sound
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()
      
      // Connect nodes
      oscillator.connect(gainNode)
      gainNode.connect(context.destination)
      
      // Set different frequencies based on the card image
      let baseFrequency = 440 // Default A4 note
      let targetFrequency = 880 // Default A5 note
      
      if (img) {
        const index = bearImages.indexOf(img)
        switch (index) {
          case 0: // First card - C note (lower)
            baseFrequency = 261.63
            targetFrequency = 523.25
            break
          case 1: // Second card - E note (medium-low)
            baseFrequency = 329.63
            targetFrequency = 659.25
            break
          case 2: // Third card - G note (medium-high)
            baseFrequency = 392.00
            targetFrequency = 784.00
            break
          case 3: // Fourth card - B note (high)
            baseFrequency = 493.88
            targetFrequency = 987.77
            break
        }
      }
      
      // Set parameters for the boop sound with the selected frequencies
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(baseFrequency, context.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(targetFrequency, context.currentTime + 0.1)
      
      // Set volume envelope
      gainNode.gain.setValueAtTime(0.7, context.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.3)
      
      // Start and stop
      oscillator.start()
      oscillator.stop(context.currentTime + 0.3)
    } catch (err) {
      console.error("Error playing boop sound:", err)
    }
  }

  // Handle countdown before game starts
  useEffect(() => {
    if (gameState === "countdown") {
      if (countdown > 0) {
        setMessage(`Get ready! ${countdown}...`)
        const timer = setTimeout(() => {
          setCountdown(countdown - 1)
        }, 1000)
        return () => clearTimeout(timer)
      } else {
        setGameState("showing")
        setCountdown(3) // Reset for next time
      }
    }
  }, [gameState, countdown])

  // Handle pattern display
  useEffect(() => {
    if (gameState === "showing") {
      setMessage("Watch the pattern!")
      let i = 0
      const showNext = () => {
        if (i < pattern.length) {
          setFlashIndex(i)
          playBoopSound(pattern[i]) // Play sound with the current card's image
          const t1 = setTimeout(() => {
            setFlashIndex(null)
            i++
            const t2 = setTimeout(showNext, 300)
            return () => clearTimeout(t2)
          }, 600)
          return () => clearTimeout(t1)
        } else {
          setGameState("userTurn")
          setMessage("Your turn!")
        }
      }
      showNext()
    }
  }, [gameState, pattern])

  // Handle success state and transition to next round
  useEffect(() => {
    if (gameState === "success") {
      const timer = setTimeout(() => {
        const next = bearImages[Math.floor(Math.random() * bearImages.length)]
        setPattern([...pattern, next])
        setUserPattern([])
        setRound(round + 1)
        setGameState("showing")
      }, 3000) // Wait 3 seconds before starting next round
      return () => clearTimeout(timer)
    }
  }, [gameState, pattern, round])

  const startGame = () => {
    const first = bearImages[Math.floor(Math.random() * bearImages.length)]
    setPattern([first])
    setUserPattern([])
    setRound(1)
    setCountdown(3)
    setGameState("countdown")
  }

  const handleUserClick = (img: string) => {
    if (gameState !== "userTurn") return
    
    // Show highlight when user clicks
    setActiveCard(img)
    playBoopSound(img) // Play sound with the clicked card's image
    setTimeout(() => setActiveCard(null), 300)
    
    const newUserPattern = [...userPattern, img]
    setUserPattern(newUserPattern)
    const idx = newUserPattern.length - 1
    
    if (newUserPattern[idx] !== pattern[idx]) {
      setGameState("lost")
      setMessage("Wrong pattern! Game over.")
      return
    }
    
    if (newUserPattern.length === pattern.length) {
      if (round === 10) {
        setGameState("won")
        setMessage("Congratulations! You completed all rounds.")
        return
      }
      
      // Show success message before moving to next round
      setGameState("success")
      setMessage("Correct! Great work!")
    }
  }

  const getHighlightOverlay = (img: string) => {
    const index = bearImages.indexOf(img)
    const colors = [
      "bg-[#FF6B6B]/90",
      "bg-[#FFD93D]/90",
      "bg-[#6BCB77]/90",
      "bg-[#4D96FF]/90",
    ]
    return colors[index] || "bg-[#734739]/50"
  }

  return (
    <div className="min-h-screen bg-[#FFF6E9] text-[#734739]">
      <header className="bg-[#74C480] p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Pattern Repeat</h1>
        <Link href="/mini-games">
          <Button variant="outline" className="bg-white hover:bg-[#FFC078]/80 text-[#734739] border-[#734739]">
            Back to Games
          </Button>
        </Link>
      </header>
      <main className="container mx-auto py-8 px-4 relative">
        {/* Sound toggle button in top-right corner */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white border-2 border-[#734739] flex items-center justify-center hover:bg-[#FFC078]/20 transition-colors z-10"
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
          title={soundEnabled ? "Mute sound" : "Enable sound"}
        >
          {soundEnabled ? <Volume2 size={20} className="text-[#734739]" /> : <VolumeX size={20} className="text-[#734739]" />}
        </button>
        
        {gameState === "idle" && (
          <div className="text-center">
            <Button
              onClick={startGame}
              className="bg-[#74C480] hover:bg-[#6FB5FF] text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white"
            >
              Start Game
            </Button>
          </div>
        )}
        
        {gameState === "countdown" && (
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold animate-pulse">{message}</h2>
          </div>
        )}
        
        {(gameState === "showing" || gameState === "userTurn" || gameState === "success") && (
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">Round {round}</h2>
            <p className={gameState === "success" ? "text-2xl font-bold text-green-600" : ""}>{message}</p>
          </div>
        )}

        {(gameState === "lost" || gameState === "won") && (
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">{gameState === "lost" ? "Game Over" : "Victory!"}</h2>
            <p className={gameState === "won" ? "text-2xl font-bold text-green-600" : "text-2xl font-bold text-red-600"}>{message}</p>
            <Button
              onClick={startGame}
              className="bg-[#74C480] hover:bg-[#6FB5FF] text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white mt-4"
            >
              Play Again
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 grid-rows-2 gap-4 mx-auto" style={{ width: '512px', height: '512px' }}>
          {bearImages.map((img, index) => {
            const isFlashing = gameState === "showing" && flashIndex !== null && pattern[flashIndex] === img
            const isUserActive = activeCard === img
            return (
              <Card
                key={index}
                onClick={() => handleUserClick(img)}
                className={`relative border-4 cursor-pointer transition-all overflow-hidden border-[#734739] ${
                  gameState === "userTurn" ? "hover:scale-105" : ""
                }`}
              >
                <CardContent className="relative w-full h-full p-0">
                  <Image src={img} alt="Bear" fill className="object-cover" />
                  {(isFlashing || isUserActive) && (
                    <div className={`${getHighlightOverlay(img)} absolute inset-0`} />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
