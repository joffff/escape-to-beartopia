"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useGameState } from "@/context/game-context"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GridCell {
  x: number
  y: number
  gridX: number
  gridY: number
  valid: boolean
  occupied: boolean
  objectType: string | null
  objectId: string | null
  objectData: any | null
}

interface GridPlacementSystemProps {
  backgroundImage?: string
  cellSize?: number
  onObjectInteraction?: (object: any) => void
  devMode?: boolean // For development and planning
}

export default function GridPlacementSystem({
  backgroundImage = "/images/bearish-den-map.webp",
  cellSize = 24, // Smaller cell size for finer grid
  onObjectInteraction,
  devMode = false,
}: GridPlacementSystemProps) {
  const { resources, buildings, purchaseBuilding, updateResources } = useGameState()
  const [gridCells, setGridCells] = useState<GridCell[]>([])
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 })
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null)
  const [placementMode, setPlacementMode] = useState(false)
  const [showBuildMenu, setShowBuildMenu] = useState(false)
  const [selectedObject, setSelectedObject] = useState<any>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showGrid, setShowGrid] = useState(devMode) // Show grid lines in dev mode
  const [validityEditMode, setValidityEditMode] = useState(false) // For marking valid/invalid areas
  const [currentEditAction, setCurrentEditAction] = useState<"mark-valid" | "mark-invalid">("mark-valid")
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const gridContainerRef = useRef<HTMLDivElement>(null)

  // Load and measure the map image
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      console.log("Map image loaded successfully:", img.width, "x", img.height)
      setMapDimensions({ width: img.width, height: img.height })
      setImageLoaded(true)
      initializeGrid(img.width, img.height)
    }
    img.onerror = (err) => {
      console.error("Error loading map image:", err)
      // Set default dimensions if image fails to load
      setMapDimensions({ width: 800, height: 600 })
      initializeGrid(800, 600)
    }
    img.src = backgroundImage
  }, [backgroundImage, cellSize])

  // Initialize the grid based on map dimensions
  const initializeGrid = (width: number, height: number) => {
    const columns = Math.ceil(width / cellSize)
    const rows = Math.ceil(height / cellSize)
    const newGrid: GridCell[] = []

    console.log(`Initializing grid with ${columns} columns and ${rows} rows`)

    for (let gridY = 0; gridY < rows; gridY++) {
      for (let gridX = 0; gridX < columns; gridX++) {
        const x = gridX * cellSize
        const y = gridY * cellSize

        // Default validity rule: bottom 70% of the map is valid
        const isValid = y > height * 0.3

        newGrid.push({
          x,
          y,
          gridX,
          gridY,
          valid: isValid,
          occupied: false,
          objectType: null,
          objectId: null,
          objectData: null,
        })
      }
    }

    setGridCells(newGrid)

    // Generate initial resources after a short delay
    setTimeout(() => {
      generateResources(15)
    }, 500)
  }

  // Generate resources in valid cells
  const generateResources = (count: number) => {
    // Find all valid and unoccupied cells
    const validCells = gridCells.filter((cell) => cell.valid && !cell.occupied)

    if (validCells.length === 0) {
      console.log("No valid cells available for resource generation")
      return 0
    }

    // Shuffle the valid cells to randomize placement
    const shuffledCells = [...validCells].sort(() => Math.random() - 0.5)

    // Resource types with their probabilities and data
    const resourceTypes = [
      { type: "berry", probability: 0.3, icon: "🍓", resource: "redBerries", amount: [1, 3] },
      { type: "honey", probability: 0.3, icon: "🍯", resource: "honey", amount: [1, 3] },
      { type: "wood", probability: 0.2, icon: "🪵", resource: "wood", amount: [2, 5] },
      { type: "stone", probability: 0.15, icon: "🪨", resource: "stone", amount: [1, 3] },
      { type: "gold", probability: 0.05, icon: "🪙", resource: "gold", amount: [1, 2] },
    ]

    let placedCount = 0
    const newGridCells = [...gridCells]

    // Place resources in the first 'count' valid cells
    for (let i = 0; i < Math.min(count, shuffledCells.length); i++) {
      const cell = shuffledCells[i]
      const cellIndex = newGridCells.findIndex((c) => c.gridX === cell.gridX && c.gridY === cell.gridY)

      if (cellIndex === -1) continue

      // Randomly select a resource type based on probabilities
      const rand = Math.random()
      let cumulativeProbability = 0
      let selectedType = resourceTypes[0]

      for (const type of resourceTypes) {
        cumulativeProbability += type.probability
        if (rand <= cumulativeProbability) {
          selectedType = type
          break
        }
      }

      // Random amount within the defined range
      const amount =
        Math.floor(Math.random() * (selectedType.amount[1] - selectedType.amount[0] + 1)) + selectedType.amount[0]

      // Create a unique ID for this resource
      const objectId = `resource_${selectedType.type}_${Date.now()}_${i}`

      // Update the cell
      newGridCells[cellIndex] = {
        ...newGridCells[cellIndex],
        occupied: true,
        objectType: "resource",
        objectId,
        objectData: {
          type: selectedType.type,
          icon: selectedType.icon,
          resource: selectedType.resource,
          amount,
        },
      }

      placedCount++
    }

    setGridCells(newGridCells)
    console.log(`Generated ${placedCount} resources`)
    return placedCount
  }

  // Handle cell click
  const handleCellClick = (cell: GridCell) => {
    // In validity edit mode, toggle the cell's validity
    if (validityEditMode) {
      setGridCells((prev) => {
        const newGrid = [...prev]
        const cellIndex = newGrid.findIndex((c) => c.gridX === cell.gridX && c.gridY === cell.gridY)

        if (cellIndex !== -1) {
          newGrid[cellIndex] = {
            ...newGrid[cellIndex],
            valid: currentEditAction === "mark-valid",
          }
        }

        return newGrid
      })
      return
    }

    // Normal mode - handle building placement or object selection
    if (placementMode && selectedBuilding && cell.valid && !cell.occupied) {
      // Place the building
      placeBuilding(cell, selectedBuilding)
      setPlacementMode(false)
      setSelectedBuilding(null)
    } else if (cell.occupied && cell.objectData) {
      // Handle clicking on an existing object
      setSelectedObject({
        ...cell.objectData,
        cellX: cell.gridX,
        cellY: cell.gridY,
        objectType: cell.objectType,
      })
    }
  }

  // Place a building on the grid
  const placeBuilding = (cell: GridCell, building: any) => {
    setGridCells((prev) => {
      const newGrid = [...prev]
      const cellIndex = newGrid.findIndex((c) => c.gridX === cell.gridX && c.gridY === cell.gridY)

      if (cellIndex !== -1) {
        // Create a unique ID for this building
        const objectId = `building_${building.id}_${Date.now()}`

        newGrid[cellIndex] = {
          ...newGrid[cellIndex],
          occupied: true,
          objectType: "building",
          objectId,
          objectData: {
            ...building,
            id: building.id,
            icon: building.icon,
          },
        }
      }

      return newGrid
    })

    // Call the game's purchaseBuilding function
    // This would deduct resources, etc.
    // purchaseBuilding(building.id)

    console.log(`Placed building ${building.name} at (${cell.gridX}, ${cell.gridY})`)
  }

  // Handle resource gathering
  const handleGatherResource = (object: any) => {
    if (!object || object.objectType !== "resource") return

    try {
      // Add resource to player's inventory
      const newResources = { ...resources }
      newResources[object.resource] += object.amount

      // Update resources
      updateResources(newResources)

      // Remove the resource from the grid
      setGridCells((prev) => {
        const newGrid = [...prev]
        const cellIndex = newGrid.findIndex((cell) => cell.gridX === object.cellX && cell.gridY === object.cellY)

        if (cellIndex !== -1) {
          newGrid[cellIndex] = {
            ...newGrid[cellIndex],
            occupied: false,
            objectType: null,
            objectId: null,
            objectData: null,
          }
        }

        return newGrid
      })

      // Clear selection
      setSelectedObject(null)

      console.log(`Gathered ${object.amount} ${object.resource}!`)
    } catch (error) {
      console.error("Error gathering resource:", error)
    }
  }

  // Close the selected object panel
  const closeObjectPanel = () => {
    setSelectedObject(null)
  }

  // Toggle build menu
  const toggleBuildMenu = () => {
    setShowBuildMenu(!showBuildMenu)
  }

  // Enter building placement mode
  const enterBuildingPlacementMode = (building: any) => {
    setSelectedBuilding(building)
    setPlacementMode(true)
    setShowBuildMenu(false)
  }

  // Toggle grid visibility
  const toggleGridVisibility = () => {
    setShowGrid(!showGrid)
  }

  // Toggle validity edit mode
  const toggleValidityEditMode = () => {
    setValidityEditMode(!validityEditMode)
    if (!validityEditMode) {
      setShowGrid(true) // Always show grid in edit mode
    }
  }

  // Export grid validity data
  const exportValidityData = () => {
    // Create a 2D array of validity data
    const columns = Math.ceil(mapDimensions.width / cellSize)
    const rows = Math.ceil(mapDimensions.height / cellSize)
    const validityMap: boolean[][] = Array(rows)
      .fill(null)
      .map(() => Array(columns).fill(false))

    gridCells.forEach((cell) => {
      if (cell.gridY < rows && cell.gridX < columns) {
        validityMap[cell.gridY][cell.gridX] = cell.valid
      }
    })

    // Convert to JSON and create a download link
    const dataStr = JSON.stringify(validityMap)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "grid-validity-map.json"
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Import grid validity data
  const importValidityData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const validityMap = JSON.parse(e.target?.result as string)

        setGridCells((prev) => {
          const newGrid = [...prev]

          newGrid.forEach((cell, index) => {
            if (cell.gridY < validityMap.length && cell.gridX < validityMap[0].length) {
              newGrid[index] = {
                ...cell,
                valid: validityMap[cell.gridY][cell.gridX],
              }
            }
          })

          return newGrid
        })

        console.log("Imported validity map successfully")
      } catch (error) {
        console.error("Error importing validity map:", error)
      }
    }
    reader.readAsText(file)
  }

  // Sample building types for the build menu
  const buildingTypes = [
    {
      id: "beehive",
      name: "Beehive",
      icon: "🐝",
      description: "Produces honey over time",
      cost: { hunny: 50, wood: 10 },
    },
    {
      id: "berryFarm",
      name: "Berry Farm",
      icon: "🍓",
      description: "Produces berries over time",
      cost: { hunny: 75, wood: 15 },
    },
    {
      id: "lumberMill",
      name: "Lumber Mill",
      icon: "🪵",
      description: "Processes wood more efficiently",
      cost: { hunny: 100, wood: 25, stone: 10 },
    },
    {
      id: "quarry",
      name: "Quarry",
      icon: "🪨",
      description: "Extracts stone resources",
      cost: { hunny: 120, wood: 20, stone: 5 },
    },
  ]

  // Regenerate resources periodically
  useEffect(() => {
    const MIN_RESOURCES = 10
    const RESOURCE_REGENERATION_INTERVAL = 30000 // 30 seconds

    const interval = setInterval(() => {
      const resourceCount = gridCells.filter((cell) => cell.occupied && cell.objectType === "resource").length

      // If we have fewer than MIN_RESOURCES, generate more
      if (resourceCount < MIN_RESOURCES) {
        generateResources(MIN_RESOURCES - resourceCount)
      }
    }, RESOURCE_REGENERATION_INTERVAL)

    return () => clearInterval(interval)
  }, [gridCells])

  return (
    <div className="relative w-full h-full overflow-hidden" ref={mapContainerRef}>
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: imageLoaded ? `url('${backgroundImage}')` : "none",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#74C480", // Fallback color
          width: mapDimensions.width,
          height: mapDimensions.height,
          margin: "0 auto", // Center horizontally
        }}
      >
        {/* Show loading indicator if image is not loaded */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-xl">Loading map...</div>
          </div>
        )}
      </div>

      {/* Grid overlay */}
      <div
        ref={gridContainerRef}
        className="absolute top-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: mapDimensions.width,
          height: mapDimensions.height,
          display: "grid",
          gridTemplateColumns: `repeat(${Math.ceil(mapDimensions.width / cellSize)}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${Math.ceil(mapDimensions.height / cellSize)}, ${cellSize}px)`,
        }}
      >
        {gridCells.map((cell, index) => (
          <div
            key={index}
            className={`
              ${cell.valid ? "cursor-pointer" : "cursor-not-allowed"}
              ${placementMode && cell.valid && !cell.occupied ? "bg-green-500/20" : ""}
              ${placementMode && (!cell.valid || cell.occupied) ? "bg-red-500/20" : ""}
              ${showGrid ? "border border-white/20" : ""}
              ${validityEditMode && cell.valid ? "bg-green-500/30" : ""}
              ${validityEditMode && !cell.valid ? "bg-red-500/30" : ""}
              relative
            `}
            onClick={() => handleCellClick(cell)}
          >
            {cell.occupied && cell.objectData && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  zIndex: 10,
                  fontSize: `${cellSize * 0.6}px`,
                }}
              >
                <div
                  className={`
                    rounded-full flex items-center justify-center
                    ${cell.objectType === "building" ? "bg-[#FFC078] border-[#734739]" : "bg-[#74C480] border-[#734739]"}
                  `}
                  style={{
                    width: `${cellSize * 0.8}px`,
                    height: `${cellSize * 0.8}px`,
                    border: "2px solid",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {cell.objectData.icon}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected object info */}
      {selectedObject && (
        <div className="absolute bottom-4 left-4 w-64 bg-[#FFF6E9]/90 backdrop-blur-sm border-2 border-[#734739] p-3 rounded-lg z-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                  ${selectedObject.objectType === "building" ? "bg-[#FFC078]" : "bg-[#74C480]"}`}
                style={{ border: "2px solid #734739" }}
              >
                {selectedObject.icon}
              </div>
              <div>
                <div className="font-medium text-[#734739]">{selectedObject.type || selectedObject.name}</div>
                <div className="text-xs text-[#734739] capitalize">{selectedObject.objectType}</div>
              </div>
            </div>
            <button
              onClick={closeObjectPanel}
              className="text-[#734739] hover:text-[#E36F6F] p-1 rounded-full hover:bg-[#FFC078]/30"
            >
              <X size={18} />
            </button>
          </div>

          {selectedObject.resource && (
            <div className="mb-3">
              <div className="text-sm text-[#734739]">
                Amount: <span className="font-bold">{selectedObject.amount}</span>
              </div>
            </div>
          )}

          {selectedObject.resource && (
            <button
              className="w-full bg-[#E36F6F] hover:bg-[#FF82AD] text-white font-bold py-2 px-4 rounded transition-colors border-2 border-white text-sm"
              onClick={() => handleGatherResource(selectedObject)}
            >
              Gather Resource
            </button>
          )}

          {selectedObject.objectType === "building" && (
            <button className="w-full bg-[#FFC078] hover:bg-[#FFC078]/80 text-[#734739] font-bold py-2 px-4 rounded transition-colors border-2 border-[#734739] text-sm">
              Enter Building
            </button>
          )}
        </div>
      )}

      {/* Build button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          className="bg-[#E36F6F] hover:bg-[#FF82AD] text-white font-bold py-1.5 px-3 rounded-full transition-colors border-2 border-white flex items-center gap-1 shadow-lg text-sm"
          onClick={toggleBuildMenu}
        >
          <span className="text-sm">🏗️</span>
          <span>Build</span>
        </button>
      </div>

      {/* Build menu */}
      {showBuildMenu && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 bg-[#FFF6E9]/95 backdrop-blur-sm border-2 border-[#734739] p-4 rounded-lg z-50 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#734739] text-lg">Build Structures</h3>
            <button
              className="text-[#734739] hover:text-[#E36F6F] p-1 rounded-full hover:bg-[#FFC078]/30"
              onClick={toggleBuildMenu}
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {buildingTypes.map((building) => (
              <div
                key={building.id}
                className="p-2 bg-white/50 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/80"
                onClick={() => enterBuildingPlacementMode(building)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFC078] flex items-center justify-center text-xl border-2 border-[#734739]">
                    {building.icon}
                  </div>
                  <div>
                    <div className="font-medium text-[#734739]">{building.name}</div>
                    <div className="text-xs text-[#734739]">
                      {Object.entries(building.cost).map(([resource, amount], index) => (
                        <span key={resource}>
                          {index > 0 && " • "}
                          {resource === "hunny" ? "🍯" : resource === "wood" ? "🪵" : "🪨"} {amount}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Button size="sm" className="bg-[#74C480]">
                  Place
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placement mode instructions */}
      {placementMode && selectedBuilding && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#FFF6E9]/90 backdrop-blur-sm border-2 border-[#734739] p-3 rounded-lg z-50">
          <div className="text-center">
            <div className="font-bold text-[#734739]">Placing: {selectedBuilding.name}</div>
            <div className="text-sm text-[#734739] mt-1">
              Click on a valid location (highlighted in green) to place your building
            </div>
            <button
              className="mt-2 bg-[#E36F6F] hover:bg-[#FF82AD] text-white font-bold py-1 px-2 rounded text-sm"
              onClick={() => {
                setPlacementMode(false)
                setSelectedBuilding(null)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Map info */}
      <div className="absolute top-4 left-4 bg-[#FFF6E9]/80 p-2 rounded-lg border-2 border-[#734739] z-50">
        <h4 className="font-bold text-[#734739] text-sm">Bear Village</h4>
        <div className="text-xs text-[#734739]">Your Home Base</div>
      </div>

      {/* Dev tools - only shown in dev mode */}
      {devMode && (
        <div className="absolute top-4 right-4 bg-[#FFF6E9]/90 p-2 rounded-lg border-2 border-[#734739] z-50">
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="outline" onClick={toggleGridVisibility} className="text-xs">
              {showGrid ? "Hide Grid" : "Show Grid"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={toggleValidityEditMode}
              className={`text-xs ${validityEditMode ? "bg-[#E36F6F] text-white" : ""}`}
            >
              {validityEditMode ? "Exit Edit Mode" : "Edit Valid Areas"}
            </Button>

            {validityEditMode && (
              <>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentEditAction("mark-valid")}
                    className={`text-xs flex-1 ${currentEditAction === "mark-valid" ? "bg-green-500 text-white" : ""}`}
                  >
                    Mark Valid
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentEditAction("mark-invalid")}
                    className={`text-xs flex-1 ${currentEditAction === "mark-invalid" ? "bg-red-500 text-white" : ""}`}
                  >
                    Mark Invalid
                  </Button>
                </div>

                <Button size="sm" variant="outline" onClick={exportValidityData} className="text-xs">
                  Export Validity Map
                </Button>

                <div className="flex items-center justify-center">
                  <label className="text-xs cursor-pointer bg-[#FFC078] hover:bg-[#FFC078]/80 text-[#734739] py-1 px-2 rounded text-center w-full">
                    Import Map
                    <input type="file" accept=".json" onChange={importValidityData} className="hidden" />
                  </label>
                </div>
              </>
            )}

            <Button size="sm" variant="outline" onClick={() => generateResources(5)} className="text-xs">
              Generate 5 Resources
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

