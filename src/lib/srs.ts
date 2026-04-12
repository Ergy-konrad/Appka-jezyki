import { SrsRating, UserProgress } from '@/types'

const RATING_QUALITY: Record<SrsRating, number> = {
  again: 0,
  hard: 2,
  good: 4,
  easy: 5,
}

export function calculateNextReview(
  progress: UserProgress | null,
  rating: SrsRating
): Partial<UserProgress> {
  const quality = RATING_QUALITY[rating]
  let easeFactor = progress?.easeFactor ?? 2.5
  let interval = progress?.interval ?? 0
  let repetitions = progress?.repetitions ?? 0

  if (quality < 3) {
    repetitions = 0
    interval = 1
  } else {
    repetitions++
    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  if (rating === 'easy') {
    interval = Math.round(interval * 1.3)
  }

  const now = new Date()
  const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReview: nextReview.toISOString(),
    lastReviewed: now.toISOString(),
  }
}

export function isDueForReview(progress: UserProgress): boolean {
  return new Date(progress.nextReview) <= new Date()
}

export function getXpForRating(rating: SrsRating): number {
  switch (rating) {
    case 'again': return 2
    case 'hard': return 5
    case 'good': return 10
    case 'easy': return 15
  }
}

export function getRatingLabel(rating: SrsRating): string {
  switch (rating) {
    case 'again': return 'Powtórz'
    case 'hard': return 'Trudne'
    case 'good': return 'Dobrze'
    case 'easy': return 'Łatwe'
  }
}

export function getRatingColor(rating: SrsRating): string {
  switch (rating) {
    case 'again': return 'bg-red-500 hover:bg-red-600'
    case 'hard': return 'bg-orange-500 hover:bg-orange-600'
    case 'good': return 'bg-emerald-500 hover:bg-emerald-600'
    case 'easy': return 'bg-cyan-500 hover:bg-cyan-600'
  }
}
