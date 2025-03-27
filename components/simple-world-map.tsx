"use client"

import { useState, useRef, useEffect } from "react"
import { useGameState } from "@/context/game-context"
import { X } from "lucide-react"

export default function SimpleWorldMap() {
  const { playerStats } = useGameState()
  const [selectedLocation, setSelectedLocation] = useState(null)
  const mapContainerRef = useRef(null)
  const [mapHeight, setMapHeight] = useState("150vh") // Default height, will be adjusted
  const [showTasksMenu, setShowTasksMenu] = useState(false) // State for tasks menu
  const [imageAvailable, setImageAvailable] = useState(false)

  // Check if the image exists
  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch("/images/bearish-world-map.jpg", { method: "HEAD" })
        setImageAvailable(response.ok)
        console.log("World map image available:", response.ok)
      } catch (error) {
        console.error("Error checking world map image:", error)
        setImageAvailable(false)
      }
    }

    checkImage()
  }, [])

  // Define stages and mini-games on the world map
  // Positions are now condensed to fit within the bottom 2/3 of the image
  const mapLocations = [
    {
      id: 1,
      name: "Bear Village",
      type: "home",
      x: 50,
      y: 90, // Starting area at the very bottom
      icon: "🏠",
      color: "#FFC078",
      description: "Your home base. Return here to manage your resources and buildings.",
      unlocked: true,
    },
    {
      id: 2,
      name: "Berry Forest",
      type: "stage",
      x: 30,
      y: 80, // Moved up from bottom
      icon: "🍓",
      color: "#E36F6F",
      description: "Stage 1: Collect berries to feed the hungry bear cubs.",
      unlocked: true,
      collectible: "Berry Picker Badge",
    },
    {
      id: 3,
      name: "Honey Hills",
      type: "stage",
      x: 65,
      y: 70, // Moved up further
      icon: "🍯",
      color: "#FFC078",
      description: "Stage 2: Navigate through the beehives to collect honey.",
      unlocked: playerStats.level >= 2,
      collectible: "Honey Hunter Badge",
    },
    {
      id: 4,
      name: "Stone Mountain",
      type: "stage",
      x: 40,
      y: 55, // About halfway up
      icon: "🪨",
      color: "#A66959",
      description: "Stage 3: Mine stones and avoid falling rocks.",
      unlocked: playerStats.level >= 3,
      collectible: "Stone Miner Badge",
    },
    {
      id: 5,
      name: "Ancient Ruins",
      type: "minigame",
      x: 70,
      y: 45, // Moving toward the top third
      icon: "🏛️",
      color: "#B080FF",
      description: "Mini-game: Solve puzzles to unlock ancient bear treasures.",
      unlocked: playerStats.level >= 4,
      collectible: "Puzzle Solver Badge",
    },
    {
      id: 6,
      name: "Beartopia",
      type: "final",
      x: 50,
      y: 35, // About 2/3 up the page (white mountain area)
      icon: "❄️",
      color: "#FFFFFF",
      description: "Final Destination: The legendary bear paradise on the white mountain!",
      unlocked: playerStats.level >= 5,
      collectible: "Beartopia Key",
    },
  ]

  // Load and measure the image to set the correct height
  useEffect(() => {
    if (!imageAvailable) {
      // If image is not available, set a default height
      setMapHeight("150vh")
      return
    }

    // Create an image element to measure the actual image dimensions
    const img = new Image()
    img.onload = () => {
      // Calculate the aspect ratio of the image
      const aspectRatio = img.height / img.width

      // Set the map height based on the container width and image aspect ratio
      if (mapContainerRef.current) {
        const containerWidth = mapContainerRef.current.clientWidth
        const calculatedHeight = containerWidth * aspectRatio

        // Set the height with a small buffer (10% extra) to ensure we don't cut off content
        setMapHeight(`${calculatedHeight * 1.1}px`)

        console.log("Image loaded, adjusted map height to:", calculatedHeight)

        // Scroll to bottom after height is set
        setTimeout(() => {
          if (mapContainerRef.current) {
            mapContainerRef.current.scrollTop = mapContainerRef.current.scrollHeight
          }
        }, 100)
      }
    }
    img.onerror = () => {
      console.error("Error loading world map image for measurement")
      setMapHeight("150vh") // Default height if image fails to load
    }
    img.src = "/images/bearish-world-map.jpg"
  }, [imageAvailable])

  // Handle location click
  const handleLocationClick = (location, e) => {
    if (e) e.stopPropagation()
    if (location.unlocked) {
      setSelectedLocation(location)
    }
  }

  // Handle starting a stage or mini-game
  const handleStartStage = () => {
    if (!selectedLocation) return
    console.log(`Starting ${selectedLocation.name}!`)
  }

  // Close the selected location panel
  const closeLocationPanel = () => {
    setSelectedLocation(null)
  }

  // Toggle tasks menu
  const toggleTasksMenu = () => {
    setShowTasksMenu(!showTasksMenu)
  }

  // Handle map background click to deselect location
  const handleMapClick = () => {
    setSelectedLocation(null)
  }

  // Scroll to a specific location
  const scrollToLocation = (locationId) => {
    const location = mapLocations.find((loc) => loc.id === locationId)
    if (!location || !mapContainerRef.current) return

    // Calculate position based on location's y percentage
    const totalHeight = mapContainerRef.current.scrollHeight
    const targetY = (location.y / 100) * totalHeight

    mapContainerRef.current.scrollTo({
      top: targetY - 100, // Offset to position location in view
      behavior: "smooth",
    })
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Map container with background and scrolling */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{
          scrollBehavior: "smooth",
          backgroundColor: "#74C480", // Match background color to blend with image edges
        }}
        onClick={handleMapClick}
      >
        {/* Map content - height now dynamically set based on image dimensions */}
        <div className="relative w-full flex justify-center" style={{ height: mapHeight }}>
          {/* Background image container with proper sizing */}
          <div
            className="h-full w-full"
            style={{
              maxWidth: "1000px", // Limit width to ensure it fits
              ...(imageAvailable
                ? {
                    backgroundImage: "url('/images/bearish-world-map.jpg')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }
                : {
                    // Fallback styling if image is not available
                    backgroundColor: "#74C480",
                    backgroundImage:
                      "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }),
            }}
          >
            {/* Map locations */}
            {mapLocations.map((location) => (
              <div
                key={location.id}
                className={`absolute cursor-pointer transition-all ${location.unlocked ? "hover:scale-110" : "opacity-50 cursor-not-allowed"}`}
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 20,
                }}
                onClick={(e) => handleLocationClick(location, e)}
              >
                <div
                  className={`rounded-full flex items-center justify-center ${
                    selectedLocation?.id === location.id ? "ring-4 ring-white" : ""
                  }`}
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: location.color,
                    border: "3px solid #734739",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                    fontSize: "24px",
                  }}
                >
                  {location.icon}
                </div>
                {!location.unlocked && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#734739] rounded-full flex items-center justify-center text-white text-xs">
                    🔒
                  </div>
                )}
              </div>
            ))}

            {/* Path connections between locations - adjusted for condensed vertical progression */}
            <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 10 }}>
              {/* Path from Bear Village to Berry Forest */}
              <path
                d="M 50% 90% Q 40% 85%, 30% 80%"
                stroke="#734739"
                strokeWidth="5"
                fill="none"
                strokeDasharray={playerStats.level >= 1 ? "none" : "5,5"}
              />

              {/* Path from Berry Forest to Honey Hills */}
              <path
                d="M 30% 80% Q 48% 75%, 65% 70%"
                stroke="#734739"
                strokeWidth="5"
                fill="none"
                strokeDasharray={playerStats.level >= 2 ? "none" : "5,5"}
              />

              {/* Path from Honey Hills to Stone Mountain */}
              <path
                d="M 65% 70% Q 53% 63%, 40% 55%"
                stroke="#734739"
                strokeWidth="5"
                fill="none"
                strokeDasharray={playerStats.level >= 3 ? "none" : "5,5"}
              />

              {/* Path from Stone Mountain to Ancient Ruins */}
              <path
                d="M 40% 55% Q 55% 50%, 70% 45%"
                stroke="#734739"
                strokeWidth="5"
                fill="none"
                strokeDasharray={playerStats.level >= 4 ? "none" : "5,5"}
              />

              {/* Path from Ancient Ruins to Beartopia */}
              <path
                d="M 70% 45% Q 60% 40%, 50% 35%"
                stroke="#734739"
                strokeWidth="5"
                fill="none"
                strokeDasharray={playerStats.level >= 5 ? "none" : "5,5"}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="absolute top-20 right-4 bg-[#FFF6E9]/80 p-2 rounded-lg border-2 border-[#734739] z-50 flex flex-col gap-2">
        <button
          onClick={() => scrollToLocation(6)}
          className={`w-8 h-8 rounded-full flex items-center justify-center border border-[#734739] ${playerStats.level >= 5 ? "bg-[#FFFFFF] text-[#734739]" : "bg-gray-400 text-gray-600"}`}
          disabled={playerStats.level < 5}
        >
          ❄️
        </button>
        <button
          onClick={() => scrollToLocation(5)}
          className={`w-8 h-8 rounded-full flex items-center justify-center border border-[#734739] ${playerStats.level >= 4 ? "bg-[#B080FF] text-white" : "bg-gray-400 text-gray-600"}`}
          disabled={playerStats.level < 4}
        >
          🏛️
        </button>
        <button
          onClick={() => scrollToLocation(4)}
          className={`w-8 h-8 rounded-full flex items-center justify-center border border-[#734739] ${playerStats.level >= 3 ? "bg-[#A66959] text-white" : "bg-gray-400 text-gray-600"}`}
          disabled={playerStats.level < 3}
        >
          🪨
        </button>
        <button
          onClick={() => scrollToLocation(3)}
          className={`w-8 h-8 rounded-full flex items-center justify-center border border-[#734739] ${playerStats.level >= 2 ? "bg-[#FFC078] text-[#734739]" : "bg-gray-400 text-gray-600"}`}
          disabled={playerStats.level < 2}
        >
          🍯
        </button>
        <button
          onClick={() => scrollToLocation(2)}
          className="w-8 h-8 bg-[#E36F6F] rounded-full flex items-center justify-center border border-[#734739]"
        >
          🍓
        </button>
        <button
          onClick={() => scrollToLocation(1)}
          className="w-8 h-8 bg-[#FFC078] rounded-full flex items-center justify-center border border-[#734739]"
        >
          🏠
        </button>
      </div>

      {/* Home button */}
      <div className="absolute bottom-4 right-4 bg-[#FFF6E9]/80 p-2 rounded-lg border-2 border-[#734739] z-50">
        <button
          onClick={() => scrollToLocation(1)}
          className="w-8 h-8 bg-[#FFC078] rounded-full flex items-center justify-center border border-[#734739]"
        >
          ⌂
        </button>
      </div>

      {/* Selected location info */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 w-64 bg-[#FFF6E9]/90 backdrop-blur-sm border-2 border-[#734739] p-3 rounded-lg z-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: selectedLocation.color, border: "2px solid #734739" }}
              >
                {selectedLocation.icon}
              </div>
              <h3 className="font-bold text-[#734739]">{selectedLocation.name}</h3>
            </div>
            <button
              onClick={closeLocationPanel}
              className="text-[#734739] hover:text-[#E36F6F] p-1 rounded-full hover:bg-[#FFC078]/30"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-[#734739] mb-3">{selectedLocation.description}</p>

          {selectedLocation.type !== "home" && selectedLocation.collectible && (
            <div className="mb-3 p-2 bg-[#FFC078]/30 rounded-lg">
              <p className="text-sm text-[#734739]">
                <span className="font-bold">Collectible:</span> {selectedLocation.collectible}
              </p>
            </div>
          )}

          <button
            className="w-full bg-[#E36F6F] hover:bg-[#FF82AD] text-white font-bold py-2 px-4 rounded transition-colors border-2 border-white"
            onClick={handleStartStage}
          >
            {selectedLocation.type === "home"
              ? "Enter Village"
              : selectedLocation.type === "final"
                ? "Enter Beartopia"
                : selectedLocation.type === "minigame"
                  ? "Play Mini-game"
                  : "Start Stage"}
          </button>
        </div>
      )}

      {/* Tasks button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          className="bg-[#B080FF] hover:bg-[#B080FF]/80 text-white font-bold py-1.5 px-3 rounded-full transition-colors border-2 border-white flex items-center gap-1 shadow-lg text-sm"
          onClick={toggleTasksMenu}
        >
          <span className="text-sm">📋</span>
          <span>Tasks</span>
        </button>
      </div>

      {/* Tasks menu panel */}
      {showTasksMenu && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 bg-[#FFF6E9]/95 backdrop-blur-sm border-2 border-[#734739] p-4 rounded-lg z-50 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#734739] text-lg">World Tasks</h3>
            <button
              className="text-[#734739] hover:text-[#E36F6F] p-1 rounded-full hover:bg-[#FFC078]/30"
              onClick={toggleTasksMenu}
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button className="flex-1 bg-[#FFC078] text-[#734739] font-bold py-2 px-4 rounded-t-lg border-b-2 border-[#734739]">
              Quests
            </button>
            <button className="flex-1 bg-[#FFF6E9] text-[#734739] font-bold py-2 px-4 rounded-t-lg">
              Achievements
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {/* Quest options */}
            <div className="space-y-2">
              <div className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80">
                <div className="w-8 h-8 rounded-full bg-[#E36F6F] flex items-center justify-center text-xl border-2 border-[#734739]">
                  🍓
                </div>
                <div>
                  <div className="font-medium text-[#734739]">Berry Gathering</div>
                  <div className="text-xs text-[#734739]">Collect berries for hungry cubs</div>
                </div>
              </div>

              <div className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80">
                <div className="w-8 h-8 rounded-full bg-[#FFC078] flex items-center justify-center text-xl border-2 border-[#734739]">
                  🍯
                </div>
                <div>
                  <div className="font-medium text-[#734739]">Honey Harvest</div>
                  <div className="text-xs text-[#734739]">Collect honey from wild beehives</div>
                </div>
              </div>

              <div className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80">
                <div className="w-8 h-8 rounded-full bg-[#A66959] flex items-center justify-center text-xl border-2 border-[#734739]">
                  🪨
                </div>
                <div>
                  <div className="font-medium text-[#734739]">Stone Gathering</div>
                  <div className="text-xs text-[#734739]">Collect stones for building</div>
                </div>
              </div>

              <div className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80">
                <div className="w-8 h-8 rounded-full bg-[#B080FF] flex items-center justify-center text-xl border-2 border-[#734739]">
                  🏛️
                </div>
                <div>
                  <div className="font-medium text-[#734739]">Ancient Puzzle</div>
                  <div className="text-xs text-[#734739]">Solve the ruins puzzle</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* World map info */}
      <div className="absolute top-4 left-4 bg-[#FFF6E9]/80 p-2 rounded-lg border-2 border-[#734739] z-50">
        <h4 className="font-bold text-[#734739] text-sm">Journey to Beartopia</h4>
        <div className="text-xs text-[#734739]">
          Complete stages to reach the white mountain • Level {playerStats.level}
        </div>
      </div>
    </div>
  )
}

