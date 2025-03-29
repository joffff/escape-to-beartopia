"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function LorePage() {
  const [activeTab, setActiveTab] = useState("origins")

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
          <h1 className="text-2xl font-bold text-white">The Lore of Beartopia</h1>
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
          <Tabs defaultValue="origins" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-[#FFC078]/30 p-4">
              <TabsList className="grid grid-cols-4 bg-[#FFF6E9]">
                <TabsTrigger value="origins" className="data-[state=active]:bg-[#74C480] data-[state=active]:text-white">
                  Origins
                </TabsTrigger>
                <TabsTrigger value="world" className="data-[state=active]:bg-[#74C480] data-[state=active]:text-white">
                  The World
                </TabsTrigger>
                <TabsTrigger value="factions" className="data-[state=active]:bg-[#74C480] data-[state=active]:text-white">
                  Factions
                </TabsTrigger>
                <TabsTrigger value="future" className="data-[state=active]:bg-[#74C480] data-[state=active]:text-white">
                  Prophecies
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <ScrollArea className="h-[60vh]">
                <TabsContent value="origins" className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/3 flex justify-center">
                      <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-[#FFC078]">
                        <Image
                          src="/images/BearishLogo.webp"
                          alt="Ancient Bears"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-3xl font-bold mb-4 text-[#734739]">The Great Exodus</h2>
                      <p className="mb-4 text-lg">
                        Long ago, bears lived in harmony with the natural world, roaming freely through vast forests and 
                        mountain ranges. But as human civilization expanded, bears found their territories shrinking, 
                        their food sources dwindling, and their kind increasingly threatened.
                      </p>
                      <p className="mb-4 text-lg">
                        Legend tells of a wise old bear named Ursa Major who had a vision of a hidden land beyond the 
                        mountains—a paradise where bears could live in peace, free from the encroachment of humans. 
                        This land would come to be known as <span className="font-bold text-[#74C480]">Beartopia</span>.
                      </p>
                      <p className="text-lg">
                        Ursa Major gathered bears from all regions—grizzlies from the mountains, black bears from the forests, 
                        polar bears from the frozen north, and pandas from the bamboo groves of the east. Together, they 
                        embarked on the Great Exodus, a perilous journey to find their promised land.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-3 text-[#734739]">The Discovery of Abstract Energy</h3>
                    <p className="mb-4 text-lg">
                      During their journey, the bears discovered ancient ruins containing mysterious crystals that pulsed 
                      with a strange energy. Ursa Major, with her innate wisdom, learned that these crystals contained what 
                      would later be called "Abstract Energy"—a powerful force that could be harnessed by those with the 
                      right knowledge.
                    </p>
                    <p className="mb-4 text-lg">
                      The bears found that by meditating on these crystals, they could enhance their natural abilities and 
                      even develop new ones. Some bears gained the power to communicate with plants, others could predict 
                      weather patterns, and a few even developed rudimentary abilities to craft tools.
                    </p>
                    <p className="text-lg">
                      This discovery accelerated their evolution, and over generations, the bears developed a sophisticated 
                      society built around the principles of harmony with nature and the responsible use of Abstract Energy.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="world" className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/3 flex justify-center">
                      <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-[#FFC078]">
                        <Image
                          src="/images/BearishLogo.webp"
                          alt="Beartopia Map"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-3xl font-bold mb-4 text-[#734739]">The Land of Beartopia</h2>
                      <p className="mb-4 text-lg">
                        Beartopia is a vast, diverse land hidden from the human world by a combination of natural barriers 
                        and Abstract Energy fields that distort perception. The land is divided into five main regions, each 
                        with its own unique ecosystem and bear inhabitants.
                      </p>
                      <p className="text-lg">
                        At the center lies the <span className="font-bold text-[#74C480]">Honey Heartlands</span>, a lush 
                        valley with flowering meadows and the largest concentration of beehives in the world. This is where 
                        the Great Council meets and where most communal gatherings take place.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#FFF6E9] p-4 rounded-lg border border-[#FFC078]">
                      <h3 className="text-xl font-bold mb-2 text-[#734739]">The Misty Mountains</h3>
                      <p>
                        Home to the grizzly bears and mountain-dwelling species. The peaks contain rich deposits of Abstract 
                        Crystals, making this territory highly valuable but also dangerous due to unstable energy fields.
                      </p>
                    </div>
                    <div className="bg-[#FFF6E9] p-4 rounded-lg border border-[#FFC078]">
                      <h3 className="text-xl font-bold mb-2 text-[#734739]">The Verdant Groves</h3>
                      <p>
                        A dense forest where black bears and pandas have created elaborate tree-top communities. The forest 
                        provides abundant berries, fruits, and bamboo, and is known for its healing herbs.
                      </p>
                    </div>
                    <div className="bg-[#FFF6E9] p-4 rounded-lg border border-[#FFC078]">
                      <h3 className="text-xl font-bold mb-2 text-[#734739]">The Frozen Frontier</h3>
                      <p>
                        A tundra region where polar bears have established ice fortresses. Despite the harsh conditions, 
                        the area is rich in fish and contains unique cold-adapted Abstract Energy formations.
                      </p>
                    </div>
                    <div className="bg-[#FFF6E9] p-4 rounded-lg border border-[#FFC078]">
                      <h3 className="text-xl font-bold mb-2 text-[#734739]">The Sunlit Shores</h3>
                      <p>
                        Coastal regions where sun bears enjoy the warmth and abundant seafood. These bears have developed 
                        advanced fishing techniques and are skilled navigators, maintaining trade routes between regions.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-2xl font-bold mb-3 text-[#734739]">The Abstract Network</h3>
                    <p className="mb-4 text-lg">
                      Throughout Beartopia runs a network of Abstract Energy lines, similar to ley lines in human mythology. 
                      These energy pathways connect the five regions and power various bear technologies and enhancements.
                    </p>
                    <p className="text-lg">
                      Bears with special sensitivity to Abstract Energy, known as "Connectors," can tap into this network 
                      to communicate across vast distances or even glimpse visions of the past and future. The most powerful 
                      Connectors serve on the Great Council, helping to guide Beartopia's development.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="factions" className="space-y-6">
                  <h2 className="text-3xl font-bold mb-6 text-[#734739]">The Bear Factions</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#74C480]">The Harmonizers</h3>
                      <p className="mb-3">
                        <span className="font-bold">Philosophy:</span> Balance with nature and sustainable growth
                      </p>
                      <p className="mb-3">
                        <span className="font-bold">Leadership:</span> A council of elders from diverse bear species
                      </p>
                      <p className="mb-3">
                        <span className="font-bold">Specialties:</span> Healing, agriculture, and environmental management
                      </p>
                      <p>
                        The Harmonizers were founded by direct descendants of Ursa Major and believe that Beartopia should 
                        develop in harmony with nature. They are skilled in herbal medicine and sustainable farming practices, 
                        and their settlements are built to blend seamlessly with the natural environment.
                      </p>
                    </div>
                    
                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#FF9B42]">The Innovators</h3>
                      <p className="mb-3">
                        <span className="font-bold">Philosophy:</span> Progress through Abstract Energy technology
                      </p>
                      <p className="mb-3">
                        <span className="font-bold">Leadership:</span> A meritocracy of the most brilliant inventors
                      </p>
                      <p className="mb-3">
                        <span className="font-bold">Specialties:</span> Engineering, crystal manipulation, and infrastructure
                      </p>
                      <p>
                        The Innovators believe in harnessing Abstract Energy to its fullest potential to advance bear society. 
                        They have created remarkable technologies including crystal-powered lighting, automated honey collection 
                        systems, and weather control devices. Their headquarters is a sprawling workshop-city in the foothills 
                        of the Misty Mountains.
                      </p>
                    </div>
                    
                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#6FB5FF]">The Preservers</h3>
                      <p className="mb-3">
                        <span className="font-bold">Philosophy:</span> Maintaining bear traditions and history
                      </p>
                      <p className="mb-3">
                        <span className="font-bold">Leadership:</span> Hereditary storytellers and historians
                      </p>
                      <p className="mb-3">
                        <span className="font-bold">Specialties:</span> Oral history, artifact preservation, and education
                      </p>
                      <p>
                        The Preservers are dedicated to maintaining the cultural heritage of bears and preserving the knowledge 
                        of their journey to Beartopia. They operate a vast library carved into an ancient redwood tree in the 
                        Verdant Groves, where they train young bears in the traditional ways and arts of their ancestors.
                      </p>
                    </div>
                    
                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#734739]">The Guardians</h3>
                      <p className="mb-3">
                        <span className="font-bold">Philosophy:</span> Protection and security for all bears
                      </p>
                      <p className="mb-3">
                        <span className="font-bold">Leadership:</span> A command structure based on experience and ability
                      </p>
                      <p className="mb-3">
                        <span className="font-bold">Specialties:</span> Defense, scouting, and emergency response
                      </p>
                      <p>
                        The Guardians maintain vigilance against external threats and help resolve conflicts between bears. 
                        They patrol the borders of Beartopia, maintain the perception-distorting energy fields that hide the 
                        land from humans, and organize rescue missions during natural disasters. Their fortress in the Frozen 
                        Frontier serves as both training ground and watchtower.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-3 text-[#734739]">The Great Council</h3>
                    <p className="text-lg">
                      Representatives from all four factions meet regularly in the Honey Heartlands to make decisions that 
                      affect all of Beartopia. While tensions sometimes arise between factions with different visions for 
                      the future, the bears' shared history and the wisdom passed down from Ursa Major help them find 
                      compromise and maintain unity.
                    </p>
                    <p className="text-lg mt-3">
                      Each bear in Beartopia, regardless of species or faction, is encouraged to find their own path and 
                      contribute their unique talents to the community. Many bears choose to align with a faction that 
                      matches their personal philosophy, while others remain independent or even move between factions 
                      throughout their lives.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="future" className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/3 flex justify-center">
                      <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-[#FFC078]">
                        <Image
                          src="/images/BearishLogo.webp"
                          alt="Prophecy Crystal"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-3xl font-bold mb-4 text-[#734739]">The Seven Prophecies</h2>
                      <p className="mb-4 text-lg">
                        Before her passing, Ursa Major left behind seven cryptic prophecies etched into a special Abstract 
                        Crystal. These prophecies are said to foretell the future challenges and opportunities that will 
                        face Beartopia. Only three have been deciphered so far, with the remaining four still shrouded in mystery.
                      </p>
                      <p className="text-lg">
                        The Preservers maintain the Prophecy Crystal in a sacred cave beneath the Great Council meeting hall, 
                        where the most gifted Connector bears regularly attempt to unravel its secrets.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#734739]">The First Prophecy: The Awakening</h3>
                      <p className="italic mb-4 text-lg">
                        "When the honey flows like water and the cubs grow strong, the sleepers beneath the ancient mountain 
                        will awaken. Their knowledge will bring both wonder and woe."
                      </p>
                      <p>
                        This prophecy was fulfilled fifty years after the founding of Beartopia, when bears discovered a 
                        hibernation chamber deep within the Misty Mountains containing bears from a previously unknown species. 
                        These "Ancient Ones" possessed advanced knowledge of Abstract Energy manipulation but also brought 
                        warnings of its potential dangers.
                      </p>
                    </div>

                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#734739]">The Second Prophecy: The Great Bloom</h3>
                      <p className="italic mb-4 text-lg">
                        "In the season when stars fall like rain, the forest will bloom with flowers never before seen. 
                        Their nectar will heal old wounds but test the wisdom of the council."
                      </p>
                      <p>
                        This prophecy came to pass during a meteor shower that coincided with the hundredth anniversary of 
                        Beartopia's founding. New plant species emerged throughout the Verdant Groves, producing honey with 
                        extraordinary healing properties but also causing disputes over resource allocation and conservation.
                      </p>
                    </div>

                    <div className="bg-[#FFF6E9] p-5 rounded-xl border-2 border-[#FFC078]">
                      <h3 className="text-2xl font-bold mb-3 text-[#734739]">The Third Prophecy: The Bridge Between Worlds</h3>
                      <p className="italic mb-4 text-lg">
                        "When the crystal network glows with new light, a bridge between worlds will form. Allies will come 
                        with open paws, but shadows follow in their wake."
                      </p>
                      <p>
                        Many bears believe this prophecy refers to the recent development of new Abstract Energy technologies 
                        that allow for communication beyond Beartopia's borders. Some interpret it as a warning about 
                        potential contact with the human world, while others see it as foretelling the discovery of other 
                        hidden animal societies.
                      </p>
                    </div>

                    <div className="bg-[#FFF6E9]/50 p-5 rounded-xl border-2 border-[#FFC078] border-dashed">
                      <h3 className="text-2xl font-bold mb-3 text-[#734739]">The Fourth Through Seventh Prophecies</h3>
                      <p className="text-lg">
                        The remaining prophecies remain undeciphered, their meanings obscured by complex metaphors and 
                        references to places and concepts unknown to modern bears. The Connector bears continue their 
                        work to understand these mysteries, believing they hold the key to Beartopia's long-term survival 
                        and prosperity.
                      </p>
                      <p className="text-lg mt-3">
                        Some bears whisper that the final prophecy contains hints about a return journey—perhaps back to 
                        the wider world, or to an even more perfect paradise beyond Beartopia itself.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#74C480] text-white p-4 text-center">
        <p>&#169; 2025 Bearish - Escape to Beartopia</p>
      </footer>
    </div>
  )
}
