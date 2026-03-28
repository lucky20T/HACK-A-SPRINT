'use client'

import { motion } from 'framer-motion'
import { getDayLabel, getLast7Days } from '@/lib/storage'

interface StreakCalendarProps {
  weekHistory: Array<{ date: string; score: number }>
  todayStr: string
  compact?: boolean
}

const getTileColor = (score: number, isFuture: boolean) => {
  if (isFuture) return { bg: 'rgba(36,36,36,0.5)', border: 'rgba(255,255,255,0.04)' }
  if (score >= 75) return { bg: 'rgba(126,217,87,0.25)', border: 'rgba(126,217,87,0.5)' }
  if (score >= 50) return { bg: 'rgba(224,197,74,0.2)', border: 'rgba(224,197,74,0.4)' }
  if (score >= 20) return { bg: 'rgba(255,154,31,0.2)', border: 'rgba(255,154,31,0.4)' }
  return { bg: 'rgba(217,95,95,0.15)', border: 'rgba(217,95,95,0.3)' }
}

const getScoreDot = (score: number) => {
  if (score >= 75) return '#7ED957'
  if (score >= 50) return '#E0C54A'
  if (score >= 20) return '#FF9A1F'
  return '#D95F5F'
}

export default function StreakCalendar({ weekHistory, todayStr, compact = false }: StreakCalendarProps) {
  const days = getLast7Days()

  const historyMap = weekHistory.reduce<Record<string, number>>((acc, d) => {
    acc[d.date] = d.score
    return acc
  }, {})

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 8,
      }}
    >
      {days.map((dateStr, i) => {
        const isToday = dateStr === todayStr
        const isFuture = dateStr > todayStr
        const score = historyMap[dateStr] ?? (isFuture ? -1 : 0)
        const colors = getTileColor(isFuture ? -1 : score, isFuture)
        const dayLabel = getDayLabel(dateStr)

        return (
          <motion.div
            key={dateStr}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: i * 0.06,
              duration: 0.35,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
              {dayLabel}
            </span>

            <div
              style={{
                width: '100%',
                aspectRatio: '1',
                maxWidth: 64,       /* cap on very wide viewports */
                borderRadius: 12,
                background: colors.bg,
                border: `1.5px solid ${isToday ? 'var(--neon-lime)' : colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: isToday ? '0 0 12px rgba(228,240,90,0.4)' : 'none',
                transition: 'all 200ms var(--ease-premium)',
              }}
            >
              {!isFuture && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isFuture ? 'var(--text-muted)' : (score === 0 ? 'var(--text-muted)' : getScoreDot(score)),
                  }}
                >
                  {isFuture ? '·' : (score === 0 ? '—' : score)}
                </span>
              )}
              {isFuture && (
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>·</span>
              )}

              {isToday && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--neon-lime)',
                    boxShadow: '0 0 6px var(--neon-lime)',
                  }}
                />
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
