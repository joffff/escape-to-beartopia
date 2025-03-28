"use client"

import { useLoginWithAbstract } from "@abstract-foundation/agw-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface LandingScreenProps {
  onConnect: () => void
}

export default function LandingScreen({ onConnect }: LandingScreenProps) {
  // Get all available hooks and states from Abstract
  const { login, isLoading, isSuccess, isConnected, address, error } = useLoginWithAbstract()
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [showManualContinue, setShowManualContinue] = useState(false)
  const [connectionAttempted, setConnectionAttempted] = useState(false)

  // This effect will check for wallet connection status
  useEffect(() => {
    console.log("Connection status check:", { isConnected, isSuccess, address, error })

    // If we have an address or isConnected is true, consider the user connected
    if (address || isConnected || isSuccess) {
      console.log("Wallet connected, redirecting to game dashboard")
      onConnect()
    }

    // Show manual continue button if connection was attempted but failed
    if (connectionAttempted && !isLoading && !isConnected && !isSuccess) {
      setShowManualContinue(true)
      if (error) {
        setConnectionError(`Connection error: ${error.message || "Unknown error"}`)
      }
    }
  }, [isConnected, isSuccess, address, error, onConnect, connectionAttempted, isLoading])

  const handleLogin = async () => {
    try {
      setConnectionError(null)
      setConnectionAttempted(true)
      console.log("Attempting to login...")

      // Call the login function
      await login()

      // Show manual continue button after a short delay
      setTimeout(() => {
        setShowManualContinue(true)
      }, 3000)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setConnectionError("Failed to connect wallet. Please try again.")
      // Show manual continue button on error as well
      setShowManualContinue(true)
    }
  }

  // Debug button to force connection
  const forceConnect = () => {
    console.log("Forcing connection...")
    onConnect()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center relative bg-[#6FB5FF]">
      {/* Use a background div instead of an image for now */}
      <div className="absolute inset-0 w-full h-full bg-[#6FB5FF] z-0">{/* Fallback blue background */}</div>

      <div className="max-w-3xl mx-auto z-10 bg-[#FFF6E9]/90 p-8 rounded-xl backdrop-blur-sm border-2 border-[#FFC078]">
        <div className="flex justify-center mb-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BEARISH3D_1-bpKe2vDKcEp9KTZgHCvMHLfTPNgOxY.png"
            alt="BEARISH"
            width={400}
            height={100}
            className="mb-4"
          />
        </div>

        <h1 className="text-5xl font-extrabold text-[#734739] mb-6">Escape to Beartopia</h1>

        <div className="flex justify-center mb-8">
          <Image
            src="/images/BearishLogo.webp"
            alt="Bearish Logo"
            width={120}
            height={120}
          />
        </div>

        <p className="text-xl text-[#734739] mb-8">
          Build your bear sanctuary, gather resources, and join forces with other bears to create the ultimate utopia in
          this idle RPG strategy game.
        </p>

        <Button
          onClick={handleLogin}
          disabled={isLoading || isConnected || isSuccess}
          size="lg"
          className={`font-bold text-lg px-8 py-6 border-2 ${
            isConnected || isSuccess
              ? "bg-white text-[#734739] border-[#74C480]"
              : "bg-[#74C480] hover:bg-[#74C480]/80 text-white border-white"
          }`}
        >
          {isLoading ? "Connecting..." : isConnected || isSuccess ? "Connected" : "Connect with Abstract Wallet"}
        </Button>

        {connectionError && <div className="mt-4 p-3 bg-red-500/70 text-white rounded-lg">{connectionError}</div>}

        {/* Manual continue button that appears after wallet signing */}
        {showManualContinue && (
          <div className="mt-4 p-4 bg-[#74C480]/70 text-white rounded-lg">
            <p className="mb-2">If you've signed the wallet request but aren't being redirected automatically:</p>
            <Button onClick={forceConnect} className="bg-white text-[#74C480] hover:bg-green-100">
              Continue to Game
            </Button>
          </div>
        )}

        <div className="mt-4">
          <button onClick={forceConnect} className="text-sm text-[#734739] underline hover:text-[#74C480]">
            Continue without wallet (for testing)
          </button>
        </div>

        {/* Debug info */}
        <div className="mt-4 text-xs text-[#734739] opacity-70">
          Status: {isConnected ? "Connected" : "Not Connected"} | Success: {isSuccess ? "Yes" : "No"} | Address:{" "}
          {address ? address.substring(0, 6) + "..." : "None"}
        </div>

        <p className="mt-4 text-[#734739] text-sm">Powered by the Abstract blockchain and Bearish NFT collection</p>
      </div>
    </div>
  )
}
