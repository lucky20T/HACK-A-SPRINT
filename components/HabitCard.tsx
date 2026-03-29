'use client'

import { motion } from 'framer-motion'
import { HabitDefinition } from '@/lib/storage'
import { HabitIcon } from '@/lib/habitIcons'
import { useRef } from 'react'
import { useTheme } from '@/lib/ThemeContext'

interface HabitCardProps {
  habit: HabitDefinition
  current: number
  target: number
  onIncrement: () => void
  onDecrement: () => void
  index: number
}

/* Map habit IDs to the light theme CSS pill variables */
const PILL_VAR: Record<string, string> = {
  hydration:   'var(--pill-hydration)',
  sleep:       'var(--pill-sleep)',
  activity:    'var(--pill-activity)',
  meals:       'var(--pill-meals)',
  screenbreak: 'var(--pill-screenbreak)',
  stressrelief:'var(--pill-stress)',
}

/* Per-category light-mode colors (keep saturated accent, avoid dark-bg neons) */
const LIGHT_COLORS: Record<string, { color: string; glow: string; trackFill: string }> = {
  hydration:    { color: '#2ED7C6', glow: 'rgba(46,215,198,0.40)',   trackFill: 'linear-gradient(90deg,#2ED7C6,#6C7CFF)' },
  sleep:        { color: '#6C7CFF', glow: 'rgba(108,124,255,0.40)',  trackFill: 'linear-gradient(90deg,#6C7CFF,#A56BFF)' },
  activity:     { color: '#FF9B4A', glow: 'rgba(255,155,74,0.40)',   trackFill: 'linear-gradient(90deg,#FF9B4A,#FF6B6B)' },
  meals:        { color: '#58D68D', glow: 'rgba(88,214,141,0.40)',   trackFill: 'linear-gradient(90deg,#58D68D,#2ED7C6)' },
  screenbreak:  { color: '#D4A800', glow: 'rgba(246,217,76,0.50)',   trackFill: 'linear-gradient(90deg,#F6D94C,#FFB84D)' },
  stressrelief: { color: '#A56BFF', glow: 'rgba(165,107,255,0.40)',  trackFill: 'linear-gradient(90deg,#A56BFF,#FF6FAE)' },
}

export default function HabitCard({
  habit,
  current,
  target,
  onIncrement,
  onDecrement,
  index,
}: HabitCardProps) {
  const completed = current >= target
  const ratio = target > 0 ? Math.min(current / target, 1) : 0
  const rippleRef = useRef<HTMLSpanElement | null>(null)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const lc = LIGHT_COLORS[habit.id]
  const activeColor = isLight ? lc.color : habit.color
  const activeGlow  = isLight ? lc.glow  : habit.glowColor
  const trackFill   = isLight ? lc.trackFill : habit.color

  const triggerRipple = () => {
    if (!rippleRef.current) return
    const el = rippleRef.current
    el.style.animation = 'none'
    void el.offsetWidth
    el.style.animation = 'ripple 600ms ease-out forwards'
  }

  const handleTap = () => {
    triggerRipple()
    onIncrement()
  }

  /* Completed state colors */
  const completedBg    = isLight
    ? `linear-gradient(135deg, rgba(88,214,141,0.10) 0%, rgba(255,255,255,0.97) 100%)`
    : `linear-gradient(135deg, rgba(126,217,87,0.08) 0%, var(--card-bg) 100%)`
  const completedBorder = isLight
    ? 'rgba(88,214,141,0.40)'
    : 'rgba(126,217,87,0.3)'
  const completedShadow = isLight
    ? `0 0 18px rgba(88,214,141,0.18), var(--card-shadow)`
    : `0 0 20px rgba(126,217,87,0.15), var(--card-shadow)`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      style={{
        position: 'relative',
        borderRadius: 20,
        padding: '16px',
        background: completed ? completedBg : 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: completed
          ? `1px solid ${completedBorder}`
          : '1px solid var(--card-border)',
        boxShadow: completed ? completedShadow : 'var(--card-shadow)',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 300ms, box-shadow 300ms, background 300ms, transform 200ms',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      onClick={handleTap}
    >
      {/* Ripple */}
      <span
        ref={rippleRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          paddingBottom: '100%',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
          background: `${activeColor}22`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Top accent line (light theme only) */}
      {isLight && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 3,
            background: trackFill,
            opacity: completed ? 1 : 0.5,
            borderRadius: '20px 20px 0 0',
          }}
        />
      )}

      {/* Progress fill bar at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          width: `${ratio * 100}%`,
          background: trackFill,
          borderRadius: '0 0 20px 20px',
          transition: 'width 400ms cubic-bezier(0.22,1,0.36,1)',
          boxShadow: `0 0 8px ${activeGlow}`,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: isLight ? PILL_VAR[habit.id] ?? `${activeColor}18` : `${habit.color}18`,
              border: `1px solid ${activeColor}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <HabitIcon
                habitId={habit.id}
                color={activeColor}
                size={20}
                strokeWidth={2}
                animate={completed}
              />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {habit.label}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {habit.description}
              </p>
            </div>
          </div>

          {/* Completion badge */}
          {completed && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: isLight ? '#58D68D' : 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: isLight
                  ? '0 0 12px rgba(88,214,141,0.50)'
                  : '0 0 12px rgba(126,217,87,0.6)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L4.5 8.5L10 3" stroke={isLight ? '#FFFFFF' : '#0B0B0B'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          )}
        </div>

        {/* Value row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Decrement */}
          <button
            onClick={(e) => { e.stopPropagation(); onDecrement() }}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: isLight ? 'rgba(21,32,51,0.06)' : 'var(--input-bg)',
              border: isLight ? '1px solid rgba(21,32,51,0.10)' : '1px solid var(--input-border)',
              color: 'var(--text-secondary)',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms var(--ease-premium)',
              lineHeight: 1,
            }}
            aria-label={`Decrease ${habit.label}`}
          >
            −
          </button>

          {/* Current / Target */}
          <div style={{ textAlign: 'center' }}>
            <motion.span
              key={current}
              initial={{ scale: 1.3, color: activeColor }}
              animate={{ scale: 1, color: isLight ? '#152033' : 'var(--text-primary)' }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                display: 'block',
                lineHeight: 1,
              }}
            >
              {current}
            </motion.span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
              / {target} {habit.unit}
            </span>
          </div>

          {/* Increment */}
          <button
            onClick={(e) => { e.stopPropagation(); handleTap() }}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: isLight
                ? `linear-gradient(135deg, ${activeColor}EE 0%, ${activeColor} 100%)`
                : activeColor,
              border: 'none',
              color: isLight ? '#FFFFFF' : '#0B0B0B',
              fontSize: 18,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms var(--ease-premium)',
              boxShadow: `0 0 12px ${activeGlow}`,
              lineHeight: 1,
            }}
            aria-label={`Increase ${habit.label}`}
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  )
}
