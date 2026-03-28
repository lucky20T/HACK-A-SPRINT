// lib/storage.ts
'use client'

export type HabitId = 'hydration' | 'sleep' | 'activity' | 'meals' | 'screenbreak' | 'stressrelief'

export interface HabitDefinition {
  id: HabitId
  label: string
  emoji: string
  unit: string
  defaultTarget: number
  step: number
  max: number
  color: string
  glowColor: string
  description: string
}

export const HABIT_DEFINITIONS: HabitDefinition[] = [
  {
    id: 'hydration',
    label: 'Hydration',
    emoji: '💧',
    unit: 'glasses',
    defaultTarget: 8,
    step: 1,
    max: 15,
    color: '#67D6C5',
    glowColor: 'rgba(103,214,197,0.4)',
    description: 'Stay hydrated throughout the day',
  },
  {
    id: 'sleep',
    label: 'Sleep',
    emoji: '🌙',
    unit: 'hours',
    defaultTarget: 8,
    step: 0.5,
    max: 12,
    color: '#7B8FFF',
    glowColor: 'rgba(123,143,255,0.4)',
    description: 'Quality rest for recovery',
  },
  {
    id: 'activity',
    label: 'Activity',
    emoji: '🏃',
    unit: 'minutes',
    defaultTarget: 30,
    step: 5,
    max: 120,
    color: '#FF9A1F',
    glowColor: 'rgba(255,154,31,0.4)',
    description: 'Move your body with intention',
  },
  {
    id: 'meals',
    label: 'Meals',
    emoji: '🥗',
    unit: 'meals',
    defaultTarget: 3,
    step: 1,
    max: 6,
    color: '#7ED957',
    glowColor: 'rgba(126,217,87,0.4)',
    description: 'Nourish with balanced nutrition',
  },
  {
    id: 'screenbreak',
    label: 'Screen Break',
    emoji: '👁️',
    unit: 'breaks',
    defaultTarget: 5,
    step: 1,
    max: 12,
    color: '#E4F05A',
    glowColor: 'rgba(228,240,90,0.4)',
    description: 'Rest your eyes from screens',
  },
  {
    id: 'stressrelief',
    label: 'Stress Relief',
    emoji: '🧘',
    unit: 'minutes',
    defaultTarget: 10,
    step: 5,
    max: 60,
    color: '#FFC94A',
    glowColor: 'rgba(255,201,74,0.4)',
    description: 'Mindfulness & relaxation practice',
  },
]

export interface DayData {
  date: string // ISO date string YYYY-MM-DD
  completions: Partial<Record<HabitId, number>>
}

export type Targets = Record<HabitId, number>
export type WeekHistory = DayData[]

const STORAGE_KEYS = {
  habits: 'health_habits',
  targets: 'health_targets',
  history: 'health_history',
} as const

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function getDefaultTargets(): Targets {
  return Object.fromEntries(
    HABIT_DEFINITIONS.map((h) => [h.id, h.defaultTarget])
  ) as Targets
}

export function getTargets(): Targets {
  if (typeof window === 'undefined') return getDefaultTargets()
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.targets)
    if (!stored) return getDefaultTargets()
    return { ...getDefaultTargets(), ...JSON.parse(stored) }
  } catch {
    return getDefaultTargets()
  }
}

export function saveTargets(targets: Targets): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.targets, JSON.stringify(targets))
}

export function getWeekHistory(): WeekHistory {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.history)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getDayData(date: string): DayData {
  const history = getWeekHistory()
  return history.find((d) => d.date === date) ?? { date, completions: {} }
}

export function saveDayData(data: DayData): void {
  if (typeof window === 'undefined') return
  const history = getWeekHistory()
  const idx = history.findIndex((d) => d.date === data.date)
  if (idx >= 0) {
    history[idx] = data
  } else {
    history.push(data)
  }
  // Keep last 30 days
  const sorted = history.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30)
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(sorted))
}

export function updateHabitValue(date: string, habitId: HabitId, value: number): DayData {
  const data = getDayData(date)
  const updated = { ...data, completions: { ...data.completions, [habitId]: value } }
  saveDayData(updated)
  return updated
}

export function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)
}
