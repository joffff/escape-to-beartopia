"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useGameState } from "@/context/game-context"
import Image from "next/image"

export default function QuestPanel() {
  const { quests, startQuest, completeQuest, resources } = useGameState()

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-[#734739] mb-4">Quests</h2>
      <div className="space-y-4 pb-4">
        {quests.available.map((quest) => (
          <div key={quest.id} className="bg-[#FFC078]/30 p-4 rounded-lg border border-[#FFC078]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-[#734739] text-lg">{quest.title}</h3>
              <span className="text-[#734739] text-sm bg-[#FFC078] px-2 py-0.5 rounded">{quest.difficulty}</span>
            </div>
            <p className="text-[#734739] mb-3">{quest.description}</p>

            <div className="flex justify-between items-center mb-3">
              <div className="text-[#734739]">
                <span className="font-semibold">Rewards:</span>
                <div className="flex gap-2 mt-1">
                  {quest.rewards.redBerries && quest.rewards.redBerries > 0 && (
                    <span className="text-[#734739] text-sm flex items-center gap-1">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Red_Berry-xdxuFn8wU7nlzakMqYmhjqiFbqAKXM.webp"
                        alt="Red Berry"
                        width={16}
                        height={16}
                      />
                      {quest.rewards.redBerries}
                    </span>
                  )}
                  {quest.rewards.hunny > 0 && (
                    <span className="text-[#734739] text-sm flex items-center gap-1">
                      <span className="text-[#FFC078] font-bold">🍯</span> {quest.rewards.hunny}
                    </span>
                  )}
                  {quest.rewards.honey > 0 && (
                    <span className="text-[#734739] text-sm flex items-center">🍯 {quest.rewards.honey}</span>
                  )}
                  {quest.rewards.paws > 0 && (
                    <span className="text-[#734739] text-sm flex items-center">🐾 {quest.rewards.paws}</span>
                  )}
                  {quest.rewards.gold > 0 && (
                    <span className="text-[#734739] text-sm flex items-center">🪙 {quest.rewards.gold}</span>
                  )}
                  {quest.rewards.xp > 0 && (
                    <span className="text-[#734739] text-sm flex items-center">✨ {quest.rewards.xp} XP</span>
                  )}
                </div>
              </div>

              <Button
                onClick={() => startQuest(quest.id)}
                className="bg-[#E36F6F] hover:bg-[#FF82AD] text-white border-2 border-white"
                disabled={quest.requiredResources.some((req) => resources[req.type] < req.amount)}
              >
                Start Quest
              </Button>
            </div>

            {quest.requiredResources.length > 0 && (
              <div className="text-sm text-[#734739]">
                <span className="font-semibold">Required:</span>
                <div className="flex gap-2 mt-1">
                  {quest.requiredResources.map((req, idx) => (
                    <span
                      key={idx}
                      className={`flex items-center gap-1 ${
                        resources[req.type] >= req.amount ? "text-[#74C480]" : "text-[#E36F6F]"
                      }`}
                    >
                      {req.type === "redBerries" ? (
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Red_Berry-xdxuFn8wU7nlzakMqYmhjqiFbqAKXM.webp"
                          alt="Red Berry"
                          width={16}
                          height={16}
                        />
                      ) : req.type === "hunny" ? (
                        <span className="text-[#FFC078] font-bold">🍯</span>
                      ) : req.type === "paws" ? (
                        "🐾"
                      ) : (
                        req.icon
                      )}
                      {req.amount}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {quests.active.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#734739] mb-3">Active Quests</h3>
            {quests.active.map((quest) => (
              <div key={quest.id} className="bg-[#FFC078]/30 p-4 rounded-lg mb-3 border border-[#FFC078]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[#734739]">{quest.title}</h3>
                  <span className="text-[#734739] text-sm">{Math.floor(quest.progress)}%</span>
                </div>
                <Progress
                  value={quest.progress}
                  className="h-2 mb-3 bg-[#FFC078]/30"
                  indicatorClassName="bg-[#74C480]"
                />
                <p className="text-[#734739] text-sm mb-2">{quest.status}</p>

                {quest.progress >= 100 && (
                  <Button
                    onClick={() => completeQuest(quest.id)}
                    className="w-full bg-[#74C480] hover:bg-[#74C480]/80 text-white border-2 border-white"
                  >
                    Complete Quest
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

