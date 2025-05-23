"use client"

import { useState, useEffect } from "react"
import GridPlacementSystem from "./grid-placement-system"

export default function SimpleDenMap({ onReturnToLanding }) {
  const [imageAvailable, setImageAvailable] = useState(false)
  const [devMode, setDevMode] = useState(false)
  const [validityMap, setValidityMap] = useState<boolean[][] | null>(null)

  // Preload the image
  useEffect(() => {
    const preloadImage = () => {
      // Use the correct path to the image
      const imagePath = "/images/bearish-den-map.webp"
      console.log("Attempting to preload den map image:", imagePath)

      const img = new Image()
      img.onload = () => {
        console.log("Den map image preloaded successfully")
        setImageAvailable(true)
      }
      img.onerror = (err) => {
        console.error("Error preloading den map image:", err)
        setImageAvailable(false)
      }

      // Set the source to the correct path
      img.src = imagePath
    }

    preloadImage()

    // Load the validity map
    const loadValidityMap = async () => {
      try {
        // This is the validity map the user provided
        const validityMapData = [
          [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            false,
            false,
            false,
          ],
          [
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
        ]

        setValidityMap(validityMapData)
        console.log("Validity map loaded successfully")
      } catch (error) {
        console.error("Error loading validity map:", error)
      }
    }

    loadValidityMap()

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
      {/* Remove the redundant error message since GridPlacementSystem will handle it */}

      {/* Dev mode toggle button */}
      <div className="absolute top-4 right-16 z-50">
        <button
          onClick={toggleDevMode}
          className="bg-[#FFF6E9]/80 p-1.5 rounded-lg border-2 border-[#734739] text-xs font-bold text-[#734739]"
        >
          {devMode ? "Exit Dev Mode" : "Dev Mode"}
        </button>
      </div>
      <GridPlacementSystem
        backgroundImage={imageAvailable ? "/images/bearish-den-map.webp" : undefined}
        cellSize={24} // Smaller cell size for finer grid
        devMode={devMode}
        onReturnToLanding={onReturnToLanding}
        validityMap={validityMap} // Pass the validity map to the grid system
      />

      {/* Hidden dev mode toggle (double-click bottom right corner) */}
      <div className="absolute bottom-0 right-0 w-8 h-8 z-50 opacity-0" onDoubleClick={toggleDevMode} />
    </div>
  )
}
