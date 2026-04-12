import { Category } from '@/types'

export const categories: Category[] = [
  // English B2
  {
    id: 'en-business',
    name: 'Business & Work',
    namePl: 'Biznes i Praca',
    emoji: '💼',
    language: 'en',
    description: 'Słownictwo biznesowe i zawodowe',
  },
  {
    id: 'en-idioms',
    name: 'Idioms & Expressions',
    namePl: 'Idiomy i Wyrażenia',
    emoji: '💬',
    language: 'en',
    description: 'Popularne idiomy i wyrażenia potoczne',
  },
  {
    id: 'en-phrasal',
    name: 'Phrasal Verbs',
    namePl: 'Czasowniki frazowe',
    emoji: '🔗',
    language: 'en',
    description: 'Najważniejsze phrasal verbs na poziomie B2',
  },
  {
    id: 'en-academic',
    name: 'Academic',
    namePl: 'Akademicki',
    emoji: '🎓',
    language: 'en',
    description: 'Słownictwo akademickie i formalne',
  },
  {
    id: 'en-travel',
    name: 'Travel & Culture',
    namePl: 'Podróże i Kultura',
    emoji: '✈️',
    language: 'en',
    description: 'Przydatne zwroty w podróży',
  },
  {
    id: 'en-emotions',
    name: 'Emotions & Personality',
    namePl: 'Emocje i Osobowość',
    emoji: '🎭',
    language: 'en',
    description: 'Opisywanie emocji i cech charakteru',
  },

  // Spanish A1
  {
    id: 'es-greetings',
    name: 'Saludos',
    namePl: 'Powitania i Pożegnania',
    emoji: '👋',
    language: 'es',
    description: 'Podstawowe powitania i zwroty grzecznościowe',
  },
  {
    id: 'es-numbers',
    name: 'Números y Colores',
    namePl: 'Liczby i Kolory',
    emoji: '🔢',
    language: 'es',
    description: 'Liczby, kolory i podstawowe przymiotniki',
  },
  {
    id: 'es-food',
    name: 'Comida y Bebida',
    namePl: 'Jedzenie i Picie',
    emoji: '🍽️',
    language: 'es',
    description: 'Nazwy jedzenia, picia i zamawianie w restauracji',
  },
  {
    id: 'es-family',
    name: 'Familia',
    namePl: 'Rodzina i Ludzie',
    emoji: '👨‍👩‍👧‍👦',
    language: 'es',
    description: 'Rodzina, relacje i opisywanie ludzi',
  },
  {
    id: 'es-daily',
    name: 'Vida Diaria',
    namePl: 'Codzienne Zwroty',
    emoji: '🏠',
    language: 'es',
    description: 'Zwroty na co dzień, pytania, odpowiedzi',
  },
  {
    id: 'es-travel',
    name: 'Viajes',
    namePl: 'Podróże',
    emoji: '🌍',
    language: 'es',
    description: 'Przydatne zwroty w podróży po krajach hiszpańskojęzycznych',
  },
]

export function getCategoriesByLanguage(language: 'en' | 'es'): Category[] {
  return categories.filter(c => c.language === language)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id)
}
