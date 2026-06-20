export const HERO_FX_SPARKLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${8 + ((i * 47) % 84)}%`,
  top: `${6 + ((i * 31) % 48)}%`,
  size: 2 + (i % 4),
  delay: `${((i * 0.37) % 5).toFixed(2)}s`,
  duration: `${2.2 + (i % 5) * 0.65}s`,
  drift: i % 2 === 0 ? -1 : 1,
}))
