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
        background: 'var(--glass-bg-nav)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid var(--glass-border)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        gap: 6,
        zIndex: 50,
        transition: 'background 350ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Logo / Brand */}
      <div style={{ paddingLeft: 12, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="120 70 260 300"
            width="30%"
            height="30%"
            preserveAspectRatio="xMidYMid slice"
          >
            <g transform="translate(0,40)">

              <path fill="#FF3E5D" d="M351.69,143.424c-0.955-47.544-58.974-82.589-104.608-42.679
    c-45.607-39.883-103.652-4.891-104.607,42.679
    c-0.246,12.114,3.252,23.912,10.212,34.79h13.692h1.499h29.943l8.021-13.367
    c2.323-3.874,7.968-4.023,10.431-0.14l16.935,26.603l24.692-52.093
    c2.147-4.558,8.564-4.69,10.939-0.289l21.16,39.287h36.289h2.489
    l12.692,0.018C348.438,167.354,351.936,155.547,351.69,143.424z"/>

              <path fill="#FF97AB" d="M286.335,190.477c-2.262,0-4.33-1.236-5.4-3.217
    l-17.145-31.836l-24.245,51.173c-2.069,4.356-8.134,4.725-10.72,0.666
    l-17.566-27.602l-4.707,7.845c-1.113,1.841-3.112,2.971-5.259,2.971
    l-38.899-0.006c0.368,0.377,1.067,1.111,1.444,1.488
    c0.035,0.035,29.066,28.909,78.925,78.486
    c2.384,2.384,6.25,2.384,8.643,0l78.925-78.486
    c0.491-0.491,0.973-0.99,1.455-1.481H286.335z"/>

            </g>
          </svg>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Vitalizer</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 1 }}>Health Tracker</p>
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
                    background: 'var(--nav-active-bg)',
                    opacity: 0.18,
                    boxShadow: '0 0 20px var(--nav-active-glow)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <motion.span
                animate={{ color: isActive ? 'var(--neon-lime)' : 'var(--nav-inactive-text)' }}
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
                  boxShadow: '0 0 8px var(--nav-active-glow)',
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
        background: 'var(--input-bg)',
        border: '1px solid var(--card-border)',
      }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <Lock size={12} color="#6F6F6F" style={{ flexShrink: 0, marginTop: 1 }} />
          All data stays on your device. No account needed.
        </p>
      </div>
    </aside>
  )
}
