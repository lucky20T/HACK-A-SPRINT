'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { HABIT_DEFINITIONS, getTargets, saveTargets, Targets } from '@/lib/storage'
import { HabitIcon } from '@/lib/habitIcons'
import { Target } from 'lucide-react'
import type { Breakpoint } from '@/lib/useBreakpoint'

interface Props { breakpoint: Breakpoint }

export default function GoalsScreen({ breakpoint }: Props) {
  const [targets, setTargets] = useState<Targets>(() =>
    HABIT_DEFINITIONS.reduce((acc, h) => ({ ...acc, [h.id]: h.defaultTarget }), {} as Targets)
  )
  const [savedPulse, setSavedPulse] = useState<string | null>(null)
  const isDesktop = breakpoint === 'desktop'
  const isTablet  = breakpoint === 'tablet'

  useEffect(() => { setTargets(getTargets()) }, [])

  const handleChange = (habitId: string, value: number) => {
    const habit = HABIT_DEFINITIONS.find((h) => h.id === habitId)!
    const clamped = Math.max(habit.step, Math.min(value, habit.max))
    const updated = { ...targets, [habitId]: clamped }
    setTargets(updated)
    saveTargets(updated)
    setSavedPulse(habitId)
    setTimeout(() => setSavedPulse(null), 1200)
  }

  /* grid: 1-col mobile, 2-col tablet, 3-col desktop */
  const gridCols = isDesktop ? 'repeat(3, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr'

  return (
    <div style={{ paddingBottom: isDesktop ? 0 : 20 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: isDesktop ? 28 : 20 }}
      >
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Customize</p>
        <h1 style={{ fontSize: isDesktop ? 28 : 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginTop: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
          Daily Targets <Target size={isDesktop ? 26 : 22} color="#E4F05A" />
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
          Set realistic goals for each habit. Changes save automatically.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: isDesktop ? 18 : 14 }}>
        {HABIT_DEFINITIONS.map((habit, index) => {
          const current  = targets[habit.id]
          const isSaved  = savedPulse === habit.id
          const maxSteps = habit.max / habit.step
          const currStep = current / habit.step
          const pct      = (currStep / maxSteps) * 100

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: isDesktop ? '20px' : '18px',
                borderRadius: 20,
                background: 'rgba(23,23,23,0.85)',
                backdropFilter: 'blur(20px)',
                border: isSaved ? `1px solid ${habit.color}66` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isSaved ? `0 0 24px ${habit.glowColor}, 0 4px 20px rgba(0,0,0,0.3)` : '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'border-color 300ms, box-shadow 300ms',
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: `${habit.color}18`,
                    border: `1px solid ${habit.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    animation: isSaved ? 'icon-breathe 0.8s ease-in-out' : 'none',
                  }}>
                    <HabitIcon habitId={habit.id} color={habit.color} size={22} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{habit.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{habit.description}</p>
                  </div>
                </div>
                {isSaved && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ fontSize: 11, fontWeight: 700, color: habit.color, background: `${habit.color}18`, padding: '3px 10px', borderRadius: 99, border: `1px solid ${habit.color}44` }}
                  >
                    ✓ saved
                  </motion.span>
                )}
              </div>

              {/* Value + stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <button
                  id={`goal-dec-${habit.id}`}
                  onClick={() => handleChange(habit.id, current - habit.step)}
                  disabled={current <= habit.step}
                  style={{
                    width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)', color: current <= habit.step ? 'var(--text-muted)' : 'var(--text-secondary)',
                    fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: current <= habit.step ? 'not-allowed' : 'pointer', transition: 'all 150ms', flexShrink: 0,
                  }}
                  aria-label={`Decrease ${habit.label} target`}
                >−</button>

                <div style={{ flex: 1, textAlign: 'center' }}>
                  <motion.div key={current} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
                    <span style={{ fontSize: 30, fontWeight: 800, color: habit.color, letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {current}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 4, fontWeight: 500 }}>
                      {habit.unit}
                    </span>
                  </motion.div>
                </div>

                <button
                  id={`goal-inc-${habit.id}`}
                  onClick={() => handleChange(habit.id, current + habit.step)}
                  disabled={current >= habit.max}
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: current >= habit.max ? 'rgba(255,255,255,0.04)' : habit.color,
                    border: 'none', color: current >= habit.max ? 'var(--text-muted)' : '#0B0B0B',
                    fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: current >= habit.max ? 'not-allowed' : 'pointer', transition: 'all 150ms',
                    boxShadow: current >= habit.max ? 'none' : `0 0 16px ${habit.glowColor}`, flexShrink: 0,
                  }}
                  aria-label={`Increase ${habit.label} target`}
                >+</button>
              </div>

              {/* Track */}
              <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${habit.color}88, ${habit.color})`, boxShadow: `0 0 8px ${habit.glowColor}` }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{habit.step} min</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{habit.max} max</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
