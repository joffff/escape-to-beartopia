"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useGameState } from "@/context/game-context"
import { PlacementProvider } from "@/context/placement-context"
import QuestPanel from "@/components/quest-panel"
import BuildingPanel from "@/components/building-panel"
import UpgradePanel from "@/components/upgrade-panel"
import SkillsPanel from "@/components/skills-panel"
import CommunityPanel from "@/components/community-panel"
import PlayerProfilePanel from "@/components/player-profile-panel"
import BearAvatar from "@/components/bear-avatar"
import SimpleWorldMap from "./simple-world-map"
import SimpleDenMap from "./simple-den-map"
import AllianceMap from "./alliance-map" // Import the new alliance map component
import ResourcePanel from "./resource-panel"
import SaveIndicator from "./save-indicator"
import OfflineProgressModal from "./offline-progress-modal"
import ResourceHeader from "./resource-header"
import Image from "next/image"

export default function GameInterface({ onDisconnect }) {
  const [activeView, setActiveView] = useState("den") // "world", "den", or "alliance"
  const [activeContent, setActiveContent] = useState("map") // "map", "upgrades", "buildings", "quests", "skills", "community", "profile", "settings"
  const { playerStats, saveGame, resetGame, offlineProgress, dismissOfflineProgress, resources, debugSaveSystem } =
    useGameState()

  // Add this near the top of the component with other state declarations
  const [mapReady, setMapReady] = useState(false)

  // Add this useEffect to set the map as ready after a short delay
  useEffect(() => {
    // Give the map components time to initialize properly
    const timer = setTimeout(() => {
      setMapReady(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Handle content change
  const setContent = (content) => {
    setActiveContent(content)
  }

  // Manual save handler with feedback
  const handleSave = () => {
    try {
      const success = saveGame()
      if (success) {
        alert("Game saved successfully!")
      } else {
        alert("Failed to save game. Check console for details.")
      }
    } catch (error) {
      console.error("Error saving game:", error)
      alert("Error saving game: " + error)
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

  // Handle returning to landing page (for testing)
  const handleReturnToLanding = () => {
    console.log("Returning to landing page for testing")
    // Save game before returning
    saveGame()
    // Call the onDisconnect function to return to landing page
    onDisconnect()
  }

  // Pass the handleReturnToLanding function to the map components
  const renderMainContent = () => {
    switch (activeContent) {
      case "map":
        return (
          <div className="w-full h-full">
            {!mapReady ? (
              <div className="w-full h-full flex items-center justify-center bg-[#74C480]/30">
                <div className="bg-[#FFF6E9] p-6 rounded-lg border-2 border-[#734739] shadow-lg">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-[#E36F6F] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="text-[#734739] font-bold text-lg">Preparing map...</div>
                    <div className="text-[#734739] text-sm mt-2">This may take a moment</div>
                  </div>
                </div>
              </div>
            ) : activeView === "world" ? (
              <SimpleWorldMap onReturnToLanding={handleReturnToLanding} />
            ) : activeView === "alliance" ? (
              <AllianceMap onReturnToLanding={handleReturnToLanding} />
            ) : (
              <SimpleDenMap onReturnToLanding={handleReturnToLanding} />
            )}
          </div>
        )
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

              {/* Add this new debug section */}
              <div className="bg-[#FFC078]/30 p-4 rounded-lg">
                <h3 className="font-bold text-[#734739] mb-2">Save System Debug</h3>
                <p className="text-[#734739] text-sm mb-4">
                  If you're experiencing issues with game progress not being saved, use these tools to diagnose the
                  problem.
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      const debugInfo = debugSaveSystem()
                      alert(JSON.stringify(debugInfo, null, 2))
                    }}
                    className="w-full bg-[#B080FF] hover:bg-[#B080FF]/80 text-white"
                  >
                    Run Save Diagnostics
                  </Button>
                  <Button
                    onClick={() => {
                      const savedData = localStorage.getItem("beartopia-game-state")
                      if (savedData) {
                        const blob = new Blob([savedData], { type: "application/json" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = "beartopia-save-backup.json"
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                      } else {
                        alert("No saved data found!")
                      }
                    }}
                    className="w-full bg-[#6FB5FF] hover:bg-[#6FB5FF]/80 text-white"
                  >
                    Export Save Data
                  </Button>
                  <div className="flex items-center justify-center">
                    <label className="w-full bg-[#E36F6F] hover:bg-[#E36F6F]/80 text-white py-2 px-4 rounded text-center cursor-pointer">
                      Import Save Data
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              try {
                                const data = event.target?.result as string
                                localStorage.setItem("beartopia-game-state", data)
                                alert("Save data imported! Refresh the page to load it.")
                              } catch (error) {
                                alert("Error importing save data: " + error)
                              }
                            }
                            reader.readAsText(file)
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
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
    <PlacementProvider setActiveView={setActiveView} setActiveContent={setActiveContent}>
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
                    <Button
                      onClick={() => setActiveView("alliance")}
                      className={`${activeView === "alliance" ? "bg-[#B080FF] text-white" : "bg-[#FFF6E9] text-[#734739]"} border-2 border-[#734739]`}
                      size="sm"
                    >
                      🐻 Alliance
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

              {/* Resource box in the center */}
              <div className="flex-1 flex justify-center">
                <ResourceHeader />
              </div>

              {/* Navigation links and avatar on the right */}
              <div className="flex items-center gap-3">
                <a href="/how-to-play" className="no-underline">
                  <Button
                    className="bg-[#FFF6E9] text-[#734739] border-2 border-[#734739] hover:bg-[#E36F6F] hover:text-white"
                    size="sm"
                  >
                    📚 How to Play
                  </Button>
                </a>
                <a href="/lore" className="no-underline">
                  <Button
                    className="bg-[#FFF6E9] text-[#734739] border-2 border-[#734739] hover:bg-[#E36F6F] hover:text-white"
                    size="sm"
                  >
                    📖 Lore
                  </Button>
                </a>
                <Button
                  onClick={() => setContent("profile")}
                  className="bg-[#FFC078]/80 rounded-lg text-[#734739] border border-[#734739] p-1 flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFC078]/70 overflow-hidden flex items-center justify-center border-2 border-[#FFC078]">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BearishLogo-Byu3rXUZxziBlHv1DUdkCofs2emyI4.webp"
                      alt="Bearish Avatar"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">BearishPlayer</div>
                    <div>Level {playerStats.level}</div>
                  </div>
                </Button>
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
                <Button
                  onClick={() => window.location.href = '/mini-games'}
                  className={`bg-[#FFF6E9] text-[#734739] border-2 border-[#734739]`}
                  size="sm"
                >
                  🎮 Mini Games
                </Button>
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
    </PlacementProvider>
  )
}
