'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Flame, Zap, BookOpen, Target, TrendingUp,
  GraduationCap, Brain, ArrowRight, Trophy, Volume2,
  Lightbulb, Cloud, CloudOff,
} from 'lucide-react'
import StatsCard from '@/components/StatsCard'
import ProgressRing from '@/components/ProgressRing'
import { getStats, getWordsToReview, getLearnedWordIds, getDailyActivities, isCloudSyncEnabled } from '@/lib/storage'
import { getXpProgress, getLevelFromXp } from '@/lib/utils'
import { allVocabulary } from '@/data'
import { UserStats, DailyActivity, VocabularyItem } from '@/types'

const LEARNING_TIPS = [
  'Ucz się codziennie po 10-15 min. Regularność > długie sesje raz na tydzień.',
  'Mów na głos! Wymowa utrwala słowa 2x szybciej niż czytanie w głowie.',
  'Słuchaj podcastów w trasie - BBC 6 Minute English, Coffee Break Spanish.',
  'Pisanie od ręki jest skuteczniejsze niż klikanie - używaj trybu Nauka!',
  'Nie bój się błędów. Każdy błąd = okazja do nauki. Błędy pamiętamy najlepiej.',
  'Naucz się 5 słów dziennie = 1825 słów rocznie. To wystarczy na płynną rozmowę!',
  'Oglądaj filmy z napisami EN/ES. Zacznij od znanych filmów.',
  'Powtórki są najważniejsze! Nowe słowo bez powtórki = zapomniane w 48h.',
  'Ucz się słów w kontekście (zdaniach), nie pojedynczo - łatwiej zapamiętasz.',
  'Ustaw sobie stały czas nauki - np. 8 rano kawa + LinguaApp = nawyk.',
]

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [toReview, setToReview] = useState(0)
  const [learned, setLearned] = useState(0)
  const [activities, setActivities] = useState<DailyActivity[]>([])
  const [wordOfDay, setWordOfDay] = useState<VocabularyItem | null>(null)
  const [tip, setTip] = useState('')
  const [cloudSync, setCloudSync] = useState(false)

  useEffect(() => {
    setStats(getStats())
    setToReview(getWordsToReview().length)
    setLearned(getLearnedWordIds().length)
    setActivities(getDailyActivities().slice(-7))
    setCloudSync(isCloudSyncEnabled())

    // Word of the day - deterministic based on date
    const dayIndex = Math.floor(Date.now() / 86400000) % allVocabulary.length
    setWordOfDay(allVocabulary[dayIndex])

    // Tip of the day
    const tipIndex = Math.floor(Date.now() / 86400000) % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[tipIndex])
  }, [])

  if (!stats) return null

  const level = getLevelFromXp(stats.totalXp)
  const xpProgress = getXpProgress(stats.totalXp)
  const totalWords = allVocabulary.length

  const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang === 'en' ? 'en-US' : 'es-ES'
      u.rate = 0.85
      speechSynthesis.speak(u)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Panel główny</h1>
            <p className="text-slate-400">Witaj z powrotem! Kontynuuj naukę.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            {cloudSync ? (
              <><Cloud size={14} className="text-emerald-400" /> Cloud</>
            ) : (
              <><CloudOff size={14} /> Lokalnie</>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <StatsCard label="Seria dni" value={stats.currentStreak} icon={Flame} color="bg-orange-500/20"
          subtitle={stats.longestStreak > 0 ? `Rekord: ${stats.longestStreak}` : undefined} />
        <StatsCard label="XP" value={stats.totalXp} icon={Zap} color="bg-yellow-500/20"
          subtitle={`Poziom ${level}`} />
        <StatsCard label="Nauczone" value={learned} icon={BookOpen} color="bg-emerald-500/20"
          subtitle={`z ${totalWords}`} />
        <StatsCard label="Do powtórki" value={toReview} icon={Target} color="bg-cyan-500/20"
          subtitle={toReview > 0 ? 'Czas na powtórkę!' : 'Na bieżąco!'} />
      </motion.div>

      {/* Word of the day + Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Word of the day */}
        {wordOfDay && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-5 border-l-4 border-brand-500"
          >
            <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider mb-2">Słowo dnia</p>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{wordOfDay.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{wordOfDay.word}</h3>
                  <button onClick={() => speak(wordOfDay.word, wordOfDay.language)}
                    className="p-1 rounded-lg hover:bg-white/10 text-brand-300">
                    <Volume2 size={16} />
                  </button>
                </div>
                <p className="text-brand-300">{wordOfDay.translation}</p>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-sm text-cyan-300 italic">&ldquo;{wordOfDay.exampleSentence}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">{wordOfDay.exampleTranslation}</p>
            </div>
          </motion.div>
        )}

        {/* Daily tip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5 border-l-4 border-amber-500"
        >
          <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Lightbulb size={12} /> Tip dnia
          </p>
          <p className="text-slate-300 leading-relaxed">{tip}</p>
        </motion.div>
      </div>

      {/* Quick actions - 2 main + 2 secondary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Level ring */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6 flex flex-col items-center justify-center"
        >
          <ProgressRing percentage={xpProgress.percentage} size={120} strokeWidth={8}>
            <div className="text-center">
              <Trophy size={20} className="text-yellow-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{level}</p>
            </div>
          </ProgressRing>
          <p className="text-xs text-slate-400 mt-3">
            {xpProgress.current}/{xpProgress.needed} XP do poz. {level + 1}
          </p>
        </motion.div>

        {/* Main CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 grid grid-cols-2 gap-3"
        >
          <Link href="/learn" className="group">
            <div className="glass rounded-2xl p-5 card-hover glow-hover h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center">
                  <GraduationCap size={22} className="text-white" />
                </div>
                <ArrowRight size={18} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-white mb-0.5">Nauka</h3>
              <p className="text-xs text-slate-400">5-etapowa sesja</p>
            </div>
          </Link>

          <Link href="/challenge" className="group">
            <div className="glass rounded-2xl p-5 card-hover glow-hover h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Flame size={22} className="text-white" />
                </div>
                <ArrowRight size={18} className="text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-white mb-0.5">Wyzwanie dnia</h3>
              <p className="text-xs text-slate-400">10 ćwiczeń + bonus</p>
            </div>
          </Link>

          <Link href="/flashcards" className="group">
            <div className="glass rounded-2xl p-5 card-hover glow-hover h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                  <BookOpen size={22} className="text-white" />
                </div>
                <ArrowRight size={18} className="text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-white mb-0.5">Fiszki</h3>
              <p className="text-xs text-slate-400">
                {toReview > 0 ? `${toReview} do powtórki` : 'Nowe słowa'}
              </p>
            </div>
          </Link>

          <Link href="/quiz" className="group">
            <div className="glass rounded-2xl p-5 card-hover glow-hover h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Brain size={22} className="text-white" />
                </div>
                <ArrowRight size={18} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-white mb-0.5">Quiz</h3>
              <p className="text-xs text-slate-400">Sprawdź wiedzę</p>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-5"
      >
        <h2 className="text-sm font-bold text-white mb-3">Aktywność (7 dni)</h2>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0]
            const activity = activities.find(a => a.date === date)
            const xp = activity?.xpEarned || 0
            const intensity = xp === 0 ? 0 : xp < 20 ? 1 : xp < 50 ? 2 : 3
            const colors = ['bg-slate-800', 'bg-brand-500/30', 'bg-brand-500/50', 'bg-brand-500']
            const dayNames = ['Nd', 'Pn', 'Wt', 'Sr', 'Cz', 'Pt', 'So']
            return (
              <div key={date} className="text-center">
                <p className="text-xs text-slate-500 mb-1">{dayNames[new Date(date).getDay()]}</p>
                <div className={`w-full aspect-square rounded-lg ${colors[intensity]} flex items-center justify-center`}>
                  {xp > 0 && <span className="text-xs font-bold text-white">{xp}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
