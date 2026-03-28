'use client'

import { useEffect, useState } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>('mobile')

  useEffect(() => {
    const compute = (w: number): Breakpoint => {
      if (w >= 1024) return 'desktop'
      if (w >= 640)  return 'tablet'
      return 'mobile'
    }

    const handler = () => setBp(compute(window.innerWidth))
    handler() // run once on mount

    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return bp
}
