'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground'
import BottomNav, { TabId } from './BottomNav'
import SideNav from './SideNav'
import TodayDashboard from './TodayDashboard'
import WeeklyInsights from './WeeklyInsights'
import GoalsScreen from './GoalsScreen'
import HistoryScreen from './HistoryScreen'
import { useBreakpoint } from '@/lib/useBreakpoint'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  enter:   { opacity: 1, y: 0  },
  exit:    { opacity: 0, y: -6 },
}

const pageTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as const,
}

export default function HealthApp() {
  const [activeTab, setActiveTab] = useState<TabId>('today')
  const bp = useBreakpoint()
  const isDesktop = bp === 'desktop'
  const isTablet  = bp === 'tablet'

  const renderScreen = () => {
    switch (activeTab) {
      case 'today':    return <TodayDashboard   key="today"    breakpoint={bp} />
      case 'insights': return <WeeklyInsights   key="insights" breakpoint={bp} />
      case 'goals':    return <GoalsScreen      key="goals"    breakpoint={bp} />
      case 'history':  return <HistoryScreen    key="history"  breakpoint={bp} />
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <AnimatedBackground />

      {isDesktop ? (
        /* ── Desktop: sidebar + main ─────────────────────────────── */
        <div style={{ display: 'flex', minHeight: '100dvh', position: 'relative', zIndex: 1 }}>
          <SideNav activeTab={activeTab} onTabChange={setActiveTab} />

          <main
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '40px 40px 40px 40px',
              maxHeight: '100vh',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                transition={pageTransition}
                style={{ maxWidth: 1080, margin: '0 auto' }}
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      ) : (
        /* ── Mobile / Tablet: bottom nav + scroll area ──────────── */
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Scrollable content — ends above the nav */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div style={{
              maxWidth: isTablet ? 720 : 430,
              margin: '0 auto',
              padding: isTablet ? '56px 24px 32px' : '56px 16px 28px',
            }}>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeTab}
                  variants={pageVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  transition={pageTransition}
                >
                  {renderScreen()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Nav bar — part of the flex column, never moves */}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}
    </div>
  )
}
