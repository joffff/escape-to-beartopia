"use client"
import { useGameState } from "@/context/game-context"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { useState } from "react"
import HoneyRefinery from "./honey-refinery"

interface ResourcePanelProps {
  compact?: boolean
}

export default function ResourcePanel({ compact = false }: ResourcePanelProps) {
  const { resources, passiveIncomeRate, playerStats } = useGameState()
  const [showAllResources, setShowAllResources] = useState(false)

  // Primary resources to always show
  const primaryResources = [
    { id: "hunny", name: "HUNNY", icon: "🍯", description: "The bear economy's currency" },
    { id: "honey", name: "Honey", icon: "🍯" },
    { id: "wood", name: "Wood", icon: "🪵" },
    { id: "stone", name: "Stone", icon: "🪨" },
    { id: "gold", name: "Gold", icon: "🪙" },
  ]

  // Secondary resources to show when expanded
  const secondaryResources = [
    {
      id: "redBerries",
      name: "Red Berries",
      icon: "🍓",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Red_Berry-xdxuFn8wU7nlzakMqYmhjqiFbqAKXM.webp",
      isPremium: true,
    },
    { id: "crystal", name: "Crystal", icon: "💎" },
    { id: "herbs", name: "Herbs", icon: "🌿" },
    { id: "flowers", name: "Flowers", icon: "🌸" },
    { id: "fish", name: "Fish", icon: "🐟" },
    { id: "mushrooms", name: "Mushrooms", icon: "🍄" },
    { id: "clay", name: "Clay", icon: "🧱" },
    { id: "feathers", name: "Feathers", icon: "🪶" },
    { id: "fur", name: "Fur", icon: "🦊" },
    { id: "seeds", name: "Seeds", icon: "🌱" },
    { id: "scrolls", name: "Scrolls", icon: "📜" },
  ]

  // Filter secondary resources to only show those with a value > 0
  const availableSecondaryResources = secondaryResources.filter(
    (resource) => resources[resource.id] > 0 || passiveIncomeRate[resource.id] > 0 || resource.isPremium,
  )

  if (compact) {
    return (
      <div className="space-y-2">
        {/* Primary resources */}
        {primaryResources.map((resource) => (
          <ResourceItem
            key={resource.id}
            icon={resource.icon}
            imageUrl={resource.imageUrl}
            name={resource.name}
            amount={resources[resource.id]}
            rate={passiveIncomeRate[resource.id]}
            compact={true}
            isPremium={resource.isPremium}
          />
        ))}

        {/* Toggle button for secondary resources */}
        {availableSecondaryResources.length > 0 && (
          <button
            onClick={() => setShowAllResources(!showAllResources)}
            className="w-full text-center text-xs text-[#734739] hover:text-[#E36F6F] underline py-1"
          >
            {showAllResources ? "Hide" : "More"} resources
          </button>
        )}

        {/* Secondary resources */}
        {showAllResources &&
          availableSecondaryResources.map((resource) => (
            <ResourceItem
              key={resource.id}
              icon={resource.icon}
              imageUrl={resource.imageUrl}
              name={resource.name}
              amount={resources[resource.id]}
              rate={passiveIncomeRate[resource.id]}
              compact={true}
              isPremium={resource.isPremium}
            />
          ))}

        {/* XP Progress */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-[#734739] mb-1">
            <span>XP</span>
            <span>
              {playerStats.xp}/{playerStats.xpToNextLevel}
            </span>
          </div>
          <Progress
            value={(playerStats.xp / playerStats.xpToNextLevel) * 100}
            className="h-1.5 bg-[#FFC078]/30"
            indicatorClassName="bg-[#E36F6F]"
          />
        </div>

        {/* Skill Points */}
        <div className="flex justify-between text-xs text-[#734739] mt-2">
          <span>Skill Points</span>
          <span className="font-bold">{playerStats.skillPoints}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FFF6E9] p-4 rounded-lg backdrop-blur-sm border-2 border-[#FFC078]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-[#734739]">Resources</h2>
        <div className="bg-[#FFC078] px-2 py-1 rounded-full text-[#734739] text-sm font-bold">
          Level {playerStats.level}
        </div>
      </div>

      {/* Add Honey Refinery component */}
      <HoneyRefinery />

      <div className="space-y-3">
        {/* Primary resources */}
        {primaryResources.map((resource) => (
          <ResourceItem
            key={resource.id}
            icon={resource.icon}
            imageUrl={resource.imageUrl}
            name={resource.name}
            amount={resources[resource.id]}
            rate={passiveIncomeRate[resource.id]}
            isPremium={resource.isPremium}
          />
        ))}

        {/* Toggle button for secondary resources */}
        {availableSecondaryResources.length > 0 && (
          <button
            onClick={() => setShowAllResources(!showAllResources)}
            className="w-full text-center text-sm text-[#734739] hover:text-[#E36F6F] underline py-1"
          >
            {showAllResources ? "Hide additional resources" : "Show all resources"}
          </button>
        )}

        {/* Secondary resources */}
        {showAllResources &&
          availableSecondaryResources.map((resource) => (
            <ResourceItem
              key={resource.id}
              icon={resource.icon}
              imageUrl={resource.imageUrl}
              name={resource.name}
              amount={resources[resource.id]}
              rate={passiveIncomeRate[resource.id]}
              isPremium={resource.isPremium}
            />
          ))}
      </div>

      {/* XP Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-[#734739] mb-1">
          <span>XP Progress</span>
          <span>
            {playerStats.xp}/{playerStats.xpToNextLevel}
          </span>
        </div>
        <Progress
          value={(playerStats.xp / playerStats.xpToNextLevel) * 100}
          className="h-2 bg-[#FFC078]/30"
          indicatorClassName="bg-[#E36F6F]"
        />
      </div>

      {/* Skill Points */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-[#734739] mb-1">
          <span>Skill Points</span>
          <span className="font-bold">{playerStats.skillPoints}</span>
        </div>
      </div>
    </div>
  )
}

interface ResourceItemProps {
  icon?: string
  imageUrl?: string
  name: string
  amount: number
  rate: number
  compact?: boolean
  isPremium?: boolean
}

function ResourceItem({ icon, imageUrl, name, amount, rate, compact = false, isPremium = false }: ResourceItemProps) {
  if (compact) {
    return (
      <div
        className={`flex items-center justify-between ${isPremium ? "bg-[#E36F6F]/30" : "bg-[#FFC078]/30"} p-1.5 rounded`}
      >
        <div className="flex items-center gap-1.5">
          {name === "HUNNY" ? (
            <div className="w-4 h-4 bg-[#FFC078] rounded-full flex items-center justify-center">
              <span className="text-[10px] text-[#734739]">🍯</span>
            </div>
          ) : imageUrl ? (
            <Image src={imageUrl || "/placeholder.svg"} alt={name} width={16} height={16} />
          ) : (
            <span className="text-sm">{icon}</span>
          )}
          <span className={`text-xs ${isPremium ? "text-[#E36F6F] font-bold" : "text-[#734739]"}`}>{name}</span>
          {isPremium && <span className="text-[8px] bg-[#E36F6F] text-white px-1 rounded">PREMIUM</span>}
        </div>
        <div className="text-right">
          <div className="text-[#734739] font-mono font-bold text-xs">{Math.floor(amount)}</div>
          <div className="text-[#74C480] text-[10px] font-mono">{rate > 0 ? `+${rate.toFixed(1)}/s` : ""}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-between ${isPremium ? "bg-[#E36F6F]/30" : "bg-[#FFC078]/30"} p-2 rounded`}
    >
      <div className="flex items-center gap-2">
        {name === "HUNNY" ? (
          <div className="w-6 h-6 bg-[#FFC078] rounded-full flex items-center justify-center">
            <span className="text-[#734739]">🍯</span>
          </div>
        ) : imageUrl ? (
          <Image src={imageUrl || "/placeholder.svg"} alt={name} width={24} height={24} />
        ) : (
          <span className="text-xl">{icon}</span>
        )}
        <div>
          <span className={`font-medium ${isPremium ? "text-[#E36F6F]" : "text-[#734739]"}`}>{name}</span>
          {isPremium && <span className="ml-2 text-xs bg-[#E36F6F] text-white px-1 rounded">PREMIUM</span>}
        </div>
      </div>
      <div className="text-right">
        <div className="text-[#734739] font-mono font-bold">{Math.floor(amount)}</div>
        <div className="text-[#74C480] text-xs font-mono">{rate > 0 ? `+${rate.toFixed(1)}/s` : ""}</div>
      </div>
    </div>
  )
}

