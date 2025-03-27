"use client"

import { useState } from "react"
import { useGameState } from "@/context/game-context"
import { Button } from "@/components/ui/button"

// Building types available for construction
const BUILDING_TYPES = [
  {
    id: "den",
    name: "Bear Den",
    icon: "🏠",
    description: "Your home base. Provides shelter and basic storage.",
    cost: { wood: 10, stone: 5 },
    size: "sm",
  },
  {
    id: "berry_farm",
    name: "Berry Farm",
    icon: "🍓",
    description: "Produces berries over time.",
    cost: { wood: 15, stone: 0 },
    size: "xs",
  },
  {
    id: "beehive",
    name: "Beehive",
    icon: "🍯",
    description: "Produces honey over time.",
    cost: { wood: 20, stone: 0 },
    size: "xs",
  },
  {
    id: "lumber_mill",
    name: "Lumber Mill",
    icon: "🪵",
    description: "Processes wood more efficiently.",
    cost: { wood: 25, stone: 10 },
    size: "sm",
  },
  {
    id: "quarry",
    name: "Quarry",
    icon: "🪨",
    description: "Extracts stone resources.",
    cost: { wood: 20, stone: 5 },
    size: "sm",
  },
  {
    id: "fishing_hut",
    name: "Fishing Hut",
    icon: "🏕️",
    description: "Allows fishing in nearby waters.",
    cost: { wood: 15, stone: 5 },
    size: "xs",
  },
  {
    id: "storage",
    name: "Storage",
    icon: "📦",
    description: "Increases resource storage capacity.",
    cost: { wood: 30, stone: 15 },
    size: "sm",
  },
  {
    id: "workshop",
    name: "Workshop",
    icon: "🔨",
    description: "Crafts tools and basic items.",
    cost: { wood: 35, stone: 20 },
    size: "sm",
  },
]

export default function GridBuildingPanel() {
  const { resources, playerStats } = useGameState()
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter buildings based on search term
  const filteredBuildings = BUILDING_TYPES.filter(
    (building) =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Check if player can afford a building
  const canAfford = (building) => {
    return Object.entries(building.cost).every(([resource, amount]) => resources[resource] >= amount)
  }

  return (
    <div className="bg-[#FFF6E9] p-4 rounded-lg backdrop-blur-sm border-2 border-[#FFC078] h-full overflow-auto">
      <h2 className="text-xl font-bold text-[#734739] mb-4">Build Structures</h2>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search buildings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border-2 border-[#FFC078] rounded-md bg-white text-[#734739]"
        />
      </div>

      {/* Building list */}
      <div className="space-y-3">
        {filteredBuildings.map((building) => (
          <div
            key={building.id}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all
              ${
                selectedBuilding?.id === building.id
                  ? "bg-[#FFC078]/30 border-[#FFC078]"
                  : "bg-white/50 border-[#FFC078]/30 hover:border-[#FFC078]"
              }`}
            onClick={() => setSelectedBuilding(building)}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-[#FFC078] flex items-center justify-center text-xl border-2 border-[#734739]">
                {building.icon}
              </div>
              <div className="font-medium text-[#734739]">{building.name}</div>
            </div>

            <p className="text-sm text-[#734739] mb-2">{building.description}</p>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {Object.entries(building.cost).map(([resource, amount]) => (
                  <div
                    key={resource}
                    className={`text-xs px-2 py-1 rounded-full flex items-center gap-1
                      ${resources[resource] >= amount ? "bg-[#74C480]/20 text-[#74C480]" : "bg-[#E36F6F]/20 text-[#E36F6F]"}`}
                  >
                    {resource === "wood" ? "🪵" : resource === "stone" ? "🪨" : "🔮"}
                    {amount}
                  </div>
                ))}
              </div>

              <div className="text-xs text-[#734739]">
                Size: {building.size === "xs" ? "Tiny" : building.size === "sm" ? "Small" : "Medium"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected building details */}
      {selectedBuilding && (
        <div className="mt-4 p-3 bg-[#FFC078]/20 rounded-lg border-2 border-[#FFC078]">
          <h3 className="font-bold text-[#734739] mb-2">Build {selectedBuilding.name}</h3>

          <p className="text-sm text-[#734739] mb-3">Select a grid cell on the map to place this building.</p>

          <Button
            className={`w-full ${
              canAfford(selectedBuilding)
                ? "bg-[#74C480] hover:bg-[#74C480]/80 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!canAfford(selectedBuilding)}
          >
            {canAfford(selectedBuilding) ? "Place Building" : "Not Enough Resources"}
          </Button>
        </div>
      )}
    </div>
  )
}

