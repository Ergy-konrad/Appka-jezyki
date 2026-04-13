'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Volume2 } from 'lucide-react'
import { checkAnswer, MatchResult } from '@/lib/matching'
import { cn } from '@/lib/utils'

interface SentenceCompleteProps {
  sentence: string
  missingWord: string
  translation: string
  language: string
  onResult: (correct: boolean) => void
}

export default function SentenceComplete({
  sentence,
  missingWord,
  translation,
  language,
  onResult,
}: SentenceCompleteProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<MatchResult | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Build sentence with blank
  const lowerSentence = sentence.toLowerCase()
  const lowerWord = missingWord.toLowerCase().split(' ')[0]
  const idx = lowerSentence.indexOf(lowerWord)

  let beforeBlank = sentence
  let afterBlank = ''
  if (idx !== -1) {
    let end = idx + lowerWord.length
    while (end < sentence.length && /[a-záéíóúñü]/i.test(sentence[end])) end++
    beforeBlank = sentence.slice(0, idx)
    afterBlank = sentence.slice(end)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || result === 'exact' || result === 'close') return

    // Accept the missing word or any conjugated form that starts similarly
    const match = checkAnswer(input, missingWord)
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

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'en' ? 'en-US' : 'es-ES'
      utterance.rate = 0.85
      speechSynthesis.speak(utterance)
    }
  }

  const isCorrect = result === 'exact' || result === 'close'

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Instruction */}
      <div className="glass rounded-2xl p-6 glow mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-400">Uzupełnij brakujące słowo:</p>
          <button
            onClick={() => speak(sentence)}
            className="p-2 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors"
          >
            <Volume2 size={16} />
          </button>
        </div>

        {/* Sentence with blank */}
        <div className="text-xl text-white leading-relaxed flex flex-wrap items-center gap-1">
          <span>{beforeBlank}</span>
          <form onSubmit={handleSubmit} className="inline-flex">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              style={{ width: `${Math.max(missingWord.length * 14, 80)}px` }}
              className={cn(
                'px-3 py-1 rounded-lg text-center font-bold border-b-2 bg-transparent focus:outline-none transition-all',
                isCorrect && 'border-emerald-500 text-emerald-300',
                result === 'wrong' && 'border-red-500 text-red-300',
                !result && 'border-brand-500 text-brand-300'
              )}
            />
          </form>
          <span>{afterBlank}</span>

          {/* Result indicator */}
          {result && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
              {isCorrect ? (
                <Check size={20} className="text-emerald-400" />
              ) : (
                <X size={20} className="text-red-400" />
              )}
            </motion.span>
          )}
        </div>

        {/* Translation */}
        <p className="text-sm text-slate-500 mt-3 italic">{translation}</p>
      </div>

      {/* Feedback */}
      {result === 'close' && (
        <p className="text-center text-sm text-emerald-400 mb-4">
          Prawie! Dokladna pisownia: <strong>{missingWord}</strong>
        </p>
      )}

      {result === 'wrong' && !showAnswer && (
        <p className="text-center text-sm text-red-400 mb-4">
          Nie to słowo. Spróbuj jeszcze! (zostało prób: {3 - attempts})
        </p>
      )}

      {showAnswer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center glass rounded-xl p-4 mb-4"
        >
          <p className="text-sm text-slate-400">Poprawne słowo:</p>
          <p className="text-xl font-bold text-white">{missingWord}</p>
        </motion.div>
      )}

      {/* Submit */}
      {!isCorrect && !showAnswer && (
        <button
          onClick={(e) => handleSubmit(e as never)}
          disabled={!input.trim()}
          className="w-full py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors disabled:opacity-30"
        >
          Sprawdz
        </button>
      )}
    </div>
  )
}
