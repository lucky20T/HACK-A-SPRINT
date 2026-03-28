'use client'

import { motion } from 'framer-motion'

export type TabId = 'today' | 'insights' | 'goals' | 'history'

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const TabIcon = ({ id }: { id: TabId }) => {
  const style = { width: 22, height: 22 }
  switch (id) {
    case 'today':
      return (
        <svg {...style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    case 'insights':
      return (
        <svg {...style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      )
    case 'goals':
      return (
        <svg {...style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      )
    case 'history':
      return (
        <svg {...style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
  }
}

const TABS: Tab[] = [
  { id: 'today', label: 'Today', icon: null },
  { id: 'insights', label: 'Insights', icon: null },
  { id: 'goals', label: 'Goals', icon: null },
  { id: 'history', label: 'History', icon: null },
]

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      style={{
        /* nav bar is the flex column's last child — no position:fixed needed */
        zIndex: 100,
        /* keep it on its own GPU compositor layer so page transitions never make it flicker */
        transform: 'translateZ(0)',
        willChange: 'transform',
        flexShrink: 0,
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          background: 'rgba(18,18,18,0.96)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
          borderRadius: '28px 28px 0 0',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.55), 0 -1px 0 rgba(255,255,255,0.06)',
          paddingTop: 10,
          paddingBottom: 'max(18px, env(safe-area-inset-bottom))',
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              id={`nav-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '8px 12px',
                borderRadius: 20,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: isActive ? '#0B0B0B' : 'var(--text-muted)',
                flex: 1,
                transition: 'color 200ms',
              }}
            >
              {/* Active bg */}
              {isActive && (
                <motion.div
                  layoutId="nav-active-bg"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 20,
                    background: 'var(--neon-lime)',
                    boxShadow: '0 0 16px rgba(228,240,90,0.5)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38, mass: 0.8 }}
                />
              )}

              <motion.span
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? '#0B0B0B' : '#6F6F6F',
                }}
                transition={{ duration: 0.2 }}
                style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}
              >
                <TabIcon id={tab.id} />
              </motion.span>

              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.02em',
                  color: isActive ? '#0B0B0B' : 'var(--text-muted)',
                  transition: 'color 200ms',
                }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
