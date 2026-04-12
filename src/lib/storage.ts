import { UserProgress, UserStats, DailyActivity } from '@/types'

const KEYS = {
  PROGRESS: 'lingua_progress',
  STATS: 'lingua_stats',
  DAILY: 'lingua_daily',
} as const

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

// ─── Progress ───

export function getAllProgress(): Record<string, UserProgress> {
  return safeGet(KEYS.PROGRESS, {})
}

export function getProgressForWord(vocabularyId: string): UserProgress | null {
  const all = getAllProgress()
  return all[vocabularyId] || null
}

export function saveWordProgress(vocabularyId: string, update: Partial<UserProgress>) {
  const all = getAllProgress()
  const defaults: UserProgress = {
    id: vocabularyId,
    vocabularyId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(),
    lastReviewed: new Date().toISOString(),
  }
  all[vocabularyId] = {
    ...defaults,
    ...all[vocabularyId],
    ...update,
  }
  safeSet(KEYS.PROGRESS, all)
}

export function getWordsToReview(): string[] {
  const all = getAllProgress()
  const now = new Date()
  return Object.keys(all).filter(id => new Date(all[id].nextReview) <= now)
}

export function getLearnedWordIds(): string[] {
  const all = getAllProgress()
  return Object.keys(all).filter(id => all[id].repetitions > 0)
}

// ─── Stats ───

const DEFAULT_STATS: UserStats = {
  totalWordsLearned: 0,
  wordsReviewedToday: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalXp: 0,
  level: 1,
  quizzesCompleted: 0,
  lastActiveDate: '',
}

export function getStats(): UserStats {
  return safeGet(KEYS.STATS, DEFAULT_STATS)
}

export function updateStats(update: Partial<UserStats>) {
  const current = getStats()
  safeSet(KEYS.STATS, { ...current, ...update })
}

export function addXp(amount: number) {
  const stats = getStats()
  const newXp = stats.totalXp + amount
  updateStats({ totalXp: newXp })
}

export function recordActivity(wordsLearned: number, wordsReviewed: number, xpEarned: number) {
  const stats = getStats()
  const today = new Date().toISOString().split('T')[0]

  let newStreak = stats.currentStreak
  if (stats.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (stats.lastActiveDate === yesterday) {
      newStreak = stats.currentStreak + 1
    } else if (stats.lastActiveDate !== today) {
      newStreak = 1
    }
  }

  updateStats({
    totalWordsLearned: stats.totalWordsLearned + wordsLearned,
    wordsReviewedToday: stats.lastActiveDate === today
      ? stats.wordsReviewedToday + wordsReviewed
      : wordsReviewed,
    currentStreak: newStreak,
    longestStreak: Math.max(stats.longestStreak, newStreak),
    totalXp: stats.totalXp + xpEarned,
    lastActiveDate: today,
  })

  // Also save daily activity
  const activities = getDailyActivities()
  const todayIdx = activities.findIndex(a => a.date === today)
  if (todayIdx >= 0) {
    activities[todayIdx].wordsLearned += wordsLearned
    activities[todayIdx].wordsReviewed += wordsReviewed
    activities[todayIdx].xpEarned += xpEarned
  } else {
    activities.push({ date: today, wordsLearned, wordsReviewed, xpEarned })
  }
  safeSet(KEYS.DAILY, activities.slice(-30)) // Keep last 30 days
}

// ─── Daily Activity ───

export function getDailyActivities(): DailyActivity[] {
  return safeGet(KEYS.DAILY, [])
}

export function getTodayActivity(): DailyActivity {
  const today = new Date().toISOString().split('T')[0]
  const activities = getDailyActivities()
  return activities.find(a => a.date === today) || { date: today, wordsLearned: 0, wordsReviewed: 0, xpEarned: 0 }
}
