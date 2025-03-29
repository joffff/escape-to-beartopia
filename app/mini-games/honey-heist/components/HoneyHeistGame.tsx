"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface GameEntity {
  x: number
  y: number
  width: number
  height: number
}

interface Bee extends GameEntity {
  isAlerted: boolean
  direction: number
  speed: number
}

interface Honey extends GameEntity {
  type: 'honey' | 'hunny'
  isCollected: boolean
}

interface Obstacle extends GameEntity {
  type: 'tree' | 'rock'
}

interface HoneyHeistGameProps {
  difficulty: 'easy' | 'medium' | 'hard'
  character: string
  onGameOver: (score: number) => void
  onGameWon: (score: number) => void
  level: number
}

export default function HoneyHeistGame({ 
  difficulty, 
  character, 
  onGameOver, 
  onGameWon,
  level
}: HoneyHeistGameProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [player, setPlayer] = useState<GameEntity & { isStealth: boolean }>({
    x: 400,
    y: 500,
    width: 40,
    height: 40,
    isStealth: false
  })
  const [bees, setBees] = useState<Bee[]>([])
  const [honey, setHoney] = useState<Honey[]>([])
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({})
  const [stats, setStats] = useState({
    honeyCollected: 0,
    hunnyCollected: 0,
    bearEnergy: 100,
    bearHealth: 100,
    score: 0,
    beeAwareness: 0
  })
  
  // Game settings based on difficulty and level
  const settings = {
    playerSpeed: 4 * (difficulty === 'easy' ? 1.2 : difficulty === 'medium' ? 1 : 0.8),
    stealthSpeed: 2 * (difficulty === 'easy' ? 1.2 : difficulty === 'medium' ? 1 : 0.8),
    beeSpeed: 2 * (difficulty === 'easy' ? 0.8 : difficulty === 'medium' ? 1 : 1.3) * (1 + (level - 1) * 0.1),
    beeDetectionRange: 100 * (difficulty === 'easy' ? 0.8 : difficulty === 'medium' ? 1 : 1.3) * (1 + (level - 1) * 0.1),
    energyDrain: 0.1 * (difficulty === 'easy' ? 0.8 : difficulty === 'medium' ? 1 : 1.3) * (1 + (level - 1) * 0.1),
    healthDrain: 0.2 * (difficulty === 'easy' ? 0.8 : difficulty === 'medium' ? 1 : 1.3) * (1 + (level - 1) * 0.1),
    honeyCount: 10 + Math.floor(level * 1.5),
    hunnyCount: 3 + Math.floor(level * 0.5),
    beeCount: 5 + Math.floor(level * 1.2),
    obstacleCount: 8 + Math.floor(level * 0.8),
    requiredHoney: 8 + Math.floor(level * 1.2),
    requiredHunny: 2 + Math.floor(level * 0.4)
  }

  // Initialize game
  useEffect(() => {
    // Initialize game entities
    generateLevel()
    
    // Set up keyboard listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }))
      
      // Toggle stealth mode with shift key
      if (e.key === 'Shift') {
        setPlayer(prev => ({ ...prev, isStealth: true }))
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }))
      
      // Toggle stealth mode with shift key
      if (e.key === 'Shift') {
        setPlayer(prev => ({ ...prev, isStealth: false }))
      }
      
      // Pause game with Escape key
      if (e.key === 'Escape') {
        setPaused(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // Generate game level
  const generateLevel = () => {
    // Generate obstacles
    const newObstacles: Obstacle[] = []
    for (let i = 0; i < settings.obstacleCount; i++) {
      const type = Math.random() > 0.5 ? 'tree' : 'rock'
      let x: number = 0, y: number = 0
      let validPosition = false
      
      // Keep trying until we find a valid position
      while (!validPosition) {
        x = Math.random() * 700 + 50
        y = Math.random() * 500 + 50
        
        // Check if position overlaps with existing obstacles
        validPosition = !newObstacles.some(obstacle => 
          Math.abs(obstacle.x - x) < 50 && Math.abs(obstacle.y - y) < 50
        )
      }
      
      newObstacles.push({
        x,
        y,
        width: type === 'tree' ? 40 : 30,
        height: type === 'tree' ? 60 : 30,
        type
      })
    }
    
    // Generate honey
    const newHoney: Honey[] = []
    for (let i = 0; i < settings.honeyCount + settings.hunnyCount; i++) {
      const type = i < settings.honeyCount ? 'honey' : 'hunny'
      let x: number = 0, y: number = 0
      let validPosition = false
      
      // Keep trying until we find a valid position
      while (!validPosition) {
        x = Math.random() * 700 + 50
        y = Math.random() * 500 + 50
        
        // Check if position overlaps with existing obstacles or honey
        validPosition = !newObstacles.some(obstacle => 
          Math.abs(obstacle.x - x) < 50 && Math.abs(obstacle.y - y) < 50
        ) && !newHoney.some(h => 
          Math.abs(h.x - x) < 50 && Math.abs(h.y - y) < 50
        )
      }
      
      newHoney.push({
        x,
        y,
        width: 30,
        height: 30,
        type,
        isCollected: false
      })
    }
    
    // Generate bees
    const newBees: Bee[] = []
    for (let i = 0; i < settings.beeCount; i++) {
      let x: number = 0, y: number = 0
      let validPosition = false
      
      // Keep trying until we find a valid position
      while (!validPosition) {
        x = Math.random() * 700 + 50
        y = Math.random() * 300 + 50 // Keep bees in the top part of the map
        
        // Check if position overlaps with existing obstacles, honey, or bees
        validPosition = !newObstacles.some(obstacle => 
          Math.abs(obstacle.x - x) < 50 && Math.abs(obstacle.y - y) < 50
        ) && !newHoney.some(h => 
          Math.abs(h.x - x) < 50 && Math.abs(h.y - y) < 50
        ) && !newBees.some(b => 
          Math.abs(b.x - x) < 50 && Math.abs(b.y - y) < 50
        )
      }
      
      newBees.push({
        x,
        y,
        width: 30,
        height: 30,
        isAlerted: false,
        direction: Math.random() * Math.PI * 2,
        speed: settings.beeSpeed * (0.8 + Math.random() * 0.4) // Randomize speed a bit
      })
    }
    
    setObstacles(newObstacles)
    setHoney(newHoney)
    setBees(newBees)
    setPlayer({
      x: 400,
      y: 500,
      width: 40,
      height: 40,
      isStealth: false
    })
    setStats({
      honeyCollected: 0,
      hunnyCollected: 0,
      bearEnergy: 100,
      bearHealth: 100,
      score: 0,
      beeAwareness: 0
    })
    setGameStarted(true)
  }

  // Game loop
  useEffect(() => {
    if (!gameStarted || paused) return
    
    const gameLoop = (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time
      }
      
      const deltaTime = time - lastTimeRef.current
      lastTimeRef.current = time
      
      // Update game state
      updateGameState(deltaTime / 16) // Normalize to ~60fps
      
      // Check win/lose conditions
      checkGameStatus()
      
      // Continue the game loop
      requestRef.current = requestAnimationFrame(gameLoop)
    }
    
    requestRef.current = requestAnimationFrame(gameLoop)
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      lastTimeRef.current = 0
    }
  }, [gameStarted, paused, player, bees, honey, obstacles, stats])

  // Update game state
  const updateGameState = (deltaTime: number) => {
    // Update player position
    updatePlayerPosition(deltaTime)
    
    // Update bee positions and states
    updateBees(deltaTime)
    
    // Check for collisions
    checkCollisions()
    
    // Update stats
    updateStats(deltaTime)
  }

  // Update player position based on keyboard input
  const updatePlayerPosition = (deltaTime: number) => {
    const speed = player.isStealth ? settings.stealthSpeed : settings.playerSpeed
    let newX = player.x
    let newY = player.y
    
    if (keys['w'] || keys['arrowup']) newY -= speed * deltaTime
    if (keys['s'] || keys['arrowdown']) newY += speed * deltaTime
    if (keys['a'] || keys['arrowleft']) newX -= speed * deltaTime
    if (keys['d'] || keys['arrowright']) newX += speed * deltaTime
    
    // Boundary checks
    newX = Math.max(player.width / 2, Math.min(800 - player.width / 2, newX))
    newY = Math.max(player.height / 2, Math.min(600 - player.height / 2, newY))
    
    // Obstacle collision check
    const wouldCollide = obstacles.some(obstacle => 
      Math.abs(obstacle.x - newX) < (obstacle.width + player.width) / 2 &&
      Math.abs(obstacle.y - newY) < (obstacle.height + player.height) / 2
    )
    
    if (!wouldCollide) {
      setPlayer(prev => ({ ...prev, x: newX, y: newY }))
    }
  }

  // Update bee positions and states
  const updateBees = (deltaTime: number) => {
    setBees(prevBees => 
      prevBees.map(bee => {
        // Check if bee should be alerted
        const distToPlayer = Math.sqrt(
          Math.pow(bee.x - player.x, 2) + Math.pow(bee.y - player.y, 2)
        )
        
        const detectionRange = player.isStealth 
          ? settings.beeDetectionRange * 0.5 
          : settings.beeDetectionRange
        
        const isAlerted = distToPlayer < detectionRange
        
        // Update bee position
        let newX = bee.x
        let newY = bee.y
        let newDirection = bee.direction
        
        if (isAlerted) {
          // Chase player
          const angleToPlayer = Math.atan2(player.y - bee.y, player.x - bee.x)
          newDirection = angleToPlayer
        } else {
          // Random movement
          if (Math.random() < 0.02) {
            newDirection = Math.random() * Math.PI * 2
          }
        }
        
        newX += Math.cos(newDirection) * bee.speed * deltaTime
        newY += Math.sin(newDirection) * bee.speed * deltaTime
        
        // Boundary checks
        if (newX < 0 || newX > 800) newDirection = Math.PI - newDirection
        if (newY < 0 || newY > 600) newDirection = -newDirection
        
        newX = Math.max(0, Math.min(800, newX))
        newY = Math.max(0, Math.min(600, newY))
        
        return {
          ...bee,
          x: newX,
          y: newY,
          isAlerted,
          direction: newDirection
        }
      })
    )
  }

  // Check for collisions
  const checkCollisions = () => {
    // Check honey collisions
    setHoney(prevHoney => 
      prevHoney.map(h => {
        if (h.isCollected) return h
        
        const distToPlayer = Math.sqrt(
          Math.pow(h.x - player.x, 2) + Math.pow(h.y - player.y, 2)
        )
        
        if (distToPlayer < (h.width + player.width) / 2) {
          // Collect honey
          setStats(prev => ({
            ...prev,
            honeyCollected: h.type === 'honey' ? prev.honeyCollected + 1 : prev.honeyCollected,
            hunnyCollected: h.type === 'hunny' ? prev.hunnyCollected + 1 : prev.hunnyCollected,
            score: prev.score + (h.type === 'honey' ? 10 : 50)
          }))
          
          return { ...h, isCollected: true }
        }
        
        return h
      })
    )
    
    // Check bee collisions
    const beeCollision = bees.some(bee => {
      const distToPlayer = Math.sqrt(
        Math.pow(bee.x - player.x, 2) + Math.pow(bee.y - player.y, 2)
      )
      
      return distToPlayer < (bee.width + player.width) / 2
    })
    
    if (beeCollision) {
      setStats(prev => ({
        ...prev,
        bearHealth: prev.bearHealth - settings.healthDrain * 10
      }))
    }
  }

  // Update game stats
  const updateStats = (deltaTime: number) => {
    setStats(prev => {
      // Calculate bee awareness
      const alertedBees = bees.filter(bee => bee.isAlerted).length
      const beeAwareness = (alertedBees / bees.length) * 100
      
      // Update energy when in stealth mode
      const bearEnergy = player.isStealth 
        ? Math.max(0, prev.bearEnergy - settings.energyDrain * deltaTime)
        : Math.min(100, prev.bearEnergy + settings.energyDrain * deltaTime * 0.5)
      
      return {
        ...prev,
        beeAwareness,
        bearEnergy
      }
    })
  }

  // Check game status (win/lose conditions)
  const checkGameStatus = () => {
    // Check if player has collected enough honey to win
    if (
      stats.honeyCollected >= settings.requiredHoney && 
      stats.hunnyCollected >= settings.requiredHunny
    ) {
      onGameWon(stats.score)
      setPaused(true)
    }
    
    // Check if player has run out of health
    if (stats.bearHealth <= 0) {
      onGameOver(stats.score)
      setPaused(true)
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* Game background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/images/bearish-den-map.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Game canvas */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      >
        {/* Render obstacles */}
        {obstacles.map((obstacle, index) => (
          <div
            key={`obstacle-${index}`}
            className="absolute"
            style={{
              left: obstacle.x - obstacle.width / 2,
              top: obstacle.y - obstacle.height / 2,
              width: obstacle.width,
              height: obstacle.height
            }}
          >
            {obstacle.type === 'tree' ? (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                🌲
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                🪨
              </div>
            )}
          </div>
        ))}
        
        {/* Render honey */}
        {honey.map((h, index) => (
          !h.isCollected && (
            <div
              key={`honey-${index}`}
              className="absolute"
              style={{
                left: h.x - h.width / 2,
                top: h.y - h.height / 2,
                width: h.width,
                height: h.height
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-3xl">
                {h.type === 'honey' ? '🍯' : '🏺'}
              </div>
            </div>
          )
        ))}
        
        {/* Render bees */}
        {bees.map((bee, index) => (
          <div
            key={`bee-${index}`}
            className={`absolute transition-all duration-200 ${bee.isAlerted ? 'text-red-500' : ''}`}
            style={{
              left: bee.x - bee.width / 2,
              top: bee.y - bee.height / 2,
              width: bee.width,
              height: bee.height,
              transform: `rotate(${bee.direction}rad)`
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🐝
            </div>
          </div>
        ))}
        
        {/* Render player */}
        <div
          className={`absolute transition-all duration-200 ${player.isStealth ? 'opacity-50' : 'opacity-100'}`}
          style={{
            left: player.x - player.width / 2,
            top: player.y - player.height / 2,
            width: player.width,
            height: player.height
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={`/images/${character}.webp`}
                alt="Player"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Game UI */}
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center bg-black bg-opacity-50 text-white">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-yellow-300">🍯</span> {stats.honeyCollected}/{settings.requiredHoney}
          </div>
          <div>
            <span className="text-yellow-500">🏺</span> {stats.hunnyCollected}/{settings.requiredHunny}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="mr-1">Energy:</span>
            <div className="w-24 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all duration-200"
                style={{ width: `${stats.bearEnergy}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="mr-1">Health:</span>
            <div className="w-24 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-200"
                style={{ width: `${stats.bearHealth}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="mr-1">Bee Alert:</span>
            <div className="w-24 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-200"
                style={{ width: `${stats.beeAwareness}%` }}
              />
            </div>
          </div>
        </div>
        
        <div>
          Score: {stats.score}
        </div>
      </div>
      
      {/* Pause menu */}
      {paused && !stats.bearHealth <= 0 && !(stats.honeyCollected >= settings.requiredHoney && stats.hunnyCollected >= settings.requiredHunny) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#734739]">Game Paused</h2>
            <div className="space-y-4">
              <Button
                onClick={() => setPaused(false)}
                className="w-full bg-[#74C480] hover:bg-[#6FB5FF] text-white"
              >
                Resume
              </Button>
              <Button
                onClick={() => onGameOver(stats.score)}
                className="w-full bg-[#E36F6F] hover:bg-[#E36F6F]/80 text-white"
              >
                Quit
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls help */}
      <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 p-1 rounded">
        <p>WASD/Arrows: Move | Shift: Stealth | Esc: Pause</p>
      </div>
    </div>
  )
}
