"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function HowToPlayPage() {
  const [activeTab, setActiveTab] = useState("basics")

  return (
    <div className="min-h-screen bg-[#FFF6E9] text-[#734739]">
      {/* Header with navigation back to game */}
      <header className="bg-[#74C480] p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/images/BearishLogo.webp"
            alt="Bearish Logo"
            width={50}
            height={50}
          />
          <h1 className="text-2xl font-bold text-white">How To Play</h1>
        </div>
        <Link href="/">
          <Button variant="outline" className="bg-white hover:bg-[#FFC078]/80 text-[#734739] border-[#734739]">
            Return to Game
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-xl border-2 border-[#FFC078] shadow-lg overflow-hidden">
          <Tabs defaultValue="basics" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-[#FFC078]/30 p-4">
              <TabsList className="grid grid-cols-4 bg-[#FFF6E9]">
                <TabsTrigger value="basics" className="data-[state=active]:bg-[#74C480] data-[state=active]:text-white">
                  Basics
                </TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-[#74C480] data-[state=active]:text-white">
                  Resources
                </TabsTrigger>
                <TabsTrigger value="buildings" className="data-[state=active]:bg-[#74C480] data-[state=active]:text-white">
                  Buildings
                </TabsTrigger>
                <TabsTrigger value="progression" className="data-[state=active]:bg-[#74C480] data-[state=active]:text-white">
                  Progression
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <ScrollArea className="h-[60vh]">
                {/* Basics Tab Content */}
                <TabsContent value="basics" className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/3 flex justify-center">
                      <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-[#FFC078]">
                        <Image
                          src="/images/BearishLogo.webp"
                          alt="Game Basics"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-3xl font-bold mb-4 text-[#734739]">Getting Started</h2>
                      <p className="mb-4 text-lg">
                        Welcome to Escape to Beartopia! This idle RPG strategy game lets you build your own bear sanctuary, 
                        gather resources, and work together with other bears to create the ultimate utopia.
                      </p>
                      <p className="text-lg">
                        To begin your journey, you'll need to connect your Abstract wallet. Once connected, you'll be able to 
                        start building your den and exploring the world of Beartopia.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-2xl font-bold mb-3 text-[#734739]">Game Controls</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#FFF6E9] p-4 rounded-lg border border-[#FFC078]">
                        <h4 className="font-bold mb-2">Navigation</h4>
                        <p>Use the world map to travel between different regions of Beartopia. Each region offers unique resources and building opportunities.</p>
                      </div>
                      <div className="bg-[#FFF6E9] p-4 rounded-lg border border-[#FFC078]">
                        <h4 className="font-bold mb-2">Building</h4>
                        <p>Click on empty plots in your den to place new buildings. Different buildings provide various benefits to your bear community.</p>
                      </div>
                      <div className="bg-[#FFF6E9] p-4 rounded-lg border border-[#FFC078]">
                        <h4 className="font-bold mb-2">Resource Collection</h4>
                        <p>Resources accumulate automatically over time. Visit the resource panel to collect and manage your honey, berries, wood, and stone.</p>
                      </div>
                      <div className="bg-[#FFF6E9] p-4 rounded-lg border border-[#FFC078]">
                        <h4 className="font-bold mb-2">Quests</h4>
                        <p>Complete quests to earn rewards and advance the story. New quests become available as you progress through the game.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-2xl font-bold mb-3 text-[#734739]">User Interface</h3>
                    <p className="mb-4 text-lg">
                      The game interface is designed to be intuitive and easy to navigate. Here's a breakdown of the main elements:
                    </p>
                    <div className="space-y-4">
                      <div className="bg-[#FFF6E9] p-4 rounded-lg border border-[#FFC078]">
                        <h4 className="font-bold mb-2">Resource Bar</h4>
                        <p>Located at the top of the screen, this displays your current resources: honey, berries, wood, and stone.</p>
                      </div>
                      <div className="bg-[#FFF6E9] p-4 rounded-lg border border-[#FFC078]">
                        <h4 className="font-bold mb-2">Den View</h4>
                        <p>The central area shows your bear den, where you can place and upgrade buildings.</p>
                      </div>
                      <div className="bg-[#FFF6E9] p-4 rounded-lg border border-[#FFC078]">
                        <h4 className="font-bold mb-2">Side Panels</h4>
                        <p>Access different game features through the panels on the right side: Buildings, Quests, Skills, and Community.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Resources Tab Content */}
                <TabsContent value="resources" className="space-y-6">
                  <h2 className="text-3xl font-bold mb-4 text-[#734739]">Resource Management</h2>
                  <p className="text-lg mb-6">
                    Resources are the foundation of your bear sanctuary. Gathering and managing them efficiently is key to your success in Beartopia.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-xl font-bold mb-3 text-[#74C480]">Honey</h3>
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-yellow-300 rounded-full mr-3 flex items-center justify-center text-2xl">🍯</div>
                        <div>
                          <p className="font-bold">Primary Currency</p>
                        </div>
                      </div>
                      <p className="mb-2">
                        <span className="font-bold">Sources:</span> Beehives, Honey Farms, Daily Quests
                      </p>
                      <p className="mb-2">
                        <span className="font-bold">Uses:</span> Building construction, Upgrades, Trading
                      </p>
                      <p>
                        Honey is the most versatile resource in Beartopia. It's used for most basic transactions and is required for nearly all building projects.
                      </p>
                    </div>
                    
                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-xl font-bold mb-3 text-[#FF9B42]">Berries</h3>
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-red-300 rounded-full mr-3 flex items-center justify-center text-2xl">🍓</div>
                        <div>
                          <p className="font-bold">Food Resource</p>
                        </div>
                      </div>
                      <p className="mb-2">
                        <span className="font-bold">Sources:</span> Berry Bushes, Orchards, Foraging
                      </p>
                      <p className="mb-2">
                        <span className="font-bold">Uses:</span> Bear Sustenance, Special Buildings, Potions
                      </p>
                      <p>
                        Berries are essential for feeding your bear population and unlocking certain special buildings that enhance your community's happiness.
                      </p>
                    </div>
                    
                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-xl font-bold mb-3 text-[#8B4513]">Wood</h3>
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-amber-700 rounded-full mr-3 flex items-center justify-center text-2xl">🪵</div>
                        <div>
                          <p className="font-bold">Building Material</p>
                        </div>
                      </div>
                      <p className="mb-2">
                        <span className="font-bold">Sources:</span> Forest Expeditions, Lumber Mills, Trading
                      </p>
                      <p className="mb-2">
                        <span className="font-bold">Uses:</span> Basic Buildings, Tools, Furniture
                      </p>
                      <p>
                        Wood is a fundamental building material for most structures in your den. Sustainable harvesting through Lumber Mills ensures a steady supply.
                      </p>
                    </div>
                    
                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-xl font-bold mb-3 text-[#808080]">Stone</h3>
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gray-400 rounded-full mr-3 flex items-center justify-center text-2xl">🪨</div>
                        <div>
                          <p className="font-bold">Advanced Material</p>
                        </div>
                      </div>
                      <p className="mb-2">
                        <span className="font-bold">Sources:</span> Mountain Expeditions, Quarries, Mining
                      </p>
                      <p className="mb-2">
                        <span className="font-bold">Uses:</span> Advanced Buildings, Defenses, Monuments
                      </p>
                      <p>
                        Stone is required for more advanced structures and defenses. It's harder to obtain than wood but provides more durable and impressive buildings.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-2xl font-bold mb-3 text-[#734739]">Resource Collection Tips</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Build resource-generating buildings early to establish a steady income</li>
                      <li>Balance your resource collection - don't focus too heavily on just one type</li>
                      <li>Complete daily quests for bonus resources</li>
                      <li>Upgrade resource buildings to increase their efficiency</li>
                      <li>Join community efforts for resource bonuses when working with other bears</li>
                    </ul>
                  </div>
                </TabsContent>

                {/* Buildings Tab Content */}
                <TabsContent value="buildings" className="space-y-6">
                  <h2 className="text-3xl font-bold mb-4 text-[#734739]">Building Your Den</h2>
                  <p className="text-lg mb-6">
                    Buildings are the heart of your bear sanctuary. Each structure serves a specific purpose and helps your community grow and thrive.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#74C480]">Resource Buildings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Beehive</h4>
                          <p className="text-sm mb-1">Produces honey at a steady rate</p>
                          <p className="text-xs">Cost: 50 Wood, 20 Berries</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Berry Bush</h4>
                          <p className="text-sm mb-1">Provides a constant supply of berries</p>
                          <p className="text-xs">Cost: 30 Wood, 10 Honey</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Lumber Mill</h4>
                          <p className="text-sm mb-1">Harvests and processes wood</p>
                          <p className="text-xs">Cost: 100 Honey, 50 Stone</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Stone Quarry</h4>
                          <p className="text-sm mb-1">Extracts stone from the mountains</p>
                          <p className="text-xs">Cost: 150 Honey, 100 Wood</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#6FB5FF]">Community Buildings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Bear Den</h4>
                          <p className="text-sm mb-1">Housing for bear residents</p>
                          <p className="text-xs">Cost: 80 Wood, 40 Stone, 20 Honey</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Meeting Hall</h4>
                          <p className="text-sm mb-1">Increases community happiness</p>
                          <p className="text-xs">Cost: 120 Wood, 60 Stone, 40 Honey</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Healing Garden</h4>
                          <p className="text-sm mb-1">Provides health bonuses to all bears</p>
                          <p className="text-xs">Cost: 100 Berries, 80 Honey, 30 Stone</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Training Grounds</h4>
                          <p className="text-sm mb-1">Increases skill learning speed</p>
                          <p className="text-xs">Cost: 150 Wood, 100 Stone, 50 Honey</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#FF9B42]">Special Buildings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Abstract Crystal Shrine</h4>
                          <p className="text-sm mb-1">Enhances all resource production</p>
                          <p className="text-xs">Cost: 300 Honey, 200 Stone, 150 Wood, 100 Berries</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Great Library</h4>
                          <p className="text-sm mb-1">Unlocks advanced research options</p>
                          <p className="text-xs">Cost: 250 Wood, 200 Stone, 150 Honey</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Trading Post</h4>
                          <p className="text-sm mb-1">Enables resource trading with other bears</p>
                          <p className="text-xs">Cost: 200 Wood, 100 Stone, 150 Honey</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">Guardian Tower</h4>
                          <p className="text-sm mb-1">Protects your den from random events</p>
                          <p className="text-xs">Cost: 300 Stone, 150 Wood, 100 Honey</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-2xl font-bold mb-3 text-[#734739]">Building Placement Tips</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Place resource buildings near related structures for efficiency bonuses</li>
                      <li>Community buildings work best when centrally located</li>
                      <li>Leave room for expansion as you unlock new building types</li>
                      <li>Some buildings provide adjacency bonuses when placed next to each other</li>
                      <li>You can relocate buildings later, but it will cost additional resources</li>
                    </ul>
                  </div>
                </TabsContent>

                {/* Progression Tab Content */}
                <TabsContent value="progression" className="space-y-6">
                  <h2 className="text-3xl font-bold mb-4 text-[#734739]">Game Progression</h2>
                  <p className="text-lg mb-6">
                    Your journey in Beartopia follows a natural progression from a simple den to a thriving bear sanctuary. Here's how to advance through the game.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#74C480]">Early Game (Den Establishment)</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">1. Resource Foundation</h4>
                          <p>Focus on building basic resource generators: Beehives, Berry Bushes, and a small Lumber Mill.</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">2. First Community Buildings</h4>
                          <p>Construct a few Bear Dens to house your initial population and a small Meeting Hall.</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">3. Basic Quests</h4>
                          <p>Complete the introductory quests to learn game mechanics and earn bonus resources.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#6FB5FF]">Mid Game (Sanctuary Development)</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">1. Resource Expansion</h4>
                          <p>Upgrade existing resource buildings and add Stone Quarries to your production chain.</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">2. Skill Development</h4>
                          <p>Build a Training Ground and start developing bear skills in gathering, crafting, and community management.</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">3. Community Growth</h4>
                          <p>Expand your bear population and construct specialized buildings like the Healing Garden.</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">4. Region Exploration</h4>
                          <p>Begin exploring different regions of Beartopia to discover unique resources and opportunities.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#FF9B42]">Late Game (Beartopia Mastery)</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">1. Special Buildings</h4>
                          <p>Construct advanced structures like the Abstract Crystal Shrine and Great Library.</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">2. Bear Specialization</h4>
                          <p>Develop specialized roles for your bears based on their skills and your sanctuary's needs.</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">3. Community Challenges</h4>
                          <p>Participate in community-wide events and challenges with other players.</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#FFC078]">
                          <h4 className="font-bold mb-1">4. Faction Alignment</h4>
                          <p>Choose to align with one of the bear factions to unlock unique buildings and abilities.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-2xl font-bold mb-3 text-[#734739]">Progression Tips</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Balance short-term needs with long-term goals</li>
                      <li>Don't neglect skill development - specialized bears are much more efficient</li>
                      <li>Join community efforts to accelerate your progress</li>
                      <li>Regularly check the quest panel for new objectives</li>
                      <li>Explore all regions to find unique resources and opportunities</li>
                      <li>Remember that Beartopia is an idle game - resources accumulate even when you're offline</li>
                    </ul>
                  </div>
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#74C480] text-white p-4 text-center">
        <p>&copy; 2025 Bearish - Escape to Beartopia</p>
      </footer>
    </div>
  )
}
