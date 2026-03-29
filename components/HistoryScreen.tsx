'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  HABIT_DEFINITIONS,
  getLast7Days,
  getWeekHistory,
  getTargets,
  DayData,
  Targets,
} from '@/lib/storage'
import { calculateDailyScore, getScoreColor } from '@/lib/scoring'
import { HabitIcon } from '@/lib/habitIcons'
import { CalendarDays } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import type { Breakpoint } from '@/lib/useBreakpoint'
import { useTheme } from '@/lib/ThemeContext'

interface Props { breakpoint: Breakpoint }

export default function HistoryScreen({ breakpoint }: Props) {
  const [history, setHistory]   = useState<DayData[]>([])
  const [targets, setTargets]   = useState<Targets>(() =>
    HABIT_DEFINITIONS.reduce((acc, h) => ({ ...acc, [h.id]: h.defaultTarget }), {} as Targets)
  )
  const [expandedDate, setExpandedDate] = useState<string | null>(null)
  const isDesktop = breakpoint === 'desktop'
  const isTablet  = breakpoint === 'tablet'
  const { theme } = useTheme()
  const isLight = theme === 'light'

  useEffect(() => {
    const t = getTargets()
    setTargets(t)
    const stored = getWeekHistory()
    const days = getLast7Days().reverse()
    setHistory(days.map((date) => stored.find((d) => d.date === date) ?? { date, completions: {} }))
  }, [])

  const formatDate = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  const DayCard = ({ day, index }: { day: DayData; index: number }) => {
    const score      = calculateDailyScore(day.completions, targets)
    const scoreColor = getScoreColor(score)
    const isExpanded = expandedDate === day.date
    const isToday    = day.date === new Date().toISOString().split('T')[0]

    return (
      <motion.div
        key={day.date}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setExpandedDate(isExpanded ? null : day.date)}
        style={{
          borderRadius: 20,
          background: 'var(--card-bg)',
          backdropFilter: 'blur(20px)',
          border: isToday
            ? isLight ? '1px solid rgba(108,124,255,0.30)' : '1px solid rgba(228,240,90,0.3)'
            : '1px solid var(--card-border)',
          boxShadow: isToday
            ? isLight ? '0 0 18px rgba(108,124,255,0.12), var(--card-shadow)' : '0 0 20px rgba(228,240,90,0.1), 0 4px 20px rgba(0,0,0,0.3)'
            : 'var(--card-shadow)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 300ms',
        }}
      >
        {/* Main row */}
        <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', background: `${scoreColor}15`,
            border: `2px solid ${scoreColor}44`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 12px ${scoreColor}30`,
          }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: scoreColor }}>{score}</span>
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatDate(day.date)}
              {isToday && (
                <span style={{
                  marginLeft: 8, fontSize: 10,
                  background: isLight ? 'var(--neon-lime)' : 'var(--neon-lime)',
                  color: isLight ? '#152033' : '#0B0B0B',
                  fontWeight: 700, padding: '2px 7px', borderRadius: 99, verticalAlign: 'middle',
                }}>TODAY</span>
              )}
            </p>
            <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              {HABIT_DEFINITIONS.map((habit) => {
                const val  = (day.completions as Record<string, number>)[habit.id] ?? 0
                const done = val >= targets[habit.id]
                return (
                  <span key={habit.id} title={`${habit.label}: ${val}/${targets[habit.id]}`}
                    style={{ opacity: done ? 1 : 0.2, display: 'flex' }}>
                    <HabitIcon habitId={habit.id} color={habit.color} size={16} strokeWidth={done ? 2 : 1.5} />
                  </span>
                )
              })}
            </div>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ color: 'var(--text-muted)', flexShrink: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>

        {/* Expanded detail */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '0 18px 16px', borderTop: `1px solid var(--divider)`, paddingTop: 14 }}>
                {/* Desktop: 2-col habit rows */}
                <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: '6px 20px' }}>
                  {HABIT_DEFINITIONS.map((habit) => {
                    const val  = (day.completions as Record<string, number>)[habit.id] ?? 0
                    const tgt  = targets[habit.id]
                    const pct  = Math.min((val / tgt) * 100, 100)
                    const done = val >= tgt
                    return (
                      <div key={habit.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
                           <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                             <HabitIcon habitId={habit.id} color={done ? habit.color : 'var(--text-muted)'} size={13} strokeWidth={2} />
                             {habit.label}
                           </span>
                           <span style={{ fontSize: 12, fontWeight: 700, color: done ? habit.color : 'var(--text-muted)' }}>
                            {val} / {tgt} {habit.unit}
                          </span>
                        </div>
                        <div style={{ height: 4, borderRadius: 99, background: 'var(--track-bg)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: done ? habit.color : `${habit.color}55`, boxShadow: done ? `0 0 6px ${habit.glowColor}` : 'none', transition: 'width 600ms var(--ease-premium)' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div style={{ paddingBottom: isDesktop ? 0 : 20 }}>
      {/* Header row */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          marginBottom: isDesktop ? 28 : 20,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Past 7 Days</p>
          <h1 style={{ fontSize: isDesktop ? 28 : 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginTop: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
            History <CalendarDays size={isDesktop ? 26 : 22} color={isLight ? '#6C7CFF' : '#E4F05A'} />
          </h1>
        </div>
        <ThemeToggle />
      </motion.div>

      {isDesktop ? (
        /* ── DESKTOP: 2-column card grid ─────────────────────────── */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {history.map((day, i) => <DayCard key={day.date} day={day} index={i} />)}
        </div>
      ) : (
        /* ── MOBILE / TABLET: single column list ─────────────────── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {history.map((day, i) => <DayCard key={day.date} day={day} index={i} />)}
        </div>
      )}
    </div>
  )
}
