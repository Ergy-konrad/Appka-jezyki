'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, ArrowRight, RotateCcw } from 'lucide-react'
import { VocabularyItem, SrsRating } from '@/types'
import { getRatingLabel, getRatingColor } from '@/lib/srs'
import { cn } from '@/lib/utils'

interface FlashCardProps {
  item: VocabularyItem
  onRate: (rating: SrsRating) => void
  current: number
  total: number
}

const ratings: SrsRating[] = ['again', 'hard', 'good', 'easy']

export default function FlashCard({ item, onRate, current, total }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true)
  }

  const handleRate = useCallback((rating: SrsRating) => {
    setIsExiting(true)
    setTimeout(() => {
      setIsFlipped(false)
      setIsExiting(false)
      onRate(rating)
    }, 300)
  }, [onRate])

  const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'en' ? 'en-US' : 'es-ES'
      utterance.rate = 0.85
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">{current} / {total}</span>
          <span className="text-sm text-slate-400">
            {Math.round((current / total) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(current / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: isExiting ? 0 : 1, x: isExiting ? -50 : 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="flip-card cursor-pointer"
            style={{ height: '320px' }}
            onClick={handleFlip}
          >
            <div className={cn('flip-card-inner', isFlipped && 'flipped')}>
              {/* Front */}
              <div className="flip-card-front glass rounded-2xl p-8 flex flex-col items-center justify-center glow">
                <span className="text-5xl mb-4">{item.emoji}</span>
                <h2 className="text-3xl font-bold text-white mb-2">{item.word}</h2>
                {item.phonetic && (
                  <p className="text-slate-400 text-sm mb-4">{item.phonetic}</p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    speak(item.word, item.language)
                  }}
                  className="p-3 rounded-full bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors"
                >
                  <Volume2 size={20} />
                </button>
                <p className="text-slate-500 text-sm mt-4 flex items-center gap-1">
                  Kliknij, aby odkryc <ArrowRight size={14} />
                </p>
              </div>

              {/* Back */}
              <div className="flip-card-back glass rounded-2xl p-8 flex flex-col items-center justify-center glow">
                <span className="text-4xl mb-3">{item.emoji}</span>
                <p className="text-sm text-slate-400 mb-1">{item.word}</p>
                <h2 className="text-3xl font-bold text-white mb-4">{item.translation}</h2>
                <div className="w-full bg-slate-800/50 rounded-xl p-4 mb-2">
                  <p className="text-sm text-cyan-300 italic mb-1">
                    &ldquo;{item.exampleSentence}&rdquo;
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.exampleTranslation}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    speak(item.exampleSentence, item.language)
                  }}
                  className="p-2 rounded-full bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors mt-1"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Rating buttons */}
          <AnimatePresence>
            {isFlipped && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex gap-3 mt-6 justify-center"
              >
                {ratings.map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRate(rating)}
                    className={cn(
                      'px-5 py-3 rounded-xl font-medium text-white text-sm transition-all duration-200 hover:scale-105 active:scale-95',
                      getRatingColor(rating)
                    )}
                  >
                    {getRatingLabel(rating)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flip back hint */}
          {isFlipped && (
            <div className="flex justify-center mt-3">
              <button
                onClick={() => setIsFlipped(false)}
                className="text-xs text-slate-500 flex items-center gap-1 hover:text-slate-300 transition-colors"
              >
                <RotateCcw size={12} /> Obroc z powrotem
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
