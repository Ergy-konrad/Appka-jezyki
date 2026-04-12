'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Trophy, RotateCcw, ArrowRight } from 'lucide-react'
import FlashCard from '@/components/FlashCard'
import LanguageSelector from '@/components/LanguageSelector'
import { Language, VocabularyItem, SrsRating } from '@/types'
import { getVocabularyByLanguage, getVocabularyById } from '@/data'
import {
  getAllProgress,
  getWordsToReview,
  saveWordProgress,
  recordActivity,
} from '@/lib/storage'
import { calculateNextReview, getXpForRating, isDueForReview } from '@/lib/srs'
import { shuffleArray } from '@/lib/utils'

type SessionMode = 'select' | 'learning' | 'complete'

export default function FlashcardsPage() {
  const [language, setLanguage] = useState<Language>('es')
  const [mode, setMode] = useState<SessionMode>('select')
  const [cards, setCards] = useState<VocabularyItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionXp, setSessionXp] = useState(0)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [batchSize, setBatchSize] = useState(10)

  const startSession = useCallback((type: 'review' | 'new') => {
    const allProgress = getAllProgress()
    const vocab = getVocabularyByLanguage(language)
    let selectedCards: VocabularyItem[]

    if (type === 'review') {
      const dueIds = getWordsToReview()
      selectedCards = dueIds
        .map(id => getVocabularyById(id))
        .filter((v): v is VocabularyItem => v !== undefined && v.language === language)
        .slice(0, batchSize)
    } else {
      const learnedIds = new Set(Object.keys(allProgress))
      selectedCards = vocab
        .filter(v => !learnedIds.has(v.id))
        .slice(0, batchSize)
    }

    if (selectedCards.length === 0) {
      // Fallback: just get random words
      selectedCards = shuffleArray(vocab).slice(0, batchSize)
    }

    setCards(shuffleArray(selectedCards))
    setCurrentIndex(0)
    setSessionXp(0)
    setSessionCorrect(0)
    setMode('learning')
  }, [language, batchSize])

  const handleRate = useCallback((rating: SrsRating) => {
    const card = cards[currentIndex]
    const progress = getAllProgress()[card.id] || null
    const update = calculateNextReview(progress, rating)
    const xp = getXpForRating(rating)

    saveWordProgress(card.id, update)
    recordActivity(
      progress ? 0 : 1,
      1,
      xp
    )

    setSessionXp(prev => prev + xp)
    if (rating !== 'again') setSessionCorrect(prev => prev + 1)

    if (currentIndex + 1 >= cards.length) {
      setMode('complete')
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }, [cards, currentIndex])

  // Count due words for current language
  const [reviewCount, setReviewCount] = useState(0)
  const [newCount, setNewCount] = useState(0)

  useEffect(() => {
    const allProgress = getAllProgress()
    const vocab = getVocabularyByLanguage(language)
    const dueIds = getWordsToReview()
    const langDue = dueIds.filter(id => {
      const v = getVocabularyById(id)
      return v && v.language === language
    })
    const learnedIds = new Set(Object.keys(allProgress))
    const newWords = vocab.filter(v => !learnedIds.has(v.id))

    setReviewCount(langDue.length)
    setNewCount(newWords.length)
  }, [language, mode])

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Layers className="text-brand-400" />
            Fiszki
          </h1>
          <p className="text-slate-400 mt-1">Ucz sie slow z algorytmem powtórek</p>
        </div>
        {mode === 'select' && (
          <LanguageSelector selected={language} onChange={setLanguage} />
        )}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Batch size selector */}
            <div className="glass rounded-2xl p-6">
              <p className="text-sm text-slate-400 mb-3">Ile slow w sesji:</p>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map(size => (
                  <button
                    key={size}
                    onClick={() => setBatchSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      batchSize === size
                        ? 'bg-brand-500 text-white'
                        : 'glass text-slate-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Session type cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => startSession('review')}
                className="glass rounded-2xl p-8 text-left card-hover glow-hover group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4">
                  <RotateCcw size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Powtorka</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Powtorz slowa, ktore zaczynasz zapominac
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium">
                    {reviewCount} do powtorki
                  </span>
                  <ArrowRight size={16} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
                </div>
              </button>

              <button
                onClick={() => startSession('new')}
                className="glass rounded-2xl p-8 text-left card-hover glow-hover group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center mb-4">
                  <Layers size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nowe slowa</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Poznaj nowe slownictwo
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                    {newCount} nowych
                  </span>
                  <ArrowRight size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'learning' && cards[currentIndex] && (
          <motion.div
            key="learning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FlashCard
              item={cards[currentIndex]}
              onRate={handleRate}
              current={currentIndex + 1}
              total={cards.length}
            />
          </motion.div>
        )}

        {mode === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-10 text-center glow"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Trophy size={64} className="text-yellow-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Sesja zakonczona!</h2>
            <p className="text-slate-400 mb-8">Swietna robota! Oto Twoje wyniki:</p>

            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold text-yellow-400">{sessionXp}</p>
                <p className="text-xs text-slate-400">XP zdobyte</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold text-emerald-400">{sessionCorrect}</p>
                <p className="text-xs text-slate-400">poprawne</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold text-brand-400">{cards.length}</p>
                <p className="text-xs text-slate-400">przejrzane</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => startSession('new')}
                className="px-6 py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
              >
                Kolejna sesja
              </button>
              <button
                onClick={() => setMode('select')}
                className="px-6 py-3 rounded-xl glass text-slate-300 font-medium hover:bg-white/10 transition-colors"
              >
                Powrot
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
