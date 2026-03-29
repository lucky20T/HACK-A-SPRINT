'use client'

import { useTheme } from '@/lib/ThemeContext'

export default function AnimatedBackground() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        transition: 'background 500ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Base gradient layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isLight
          ? 'linear-gradient(180deg, #F7F9FF 0%, #EEF4FF 45%, #FFF7FB 100%)'
          : '#0B0B0B',
        transition: 'background 500ms cubic-bezier(0.22,1,0.36,1)',
      }} />

      {/* Blob 1 — Yellow/Lime */}
      <div style={{
        position: 'absolute',
        top: '-10%', left: '-10%',
        width: '65vw', height: '65vw',
        maxWidth: 600, maxHeight: 600,
        borderRadius: '50%',
        background: isLight
          ? 'radial-gradient(circle, rgba(246,217,76,0.20) 0%, rgba(246,217,76,0) 70%)'
          : 'radial-gradient(circle, rgba(228,240,90,0.18) 0%, rgba(228,240,90,0) 70%)',
        filter: 'blur(80px)',
        animation: 'blob-float-1 38s ease-in-out infinite',
        mixBlendMode: isLight ? 'normal' : 'screen',
        transition: 'background 600ms',
      }} />

      {/* Blob 2 — Blue/Purple */}
      <div style={{
        position: 'absolute',
        bottom: '10%', right: '-15%',
        width: '70vw', height: '70vw',
        maxWidth: 620, maxHeight: 620,
        borderRadius: '50%',
        background: isLight
          ? 'radial-gradient(circle, rgba(108,124,255,0.11) 0%, rgba(108,124,255,0) 70%)'
          : 'radial-gradient(circle, rgba(255,154,31,0.14) 0%, rgba(255,154,31,0) 70%)',
        filter: 'blur(100px)',
        animation: 'blob-float-2 44s ease-in-out infinite',
        mixBlendMode: isLight ? 'normal' : 'screen',
        transition: 'background 600ms',
      }} />

      {/* Blob 3 — Cyan/Mint */}
      <div style={{
        position: 'absolute',
        top: '40%', left: '25%',
        width: '60vw', height: '60vw',
        maxWidth: 540, maxHeight: 540,
        borderRadius: '50%',
        background: isLight
          ? 'radial-gradient(circle, rgba(46,215,198,0.10) 0%, rgba(46,215,198,0) 70%)'
          : 'radial-gradient(circle, rgba(103,214,197,0.12) 0%, rgba(103,214,197,0) 70%)',
        filter: 'blur(120px)',
        animation: 'blob-float-3 32s ease-in-out infinite',
        mixBlendMode: isLight ? 'normal' : 'screen',
        transition: 'background 600ms',
      }} />

      {/* Blob 4 — Pink (light mode accent, dark subtle) */}
      <div style={{
        position: 'absolute',
        top: '5%', right: '5%',
        width: '45vw', height: '45vw',
        maxWidth: 420, maxHeight: 420,
        borderRadius: '50%',
        background: isLight
          ? 'radial-gradient(circle, rgba(255,111,174,0.09) 0%, rgba(255,111,174,0) 70%)'
          : 'radial-gradient(circle, rgba(255,111,174,0.05) 0%, rgba(255,111,174,0) 70%)',
        filter: 'blur(90px)',
        animation: 'blob-float-1 52s ease-in-out infinite reverse',
        mixBlendMode: isLight ? 'normal' : 'screen',
        transition: 'background 600ms',
      }} />

      {/* Subtle noise overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: isLight ? 0.025 : 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '128px',
      }} />
    </div>
  )
}
