'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color: string
  subtitle?: string
}

export default function StatsCard({ label, value, icon: Icon, color, subtitle }: StatsCardProps) {
  return (
    <div className="glass rounded-2xl p-5 card-hover glow-hover">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2.5 rounded-xl', color)}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      )}
    </div>
  )
}
