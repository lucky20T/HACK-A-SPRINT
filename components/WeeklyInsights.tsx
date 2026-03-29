'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  HABIT_DEFINITIONS,
  getLast7Days,
  getWeekHistory,
  getTargets,
  getTodayString,
  Targets,
  WeekHistory,
} from '@/lib/storage'
import { calculateDailyScore } from '@/lib/scoring'
import { generateWeeklyInsights, WeeklyInsight, InsightSeverity } from '@/lib/insights'
import type { Breakpoint } from '@/lib/useBreakpoint'
import { HabitIcon } from '@/lib/habitIcons'
import { BarChart3, Flame, Star, TrendingUp, AlertTriangle, ArrowUp, CheckCircle } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import WeeklyChart from './WeeklyChart'
import StreakCalendar from './StreakCalendar'
import { useTheme } from '@/lib/ThemeContext'

interface Props {
  breakpoint: Breakpoint
}

/* ─── Severity visual config ─────────────────────────────────────────── */
type SeverityConfig = Record<
  InsightSeverity,
  { label: string; bg: string; border: string; accent: string; Icon: React.ComponentType<{ size?: number; color?: string }> }
>

const SEVERITY_CONFIG_DARK: SeverityConfig = {
  critical: {
    label: 'Needs Attention',
    bg: 'linear-gradient(135deg, rgba(217,95,95,0.12) 0%, var(--card-bg) 100%)',
    border: 'rgba(217,95,95,0.30)',
    accent: 'var(--error)',
    Icon: AlertTriangle,
  },
  low: {
    label: 'Room to Improve',
    bg: 'linear-gradient(135deg, rgba(255,154,31,0.12) 0%, var(--card-bg) 100%)',
    border: 'rgba(255,154,31,0.30)',
    accent: 'var(--orange)',
    Icon: ArrowUp,
  },
  medium: {
    label: 'Almost There',
    bg: 'linear-gradient(135deg, rgba(228,240,90,0.10) 0%, var(--card-bg) 100%)',
    border: 'rgba(228,240,90,0.25)',
    accent: 'var(--neon-lime)',
    Icon: CheckCircle,
  },
}

const SEVERITY_CONFIG_LIGHT: SeverityConfig = {
  critical: {
    label: 'Needs Attention',
    bg: 'linear-gradient(135deg, rgba(255,107,107,0.08) 0%, rgba(255,255,255,0.95) 100%)',
    border: 'rgba(255,107,107,0.30)',
    accent: '#FF6B6B',
    Icon: AlertTriangle,
  },
  low: {
    label: 'Room to Improve',
    bg: 'linear-gradient(135deg, rgba(255,155,74,0.09) 0%, rgba(255,255,255,0.95) 100%)',
    border: 'rgba(255,155,74,0.35)',
    accent: '#FF9B4A',
    Icon: ArrowUp,
  },
  medium: {
    label: 'Almost There',
    bg: 'linear-gradient(135deg, rgba(108,124,255,0.08) 0%, rgba(255,255,255,0.95) 100%)',
    border: 'rgba(108,124,255,0.28)',
    accent: '#6C7CFF',
    Icon: CheckCircle,
  },
}

/* ─── Single insight card ─────────────────────────────────────────────── */
function InsightCard({ insight, index }: { insight: WeeklyInsight; index: number }) {
  const habit = HABIT_DEFINITIONS.find((h) => h.id === insight.habitId)!
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const cfg = (isLight ? SEVERITY_CONFIG_LIGHT : SEVERITY_CONFIG_DARK)[insight.severity]
  const SeverityIcon = cfg.Icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 + index * 0.10, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '20px',
        borderRadius: 20,
        background: cfg.bg,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 0 24px ${cfg.accent}22, var(--card-shadow)`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        {/* Habit icon badge */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `${habit.color}18`,
          border: `1px solid ${habit.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HabitIcon habitId={insight.habitId} color={habit.color} size={22} strokeWidth={1.8} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Severity badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
            color: cfg.accent, textTransform: 'uppercase', marginBottom: 4,
          }}>
            <SeverityIcon size={10} color={cfg.accent} />
            {cfg.label}
          </span>

          {/* Title */}
          <p style={{
            fontSize: 15, fontWeight: 800, color: 'var(--text-primary)',
            letterSpacing: '-0.02em', lineHeight: 1.25,
          }}>
            {insight.title}
          </p>
        </div>
      </div>

      {/* Body */}
      <p style={{
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7,
        paddingLeft: 56, /* align with text column */
      }}>
        {insight.body}
      </p>
    </motion.div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function WeeklyInsights({ breakpoint }: Props) {
  const [weekData, setWeekData] = useState<Array<{ date: string; score: number }>>([])
  const [fullHistory, setFullHistory] = useState<WeekHistory>([])
  const [targets, setTargets] = useState<Targets>(() =>
    HABIT_DEFINITIONS.reduce((acc, h) => ({ ...acc, [h.id]: h.defaultTarget }), {} as Targets)
  )
  const todayStr = getTodayString()
  const isDesktop = breakpoint === 'desktop'
  const { theme } = useTheme()
  const isLight = theme === 'light'

  useEffect(() => {
    const t = getTargets()
    setTargets(t)
    const history = getWeekHistory()
    setFullHistory(history)
    const days = getLast7Days()
    const scores = days.map((date) => {
      const d = history.find((h) => h.date === date) ?? { date, completions: {} }
      return { date, score: calculateDailyScore(d.completions, t) }
    })
    setWeekData(scores)
  }, [])

  const insights = generateWeeklyInsights(fullHistory, targets)

  const avgScore = weekData.length > 0 ? Math.round(weekData.reduce((s, d) => s + d.score, 0) / weekData.length) : 0
  const bestScore = Math.max(...weekData.map((d) => d.score), 0)
  const streak = (() => {
    let count = 0
    for (let i = weekData.length - 1; i >= 0; i--) {
      if (weekData[i].score >= 50) count++; else break
    }
    return count
  })()

  const statsItems = [
    { label: 'Avg Score', value: avgScore, Icon: TrendingUp, color: isLight ? '#6C7CFF' : '#E4F05A' },
    { label: 'Best Day', value: bestScore, Icon: Star, color: isLight ? '#58D68D' : '#7ED957' },
    { label: 'Day Streak', value: streak, Icon: Flame, color: isLight ? '#FF9B4A' : '#FF9A1F' },
  ]

  /* ── Insight panel (shared between desktop right-col and mobile stacked) */
  const InsightPanel = () => (
    <div>
      <p style={{
        fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14,
      }}>
        Personalized Focus
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr',
        gap: 14,
      }}>
        {insights.map((insight, i) => (
          <InsightCard key={insight.habitId} insight={insight} index={i} />
        ))}
      </div>
    </div>
  )

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
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>This Week</p>
          <h1 style={{ fontSize: isDesktop ? 28 : 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginTop: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
            Weekly Insights <BarChart3 size={isDesktop ? 26 : 22} color="#E4F05A" />
          </h1>
        </div>
        <ThemeToggle />
      </motion.div>

      {/* Stat cards — always 3 col */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isDesktop ? 16 : 10, marginBottom: isDesktop ? 24 : 16 }}
      >
        {statsItems.map((stat, i) => (
          <div key={stat.label} style={{
            padding: isDesktop ? '20px 16px' : '14px 10px',
            borderRadius: 18, background: 'var(--card-bg)', backdropFilter: 'blur(20px)',
            border: '1px solid var(--card-border)', textAlign: 'center',
            boxShadow: 'var(--card-shadow)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
              <stat.Icon size={16} color={stat.color} />
            </div>
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ fontSize: isDesktop ? 32 : 26, fontWeight: 800, color: stat.color, letterSpacing: '-0.04em', lineHeight: 1 }}
            >
              {stat.value}
            </motion.p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginTop: 6, letterSpacing: '0.04em' }}>
              {stat.label.toUpperCase()}
            </p>
          </div>
        ))}
      </motion.div>

      {isDesktop ? (
        /* ── DESKTOP: single column, insights at bottom ─────────── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ padding: '22px', borderRadius: 20, background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)' }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase' }}>Score Trend</p>
            <WeeklyChart data={weekData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ padding: '22px', borderRadius: 20, background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)' }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase' }}>Week at a Glance</p>
            <StreakCalendar weekHistory={weekData} todayStr={todayStr} />
          </motion.div>

          <InsightPanel />
        </div>
      ) : (
        /* ── MOBILE / TABLET: stacked ──────────────────────────── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ padding: '18px', borderRadius: 20, background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)' }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase' }}>Score Trend</p>
            <WeeklyChart data={weekData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ padding: '18px', borderRadius: 20, background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)' }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase' }}>Week at a Glance</p>
            <StreakCalendar weekHistory={weekData} todayStr={todayStr} />
          </motion.div>

          <InsightPanel />
        </div>
      )}
    </div>
  )
}
