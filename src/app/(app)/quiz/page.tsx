'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Trophy, ArrowRight, RotateCcw } from 'lucide-react'
import QuizCard from '@/components/QuizCard'
import LanguageSelector from '@/components/LanguageSelector'
import { Language, QuizQuestion, VocabularyItem } from '@/types'
import { getVocabularyByLanguage } from '@/data'
import { recordActivity } from '@/lib/storage'
import { shuffleArray } from '@/lib/utils'

function generateQuestions(vocab: VocabularyItem[], count: number): QuizQuestion[] {
  const shuffled = shuffleArray(vocab)
  const selected = shuffled.slice(0, count)

  return selected.map(item => {
    const isWordToTranslation = Math.random() > 0.5
    const correctAnswer = isWordToTranslation ? item.translation : item.word

    // Get 3 wrong answers
    const otherItems = vocab.filter(v => v.id !== item.id)
    const wrongAnswers = shuffleArray(otherItems)
      .slice(0, 3)
      .map(v => isWordToTranslation ? v.translation : v.word)

    const options = shuffleArray([correctAnswer, ...wrongAnswers])

    return {
      vocabularyItem: item,
      options,
      correctAnswer,
      type: isWordToTranslation ? 'wordToTranslation' : 'translationToWord',
    } as QuizQuestion
  })
}

type QuizState = 'setup' | 'playing' | 'results'

export default function QuizPage() {
  const [language, setLanguage] = useState<Language>('es')
  const [state, setState] = useState<QuizState>('setup')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [questionCount, setQuestionCount] = useState(10)
  const [answers, setAnswers] = useState<boolean[]>([])

  const startQuiz = useCallback(() => {
    const vocab = getVocabularyByLanguage(language)
    const qs = generateQuestions(vocab, Math.min(questionCount, vocab.length))
    setQuestions(qs)
    setCurrentQ(0)
    setScore(0)
    setAnswers([])
    setState('playing')
  }, [language, questionCount])

  const handleAnswer = useCallback((correct: boolean) => {
    setAnswers(prev => [...prev, correct])
    if (correct) setScore(prev => prev + 1)

    setTimeout(() => {
      if (currentQ + 1 >= questions.length) {
        const finalScore = correct ? score + 1 : score
        const xpEarned = finalScore * 8
        recordActivity(0, questions.length, xpEarned)
        setState('results')
      } else {
        setCurrentQ(prev => prev + 1)
      }
    }, 100)
  }, [currentQ, questions.length, score])

  const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  const getResultMessage = () => {
    if (accuracy >= 90) return { text: 'Fenomenalnie!', emoji: '🏆' }
    if (accuracy >= 70) return { text: 'Swietnie!', emoji: '🎉' }
    if (accuracy >= 50) return { text: 'Nieźle!', emoji: '💪' }
    return { text: 'Nie poddawaj sie!', emoji: '📚' }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="text-cyan-400" />
            Quiz
          </h1>
          <p className="text-slate-400 mt-1">Sprawdz swoja wiedze</p>
        </div>
        {state === 'setup' && (
          <LanguageSelector selected={language} onChange={setLanguage} />
        )}
      </div>

      <AnimatePresence mode="wait">
        {state === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Question count */}
            <div className="glass rounded-2xl p-6">
              <p className="text-sm text-slate-400 mb-3">Liczba pytan:</p>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map(count => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      questionCount === count
                        ? 'bg-cyan-500 text-white'
                        : 'glass text-slate-400 hover:text-white'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={startQuiz}
              className="w-full glass rounded-2xl p-8 text-center card-hover glow-hover group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <Brain size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Rozpocznij quiz</h3>
              <p className="text-slate-400 text-sm mb-4">
                {questionCount} pytan z {language === 'en' ? 'angielskiego' : 'hiszpanskiego'}
              </p>
              <div className="inline-flex items-center gap-2 text-cyan-400 font-medium">
                Start <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>
        )}

        {state === 'playing' && questions[currentQ] && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <QuizCard
              question={questions[currentQ]}
              onAnswer={handleAnswer}
              questionNumber={currentQ + 1}
              totalQuestions={questions.length}
            />
          </motion.div>
        )}

        {state === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-10 text-center glow"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-6xl mb-4"
            >
              {getResultMessage().emoji}
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-2">
              {getResultMessage().text}
            </h2>
            <p className="text-slate-400 mb-8">Wynik quizu:</p>

            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold text-emerald-400">{score}</p>
                <p className="text-xs text-slate-400">poprawne</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold text-brand-400">{accuracy}%</p>
                <p className="text-xs text-slate-400">dokladnosc</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-2xl font-bold text-yellow-400">{score * 8}</p>
                <p className="text-xs text-slate-400">XP</p>
              </div>
            </div>

            {/* Answer review */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-8 max-w-md mx-auto">
              {answers.map((correct, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    correct ? 'bg-emerald-500/30 text-emerald-400' : 'bg-red-500/30 text-red-400'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={startQuiz}
                className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors flex items-center gap-2"
              >
                <RotateCcw size={18} /> Kolejny quiz
              </button>
              <button
                onClick={() => setState('setup')}
                className="px-6 py-3 rounded-xl glass text-slate-300 font-medium hover:bg-white/10 transition-colors"
              >
                Ustawienia
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
