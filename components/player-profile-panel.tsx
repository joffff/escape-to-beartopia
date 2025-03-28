"use client"

import { useGameState } from "@/context/game-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { useState } from "react"

export default function PlayerProfilePanel() {
  const { playerStats } = useGameState()
  const [activeTab, setActiveTab] = useState("appearance")

  // Placeholder equipment items
  const equipment = [
    { id: "head", name: "Head", icon: "👒", equipped: null },
    {
      id: "body",
      name: "Body",
      icon: "👕",
      equipped: { name: "Simple Tunic", rarity: "common", stats: { defense: 2 } },
    },
    { id: "hands", name: "Hands", icon: "🧤", equipped: null },
    { id: "feet", name: "Feet", icon: "👢", equipped: null },
    {
      id: "accessory",
      name: "Accessory",
      icon: "📿",
      equipped: { name: "Lucky Charm", rarity: "uncommon", stats: { luck: 5 } },
    },
    {
      id: "weapon",
      name: "Weapon",
      icon: "🪓",
      equipped: { name: "Wooden Axe", rarity: "common", stats: { attack: 3 } },
    },
  ]

  // Placeholder inventory items
  const inventory = [
    {
      id: "berry_hat",
      name: "Berry Hat",
      type: "head",
      icon: "🧢",
      rarity: "uncommon",
      stats: { defense: 3, berryFind: 5 },
    },
    {
      id: "honey_gloves",
      name: "Honey Gloves",
      type: "hands",
      icon: "🧤",
      rarity: "rare",
      stats: { defense: 4, honeyFind: 10 },
    },
    {
      id: "explorer_boots",
      name: "Explorer Boots",
      type: "feet",
      icon: "👢",
      rarity: "uncommon",
      stats: { defense: 2, speed: 5 },
    },
    { id: "stone_hammer", name: "Stone Hammer", type: "weapon", icon: "🔨", rarity: "common", stats: { attack: 5 } },
  ]

  // Placeholder achievements
  const achievements = [
    {
      id: "first_steps",
      name: "First Steps",
      description: "Begin your journey in Beartopia",
      completed: true,
      icon: "🐾",
    },
    { id: "berry_collector", name: "Berry Collector", description: "Collect 100 berries", completed: true, icon: "🍓" },
    {
      id: "builder",
      name: "Builder Bear",
      description: "Construct 5 buildings",
      completed: false,
      progress: 3,
      total: 5,
      icon: "🏗️",
    },
    {
      id: "honey_hunter",
      name: "Honey Hunter",
      description: "Collect 50 honey",
      completed: false,
      progress: 22,
      total: 50,
      icon: "🍯",
    },
    {
      id: "explorer",
      name: "Explorer",
      description: "Discover 10 new areas",
      completed: false,
      progress: 2,
      total: 10,
      icon: "🧭",
    },
  ]

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common":
        return "text-gray-600"
      case "uncommon":
        return "text-green-600"
      case "rare":
        return "text-blue-600"
      case "epic":
        return "text-purple-600"
      case "legendary":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4 pb-4">
        {/* Player avatar and basic info */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#734739]">
            <Image
              src="/images/BearishLogo.webp"
              alt="Player Avatar"
              width={64}
              height={64}
            />
          </div>
          <div>
            <h3 className="font-bold text-[#734739]">BearishPlayer</h3>
            <div className="text-sm text-[#734739]">Level {playerStats.level} Explorer</div>
            <div className="flex items-center mt-1">
              <div className="w-full">
                <Progress
                  value={(playerStats.xp / playerStats.xpToNextLevel) * 100}
                  className="h-1.5 bg-[#FFC078]/30"
                  indicatorClassName="bg-[#E36F6F]"
                />
                <div className="flex justify-between text-xs text-[#734739] mt-0.5">
                  <span>{playerStats.xp} XP</span>
                  <span>
                    {playerStats.xpToNextLevel - playerStats.xp} to level {playerStats.level + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#FFC078]">
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-3 py-1 text-sm ${activeTab === "appearance" ? "bg-[#FFC078] text-[#734739]" : "text-[#734739]"} rounded-t-lg`}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab("equipment")}
            className={`px-3 py-1 text-sm ${activeTab === "equipment" ? "bg-[#FFC078] text-[#734739]" : "text-[#734739]"} rounded-t-lg`}
          >
            Equipment
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-3 py-1 text-sm ${activeTab === "inventory" ? "bg-[#FFC078] text-[#734739]" : "text-[#734739]"} rounded-t-lg`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-3 py-1 text-sm ${activeTab === "achievements" ? "bg-[#FFC078] text-[#734739]" : "text-[#734739]"} rounded-t-lg`}
          >
            Achievements
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "appearance" && (
          <div className="p-2 bg-[#FFC078]/20 rounded-lg">
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 bg-[#FFC078]/50 rounded-lg flex items-center justify-center border-2 border-[#734739]">
                <Image
                  src="/images/BearishLogo.webp"
                  alt="Player Avatar"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" className="bg-[#E36F6F] text-white">
                Change Avatar
              </Button>
              <Button size="sm" className="bg-[#74C480] text-white">
                Customize
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-[#734739]">
              <p>More customization options will be available soon!</p>
            </div>
          </div>
        )}

        {activeTab === "equipment" && (
          <div className="space-y-2">
            {equipment.map((item) => (
              <div key={item.id} className="p-2 bg-[#FFC078]/20 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-[#734739] font-medium">{item.name}</div>
                    {item.equipped ? (
                      <div className={`text-xs ${getRarityColor(item.equipped.rarity)}`}>{item.equipped.name}</div>
                    ) : (
                      <div className="text-xs text-gray-500">Empty</div>
                    )}
                  </div>
                </div>
                <Button size="sm" className="bg-[#FFC078] text-[#734739] h-7 text-xs">
                  {item.equipped ? "Change" : "Equip"}
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="space-y-2">
            {inventory.map((item) => (
              <div key={item.id} className="p-2 bg-[#FFC078]/20 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className={`text-sm font-medium ${getRarityColor(item.rarity)}`}>{item.name}</div>
                    <div className="text-xs text-[#734739]">
                      {Object.entries(item.stats).map(([stat, value], index) => (
                        <span key={stat}>
                          {index > 0 && ", "}
                          {stat}: +{value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Button size="sm" className="bg-[#74C480] text-white h-7 text-xs">
                  Equip
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="p-2 bg-[#FFC078]/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-[#734739]">{achievement.name}</div>
                      {achievement.completed ? (
                        <span className="text-xs bg-[#74C480] text-white px-1 rounded">Completed</span>
                      ) : (
                        <span className="text-xs bg-[#FFC078] text-[#734739] px-1 rounded">In Progress</span>
                      )}
                    </div>
                    <div className="text-xs text-[#734739]">{achievement.description}</div>
                    {!achievement.completed && achievement.progress !== undefined && (
                      <div className="mt-1">
                        <Progress
                          value={(achievement.progress / achievement.total) * 100}
                          className="h-1.5 bg-[#FFC078]/30"
                          indicatorClassName="bg-[#74C480]"
                        />
                        <div className="text-xs text-right text-[#734739] mt-0.5">
                          {achievement.progress}/{achievement.total}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
