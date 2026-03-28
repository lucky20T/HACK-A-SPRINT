'use client'

import { motion } from 'framer-motion'
import { HabitDefinition } from '@/lib/storage'
import { HabitIcon } from '@/lib/habitIcons'
import { useRef } from 'react'

interface HabitCardProps {
  habit: HabitDefinition
  current: number
  target: number
  onIncrement: () => void
  onDecrement: () => void
  index: number
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

  const triggerRipple = () => {
    if (!rippleRef.current) return
    const el = rippleRef.current
    el.style.animation = 'none'
    void el.offsetWidth // reflow
    el.style.animation = 'ripple 600ms ease-out forwards'
  }

  const handleTap = () => {
    triggerRipple()
    onIncrement()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileTap={{ scale: 0.96 }}
      style={{
        position: 'relative',
        borderRadius: 20,
        padding: '16px',
        background: completed
          ? `linear-gradient(135deg, rgba(126,217,87,0.08) 0%, rgba(23,23,23,0.9) 100%)`
          : 'rgba(23,23,23,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: completed
          ? `1px solid rgba(126,217,87,0.3)`
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: completed
          ? `0 0 20px rgba(126,217,87,0.15), 0 4px 24px rgba(0,0,0,0.4)`
          : '0 4px 24px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 300ms, box-shadow 300ms, background 300ms',
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
          background: `${habit.color}22`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Progress fill bar at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          width: `${ratio * 100}%`,
          background: `linear-gradient(90deg, ${habit.color}, ${habit.color}88)`,
          borderRadius: '0 0 20px 20px',
          transition: 'width 400ms cubic-bezier(0.22,1,0.36,1)',
          boxShadow: `0 0 8px ${habit.glowColor}`,
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
              background: `${habit.color}18`,
              border: `1px solid ${habit.color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <HabitIcon
                habitId={habit.id}
                color={habit.color}
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
                background: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 12px rgba(126,217,87,0.6)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L4.5 8.5L10 3" stroke="#0B0B0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-secondary)',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms',
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
              initial={{ scale: 1.3, color: habit.color }}
              animate={{ scale: 1, color: 'var(--text-primary)' }}
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
              background: habit.color,
              border: 'none',
              color: '#0B0B0B',
              fontSize: 18,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms',
              boxShadow: `0 0 12px ${habit.glowColor}`,
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
