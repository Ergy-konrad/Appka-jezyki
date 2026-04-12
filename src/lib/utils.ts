import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

export function getLevelFromXp(xp: number): number {
  let level = 1
  let totalXp = 0
  while (true) {
    const needed = getXpForLevel(level)
    if (totalXp + needed > xp) break
    totalXp += needed
    level++
  }
  return level
}

export function getXpProgress(xp: number): { current: number; needed: number; percentage: number } {
  const level = getLevelFromXp(xp)
  let totalXpBefore = 0
  for (let i = 1; i < level; i++) {
    totalXpBefore += getXpForLevel(i)
  }
  const current = xp - totalXpBefore
  const needed = getXpForLevel(level)
  return {
    current,
    needed,
    percentage: Math.min(100, Math.round((current / needed) * 100)),
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getLanguageFlag(lang: 'en' | 'es'): string {
  return lang === 'en' ? '🇬🇧' : '🇪🇸'
}

export function getLanguageName(lang: 'en' | 'es'): string {
  return lang === 'en' ? 'Angielski' : 'Hiszpański'
}

export function getDifficultyLabel(d: number): string {
  const labels = ['', 'Podstawowy', 'Łatwy', 'Średni', 'Trudny', 'Zaawansowany']
  return labels[d] || ''
}

export function getDifficultyColor(d: number): string {
  const colors = ['', 'text-emerald-400', 'text-green-400', 'text-yellow-400', 'text-orange-400', 'text-red-400']
  return colors[d] || ''
}
