'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Volume2, ArrowRight, Trophy, Star,
  BookOpen, Keyboard, MessageSquare, Headphones, RotateCcw
} from 'lucide-react'
import TypeAnswer from '@/components/TypeAnswer'
import SentenceComplete from '@/components/SentenceComplete'
import ListeningExercise from '@/components/ListeningExercise'
import LanguageSelector from '@/components/LanguageSelector'
import { Language, VocabularyItem, SrsRating } from '@/types'
import { getVocabularyByLanguage, getVocabularyById } from '@/data'
import { getAllProgress, getWordsToReview, saveWordProgress, recordActivity } from '@/lib/storage'
import { calculateNextReview, getXpForRating } from '@/lib/srs'
import { shuffleArray } from '@/lib/utils'

// A learning step for one word
type StepType = 'introduce' | 'typeTranslation' | 'typeWord' | 'sentenceComplete' | 'listening'

interface LearningStep {
  type: StepType
  word: VocabularyItem
}

type PageState = 'setup' | 'learning' | 'results'

// Generate learning steps for a set of words
// Each word goes through multiple exercise types for deeper learning
function generateSteps(words: VocabularyItem[]): LearningStep[] {
  const steps: LearningStep[] = []

  for (const word of words) {
    // 1. Always introduce first
    steps.push({ type: 'introduce', word })
    // 2. Type the translation (see foreign word -> type PL)
    steps.push({ type: 'typeTranslation', word })
  }

  // 3. After all introductions, mix harder exercises
  const shuffledForSentence = shuffleArray(words)
  for (const word of shuffledForSentence) {
    steps.push({ type: 'sentenceComplete', word })
  }

  // 4. Listening round
  const shuffledForListening = shuffleArray(words)
  for (const word of shuffledForListening) {
    steps.push({ type: 'listening', word })
  }

  // 5. Final recall - type the foreign word from Polish
  const shuffledForRecall = shuffleArray(words)
  for (const word of shuffledForRecall) {
    steps.push({ type: 'typeWord', word })
  }

  return steps
}

const STEP_LABELS: Record<StepType, { label: string; icon: typeof BookOpen; color: string }> = {
  introduce: { label: 'Poznaj', icon: BookOpen, color: 'text-brand-400' },
  typeTranslation: { label: 'Przetlumacz', icon: Keyboard, color: 'text-cyan-400' },
  typeWord: { label: 'Przypomnij', icon: Star, color: 'text-yellow-400' },
  sentenceComplete: { label: 'Uzupelnij', icon: MessageSquare, color: 'text-emerald-400' },
  listening: { label: 'Posluchaj', icon: Headphones, color: 'text-violet-400' },
}

export default function LearnPage() {
  const [language, setLanguage] = useState<Language>('es')
  const [state, setState] = useState<PageState>('setup')
  const [steps, setSteps] = useState<LearningStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [sessionXp, setSessionXp] = useState(0)
  const [batchSize, setBatchSize] = useState(5)
  const [failedWords, setFailedWords] = useState<Set<string>>(new Set())

  const startSession = useCallback((type: 'new' | 'review') => {
    const allProgress = getAllProgress()
    const vocab = getVocabularyByLanguage(language)
    let selectedWords: VocabularyItem[]

    if (type === 'review') {
      const dueIds = getWordsToReview()
      selectedWords = dueIds
        .map(id => getVocabularyById(id))
        .filter((v): v is VocabularyItem => !!v && v.language === language)
        .slice(0, batchSize)
    } else {
      const learnedIds = new Set(Object.keys(allProgress))
      selectedWords = vocab.filter(v => !learnedIds.has(v.id)).slice(0, batchSize)
    }

    if (selectedWords.length === 0) {
      selectedWords = shuffleArray(vocab).slice(0, batchSize)
    }

    setSteps(generateSteps(selectedWords))
    setCurrentStep(0)
    setResults([])
    setSessionXp(0)
    setFailedWords(new Set())
    setState('learning')
  }, [language, batchSize])

  const handleStepResult = useCallback((correct: boolean) => {
    const step = steps[currentStep]
    setResults(prev => [...prev, correct])

    if (correct) {
      setSessionXp(prev => prev + 5)
    } else {
      setFailedWords(prev => new Set(prev).add(step.word.id))
    }

    // Save progress for non-intro steps
    if (step.type !== 'introduce') {
      const rating: SrsRating = correct ? 'good' : 'again'
      const progress = getAllProgress()[step.word.id] || null
      const update = calculateNextReview(progress, rating)
      saveWordProgress(step.word.id, update)
    }

    setTimeout(() => {
      if (currentStep + 1 >= steps.length) {
        // Session complete
        const totalCorrect = [...results, correct].filter(Boolean).length
        const xp = sessionXp + (correct ? 5 : 0) + (failedWords.size === 0 ? 20 : 0) // Bonus for perfect
        recordActivity(batchSize, steps.length, xp)
        setSessionXp(xp)
        setState('results')
      } else {
        setCurrentStep(prev => prev + 1)
      }
    }, 200)
  }, [steps, currentStep, results, sessionXp, failedWords, batchSize])

  const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'en' ? 'en-US' : 'es-ES'
      utterance.rate = 0.85
      speechSynthesis.speak(utterance)
    }
  }

  // Count available words
  const [reviewCount, setReviewCount] = useState(0)
  const [newCount, setNewCount] = useState(0)
  useEffect(() => {
    const allProgress = getAllProgress()
    const vocab = getVocabularyByLanguage(language)
    const dueIds = getWordsToReview().filter(id => {
      const v = getVocabularyById(id)
      return v && v.language === language
    })
    const learned = new Set(Object.keys(allProgress))
    setReviewCount(dueIds.length)
    setNewCount(vocab.filter(v => !learned.has(v.id)).length)
  }, [language, state])

  const currentStepData = steps[currentStep]
  const stepInfo = currentStepData ? STEP_LABELS[currentStepData.type] : null
  const totalSteps = steps.length
  const progressPct = totalSteps > 0 ? Math.round(((currentStep) / totalSteps) * 100) : 0

  const totalCorrect = results.filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="text-emerald-400" />
            Nauka
          </h1>
          <p className="text-slate-400 mt-1">
            Poznaj &rarr; Przetlumacz &rarr; Uzupelnij &rarr; Posluchaj &rarr; Przypomnij
          </p>
        </div>
        {state === 'setup' && (
          <LanguageSelector selected={language} onChange={setLanguage} />
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── SETUP ─── */}
        {state === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Method explanation */}
            <div className="glass rounded-2xl p-6 border-l-4 border-emerald-500">
              <h3 className="font-bold text-white mb-2">Jak dziala nauka?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Kazde slowo przechodzi przez <strong className="text-white">5 etapow</strong> - od poznania do samodzielnego pisania.
                To podejscie laczy <strong className="text-emerald-400">active recall</strong> (aktywne przypominanie),{' '}
                <strong className="text-cyan-400">spaced repetition</strong> (powtorki w czasie) i{' '}
                <strong className="text-violet-400">interleaving</strong> (mieszanie typow cwiczen).
                Naukowo udowodniono, ze ta kombinacja jest 3x skuteczniejsza niz zwykle czytanie.
              </p>
            </div>

            {/* Steps explanation */}
            <div className="grid grid-cols-5 gap-2">
              {(['introduce', 'typeTranslation', 'sentenceComplete', 'listening', 'typeWord'] as StepType[]).map((type, i) => {
                const info = STEP_LABELS[type]
                return (
                  <div key={type} className="glass rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-xs text-slate-500">{i + 1}</span>
                    </div>
                    <info.icon size={20} className={`mx-auto mb-1 ${info.color}`} />
                    <p className="text-xs font-medium text-slate-300">{info.label}</p>
                  </div>
                )
              })}
            </div>

            {/* Batch size */}
            <div className="glass rounded-2xl p-6">
              <p className="text-sm text-slate-400 mb-3">Ile slow w sesji:</p>
              <div className="flex gap-2">
                {[3, 5, 7, 10].map(size => (
                  <button
                    key={size}
                    onClick={() => setBatchSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      batchSize === size
                        ? 'bg-emerald-500 text-white'
                        : 'glass text-slate-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                = {batchSize * 5} cwiczen (kazde slowo x 5 etapow)
              </p>
            </div>

            {/* Start buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => startSession('new')}
                className="glass rounded-2xl p-8 text-left card-hover glow-hover group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center mb-4">
                  <GraduationCap size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nowe slowa</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Poznaj i naucz sie nowego slownictwa
                </p>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                  {newCount} dostepnych
                </span>
              </button>

              <button
                onClick={() => startSession('review')}
                className="glass rounded-2xl p-8 text-left card-hover glow-hover group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4">
                  <RotateCcw size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Powtorka</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Powtorz slowa przed zapomnieniem
                </p>
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium">
                  {reviewCount} do powtorki
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── LEARNING ─── */}
        {state === 'learning' && currentStepData && (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {stepInfo && (
                    <>
                      <stepInfo.icon size={16} className={stepInfo.color} />
                      <span className={`text-sm font-medium ${stepInfo.color}`}>
                        {stepInfo.label}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-sm text-slate-400">
                  {currentStep + 1} / {totalSteps}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* ── INTRODUCE ── */}
            {currentStepData.type === 'introduce' && (
              <div className="w-full max-w-lg mx-auto">
                <div className="glass rounded-2xl p-8 glow text-center space-y-4">
                  <span className="text-6xl block">{currentStepData.word.emoji}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{currentStepData.word.word}</h2>
                    <button
                      onClick={() => speak(currentStepData.word.word, currentStepData.word.language)}
                      className="mx-auto mt-2 p-2 rounded-full bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors"
                    >
                      <Volume2 size={20} />
                    </button>
                  </div>
                  <div className="w-16 h-0.5 bg-brand-500/30 mx-auto" />
                  <p className="text-2xl text-brand-300 font-medium">{currentStepData.word.translation}</p>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-left">
                    <p className="text-cyan-300 italic text-sm">
                      &ldquo;{currentStepData.word.exampleSentence}&rdquo;
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      {currentStepData.word.exampleTranslation}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      speak(currentStepData.word.exampleSentence, currentStepData.word.language)
                    }}
                    className="text-xs text-brand-400 flex items-center gap-1 mx-auto hover:text-brand-300"
                  >
                    <Volume2 size={12} /> Posluchaj zdania
                  </button>
                </div>
                <button
                  onClick={() => handleStepResult(true)}
                  className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-lg hover:from-brand-600 hover:to-brand-700 transition-all flex items-center justify-center gap-2"
                >
                  Rozumiem, dalej <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* ── TYPE TRANSLATION ── */}
            {currentStepData.type === 'typeTranslation' && (
              <TypeAnswer
                key={`type-tr-${currentStepData.word.id}`}
                prompt={currentStepData.word.word}
                promptSubtitle="Wpisz polskie tlumaczenie"
                correctAnswer={currentStepData.word.translation}
                emoji={currentStepData.word.emoji}
                language={currentStepData.word.language}
                onResult={handleStepResult}
                placeholder="Wpisz tlumaczenie po polsku..."
              />
            )}

            {/* ── TYPE WORD (reverse) ── */}
            {currentStepData.type === 'typeWord' && (
              <TypeAnswer
                key={`type-word-${currentStepData.word.id}`}
                prompt={currentStepData.word.translation}
                promptSubtitle={`Wpisz slowo po ${currentStepData.word.language === 'en' ? 'angielsku' : 'hiszpansku'}`}
                correctAnswer={currentStepData.word.word}
                emoji={currentStepData.word.emoji}
                onResult={handleStepResult}
                placeholder={`Wpisz po ${currentStepData.word.language === 'en' ? 'angielsku' : 'hiszpansku'}...`}
              />
            )}

            {/* ── SENTENCE COMPLETE ── */}
            {currentStepData.type === 'sentenceComplete' && (
              <SentenceComplete
                key={`sent-${currentStepData.word.id}`}
                sentence={currentStepData.word.exampleSentence}
                missingWord={currentStepData.word.word.split(' ')[0]}
                translation={currentStepData.word.exampleTranslation}
                language={currentStepData.word.language}
                onResult={handleStepResult}
              />
            )}

            {/* ── LISTENING ── */}
            {currentStepData.type === 'listening' && (
              <ListeningExercise
                key={`listen-${currentStepData.word.id}`}
                word={currentStepData.word.word}
                correctAnswer={currentStepData.word.word}
                language={currentStepData.word.language}
                hint={currentStepData.word.translation}
                onResult={handleStepResult}
              />
            )}
          </motion.div>
        )}

        {/* ─── RESULTS ─── */}
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
            >
              <Trophy size={64} className="text-yellow-400 mx-auto mb-4" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-2">Sesja zakonczona!</h2>

            {failedWords.size === 0 ? (
              <p className="text-emerald-400 font-medium mb-6">Perfekcyjnie! Bonus +20 XP</p>
            ) : (
              <p className="text-slate-400 mb-6">Dobra robota! Kontynuuj nauke.</p>
            )}

            <div className="grid grid-cols-4 gap-3 mb-8 max-w-md mx-auto">
              <div className="glass rounded-xl p-3">
                <p className="text-xl font-bold text-yellow-400">{sessionXp}</p>
                <p className="text-xs text-slate-400">XP</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xl font-bold text-emerald-400">{totalCorrect}</p>
                <p className="text-xs text-slate-400">poprawne</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xl font-bold text-red-400">{results.length - totalCorrect}</p>
                <p className="text-xs text-slate-400">bledne</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xl font-bold text-brand-400">
                  {results.length > 0 ? Math.round((totalCorrect / results.length) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-400">dokladnosc</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => startSession('new')}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
              >
                Nowe slowa
              </button>
              <button
                onClick={() => startSession('review')}
                className="px-6 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
              >
                Powtorka
              </button>
              <button
                onClick={() => setState('setup')}
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
