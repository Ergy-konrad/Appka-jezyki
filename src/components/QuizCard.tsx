'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Volume2 } from 'lucide-react'
import { QuizQuestion } from '@/types'
import { cn } from '@/lib/utils'

interface QuizCardProps {
  question: QuizQuestion
  onAnswer: (correct: boolean) => void
  questionNumber: number
  totalQuestions: number
}

export default function QuizCard({ question, onAnswer, questionNumber, totalQuestions }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const isCorrect = selected === question.correctAnswer

  const handleSelect = (option: string) => {
    if (showResult) return
    setSelected(option)
    setShowResult(true)

    setTimeout(() => {
      onAnswer(option === question.correctAnswer)
      setSelected(null)
      setShowResult(false)
    }, 1200)
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = question.vocabularyItem.language === 'en' ? 'en-US' : 'es-ES'
      utterance.rate = 0.85
      speechSynthesis.speak(utterance)
    }
  }

  const isTranslateMode = question.type === 'wordToTranslation'

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">
            Pytanie {questionNumber} / {totalQuestions}
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full"
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={question.vocabularyItem.id + question.type}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 glow mb-6"
      >
        <p className="text-sm text-slate-400 mb-2">
          {isTranslateMode ? 'Jak przetlumaczysz:' : 'Ktore slowo oznacza:'}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{question.vocabularyItem.emoji}</span>
          <h2 className="text-2xl font-bold text-white">
            {isTranslateMode ? question.vocabularyItem.word : question.vocabularyItem.translation}
          </h2>
          {isTranslateMode && (
            <button
              onClick={() => speak(question.vocabularyItem.word)}
              className="p-2 rounded-full bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors"
            >
              <Volume2 size={18} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, idx) => {
          const isSelected = selected === option
          const isCorrectOption = option === question.correctAnswer

          let optionStyle = 'glass card-hover'
          if (showResult) {
            if (isCorrectOption) {
              optionStyle = 'bg-emerald-500/20 border border-emerald-500/50'
            } else if (isSelected && !isCorrect) {
              optionStyle = 'bg-red-500/20 border border-red-500/50 animate-wrong'
            } else {
              optionStyle = 'glass opacity-50'
            }
          }

          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSelect(option)}
              disabled={showResult}
              className={cn(
                'w-full text-left px-6 py-4 rounded-xl font-medium transition-all duration-200',
                optionStyle,
                !showResult && 'hover:bg-white/10 active:scale-[0.98]'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-white">{option}</span>
                {showResult && isCorrectOption && (
                  <Check size={20} className="text-emerald-400" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <X size={20} className="text-red-400" />
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
