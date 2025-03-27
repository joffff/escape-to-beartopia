"use client"

import { useState, useEffect } from "react"
import { useGameState } from "@/context/game-context"

export default function SaveIndicator() {
  const { lastSaved } = useGameState()
  const [showSaving, setShowSaving] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState<string>("")

  // Update the formatted time when lastSaved changes
  useEffect(() => {
    if (lastSaved) {
      // Format the timestamp
      const date = new Date(lastSaved)
      const timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setLastSavedTime(timeString)

      // Show the saving indicator
      setShowSaving(true)

      // Hide it after 2 seconds
      const timer = setTimeout(() => {
        setShowSaving(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [lastSaved])

  if (!lastSaved) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 text-xs bg-[#FFF6E9]/90 backdrop-blur-sm border border-[#FFC078] rounded-lg p-2 transition-opacity duration-300">
      {showSaving ? (
        <div className="flex items-center text-[#74C480]">
          <svg
            className="animate-spin -ml-1 mr-2 h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Saving game...
        </div>
      ) : (
        <div className="text-[#734739]">Last saved: {lastSavedTime}</div>
      )}
    </div>
  )
}

