"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useGameState } from "@/context/game-context"

export default function HoneyRefinery() {
  const { resources, upgrades, refineHoney } = useGameState()
  const [refining, setRefining] = useState(false)
  const [progress, setProgress] = useState(0)

  // Get the honey refinery upgrade
  const honeyRefinery = upgrades.find((u) => u.id === "honeyRefinery")
  const isUnlocked = honeyRefinery && honeyRefinery.purchased
  const refineryLevel = honeyRefinery ? honeyRefinery.level : 0
  const conversionRate = honeyRefinery ? honeyRefinery.effect.value * refineryLevel : 0
  const hunnyPerHoney = conversionRate * 10

  // Handle manual refining
  const handleRefine = () => {
    if (!isUnlocked || resources.honey < 1 || refining) return

    setRefining(true)
    setProgress(0)
  }

  // Progress animation for refining
  useEffect(() => {
    if (!refining) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setRefining(false)
          refineHoney()
          return 0
        }
        return prev + 5
      })
    }, 50)

    return () => clearInterval(interval)
  }, [refining, refineHoney])

  if (!isUnlocked) {
    return (
      <div className="bg-[#FFC078]/30 p-4 rounded-lg border border-[#FFC078] mb-4">
        <h3 className="font-bold text-[#734739] mb-2">Honey Refinery</h3>
        <p className="text-[#734739] text-sm mb-3">
          Purchase the Honey Refinery upgrade to convert honey into HUNNY currency.
        </p>
        <div className="bg-[#E36F6F]/20 p-2 rounded-lg">
          <p className="text-[#734739] text-sm">
            <span className="font-bold">HUNNY</span> is the main currency in Beartopia. You'll need it to purchase
            buildings, upgrades, and more!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FFC078]/30 p-4 rounded-lg border border-[#FFC078] mb-4">
      <h3 className="font-bold text-[#734739] mb-2">Honey Refinery</h3>
      <p className="text-[#734739] text-sm mb-3">
        Convert honey into valuable HUNNY currency. Each honey produces {hunnyPerHoney} HUNNY.
      </p>

      <div className="flex items-center justify-between mb-3">
        <div className="text-[#734739] text-sm">
          <span className="font-semibold">Available Honey:</span>
          <span className="ml-2">{Math.floor(resources.honey)}</span>
        </div>
        <div className="text-[#734739] text-sm">
          <span className="font-semibold">Conversion Rate:</span>
          <span className="ml-2">1 Honey → {hunnyPerHoney} HUNNY</span>
        </div>
      </div>

      {refining && (
        <div className="mb-3">
          <div className="text-[#734739] text-sm mb-1">Refining in progress...</div>
          <Progress value={progress} className="h-2 bg-[#FFC078]/30" indicatorClassName="bg-[#E36F6F]" />
        </div>
      )}

      <Button
        onClick={handleRefine}
        className="w-full bg-[#E36F6F] hover:bg-[#FF82AD] text-white border-2 border-white"
        disabled={resources.honey < 1 || refining}
      >
        {refining ? "Refining..." : "Refine 1 Honey"}
      </Button>

      <div className="mt-3 bg-[#E36F6F]/20 p-2 rounded-lg">
        <p className="text-[#734739] text-sm">
          <span className="font-bold">Tip:</span> Upgrade your Honey Refinery to get more HUNNY per honey!
        </p>
      </div>
    </div>
  )
}

