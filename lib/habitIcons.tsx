/**
 * lib/habitIcons.tsx
 * Single source of truth for all habit icons and app-wide icon replacements.
 * Uses lucide-react so icons are crisp SVGs that respect colors.
 */
import {
  Droplets,
  Moon,
  Zap,
  Salad,
  Eye,
  Wind,
  Sun,
  CloudSun,
  Sunset,
  BarChart3,
  Target,
  CalendarDays,
  Flame,
  Lock,
  type LucideIcon,
} from 'lucide-react'
import type { HabitId } from './storage'

/* ─── Habit icon map ─────────────────────────────────────────────────── */
export const HABIT_ICONS: Record<HabitId, LucideIcon> = {
  hydration:   Droplets,
  sleep:       Moon,
  activity:    Zap,
  meals:       Salad,
  screenbreak: Eye,
  stressrelief: Wind,
}

/* ─── HabitIcon component ────────────────────────────────────────────── */
export interface HabitIconProps {
  habitId: HabitId
  color: string
  size?: number
  strokeWidth?: number
  /** If true, adds a subtle CSS pulse animation */
  animate?: boolean
}

export function HabitIcon({ habitId, color, size = 22, strokeWidth = 2, animate = false }: HabitIconProps) {
  const Icon = HABIT_ICONS[habitId]
  return (
    <Icon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={{
        flexShrink: 0,
        animation: animate ? 'icon-breathe 2.5s ease-in-out infinite' : 'none',
        display: 'block',
      }}
    />
  )
}

/* ─── App-wide named icon exports (no more emoji strings) ────────────── */
export {
  Sun,
  CloudSun,
  Sunset,
  Moon,
  BarChart3,
  Target,
  CalendarDays,
  Flame,
  Lock,
  Zap,
}
