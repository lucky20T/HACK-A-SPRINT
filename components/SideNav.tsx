'use client'

import { motion } from 'framer-motion'
import { TabId } from './BottomNav'
import { Zap, Lock } from 'lucide-react'

interface SideNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const NAV_ITEMS: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
  {
    id: 'today',
    label: 'Today',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'History',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

export default function SideNav({ activeTab, onTabChange }: SideNavProps) {
  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        background: 'rgba(17,17,17,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        gap: 6,
        zIndex: 50,
      }}
    >
      {/* Logo / Brand */}
      <div style={{ paddingLeft: 12, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--neon-lime)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(228,240,90,0.4)',
          }}>
            <Zap size={18} color="#0B0B0B" fill="#0B0B0B" />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Vitality</p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, marginTop: 1 }}>Health Tracker</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeTab
          return (
            <button
              key={item.id}
              id={`sidenav-${item.id}`}
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 14,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                transition: 'background 200ms',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidenav-active-bg"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 14,
                    background: 'rgba(228,240,90,0.1)',
                    border: '1px solid rgba(228,240,90,0.25)',
                    boxShadow: '0 0 20px rgba(228,240,90,0.08)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <motion.span
                animate={{ color: isActive ? '#E4F05A' : '#6F6F6F' }}
                transition={{ duration: 0.2 }}
                style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}
              >
                {item.icon}
              </motion.span>

              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--neon-lime)' : 'var(--text-secondary)',
                  transition: 'color 200ms',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.label}
              </span>

              {isActive && (
                <div style={{
                  position: 'absolute',
                  right: 14,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--neon-lime)',
                  boxShadow: '0 0 8px var(--neon-lime)',
                }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom info */}
      <div style={{
        padding: '16px 12px',
        borderRadius: 14,
        background: 'rgba(228,240,90,0.05)',
        border: '1px solid rgba(228,240,90,0.1)',
      }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <Lock size={12} color="#6F6F6F" style={{ flexShrink: 0, marginTop: 1 }} />
          All data stays on your device. No account needed.
        </p>
      </div>
    </aside>
  )
}
