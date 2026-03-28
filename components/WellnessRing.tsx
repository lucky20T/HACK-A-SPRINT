'use client'

import { useEffect, useRef, useState } from 'react'
import { getScoreGradient, getScoreLabel } from '@/lib/scoring'
import { Trophy, Star, ThumbsUp, TrendingUp, BatteryLow, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface WellnessRingProps {
  score: number
  size?: number
}

export default function WellnessRing({ score, size = 180 }: WellnessRingProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const [currentOffset, setCurrentOffset] = useState(0)
  const animFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference * (1 - score / 100)

  const padding = 40 // space for glow

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

  const getLabelIcon = (): LucideIcon => {
    if (score >= 90) return Trophy
    if (score >= 75) return Star
    if (score >= 60) return ThumbsUp
    if (score >= 40) return TrendingUp
    if (score >= 20) return BatteryLow
    return Sparkles
  }
  const LabelIcon = getLabelIcon()

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
        overflow: 'visible', // prevent clipping
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
        }}
      >
        {/* 🔥 ONLY OUTER GLOW (clean premium look) */}
        {isHigh && (
          <div
            style={{
              position: 'absolute',
              inset: -28,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${gradStart}22 0%, transparent 70%)`,
              filter: 'blur(12px)',
              animation: 'ring-glow 3s ease-in-out infinite',
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
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={currentOffset}
            style={{
              filter: `drop-shadow(0 0 10px ${gradStart}aa)`,
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
              color: gradStart,
              lineHeight: 1,
              animation: isHigh ? 'score-pulse 3s ease-in-out infinite' : 'none',
            }}
          >
            {displayScore}
          </span>

          <span
            style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              fontWeight: 500,
              letterSpacing: '0.05em',
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
            <LabelIcon size={10} color={gradStart} />
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}