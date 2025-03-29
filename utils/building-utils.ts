// Utility functions for building definitions and rendering

/**
 * Get building definition by ID
 */
export function getBuildingDefinition(buildingId: string) {
  const BUILDING_DEFINITIONS = {
    beehive: {
      id: "beehive",
      name: "Beehive",
      icon: "/images/beehive1.webp",
      isImage: true,
      description: "Produces honey over time.",
      cost: { wood: 20, stone: 0 },
      size: "xs",
    },
    berry_farm: {
      id: "berry_farm",
      name: "Berry Farm",
      icon: "🍓",
      description: "Produces berries over time.",
      cost: { wood: 15, stone: 0 },
      size: "xs",
    },
    den: {
      id: "den",
      name: "Bear Den",
      icon: "🏠",
      description: "Your home base. Provides shelter and basic storage.",
      cost: { wood: 10, stone: 5 },
      size: "sm",
    },
    lumber_mill: {
      id: "lumber_mill",
      name: "Lumber Mill",
      icon: "/images/sawmill1.webp",
      isImage: true,
      description: "Processes wood more efficiently.",
      cost: { wood: 25, stone: 10 },
      size: "sm",
    },
    quarry: {
      id: "quarry",
      name: "Quarry",
      icon: "🪨",
      description: "Extracts stone resources.",
      cost: { wood: 20, stone: 5 },
      size: "sm",
    },
  }

  return BUILDING_DEFINITIONS[buildingId as keyof typeof BUILDING_DEFINITIONS] || null
}

/**
 * Get object size in pixels based on type and size
 */
export function getObjectSizeInPixels(objectType: string, size?: string, objectId?: string) {
  // Make buildings 2-3 times larger than resources
  let multiplier = objectType === "building" ? 2.5 : 1

  // Check if this is a beehive and make it much larger than other buildings
  if (objectType === "building" && objectId && objectId.includes("beehive")) {
    multiplier = 5.0 // Make beehives 5x larger than resources (2x larger than other buildings)
  }

  // Check if this is a sawmill/lumber mill and make it larger
  if (objectType === "building" && objectId && (objectId.includes("lumber") || objectId.includes("sawmill"))) {
    multiplier = 4.0 // Make sawmill 4x larger than resources
  }

  switch (size) {
    case "xs":
      return 28 * multiplier
    case "sm":
      return 36 * multiplier
    case "md":
      return 52 * multiplier
    case "lg":
      return 68 * multiplier
    default:
      return 36 * multiplier
  }
}
