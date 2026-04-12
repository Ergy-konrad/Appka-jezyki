'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Volume2, ChevronDown, ChevronUp, Eye, EyeOff, MessageSquare, Clock, ArrowLeft, Check } from 'lucide-react'
import LanguageSelector from '@/components/LanguageSelector'
import { Language } from '@/types'
import { readings, getReadingsByLanguage, ReadingArticle } from '@/data/readings'
import { cn } from '@/lib/utils'

export default function ReadingPage() {
  const [language, setLanguage] = useState<Language>('en')
  const [selectedArticle, setSelectedArticle] = useState<ReadingArticle | null>(null)
  const [showTranslations, setShowTranslations] = useState<Record<number, boolean>>({})
  const [showAllTranslations, setShowAllTranslations] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({})
  const [showVocab, setShowVocab] = useState(false)

  const articles = getReadingsByLanguage(language)

  const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang === 'en' ? 'en-US' : 'es-ES'
      u.rate = 0.85
      speechSynthesis.speak(u)
    }
  }

  const toggleParagraphTranslation = (idx: number) => {
    setShowTranslations(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  if (selectedArticle) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button onClick={() => { setSelectedArticle(null); setShowTranslations({}); setAnsweredQuestions({}); setShowAllTranslations(false) }}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-3 transition-colors">
            <ArrowLeft size={16} /> Wszystkie artykuly
          </button>
          <div className="flex items-start gap-3">
            <span className="text-4xl">{selectedArticle.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{selectedArticle.title}</h1>
              <p className="text-slate-400 text-sm">{selectedArticle.titlePl}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">{selectedArticle.level}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 flex items-center gap-1"><Clock size={10} /> {selectedArticle.readingTime} min</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">{selectedArticle.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowAllTranslations(!showAllTranslations)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-slate-300 hover:text-white transition-colors">
            {showAllTranslations ? <EyeOff size={14} /> : <Eye size={14} />}
            {showAllTranslations ? 'Ukryj tlumaczenia' : 'Pokaz tlumaczenia'}
          </button>
          <button onClick={() => speak(selectedArticle.paragraphs.map(p => p.text).join('. '), selectedArticle.language)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-brand-300 hover:text-brand-200 transition-colors">
            <Volume2 size={14} /> Przeczytaj calosc
          </button>
        </div>

        {/* Paragraphs */}
        <div className="space-y-4">
          {selectedArticle.paragraphs.map((p, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-5">
              <div className="flex items-start gap-2">
                <p className="text-white leading-relaxed flex-1">{p.text}</p>
                <button onClick={() => speak(p.text, selectedArticle.language)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-brand-300 flex-shrink-0">
                  <Volume2 size={16} />
                </button>
              </div>
              {(showAllTranslations || showTranslations[idx]) && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="text-sm text-slate-400 italic mt-3 pt-3 border-t border-white/5 leading-relaxed">
                  {p.translationPl}
                </motion.p>
              )}
              {!showAllTranslations && (
                <button onClick={() => toggleParagraphTranslation(idx)}
                  className="text-xs text-slate-500 hover:text-slate-300 mt-2 flex items-center gap-1 transition-colors">
                  {showTranslations[idx] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showTranslations[idx] ? 'Ukryj' : 'Pokaz'} tlumaczenie
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Vocabulary */}
        <div className="glass rounded-2xl p-5">
          <button onClick={() => setShowVocab(!showVocab)}
            className="flex items-center justify-between w-full text-left">
            <h3 className="font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-400" /> Slownictwo z tekstu ({selectedArticle.vocabulary.length})
            </h3>
            {showVocab ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </button>
          {showVocab && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-2">
              {selectedArticle.vocabulary.map((v, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <button onClick={() => speak(v.word, selectedArticle.language)} className="text-brand-300 hover:text-brand-200">
                      <Volume2 size={14} />
                    </button>
                    <span className="font-medium text-white">{v.word}</span>
                  </div>
                  <span className="text-sm text-slate-400">{v.translation}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Comprehension questions */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-cyan-400" /> Pytania do tekstu
          </h3>
          {selectedArticle.questions.map((q, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-white font-medium mb-1">{q.question}</p>
              <p className="text-xs text-slate-500 mb-3">{q.questionPl}</p>
              {answeredQuestions[idx] ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-emerald-300">{q.answer}</p>
                </motion.div>
              ) : (
                <button onClick={() => setAnsweredQuestions(prev => ({ ...prev, [idx]: true }))}
                  className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                  Pokaz odpowiedz
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-rose-400" /> Czytanki
          </h1>
          <p className="text-slate-400 mt-1">Czytaj artykuly z tlumaczeniem, slownictwem i pytaniami</p>
        </div>
        <LanguageSelector selected={language} onChange={setLanguage} />
      </div>

      {/* Tip */}
      <div className="glass rounded-2xl p-5 border-l-4 border-rose-500">
        <p className="text-sm text-slate-300">
          <strong className="text-rose-400">Jak czytac skutecznie:</strong> Najpierw przeczytaj calosc bez tlumaczenia.
          Potem klikaj na paragrafy, ktorych nie rozumiesz. Na koncu odpowiedz na pytania.
          Sluchaj wymowy klikajac ikone glosnika.
        </p>
      </div>

      {/* Article list */}
      <div className="space-y-3">
        {articles.map((article, idx) => (
          <motion.button key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedArticle(article)}
            className="w-full text-left glass rounded-2xl p-5 card-hover glow-hover group">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{article.emoji}</span>
              <div className="flex-1">
                <h3 className="font-bold text-white group-hover:text-brand-300 transition-colors">{article.title}</h3>
                <p className="text-sm text-slate-400">{article.titlePl}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">{article.level}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 flex items-center gap-1"><Clock size={10} /> {article.readingTime} min</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">{article.category}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">{article.vocabulary.length} slow</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}

        {articles.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
            <p>Brak artykulow dla tego jezyka</p>
          </div>
        )}
      </div>
    </div>
  )
}
