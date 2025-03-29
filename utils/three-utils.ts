import * as THREE from "three"

// Create a simple tree model
export function createTreeModel(height = 1, trunkColor = "#8B4513", leavesColor = "#228B22") {
  const group = new THREE.Group()

  // Trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, height * 0.5, 8)
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: trunkColor, roughness: 0.8 })
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
  trunk.position.y = height * 0.25
  group.add(trunk)

  // Leaves
  const leavesGeometry = new THREE.ConeGeometry(0.5, height * 0.8, 8)
  const leavesMaterial = new THREE.MeshStandardMaterial({ color: leavesColor, roughness: 0.7 })
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial)
  leaves.position.y = height * 0.6
  group.add(leaves)

  return group
}

// Create a simple house model
export function createHouseModel(size = 1, wallColor = "#F5DEB3", roofColor = "#8B0000") {
  const group = new THREE.Group()

  // Walls
  const wallsGeometry = new THREE.BoxGeometry(size, size * 0.8, size)
  const wallsMaterial = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.6 })
  const walls = new THREE.Mesh(wallsGeometry, wallsMaterial)
  walls.position.y = size * 0.4
  group.add(walls)

  // Roof
  const roofGeometry = new THREE.ConeGeometry(size * 0.8, size * 0.5, 4)
  const roofMaterial = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.7 })
  const roof = new THREE.Mesh(roofGeometry, roofMaterial)
  roof.position.y = size * 0.8 + size * 0.25
  roof.rotation.y = Math.PI / 4
  group.add(roof)

  return group
}

// Create a simple rock model
export function createRockModel(size = 1, color = "#808080") {
  const group = new THREE.Group()

  // Create irregular rock shape
  const rockGeometry = new THREE.DodecahedronGeometry(size * 0.5, 0)
  const rockMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.9 })
  const rock = new THREE.Mesh(rockGeometry, rockMaterial)

  // Add some randomness to the shape
  const positions = rockGeometry.attributes.position
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    const z = positions.getZ(i)

    positions.setXYZ(
      i,
      x + (Math.random() - 0.5) * 0.2 * size,
      y + (Math.random() - 0.5) * 0.2 * size,
      z + (Math.random() - 0.5) * 0.2 * size,
    )
  }

  positions.needsUpdate = true
  rockGeometry.computeVertexNormals()

  group.add(rock)
  return group
}

// Create a simple crystal model
export function createCrystalModel(size = 1, color = "#9370DB") {
  const group = new THREE.Group()

  // Main crystal
  const crystalGeometry = new THREE.OctahedronGeometry(size * 0.5, 0)
  const crystalMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.8,
  })
  const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial)
  crystal.position.y = size * 0.3
  group.add(crystal)

  // Small crystals around the base
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2
    const smallCrystalGeometry = new THREE.OctahedronGeometry(size * 0.2, 0)
    const smallCrystal = new THREE.Mesh(smallCrystalGeometry, crystalMaterial)
    smallCrystal.position.x = Math.cos(angle) * size * 0.4
    smallCrystal.position.z = Math.sin(angle) * size * 0.4
    smallCrystal.position.y = size * 0.1
    smallCrystal.rotation.y = Math.random() * Math.PI
    smallCrystal.rotation.x = Math.random() * Math.PI / 4
    group.add(smallCrystal)
  }

  return group
}

// Create a terrain chunk with height variation
export function createTerrainChunk(width = 10, height = 10, resolution = 1, heightScale = 1, baseColor = "#8BBF9F") {
  const geometry = new THREE.PlaneGeometry(width, height, resolution * width, resolution * height)
  geometry.rotateX(-Math.PI / 2) // Rotate to be horizontal

  // Add height variation
  const positions = geometry.attributes.position
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const z = positions.getZ(i)

    // Simple noise function for height
    const nx = Math.sin(x / 2) * Math.cos(z / 2) * 0.5 + 0.5
    const nz = Math.sin(x / 3) * Math.cos(z / 4) * 0.5 + 0.5
    const height = (nx + nz) * heightScale

    positions.setY(i, height)
  }

  positions.needsUpdate = true
  geometry.computeVertexNormals()

  // Create material with slight variation
  const material = new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.8,
    flatShading: true,
    vertexColors: false,
  })

  return new THREE.Mesh(geometry, material)
}
