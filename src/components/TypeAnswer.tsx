'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Lightbulb, Volume2 } from 'lucide-react'
import { checkAnswer, getHint, MatchResult } from '@/lib/matching'
import { cn } from '@/lib/utils'

interface TypeAnswerProps {
  prompt: string
  promptSubtitle?: string
  correctAnswer: string
  emoji?: string
  language?: string
  onResult: (correct: boolean) => void
  placeholder?: string
  showHintAfter?: number // show hint after N wrong attempts
}

export default function TypeAnswer({
  prompt,
  promptSubtitle,
  correctAnswer,
  emoji,
  language,
  onResult,
  placeholder = 'Wpisz odpowiedź...',
  showHintAfter = 2,
}: TypeAnswerProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<MatchResult | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || result) return

    const match = checkAnswer(input, correctAnswer)
    setResult(match)
    setAttempts(prev => prev + 1)

    if (match === 'exact' || match === 'close') {
      setTimeout(() => onResult(true), 1200)
    } else {
      // Wrong - allow retry after short delay
      setTimeout(() => {
        if (attempts + 1 >= 3) {
          setShowAnswer(true)
          setTimeout(() => onResult(false), 2000)
        } else {
          setResult(null)
          setInput('')
          inputRef.current?.focus()
        }
      }, 1000)
    }
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'es' ? 'es-ES' : language === 'en' ? 'en-US' : 'pl-PL'
      utterance.rate = 0.85
      speechSynthesis.speak(utterance)
    }
  }

  const hintText = attempts >= showHintAfter
    ? getHint(correctAnswer.split('/')[0].trim(), Math.min(attempts - showHintAfter + 1, correctAnswer.length))
    : null

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Prompt */}
      <div className="glass rounded-2xl p-8 glow mb-6 text-center">
        {emoji && <span className="text-5xl block mb-3">{emoji}</span>}
        <h2 className="text-2xl font-bold text-white mb-1">{prompt}</h2>
        {promptSubtitle && (
          <p className="text-sm text-slate-400">{promptSubtitle}</p>
        )}
        {language && (
          <button
            onClick={() => speak(prompt)}
            className="mx-auto mt-3 p-2 rounded-full bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors"
          >
            <Volume2 size={18} />
          </button>
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
            placeholder={placeholder}
            disabled={showAnswer}
            autoComplete="off"
            autoCapitalize="off"
            className={cn(
              'w-full px-6 py-4 rounded-xl text-lg text-center font-medium transition-all duration-300 focus:outline-none',
              result === 'exact' && 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300',
              result === 'close' && 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300',
              result === 'wrong' && 'bg-red-500/20 border-2 border-red-500 text-red-300 animate-wrong',
              !result && 'glass border-2 border-transparent text-white focus:border-brand-500/50'
            )}
          />

          {/* Result icon */}
          {result && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {(result === 'exact' || result === 'close') ? (
                <Check size={24} className="text-emerald-400" />
              ) : (
                <X size={24} className="text-red-400" />
              )}
            </motion.div>
          )}
        </div>

        {/* Feedback */}
        {result === 'close' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-emerald-400 mt-2"
          >
            Prawie idealnie! Poprawna pisownia: <strong>{correctAnswer.split('/')[0].trim()}</strong>
          </motion.p>
        )}

        {result === 'wrong' && !showAnswer && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-red-400 mt-2"
          >
            Spróbuj jeszcze raz! ({3 - attempts} {3 - attempts === 1 ? 'próba' : 'próby'})
          </motion.p>
        )}

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-4 glass rounded-xl p-4"
          >
            <p className="text-sm text-slate-400 mb-1">Poprawna odpowiedź:</p>
            <p className="text-xl font-bold text-white">{correctAnswer}</p>
          </motion.div>
        )}

        {/* Hint */}
        {hintText && !result && !showAnswer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 mt-3 text-sm text-amber-400"
          >
            <Lightbulb size={14} />
            Podpowiedź: <span className="font-mono tracking-widest">{hintText}</span>
          </motion.div>
        )}

        {/* Submit button */}
        {!result && !showAnswer && (
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full mt-4 py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors disabled:opacity-30"
          >
            Sprawdź
          </button>
        )}
      </form>
    </div>
  )
}
