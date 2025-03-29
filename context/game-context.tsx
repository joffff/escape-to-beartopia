"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Resources {
  redBerries: number
  honey: number
  hunny: number
  wood: number
  stone: number
  gold: number
  crystal: number
  herbs: number
  flowers: number
  fish: number
  mushrooms: number
  clay: number
  feathers: number
  fur: number
  seeds: number
  scrolls: number
  [key: string]: number
}

interface Buildings {
  berryBush: number
  berryFarm: number
  beehive: number
  lumberMill: number
  quarry: number
  goldMine: number
  forge: number
  kitchen: number
  armory: number
  barracks: number
  university: number
  apothecary: number
  observatory: number
  tradingPost: number
  storehouse: number
  workshop: number
  shrine: number
  garden: number
  tavern: number
  embassy: number
  artisanHut: number
  [key: string]: number
}

interface Skill {
  id: string
  name: string
  icon: string
  description: string
  level: number
  maxLevel: number
  cost: Partial<Resources>
  effect: {
    type: string
    value: number
  }
  unlocked: boolean
}

interface Upgrade {
  id: string
  name: string
  icon: string
  description: string
  level: number
  maxLevel: number
  cost: Partial<Resources>
  effect: {
    type: string
    value: number
  }
  purchased: boolean
  unlocked: boolean
}

interface QuestRewards {
  redBerries?: number
  honey: number
  hunny: number
  wood: number
  stone: number
  gold: number
  xp: number
  skillPoints: number
  [key: string]: number | undefined
}

interface ResourceRequirement {
  type: string
  amount: number
  icon: string
}

interface Quest {
  id: string
  title: string
  description: string
  difficulty: string
  duration: number
  progress: number
  status: string
  rewards: QuestRewards
  requiredResources: ResourceRequirement[]
}

interface Quests {
  available: Quest[]
  active: Quest[]
  completed: string[]
}

interface Season {
  name: string
  icon: string
  day: number
  bonusType: string
  bonusValue: number
}

interface PlayerStats {
  level: number
  xp: number
  xpToNextLevel: number
  skillPoints: number
  allianceUnlocked: boolean
  currentRegion: string
}

interface GameState {
  resources: Resources
  buildings: Buildings
  upgrades: Upgrade[]
  skills: Skill[]
  quests: Quests
  season: Season
  playerStats: PlayerStats
  lastSaved: number
}

// Add this function to verify saved data integrity
const verifySavedData = (savedData: string): boolean => {
  try {
    const parsedData = JSON.parse(savedData)

    // Check for required properties
    const requiredProps = ["resources", "buildings", "upgrades", "skills", "quests", "playerStats"]
    for (const prop of requiredProps) {
      if (!parsedData[prop]) {
        console.error(`Saved data missing required property: ${prop}`)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error verifying saved data:", error)
    return false
  }
}

// Add lastSaved to the GameContextType interface
interface GameContextType {
  resources: Resources
  buildings: Buildings
  upgrades: Upgrade[]
  skills: Skill[]
  quests: Quests
  season: Season
  playerStats: PlayerStats
  updateResources: (newResources: Resources) => void
  purchaseBuilding: (buildingId: string) => void
  purchaseUpgrade: (upgradeId: string) => void
  upgradeSkill: (skillId: string) => void
  startQuest: (questId: string) => void
  completeQuest: (questId: string) => void
  clickBerry: () => void
  refineHoney: () => void
  berryClickValue: number
  passiveIncomeRate: {
    redBerries: number
    honey: number
    hunny: number
    wood: number
    stone: number
    gold: number
    crystal: number
    herbs: number
    flowers: number
    fish: number
    mushrooms: number
    clay: number
    feathers: number
    fur: number
    seeds: number
    scrolls: number
  }
  saveGame: () => boolean
  resetGame: () => void
  setCurrentRegion: (regionId: string) => void
  lastSaved: number
  offlineProgress: { timeAway: number; gains: Partial<Resources> } | null
  dismissOfflineProgress: () => void
  debugSaveSystem: () => any
}

const GameContext = createContext<GameContextType | undefined>(undefined)

// Initial game state
const initialGameState: GameState = {
  resources: {
    redBerries: 2, // Starting with fewer red berries since they're now premium
    honey: 5,
    hunny: 100, // Starting with more HUNNY as it's now the primary currency
    wood: 0,
    stone: 0,
    gold: 0,
    crystal: 0,
    herbs: 0,
    flowers: 0,
    fish: 0,
    mushrooms: 0,
    clay: 0,
    feathers: 0,
    fur: 0,
    seeds: 0,
    scrolls: 0,
  },
  buildings: {
    berryBush: 0,
    berryFarm: 0,
    beehive: 0,
    lumberMill: 0,
    quarry: 0,
    goldMine: 0,
    forge: 0,
    kitchen: 0,
    armory: 0,
    barracks: 0,
    university: 0,
    apothecary: 0,
    observatory: 0,
    tradingPost: 0,
    storehouse: 0,
    workshop: 0,
    shrine: 0,
    garden: 0,
    tavern: 0,
    embassy: 0,
    artisanHut: 0,
  },
  upgrades: [
    {
      id: "honeyBasket",
      name: "Honey Basket",
      icon: "🧺",
      description: "Boosts passive honey collection",
      level: 1,
      maxLevel: 5,
      cost: { hunny: 20 },
      effect: { type: "passiveHoneyMultiplier", value: 1 },
      purchased: true,
      unlocked: true,
    },
    {
      id: "sniffingNose",
      name: "Sniffing Nose",
      icon: "👃",
      description: "5% chance of finding bonus honey",
      level: 1,
      maxLevel: 3,
      cost: { hunny: 40 },
      effect: { type: "bonusHoneyChance", value: 0.05 },
      purchased: true,
      unlocked: true,
    },
    {
      id: "helperCub",
      name: "Helper Cub",
      icon: "🐻‍❄️",
      description: "Baby bear collects honey for you",
      level: 0,
      maxLevel: 3,
      cost: { hunny: 50 },
      effect: { type: "autoClicker", value: 0.2 },
      purchased: false,
      unlocked: true,
    },
    {
      id: "honeyHiveUpgrade",
      name: "Honey Hive",
      icon: "🐝",
      description: "Doubles passive honey income",
      level: 0,
      maxLevel: 1,
      cost: { hunny: 100 },
      effect: { type: "passiveHoneyMultiplier", value: 2 },
      purchased: false,
      unlocked: true,
    },
    {
      id: "goldProspecting",
      name: "Gold Prospecting",
      icon: "⛏️",
      description: "Learn to find gold",
      level: 0,
      maxLevel: 1,
      cost: { hunny: 75, wood: 10 },
      effect: { type: "unlockGold", value: 1 },
      purchased: false,
      unlocked: true,
    },
    {
      id: "honeyRefinery",
      name: "Honey Refinery",
      icon: "🏭",
      description: "Refine honey into HUNNY currency",
      level: 0,
      maxLevel: 3,
      cost: { honey: 20, wood: 15 },
      effect: { type: "honeyToHunnyRate", value: 0.5 },
      purchased: false,
      unlocked: true,
    },
  ],
  skills: [
    {
      id: "pawStrength",
      name: "Paw Strength",
      icon: "🐾",
      description: "Increases honey per click",
      level: 1,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "clickMultiplier", value: 1 },
      unlocked: true,
    },
    {
      id: "foraging",
      name: "Foraging",
      icon: "🍯",
      description: "Improves honey and herb collection",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "foragingMultiplier", value: 0.1 },
      unlocked: true,
    },
    {
      id: "woodcutting",
      name: "Woodcutting",
      icon: "🪓",
      description: "Improves wood gathering",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "woodcuttingMultiplier", value: 0.1 },
      unlocked: true,
    },
    {
      id: "mining",
      name: "Mining",
      icon: "⛏️",
      description: "Improves stone and gold collection",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "miningMultiplier", value: 0.1 },
      unlocked: true,
    },
    {
      id: "fishing",
      name: "Fishing",
      icon: "🎣",
      description: "Allows gathering fish resources",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "fishingMultiplier", value: 0.1 },
      unlocked: false,
    },
    {
      id: "crafting",
      name: "Crafting",
      icon: "🔨",
      description: "Improves item creation efficiency",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "craftingMultiplier", value: 0.1 },
      unlocked: false,
    },
    {
      id: "building",
      name: "Building",
      icon: "🏗️",
      description: "Reduces construction time and cost",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "buildingCostReduction", value: 0.05 },
      unlocked: false,
    },
    {
      id: "cooking",
      name: "Cooking",
      icon: "🍲",
      description: "Creates better food for workers",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "cookingMultiplier", value: 0.1 },
      unlocked: false,
    },
    {
      id: "alchemy",
      name: "Alchemy",
      icon: "⚗️",
      description: "Creates potions from herbs",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "alchemyMultiplier", value: 0.1 },
      unlocked: false,
    },
    {
      id: "leadership",
      name: "Leadership",
      icon: "👑",
      description: "Improves worker bear efficiency",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "leadershipMultiplier", value: 0.1 },
      unlocked: false,
    },
    {
      id: "defense",
      name: "Defense",
      icon: "🛡️",
      description: "Improves protection against attacks",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "defenseMultiplier", value: 0.1 },
      unlocked: false,
    },
    {
      id: "trading",
      name: "Trading",
      icon: "💱",
      description: "Better exchange rates at trading post",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "tradingMultiplier", value: 0.1 },
      unlocked: false,
    },
    {
      id: "exploration",
      name: "Exploration",
      icon: "🧭",
      description: "Discover new areas more efficiently",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "explorationMultiplier", value: 0.1 },
      unlocked: false,
    },
    {
      id: "diplomacy",
      name: "Diplomacy",
      icon: "🤝",
      description: "Better relations with other species",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "diplomacyMultiplier", value: 0.1 },
      unlocked: false,
    },
    {
      id: "wisdom",
      name: "Wisdom",
      icon: "📚",
      description: "Faster learning of other skills",
      level: 0,
      maxLevel: 10,
      cost: { skillPoints: 1 },
      effect: { type: "wisdomMultiplier", value: 0.1 },
      unlocked: false,
    },
  ],
  quests: {
    available: [
      {
        id: "quest1",
        title: "Honey Gathering",
        description: "Collect honey to feed the hungry bear cubs.",
        difficulty: "Easy",
        duration: 60, // seconds
        progress: 0,
        status: "Not started",
        rewards: {
          hunny: 25,
          honey: 5,
          wood: 0,
          stone: 0,
          gold: 0,
          xp: 10,
          skillPoints: 1,
        },
        requiredResources: [],
      },
      {
        id: "quest2",
        title: "Build a Shelter",
        description: "Construct a basic shelter to protect from the elements.",
        difficulty: "Medium",
        duration: 120,
        progress: 0,
        status: "Not started",
        rewards: {
          hunny: 50,
          honey: 10,
          wood: 5,
          stone: 0,
          gold: 0,
          xp: 20,
          skillPoints: 1,
        },
        requiredResources: [{ type: "hunny", amount: 15, icon: "🍯" }],
      },
      {
        id: "quest3",
        title: "Honey Harvest",
        description: "Carefully collect honey from wild beehives.",
        difficulty: "Hard",
        duration: 180,
        progress: 0,
        status: "Not started",
        rewards: {
          hunny: 75,
          honey: 20,
          wood: 10,
          stone: 5,
          gold: 0,
          xp: 30,
          skillPoints: 2,
        },
        requiredResources: [
          { type: "hunny", amount: 25, icon: "🍯" },
          { type: "wood", amount: 10, icon: "🪵" },
        ],
      },
      {
        id: "quest4",
        title: "Gold Rush",
        description: "Search for gold in the mountain streams.",
        difficulty: "Very Hard",
        duration: 300,
        progress: 0,
        status: "Not started",
        rewards: {
          hunny: 100,
          honey: 15,
          wood: 0,
          stone: 0,
          gold: 10,
          xp: 50,
          skillPoints: 3,
          // Rare chance to get a red berry as a special reward
          redBerries: 1,
        },
        requiredResources: [
          { type: "hunny", amount: 40, icon: "🍯" },
          { type: "wood", amount: 20, icon: "🪵" },
        ],
      },
    ],
    active: [],
    completed: [],
  },
  season: {
    name: "Spring",
    icon: "🌱",
    day: 0,
    bonusType: "honeyMultiplier",
    bonusValue: 1.2,
  },
  playerStats: {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    skillPoints: 0,
    allianceUnlocked: false,
    currentRegion: "starting_village",
  },
  lastSaved: Date.now(),
}

export function GameProvider({ children }: { children: ReactNode }) {
  // Load game state from localStorage or use initial state
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("beartopia-game-state")
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState)
          console.log("Loaded saved game state:", parsedState)
          return parsedState
        } catch (error) {
          console.error("Failed to parse saved game state:", error)
        }
      }
    }
    return initialGameState
  })

  const { resources, buildings, upgrades, skills, quests, season, playerStats } = gameState

  // Update the saveGame function to be more robust
  const saveGame = () => {
    try {
      const stateToSave = {
        ...gameState,
        lastSaved: Date.now(),
      }
      localStorage.setItem("beartopia-game-state", JSON.stringify(stateToSave))
      console.log("Game state saved:", new Date().toLocaleTimeString())

      // Update the lastSaved timestamp in the state
      setGameState((prev) => ({
        ...prev,
        lastSaved: Date.now(),
      }))
      return true
    } catch (error) {
      console.error("Failed to save game state:", error)
      return false
    }
  }

  // Reset game state
  const resetGame = () => {
    localStorage.removeItem("beartopia-game-state")
    setGameState(initialGameState)
    console.log("Game state reset to initial state")
  }

  // Modify the auto-save to run more frequently (every 30 seconds)
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame()
    }, 30000) // Save every 30 seconds

    return () => clearInterval(saveInterval)
  }, [])

  // Add save on window beforeunload event to ensure state is saved when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGame()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  // Add a state for showing the offline progress modal
  const [offlineProgress, setOfflineProgress] = useState(null)

  // Add a function to calculate offline progress
  const calculateOfflineProgress = (lastSavedTime: number) => {
    const currentTime = Date.now()
    const timeAwayMs = currentTime - lastSavedTime

    // Don't calculate if time away is less than a minute
    if (timeAwayMs < 60000) return null

    // Calculate time away in minutes (capped at 24 hours to prevent excessive resources)
    const timeAwayMinutes = Math.min(timeAwayMs / 60000, 24 * 60)

    // Calculate resources gained while away
    const offlineGains: Partial<Resources> = {}

    // Lower efficiency to 25% for offline progress
    const OFFLINE_EFFICIENCY = 0.25

    Object.entries(passiveIncomeRate).forEach(([resource, rate]) => {
      // Don't include red berries in offline gains
      if (resource !== "redBerries" && rate > 0) {
        // Calculate resources gained with reduced efficiency
        const gained = rate * timeAwayMinutes * 60 * OFFLINE_EFFICIENCY
        if (gained > 0) {
          offlineGains[resource] = gained
        }
      }
    })

    return {
      timeAway: timeAwayMinutes,
      gains: offlineGains,
    }
  }

  // Update the useEffect to set the offline progress state
  useEffect(() => {
    if (typeof window !== "undefined" && gameState.lastSaved) {
      const progress = calculateOfflineProgress(gameState.lastSaved)

      if (progress && Object.keys(progress.gains).length > 0) {
        // Apply offline gains
        const newResources = { ...resources }

        Object.entries(progress.gains).forEach(([resource, amount]) => {
          newResources[resource] += amount
        })

        // Update resources with offline gains
        setGameState((prev) => ({
          ...prev,
          resources: newResources,
          lastSaved: Date.now(),
        }))

        // Set offline progress to show modal
        setOfflineProgress(progress)

        // Log offline progress for debugging
        console.log(`Applied offline progress for ${Math.round(progress.timeAway)} minutes:`, progress.gains)
      }
    }
  }, [])

  // Add a function to dismiss the offline progress modal
  const dismissOfflineProgress = () => {
    setOfflineProgress(null)
  }

  // Add the debugSaveSystem function
  const debugSaveSystem = () => {
    try {
      // Check if localStorage is available
      const testKey = "beartopia-storage-test"
      localStorage.setItem(testKey, "test")
      if (localStorage.getItem(testKey) !== "test") {
        return { success: false, error: "localStorage not working properly" }
      }
      localStorage.removeItem(testKey)

      // Check current saved data
      const currentSave = localStorage.getItem("beartopia-game-state")
      const hasSavedData = !!currentSave

      // Try to save current state
      const saveSuccess = saveGame()

      return {
        success: saveSuccess,
        hasSavedData,
        storageAvailable: true,
        savedDataSize: currentSave ? currentSave.length : 0,
        browserStorage: {
          storageAvailable: !!navigator.storage,
          remaining: "unknown" // Would require storage API permission to get
        }
      }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  // Calculate berry click value based on skills and upgrades
  const calculateBerryClickValue = () => {
    let value = 0.2 // Base click value

    // Apply paw strength skill
    const pawStrength = skills.find((s) => s.id === "pawStrength")
    if (pawStrength) {
      value *= 1 + pawStrength.effect.value * pawStrength.level
    }

    // Apply sniffing nose upgrade
    const sniffingNose = upgrades.find((u) => u.id === "sniffingNose")
    if (sniffingNose && sniffingNose.purchased) {
      // This is a chance-based upgrade, so we don't apply it here
    }

    // Apply season bonus if applicable
    if (season.bonusType === "berryMultiplier") {
      value *= season.bonusValue
    }

    return value
  }

  // Calculate honey click value based on skills and upgrades
  const calculateHoneyClickValue = () => {
    let value = 0.2 // Base click value

    // Apply paw strength skill
    const pawStrength = skills.find((s) => s.id === "pawStrength")
    if (pawStrength) {
      value *= 1 + pawStrength.effect.value * pawStrength.level
    }

    // Apply sniffing nose upgrade
    const sniffingNose = upgrades.find((u) => u.id === "sniffingNose")
    if (sniffingNose && sniffingNose.purchased) {
      // This is a chance-based upgrade, so we don't apply it here
    }

    // Apply season bonus if applicable
    if (season.bonusType === "honeyMultiplier") {
      value *= season.bonusValue
    }

    return value
  }

  // Calculate passive income rates
  const calculatePassiveIncomeRates = () => {
    let honeyRate = 0
    let woodRate = 0
    let stoneRate = 0
    let goldRate = 0
    let crystalRate = 0
    let herbsRate = 0
    let flowersRate = 0
    let fishRate = 0
    let mushroomsRate = 0
    let clayRate = 0
    let feathersRate = 0
    let furRate = 0
    let seedsRate = 0
    let scrollsRate = 0
    const hunnyRate = 0
    // Red berries are now premium and not generated passively
    const redBerriesRate = 0

    // Base rates from buildings
    honeyRate += buildings.beehive * 0.1
    woodRate += buildings.lumberMill * 0.3
    stoneRate += buildings.quarry * 0.2
    goldRate += buildings.goldMine * 0.05

    // Advanced buildings
    herbsRate += buildings.garden * 0.1
    flowersRate += buildings.garden * 0.05
    fishRate += buildings.fishingSpot * 0.1
    mushroomsRate += buildings.forest * 0.05
    clayRate += buildings.clayPit * 0.1
    feathersRate += buildings.aviary * 0.05
    furRate += buildings.huntingLodge * 0.05
    seedsRate += buildings.garden * 0.02
    scrollsRate += buildings.university * 0.01
    crystalRate += buildings.crystalMine * 0.02

    // Apply honey basket upgrade
    const honeyBasket = upgrades.find((u) => u.id === "honeyBasket")
    if (honeyBasket && honeyBasket.purchased) {
      honeyRate *= honeyBasket.effect.value * honeyBasket.level
    }

    // Apply honey hive upgrade
    const honeyHiveUpgrade = upgrades.find((u) => u.id === "honeyHiveUpgrade")
    if (honeyHiveUpgrade && honeyHiveUpgrade.purchased) {
      honeyRate *= honeyHiveUpgrade.effect.value
    }

    // Apply helper cub upgrade
    const helperCub = upgrades.find((u) => u.id === "helperCub")
    if (helperCub && helperCub.purchased) {
      honeyRate += helperCub.effect.value * helperCub.level
    }

    // Apply skills
    const foraging = skills.find((s) => s.id === "foraging")
    if (foraging && foraging.level > 0) {
      honeyRate *= 1 + foraging.effect.value * foraging.level
      herbsRate *= 1 + foraging.effect.value * foraging.level
    }

    const woodcutting = skills.find((s) => s.id === "woodcutting")
    if (woodcutting && woodcutting.level > 0) {
      woodRate *= 1 + woodcutting.effect.value * woodcutting.level
    }

    const mining = skills.find((s) => s.id === "mining")
    if (mining && mining.level > 0) {
      stoneRate *= 1 + mining.effect.value * mining.level
      goldRate *= 1 + mining.effect.value * mining.level
    }

    const fishing = skills.find((s) => s.id === "fishing")
    if (fishing && fishing.level > 0) {
      fishRate *= 1 + fishing.effect.value * fishing.level
    }

    // Check if gold is unlocked
    const goldProspecting = upgrades.find((u) => u.id === "goldProspecting")
    if (!goldProspecting || !goldProspecting.purchased) {
      goldRate = 0
    }

    return {
      redBerries: redBerriesRate, // No passive generation of red berries
      honey: honeyRate,
      hunny: 0, // HUNNY is not generated passively, it's refined from honey
      wood: woodRate,
      stone: stoneRate,
      gold: goldRate,
      crystal: crystalRate,
      herbs: herbsRate,
      flowers: flowersRate,
      fish: fishRate,
      mushrooms: mushroomsRate,
      clay: clayRate,
      feathers: feathersRate,
      fur: furRate,
      seeds: seedsRate,
      scrolls: scrollsRate,
    }
  }

  // Refine honey into HUNNY
  const refineHoney = () => {
    // Check if player has the honey refinery upgrade
    const honeyRefinery = upgrades.find((u) => u.id === "honeyRefinery")
    if (!honeyRefinery || !honeyRefinery.purchased) return

    // Calculate how much honey to convert
    const conversionRate = honeyRefinery.effect.value * honeyRefinery.level
    const honeyToConvert = Math.min(resources.honey, 1) // Convert 1 honey at a time

    if (honeyToConvert > 0) {
      setGameState((prev) => ({
        ...prev,
        resources: {
          ...prev.resources,
          honey: prev.resources.honey - honeyToConvert,
          hunny: prev.resources.hunny + honeyToConvert * conversionRate * 10, // Each honey gives 5-15 HUNNY based on level
        },
      }))
    }
  }

  const berryClickValue = calculateBerryClickValue()
  const passiveIncomeRate = calculatePassiveIncomeRates()
  const honeyClickValue = calculateHoneyClickValue()

  // Add save calls to important game actions
  // Update the clickBerry function to save after significant resource changes
  const clickBerry = () => {
    let berryGain = berryClickValue

    // Check for bonus berries from sniffing nose
    const sniffingNose = upgrades.find((u) => u.id === "sniffingNose")
    if (sniffingNose && sniffingNose.purchased) {
      const bonusChance = sniffingNose.effect.value * sniffingNose.level
      if (Math.random() < bonusChance) {
        berryGain *= 2
      }
    }

    setGameState((prev) => ({
      ...prev,
      resources: {
        ...prev.resources,
        redBerries: prev.resources.redBerries + berryGain,
      },
    }))

    // Save after collecting a significant amount (e.g., 10 clicks)
    if (Math.random() < 0.1) {
      saveGame()
    }
  }

  // Update the clickBerry function to clickHoney
  const clickHoney = () => {
    let honeyGain = honeyClickValue

    // Check for bonus honey from sniffing nose
    const sniffingNose = upgrades.find((u) => u.id === "sniffingNose")
    if (sniffingNose && sniffingNose.purchased) {
      const bonusChance = sniffingNose.effect.value * sniffingNose.level
      if (Math.random() < bonusChance) {
        honeyGain *= 2
      }
    }

    setGameState((prev) => ({
      ...prev,
      resources: {
        ...prev.resources,
        honey: prev.resources.honey + honeyGain,
      },
    }))

    // Save after collecting a significant amount (e.g., 10 clicks)
    if (Math.random() < 0.1) {
      saveGame()
    }
  }

  // Update resources
  const updateResources = (newResources: Resources) => {
    setGameState((prev) => ({
      ...prev,
      resources: newResources,
    }))
  }

  // Update purchaseBuilding to save after building purchase
  const purchaseBuilding = (buildingId: string) => {
    // Find building costs
    let cost: Record<string, number> = {}

    switch (buildingId) {
      case "beehive":
        cost = { hunny: 50, wood: 10 }
        break
      case "berryBush": // Make berry bushes extremely expensive
        cost = { hunny: 800, wood: 100, stone: 50, gold: 10 }
        break
      case "berryFarm": // Make berry farms prohibitively expensive
        cost = { hunny: 2000, wood: 300, stone: 150, gold: 25, crystal: 5 }
        break
      case "lumberMill":
        cost = { hunny: 75, honey: 20 }
        break
      case "quarry":
        cost = { hunny: 100, wood: 50 }
        break
      case "goldMine":
        cost = { hunny: 150, stone: 75 }
        break
      case "forge":
        cost = { hunny: 200, stone: 100, wood: 100 }
        break
      case "kitchen":
        cost = { hunny: 100, wood: 80, stone: 50 }
        break
      case "armory":
        cost = { hunny: 150, wood: 120, stone: 80 }
        break
      case "barracks":
        cost = { hunny: 250, wood: 200, stone: 150 }
        break
      case "university":
        cost = { hunny: 300, wood: 250, stone: 200 }
        break
      case "apothecary":
        cost = { hunny: 120, wood: 100, herbs: 50 }
        break
      case "observatory":
        cost = { hunny: 400, stone: 300, crystal: 20 }
        break
      case "tradingPost":
        cost = { hunny: 200, wood: 150, stone: 100 }
        break
      case "storehouse":
        cost = { hunny: 150, wood: 200, stone: 100 }
        break
      case "workshop":
        cost = { hunny: 180, wood: 150, stone: 80 }
        break
      case "shrine":
        cost = { hunny: 250, stone: 200, crystal: 30 }
        break
      case "garden":
        cost = { hunny: 100, wood: 80, seeds: 20 }
        break
      case "tavern":
        cost = { hunny: 200, wood: 200, stone: 100 }
        break
      case "embassy":
        cost = { hunny: 300, wood: 250, stone: 200 }
        break
      case "artisanHut":
        cost = { hunny: 150, wood: 100, clay: 50 }
        break
    }

    // Apply building skill cost reduction if available
    const buildingSkill = skills.find((s) => s.id === "building")
    if (buildingSkill && buildingSkill.level > 0) {
      const reduction = buildingSkill.effect.value * buildingSkill.level
      Object.keys(cost).forEach((resource) => {
        cost[resource] = Math.floor(cost[resource] * (1 - reduction))
      })
    }

    // Check if player can afford
    const canAfford = Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount)

    if (canAfford) {
      // Deduct resources
      const newResources = { ...resources }
      Object.entries(cost).forEach(([resource, amount]) => {
        newResources[resource] -= amount
      })

      // Add building
      setGameState((prev) => ({
        ...prev,
        buildings: {
          ...prev.buildings,
          [buildingId]: prev.buildings[buildingId] + 1,
        },
        resources: newResources,
      }))

      // Save game after purchasing a building
      saveGame()
    }
  }

  // Update purchaseUpgrade to save after upgrade purchase
  const purchaseUpgrade = (upgradeId: string) => {
    const upgradeIndex = upgrades.findIndex((u) => u.id === upgradeId)

    if (upgradeIndex === -1) return

    const upgrade = upgrades[upgradeIndex]

    // Check if already at max level
    if (upgrade.level >= upgrade.maxLevel) return

    // Calculate cost based on current level
    const costMultiplier = upgrade.level + 1
    const currentCost: Partial<Resources> = {}

    Object.entries(upgrade.cost).forEach(([resource, baseAmount]) => {
      currentCost[resource] = baseAmount * costMultiplier
    })

    // Check if player can afford
    const canAfford = Object.entries(currentCost).every(([resource, amount]) => resources[resource] >= amount)

    if (canAfford) {
      // Deduct resources
      const newResources = { ...resources }
      Object.entries(currentCost).forEach(([resource, amount]) => {
        newResources[resource] -= amount
      })

      // Update upgrade
      const newUpgrades = [...upgrades]
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        level: upgrade.level + 1,
        purchased: true,
      }

      // Check for special upgrades that unlock features
      if (upgrade.id === "goldProspecting" && upgrade.level === 0) {
        // Gold prospecting unlocks gold resource
        console.log("Gold resource unlocked!")
      }

      setGameState((prev) => ({
        ...prev,
        upgrades: newUpgrades,
        resources: newResources,
      }))

      // Save game after purchasing an upgrade
      saveGame()
    }
  }

  // Update upgradeSkill to save after skill upgrade
  const upgradeSkill = (skillId: string) => {
    const skillIndex = skills.findIndex((s) => s.id === skillId)

    if (skillIndex === -1) return

    const skill = skills[skillIndex]

    // Check if already at max level
    if (skill.level >= skill.maxLevel) return

    // Check if player has enough skill points
    if (playerStats.skillPoints < skill.cost.skillPoints) return

    // Update skill
    const newSkills = [...skills]
    newSkills[skillIndex] = {
      ...skill,
      level: skill.level + 1,
    }

    // Deduct skill points
    const newPlayerStats = {
      ...playerStats,
      skillPoints: playerStats.skillPoints - skill.cost.skillPoints,
    }

    setGameState((prev) => ({
      ...prev,
      skills: newSkills,
      playerStats: newPlayerStats,
    }))

    // Save game after upgrading a skill
    saveGame()
  }

  // Start quest
  const startQuest = (questId: string) => {
    const questIndex = quests.available.findIndex((q) => q.id === questId)

    if (questIndex !== -1) {
      const quest = quests.available[questIndex]

      // Check if required resources are available
      const canStart = quest.requiredResources.every((req) => resources[req.type] >= req.amount)

      if (canStart) {
        // Deduct required resources
        const newResources = { ...resources }
        quest.requiredResources.forEach((req) => {
          newResources[req.type] -= req.amount
        })

        // Move quest from available to active
        const newAvailable = [...quests.available]
        newAvailable.splice(questIndex, 1)

        const activeQuest = {
          ...quest,
          status: "In progress",
          progress: 0,
        }

        setGameState((prev) => ({
          ...prev,
          quests: {
            ...prev.quests,
            available: newAvailable,
            active: [...prev.quests.active, activeQuest],
          },
          resources: newResources,
        }))
      }
    }
  }

  // Update completeQuest to save after quest completion
  const completeQuest = (questId: string) => {
    const questIndex = quests.active.findIndex((q) => q.id === questId)

    if (questIndex !== -1 && quests.active[questIndex].progress >= 100) {
      const quest = quests.active[questIndex]

      // Add rewards
      const newResources = { ...resources }
      let xpGain = 0
      let skillPointsGain = 0

      Object.entries(quest.rewards).forEach(([resource, amount]) => {
        if (resource === "xp") {
          xpGain = amount
        } else if (resource === "skillPoints") {
          skillPointsGain = amount
        } else {
          newResources[resource] += amount
        }
      })

      // Move quest from active to completed
      const newActive = [...quests.active]
      newActive.splice(questIndex, 1)

      // Update player XP and check for level up
      const newPlayerStats = { ...playerStats }
      newPlayerStats.xp += xpGain
      newPlayerStats.skillPoints += skillPointsGain

      // Check for level up
      if (newPlayerStats.xp >= newPlayerStats.xpToNextLevel) {
        newPlayerStats.level += 1
        newPlayerStats.xp -= newPlayerStats.xpToNextLevel
        newPlayerStats.xpToNextLevel = Math.floor(newPlayerStats.xpToNextLevel * 1.5)
        newPlayerStats.skillPoints += 2 // Bonus skill points on level up

        // Check if alliance should be unlocked (at level 5)
        if (newPlayerStats.level >= 5 && !newPlayerStats.allianceUnlocked) {
          newPlayerStats.allianceUnlocked = true
          console.log("Alliance feature unlocked!")
        }
      }

      setGameState((prev) => ({
        ...prev,
        quests: {
          ...prev.quests,
          active: newActive,
          completed: [...prev.quests.completed, questId],
        },
        resources: newResources,
        playerStats: newPlayerStats,
      }))

      // Save game after completing a quest
      saveGame()
    }
  }

  // Progress active quests
  useEffect(() => {
    if (quests.active.length === 0) return

    const interval = setInterval(() => {
      setGameState((prev) => {
        const updatedActive = prev.quests.active.map((quest) => {
          const progressIncrement = (100 / quest.duration) * 1 // 1 second per interval

          return {
            ...quest,
            progress: Math.min(quest.progress + progressIncrement, 100),
            status: quest.progress + progressIncrement >= 100 ? "Ready to complete" : "In progress",
          }
        })

        return {
          ...prev,
          quests: {
            ...prev.quests,
            active: updatedActive,
          },
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [quests.active])

  // Passive resource generation and honey refining
  useEffect(() => {
    const interval = setInterval(() => {
      // Regular passive income
      setGameState((prev) => ({
        ...prev,
        resources: {
          ...prev.resources,
          redBerries: prev.resources.redBerries + passiveIncomeRate.redBerries,
          honey: prev.resources.honey + passiveIncomeRate.honey,
          hunny: prev.resources.hunny + passiveIncomeRate.hunny,
          wood: prev.resources.wood + passiveIncomeRate.wood,
          stone: prev.resources.stone + passiveIncomeRate.stone,
          gold: prev.resources.gold + passiveIncomeRate.gold,
          crystal: prev.resources.crystal + passiveIncomeRate.crystal,
          herbs: prev.resources.herbs + passiveIncomeRate.herbs,
          flowers: prev.resources.flowers + passiveIncomeRate.flowers,
          fish: prev.resources.fish + passiveIncomeRate.fish,
          mushrooms: prev.resources.mushrooms + passiveIncomeRate.mushrooms,
          clay: prev.resources.clay + passiveIncomeRate.clay,
          feathers: prev.resources.feathers + passiveIncomeRate.feathers,
          fur: prev.resources.fur + passiveIncomeRate.fur,
          seeds: prev.resources.seeds + passiveIncomeRate.seeds,
          scrolls: prev.resources.scrolls + passiveIncomeRate.scrolls,
        },
      }))

      // Refine honey into HUNNY if the player has the upgrade
      refineHoney()
    }, 1000)

    return () => clearInterval(interval)
  }, [passiveIncomeRate])

  // Season progression
  useEffect(() => {
    const seasonInterval = setInterval(() => {
      setGameState((prev) => {
        const newDay = prev.season.day + 1

        // Change season every 30 days
        if (newDay >= 30) {
          const seasons = [
            { name: "Spring", icon: "🌱", bonusType: "berryMultiplier", bonusValue: 1.2 },
            { name: "Summer", icon: "☀️", bonusType: "honeyMultiplier", bonusValue: 1.5 },
            { name: "Fall", icon: "🍂", bonusType: "woodMultiplier", bonusValue: 1.3 },
            { name: "Winter", icon: "❄️", bonusType: "crystalMultiplier", bonusValue: 1.4 },
          ]

          const currentIndex = seasons.findIndex((s) => s.name === prev.season.name)
          const nextIndex = (currentIndex + 1) % seasons.length

          return {
            ...prev,
            season: {
              ...seasons[nextIndex],
              day: 0,
            },
          }
        }

        return {
          ...prev,
          season: {
            ...prev.season,
            day: newDay,
          },
        }
      })
    }, 60000) // Change day every minute for testing

    return () => clearInterval(seasonInterval)
  }, [])

  // Set current region
  const setCurrentRegion = (regionId: string) => {
    setGameState((prev) => ({
      ...prev,
      playerStats: {
        ...prev.playerStats,
        currentRegion: regionId,
      },
    }))
  }

  // Include offlineProgress and dismissOfflineProgress in the context provider value
  return (
    <GameContext.Provider
      value={{
        resources,
        buildings,
        upgrades,
        skills,
        quests,
        season,
        playerStats,
        updateResources,
        purchaseBuilding,
        purchaseUpgrade,
        upgradeSkill,
        startQuest,
        completeQuest,
        clickBerry,
        refineHoney,
        berryClickValue,
        passiveIncomeRate,
        saveGame,
        resetGame,
        setCurrentRegion,
        lastSaved: gameState.lastSaved,
        offlineProgress,
        dismissOfflineProgress,
        debugSaveSystem,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGameState() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameProvider")
  }
  return context
}
