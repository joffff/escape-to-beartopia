"use client"

import { useState, useEffect } from "react"
import GridPlacementSystem from "./grid-placement-system"

export default function SimpleDenMap() {
  const [imageAvailable, setImageAvailable] = useState(false)
  const [devMode, setDevMode] = useState(false)

  // Check if the image exists
  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch("/images/bearish-den-map.webp", { method: "HEAD" })
        setImageAvailable(response.ok)
      } catch (error) {
        console.error("Error checking den map image:", error)
        setImageAvailable(false)
      }
    }

    checkImage()

    // Check for dev mode via URL parameter or localStorage
    const isDevMode =
      typeof window !== "undefined" &&
      (window.location.search.includes("devMode=true") || localStorage.getItem("bearish-dev-mode") === "true")

    setDevMode(isDevMode)
  }, [])

  // Toggle dev mode
  const toggleDevMode = () => {
    const newDevMode = !devMode
    setDevMode(newDevMode)
    if (typeof window !== "undefined") {
      localStorage.setItem("bearish-dev-mode", newDevMode.toString())
    }
  }

  return (
    <div className="relative w-full h-full">
      <GridPlacementSystem
        backgroundImage={imageAvailable ? "/images/bearish-den-map.webp" : undefined}
        cellSize={24} // Smaller cell size for finer grid
        devMode={devMode}
      />

      {/* Hidden dev mode toggle (double-click bottom right corner) */}
      <div className="absolute bottom-0 right-0 w-8 h-8 z-50 opacity-0" onDoubleClick={toggleDevMode} />
    </div>
  )
}

