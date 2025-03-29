// Utility functions for alliance map and interactions

/**
 * Calculate success chance for an attack based on attacker and defender forces
 */
export function calculateAttackSuccess(attackerForces: number, defenderForces: number): number {
  // Base success chance is 50%
  const baseChance = 0.5

  // Calculate force ratio (attacker / defender)
  const forceRatio = attackerForces / defenderForces

  // Adjust success chance based on force ratio
  // If forces are equal, chance remains at 50%
  // If attacker has 2x forces, chance increases to ~75%
  // If defender has 2x forces, chance decreases to ~25%
  const adjustedChance = baseChance * Math.sqrt(forceRatio)

  // Clamp between 5% and 95% (there's always a small chance of success/failure)
  return Math.min(0.95, Math.max(0.05, adjustedChance))
}

/**
 * Calculate resource gathering rate based on gathering forces and resource regeneration
 */
export function calculateGatheringRate(gatheringForces: number, regenerationRate: number): number {
  // Base gathering is 1 unit per force per hour
  const baseGathering = gatheringForces

  // Adjust based on resource regeneration rate
  // Higher regeneration means more efficient gathering
  const adjustedGathering = baseGathering * (1 + regenerationRate / 10)

  return adjustedGathering
}

/**
 * Get alliance color by name
 */
export function getAllianceColor(allianceName: string): string {
  const allianceColors: Record<string, string> = {
    "Honey Hunters": "#FFC078",
    "Berry Brigade": "#E36F6F",
    "Forest Friends": "#74C480",
    "Stone Sentinels": "#A66959",
    "Crystal Clan": "#B080FF",
  }

  return allianceColors[allianceName] || "#FFC078"
}

/**
 * Calculate territory control points
 */
export function calculateTerritoryControl(territories: any[]): Record<string, number> {
  const controlPoints: Record<string, number> = {}

  territories.forEach((territory) => {
    if (territory.owner) {
      if (!controlPoints[territory.owner]) {
        controlPoints[territory.owner] = 0
      }

      // Base points for controlling a territory
      let points = 1

      // Bonus points for resource territories
      if (territory.resources) {
        points += territory.resources.amount / 100
      }

      // Bonus points for strategic locations
      if (territory.isStrategic) {
        points += 2
      }

      controlPoints[territory.owner] += points
    }
  })

  return controlPoints
}
