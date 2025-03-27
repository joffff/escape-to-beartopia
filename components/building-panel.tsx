"use client"

import { Button } from "@/components/ui/button"
import { useGameState } from "@/context/game-context"
import Image from "next/image"
import { useState } from "react"

export default function BuildingPanel() {
  const { resources, buildings, purchaseBuilding, upgrades, skills } = useGameState()
  const [activeCategory, setActiveCategory] = useState("basic")

  // Check if gold is unlocked
  const isGoldUnlocked = upgrades.some((u) => u.id === "goldProspecting" && u.purchased)

  // Basic buildings
  const basicBuildings = [
    {
      id: "beehive",
      name: "Beehive",
      icon: "🐝",
      description: "Produces honey over time",
      cost: { hunny: 50, wood: 10 },
      production: { honey: 0.1 },
      count: buildings.beehive,
    },
    {
      id: "lumberMill",
      name: "Lumber Mill",
      icon: "🪓",
      description: "Produces wood over time",
      cost: { hunny: 75, honey: 20 },
      production: { wood: 0.3 },
      count: buildings.lumberMill,
    },
    {
      id: "quarry",
      name: "Stone Quarry",
      icon: "⛏️",
      description: "Produces stone over time",
      cost: { hunny: 100, wood: 50 },
      production: { stone: 0.2 },
      count: buildings.quarry,
      requires: { lumberMill: 1 },
    },
    {
      id: "goldMine",
      name: "Gold Mine",
      icon: "🪙",
      description: "Produces gold over time",
      cost: { hunny: 150, stone: 75 },
      production: { gold: 0.05 },
      count: buildings.goldMine,
      requires: { quarry: 2 },
      locked: !isGoldUnlocked,
    },
    {
      id: "storehouse",
      name: "Storehouse",
      icon: "🏬",
      description: "Increase resource storage capacity",
      cost: { hunny: 150, wood: 200, stone: 100 },
      count: buildings.storehouse,
    },
    {
      id: "garden",
      name: "Garden",
      icon: "🌷",
      description: "Grow special plants with unique properties",
      cost: { hunny: 100, wood: 80, seeds: 20 },
      count: buildings.garden,
      production: { herbs: 0.1, flowers: 0.05, seeds: 0.02 },
    },
  ]

  // Advanced buildings
  const advancedBuildings = [
    {
      id: "forge",
      name: "Forge",
      icon: "🔥",
      description: "Merge resources into more powerful ones",
      cost: { hunny: 200, stone: 100, wood: 100 },
      count: buildings.forge,
      requires: { lumberMill: 2, quarry: 2 },
    },
    {
      id: "kitchen",
      name: "Kitchen",
      icon: "🍲",
      description: "Feed bear workers to increase productivity",
      cost: { hunny: 100, wood: 80, stone: 50 },
      count: buildings.kitchen,
    },
    {
      id: "armory",
      name: "Armory",
      icon: "🛡️",
      description: "Create tools and weapons for defense",
      cost: { hunny: 150, wood: 120, stone: 80 },
      count: buildings.armory,
      requires: { forge: 1 },
    },
    {
      id: "barracks",
      name: "Barracks",
      icon: "🏛️",
      description: "Train protector bears",
      cost: { hunny: 250, wood: 200, stone: 150 },
      count: buildings.barracks,
      requires: { armory: 1 },
    },
    {
      id: "university",
      name: "University",
      icon: "🎓",
      description: "Learn and upgrade skills",
      cost: { hunny: 300, wood: 250, stone: 200 },
      count: buildings.university,
      requires: { lumberMill: 3, quarry: 3 },
      production: { scrolls: 0.01 },
    },
    {
      id: "apothecary",
      name: "Apothecary",
      icon: "⚗️",
      description: "Create potions and medicines from herbs",
      cost: { hunny: 120, wood: 100, herbs: 50 },
      count: buildings.apothecary,
    },
  ]

  // Special buildings
  const specialBuildings = [
    {
      id: "observatory",
      name: "Observatory",
      icon: "🔭",
      description: "Discover new territories and resources",
      cost: { hunny: 400, stone: 300, crystal: 20 },
      count: buildings.observatory,
      requires: { university: 1 },
    },
    {
      id: "tradingPost",
      name: "Trading Post",
      icon: "🏪",
      description: "Exchange resources with other bear communities",
      cost: { hunny: 200, wood: 150, stone: 100 },
      count: buildings.tradingPost,
      requires: { lumberMill: 2, quarry: 1 },
    },
    {
      id: "workshop",
      name: "Workshop",
      icon: "🔧",
      description: "Create specialized tools for gathering",
      cost: { hunny: 180, wood: 150, stone: 80 },
      count: buildings.workshop,
      requires: { lumberMill: 2 },
    },
    {
      id: "shrine",
      name: "Shrine",
      icon: "🏮",
      description: "Provide passive bonuses to all bears",
      cost: { hunny: 250, stone: 200, crystal: 30 },
      count: buildings.shrine,
      requires: { university: 1 },
    },
    // Berry-related buildings moved to special category with much higher prices
    {
      id: "berryBush",
      name: "Berry Bush",
      icon: "🍓",
      description: "Premium building that produces rare red berries",
      cost: { hunny: 800, wood: 100, stone: 50, gold: 10 },
      production: { redBerries: 0.01 }, // Very low production rate
      count: buildings.berryBush,
      isPremium: true,
    },
    {
      id: "berryFarm",
      name: "Berry Farm",
      icon: "🍓",
      description: "Advanced premium building for red berry production",
      cost: { hunny: 2000, wood: 300, stone: 150, gold: 25, crystal: 5 },
      production: { redBerries: 0.03 }, // Still low but better than bush
      count: buildings.berryFarm,
      requires: { berryBush: 1 },
      isPremium: true,
    },
  ]

  const canAfford = (costs) => {
    return Object.entries(costs).every(([resource, amount]) => resources[resource] >= amount)
  }

  const meetsRequirements = (requirements) => {
    if (!requirements) return true
    return Object.entries(requirements).every(([building, amount]) => buildings[building] >= amount)
  }

  // Apply building skill cost reduction
  const getAdjustedCost = (originalCost) => {
    const buildingSkill = skills.find((s) => s.id === "building")
    if (!buildingSkill || buildingSkill.level === 0) return originalCost

    const reduction = buildingSkill.effect.value * buildingSkill.level
    const adjustedCost = {}

    Object.entries(originalCost).forEach(([resource, amount]) => {
      adjustedCost[resource] = Math.floor(amount * (1 - reduction))
    })

    return adjustedCost
  }

  // Get buildings based on active category
  const getActiveBuildings = () => {
    switch (activeCategory) {
      case "basic":
        return basicBuildings
      case "advanced":
        return advancedBuildings
      case "special":
        return specialBuildings
      default:
        return basicBuildings
    }
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-[#734739] mb-4">Buildings</h2>

      {/* Category tabs */}
      <div className="flex mb-4 border-b border-[#FFC078]">
        <button
          onClick={() => setActiveCategory("basic")}
          className={`px-4 py-2 ${activeCategory === "basic" ? "bg-[#FFC078] text-[#734739]" : "text-[#734739]"} rounded-t-lg`}
        >
          Basic
        </button>
        <button
          onClick={() => setActiveCategory("advanced")}
          className={`px-4 py-2 ${activeCategory === "advanced" ? "bg-[#FFC078] text-[#734739]" : "text-[#734739]"} rounded-t-lg`}
        >
          Advanced
        </button>
        <button
          onClick={() => setActiveCategory("special")}
          className={`px-4 py-2 ${activeCategory === "special" ? "bg-[#FFC078] text-[#734739]" : "text-[#734739]"} rounded-t-lg`}
        >
          Special
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {getActiveBuildings()
          .filter((building) => !building.locked)
          .map((building) => {
            const adjustedCost = getAdjustedCost(building.cost)

            return (
              <div
                key={building.id}
                className={`${building.isPremium ? "bg-[#E36F6F]/30 border-[#E36F6F]" : "bg-[#FFC078]/30 border-[#FFC078]"} p-4 rounded-lg border`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[#734739] flex items-center gap-2">
                    <span>{building.icon}</span>
                    <span>{building.name}</span>
                    {building.count > 0 && (
                      <span className="text-xs bg-[#FFC078] px-1 rounded ml-1 text-[#734739]">x{building.count}</span>
                    )}
                  </h3>
                  {building.isPremium && (
                    <span className="text-xs bg-[#E36F6F] text-white px-2 py-0.5 rounded">PREMIUM</span>
                  )}
                </div>
                <p className="text-[#734739] text-sm mb-3">{building.description}</p>

                {building.production && (
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-[#734739] text-sm">
                      <span className="font-semibold">Produces:</span>
                      <div className="flex gap-2 mt-1">
                        {Object.entries(building.production).map(([resource, rate]) => (
                          <span key={resource} className="flex items-center gap-1">
                            {resource === "redBerries" ? (
                              <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Red_Berry-xdxuFn8wU7nlzakMqYmhjqiFbqAKXM.webp"
                                alt="Red Berry"
                                width={16}
                                height={16}
                              />
                            ) : resource === "honey" ? (
                              "🍯"
                            ) : resource === "wood" ? (
                              "🪵"
                            ) : resource === "gold" ? (
                              "🪙"
                            ) : resource === "herbs" ? (
                              "🌿"
                            ) : resource === "flowers" ? (
                              "🌸"
                            ) : resource === "seeds" ? (
                              "🌱"
                            ) : resource === "scrolls" ? (
                              "📜"
                            ) : (
                              "🪨"
                            )}
                            {rate}/s
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-3">
                  <div className="text-[#734739] text-sm">
                    <span className="font-semibold">Cost:</span>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {Object.entries(adjustedCost).map(([resource, amount]) => (
                        <span
                          key={resource}
                          className={`flex items-center gap-1 ${
                            resources[resource] >= amount ? "text-[#74C480]" : "text-[#E36F6F]"
                          }`}
                        >
                          {resource === "redBerries" ? (
                            <Image
                              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Red_Berry-xdxuFn8wU7nlzakMqYmhjqiFbqAKXM.webp"
                              alt="Red Berry"
                              width={16}
                              height={16}
                            />
                          ) : resource === "honey" ? (
                            "🍯"
                          ) : resource === "hunny" ? (
                            <span className="text-[#FFC078] font-bold">🍯</span>
                          ) : resource === "wood" ? (
                            "🪵"
                          ) : resource === "stone" ? (
                            "🪨"
                          ) : resource === "gold" ? (
                            "🪙"
                          ) : resource === "crystal" ? (
                            "💎"
                          ) : resource === "herbs" ? (
                            "🌿"
                          ) : resource === "flowers" ? (
                            "🌸"
                          ) : resource === "seeds" ? (
                            "🌱"
                          ) : resource === "scrolls" ? (
                            "📜"
                          ) : resource === "mushrooms" ? (
                            "🍄"
                          ) : (
                            "🧱"
                          )}
                          {amount}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {building.requires && (
                  <div className="text-[#734739] text-sm mb-3">
                    <span className="font-semibold">Requires:</span>
                    <div className="flex gap-2 mt-1">
                      {Object.entries(building.requires).map(([req, amount]) => {
                        const reqBuilding = [...basicBuildings, ...advancedBuildings, ...specialBuildings].find(
                          (b) => b.id === req,
                        )
                        return (
                          <span
                            key={req}
                            className={`flex items-center ${
                              buildings[req] >= amount ? "text-[#74C480]" : "text-[#E36F6F]"
                            }`}
                          >
                            {reqBuilding?.icon} x{amount}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => purchaseBuilding(building.id)}
                  className={`w-full ${
                    building.isPremium ? "bg-[#E36F6F] hover:bg-[#FF82AD]" : "bg-[#74C480] hover:bg-[#74C480]/80"
                  } text-white border-2 border-white`}
                  disabled={!canAfford(adjustedCost) || !meetsRequirements(building.requires)}
                >
                  {canAfford(adjustedCost) && meetsRequirements(building.requires) ? "Purchase" : "Cannot Afford"}
                </Button>
              </div>
            )
          })}
      </div>
    </div>
  )
}

