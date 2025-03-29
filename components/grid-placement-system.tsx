"use client"

import type React from "react"

import { useContext, useState, useEffect, useRef } from "react"
import { useGameState } from "@/context/game-context"
import { PlacementContext } from "@/context/placement-context"
import { X, ChevronUp, ChevronDown, GripVertical } from "lucide-react"
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
  tempHighlight?: boolean
}

interface GridPlacementSystemProps {
  backgroundImage?: string
  cellSize?: number
  onObjectInteraction?: (object: any) => void
  devMode?: boolean // For development and planning
  onReturnToLanding?: () => void // Function to return to landing page
  validityMap?: boolean[][] // Add validity map prop
}

export default function GridPlacementSystem({
  backgroundImage = "/images/bearish-den-map.webp",
  cellSize = 24, // Smaller cell size for finer grid
  onObjectInteraction,
  devMode = false,
  onReturnToLanding,
  validityMap, // Accept validity map as prop
}: GridPlacementSystemProps) {
  const { resources, buildings, updateResources } = useGameState()
  const placementContext = useContext(PlacementContext)

  // If there's a building to place from context, set it as selectedBuilding
  useEffect(() => {
    if (placementContext?.placementMode && placementContext?.buildingToPlace) {
      setSelectedBuilding(placementContext.buildingToPlace)
      setPlacementMode(true)
    }
  }, [placementContext?.placementMode, placementContext?.buildingToPlace])
  const [gridCells, setGridCells] = useState<GridCell[]>([])
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 })
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null)
  const [placementMode, setPlacementMode] = useState(false)
  const [showBuildMenu, setShowBuildMenu] = useState(false)
  const [selectedObject, setSelectedObject] = useState<any>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(devMode) // Show grid lines in dev mode
  const [validityEditMode, setValidityEditMode] = useState(false) // For marking valid/invalid areas
  const [currentEditAction, setCurrentEditAction] = useState<"mark-valid" | "mark-invalid">("mark-valid")
  const [devToolsCollapsed, setDevToolsCollapsed] = useState(false) // State for collapsible dev tools
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const gridContainerRef = useRef<HTMLDivElement>(null)

  // Track collected resources and their regeneration
  const [collectedResources, setCollectedResources] = useState<Record<string, number>>({})

  // Resource types with their probabilities and data
  const resourceTypes = [
    { type: "berry", probability: 0.1, icon: "🍓", resource: "redBerries", amount: [1, 2], regenerationTime: 300 }, // 5 minutes for berries (rare)
    { type: "honey", probability: 0.2, icon: "🍯", resource: "honey", amount: [1, 3], regenerationTime: 120 }, // 2 minutes
    { type: "hunny", probability: 0.15, icon: "🏺", resource: "hunny", amount: [5, 10], regenerationTime: 180 }, // 3 minutes for HUNNY currency
    { type: "wood", probability: 0.25, icon: "🪵", resource: "wood", amount: [2, 5], regenerationTime: 90 }, // 1.5 minutes
    { type: "stone", probability: 0.2, icon: "🪨", resource: "stone", amount: [1, 3], regenerationTime: 180 }, // 3 minutes
    { type: "gold", probability: 0.1, icon: "🪙", resource: "gold", amount: [1, 2], regenerationTime: 240 }, // 4 minutes
  ]

  // Load and measure the map image
  useEffect(() => {
    // Set default dimensions first to ensure the grid is created even if image fails
    const defaultWidth = window.innerWidth || 800
    const defaultHeight = window.innerHeight || 600

    // Initialize grid with default dimensions
    initializeGrid(defaultWidth, defaultHeight)

    // Try to load the image
    const loadImage = () => {
      console.log("Attempting to load map image from:", backgroundImage)

      // Skip image loading if no background image is provided
      if (!backgroundImage) {
        console.log("No background image provided, using default grid")
        setImageLoaded(false)
        setImageError("No image path provided")
        return
      }

      const img = new Image()

      img.onload = () => {
        console.log("Map image loaded successfully:", img.width, "x", img.height)
        setImageLoaded(true)
        setImageError(null)
        
        // Get container dimensions if available
        if (mapContainerRef.current) {
          const containerRect = mapContainerRef.current.getBoundingClientRect()
          const containerWidth = containerRect.width
          const containerHeight = containerRect.height
          console.log("Container dimensions:", containerWidth, "x", containerHeight)
          
          // Use container dimensions for the grid instead of image dimensions
          setMapDimensions({ width: containerWidth, height: containerHeight })
          initializeGrid(containerWidth, containerHeight)
        } else {
          // Fallback to image dimensions if container not available
          setMapDimensions({ width: img.width, height: img.height })
          initializeGrid(img.width, img.height)
        }
      }

      img.onerror = (err) => {
        console.error("Error loading map image:", backgroundImage, err)
        setImageError(`Failed to load image: ${backgroundImage}`)
        setImageLoaded(false)
      }

      // Set the image source directly
      img.src = backgroundImage
    }

    // Start loading the image
    loadImage()
  }, [backgroundImage])

  // Add this to the component, right after the image load effect
  useEffect(() => {
    if ((imageLoaded || imageError) && mapDimensions.width > 0) {
      console.log("Grid dimensions:", {
        width: mapDimensions.width,
        height: mapDimensions.height,
        columns: Math.ceil(mapDimensions.width / cellSize),
        rows: Math.ceil(mapDimensions.height / cellSize),
        cellSize,
      })

      // Check if the container is properly sized
      if (gridContainerRef.current) {
        const rect = gridContainerRef.current.getBoundingClientRect()
        console.log("Grid container size:", {
          width: rect.width,
          height: rect.height,
        })
      }
    }
  }, [imageLoaded, imageError, mapDimensions, cellSize])

  // Initialize the grid based on map dimensions
  const initializeGrid = (width: number, height: number) => {
    const columns = Math.ceil(width / cellSize)
    const rows = Math.ceil(height / cellSize)
    const newGrid: GridCell[] = []

    console.log(`Initializing grid with ${columns} columns and ${rows} rows`)

    // Calculate the spacing to distribute cells more evenly
    const xSpacing = width / columns
    const ySpacing = height / rows

    for (let gridY = 0; gridY < rows; gridY++) {
      for (let gridX = 0; gridX < columns; gridX++) {
        const x = gridX * xSpacing
        const y = gridY * ySpacing

        // Determine if the cell is valid based on the provided validity map
        let isValid = true

        // If we have a validity map and the coordinates are within its bounds, use it
        if (validityMap && gridY < validityMap.length && gridX < validityMap[0].length) {
          isValid = validityMap[gridY][gridX]
        } else {
          // Default fallback if no validity map or out of bounds
          // Make more of the map valid for building placement - 80% of the map is now valid
          // Only the very top (mountains/sky) is invalid
          isValid = y > height * 0.2
        }

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

    // Generate initial resources with a slight delay to ensure grid is ready
    setTimeout(() => {
      console.log("Generating initial resources")
      generateResources(20)
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
          objectId, // Make sure objectId is included in objectData
        },
      }

      placedCount++
    }

    setGridCells(newGridCells)
    console.log(`Generated ${placedCount} resources`)
    return placedCount
  }

  // Handle cell click
  // Update the handleCellClick function to ensure it properly selects objects
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
      console.log("Object selected:", cell.objectData)
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
            isImage: building.isImage || false, // Support for image icons
          },
        }
      }

      return newGrid
    })

    // Notify the placement context that placement is complete
    if (placementContext) {
      placementContext.completeBuildingPlacement()
    }

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

      // Track when this resource was collected for regeneration timer
      const objectId = object.objectId
      setCollectedResources((prev) => ({
        ...prev,
        [objectId]: Date.now(),
      }))

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

      // Show feedback using a toast or notification instead of console.log
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

  // Update the building types in the build menu
  const buildingTypes = [
    {
      id: "beehive",
      name: "Beehive",
      icon: "/images/beehive1.webp",
      isImage: true,
      description: "Produces honey over time",
      cost: { hunny: 50, wood: 10 },
    },
    {
      id: "lumberMill",
      name: "Lumber Mill",
      icon: "/images/sawmill1.webp",
      isImage: true,
      description: "Processes wood more efficiently",
      cost: { hunny: 100, wood: 25, stone: 10 },
    },
    {
      id: "berryFarm",
      name: "Berry Farm",
      icon: "🍓",
      description: "Produces berries over time",
      cost: { hunny: 75, wood: 15 },
    },
    {
      id: "quarry",
      name: "Quarry",
      icon: "🪨",
      description: "Extracts stone resources",
      cost: { hunny: 120, wood: 20, stone: 5 },
    },
  ]

  const MIN_RESOURCES = 15 // Increased from 12
  const REGENERATION_CHECK_INTERVAL = 5000 // Check every 5 seconds
  const initialResourcesGenerated = useRef(false)
  const currentResourceCounts = useRef<Record<string, number>>({})

  // Function to check and regenerate a single resource
  const checkAndRegenerateResource = (resourceId: string) => {
    // Find the resource type
    const resourceType = resourceId.split("_")[1] // Extract type from resource_type_timestamp_index
    const resourceConfig = resourceTypes.find((r) => r.type === resourceType)

    if (resourceConfig) {
      // Check if regeneration time has passed
      const regenerationTimeMs = resourceConfig.regenerationTime * 1000
      if (collectedResources[resourceId] && Date.now() - collectedResources[resourceId] >= regenerationTimeMs) {
        return true // Time to regenerate this resource
      }
    }
    return false
  }

  const [devToolsPosition, setDevToolsPosition] = useState({ x: 16, y: 16 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const devToolsRef = useRef<HTMLDivElement>(null)

  // Add these event handlers before the return statement
  const handleDragStart = (e: React.MouseEvent) => {
    if (devToolsRef.current) {
      setIsDragging(true)
      const rect = devToolsRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDrag = (e: MouseEvent) => {
    if (isDragging && devToolsRef.current) {
      const containerRect = mapContainerRef.current?.getBoundingClientRect()
      const devToolsRect = devToolsRef.current.getBoundingClientRect()

      if (containerRect) {
        // Calculate new position
        let newX = e.clientX - dragOffset.x - containerRect.left
        let newY = e.clientY - dragOffset.y - containerRect.top

        // Keep within bounds
        newX = Math.max(0, Math.min(newX, containerRect.width - devToolsRect.width))
        newY = Math.max(0, Math.min(newY, containerRect.height - devToolsRect.height))

        setDevToolsPosition({ x: newX, y: newY })
      }
    }
  }

  // Add this effect to handle mouse move and mouse up events
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag)
      window.addEventListener("mouseup", handleDragEnd)

      return () => {
        window.removeEventListener("mousemove", handleDrag)
        window.removeEventListener("mouseup", handleDragEnd)
      }
    }
  }, [isDragging])

  useEffect(() => {
    // Generate initial resources when the map first loads
    if (!initialResourcesGenerated.current && gridCells.length > 0) {
      console.log("Generating initial resources for den map")
      // Increase the initial number of resources to ensure visibility
      generateResources(20) // Generate more initial resources
      initialResourcesGenerated.current = true
    }

    const interval = setInterval(() => {
      // Reset current resource counts
      currentResourceCounts.current = {}

      // Count current resources by type
      gridCells.forEach((cell) => {
        if (cell.occupied && cell.objectType === "resource" && cell.objectData) {
          const resourceType = cell.objectData.type
          currentResourceCounts.current[resourceType] = (currentResourceCounts.current[resourceType] || 0) + 1
        }
      })

      // Calculate total resources on map
      const totalResources = Object.values(currentResourceCounts.current).reduce((sum, count) => sum + count, 0)
      console.log(`Current resources on map: ${totalResources}`)

      // If we have fewer than MIN_RESOURCES, generate more
      if (totalResources < MIN_RESOURCES) {
        // Calculate how many to generate based on how far below MIN_RESOURCES we are
        const toGenerate = Math.max(3, MIN_RESOURCES - totalResources)
        console.log(`Generating ${toGenerate} resources due to low count`)
        generateResources(toGenerate)
      }

      let regenerationNeeded = false

      // Use a for...in loop to iterate over the keys of collectedResources
      for (const resourceId in collectedResources) {
        if (checkAndRegenerateResource(resourceId)) {
          regenerationNeeded = true

          // Remove from collected resources
          setCollectedResources((prev) => {
            const updated = { ...prev }
            delete updated[resourceId]
            return updated
          })
        }
      }

      // If we need to regenerate, generate a few resources
      if (regenerationNeeded) {
        console.log(`Regenerating resources after collection`)
        generateResources(3) // Generate a few resources when regeneration is needed
      }
    }, REGENERATION_CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [gridCells, collectedResources])

  // Get object size in pixels based on type and size
  const getObjectSizeInPixels = (objectType: string, size?: string, objectId?: string) => {
    // Make buildings 2-3 times larger than resources, but make beehives smaller
    let multiplier = objectType === "building" ? 2.5 : 1

    // Check if this is a beehive and make it much larger than other buildings
    if (objectType === "building" && objectId && objectId.includes("beehive")) {
      multiplier = 5.0 // Make beehives 5x larger than resources (2x larger than other buildings)
    }

    switch (size) {
      case "xs":
        return 28 * multiplier // Was 24
      case "sm":
        return 36 * multiplier // Was 32
      case "md":
        return 52 * multiplier // Was 48
      case "lg":
        return 68 * multiplier // Was 64
      default:
        return 36 * multiplier // Was 32
    }
  }

  const [activeTab, setActiveTab] = useState("tasks")

  return (
    <div className="relative w-full h-full overflow-hidden" ref={mapContainerRef}>
      {/* Background image or fallback */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: imageLoaded ? `url('${backgroundImage}')` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#74C480", // Fallback color
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          margin: "0 auto", // Center horizontally
          overflow: "hidden",
        }}
      >
        {/* Show loading indicator if image is not loaded */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#74C480]/50 backdrop-blur-sm">
            <div className="bg-[#FFF6E9] p-4 rounded-lg border-2 border-[#734739] shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-[#E36F6F] border-t-transparent rounded-full animate-spin mb-2"></div>
                <div className="text-[#734739] font-bold">Loading map...</div>
              </div>
            </div>
          </div>
        )}

        {/* Show error message if image failed to load */}
        {imageError && !imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#FFF6E9] p-4 rounded-lg border-2 border-[#734739] shadow-lg max-w-md">
              <div className="flex flex-col items-center">
                <div className="text-[#734739] font-bold mb-2">Using default grid</div>
                <div className="text-[#734739] text-sm text-center">
                  The map image could not be loaded. A default grid is being used instead.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid overlay */}
      <div
        ref={gridContainerRef}
        className="absolute inset-0"
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${cellSize}px, 1fr))`,
          gridTemplateRows: `repeat(auto-fill, minmax(${cellSize}px, 1fr))`,
          overflow: "hidden",
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
              ${cell.tempHighlight ? "bg-green-500/50" : ""}
              relative
            `}
            onClick={() => handleCellClick(cell)}
          >
            {cell.occupied && cell.objectData && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  zIndex: 10,
                }}
              >
                {cell.objectData.isImage ? (
                  <img
                    src={cell.objectData.icon || "/placeholder.svg"}
                    alt={cell.objectData.name || "Object"}
                    className="object-contain"
                    style={{
                      width: `${getObjectSizeInPixels(cell.objectType || "", "sm", cell.objectId || "") * 0.9}px`,
                      height: `${getObjectSizeInPixels(cell.objectType || "", "sm", cell.objectId || "") * 0.9}px`,
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                      position: "absolute",
                      transform: "translate(-50%, -50%)",
                      left: "50%",
                      top: "50%",
                      zIndex: cell.objectType === "building" ? 20 : 10,
                    }}
                  />
                ) : (
                  <div
                    className={`
          rounded-full flex items-center justify-center
          ${cell.objectType === "building" ? "bg-[#FFC078] border-[#734739]" : "bg-[#74C480] border-[#734739]"}
        `}
                    style={{
                      width: `${getObjectSizeInPixels(cell.objectType || "", "sm", cell.objectId || "")}px`,
                      height: `${getObjectSizeInPixels(cell.objectType || "", "sm", cell.objectId || "")}px`,
                      border: "2px solid",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      fontSize: cell.objectType === "building" ? `${cellSize * 1.2}px` : `${cellSize * 0.6}px`,
                      position: "absolute",
                      transform: "translate(-50%, -50%)",
                      left: "50%",
                      top: "50%",
                      zIndex: cell.objectType === "building" ? 20 : 10,
                    }}
                  >
                    {cell.objectData.icon}
                  </div>
                )}
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
                {selectedObject.isImage ? (
                  <img
                    src={selectedObject.icon || "/placeholder.svg"}
                    alt={selectedObject.name || selectedObject.type}
                    className="w-7 h-7 object-contain"
                  />
                ) : (
                  selectedObject.icon
                )}
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
          <span className="text-sm">📋</span>
          <span>Tasks</span>
        </button>
      </div>

      {/* Build menu */}
      {showBuildMenu && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-96 bg-[#FFF6E9]/95 backdrop-blur-sm border-2 border-[#734739] p-4 pt-5 rounded-lg z-[100] shadow-xl">
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
              className={`flex-1 font-bold py-2 px-4 rounded-t-lg ${
                activeTab === "tasks"
                  ? "bg-[#FFC078] text-[#734739] border-b-2 border-[#734739]"
                  : "bg-[#FFF6E9] text-[#734739]"
              }`}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button>
            <button
              className={`flex-1 font-bold py-2 px-4 rounded-t-lg ${
                activeTab === "buildings"
                  ? "bg-[#FFC078] text-[#734739] border-b-2 border-[#734739]"
                  : "bg-[#FFF6E9] text-[#734739]"
              }`}
              onClick={() => setActiveTab("buildings")}
            >
              Buildings
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {/* Task buttons that link to different pages */}
            {activeTab === "tasks" && (
              <>
                <div
                  className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80"
                  onClick={() => {
                    if (placementContext?.setActiveContent) {
                      placementContext.setActiveContent("upgrades")
                    }
                    setShowBuildMenu(false)
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#E36F6F] flex items-center justify-center text-xl border-2 border-[#734739]">
                    🏺
                  </div>
                  <div>
                    <div className="font-medium text-[#734739]">Upgrade Honey Basket</div>
                    <div className="text-xs text-[#734739]">Boost your honey production</div>
                  </div>
                </div>

                <div
                  className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80"
                  onClick={() => {
                    if (placementContext?.setActiveContent) {
                      placementContext.setActiveContent("buildings")
                    }
                    setShowBuildMenu(false)
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#74C480] flex items-center justify-center text-xl border-2 border-[#734739]">
                    🏠
                  </div>
                  <div>
                    <div className="font-medium text-[#734739]">Build a Beehive</div>
                    <div className="text-xs text-[#734739]">Produces honey over time</div>
                  </div>
                </div>

                <div
                  className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80"
                  onClick={() => {
                    if (placementContext?.setActiveContent) {
                      placementContext.setActiveContent("quests")
                    }
                    setShowBuildMenu(false)
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFC078] flex items-center justify-center text-xl border-2 border-[#734739]">
                    📜
                  </div>
                  <div>
                    <div className="font-medium text-[#734739]">Honey Gathering Quest</div>
                    <div className="text-xs text-[#734739]">Collect honey for hungry cubs</div>
                  </div>
                </div>

                <div
                  className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80"
                  onClick={() => {
                    if (placementContext?.setActiveContent) {
                      placementContext.setActiveContent("skills")
                    }
                    setShowBuildMenu(false)
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#B080FF] flex items-center justify-center text-xl border-2 border-[#734739]">
                    🐾
                  </div>
                  <div>
                    <div className="font-medium text-[#734739]">Upgrade Paw Strength</div>
                    <div className="text-xs text-[#734739]">Increase honey per click</div>
                  </div>
                </div>

                <div
                  className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80"
                  onClick={() => {
                    if (placementContext?.setActiveContent) {
                      placementContext.setActiveContent("community")
                    }
                    setShowBuildMenu(false)
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#6FB5FF] flex items-center justify-center text-xl border-2 border-[#734739]">
                    🐻
                  </div>
                  <div>
                    <div className="font-medium text-[#734739]">Join Bear Alliance</div>
                    <div className="text-xs text-[#734739]">Connect with other bears</div>
                  </div>
                </div>
              </>
            )}

            {/* Building options */}
            {activeTab === "buildings" && (
              <div className="space-y-2">
                {buildingTypes.map((building) => (
                  <div
                    key={building.id}
                    className="p-2 bg-white/50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/80"
                    onClick={() => enterBuildingPlacementMode(building)}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FFC078] flex items-center justify-center border-2 border-[#734739]">
                      <img
                        src={building.icon || "/placeholder.svg"}
                        alt={building.name}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-[#734739]">{building.name}</div>
                      <div className="text-xs text-[#734739]">
                        {Object.entries(building.cost)
                          .map(([resource, amount]) => `${resource} ${amount}`)
                          .join(" • ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                if (placementContext) {
                  placementContext.cancelBuildingPlacement()
                }
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Map info - simplified version */}
      <div className="absolute top-4 left-4 bg-[#FFF6E9]/80 p-2 rounded-lg border-2 border-[#734739] z-50">
        <h4 className="font-bold text-[#734739] text-sm">Bear Village</h4>
        <div className="text-xs text-[#734739]">Your Home Base</div>
      </div>

      {/* Testing: Back to Landing button - smaller version */}
      {onReturnToLanding && (
        <div className="absolute top-4 right-4 bg-[#E36F6F]/90 p-1 rounded-lg border border-[#734739] z-50">
          <button onClick={onReturnToLanding} className="text-white text-xs hover:text-[#FFF6E9] flex items-center">
            <span>←</span>
            <span className="ml-1">Test</span>
          </button>
        </div>
      )}

      {/* Dev tools - draggable panel */}
      {devMode && (
        <div
          ref={devToolsRef}
          className="absolute bg-[#FFF6E9]/90 border-2 border-[#734739] rounded-lg z-50 shadow-lg"
          style={{
            top: `${devToolsPosition.y}px`,
            left: `${devToolsPosition.x}px`,
            maxWidth: "250px",
          }}
        >
          {/* Header with drag handle */}
          <div
            className="flex justify-between items-center p-2 cursor-move bg-[#FFC078]/50 select-none"
            onMouseDown={handleDragStart}
          >
            <div className="flex items-center gap-1">
              <GripVertical size={14} className="text-[#734739]" />
              <span className="font-bold text-xs text-[#734739]">Dev Tools (Drag Me)</span>
            </div>
            <div className="flex items-center">
              <button
                className="text-[#734739] p-1 hover:bg-[#FFC078]/80 rounded-full"
                onClick={() => setDevToolsCollapsed(!devToolsCollapsed)}
              >
                {devToolsCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            </div>
          </div>

          {/* Collapsible content */}
          {!devToolsCollapsed && (
            <div className="p-2 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
              <Button size="sm" variant="outline" onClick={toggleGridVisibility} className="text-xs">
                {showGrid ? "Hide Grid" : "Show Grid"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Temporarily show all valid areas
                  setGridCells((prev) => {
                    return prev.map((cell) => ({
                      ...cell,
                      tempHighlight: cell.valid,
                    }))
                  })
                  // Clear highlights after 3 seconds
                  setTimeout(() => {
                    setGridCells((prev) => {
                      return prev.map((cell) => ({
                        ...cell,
                        tempHighlight: false,
                      }))
                    })
                  }, 3000)
                }}
                className="text-xs"
              >
                Show Valid Areas
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

              <Button size="sm" variant="outline" onClick={() => generateResources(10)} className="text-xs">
                Generate 10 Resources
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
