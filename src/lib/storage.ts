import { UserProgress, UserStats, DailyActivity } from '@/types'
import { createClient, isSupabaseConfigured } from './supabase/client'

const KEYS = {
  PROGRESS: 'lingua_progress',
  STATS: 'lingua_stats',
  DAILY: 'lingua_daily',
  SYNCED: 'lingua_last_sync',
  USER_ID: 'lingua_user_id',
} as const

// ─── LocalStorage helpers ───

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

// ─── Supabase sync (fire-and-forget, non-blocking) ───

let syncQueue: (() => Promise<void>)[] = []
let syncing = false

function queueSync(fn: () => Promise<void>) {
  if (!isSupabaseConfigured()) return
  syncQueue.push(fn)
  processQueue()
}

async function processQueue() {
  if (syncing || syncQueue.length === 0) return
  syncing = true
  while (syncQueue.length > 0) {
    const task = syncQueue.shift()!
    try {
      await task()
    } catch (e) {
      console.warn('Supabase sync failed (offline?):', e)
    }
  }
  syncing = false
}

function getUserId(): string | null {
  return safeGet(KEYS.USER_ID, null)
}

// Sync a single word progress to Supabase
function syncWordToSupabase(vocabularyId: string, progress: UserProgress) {
  queueSync(async () => {
    const supabase = createClient()
    const userId = getUserId()
    if (!supabase || !userId) return

    await supabase.from('user_progress').upsert({
      user_id: userId,
      vocabulary_id: vocabularyId,
      ease_factor: progress.easeFactor,
      interval: progress.interval,
      repetitions: progress.repetitions,
      next_review: progress.nextReview,
      last_reviewed: progress.lastReviewed,
    }, { onConflict: 'user_id,vocabulary_id' })
  })
}

// Sync stats to Supabase
function syncStatsToSupabase(stats: UserStats) {
  queueSync(async () => {
    const supabase = createClient()
    const userId = getUserId()
    if (!supabase || !userId) return

    await supabase.from('profiles').upsert({
      id: userId,
      total_xp: stats.totalXp,
      current_streak: stats.currentStreak,
      longest_streak: stats.longestStreak,
      last_active_date: stats.lastActiveDate || null,
    })
  })
}

// Sync daily activity to Supabase
function syncDailyToSupabase(activity: DailyActivity) {
  queueSync(async () => {
    const supabase = createClient()
    const userId = getUserId()
    if (!supabase || !userId) return

    await supabase.from('daily_activity').upsert({
      user_id: userId,
      date: activity.date,
      words_learned: activity.wordsLearned,
      words_reviewed: activity.wordsReviewed,
      xp_earned: activity.xpEarned,
    }, { onConflict: 'user_id,date' })
  })
}

// ─── Full sync: pull from Supabase on first load ───

export async function pullFromSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  const supabase = createClient()
  if (!supabase) return false

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    safeSet(KEYS.USER_ID, user.id)

    // Pull progress
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)

    if (progressData && progressData.length > 0) {
      const localProgress = getAllProgress()
      for (const row of progressData) {
        const local = localProgress[row.vocabulary_id]
        const remote: UserProgress = {
          id: row.vocabulary_id,
          vocabularyId: row.vocabulary_id,
          easeFactor: row.ease_factor,
          interval: row.interval,
          repetitions: row.repetitions,
          nextReview: row.next_review,
          lastReviewed: row.last_reviewed,
        }
        // Keep whichever was reviewed more recently
        if (!local || new Date(remote.lastReviewed) > new Date(local.lastReviewed)) {
          localProgress[row.vocabulary_id] = remote
        }
      }
      safeSet(KEYS.PROGRESS, localProgress)
    }

    // Pull profile/stats
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      const localStats = getStats()
      // Keep higher values
      updateStats({
        totalXp: Math.max(localStats.totalXp, profile.total_xp || 0),
        currentStreak: Math.max(localStats.currentStreak, profile.current_streak || 0),
        longestStreak: Math.max(localStats.longestStreak, profile.longest_streak || 0),
      })
    }

    safeSet(KEYS.SYNCED, new Date().toISOString())
    return true
  } catch (e) {
    console.warn('Pull from Supabase failed:', e)
    return false
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
  const merged = {
    ...defaults,
    ...all[vocabularyId],
    ...update,
  }
  all[vocabularyId] = merged
  safeSet(KEYS.PROGRESS, all)

  // Sync to cloud
  syncWordToSupabase(vocabularyId, merged)
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
  const merged = { ...current, ...update }
  safeSet(KEYS.STATS, merged)
  syncStatsToSupabase(merged)
}

export function addXp(amount: number) {
  const stats = getStats()
  updateStats({ totalXp: stats.totalXp + amount })
}

export function recordActivity(wordsLearned: number, wordsReviewed: number, xpEarned: number) {
  const stats = getStats()
  const today = new Date().toISOString().split('T')[0]

  let newStreak = stats.currentStreak
  if (stats.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (stats.lastActiveDate === yesterday) {
      newStreak = stats.currentStreak + 1
    } else {
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

  const activities = getDailyActivities()
  const todayIdx = activities.findIndex(a => a.date === today)
  if (todayIdx >= 0) {
    activities[todayIdx].wordsLearned += wordsLearned
    activities[todayIdx].wordsReviewed += wordsReviewed
    activities[todayIdx].xpEarned += xpEarned
  } else {
    activities.push({ date: today, wordsLearned, wordsReviewed, xpEarned })
  }
  safeSet(KEYS.DAILY, activities.slice(-30))

  // Sync today's activity
  const todayActivity = activities.find(a => a.date === today)
  if (todayActivity) syncDailyToSupabase(todayActivity)
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

// ─── Utils ───

export function isCloudSyncEnabled(): boolean {
  return isSupabaseConfigured() && !!getUserId()
}

export function getLastSyncTime(): string | null {
  return safeGet(KEYS.SYNCED, null)
}
