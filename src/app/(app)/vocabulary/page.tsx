'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Volume2, Search, Check } from 'lucide-react'
import LanguageSelector from '@/components/LanguageSelector'
import { Language, VocabularyItem } from '@/types'
import { getVocabularyByLanguage, getCategoriesByLanguage, getVocabularyByCategory } from '@/data'
import { getAllProgress } from '@/lib/storage'
import { cn, getDifficultyLabel, getDifficultyColor } from '@/lib/utils'

export default function VocabularyPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-center py-12">Ładowanie...</div>}>
      <VocabularyContent />
    </Suspense>
  )
}

function VocabularyContent() {
  const searchParams = useSearchParams()
  const initialLang = (searchParams.get('lang') as Language) || 'es'

  const [language, setLanguage] = useState<Language>(initialLang)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedWord, setExpandedWord] = useState<string | null>(null)

  const categories = getCategoriesByLanguage(language)
  const progress = typeof window !== 'undefined' ? getAllProgress() : {}

  const words = useMemo(() => {
    let items: VocabularyItem[]
    if (selectedCategory) {
      items = getVocabularyByCategory(selectedCategory)
    } else {
      items = getVocabularyByLanguage(language)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        v => v.word.toLowerCase().includes(q) || v.translation.toLowerCase().includes(q)
      )
    }

    return items
  }, [language, selectedCategory, searchQuery])

  const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'en' ? 'en-US' : 'es-ES'
      utterance.rate = 0.85
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-emerald-400" />
            Słownictwo
          </h1>
          <p className="text-slate-400 mt-1">Przeglądaj i ucz się nowych słów</p>
        </div>
        <LanguageSelector
          selected={language}
          onChange={(lang) => {
            setLanguage(lang)
            setSelectedCategory(null)
            setSearchQuery('')
          }}
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Szukaj słów..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl glass bg-transparent text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all',
            !selectedCategory
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
              : 'glass text-slate-400 hover:text-white'
          )}
        >
          Wszystkie ({getVocabularyByLanguage(language).length})
        </button>
        {categories.map(cat => {
          const count = getVocabularyByCategory(cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                selectedCategory === cat.id
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'glass text-slate-400 hover:text-white'
              )}
            >
              <span>{cat.emoji}</span>
              {cat.namePl} ({count})
            </button>
          )
        })}
      </div>

      {/* Words list */}
      <div className="space-y-2">
        {words.map((word, idx) => {
          const isLearned = !!progress[word.id]
          const isExpanded = expandedWord === word.id

          return (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.5) }}
            >
              <button
                onClick={() => setExpandedWord(isExpanded ? null : word.id)}
                className="w-full text-left glass rounded-xl p-4 card-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{word.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{word.word}</span>
                        {isLearned && (
                          <Check size={14} className="text-emerald-400" />
                        )}
                      </div>
                      <span className="text-sm text-slate-400">{word.translation}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs', getDifficultyColor(word.difficulty))}>
                      {getDifficultyLabel(word.difficulty)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        speak(word.word, word.language)
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-brand-300"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 pt-3 border-t border-white/5"
                  >
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-sm text-cyan-300 italic">
                        &ldquo;{word.exampleSentence}&rdquo;
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {word.exampleTranslation}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        speak(word.exampleSentence, word.language)
                      }}
                      className="mt-2 text-xs text-brand-400 flex items-center gap-1 hover:text-brand-300"
                    >
                      <Volume2 size={12} /> Posłuchaj zdania
                    </button>
                  </motion.div>
                )}
              </button>
            </motion.div>
          )
        })}

        {words.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nie znaleziono słów</p>
          </div>
        )}
      </div>
    </div>
  )
}
