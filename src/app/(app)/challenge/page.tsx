'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Trophy, Star, ArrowRight, Zap, Target } from 'lucide-react'
import TypeAnswer from '@/components/TypeAnswer'
import SentenceComplete from '@/components/SentenceComplete'
import ListeningExercise from '@/components/ListeningExercise'
import QuizCard from '@/components/QuizCard'
import { VocabularyItem, QuizQuestion } from '@/types'
import { allVocabulary, getVocabularyByLanguage } from '@/data'
import { getStats, recordActivity, getWordsToReview, getAllProgress, getLearnedWordIds } from '@/lib/storage'
import { shuffleArray } from '@/lib/utils'

type ExerciseType = 'quiz' | 'typeTranslation' | 'typeWord' | 'sentence' | 'listening'

interface Exercise {
  type: ExerciseType
  word: VocabularyItem
  quizQuestion?: QuizQuestion
}

function generateDailyChallenge(): Exercise[] {
  const exercises: Exercise[] = []
  const progress = getAllProgress()
  const dueIds = getWordsToReview()

  // Mix of review words and random words
  const reviewWords = dueIds
    .map(id => allVocabulary.find(v => v.id === id))
    .filter((v): v is VocabularyItem => !!v)
    .slice(0, 5)

  const randomWords = shuffleArray(allVocabulary).slice(0, 10 - reviewWords.length)
  const words = shuffleArray([...reviewWords, ...randomWords])

  // Generate diverse exercises
  const types: ExerciseType[] = ['quiz', 'typeTranslation', 'typeWord', 'sentence', 'listening']

  for (const word of words) {
    const type = types[Math.floor(Math.random() * types.length)]

    if (type === 'quiz') {
      const vocab = getVocabularyByLanguage(word.language)
      const wrong = shuffleArray(vocab.filter(v => v.id !== word.id)).slice(0, 3)
      const options = shuffleArray([word.translation, ...wrong.map(w => w.translation)])
      exercises.push({
        type: 'quiz',
        word,
        quizQuestion: {
          vocabularyItem: word,
          options,
          correctAnswer: word.translation,
          type: 'wordToTranslation',
        },
      })
    } else {
      exercises.push({ type, word })
    }
  }

  return exercises
}

type ChallengeState = 'intro' | 'playing' | 'results'

export default function ChallengePage() {
  const [state, setState] = useState<ChallengeState>('intro')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const stats = typeof window !== 'undefined' ? getStats() : null

  const today = new Date().toISOString().split('T')[0]
  const alreadyDone = stats?.lastActiveDate === today && (stats?.wordsReviewedToday ?? 0) >= 10

  const startChallenge = () => {
    setExercises(generateDailyChallenge())
    setCurrent(0)
    setScore(0)
    setResults([])
    setState('playing')
  }

  const handleResult = useCallback((correct: boolean) => {
    setResults(prev => [...prev, correct])
    if (correct) setScore(prev => prev + 1)

    setTimeout(() => {
      if (current + 1 >= exercises.length) {
        const finalScore = correct ? score + 1 : score
        const streakBonus = (stats?.currentStreak ?? 0) >= 3 ? 15 : 0
        const perfectBonus = (correct ? score + 1 : score) === exercises.length ? 25 : 0
        const xp = finalScore * 10 + streakBonus + perfectBonus
        recordActivity(0, exercises.length, xp)
        setState('results')
      } else {
        setCurrent(prev => prev + 1)
      }
    }, 200)
  }, [current, exercises.length, score, stats])

  const currentExercise = exercises[current]
  const accuracy = results.length > 0 ? Math.round((score / results.length) * 100) : 0
  const totalXp = score * 10 + ((stats?.currentStreak ?? 0) >= 3 ? 15 : 0) + (score === exercises.length ? 25 : 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Flame className="text-orange-400" />
          Wyzwanie dnia
        </h1>
        <p className="text-slate-400 mt-1">
          10 roznorodnych cwiczen kazdego dnia - buduj serie i zdobywaj bonusy!
        </p>
      </div>

      <AnimatePresence mode="wait">
        {state === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Streak card */}
            <div className="glass rounded-2xl p-8 text-center glow">
              <Flame size={56} className="text-orange-400 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-1">
                {stats?.currentStreak ?? 0} dni
              </h2>
              <p className="text-slate-400">Twoja seria</p>

              {(stats?.currentStreak ?? 0) >= 3 && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium">
                  <Zap size={14} /> Bonus za serie: +15 XP
                </div>
              )}
            </div>

            {/* Today's challenge */}
            <div className="glass rounded-2xl p-6 border-l-4 border-orange-500">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Target size={18} className="text-orange-400" />
                Dzisiejsze wyzwanie
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                10 cwiczen: quiz, pisanie, sluchanie, zdania. Miks angielskiego i hiszpanskiego.
                Idealna sesja na kazdy dzien - zajmie ok. 5 minut.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 mb-4">
                <li>+10 XP za kazda poprawna odpowiedz</li>
                <li>+25 XP bonus za bezbledna sesje</li>
                <li>+15 XP bonus za serie 3+ dni</li>
              </ul>

              <button
                onClick={startChallenge}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
              >
                {alreadyDone ? 'Kolejne wyzwanie' : 'Rozpocznij wyzwanie'} <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {state === 'playing' && currentExercise && (
          <motion.div
            key={`exercise-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">
                  {current + 1} / {exercises.length}
                </span>
                <span className="text-sm text-yellow-400">{score * 10} XP</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  animate={{ width: `${(current / exercises.length) * 100}%` }}
                />
              </div>
            </div>

            {currentExercise.type === 'quiz' && currentExercise.quizQuestion && (
              <QuizCard
                question={currentExercise.quizQuestion}
                onAnswer={handleResult}
                questionNumber={current + 1}
                totalQuestions={exercises.length}
              />
            )}

            {currentExercise.type === 'typeTranslation' && (
              <TypeAnswer
                key={`chal-tr-${currentExercise.word.id}`}
                prompt={currentExercise.word.word}
                promptSubtitle="Wpisz polskie tlumaczenie"
                correctAnswer={currentExercise.word.translation}
                emoji={currentExercise.word.emoji}
                language={currentExercise.word.language}
                onResult={handleResult}
              />
            )}

            {currentExercise.type === 'typeWord' && (
              <TypeAnswer
                key={`chal-word-${currentExercise.word.id}`}
                prompt={currentExercise.word.translation}
                promptSubtitle={`Wpisz po ${currentExercise.word.language === 'en' ? 'angielsku' : 'hiszpansku'}`}
                correctAnswer={currentExercise.word.word}
                emoji={currentExercise.word.emoji}
                onResult={handleResult}
              />
            )}

            {currentExercise.type === 'sentence' && (
              <SentenceComplete
                key={`chal-sent-${currentExercise.word.id}`}
                sentence={currentExercise.word.exampleSentence}
                missingWord={currentExercise.word.word.split(' ')[0]}
                translation={currentExercise.word.exampleTranslation}
                language={currentExercise.word.language}
                onResult={handleResult}
              />
            )}

            {currentExercise.type === 'listening' && (
              <ListeningExercise
                key={`chal-listen-${currentExercise.word.id}`}
                word={currentExercise.word.word}
                correctAnswer={currentExercise.word.word}
                language={currentExercise.word.language}
                hint={currentExercise.word.translation}
                onResult={handleResult}
              />
            )}
          </motion.div>
        )}

        {state === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-10 text-center glow"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
              {accuracy >= 80 ? (
                <Trophy size={64} className="text-yellow-400 mx-auto mb-4" />
              ) : (
                <Star size={64} className="text-brand-400 mx-auto mb-4" />
              )}
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-2">
              {accuracy === 100 ? 'Perfekcyjnie!' : accuracy >= 80 ? 'Swietnie!' : accuracy >= 50 ? 'Nieźle!' : 'Nie poddawaj sie!'}
            </h2>

            <div className="grid grid-cols-3 gap-3 mb-8 max-w-sm mx-auto mt-6">
              <div className="glass rounded-xl p-3">
                <p className="text-xl font-bold text-yellow-400">{totalXp}</p>
                <p className="text-xs text-slate-400">XP</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xl font-bold text-emerald-400">{score}/{exercises.length}</p>
                <p className="text-xs text-slate-400">poprawne</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xl font-bold text-orange-400">{(stats?.currentStreak ?? 0) + 1}</p>
                <p className="text-xs text-slate-400">seria dni</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={startChallenge} className="px-6 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors">
                Jeszcze raz
              </button>
              <button onClick={() => setState('intro')} className="px-6 py-3 rounded-xl glass text-slate-300 font-medium hover:bg-white/10 transition-colors">
                Powrot
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
