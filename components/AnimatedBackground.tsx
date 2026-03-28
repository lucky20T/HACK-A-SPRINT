'use client'

export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Base dark layer */}
      <div style={{ position: 'absolute', inset: 0, background: '#0B0B0B' }} />

      {/* Blob 1 — Lime */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          maxWidth: 500,
          maxHeight: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(228,240,90,0.18) 0%, rgba(228,240,90,0) 70%)',
          filter: 'blur(80px)',
          animation: 'blob-float-1 38s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {/* Blob 2 — Orange */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-15%',
          width: '60vw',
          height: '60vw',
          maxWidth: 520,
          maxHeight: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,154,31,0.14) 0%, rgba(255,154,31,0) 70%)',
          filter: 'blur(100px)',
          animation: 'blob-float-2 44s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {/* Blob 3 — Mint */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          width: '50vw',
          height: '50vw',
          maxWidth: 440,
          maxHeight: 440,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(103,214,197,0.12) 0%, rgba(103,214,197,0) 70%)',
          filter: 'blur(120px)',
          animation: 'blob-float-3 32s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {/* Subtle noise overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />
    </div>
  )
}
