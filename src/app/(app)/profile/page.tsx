'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Trophy, Flame, Zap, BookOpen, Target, Share2, Copy, Check, RotateCcw } from 'lucide-react'
import ProgressRing from '@/components/ProgressRing'
import { getStats, getLearnedWordIds, getDailyActivities, getAllProgress } from '@/lib/storage'
import { getXpProgress, getLevelFromXp } from '@/lib/utils'
import { allVocabulary } from '@/data'
import { UserStats } from '@/types'

export default function ProfilePage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [name, setName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [copied, setCopied] = useState(false)
  const [learned, setLearned] = useState(0)
  const [activities, setActivities] = useState<{ date: string; xpEarned: number }[]>([])

  useEffect(() => {
    setStats(getStats())
    setLearned(getLearnedWordIds().length)
    setActivities(getDailyActivities().slice(-30))

    const saved = localStorage.getItem('lingua_username')
    if (saved) setName(saved)
  }, [])

  const saveName = () => {
    localStorage.setItem('lingua_username', name)
    setEditingName(false)
  }

  const shareProfile = () => {
    const s = getStats()
    const text = `Ucze sie jezykow w LinguaApp!\n` +
      `Poziom: ${getLevelFromXp(s.totalXp)}\n` +
      `XP: ${s.totalXp}\n` +
      `Seria: ${s.currentStreak} dni\n` +
      `Slowa: ${getLearnedWordIds().length}/${allVocabulary.length}\n` +
      `Dolacz: ${window.location.origin}`

    if (navigator.share) {
      navigator.share({ title: 'LinguaApp - moj profil', text })
    } else {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!stats) return null

  const level = getLevelFromXp(stats.totalXp)
  const xpProgress = getXpProgress(stats.totalXp)
  const totalWords = allVocabulary.length
  const enLearned = getLearnedWordIds().filter(id => id.startsWith('en-')).length
  const esLearned = getLearnedWordIds().filter(id => id.startsWith('es-')).length
  const enTotal = allVocabulary.filter(v => v.language === 'en').length
  const esTotal = allVocabulary.filter(v => v.language === 'es').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <User className="text-brand-400" />
          Profil
        </h1>
        <button
          onClick={shareProfile}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-slate-300 hover:text-white transition-colors"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
          {copied ? 'Skopiowano!' : 'Udostepnij'}
        </button>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 glow"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar + Level */}
          <div className="relative">
            <ProgressRing percentage={xpProgress.percentage} size={140} strokeWidth={10}>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white">
                {name ? name[0].toUpperCase() : '?'}
              </div>
            </ProgressRing>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-yellow-500 text-xs font-bold text-black">
              Poz. {level}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            {editingName ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Twoje imie..."
                  className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-brand-500/50"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                />
                <button onClick={saveName} className="px-3 py-2 rounded-lg bg-brand-500 text-white text-sm">
                  Zapisz
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="text-2xl font-bold text-white hover:text-brand-300 transition-colors"
              >
                {name || 'Kliknij, aby dodac imie'}
              </button>
            )}
            <p className="text-slate-400 text-sm mt-1">
              {xpProgress.current}/{xpProgress.needed} XP do poziomu {level + 1}
            </p>
            <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
              <span className="flex items-center gap-1 text-sm text-orange-400">
                <Flame size={14} /> {stats.currentStreak} dni serii
              </span>
              <span className="flex items-center gap-1 text-sm text-yellow-400">
                <Zap size={14} /> {stats.totalXp} XP
              </span>
              <span className="flex items-center gap-1 text-sm text-emerald-400">
                <BookOpen size={14} /> {learned} slow
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Language progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🇬🇧</span>
            <div>
              <h3 className="font-bold text-white">Angielski B2</h3>
              <p className="text-xs text-slate-400">{enLearned} / {enTotal} slow</p>
            </div>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${enTotal > 0 ? (enLearned / enTotal) * 100 : 0}%` }}
            />
          </div>
          <p className="text-right text-xs text-slate-500 mt-1">
            {enTotal > 0 ? Math.round((enLearned / enTotal) * 100) : 0}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🇪🇸</span>
            <div>
              <h3 className="font-bold text-white">Hiszpanski A1</h3>
              <p className="text-xs text-slate-400">{esLearned} / {esTotal} slow</p>
            </div>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${esTotal > 0 ? (esLearned / esTotal) * 100 : 0}%` }}
            />
          </div>
          <p className="text-right text-xs text-slate-500 mt-1">
            {esTotal > 0 ? Math.round((esLearned / esTotal) * 100) : 0}%
          </p>
        </motion.div>
      </div>

      {/* Stats detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="font-bold text-white mb-4">Statystyki</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.totalXp}</p>
            <p className="text-xs text-slate-400">Calkowite XP</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.longestStreak}</p>
            <p className="text-xs text-slate-400">Rekord serii</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{learned}</p>
            <p className="text-xs text-slate-400">Nauczone slowa</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{activities.length}</p>
            <p className="text-xs text-slate-400">Aktywne dni</p>
          </div>
        </div>
      </motion.div>

      {/* Activity heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="font-bold text-white mb-3">Aktywnosc (30 dni)</h3>
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 30 }).map((_, i) => {
            const date = new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0]
            const activity = activities.find(a => a.date === date)
            const xp = activity?.xpEarned || 0
            const intensity = xp === 0 ? 0 : xp < 20 ? 1 : xp < 50 ? 2 : 3
            const colors = ['bg-slate-800', 'bg-brand-500/30', 'bg-brand-500/50', 'bg-brand-500']
            return (
              <div
                key={date}
                className={`aspect-square rounded-sm ${colors[intensity]}`}
                title={`${date}: ${xp} XP`}
              />
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-2 justify-end text-xs text-slate-500">
          <span>Mniej</span>
          {['bg-slate-800', 'bg-brand-500/30', 'bg-brand-500/50', 'bg-brand-500'].map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span>Wiecej</span>
        </div>
      </motion.div>
    </div>
  )
}
