"use client"

import { useState } from "react"
import { useLoginWithAbstract } from "@abstract-foundation/agw-react"
import GameInterface from "./game-interface"

interface GameDashboardProps {
  onDisconnect: () => void
}

export default function GameDashboard({ onDisconnect }: GameDashboardProps) {
  const { address, isConnected } = useLoginWithAbstract()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#FFF6E9]">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 animate-bounce">
              <img
                src="/images/BearishLogo.webp"
                alt="Loading"
                className="w-full h-full"
              />
            </div>
            <p className="text-[#734739] text-xl font-bold">Loading Beartopia...</p>
          </div>
        </div>
      ) : (
        <GameInterface onDisconnect={onDisconnect} />
      )}
    </div>
  )
}
