'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Flame,
  Zap,
  BookOpen,
  Target,
  TrendingUp,
  Layers,
  Brain,
  ArrowRight,
  Trophy,
} from 'lucide-react'
import StatsCard from '@/components/StatsCard'
import ProgressRing from '@/components/ProgressRing'
import { getStats, getWordsToReview, getLearnedWordIds, getDailyActivities } from '@/lib/storage'
import { getXpProgress, getLevelFromXp } from '@/lib/utils'
import { allVocabulary } from '@/data'
import { UserStats, DailyActivity } from '@/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [toReview, setToReview] = useState(0)
  const [learned, setLearned] = useState(0)
  const [activities, setActivities] = useState<DailyActivity[]>([])

  useEffect(() => {
    setStats(getStats())
    setToReview(getWordsToReview().length)
    setLearned(getLearnedWordIds().length)
    setActivities(getDailyActivities().slice(-7))
  }, [])

  if (!stats) return null

  const level = getLevelFromXp(stats.totalXp)
  const xpProgress = getXpProgress(stats.totalXp)
  const totalWords = allVocabulary.length
  const progressPercent = totalWords > 0 ? Math.round((learned / totalWords) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">Panel glowny</h1>
        <p className="text-slate-400">Witaj z powrotem! Kontynuuj nauke.</p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          label="Seria dni"
          value={stats.currentStreak}
          icon={Flame}
          color="bg-orange-500/20"
          subtitle={stats.longestStreak > 0 ? `Rekord: ${stats.longestStreak}` : undefined}
        />
        <StatsCard
          label="Doswiadczenie"
          value={`${stats.totalXp} XP`}
          icon={Zap}
          color="bg-yellow-500/20"
          subtitle={`Poziom ${level}`}
        />
        <StatsCard
          label="Nauczone slowa"
          value={learned}
          icon={BookOpen}
          color="bg-emerald-500/20"
          subtitle={`z ${totalWords} dostepnych`}
        />
        <StatsCard
          label="Do powtorki"
          value={toReview}
          icon={Target}
          color="bg-cyan-500/20"
          subtitle={toReview > 0 ? 'Czas na powtorke!' : 'Swietnie!'}
        />
      </motion.div>

      {/* Progress + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 flex flex-col items-center justify-center"
        >
          <ProgressRing percentage={xpProgress.percentage} size={140} strokeWidth={10}>
            <div className="text-center">
              <Trophy size={24} className="text-yellow-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{level}</p>
              <p className="text-xs text-slate-400">poziom</p>
            </div>
          </ProgressRing>
          <p className="text-sm text-slate-400 mt-4">
            {xpProgress.current} / {xpProgress.needed} XP do poziomu {level + 1}
          </p>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-4"
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-brand-400" />
            Szybkie akcje
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Flashcards */}
            <Link href="/flashcards" className="group">
              <div className="glass rounded-2xl p-6 card-hover glow-hover h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                    <Layers size={24} className="text-white" />
                  </div>
                  <ArrowRight size={20} className="text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Fiszki</h3>
                <p className="text-sm text-slate-400">
                  {toReview > 0
                    ? `${toReview} slow czeka na powtorke`
                    : 'Naucz sie nowych slow'}
                </p>
              </div>
            </Link>

            {/* Quiz */}
            <Link href="/quiz" className="group">
              <div className="glass rounded-2xl p-6 card-hover glow-hover h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Brain size={24} className="text-white" />
                  </div>
                  <ArrowRight size={20} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Quiz</h3>
                <p className="text-sm text-slate-400">
                  Sprawdz swoja wiedze w quizie
                </p>
              </div>
            </Link>

            {/* English */}
            <Link href="/vocabulary?lang=en" className="group">
              <div className="glass rounded-2xl p-6 card-hover glow-hover h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">🇬🇧</span>
                  <ArrowRight size={20} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Angielski B2</h3>
                <p className="text-sm text-slate-400">
                  Idiomy, phrasal verbs, biznes
                </p>
              </div>
            </Link>

            {/* Spanish */}
            <Link href="/vocabulary?lang=es" className="group">
              <div className="glass rounded-2xl p-6 card-hover glow-hover h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">🇪🇸</span>
                  <ArrowRight size={20} className="text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Hiszpanski A1</h3>
                <p className="text-sm text-slate-400">
                  Podstawy od zera
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Activity heatmap (simple version) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-lg font-bold text-white mb-4">Aktywnosc (ostatnie 7 dni)</h2>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0]
            const activity = activities.find(a => a.date === date)
            const xp = activity?.xpEarned || 0
            const intensity = xp === 0 ? 0 : xp < 20 ? 1 : xp < 50 ? 2 : 3

            const colors = [
              'bg-slate-800',
              'bg-brand-500/30',
              'bg-brand-500/50',
              'bg-brand-500',
            ]

            const dayNames = ['Nd', 'Pn', 'Wt', 'Sr', 'Cz', 'Pt', 'So']
            const dayName = dayNames[new Date(date).getDay()]

            return (
              <div key={date} className="text-center">
                <p className="text-xs text-slate-500 mb-1">{dayName}</p>
                <div
                  className={`w-full aspect-square rounded-lg ${colors[intensity]} flex items-center justify-center`}
                  title={`${date}: ${xp} XP`}
                >
                  {xp > 0 && (
                    <span className="text-xs font-bold text-white">{xp}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
