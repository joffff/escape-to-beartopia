"use client"

import { useGameState } from "@/context/game-context"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function UpgradePanel() {
  const { resources, upgrades, purchaseUpgrade } = useGameState()

  const canAffordUpgrade = (upgrade) => {
    const costMultiplier = upgrade.level + 1

    return Object.entries(upgrade.cost).every(([resource, baseAmount]) => {
      const amount = baseAmount * costMultiplier
      return resources[resource] >= amount
    })
  }

  const getUpgradeCost = (upgrade) => {
    const costMultiplier = upgrade.level + 1
    return Object.entries(upgrade.cost).map(([resource, baseAmount]) => {
      const amount = baseAmount * costMultiplier
      return {
        resource,
        amount,
      }
    })
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-[#734739] mb-4">Upgrade Shop</h2>

      <div className="space-y-4 pb-4">
        {upgrades
          .filter((u) => u.unlocked)
          .map((upgrade) => (
            <div key={upgrade.id} className="bg-[#FFC078]/30 p-4 rounded-lg border border-[#FFC078]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{upgrade.icon}</span>
                  <div>
                    <h3 className="font-bold text-[#734739]">{upgrade.name}</h3>
                    {upgrade.purchased && (
                      <span className="text-xs bg-[#FFC078] px-2 py-0.5 rounded text-[#734739]">
                        Lvl {upgrade.level}
                        {upgrade.maxLevel > 1 ? `/${upgrade.maxLevel}` : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[#734739] text-sm mb-3">{upgrade.description}</p>

              <div className="flex justify-between items-center mb-3">
                <div className="text-[#734739] text-sm">
                  <span className="font-semibold">Cost:</span>
                  <div className="flex gap-2 mt-1">
                    {getUpgradeCost(upgrade).map((cost, index) => (
                      <span
                        key={index}
                        className={`flex items-center gap-1 ${
                          resources[cost.resource] >= cost.amount ? "text-[#74C480]" : "text-[#E36F6F]"
                        }`}
                      >
                        {cost.resource === "redBerries" ? (
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Red_Berry-xdxuFn8wU7nlzakMqYmhjqiFbqAKXM.webp"
                            alt="Red Berry"
                            width={16}
                            height={16}
                          />
                        ) : cost.resource === "honey" ? (
                          "🍯"
                        ) : cost.resource === "hunny" ? (
                          <span className="text-[#FFC078] font-bold">🍯</span>
                        ) : cost.resource === "wood" ? (
                          "🪵"
                        ) : cost.resource === "stone" ? (
                          "🪨"
                        ) : cost.resource === "gold" ? (
                          "🪙"
                        ) : (
                          "🐾"
                        )}
                        {cost.amount}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => purchaseUpgrade(upgrade.id)}
                className="w-full bg-[#E36F6F] hover:bg-[#FF82AD] text-white border-2 border-white"
                disabled={!canAffordUpgrade(upgrade) || upgrade.level >= upgrade.maxLevel}
              >
                {upgrade.purchased ? "Upgrade" : "Purchase"}
              </Button>
            </div>
          ))}
      </div>
    </div>
  )
}

