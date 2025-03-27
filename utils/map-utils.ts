// Utility functions for map and grid operations

/**
 * Determines if a cell is valid for placement based on its position
 * This can be expanded with more sophisticated rules
 */
export function isCellValid(x: number, y: number, mapWidth: number, mapHeight: number): boolean {
  // Simple rule: bottom 70% of the map is valid (ground)
  return y > mapHeight * 0.3
}

/**
 * Finds a random valid and unoccupied cell
 */
export function findRandomValidCell(
  cells: Array<{ valid: boolean; occupied: boolean; gridX: number; gridY: number }>,
  excludeRadius = 0,
  centerX?: number,
  centerY?: number,
): { gridX: number; gridY: number } | null {
  // Filter valid and unoccupied cells
  const validCells = cells.filter((cell) => cell.valid && !cell.occupied)

  if (validCells.length === 0) return null

  // If center coordinates are provided, prioritize cells within a certain distance
  if (centerX !== undefined && centerY !== undefined) {
    // Find cells within the desired radius
    const nearbyCells = validCells.filter((cell) => {
      const distance = Math.sqrt(Math.pow(cell.gridX - centerX, 2) + Math.pow(cell.gridY - centerY, 2))
      return distance <= excludeRadius
    })

    // If we found nearby cells, pick one randomly
    if (nearbyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * nearbyCells.length)
      return {
        gridX: nearbyCells[randomIndex].gridX,
        gridY: nearbyCells[randomIndex].gridY,
      }
    }
  }

  // Otherwise, pick a random cell from all valid cells
  const randomIndex = Math.floor(Math.random() * validCells.length)
  return {
    gridX: validCells[randomIndex].gridX,
    gridY: validCells[randomIndex].gridY,
  }
}

/**
 * Saves the grid validity map to a JSON file
 */
export function saveValidityMap(
  validCells: Array<{ gridX: number; gridY: number; valid: boolean }>,
  columns: number,
  rows: number,
): string {
  // Create a 2D array representation of the validity map
  const validityMap: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(false))

  validCells.forEach((cell) => {
    if (cell.gridY < rows && cell.gridX < columns) {
      validityMap[cell.gridY][cell.gridX] = cell.valid
    }
  })

  return JSON.stringify(validityMap)
}

/**
 * Loads a validity map from a JSON string
 */
export function loadValidityMap(jsonString: string): boolean[][] | null {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("Error parsing validity map:", error)
    return null
  }
}

