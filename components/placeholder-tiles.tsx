// This file contains SVG-based tile components that can be used as fallbacks
// if the image assets fail to load

export const GrassTile = () => (
  <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0L64 16L32 32L0 16Z" fill="#FFF6E9" stroke="#734739" strokeWidth="1" />
    <path d="M32 8L40 12L32 16L24 12Z" fill="#74C480" />
  </svg>
)

export const ForestTile = () => (
  <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0L64 16L32 32L0 16Z" fill="#74C480" stroke="#734739" strokeWidth="1" />
    <path d="M32 4L36 6L32 8L28 6Z" fill="#5A9A64" />
    <path d="M32 10L38 13L32 16L26 13Z" fill="#5A9A64" />
    <path d="M32 16L40 20L32 24L24 20Z" fill="#5A9A64" />
  </svg>
)

export const MountainTile = () => (
  <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0L64 16L32 32L0 16Z" fill="#A66959" stroke="#734739" strokeWidth="1" />
    <path d="M32 8L40 16L32 24L24 16Z" fill="#8A5849" />
  </svg>
)

export const WaterTile = () => (
  <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0L64 16L32 32L0 16Z" fill="#6FB5FF" stroke="#734739" strokeWidth="1" />
    <path d="M24 12L32 16L40 12L48 16L40 20L32 16L24 20L16 16Z" fill="#5A9AE6" />
  </svg>
)

export const BerryTile = () => (
  <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0L64 16L32 32L0 16Z" fill="#E36F6F" stroke="#734739" strokeWidth="1" />
    <circle cx="32" cy="16" r="6" fill="#C45A5A" />
  </svg>
)

export const PlayerDenTile = () => (
  <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0L64 16L32 32L0 16Z" fill="#FFC078" stroke="#734739" strokeWidth="1" />
    <path d="M32 4L44 10L44 22L32 28L20 22L20 10Z" fill="#E6A85A" />
  </svg>
)

export const EnemyDenTile = () => (
  <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0L64 16L32 32L0 16Z" fill="#FF82AD" stroke="#734739" strokeWidth="1" />
    <path d="M32 4L44 10L44 22L32 28L20 22L20 10Z" fill="#E66A8A" />
  </svg>
)

export const QuestTile = () => (
  <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0L64 16L32 32L0 16Z" fill="#B080FF" stroke="#734739" strokeWidth="1" />
    <text x="32" y="20" fontSize="14" textAnchor="middle" fill="#734739">
      ?
    </text>
  </svg>
)

export const BeehiveTile = () => (
  <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0L64 16L32 32L0 16Z" fill="#FFC078" stroke="#734739" strokeWidth="1" />
    <ellipse cx="32" cy="16" rx="8" ry="6" fill="#E6A85A" />
  </svg>
)

export const RockTile = () => (
  <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0L64 16L32 32L0 16Z" fill="#A66959" stroke="#734739" strokeWidth="1" />
    <path d="M28 12L36 16L32 22L24 18Z" fill="#8A5849" />
  </svg>
)

export const BuildingSpotTile = () => (
  <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 0L64 16L32 32L0 16Z" fill="#B080FF" stroke="#734739" strokeWidth="1" />
    <path d="M28 12L36 16L32 20L24 16Z" fill="#9A6AE6" />
  </svg>
)

