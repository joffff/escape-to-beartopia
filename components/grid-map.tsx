"use client"

import { useState, useRef, useEffect } from "react"
import { useGameState } from "@/context/game-context"
import { X } from "lucide-react"

interface GridMapProps {
  initialZoom?: number
  backgroundImage?: string
}

export default function GridMap({ initialZoom = 1, backgroundImage }: GridMapProps) {
  const { playerStats, resources, updateResources } = useGameState()
  const [selectedObject, setSelectedObject] = useState(null)
  const [showBuildMenu, setShowBuildMenu] = useState(false)
  const mapContainerRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("buildings") // For tasks menu tabs

  // Log when component renders
  useEffect(() => {
    console.log("GridMap rendered with background image:", backgroundImage || "default grid")

    // Check if the background image exists
    if (backgroundImage) {
      try {
        const img = new Image()
        img.onload = () => {
          console.log("Background image loaded successfully")
          setImageLoaded(true)
        }
        img.onerror = () => {
          console.error("Error loading background image - falling back to default grid")
          setImageLoaded(false)
        }
        img.src = backgroundImage
      } catch (error) {
        console.error("Error setting up image load:", error)
        setImageLoaded(false)
      }
    }
  }, [backgroundImage])

  // Buildings and resources on the map
  const [mapObjects, setMapObjects] = useState([
    { id: 1, type: "building", name: "Main Den", icon: "🏠", x: 20, y: 80, size: "md" },
    {
      id: 2,
      type: "resource",
      name: "Berry Bush",
      icon: "🍓",
      x: 30,
      y: 70,
      size: "sm",
      resource: "redBerries",
      amount: 5,
    },
    {
      id: 3,
      type: "resource",
      name: "Forest",
      icon: "🌲",
      x: 15,
      y: 60,
      size: "sm",
      resource: "wood",
      amount: 3,
    },
    {
      id: 4,
      type: "resource",
      name: "Stone",
      icon: "🪨",
      x: 40,
      y: 50,
      size: "sm",
      resource: "stone",
      amount: 2,
    },
    { id: 5, type: "building", name: "Fishing Hut", icon: "🏕️", x: 60, y: 75, size: "sm" },
    {
      id: 6,
      type: "resource",
      name: "Honey Hive",
      icon: "🍯",
      x: 45,
      y: 65,
      size: "sm",
      resource: "honey",
      amount: 2,
    },
  ])

  // Get object size in pixels
  const getObjectSizeInPixels = (size) => {
    switch (size) {
      case "xs":
        return 24
      case "sm":
        return 32
      case "md":
        return 48
      case "lg":
        return 64
      default:
        return 32
    }
  }

  // Toggle build menu
  const toggleBuildMenu = () => {
    setShowBuildMenu(!showBuildMenu)
  }

  // Handle resource gathering
  const handleGatherResource = (object) => {
    if (!object || object.type !== "resource") return

    try {
      // Add resource to player's inventory
      const newResources = { ...resources }
      newResources[object.resource] += object.amount

      // Update resources
      updateResources(newResources)

      // Remove the resource from the map
      setMapObjects(mapObjects.filter((obj) => obj.id !== object.id))

      // Clear selection
      setSelectedObject(null)

      // Show feedback - using console.log instead of alert to avoid potential issues
      console.log(`Gathered ${object.amount} ${object.resource}!`)
    } catch (error) {
      console.error("Error gathering resource:", error)
    }
  }

  // Handle object click
  const handleObjectClick = (object, e) => {
    if (e) e.stopPropagation()
    setSelectedObject(object)
  }

  // Close the selected object panel
  const closeObjectPanel = () => {
    setSelectedObject(null)
  }

  // Handle map background click to deselect object
  const handleMapClick = () => {
    setSelectedObject(null)
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Map container with background */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0"
        style={
          backgroundImage && imageLoaded
            ? {
                backgroundImage: `url('${backgroundImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#74C480", // Fallback color
              }
            : {
                backgroundColor: "#74C480",
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }
        }
        onClick={handleMapClick}
      >
        {/* Map objects (buildings, resources) */}
        {mapObjects.map((obj) => (
          <div
            key={obj.id}
            className="absolute cursor-pointer hover:scale-110 transition-all"
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 20,
            }}
            onClick={(e) => handleObjectClick(obj, e)}
          >
            <div
              className={`rounded-full flex items-center justify-center
                ${
                  obj.type === "building"
                    ? "bg-[#FFC078] border-[#734739]"
                    : obj.type === "resource"
                      ? "bg-[#74C480] border-[#734739]"
                      : "bg-[#E36F6F] border-[#734739]"
                }`}
              style={{
                width: `${getObjectSizeInPixels(obj.size)}px`,
                height: `${getObjectSizeInPixels(obj.size)}px`,
                border: "3px solid",
                boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
                fontSize: `${getObjectSizeInPixels(obj.size) * 0.6}px`,
              }}
            >
              {obj.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Home button */}
      <div className="absolute bottom-4 right-4 bg-[#FFF6E9]/80 p-2 rounded-lg border-2 border-[#734739] z-50">
        <button className="w-8 h-8 bg-[#FFC078] rounded-full flex items-center justify-center border border-[#734739]">
          ⌂
        </button>
      </div>

      {/* Selected object info */}
      {selectedObject && (
        <div className="absolute bottom-4 left-4 w-64 bg-[#FFF6E9]/90 backdrop-blur-sm border-2 border-[#734739] p-3 rounded-lg z-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                  ${
                    selectedObject.type === "building"
                      ? "bg-[#FFC078]"
                      : selectedObject.type === "resource"
                        ? "bg-[#74C480]"
                        : "bg-[#E36F6F]"
                  }`}
                style={{ border: "2px solid #734739" }}
              >
                {selectedObject.icon}
              </div>
              <div>
                <div className="font-medium text-[#734739]">{selectedObject.name}</div>
                <div className="text-xs text-[#734739] capitalize">{selectedObject.type}</div>
              </div>
            </div>
            <button
              onClick={closeObjectPanel}
              className="text-[#734739] hover:text-[#E36F6F] p-1 rounded-full hover:bg-[#FFC078]/30"
            >
              <X size={18} />
            </button>
          </div>

          {selectedObject.type === "resource" && (
            <button
              className="w-full bg-[#E36F6F] hover:bg-[#FF82AD] text-white font-bold py-2 px-4 rounded transition-colors border-2 border-white text-sm"
              onClick={() => handleGatherResource(selectedObject)}
            >
              Gather Resource
            </button>
          )}

          {selectedObject.type === "building" && (
            <button className="w-full bg-[#FFC078] hover:bg-[#FFC078]/80 text-[#734739] font-bold py-2 px-4 rounded transition-colors border-2 border-[#734739] text-sm">
              Enter Building
            </button>
          )}
        </div>
      )}

      {/* Tasks button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          className="bg-[#E36F6F] hover:bg-[#FF82AD] text-white font-bold py-1.5 px-3 rounded-full transition-colors border-2 border-white flex items-center gap-1 shadow-lg text-sm"
          onClick={toggleBuildMenu}
        >
          <span className="text-sm">📋</span>
          <span>Tasks</span>
        </button>
      </div>

      {/* Build menu panel */}
      {showBuildMenu && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 bg-[#FFF6E9]/95 backdrop-blur-sm border-2 border-[#734739] p-4 rounded-lg z-50 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#734739] text-lg">Village Tasks</h3>
            <button
              className="text-[#734739] hover:text-[#E36F6F] p-1 rounded-full hover:bg-[#FFC078]/30"
              onClick={toggleBuildMenu}
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              className={`flex-1 font-bold py-2 px-4 rounded-t-lg ${activeTab === "buildings" ? "bg-[#FFC078] text-[#734739] border-b-2 border-[#734739]" : "bg-[#FFF6E9] text-[#734739]"}`}
              onClick={() => setActiveTab("buildings")}
            >
              Buildings
            </button>
            <button
              className={`flex-1 font-bold py-2 px-4 rounded-t-lg ${activeTab === "quests" ? "bg-[#FFC078] text-[#734739] border-b-2 border-[#734739]" : "bg-[#FFF6E9] text-[#734739]"}`}
              onClick={() => setActiveTab("quests")}
            >
              Quests
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {/* Building options */}
            {activeTab === "buildings" && (
              <div className="space-y-2">
                <div className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80">
                  <div className="w-8 h-8 rounded-full bg-[#FFC078] flex items-center justify-center text-xl border-2 border-[#734739]">
                    🏠
                  </div>
                  <div>
                    <div className="font-medium text-[#734739]">Bear Den</div>
                    <div className="text-xs text-[#734739]">🪵 10 • 🪨 5</div>
                  </div>
                </div>

                <div className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80">
                  <div className="w-8 h-8 rounded-full bg-[#FFC078] flex items-center justify-center text-xl border-2 border-[#734739]">
                    🍓
                  </div>
                  <div>
                    <div className="font-medium text-[#734739]">Berry Farm</div>
                    <div className="text-xs text-[#734739]">🪵 15</div>
                  </div>
                </div>

                <div className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80">
                  <div className="w-8 h-8 rounded-full bg-[#FFC078] flex items-center justify-center text-xl border-2 border-[#734739]">
                    🍯
                  </div>
                  <div>
                    <div className="font-medium text-[#734739]">Beehive</div>
                    <div className="text-xs text-[#734739]">🪵 20</div>
                  </div>
                </div>

                <div className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80">
                  <div className="w-8 h-8 rounded-full bg-[#FFC078] flex items-center justify-center text-xl border-2 border-[#734739]">
                    🪵
                  </div>
                  <div>
                    <div className="font-medium text-[#734739]">Lumber Mill</div>
                    <div className="text-xs text-[#734739]">🪵 25 • 🪨 10</div>
                  </div>
                </div>
              </div>
            )}

            {/* Quest options */}
            {activeTab === "quests" && (
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
                  <div className="w-8 h-8 rounded-full bg-[#74C480] flex items-center justify-center text-xl border-2 border-[#734739]">
                    🪵
                  </div>
                  <div>
                    <div className="font-medium text-[#734739]">Wood Collection</div>
                    <div className="text-xs text-[#734739]">Gather wood for construction</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map info */}
      <div className="absolute top-4 left-4 bg-[#FFF6E9]/80 p-2 rounded-lg border-2 border-[#734739] z-50">
        <h4 className="font-bold text-[#734739] text-sm">Bear Village</h4>
        <div className="text-xs text-[#734739]">Your Home Base • Level {playerStats.level}</div>
      </div>
    </div>
  )
}

