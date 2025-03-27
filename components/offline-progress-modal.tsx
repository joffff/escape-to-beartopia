"use client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface OfflineProgressModalProps {
  timeAway: number
  gains: Record<string, number>
  onClose: () => void
}

export default function OfflineProgressModal({ timeAway, gains, onClose }: OfflineProgressModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFF6E9] rounded-xl border-4 border-[#734739] p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#734739]">Welcome Back!</h2>
          <button
            onClick={onClose}
            className="text-[#734739] hover:text-[#E36F6F] p-1 rounded-full hover:bg-[#FFC078]/30"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-[#734739] mb-2">
            You were away for {Math.round(timeAway)} minutes. Your bears have been busy!
          </p>
          <p className="text-[#734739] text-sm italic">(Resources collected at 25% efficiency while away)</p>
        </div>

        <div className="bg-[#FFC078]/30 p-4 rounded-lg mb-4">
          <h3 className="font-bold text-[#734739] mb-2">Resources Collected:</h3>
          <div className="space-y-2">
            {Object.entries(gains).map(([resource, amount]) => (
              <div key={resource} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {resource === "honey" ? (
                    <span className="text-xl">🍯</span>
                  ) : resource === "hunny" ? (
                    <span className="text-xl text-[#FFC078] font-bold">🍯</span>
                  ) : resource === "wood" ? (
                    <span className="text-xl">🪵</span>
                  ) : resource === "stone" ? (
                    <span className="text-xl">🪨</span>
                  ) : resource === "gold" ? (
                    <span className="text-xl">🪙</span>
                  ) : (
                    <span className="text-xl">📦</span>
                  )}
                  <span className="text-[#734739] capitalize">{resource}</span>
                </div>
                <span className="text-[#734739] font-bold">+{Math.floor(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#E36F6F]/20 p-3 rounded-lg mb-4">
          <p className="text-[#734739] text-sm">
            <span className="font-bold">Note:</span> Red Berries are a premium resource and can only be earned through
            special quests or purchases.
          </p>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-[#E36F6F] hover:bg-[#FF82AD] text-white font-bold py-2 px-4 rounded transition-colors border-2 border-white"
        >
          Continue to Game
        </Button>
      </div>
    </div>
  )
}

