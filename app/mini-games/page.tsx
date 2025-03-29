"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MiniGamesPage() {
  const [activeTab, setActiveTab] = useState("match")

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
          <h1 className="text-2xl font-bold text-white">Mini Games</h1>
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
          <Tabs defaultValue="match" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-[#FFC078]/30 p-4">
              <TabsList className="grid grid-cols-4 bg-[#FFF6E9]">
                <TabsTrigger value="match" className="data-[state=active]:bg-[#64B470] data-[state=active]:text-white text-[#5A4A3C] font-bold">
                  Match
                </TabsTrigger>
                <TabsTrigger value="repeat" className="data-[state=active]:bg-[#64B470] data-[state=active]:text-white text-[#5A4A3C] font-bold">
                  Repeat
                </TabsTrigger>
                <TabsTrigger value="berry-forest" className="data-[state=active]:bg-[#64B470] data-[state=active]:text-white text-[#5A4A3C] font-bold">
                  Berry Forest
                </TabsTrigger>
                <TabsTrigger value="honey-heist" className="data-[state=active]:bg-[#64B470] data-[state=active]:text-white text-[#5A4A3C] font-bold">
                  Honey Heist
                </TabsTrigger>
                <TabsTrigger value="coming-soon2" className="data-[state=active]:bg-[#64B470] data-[state=active]:text-white text-[#5A4A3C] font-bold">
                  Coming Soon
                </TabsTrigger>

              </TabsList>
            </div>

            <div className="p-6">
              <ScrollArea className="h-[60vh]">
              <TabsContent value="match" className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/3 flex justify-center">
                      <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-[#FFC078]">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BearishLogo-Byu3rXUZxziBlHv1DUdkCofs2emyI4.webp"
                          alt="Match Game"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-3xl font-bold mb-4 text-[#734739]">Match Game</h2>
                      <p className="mb-4 text-lg">
                        Test your memory and earn rewards by matching pairs of cards. Each match you make will earn you honey and other resources.
                      </p>
                      <p className="text-lg">
                        The game features different difficulty levels and seasonal bonuses. Complete challenges to earn special rewards!
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link href="/mini-games/match" className="flex items-center justify-center">
                      <Button className="w-full bg-[#74C480] hover:bg-[#6FB5FF] text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white">
                        Play Match Game
                      </Button>
                    </Link>
                  </div>
                </TabsContent>

              <TabsContent value="repeat" className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/3 flex justify-center">
                      <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-[#FFC078]">
                        <Image
                          src="/images/mini-games/repeat/thumbnail.png"
                          alt="Pattern Repeat"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-3xl font-bold mb-4 text-[#734739]">Repeat</h2>
                      <p className="mb-4 text-lg">
                        Challenge your memory by repeating increasingly complex sequences of bear images.
                      </p>
                      <p className="text-lg">
                        Like Simon Says, master each round to earn rewards and prove your skill.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link href="/mini-games/repeat" className="flex items-center justify-center">
                      <Button className="w-full bg-[#74C480] hover:bg-[#6FB5FF] text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white">
                        Play Repeat
                      </Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="repeat" className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4 text-[#734739]">Repeat</h2>
                    <p className="text-lg">
                      Test your memory and earn rewards by repeating a sequence of bears. Each correct sequence will earn you honey and other resources.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="berry-forest" className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/3 flex justify-center">
                      <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-[#FFC078]">
                        <Image
                          src="/images/mini-games/berry-forest/berry.webp"
                          alt="Berry Forest Game"
                          width={256}
                          height={256}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-3xl font-bold mb-4 text-[#734739]">Berry Forest Game</h2>
                      <p className="mb-4 text-lg">
                        Join our adorable bears on their berry-collecting adventure in the magical forest! Choose your favorite character and help them gather berries while avoiding dangers.
                      </p>
                      <p className="text-lg">
                        Collect as many berries as you can before time runs out!
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link href="/mini-games/berry-forest" className="flex items-center justify-center">
                      <Button className="w-full bg-[#74C480] hover:bg-[#6FB5FF] text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white">
                        Play Berry Forest Game
                      </Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="honey-heist" className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/3 flex justify-center">
                      <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-[#FFC078]">
                        <Image
                          src="/images/mini-games/honey-heist/thumbnail.webp"
                          alt="Honey Heist Game"
                          width={256}
                          height={256}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-3xl font-bold mb-4 text-[#734739]">Honey Heist</h2>
                      <p className="mb-4 text-lg">
                        Sneak through the forest to collect honey while avoiding the bees! Use stealth mode to move quietly, but watch your energy levels.
                      </p>
                      <p className="text-lg">
                        Choose your bear character, each with unique abilities, and complete increasingly challenging levels to earn rewards!
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link href="/mini-games/honey-heist" className="flex items-center justify-center">
                      <Button className="w-full bg-[#74C480] hover:bg-[#6FB5FF] text-white font-bold py-3 px-6 rounded-full transition-colors border-2 border-white">
                        Play Honey Heist
                      </Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="coming-soon2" className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4 text-[#734739]">Coming Soon</h2>
                    <p className="text-lg">
                      New mini-games are being developed to enhance your Beartopia experience. Check back soon for updates!
                    </p>
                  </div>
                </TabsContent>

              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  )
}