'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Layers,
  Brain,
  BookOpen,
  Menu,
  X,
  Flame,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStats } from '@/lib/storage'

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/flashcards', label: 'Fiszki', icon: Layers },
  { href: '/quiz', label: 'Quiz', icon: Brain },
  { href: '/vocabulary', label: 'Slownictwo', icon: BookOpen },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const stats = typeof window !== 'undefined' ? getStats() : null

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl glass lg:hidden"
        aria-label="Menu"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full w-64 glass border-r border-white/5 flex flex-col transition-transform duration-300',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
              L
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">LinguaApp</h1>
              <p className="text-xs text-slate-500">Ucz sie jezykow</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Stats footer */}
        {stats && (
          <div className="p-4 border-t border-white/5">
            <div className="glass rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Flame size={16} className="text-orange-400" />
                  <span className="text-slate-300">Seria</span>
                </div>
                <span className="text-lg font-bold text-orange-400">
                  {stats.currentStreak}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Zap size={16} className="text-yellow-400" />
                  <span className="text-slate-300">XP</span>
                </div>
                <span className="text-lg font-bold text-yellow-400">
                  {stats.totalXp}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
