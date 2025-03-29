"use client"

import { createContext, useState, type ReactNode } from "react"

interface BuildingToPlace {
  id: string
  name: string
  icon: string
  type: string
}

interface PlacementContextType {
  buildingToPlace: BuildingToPlace | null
  placementMode: boolean
  startBuildingPlacement: (building: BuildingToPlace) => void
  cancelBuildingPlacement: () => void
  completeBuildingPlacement: () => void
  setActiveView?: (view: string) => void
  setActiveContent?: (content: string) => void
}

export const PlacementContext = createContext<PlacementContextType | null>(null)

export function PlacementProvider({
  children,
  setActiveView,
  setActiveContent,
}: {
  children: ReactNode
  setActiveView?: (view: string) => void
  setActiveContent?: (content: string) => void
}) {
  const [buildingToPlace, setBuildingToPlace] = useState<BuildingToPlace | null>(null)
  const [placementMode, setPlacementMode] = useState(false)

  const startBuildingPlacement = (building: BuildingToPlace) => {
    setBuildingToPlace(building)
    setPlacementMode(true)
  }

  const cancelBuildingPlacement = () => {
    setBuildingToPlace(null)
    setPlacementMode(false)
  }

  const completeBuildingPlacement = () => {
    setBuildingToPlace(null)
    setPlacementMode(false)
  }

  return (
    <PlacementContext.Provider
      value={{
        buildingToPlace,
        placementMode,
        startBuildingPlacement,
        cancelBuildingPlacement,
        completeBuildingPlacement,
        setActiveView,
        setActiveContent,
      }}
    >
      {children}
    </PlacementContext.Provider>
  )
}
