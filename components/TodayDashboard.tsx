'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  HABIT_DEFINITIONS,
  getTodayString,
  getDayData,
  updateHabitValue,
  getTargets,
  getLast7Days,
  getWeekHistory,
  DayData,
  Targets,
} from '@/lib/storage'
import { calculateDailyScore } from '@/lib/scoring'
import type { Breakpoint } from '@/lib/useBreakpoint'
import { HabitIcon } from '@/lib/habitIcons'
import { Sun, CloudSun, Sunset, Moon } from 'lucide-react'
import WellnessRing from './WellnessRing'
import HabitCard from './HabitCard'
import StreakCalendar from './StreakCalendar'
import confetti from 'canvas-confetti'

interface Props {
  breakpoint: Breakpoint
}

export default function TodayDashboard({ breakpoint }: Props) {
  const [todayData, setTodayData] = useState<DayData>({ date: getTodayString(), completions: {} })
  const [targets, setTargets] = useState<Targets>(() =>
    HABIT_DEFINITIONS.reduce((acc, h) => ({ ...acc, [h.id]: h.defaultTarget }), {} as Targets)
  )
  const [weekHistory, setWeekHistory] = useState<Array<{ date: string; score: number }>>([])
  const [prevScore, setPrevScore] = useState(0)
  const todayStr = getTodayString()

  useEffect(() => {
    const t = getTargets()
    setTargets(t)
    const data = getDayData(todayStr)
    setTodayData(data)
    const history = getWeekHistory()
    const weekDays = getLast7Days()
    const scores = weekDays.map((date) => {
      const d = history.find((h) => h.date === date) ?? { date, completions: {} }
      return { date, score: calculateDailyScore(d.completions, t) }
    })
    setWeekHistory(scores)
  }, [todayStr])

  const score = calculateDailyScore(todayData.completions, targets)

  useEffect(() => {
    if (score === 100 && prevScore < 100) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 }, colors: ['#E4F05A', '#67D6C5', '#FF9A1F', '#7ED957', '#FFC94A'] })
    }
    setPrevScore(score)
  }, [score, prevScore])

  const handleIncrement = (habitId: string) => {
    const habit = HABIT_DEFINITIONS.find((h) => h.id === habitId)
    if (!habit) return
    const current = (todayData.completions as Record<string, number>)[habit.id] ?? 0
    const newVal = Math.min(current + habit.step, habit.max)
    const updated = updateHabitValue(todayStr, habit.id, newVal)
    setTodayData(updated)
    const ns = calculateDailyScore(updated.completions, targets)
    setWeekHistory((prev) => prev.map((d) => (d.date === todayStr ? { ...d, score: ns } : d)))
  }

  const handleDecrement = (habitId: string) => {
    const habit = HABIT_DEFINITIONS.find((h) => h.id === habitId)
    if (!habit) return
    const current = (todayData.completions as Record<string, number>)[habit.id] ?? 0
    const newVal = Math.max(current - habit.step, 0)
    const updated = updateHabitValue(todayStr, habit.id, newVal)
    setTodayData(updated)
    const ns = calculateDailyScore(updated.completions, targets)
    setWeekHistory((prev) => prev.map((d) => (d.date === todayStr ? { ...d, score: ns } : d)))
  }

  const getGreeting = (): { text: string; Icon: React.ComponentType<{ size?: number; color?: string }> } => {
    const h = new Date().getHours()
    if (h < 12) return { text: 'Good morning', Icon: Sun }
    if (h < 17) return { text: 'Good afternoon', Icon: CloudSun }
    if (h < 21) return { text: 'Good evening', Icon: Sunset }
    return { text: 'Good night', Icon: Moon }
  }

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const isDesktop = breakpoint === 'desktop'
  const isTablet = breakpoint === 'tablet'

  /* ─── Mini progress bars shown beside the ring ──────────────── */
  const MiniProgress = () => (
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase' }}>
        Daily Progress
      </p>
      {HABIT_DEFINITIONS.slice(0, isDesktop ? 6 : 3).map((habit) => {
        const val = (todayData.completions as Record<string, number>)[habit.id] ?? 0
        const tgt = targets[habit.id]
        const pct = Math.min((val / tgt) * 100, 100)
        return (
          <div key={habit.id} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>
                <HabitIcon habitId={habit.id} color={habit.color} size={12} strokeWidth={2.5} />
                {habit.label}
              </span>
              <span style={{ fontSize: 11, color: habit.color, fontWeight: 700 }}>{val}/{tgt}</span>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: '100%', borderRadius: 99, background: habit.color, boxShadow: `0 0 6px ${habit.glowColor}` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )

  /* ─── Habit grid cols: 2 on mobile/tablet, 3 on desktop ─────── */
  const habitGridCols = isDesktop ? '1fr 1fr 1fr' : isTablet ? '1fr 1fr 1fr' : '1fr 1fr'

  /* ─── Ring size: bigger on desktop ──────────────────────────── */
  const ringSize = isDesktop ? 200 : isTablet ? 180 : 160

  return (
    <div style={{ paddingBottom: isDesktop ? 0 : 20 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: isDesktop ? 28 : 20 }}
      >
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{dateStr}</p>
        <h1 style={{ fontSize: isDesktop ? 28 : 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginTop: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
          {(() => { const { text, Icon } = getGreeting(); return <>{text} <Icon size={isDesktop ? 28 : 22} color="#FFC94A" /></> })()}
        </h1>
      </motion.div>

      {isDesktop ? (
        /* ── DESKTOP layout ─────────────────────────────────────── */
        <>
          {/* Row 1: Ring (left) + Progress (right) */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, marginBottom: 20, alignItems: 'start' }}>
            {/* Ring card — overflow:visible so glow shadow is never clipped */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: '12px',
                borderRadius: 24,
                background: 'rgba(23,23,23,0.8)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                /* critical: lets the drop-shadow/glow bleed outside the rounded card */
                overflow: 'visible',
              }}
            >
              <WellnessRing score={score} size={ringSize} />
            </motion.div>

            {/* Progress list */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: 24,
                borderRadius: 24,
                background: 'rgba(23,23,23,0.8)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
              }}
            >
              <MiniProgress />
            </motion.div>
          </div>

          {/* Row 2: Streak calendar — full width, not cramped */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: '18px 24px',
              borderRadius: 20,
              background: 'rgba(23,23,23,0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: 24,
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase' }}>
              7-Day Streak
            </p>
            <StreakCalendar weekHistory={weekHistory} todayStr={todayStr} />
          </motion.div>
        </>
      ) : (
        /* ── MOBILE / TABLET: stacked ring + streak ─────────────── */
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isTablet ? 28 : 20,
              padding: isTablet ? '28px' : '24px',
              borderRadius: 24,
              background: 'rgba(23,23,23,0.8)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.07)',
              marginBottom: 16,
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
              /* glow must bleed outside the card corners */
              overflow: 'visible',
            }}
          >
            <WellnessRing score={score} size={ringSize} />
            <MiniProgress />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: '16px',
              borderRadius: 20,
              background: 'rgba(23,23,23,0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: 20,
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 12, textTransform: 'uppercase' }}>
              7-Day Streak
            </p>
            <StreakCalendar weekHistory={weekHistory} todayStr={todayStr} compact />
          </motion.div>
        </>
      )}

      {/* Habits Grid ─────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.3 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase' }}>
          Today&apos;s Habits
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: habitGridCols, gap: isDesktop ? 16 : 12 }}>
          {HABIT_DEFINITIONS.map((habit, index) => {
            const current = (todayData.completions as Record<string, number>)[habit.id] ?? 0
            const target = targets[habit.id]
            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                current={current}
                target={target}
                onIncrement={() => handleIncrement(habit.id)}
                onDecrement={() => handleDecrement(habit.id)}
                index={index}
              />
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
