'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Check, X, RotateCcw } from 'lucide-react'
import { checkAnswer, MatchResult } from '@/lib/matching'
import { cn } from '@/lib/utils'

interface ListeningExerciseProps {
  word: string
  correctAnswer: string // What user should type (the word they hear)
  language: string
  hint?: string // e.g. Polish translation
  onResult: (correct: boolean) => void
}

export default function ListeningExercise({
  word,
  correctAnswer,
  language,
  hint,
  onResult,
}: ListeningExerciseProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<MatchResult | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [played, setPlayed] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const speak = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = language === 'en' ? 'en-US' : 'es-ES'
      utterance.rate = played === 0 ? 0.8 : 0.6 // Slower on repeat
      speechSynthesis.speak(utterance)
      setPlayed(prev => prev + 1)
    }
  }, [word, language, played])

  useEffect(() => {
    // Auto-play on mount
    const timer = setTimeout(speak, 300)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || result === 'exact' || result === 'close') return

    const match = checkAnswer(input, correctAnswer)
    setResult(match)
    setAttempts(prev => prev + 1)

    if (match === 'exact' || match === 'close') {
      setTimeout(() => onResult(true), 1200)
    } else {
      setTimeout(() => {
        if (attempts + 1 >= 3) {
          setShowAnswer(true)
          setTimeout(() => onResult(false), 2000)
        } else {
          setResult(null)
          setInput('')
          inputRef.current?.focus()
        }
      }, 800)
    }
  }

  const isCorrect = result === 'exact' || result === 'close'

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Audio player */}
      <div className="glass rounded-2xl p-8 glow mb-6 text-center">
        <p className="text-sm text-slate-400 mb-4">Posłuchaj i wpisz co słyszysz:</p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={speak}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <Volume2 size={36} className="text-white" />
          </button>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) {
                speechSynthesis.cancel()
                const utterance = new SpeechSynthesisUtterance(word)
                utterance.lang = language === 'en' ? 'en-US' : 'es-ES'
                utterance.rate = 0.5
                speechSynthesis.speak(utterance)
              }
            }}
            className="w-14 h-14 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
            title="Odtwórz wolniej"
          >
            <RotateCcw size={20} className="text-slate-400" />
            <span className="text-xs text-slate-500 ml-1">x0.5</span>
          </button>
        </div>

        {hint && (
          <p className="text-xs text-slate-600 mt-4">
            Podpowiedź: {hint}
          </p>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Wpisz co słyszysz..."
            autoComplete="off"
            autoCapitalize="off"
            className={cn(
              'w-full px-6 py-4 rounded-xl text-lg text-center font-medium transition-all duration-300 focus:outline-none',
              isCorrect && 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300',
              result === 'wrong' && 'bg-red-500/20 border-2 border-red-500 text-red-300 animate-wrong',
              !result && 'glass border-2 border-transparent text-white focus:border-brand-500/50'
            )}
          />
          {result && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {isCorrect ? (
                <Check size={24} className="text-emerald-400" />
              ) : (
                <X size={24} className="text-red-400" />
              )}
            </motion.div>
          )}
        </div>

        {result === 'close' && (
          <p className="text-center text-sm text-emerald-400 mt-2">
            Prawie! Poprawnie: <strong>{correctAnswer}</strong>
          </p>
        )}

        {result === 'wrong' && !showAnswer && (
          <p className="text-center text-sm text-red-400 mt-2">
            Nie do końca. Posłuchaj jeszcze raz i spróbuj! ({3 - attempts} proby)
          </p>
        )}

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center glass rounded-xl p-4 mt-4"
          >
            <p className="text-sm text-slate-400">Poprawna odpowiedz:</p>
            <p className="text-xl font-bold text-white">{correctAnswer}</p>
          </motion.div>
        )}

        {!isCorrect && !showAnswer && (
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full mt-4 py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors disabled:opacity-30"
          >
            Sprawdz
          </button>
        )}
      </form>
    </div>
  )
}
