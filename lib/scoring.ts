// lib/scoring.ts
import { HABIT_DEFINITIONS, Targets, DayData, HabitId, WeekHistory } from './storage'

const WEIGHT_PER_HABIT = 100 / HABIT_DEFINITIONS.length // ~16.67 each

export function calculateDailyScore(
  completions: Partial<Record<HabitId, number>>,
  targets: Targets
): number {
  let total = 0
  for (const habit of HABIT_DEFINITIONS) {
    const actual = completions[habit.id] ?? 0
    const target = targets[habit.id] ?? habit.defaultTarget
    const ratio = target > 0 ? Math.min(actual / target, 1) : 0
    total += ratio * WEIGHT_PER_HABIT
  }
  return Math.round(total)
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#7ED957'  // success green
  if (score >= 60) return '#E4F05A'  // neon lime
  if (score >= 40) return '#FFC94A'  // amber
  if (score >= 20) return '#FF9A1F'  // orange
  return '#D95F5F'                   // error red
}

export function getScoreGradient(score: number): [string, string] {
  if (score >= 80) return ['#7ED957', '#67D6C5']
  if (score >= 60) return ['#E4F05A', '#7ED957']
  if (score >= 40) return ['#FFC94A', '#E4F05A']
  if (score >= 20) return ['#FF9A1F', '#FFC94A']
  return ['#D95F5F', '#FF9A1F']
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Great'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  if (score >= 20) return 'Low'
  return 'Start'
}

export interface HabitScore {
  id: HabitId
  ratio: number
  actual: number
  target: number
}

export function getHabitScores(
  completions: Partial<Record<HabitId, number>>,
  targets: Targets
): HabitScore[] {
  return HABIT_DEFINITIONS.map((habit) => {
    const actual = completions[habit.id] ?? 0
    const target = targets[habit.id] ?? habit.defaultTarget
    const ratio = target > 0 ? Math.min(actual / target, 1) : 0
    return { id: habit.id, ratio, actual, target }
  })
}

export function getWeeklyScores(history: WeekHistory, targets: Targets): number[] {
  return history.map((day) => calculateDailyScore(day.completions, targets))
}

export function getWeakestHabit(
  history: WeekHistory,
  targets: Targets
): HabitId {
  const avgRatios = HABIT_DEFINITIONS.map((habit) => {
    const days = history.filter((d) => d.completions[habit.id] !== undefined)
    if (days.length === 0) return { id: habit.id, avg: 0 }
    const total = days.reduce((sum, d) => {
      const actual = d.completions[habit.id] ?? 0
      const target = targets[habit.id] ?? habit.defaultTarget
      return sum + (target > 0 ? Math.min(actual / target, 1) : 0)
    }, 0)
    return { id: habit.id, avg: total / days.length }
  })
  avgRatios.sort((a, b) => a.avg - b.avg)
  return avgRatios[0].id
}
