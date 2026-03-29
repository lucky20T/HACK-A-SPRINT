'use client'

import { useEffect, useRef, useState } from 'react'
import { getScoreGradient, getScoreLabel } from '@/lib/scoring'
import { Trophy, Star, ThumbsUp, TrendingUp, BatteryLow, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'

interface WellnessRingProps {
  score: number
  size?: number
}

/* Light theme uses a fixed stunning multi-stop rainbow ring */
const LIGHT_RING_STOPS = [
  { offset: '0%',   color: '#F6D94C' },
  { offset: '25%',  color: '#FF9B4A' },
  { offset: '50%',  color: '#FF6FAE' },
  { offset: '75%',  color: '#A56BFF' },
  { offset: '100%', color: '#6C7CFF' },
]

export default function WellnessRing({ score, size = 180 }: WellnessRingProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const [currentOffset, setCurrentOffset] = useState(0)
  const animFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference * (1 - score / 100)

  const padding = 40

  useEffect(() => {
    const duration = 1200
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      const eased = 1 - Math.pow(1 - progress, 3)

      setDisplayScore(Math.round(eased * score))
      setCurrentOffset(circumference - eased * (circumference - targetOffset))

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [score, circumference, targetOffset])

  const [gradStart, gradEnd] = getScoreGradient(score)
  const label = getScoreLabel(score)
  const isHigh = score >= 70
  const gradientId = `ring-gradient-${size}`
  const lightGradientId = `ring-gradient-light-${size}`

  const getLabelIcon = (): LucideIcon => {
    if (score >= 90) return Trophy
    if (score >= 75) return Star
    if (score >= 60) return ThumbsUp
    if (score >= 40) return TrendingUp
    if (score >= 20) return BatteryLow
    return Sparkles
  }
  const LabelIcon = getLabelIcon()

  /* Center number color: in light theme use a vibrant accent */
  const scoreColor = isLight
    ? score >= 70 ? '#6C7CFF' : score >= 40 ? '#FF9B4A' : '#FF6B6B'
    : gradStart

  /* Outer glow color for light */
  const lightGlowColor = score >= 70 ? '#6C7CFF' : score >= 40 ? '#FF9B4A' : '#FF6B6B'

  return (
    <div
      style={{
        position: 'relative',
        width: size + padding,
        height: size + padding,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'visible',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
        }}
      >
        {/* Outer glow */}
        {isHigh && (
          <div
            style={{
              position: 'absolute',
              inset: -28,
              borderRadius: '50%',
              background: isLight
                ? `radial-gradient(circle, ${lightGlowColor}1A 0%, transparent 70%)`
                : `radial-gradient(circle, ${gradStart}22 0%, transparent 70%)`,
              filter: 'blur(12px)',
              animation: isLight ? 'ring-glow-light 3s ease-in-out infinite' : 'ring-glow 3s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        <svg
          width={size}
          height={size}
          style={{
            transform: 'rotate(-90deg)',
            overflow: 'visible',
          }}
        >
          <defs>
            {/* Dark theme: score-based gradient */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>

            {/* Light theme: fixed rainbow ring */}
            <linearGradient id={lightGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              {LIGHT_RING_STOPS.map((s) => (
                <stop key={s.offset} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--ring-track)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isLight ? `url(#${lightGradientId})` : `url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={currentOffset}
            style={{
              filter: isLight
                ? `drop-shadow(0 0 8px ${lightGlowColor}88)`
                : `drop-shadow(0 0 10px ${gradStart}aa)`,
              transition: 'none',
            }}
          />
        </svg>

        {/* CENTER CONTENT */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: size * 0.26,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: scoreColor,
              lineHeight: 1,
              animation: isHigh
                ? isLight
                  ? 'score-pulse-light 3s ease-in-out infinite'
                  : 'score-pulse 3s ease-in-out infinite'
                : 'none',
            }}
          >
            {displayScore}
          </span>

          <span
            style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              fontWeight: 600,
              letterSpacing: '0.06em',
            }}
          >
            WELLNESS
          </span>

          <span
            style={{
              fontSize: 11,
              color: 'var(--text-secondary)',
              fontWeight: 600,
              marginTop: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <LabelIcon size={10} color={scoreColor} />
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}