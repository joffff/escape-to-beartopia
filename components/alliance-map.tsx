"use client"

import type React from "react"

import { useState, useEffect, useRef, Suspense } from "react"
import { useGameState } from "@/context/game-context"
import { X, Shield, Axe, Pickaxe, Users, RotateCcw, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import * as THREE from "three"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface MapLocation {
  id: number
  x: number
  y: number
  type: "alliance-member" | "other-alliance" | "quest" | "resource" | "competition" | "empty"
  name: string
  owner?: string
  ownerColor?: string
  icon: string | React.ReactNode
  description?: string
  forces?: {
    attack: number
    defense: number
    gathering: number
  }
  resources?: {
    type: string
    amount: number
    regenerationRate: number
  }
  linkTo?: string
}

interface AllianceMapProps {
  onReturnToLanding?: () => void
}

// Cell component for rendering individual map cells
function Cell({
  position,
  color,
  size = 1,
  height = 0.2,
  icon,
  selected = false,
  onClick,
  hovered = false,
  onPointerOver,
  onPointerOut,
  isInCentralArea = true, // Renamed from isOuterGrid to isInCentralArea and inverted logic
}: {
  position: [number, number, number]
  color: string
  size?: number
  height?: number
  icon?: string
  selected?: boolean
  onClick?: () => void
  hovered?: boolean
  onPointerOver?: () => void
  onPointerOut?: () => void
  isInCentralArea?: boolean
}) {
  // Convert hex color to Three.js color
  const threeColor = new THREE.Color(color)

  return (
    <group position={position}>
      {/* Base cell */}
      <mesh receiveShadow castShadow onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
        <boxGeometry args={[size, height, size]} />
        <meshStandardMaterial
          color={threeColor}
          metalness={0.1}
          roughness={0.8}
          emissive={hovered || selected ? threeColor : "#000000"}
          emissiveIntensity={hovered ? 0.3 : selected ? 0.5 : 0}
          transparent={!isInCentralArea}
          opacity={isInCentralArea ? 1 : 0.7} // Make outer cells semi-transparent but still visible
        />
      </mesh>

      {/* Selection indicator */}
      {selected && (
        <mesh position={[0, height / 2 + 0.05, 0]}>
          <boxGeometry args={[size + 0.2, 0.05, size + 0.2]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.7} />
        </mesh>
      )}

      {/* Icon - show for all cells, but make outer grid icons smaller */}
      {icon && (
        <Html position={[0, height + 0.2, 0]} center>
          <div className={`pointer-events-none ${isInCentralArea ? "text-2xl" : "text-xl opacity-80"}`}>{icon}</div>
        </Html>
      )}
    </group>
  )
}

// Update the CameraController component to prioritize panning over rotation
function CameraController({
  target = [500, 0, 500],
  initialPosition = [498, 15, 510], // Much closer to start zoomed in
  onCameraMove,
  onZoom,
  zoomLevel,
  forceUpdate,
  cameraMode = "isometric",
}: {
  target?: [number, number, number]
  initialPosition?: [number, number, number]
  onCameraMove?: (position: THREE.Vector3, target: THREE.Vector3) => void
  onZoom?: (zoom: number) => void
  zoomLevel?: number
  forceUpdate?: number
  cameraMode?: "isometric" | "orbit" | "top-down"
}) {
  const { camera, gl } = useThree()
  const controlsRef = useRef<any>()

  // Set up camera and controls
  useEffect(() => {
    if (controlsRef.current) {
      // Set target to user's den
      controlsRef.current.target.set(...target)

      // Set initial position based on camera mode
      if (cameraMode === "isometric") {
        // Isometric view - angled from side
        camera.position.set(target[0] - 10, 15, target[2] + 10)
      } else if (cameraMode === "top-down") {
        // Top-down view
        camera.position.set(target[0], 30, target[2])
      } else {
        // Default orbit view
        camera.position.set(...initialPosition)
      }

      camera.lookAt(...target)
      controlsRef.current.update()
    }
  }, [target, initialPosition, camera, cameraMode])

  // Handle external zoom commands
  useEffect(() => {
    if (controlsRef.current && zoomLevel !== undefined) {
      // Calculate new camera position based on zoom level
      const direction = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(...target)).normalize()

      // Set distance based on zoom level (lower number = closer zoom)
      const distance = zoomLevel

      // Position camera at the calculated distance
      camera.position.copy(new THREE.Vector3(...target).add(direction.multiplyScalar(distance)))

      controlsRef.current.update()
    }
  }, [zoomLevel, forceUpdate, camera, target])

  // Keep track of camera movement and enforce constraints
  useFrame(() => {
    if (controlsRef.current) {
      // Enforce constraints to keep main grid in view
      const minX = 450
      const maxX = 550
      const minZ = 450
      const maxZ = 550

      // Limit target (center of view) to ensure main grid stays visible
      controlsRef.current.target.x = Math.max(minX, Math.min(maxX, controlsRef.current.target.x))
      controlsRef.current.target.z = Math.max(minZ, Math.min(maxZ, controlsRef.current.target.z))

      // Update camera
      controlsRef.current.update()

      // Report camera position and zoom
      if (onCameraMove) {
        onCameraMove(camera.position.clone(), controlsRef.current.target.clone())
      }

      if (onZoom) {
        const distance = controlsRef.current.getDistance()
        onZoom(distance)
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.3} // Reduced rotation speed to make panning more dominant
      panSpeed={2.0} // Increased for better drag response
      zoomSpeed={1.5} // Increased for better zoom
      minDistance={10}
      maxDistance={300}
      maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below the ground
      minPolarAngle={0.1} // Prevent going directly overhead
      enableRotate={true} // Allow rotation
      enablePan={true} // Enable panning
      screenSpacePanning={true} // Use screen space panning for more intuitive controls
    />
  )
}

// Main map component
function AllianceMap3D({
  mapLocations,
  selectedLocation,
  onSelectLocation,
  hoveredLocation,
  onHoverLocation,
  onClearHover,
  onZoom,
  zoomLevel,
  forceUpdate,
  cameraMode,
}: {
  mapLocations: MapLocation[]
  selectedLocation: MapLocation | null
  onSelectLocation: (location: MapLocation) => void
  hoveredLocation: MapLocation | null
  onHoverLocation: (location: MapLocation) => void
  onClearHover: () => void
  onZoom: (zoom: number) => void
  zoomLevel: number
  forceUpdate: number
  cameraMode: string
}) {
  const [cameraInfo, setCameraInfo] = useState({ position: new THREE.Vector3(), target: new THREE.Vector3() })

  // Handle camera movement
  const handleCameraMove = (position: THREE.Vector3, target: THREE.Vector3) => {
    setCameraInfo({ position, target })
  }

  // Get cell color based on location type
  const getCellColor = (location: MapLocation) => {
    switch (location.type) {
      case "alliance-member":
        return location.ownerColor || "#FFC078"
      case "other-alliance":
        return location.ownerColor || "#E36F6F"
      case "quest":
        return "#B080FF"
      case "resource":
        return "#6FB5FF"
      case "competition":
        return "#FF82AD"
      default:
        return "#8BBF9F"
    }
  }

  // Find user's den for initial focus
  const userDen = mapLocations.find((loc) => loc.name === "Your Den")
  const targetPosition: [number, number, number] = userDen ? [userDen.x, 0, userDen.y] : [500, 0, 500]

  return (
    <>
      {/* Ground plane for the entire 2200x2200 grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1100, -0.1, 1100]} receiveShadow>
        <planeGeometry args={[2200, 2200]} />
        <meshStandardMaterial color="#8BBF9F" />
      </mesh>

      {/* Grid lines for the main 2000x2000 area */}
      <gridHelper args={[2000, 2000, "#FFFFFF", "#CCCCCC"]} position={[1100, 0, 1100]} />

      {/* Boundary indicator - semi-transparent border around main grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1100, 0.1, 1100]}>
        <ringGeometry args={[1000, 1005, 64]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.3} />
      </mesh>

      {/* Map cells */}
      {mapLocations.map((location) => {
        // Determine if this cell is in the central area (for visual distinction only)
        const isInCentralArea = location.x >= 450 && location.x <= 550 && location.y >= 450 && location.y <= 550
        const isOuterGrid = !isInCentralArea

        return (
          <Cell
            key={location.id}
            position={[location.x + 0.5, 0, location.y + 0.5]} // Add 0.5 offset to position items inside grid squares
            color={getCellColor(location)}
            icon={typeof location.icon === "string" ? location.icon : undefined}
            selected={selectedLocation?.id === location.id}
            hovered={hoveredLocation?.id === location.id}
            onClick={() => onSelectLocation(location)}
            onPointerOver={() => onHoverLocation(location)}
            onPointerOut={onClearHover}
            isInCentralArea={isInCentralArea}
          />
        )
      })}

      {/* Camera controller */}
      <CameraController
        target={targetPosition}
        onCameraMove={handleCameraMove}
        onZoom={onZoom}
        zoomLevel={zoomLevel}
        forceUpdate={forceUpdate}
        cameraMode={cameraMode as any}
      />

      {/* Ambient light */}
      <ambientLight intensity={0.5} />

      {/* Directional light with shadows */}
      <directionalLight
        position={[500, 100, 500]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={300}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />

      {/* Hemisphere light for better ambient lighting */}
      <hemisphereLight args={["#FFFFFF", "#8BBF9F", 0.6]} />
    </>
  )
}

export default function AllianceMap({ onReturnToLanding }: AllianceMapProps) {
  const { playerStats } = useGameState()
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<MapLocation | null>(null)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [showActionPanel, setShowActionPanel] = useState(false)
  const [actionType, setActionType] = useState<"attack" | "gather" | "defend" | null>(null)
  const [forcesToSend, setForcesToSend] = useState(1)
  const [availableForces, setAvailableForces] = useState({ attack: 10, defense: 15, gathering: 20 })
  const [zoom, setZoom] = useState(15) // Start with a much closer zoom (smaller number = closer)
  const [forceUpdate, setForceUpdate] = useState(0) // Used to force camera updates
  const [cameraMode, setCameraMode] = useState("isometric") // Default to isometric view
  const [showControls, setShowControls] = useState(false) // For showing control help
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Grid configuration - now 2200x2200 with gameplay in center 2000x2000
  const totalGridSize = 2200
  const playableGridSize = 2000
  const gridOffset = (totalGridSize - playableGridSize) / 2 // Center the playable grid

  // Generate map locations for the entire 1000x1000 grid
  const [mapLocations, setMapLocations] = useState<MapLocation[]>(() => {
    // Start with some predefined important locations in the center 100x100
    const baseLocations: MapLocation[] = [
      // Your alliance members - centered around the middle of the map
      {
        id: 1,
        x: 498,
        y: 498,
        type: "alliance-member",
        name: "Your Den",
        owner: "You",
        ownerColor: "#FFC078",
        icon: "🏠",
        description: "Your home base in Beartopia",
        forces: { attack: 5, defense: 10, gathering: 8 },
        linkTo: "/den",
      },
      {
        id: 2,
        x: 500,
        y: 498,
        type: "alliance-member",
        name: "HoneyBear's Den",
        owner: "HoneyBear",
        ownerColor: "#FFC078",
        icon: "🏕️",
        description: "Alliance member's den",
        forces: { attack: 3, defense: 7, gathering: 12 },
        linkTo: "/den/honeybear",
      },
      {
        id: 3,
        x: 498,
        y: 500,
        type: "alliance-member",
        name: "BerryKing's Den",
        owner: "BerryKing",
        ownerColor: "#FFC078",
        icon: "🏡",
        description: "Alliance member's den",
        forces: { attack: 8, defense: 4, gathering: 6 },
        linkTo: "/den/berryking",
      },
    ]

    // Generate additional locations
    const generatedLocations: MapLocation[] = []
    let idCounter = baseLocations.length + 1

    // Generate alliance territories in the playable area
    const allianceTerritories = [
      { name: "Berry Brigade", color: "#E36F6F", centerX: 475, centerY: 475, size: 10 },
      { name: "Forest Friends", color: "#74C480", centerX: 525, centerY: 475, size: 12 },
      { name: "Stone Sentinels", color: "#A66959", centerX: 475, centerY: 525, size: 15 },
      { name: "Crystal Clan", color: "#B080FF", centerX: 525, centerY: 525, size: 8 },
    ]

    allianceTerritories.forEach((territory) => {
      // Generate a cluster of territories for each alliance
      for (let i = 0; i < territory.size; i++) {
        // Random position within the alliance's territory
        const offsetX = Math.floor(Math.random() * 15) - 7
        const offsetY = Math.floor(Math.random() * 15) - 7
        const x = Math.max(450, Math.min(550, territory.centerX + offsetX))
        const y = Math.max(450, Math.min(550, territory.centerY + offsetY))

        // Check if position is already occupied
        if (
          !baseLocations.some((loc) => loc.x === x && loc.y === y) &&
          !generatedLocations.some((loc) => loc.x === x && loc.y === y)
        ) {
          generatedLocations.push({
            id: idCounter++,
            x,
            y,
            type: "other-alliance",
            name: `${territory.name} Territory`,
            owner: territory.name,
            ownerColor: territory.color,
            icon: ["🏰", "🏯", "🏕️", "🏘️", "🏚️"][Math.floor(Math.random() * 5)],
            description: `Territory controlled by the ${territory.name} alliance`,
            forces: {
              attack: 5 + Math.floor(Math.random() * 10),
              defense: 5 + Math.floor(Math.random() * 15),
              gathering: 5 + Math.floor(Math.random() * 10),
            },
          })
        }
      }
    })

    // Generate resource locations in the playable area
    const resourceTypes = [
      { type: "honey", name: "Honey Field", icon: "🍯", color: "#FFC078" },
      { type: "wood", name: "Forest", icon: "🌲", color: "#74C480" },
      { type: "stone", name: "Stone Quarry", icon: "🪨", color: "#A66959" },
      { type: "gold", name: "Gold Mine", icon: "🪙", color: "#FFD700" },
      { type: "crystal", name: "Crystal Cave", icon: "💎", color: "#B080FF" },
    ]

    // Add 50 resource locations in the playable area
    for (let i = 0; i < 50; i++) {
      const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)]
      const x = Math.floor(Math.random() * playableGridSize) + gridOffset
      const y = Math.floor(Math.random() * playableGridSize) + gridOffset

      // Check if position is already occupied
      if (
        !baseLocations.some((loc) => loc.x === x && loc.y === y) &&
        !generatedLocations.some((loc) => loc.x === x && loc.y === y)
      ) {
        generatedLocations.push({
          id: idCounter++,
          x,
          y,
          type: "resource",
          name: resourceType.name,
          icon: resourceType.icon,
          description: `${resourceType.name} with valuable resources`,
          resources: {
            type: resourceType.type,
            amount: 20 + Math.floor(Math.random() * 100),
            regenerationRate: 1 + Math.floor(Math.random() * 5),
          },
        })
      }
    }

    // Add quest and competition locations in the playable area
    const questTypes = [
      { name: "Ancient Ruins", icon: "🏛️" },
      { name: "Enchanted Forest", icon: "✨" },
      { name: "Dark Cave", icon: "🕳️" },
      { name: "Abandoned Mine", icon: "⛏️" },
      { name: "Sacred Grove", icon: "🌳" },
    ]

    // Add 20 quest locations
    for (let i = 0; i < 20; i++) {
      const questType = questTypes[Math.floor(Math.random() * questTypes.length)]
      const x = Math.floor(Math.random() * playableGridSize) + gridOffset
      const y = Math.floor(Math.random() * playableGridSize) + gridOffset

      // Check if position is already occupied
      if (
        !baseLocations.some((loc) => loc.x === x && loc.y === y) &&
        !generatedLocations.some((loc) => loc.x === x && loc.y === y)
      ) {
        generatedLocations.push({
          id: idCounter++,
          x,
          y,
          type: "quest",
          name: questType.name,
          icon: questType.icon,
          description: `Explore the ${questType.name.toLowerCase()} for treasures and adventures`,
        })
      }
    }

    // Add some locations in the outer grid (will be faded out)
    // These are just for visual effect to show the world extends beyond the playable area
    for (let i = 0; i < 200; i++) {
      // Generate positions outside the playable area
      let x, y
      do {
        x = Math.floor(Math.random() * totalGridSize)
        y = Math.floor(Math.random() * totalGridSize)
      } while (x >= 450 && x <= 550 && y >= 450 && y <= 550) // Ensure outside playable area

      const type = Math.random() > 0.7 ? "resource" : "empty"
      const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)]

      generatedLocations.push({
        id: idCounter++,
        x,
        y,
        type: type as any,
        name: type === "resource" ? resourceType.name : "Unexplored Territory",
        icon: type === "resource" ? resourceType.icon : "❓",
        description: "This area is beyond the current exploration range",
      })
    }

    return [...baseLocations, ...generatedLocations]
  })

  // Handle location selection
  const handleLocationSelect = (location: MapLocation) => {
    setSelectedLocation(location)
    setShowInfoPanel(true)
    setShowActionPanel(false)
    setActionType(null)
  }

  // Handle location hover
  const handleLocationHover = (location: MapLocation) => {
    setHoveredLocation(location)
  }

  // Clear hover state
  const clearHover = () => {
    setHoveredLocation(null)
  }

  // Close the info panel
  const closeInfoPanel = () => {
    setShowInfoPanel(false)
    setSelectedLocation(null)
  }

  // Show action panel for sending forces
  const showSendForces = (type: "attack" | "gather" | "defend") => {
    setActionType(type)
    setShowActionPanel(true)
    setForcesToSend(1)
  }

  // Handle sending forces
  const handleSendForces = () => {
    if (!selectedLocation || !actionType) return

    // Update available forces
    setAvailableForces((prev) => ({
      ...prev,
      [actionType]: prev[actionType] - forcesToSend,
    }))

    // In a real implementation, we would update the game state here
    // For now, just show a message
    alert(`Sent ${forcesToSend} ${actionType} forces to ${selectedLocation.name}`)

    setShowActionPanel(false)
    setActionType(null)
  }

  // Get cell color based on location type
  const getCellColor = (location: MapLocation | null) => {
    if (!location) return "#8BBF9F" // Default green background

    switch (location.type) {
      case "alliance-member":
        return location.ownerColor || "#FFC078"
      case "other-alliance":
        return location.ownerColor || "#E36F6F"
      case "quest":
        return "#B080FF"
      case "resource":
        return "#6FB5FF"
      case "competition":
        return "#FF82AD"
      default:
        return "#8BBF9F"
    }
  }

  // Get icon for location
  const getLocationIcon = (location: MapLocation) => {
    if (typeof location.icon === "string") {
      return <span className="text-2xl">{location.icon}</span>
    }
    return location.icon
  }

  // Center on player's den
  const centerOnPlayerDen = () => {
    const userDen = mapLocations.find((loc) => loc.name === "Your Den")
    if (userDen) {
      setZoom(15) // Zoom in close
      // Force update to center on den without changing camera mode
      setForceUpdate((f) => f + 1)
    }
  }

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 5, 10)
      setForceUpdate((f) => f + 1) // Force camera update
      return newZoom
    })
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.min(prev + 5, 200)
      setForceUpdate((f) => f + 1) // Force camera update
      return newZoom
    })
  }

  // Handle zoom from camera
  const handleCameraZoom = (distance: number) => {
    setZoom(distance)
  }

  // Toggle controls help
  const toggleControlsHelp = () => {
    setShowControls((prev) => !prev)
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#8BBF9F]">
      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [498, 15, 510], fov: 50 }} // Start zoomed in on user's den
        style={{ background: "linear-gradient(to bottom, #87CEEB, #E0F7FA)" }}
      >
        <Suspense fallback={null}>
          <AllianceMap3D
            mapLocations={mapLocations}
            selectedLocation={selectedLocation}
            onSelectLocation={handleLocationSelect}
            hoveredLocation={hoveredLocation}
            onHoverLocation={handleLocationHover}
            onClearHover={clearHover}
            onZoom={handleCameraZoom}
            zoomLevel={zoom}
            forceUpdate={forceUpdate}
            cameraMode={cameraMode}
          />
        </Suspense>
      </Canvas>

      {/* Simplified Map Controls - Just zoom and center */}
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-[#FFF6E9]/80 p-3 rounded-lg border-2 border-[#734739] z-50 flex flex-col gap-4">
        <Button
          size="lg"
          variant="outline"
          onClick={handleZoomIn}
          className="h-16 w-16 p-0 flex items-center justify-center text-2xl bg-[#74C480] hover:bg-[#74C480]/80 text-white border-2 border-white"
          title="Zoom in"
        >
          <Plus size={32} />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleZoomOut}
          className="h-16 w-16 p-0 flex items-center justify-center text-2xl bg-[#E36F6F] hover:bg-[#E36F6F]/80 text-white border-2 border-white"
          title="Zoom out"
        >
          <Minus size={32} />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={centerOnPlayerDen}
          className="h-16 w-16 p-0 flex items-center justify-center text-2xl bg-[#FFC078] hover:bg-[#FFC078]/80 text-[#734739] border-2 border-[#734739]"
          title="Change camera view"
        >
          <RotateCcw size={32} />
        </Button>
      </div>

      {/* Map title - simplified */}
      <div className="absolute top-4 left-4 bg-[#FFF6E9]/80 p-2 rounded-lg border-2 border-[#734739] z-50">
        <h4 className="font-bold text-[#734739]">Alliance Map</h4>
      </div>

      {/* Selected location info panel */}
      {showInfoPanel && selectedLocation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-[#FFF6E9]/95 backdrop-blur-sm border-2 border-[#734739] p-4 rounded-lg z-[100] shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: getCellColor(selectedLocation), border: "2px solid #734739" }}
              >
                {getLocationIcon(selectedLocation)}
              </div>
              <div>
                <h3 className="font-bold text-[#734739]">{selectedLocation.name}</h3>
                {selectedLocation.owner && (
                  <div className="text-xs text-[#734739]">Owned by: {selectedLocation.owner}</div>
                )}
              </div>
            </div>
            <button
              onClick={closeInfoPanel}
              className="text-[#734739] hover:text-[#E36F6F] p-1 rounded-full hover:bg-[#FFC078]/30"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-[#734739] mb-4">{selectedLocation.description}</p>

          {/* Location details based on type */}
          {selectedLocation.type === "resource" && selectedLocation.resources && (
            <div className="mb-4 p-2 bg-[#FFC078]/30 rounded-lg">
              <div className="text-sm text-[#734739] flex justify-between">
                <span>Resource: {selectedLocation.resources.type}</span>
                <span>Amount: {selectedLocation.resources.amount}</span>
              </div>
            </div>
          )}

          {/* Action buttons based on location type */}
          <div className="flex gap-2">
            {selectedLocation.type === "other-alliance" && (
              <Button
                onClick={() => showSendForces("attack")}
                className="flex-1 bg-[#E36F6F] hover:bg-[#E36F6F]/80 text-white"
                disabled={availableForces.attack <= 0}
              >
                <Axe size={16} className="mr-1" /> Attack
              </Button>
            )}

            {selectedLocation.type === "alliance-member" && (
              <Button
                onClick={() => showSendForces("defend")}
                className="flex-1 bg-[#74C480] hover:bg-[#74C480]/80 text-white"
                disabled={availableForces.defense <= 0}
              >
                <Shield size={16} className="mr-1" /> Defend
              </Button>
            )}

            {selectedLocation.type === "resource" && (
              <Button
                onClick={() => showSendForces("gather")}
                className="flex-1 bg-[#6FB5FF] hover:bg-[#6FB5FF]/80 text-white"
                disabled={availableForces.gathering <= 0}
              >
                <Pickaxe size={16} className="mr-1" /> Gather
              </Button>
            )}

            {selectedLocation.type === "quest" && (
              <Button className="flex-1 bg-[#B080FF] hover:bg-[#B080FF]/80 text-white">Start Quest</Button>
            )}
          </div>

          {/* Send forces panel */}
          {showActionPanel && actionType && (
            <div className="mt-4 p-2 bg-[#FFF6E9] border border-[#734739] rounded-lg">
              <h4 className="font-bold text-[#734739] text-sm mb-2">
                {actionType === "attack"
                  ? "Send Attack Forces"
                  : actionType === "defend"
                    ? "Send Defense Forces"
                    : "Send Gathering Forces"}
              </h4>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#734739]">Available: {availableForces[actionType]}</span>
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setForcesToSend(Math.max(1, forcesToSend - 1))}
                    disabled={forcesToSend <= 1}
                    className="h-7 w-7 p-0"
                  >
                    -
                  </Button>
                  <span className="mx-2 text-sm font-bold">{forcesToSend}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setForcesToSend(Math.min(availableForces[actionType], forcesToSend + 1))}
                    disabled={forcesToSend >= availableForces[actionType]}
                    className="h-7 w-7 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button onClick={handleSendForces} className="w-full bg-[#74C480] hover:bg-[#74C480]/80 text-white">
                Send Forces
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Available forces - simplified */}
      <div className="absolute bottom-4 right-4 bg-[#FFF6E9]/80 p-2 rounded-lg border-2 border-[#734739] z-50">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center">
            <Axe size={12} className="mr-1 text-[#E36F6F]" />
            <span className="font-bold">{availableForces.attack}</span>
          </div>
          <div className="flex items-center">
            <Shield size={12} className="mr-1 text-[#74C480]" />
            <span className="font-bold">{availableForces.defense}</span>
          </div>
          <div className="flex items-center">
            <Pickaxe size={12} className="mr-1 text-[#6FB5FF]" />
            <span className="font-bold">{availableForces.gathering}</span>
          </div>
        </div>
      </div>

      {/* Alliance info - simplified */}
      <div className="absolute bottom-4 left-4 bg-[#FFF6E9]/80 p-2 rounded-lg border-2 border-[#734739] z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFC078] flex items-center justify-center border-2 border-[#734739]">
            <Users size={16} />
          </div>
          <div>
            <h4 className="font-bold text-[#734739] text-sm">Honey Hunters</h4>
          </div>
        </div>
      </div>

      {/* Map controls help */}
      <div
        className="absolute top-16 left-4 bg-[#FFF6E9]/80 p-2 rounded-lg border border-[#734739] z-50 cursor-pointer"
        onClick={toggleControlsHelp}
      >
        <div className="text-xs text-[#734739]">Click and drag to move • Use scrollbars to navigate</div>

        {showControls && (
          <div className="mt-2 text-xs text-[#734739] bg-[#FFF6E9] p-2 rounded">
            <p className="font-bold mb-1">Map Controls:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Click and drag to pan around the map</li>
              <li>Use scrollbars at bottom and right to navigate</li>
              <li>Use + button to zoom in closer</li>
              <li>Use - button to zoom out</li>
              <li>Use ↻ button to center on your den</li>
              <li>Click on locations to view details</li>
            </ul>
          </div>
        )}
      </div>

      {/* Testing: Back to Landing button */}
      {onReturnToLanding && (
        <div className="absolute top-4 right-4 bg-[#E36F6F]/90 p-1 rounded-lg border border-[#734739] z-50">
          <button onClick={onReturnToLanding} className="text-white text-xs hover:text-[#FFF6E9] flex items-center">
            <span>←</span>
            <span className="ml-1">Test</span>
          </button>
        </div>
      )}

      {/* Loading overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
        <div className="text-[#734739] text-sm">
          {!canvasRef.current && (
            <div className="bg-[#FFF6E9]/80 p-4 rounded-lg border-2 border-[#734739]">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-[#E36F6F] border-t-transparent rounded-full animate-spin mb-2"></div>
                <div>Loading 3D map...</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

