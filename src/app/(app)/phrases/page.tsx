'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Volume2, ChevronRight, ArrowLeft, Copy, Check } from 'lucide-react'
import LanguageSelector from '@/components/LanguageSelector'
import { Language } from '@/types'
import { getPhraseCategoriesByLanguage, getPhrasesByCategory, PhraseCategory, Phrase } from '@/data/phrases'
import { cn } from '@/lib/utils'

export default function PhrasesPage() {
  const [language, setLanguage] = useState<Language>('en')
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [practiceMode, setPracticeMode] = useState(false)
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())

  const categories = getPhraseCategoriesByLanguage(language)

  const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang === 'en' ? 'en-US' : 'es-ES'
      u.rate = 0.85
      speechSynthesis.speak(u)
    }
  }

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (selectedCategory) {
    const phrasesInCategory = getPhrasesByCategory(selectedCategory.id)

    return (
      <div className="space-y-6">
        <div>
          <button onClick={() => { setSelectedCategory(null); setRevealedIds(new Set()); setPracticeMode(false) }}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-3 transition-colors">
            <ArrowLeft size={16} /> Wszystkie kategorie
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedCategory.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{selectedCategory.name}</h1>
              <p className="text-slate-400 text-sm">{selectedCategory.description}</p>
            </div>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          <button onClick={() => { setPracticeMode(false); setRevealedIds(new Set()) }}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all',
              !practiceMode ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'glass text-slate-400')}>
            Przegladaj
          </button>
          <button onClick={() => { setPracticeMode(true); setRevealedIds(new Set()) }}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all',
              practiceMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'glass text-slate-400')}>
            Cwicz (ukryte tlumaczenie)
          </button>
        </div>

        {/* Phrases */}
        <div className="space-y-2">
          {phrasesInCategory.map((phrase, idx) => (
            <motion.div key={phrase.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.3) }}
              className="glass rounded-xl p-4 card-hover"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-white font-medium">{phrase.phrase}</p>

                  {practiceMode ? (
                    <button onClick={() => toggleReveal(phrase.id)}
                      className="text-sm mt-1 text-brand-400 hover:text-brand-300 transition-colors">
                      {revealedIds.has(phrase.id) ? (
                        <span className="text-slate-400">{phrase.translation}</span>
                      ) : (
                        'Pokaz tlumaczenie'
                      )}
                    </button>
                  ) : (
                    <p className="text-sm text-slate-400 mt-1">{phrase.translation}</p>
                  )}

                  {phrase.context && (
                    <span className="inline-block text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-500 mt-2">
                      {phrase.context}
                    </span>
                  )}
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => speak(phrase.phrase, phrase.language)}
                    className="p-2 rounded-lg hover:bg-white/10 text-brand-300 transition-colors">
                    <Volume2 size={16} />
                  </button>
                  <button onClick={() => copy(phrase.phrase, phrase.id)}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
                    {copiedId === phrase.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Practice all button */}
        <button onClick={() => {
          const allPhrases = phrasesInCategory.map(p => p.phrase).join('. ')
          speak(allPhrases, language)
        }} className="w-full py-3 rounded-xl glass text-brand-300 font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
          <Volume2 size={18} /> Odczytaj wszystkie zdania
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageCircle className="text-pink-400" /> Zdania i zwroty
          </h1>
          <p className="text-slate-400 mt-1">Gotowe zdania na kazda sytuacje - ucz sie calych zwrotow!</p>
        </div>
        <LanguageSelector selected={language} onChange={(l) => { setLanguage(l); setSelectedCategory(null) }} />
      </div>

      {/* Tip */}
      <div className="glass rounded-2xl p-5 border-l-4 border-pink-500">
        <p className="text-sm text-slate-300">
          <strong className="text-pink-400">Dlaczego uczyc sie calych zdan?</strong> Mozg lepiej zapamietuje
          slowa w kontekscie niz pojedynczo. Ucz sie zwrotow, nie slowek — bedziesz mowic naturalnie
          od pierwszego dnia. Klikaj glosnik i powtarzaj na glos!
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {categories.map((cat, idx) => {
          const count = getPhrasesByCategory(cat.id).length
          return (
            <motion.button key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedCategory(cat)}
              className="w-full text-left glass rounded-2xl p-5 card-hover glow-hover group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{cat.emoji}</span>
                <div>
                  <h3 className="font-bold text-white group-hover:text-brand-300 transition-colors">{cat.name}</h3>
                  <p className="text-sm text-slate-400">{cat.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">{count} zwrotow</span>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
