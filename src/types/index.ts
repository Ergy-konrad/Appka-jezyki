export type Language = 'en' | 'es'

export type Difficulty = 1 | 2 | 3 | 4 | 5

export type SrsRating = 'again' | 'hard' | 'good' | 'easy'

export interface VocabularyItem {
  id: string
  language: Language
  word: string
  translation: string
  phonetic?: string
  category: string
  difficulty: Difficulty
  exampleSentence: string
  exampleTranslation: string
  emoji: string
}

export interface UserProgress {
  id: string
  vocabularyId: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReview: string
  lastReviewed: string
}

export interface QuizQuestion {
  vocabularyItem: VocabularyItem
  options: string[]
  correctAnswer: string
  type: 'wordToTranslation' | 'translationToWord'
}

export interface UserStats {
  totalWordsLearned: number
  wordsReviewedToday: number
  currentStreak: number
  longestStreak: number
  totalXp: number
  level: number
  quizzesCompleted: number
  lastActiveDate: string
}

export interface DailyActivity {
  date: string
  wordsLearned: number
  wordsReviewed: number
  xpEarned: number
}

export interface Category {
  id: string
  name: string
  namePl: string
  emoji: string
  language: Language
  description: string
}
