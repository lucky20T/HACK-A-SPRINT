'use client'

import { useEffect, useRef } from 'react'
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

interface WeeklyChartProps {
  data: Array<{ date: string; score: number }>
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(23,23,23,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(228,240,90,0.3)',
          borderRadius: 12,
          padding: '8px 14px',
          boxShadow: '0 0 20px rgba(228,240,90,0.2)',
        }}
      >
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 20, fontWeight: 800, color: '#E4F05A' }}>{payload[0].value}</p>
        <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>wellness score</p>
      </div>
    )
  }
  return null
}

const CustomDot = (props: { cx?: number; cy?: number; value?: number }) => {
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

export default function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = data.map((d) => ({
    day: getDayLabel(d.date),
    score: d.score,
    date: d.date,
  }))

  // If we have fewer than 7 days, pad the beginning
  const allDays = ['M','T','W','T','F','S','S']

  return (
    <div style={{ width: '100%', height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF9A1F" />
              <stop offset="50%" stopColor="#E4F05A" />
              <stop offset="100%" stopColor="#7ED957" />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            ticks={[0, 25, 50, 75, 100]}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />

          <ReferenceLine
            y={70}
            stroke="rgba(126,217,87,0.2)"
            strokeDasharray="4 4"
            label={{ value: 'goal', position: 'right', fontSize: 9, fill: 'rgba(126,217,87,0.5)' }}
          />

          <Line
            type="monotoneX"
            dataKey="score"
            stroke="url(#chartGradient)"
            strokeWidth={2.5}
            dot={<CustomDot />}
            activeDot={{ r: 7, fill: '#E4F05A', stroke: '#0B0B0B', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
