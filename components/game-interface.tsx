"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useGameState } from "@/context/game-context"
import QuestPanel from "@/components/quest-panel"
import BuildingPanel from "@/components/building-panel"
import UpgradePanel from "@/components/upgrade-panel"
import SkillsPanel from "@/components/skills-panel"
import CommunityPanel from "@/components/community-panel"
import PlayerProfilePanel from "@/components/player-profile-panel"
import { Settings } from "lucide-react"
import BearAvatar from "@/components/bear-avatar"
import SimpleWorldMap from "./simple-world-map"
import SimpleDenMap from "./simple-den-map"
import ResourcePanel from "./resource-panel"
import Image from "next/image"
import SaveIndicator from "./save-indicator"
import OfflineProgressModal from "./offline-progress-modal"
import Link from "next/link"

export default function GameInterface({ onDisconnect }) {
  const [activeView, setActiveView] = useState("den") // "world" or "den"
  const [activeContent, setActiveContent] = useState("map") // "map", "upgrades", "buildings", "quests", "skills", "community", "profile", "settings"
  const { playerStats, saveGame, resetGame, offlineProgress, dismissOfflineProgress, resources } = useGameState()

  // Handle content change
  const setContent = (content) => {
    setActiveContent(content)
  }

  // Manual save handler
  const handleSave = () => {
    try {
      saveGame()
      console.log("Game saved successfully!")
    } catch (error) {
      console.error("Error saving game:", error)
    }
  }

  // Reset game handler with confirmation
  const handleReset = () => {
    try {
      if (window.confirm("Are you sure you want to reset your game? All progress will be lost!")) {
        resetGame()
        console.log("Game reset successfully!")
      }
    } catch (error) {
      console.error("Error resetting game:", error)
    }
  }

  // Render the main content based on activeContent state
  const renderMainContent = () => {
    switch (activeContent) {
      case "map":
        return <div className="w-full h-full">{activeView === "world" ? <SimpleWorldMap /> : <SimpleDenMap />}</div>
      case "upgrades":
        return <UpgradePanel />
      case "buildings":
        return <BuildingPanel />
      case "quests":
        return <QuestPanel />
      case "skills":
        return <SkillsPanel />
      case "community":
        return <CommunityPanel />
      case "profile":
        return <PlayerProfilePanel />
      case "resources":
        return <ResourcePanel />
      case "settings":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-[#734739] mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="bg-[#FFC078]/30 p-4 rounded-lg">
                <h3 className="font-bold text-[#734739] mb-2">Game Data</h3>
                <p className="text-[#734739] text-sm mb-4">
                  Your game is automatically saved every 30 seconds and when you make important progress.
                </p>
                <Button onClick={handleSave} className="w-full bg-[#74C480] hover:bg-[#74C480]/80 text-white">
                  Save Game Now
                </Button>
              </div>

              <div className="bg-[#FFC078]/30 p-4 rounded-lg">
                <h3 className="font-bold text-[#734739] mb-2">Reset Game</h3>
                <p className="text-[#734739] text-sm mb-4">
                  Warning: This will delete all your progress and start a new game.
                </p>
                <Button onClick={handleReset} className="w-full bg-[#E36F6F] hover:bg-[#E36F6F]/80 text-white">
                  Reset Game
                </Button>
              </div>

              <div className="bg-[#FFC078]/30 p-4 rounded-lg">
                <h3 className="font-bold text-[#734739] mb-2">Account</h3>
                <Button onClick={onDisconnect} className="w-full bg-[#FFC078] hover:bg-[#FFC078]/80 text-[#734739]">
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )
      default:
        return <BearAvatar />
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-[#FFF6E9]">
      {/* Main game container with frame border */}
      <div className="absolute inset-0 z-10 p-4">
        <div className="h-full w-full border-8 border-[#734739] rounded-xl overflow-hidden relative flex flex-col">
          {/* Top frame border */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-[#FFF6E9]/80 backdrop-blur-sm border-b-4 border-[#734739] flex items-center px-4 z-20">
            <div className="flex items-center space-x-2">
              {activeContent === "map" && (
                <>
                  <Button
                    onClick={() => setActiveView("world")}
                    className={`${activeView === "world" ? "bg-[#E36F6F] text-white" : "bg-[#FFF6E9] text-[#734739]"} border-2 border-[#734739]`}
                    size="sm"
                  >
                    🗺️ World
                  </Button>
                  <Button
                    onClick={() => setActiveView("den")}
                    className={`${activeView === "den" ? "bg-[#74C480] text-white" : "bg-[#FFF6E9] text-[#734739]"} border-2 border-[#734739]`}
                    size="sm"
                  >
                    🏕️ Den
                  </Button>
                </>
              )}
              {activeContent !== "map" && (
                <Button
                  onClick={() => setContent("map")}
                  className="bg-[#FFF6E9] text-[#734739] border-2 border-[#734739]"
                  size="sm"
                >
                  ← Back to Map
                </Button>
              )}
            </div>

            <div className="ml-auto flex items-center space-x-2">
              {/* HUNNY Display */}
              <div className="bg-[#FFC078] px-3 py-1 rounded-full text-[#734739] font-bold flex items-center gap-1">
                <span>🍯</span>
                <span>{Math.floor(resources.hunny)}</span>
              </div>

              {/* Resources Button */}
              <Button
                onClick={() => setContent("resources")}
                variant="outline"
                size="icon"
                className="bg-[#FFF6E9] text-[#734739] border-2 border-[#734739]"
              >
                <span className="text-lg">🍯</span>
              </Button>

              {/* Player Profile Button - Updated to use Bearish logo */}
              <Button
                onClick={() => setContent("profile")}
                className="bg-[#FFF6E9] text-[#734739] border-2 border-[#734739] flex items-center space-x-1 px-2"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#FFC078] flex items-center justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BearishLogo-Byu3rXUZxziBlHv1DUdkCofs2emyI4.webp"
                    alt="Bearish Logo"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-[#734739] font-bold">Lvl {playerStats.level}</span>
              </Button>

              <Button
                onClick={() => setContent("settings")}
                variant="outline"
                size="icon"
                className="text-[#734739] border-[#734739] hover:bg-[#FFC078]/20"
              >
                <Settings size={18} />
              </Button>

              {/* Lore Page Link */}
              <Link href="/lore" className="ml-2">
                <Button
                  variant="outline"
                  className="bg-[#FFF6E9] text-[#734739] border-2 border-[#734739] hover:bg-[#FFC078]/20"
                  size="sm"
                >
                  📚 Lore
                </Button>
              </Link>

              {/* How To Play Link */}
              <Link href="/how-to-play" className="ml-2">
                <Button
                  variant="outline"
                  className="bg-[#FFF6E9] text-[#734739] border-2 border-[#734739] hover:bg-[#FFC078]/20"
                  size="sm"
                >
                  ❓ How To Play
                </Button>
              </Link>
            </div>
          </div>

          {/* Main content area */}
          <div className="absolute inset-0 pt-16 pb-16 z-10">
            <div className="w-full h-full overflow-y-auto">{renderMainContent()}</div>
          </div>

          {/* Bottom frame border */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#FFF6E9]/80 backdrop-blur-sm border-t-4 border-[#734739] flex items-center justify-center space-x-4 px-4 z-20">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setContent("upgrades")}
                className={`${activeContent === "upgrades" ? "bg-[#E36F6F] text-white" : "bg-[#FFF6E9] text-[#734739]"} border-2 border-[#734739]`}
                size="sm"
              >
                🍯 Upgrades
              </Button>
              <Button
                onClick={() => setContent("buildings")}
                className={`${activeContent === "buildings" ? "bg-[#74C480] text-white" : "bg-[#FFF6E9] text-[#734739]"} border-2 border-[#734739]`}
                size="sm"
              >
                🏠 Buildings
              </Button>
              <Button
                onClick={() => setContent("quests")}
                className={`${activeContent === "quests" ? "bg-[#FFC078] text-white" : "bg-[#FFF6E9] text-[#734739]"} border-2 border-[#734739]`}
                size="sm"
              >
                📜 Quests
              </Button>
              <Button
                onClick={() => setContent("skills")}
                className={`${activeContent === "skills" ? "bg-[#B080FF] text-white" : "bg-[#FFF6E9] text-[#734739]"} border-2 border-[#734739]`}
                size="sm"
              >
                🐾 Skills
              </Button>
              <Button
                onClick={() => setContent("community")}
                className={`${activeContent === "community" ? "bg-[#6FB5FF] text-white" : "bg-[#FFF6E9] text-[#734739]"} border-2 border-[#734739]`}
                size="sm"
              >
                🐻 Community
              </Button>
              <Link href="/mini-games" className="ml-2">
    <Button
    variant="outline"
                className="bg-[#FFF6E9] text-[#734739] border-2 border-[#734739] hover:bg-[#6FB5FF]/20"
                size="sm"
              >
                🎮 Mini Games
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Save indicator */}
      <SaveIndicator />

      {/* Offline progress modal */}
      {offlineProgress && (
        <OfflineProgressModal
          timeAway={offlineProgress.timeAway}
          gains={offlineProgress.gains}
          onClose={dismissOfflineProgress}
        />
      )}
    </div>
  )
}
