import { VocabularyItem, Language } from '@/types'
import { englishB2 } from './english-b2'
import { spanishA1 } from './spanish-a1'
import { categories, getCategoriesByLanguage, getCategoryById } from './categories'

export { categories, getCategoriesByLanguage, getCategoryById }

export const allVocabulary: VocabularyItem[] = [...englishB2, ...spanishA1]

export function getVocabularyByLanguage(language: Language): VocabularyItem[] {
  return allVocabulary.filter(v => v.language === language)
}

export function getVocabularyByCategory(categoryId: string): VocabularyItem[] {
  return allVocabulary.filter(v => v.category === categoryId)
}

export function getVocabularyById(id: string): VocabularyItem | undefined {
  return allVocabulary.find(v => v.id === id)
}

export function getRandomWords(language: Language, count: number, exclude: string[] = []): VocabularyItem[] {
  const available = getVocabularyByLanguage(language).filter(v => !exclude.includes(v.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
