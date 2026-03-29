'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { getDayLabel } from '@/lib/storage'
import { useTheme } from '@/lib/ThemeContext'

interface WeeklyChartProps {
  data: Array<{ date: string; score: number }>
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltipDark({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(228,240,90,0.3)',
        borderRadius: 12,
        padding: '8px 14px',
        boxShadow: '0 0 20px rgba(228,240,90,0.2)',
      }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 20, fontWeight: 800, color: '#E4F05A' }}>{payload[0].value}</p>
        <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>wellness score</p>
      </div>
    )
  }
  return null
}

function CustomTooltipLight({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(108,124,255,0.28)',
        borderRadius: 12,
        padding: '8px 14px',
        boxShadow: '0 4px 20px rgba(21,32,51,0.10), 0 0 16px rgba(108,124,255,0.12)',
      }}>
        <p style={{ fontSize: 11, color: '#8A97B2', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 20, fontWeight: 800, color: '#6C7CFF' }}>{payload[0].value}</p>
        <p style={{ fontSize: 10, color: '#8A97B2' }}>wellness score</p>
      </div>
    )
  }
  return null
}

function CustomDotDark(props: { cx?: number; cy?: number; value?: number }) {
  const { cx, cy, value = 0 } = props
  if (!cx || !cy) return null
  const color = value >= 75 ? '#7ED957' : value >= 50 ? '#E4F05A' : value >= 25 ? '#FF9A1F' : '#D95F5F'
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="#0B0B0B" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={9} fill={color} fillOpacity={0.15} />
    </g>
  )
}

function CustomDotLight(props: { cx?: number; cy?: number; value?: number }) {
  const { cx, cy, value = 0 } = props
  if (!cx || !cy) return null
  const color = value >= 75 ? '#58D68D' : value >= 50 ? '#6C7CFF' : value >= 25 ? '#FF9B4A' : '#FF6B6B'
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="#FFFFFF" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={9} fill={color} fillOpacity={0.18} />
    </g>
  )
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const chartData = data.map((d) => ({
    day: getDayLabel(d.date),
    score: d.score,
    date: d.date,
  }))

  return (
    <div style={{ width: '100%', height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {/* Dark theme gradient */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF9A1F" />
              <stop offset="50%" stopColor="#E4F05A" />
              <stop offset="100%" stopColor="#7ED957" />
            </linearGradient>
            {/* Light theme gradient */}
            <linearGradient id="chartGradientLight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF9B4A" />
              <stop offset="40%" stopColor="#6C7CFF" />
              <stop offset="100%" stopColor="#58D68D" />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isLight ? 'rgba(108,124,255,0.07)' : 'rgba(255,255,255,0.04)'}
            vertical={false}
          />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: isLight ? '#8A97B2' : 'var(--text-muted)', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: isLight ? '#8A97B2' : 'var(--text-muted)', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            ticks={[0, 25, 50, 75, 100]}
          />

          <Tooltip
            content={isLight ? <CustomTooltipLight /> : <CustomTooltipDark />}
            cursor={{ stroke: isLight ? 'rgba(108,124,255,0.15)' : 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
          />

          <ReferenceLine
            y={70}
            stroke={isLight ? 'rgba(88,214,141,0.35)' : 'rgba(126,217,87,0.2)'}
            strokeDasharray="4 4"
            label={{ value: 'goal', position: 'right', fontSize: 9, fill: isLight ? 'rgba(88,214,141,0.7)' : 'rgba(126,217,87,0.5)' }}
          />

          <Line
            type="monotoneX"
            dataKey="score"
            stroke={isLight ? 'url(#chartGradientLight)' : 'url(#chartGradient)'}
            strokeWidth={2.5}
            dot={isLight ? <CustomDotLight /> : <CustomDotDark />}
            activeDot={{ r: 7, fill: isLight ? '#6C7CFF' : '#E4F05A', stroke: isLight ? '#FFFFFF' : '#0B0B0B', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
