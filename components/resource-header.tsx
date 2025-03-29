"use client"

import { useState } from "react"
import { useGameState } from "@/context/game-context"
import { Button } from "@/components/ui/button"
import ResourcePanel from "./resource-panel"

export default function ResourceHeader() {
  const { resources } = useGameState()
  const [showResourcePanel, setShowResourcePanel] = useState(false)

  // Primary resources to always show in the header
  const primaryResources = [
    { id: "hunny", name: "HUNNY", icon: "🏺" }, // Using pottery/jar emoji for HUNNY
    { id: "honey", name: "Honey", icon: "🍯" },
    { id: "wood", name: "Wood", icon: "🪵" },
    { id: "stone", name: "Stone", icon: "🪨" },
  ]

  return (
    <div className="relative">
      {/* Compact resource box */}
      <div
        className="bg-[#FFC078]/80 px-2 py-1 rounded-lg text-[#734739] font-bold flex items-center gap-2 border border-[#734739] cursor-pointer text-sm"
        onClick={() => setShowResourcePanel(!showResourcePanel)}
      >
        {primaryResources.map((resource) => (
          <div key={resource.id} className="flex items-center gap-1">
            <span>{resource.icon}</span>
            <span>{Math.floor(resources[resource.id])}</span>
          </div>
        ))}
        <span className="text-sm">📦</span>
      </div>

      {/* Resource panel dropdown */}
      {showResourcePanel && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 w-72 shadow-lg">
          <div className="bg-[#FFF6E9] rounded-lg border-2 border-[#734739] p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-[#734739]">Resources</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-[#734739]"
                onClick={() => setShowResourcePanel(false)}
              >
                ✕
              </Button>
            </div>
            <ResourcePanel compact={true} />
          </div>
        </div>
      )}
    </div>
  )
}
