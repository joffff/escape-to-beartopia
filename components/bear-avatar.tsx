"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useGameState } from "@/context/game-context"
import Image from "next/image"

interface BearAvatarProps {
  compact?: boolean
}

export default function BearAvatar({ compact = false }: BearAvatarProps) {
  const { resources, clickHoney, honeyClickValue, season, upgrades } = useGameState()
  const [clickAnimation, setClickAnimation] = useState(false)
  const [bonusHoney, setBonusHoney] = useState(false)

  const handleClick = () => {
    // Manual resource gathering on click
    clickHoney()

    // Check for bonus honey animation
    const sniffingNose = upgrades.find((u) => u.id === "sniffingNose")
    if (sniffingNose && sniffingNose.purchased) {
      const bonusChance = sniffingNose.effect.value * sniffingNose.level
      if (Math.random() < bonusChance) {
        setBonusHoney(true)
        setTimeout(() => setBonusHoney(false), 800)
      }
    }

    // Trigger click animation
    setClickAnimation(true)
    setTimeout(() => setClickAnimation(false), 300)
  }

  if (compact) {
    return (
      <div
        className={`cursor-pointer relative ${clickAnimation ? "scale-95" : "scale-100"}`}
        style={{ transition: "transform 0.1s" }}
        onClick={handleClick}
      >
        <div className="relative w-16 h-16 rounded-full bg-[#FFC078]/70 p-2 overflow-hidden flex items-center justify-center border-2 border-[#FFC078]">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BearishLogo-Byu3rXUZxziBlHv1DUdkCofs2emyI4.webp"
            alt="Bearish Avatar"
            width={40}
            height={40}
          />

          {bonusHoney && (
            <div className="absolute -top-2 -right-2 animate-bounce">
              <span className="text-xl">🍯</span>
              <span className="absolute top-0 right-0 text-white font-bold text-xs bg-green-500 rounded-full px-1">
                +{honeyClickValue}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FFF6E9] rounded-lg p-4 flex flex-col items-center justify-center backdrop-blur-sm border-2 border-[#FFC078]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#734739]">{season.icon}</span>
            <span className="text-[#734739]">Day {season.day}</span>
          </div>
          <div className="text-[#734739] font-bold">{season.name}</div>
        </div>

        <div
          className={`cursor-pointer relative ${clickAnimation ? "scale-95" : "scale-100"}`}
          style={{ transition: "transform 0.1s" }}
          onClick={handleClick}
        >
          <div className="relative w-48 h-48 rounded-full bg-[#FFC078]/30 p-4 overflow-hidden flex items-center justify-center border-2 border-[#FFC078]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BearishLogo-Byu3rXUZxziBlHv1DUdkCofs2emyI4.webp"
              alt="Bearish Avatar"
              width={120}
              height={120}
            />

            {bonusHoney && (
              <div className="absolute top-0 right-0 animate-bounce">
                <span className="text-3xl">🍯</span>
                <span className="absolute top-0 right-0 text-white font-bold text-sm bg-green-500 rounded-full px-1">
                  +{honeyClickValue}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#FFC078]/30 p-4 rounded-lg w-full text-center">
          <Button
            onClick={handleClick}
            className="bg-[#E36F6F] hover:bg-[#FF82AD] text-white font-bold py-2 px-4 rounded-full transition-colors border-2 border-white"
          >
            Tap the Hive +{(honeyClickValue || 0).toFixed(1)}
          </Button>
        </div>

        <div className="relative w-full h-24 bg-[#FFC078]/30 rounded-lg overflow-hidden border-2 border-[#FFC078]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 flex items-center justify-center">
              <span className="text-5xl">🍯</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

