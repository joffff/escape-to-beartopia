"use client"

import { useState, useEffect } from "react"
import { AbstractWalletProvider } from "@abstract-foundation/agw-react"
import { abstractTestnet } from "viem/chains"
import GameDashboard from "@/components/game-dashboard"
import LandingScreen from "@/components/landing-screen"
import { GameProvider } from "@/context/game-context"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for connection in localStorage on initial load
  useEffect(() => {
    // Add a small delay to prevent flash of landing screen
    const timer = setTimeout(() => {
      const savedConnection = localStorage.getItem("beartopia-connected")
      if (savedConnection === "true") {
        console.log("Found saved connection state, setting connected")
        setIsConnected(true)
      }
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Log connection state changes for debugging
  useEffect(() => {
    console.log("App connection state changed:", isConnected)
    // Save connection state to localStorage
    if (isConnected) {
      localStorage.setItem("beartopia-connected", "true")
    }
  }, [isConnected])

  const handleConnect = () => {
    console.log("handleConnect called, setting isConnected to true")
    setIsConnected(true)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF6E9]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 animate-bounce">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BearishLogo-Byu3rXUZxziBlHv1DUdkCofs2emyI4.webp"
              alt="Loading"
              className="w-full h-full"
            />
          </div>
          <p className="text-[#734739] text-xl font-bold">Loading Beartopia...</p>
        </div>
      </div>
    )
  }

  return (
    <AbstractWalletProvider chain={abstractTestnet}>
      <GameProvider>
        <main className="min-h-screen">
          {!isConnected ? (
            <LandingScreen onConnect={handleConnect} />
          ) : (
            <GameDashboard
              onDisconnect={() => {
                localStorage.removeItem("beartopia-connected")
                setIsConnected(false)
              }}
            />
          )}
        </main>
      </GameProvider>
    </AbstractWalletProvider>
  )
}

