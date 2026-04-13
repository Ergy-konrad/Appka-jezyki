'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  GraduationCap,
  Flame,
  Layers,
  Brain,
  BookOpen,
  BookMarked,
  FileText,
  MessageCircle,
  Bot,
  Library,
  User,
  Menu,
  X,
  Zap,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStats } from '@/lib/storage'
import { createClient } from '@/lib/supabase/client'

const navSections = [
  {
    title: 'Nauka',
    items: [
      { href: '/dashboard', label: 'Panel glowny', icon: LayoutDashboard, desc: 'Statystyki i skroty' },
      { href: '/learn', label: 'Nauka', icon: GraduationCap, desc: '5-etapowa sesja nauki' },
      { href: '/challenge', label: 'Wyzwanie dnia', icon: Flame, desc: '10 cwiczen dziennie' },
    ],
  },
  {
    title: 'Cwiczenia',
    items: [
      { href: '/flashcards', label: 'Fiszki', icon: Layers, desc: 'Powtorki z algorytmem SRS' },
      { href: '/quiz', label: 'Quiz', icon: Brain, desc: 'Sprawdz swoja wiedze' },
      { href: '/reading', label: 'Czytanki', icon: FileText, desc: 'Artykuly z tlumaczeniem' },
      { href: '/phrases', label: 'Zdania', icon: MessageCircle, desc: 'Gotowe zwroty na kazda sytuacje' },
    ],
  },
  {
    title: 'Narzedzia',
    items: [
      { href: '/vocabulary', label: 'Slownictwo', icon: BookOpen, desc: 'Przegladaj wszystkie slowa' },
      { href: '/dictionary', label: 'Slownik', icon: BookMarked, desc: 'Darmowy slownik online' },
      { href: '/tutor', label: 'AI Tutor', icon: Bot, desc: 'Czat z nauczycielem AI' },
      { href: '/resources', label: 'Zasoby', icon: Library, desc: 'Podreczniki i podcasty' },
    ],
  },
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
          'fixed top-0 left-0 z-40 h-full w-64 glass border-r border-white/5 flex flex-col transition-transform duration-300 overflow-y-auto',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/5 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white">
              L
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">LinguaApp</h1>
              <p className="text-xs text-slate-500">Ucz sie jezykow</p>
            </div>
          </Link>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 p-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 py-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {section.title}
              </p>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group',
                        isActive
                          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      )}
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium leading-tight">{item.label}</p>
                        <p className="text-xs text-slate-600 group-hover:text-slate-500 leading-tight truncate">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Profile + stats footer */}
        <div className="p-3 border-t border-white/5 flex-shrink-0 space-y-2">
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
              pathname === '/profile'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            )}
          >
            <User size={18} />
            <span className="font-medium">Profil</span>
          </Link>
          {stats && (
            <div className="flex items-center justify-around px-2 py-2 glass rounded-xl">
              <div className="flex items-center gap-1.5 text-sm">
                <Flame size={14} className="text-orange-400" />
                <span className="font-bold text-orange-400">{stats.currentStreak}</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5 text-sm">
                <Zap size={14} className="text-yellow-400" />
                <span className="font-bold text-yellow-400">{stats.totalXp}</span>
              </div>
            </div>
          )}
          <button
            onClick={async () => {
              const supabase = createClient()
              if (supabase) await supabase.auth.signOut()
              window.location.href = '/login'
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={16} />
            <span>Wyloguj</span>
          </button>
        </div>
      </aside>
    </>
  )
}
