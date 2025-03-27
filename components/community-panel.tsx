"use client"

import { useGameState } from "@/context/game-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

export default function CommunityPanel() {
  const { playerStats } = useGameState()

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4 pb-4">
        <div className="bg-[#FFC078]/30 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-[#734739] mb-2">Bear Community</h3>
          <p className="text-[#734739] mb-4">
            Connect with other bears and form alliances to build Beartopia together.
          </p>

          {playerStats.allianceUnlocked ? (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BearishLogo-Byu3rXUZxziBlHv1DUdkCofs2emyI4.webp"
                  alt="Bearish Logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <h3 className="text-xl font-bold text-[#734739]">Bear Alliance</h3>
              </div>
              <p className="text-[#734739] mb-4">
                Join forces with other bears to build larger structures and unlock special community rewards.
              </p>
              <Button className="w-full bg-[#E36F6F] hover:bg-[#FF82AD] text-white font-bold py-2 px-4 rounded transition-colors border-2 border-white">
                Find Alliance
              </Button>

              <div className="mt-4 p-3 bg-[#FFC078]/50 rounded-lg">
                <h4 className="font-bold text-[#734739] mb-2">Available Alliances</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-white/50 rounded flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#734739]">Honey Hunters</span>
                      <p className="text-xs text-[#734739]">Members: 12/20</p>
                    </div>
                    <Button size="sm" className="bg-[#74C480]">
                      Join
                    </Button>
                  </div>
                  <div className="p-2 bg-white/50 rounded flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#734739]">Berry Brigade</span>
                      <p className="text-xs text-[#734739]">Members: 8/15</p>
                    </div>
                    <Button size="sm" className="bg-[#74C480]">
                      Join
                    </Button>
                  </div>
                  <div className="p-2 bg-white/50 rounded flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#734739]">Forest Friends</span>
                      <p className="text-xs text-[#734739]">Members: 5/10</p>
                    </div>
                    <Button size="sm" className="bg-[#74C480]">
                      Join
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button className="w-full bg-[#6FB5FF] text-[#734739] font-bold py-2 px-4 rounded transition-colors border-2 border-[#734739]">
                  Create New Alliance
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center">
                <AlertCircle className="text-[#E36F6F] mr-2" size={24} />
                <h3 className="text-xl font-bold text-[#734739]">Alliance Locked</h3>
              </div>
              <p className="text-[#734739] mt-2">
                Reach level 5 to unlock the Alliance feature. You are currently level {playerStats.level}.
              </p>
              <div className="mt-4">
                <Progress
                  value={(playerStats.level / 5) * 100}
                  className="h-2 bg-[#FFC078]/30"
                  indicatorClassName="bg-[#E36F6F]"
                />
                <div className="text-xs text-[#734739] mt-1 text-right">{playerStats.level}/5 levels</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#FFC078]/30 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-[#734739] mb-2">Leaderboard</h3>
          <div className="space-y-2">
            <div className="p-2 bg-white/50 rounded flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-[#E36F6F] text-white rounded-full flex items-center justify-center mr-2">
                  1
                </span>
                <span className="font-bold text-[#734739]">MasterBear</span>
              </div>
              <span className="text-[#734739]">Level 42</span>
            </div>
            <div className="p-2 bg-white/50 rounded flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-[#74C480] text-white rounded-full flex items-center justify-center mr-2">
                  2
                </span>
                <span className="font-bold text-[#734739]">HoneyHunter</span>
              </div>
              <span className="text-[#734739]">Level 38</span>
            </div>
            <div className="p-2 bg-white/50 rounded flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-[#6FB5FF] text-white rounded-full flex items-center justify-center mr-2">
                  3
                </span>
                <span className="font-bold text-[#734739]">BerryKing</span>
              </div>
              <span className="text-[#734739]">Level 35</span>
            </div>
            <div className="p-2 bg-[#FFC078]/50 rounded flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-[#FFC078] text-[#734739] rounded-full flex items-center justify-center mr-2">
                  ?
                </span>
                <span className="font-bold text-[#734739]">You</span>
              </div>
              <span className="text-[#734739]">Level {playerStats.level}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

