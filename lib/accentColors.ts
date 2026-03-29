import { useTheme } from './ThemeContext'

/**
 * Returns theme-appropriate accent colors.
 * Dark: vivid neon palette | Light: vibrant, energetic accent colors readable on white/near-white
 */
export function useAccentColors() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return {
    lime:    isDark ? '#E4F05A' : '#F6D94C',   // neon lime   → golden yellow
    mint:    isDark ? '#67D6C5' : '#2ED7C6',   // mint teal   → vivid cyan
    orange:  isDark ? '#FF9A1F' : '#FF9B4A',   // neon orange → warm peach-orange
    amber:   isDark ? '#FFC94A' : '#F6D94C',   // amber       → golden yellow
    success: isDark ? '#7ED957' : '#58D68D',   // green       → vibrant emerald
    error:   isDark ? '#D95F5F' : '#FF6B6B',   // red         → vivid coral red
    blue:    isDark ? '#7B8FFF' : '#6C7CFF',   // blue        → electric blue
    pink:    isDark ? '#FF6FAE' : '#FF6FAE',   // pink        → hot pink (same both)
    purple:  isDark ? '#B37FFF' : '#A56BFF',   // purple      → vivid violet
    sand:    isDark ? '#D0BEA3' : '#DDE7FF',   // sand        → soft blue-white
    sage:    isDark ? '#8F917C' : '#8A97B2',   // sage        → blue-grey
  }
}
