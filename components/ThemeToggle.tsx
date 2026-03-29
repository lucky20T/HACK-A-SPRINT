'use client'

import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: 148,
        height: 44,
        borderRadius: 99,
        padding: '4px',
        border: 'none',
        cursor: 'pointer',
        background: isDark
          ? 'rgba(30,30,30,0.92)'
          : 'rgba(255,252,240,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: isDark
          ? '0 0 0 1px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 0 0 1.5px rgba(246,185,60,0.45), 0 4px 20px rgba(246,185,60,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
        transition: 'background 350ms var(--ease-premium), box-shadow 350ms var(--ease-premium)',
        flexShrink: 0,
      }}
    >
      {/* Sliding active indicator */}
      <motion.div
        animate={{ x: isDark ? 0 : 72 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.8 }}
        style={{
          position: 'absolute',
          left: 4,
          width: 68,
          height: 36,
          borderRadius: 99,
          background: isDark
            ? 'linear-gradient(135deg, #E4F05A 0%, #C4CF3C 100%)'
            : 'linear-gradient(135deg, #FFD000 0%, #FF9500 100%)',
          boxShadow: isDark
            ? '0 0 14px rgba(228,240,90,0.55), 0 2px 8px rgba(0,0,0,0.3)'
            : '0 0 18px rgba(255,165,0,0.60), 0 2px 10px rgba(255,120,0,0.30)',
          zIndex: 0,
        }}
      />

      {/* Dark segment */}
      <span style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        width: 68,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.03em',
        color: isDark ? '#0B0B0B' : 'rgba(90,105,130,0.45)',
        transition: 'color 300ms',
        userSelect: 'none',
        flexShrink: 0,
      }}>
        <Moon size={13} color={isDark ? '#0B0B0B' : 'rgba(90,105,130,0.35)'} strokeWidth={2.5} />
        Dark
      </span>

      {/* Light segment */}
      <span style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        width: 68,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.03em',
        color: !isDark ? '#7A3800' : 'rgba(245,245,245,0.38)',
        transition: 'color 300ms',
        userSelect: 'none',
        flexShrink: 0,
      }}>
        <Sun size={13} color={!isDark ? '#7A3800' : 'rgba(245,245,245,0.32)'} strokeWidth={2.5} />
        Light
      </span>
    </button>
  )
}
