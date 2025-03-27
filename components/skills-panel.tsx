"use client"

import { useGameState } from "@/context/game-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function SkillsPanel() {
  const { skills, upgradeSkill, playerStats } = useGameState()

  // Filter skills to only show unlocked ones
  const unlockedSkills = skills.filter((skill) => skill.unlocked)

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4 pb-4">
        <div className="bg-[#FFC078]/30 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-[#734739] font-medium">Available Skill Points:</span>
            <span className="bg-[#B080FF] text-white px-2 py-1 rounded-md font-bold">{playerStats.skillPoints}</span>
          </div>
        </div>

        {unlockedSkills.map((skill) => (
          <div key={skill.id} className="bg-[#FFC078]/30 p-4 rounded-lg border border-[#FFC078]">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{skill.icon}</span>
                <div>
                  <h3 className="font-bold text-[#734739]">{skill.name}</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-xs bg-[#FFC078] px-2 py-0.5 rounded text-[#734739]">
                      Lvl {skill.level}/{skill.maxLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[#734739] text-sm mb-3">{skill.description}</p>

            <div className="mb-3">
              <Progress
                value={(skill.level / skill.maxLevel) * 100}
                className="h-2 bg-[#FFC078]/30"
                indicatorClassName="bg-[#B080FF]"
              />
            </div>

            <div className="flex justify-between items-center mb-3">
              <div className="text-[#734739] text-sm">
                <span className="font-semibold">Effect:</span>
                <div className="mt-1">
                  {skill.effect.type === "clickMultiplier" && (
                    <span>+{skill.effect.value * 100}% berries per click</span>
                  )}
                  {skill.effect.type === "foragingMultiplier" && (
                    <span>+{skill.effect.value * 100}% berry and herb production</span>
                  )}
                  {skill.effect.type === "woodcuttingMultiplier" && (
                    <span>+{skill.effect.value * 100}% wood production</span>
                  )}
                  {skill.effect.type === "miningMultiplier" && (
                    <span>+{skill.effect.value * 100}% stone and gold production</span>
                  )}
                  {skill.effect.type === "fishingMultiplier" && (
                    <span>+{skill.effect.value * 100}% fish production</span>
                  )}
                  {skill.effect.type === "craftingMultiplier" && (
                    <span>+{skill.effect.value * 100}% crafting efficiency</span>
                  )}
                  {skill.effect.type === "buildingCostReduction" && (
                    <span>-{skill.effect.value * 100}% building cost</span>
                  )}
                  {skill.effect.type === "cookingMultiplier" && (
                    <span>+{skill.effect.value * 100}% food effectiveness</span>
                  )}
                  {skill.effect.type === "alchemyMultiplier" && (
                    <span>+{skill.effect.value * 100}% potion effectiveness</span>
                  )}
                  {skill.effect.type === "leadershipMultiplier" && (
                    <span>+{skill.effect.value * 100}% worker efficiency</span>
                  )}
                  {skill.effect.type === "defenseMultiplier" && (
                    <span>+{skill.effect.value * 100}% defense strength</span>
                  )}
                  {skill.effect.type === "tradingMultiplier" && (
                    <span>+{skill.effect.value * 100}% better trade rates</span>
                  )}
                  {skill.effect.type === "explorationMultiplier" && (
                    <span>+{skill.effect.value * 100}% exploration efficiency</span>
                  )}
                  {skill.effect.type === "diplomacyMultiplier" && (
                    <span>+{skill.effect.value * 100}% alliance benefits</span>
                  )}
                  {skill.effect.type === "wisdomMultiplier" && (
                    <span>+{skill.effect.value * 100}% skill point gain</span>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={() => upgradeSkill(skill.id)}
              className="w-full bg-[#B080FF] hover:bg-[#B080FF]/80 text-white border-2 border-white"
              disabled={playerStats.skillPoints < 1 || skill.level >= skill.maxLevel}
            >
              {skill.level >= skill.maxLevel ? "Maxed Out" : `Upgrade (1 Skill Point)`}
            </Button>
          </div>
        ))}

        {unlockedSkills.length === 0 && (
          <div className="bg-[#FFC078]/30 p-4 rounded-lg text-center">
            <p className="text-[#734739]">No skills unlocked yet. Complete quests to earn skill points!</p>
          </div>
        )}
      </div>
    </div>
  )
}

