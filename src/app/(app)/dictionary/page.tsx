'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Volume2, BookOpen, ExternalLink, Loader2 } from 'lucide-react'

interface DictionaryEntry {
  word: string
  phonetic?: string
  phonetics?: { text?: string; audio?: string }[]
  meanings?: {
    partOfSpeech: string
    definitions: {
      definition: string
      example?: string
      synonyms?: string[]
    }[]
    synonyms?: string[]
  }[]
  sourceUrls?: string[]
}

export default function DictionaryPage() {
  const [query, setQuery] = useState('')
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lang, setLang] = useState<'en' | 'es'>('en')

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setEntries([])

    try {
      const res = await fetch(`/api/dictionary?word=${encodeURIComponent(query.trim())}&lang=${lang}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError(`Nie znaleziono slowa "${query}" w slowniku.`)
        } else {
          setError('Blad podczas wyszukiwania. Sprobuj ponownie.')
        }
        return
      }
      const data = await res.json()
      setEntries(data)
    } catch {
      setError('Brak polaczenia z serwerem.')
    } finally {
      setLoading(false)
    }
  }

  const playAudio = (url: string) => {
    const audio = new Audio(url)
    audio.play()
  }

  const speak = (text: string) => {
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
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BookOpen className="text-amber-400" />
          Slownik
        </h1>
        <p className="text-slate-400 mt-1">
          Darmowy slownik angielski i hiszpanski - definicje, wymowa, przyklady
        </p>
      </div>

      {/* Search */}
      <div className="glass rounded-2xl p-6 space-y-4">
        {/* Language toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setLang('en')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              lang === 'en'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>🇬🇧</span> Angielski
          </button>
          <button
            onClick={() => setLang('es')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              lang === 'es'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>🇪🇸</span> Hiszpanski
          </button>
        </div>

        {/* Search input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            search()
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === 'en' ? 'Wpisz angielskie slowo...' : 'Wpisz hiszpanskie slowo...'}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800/80 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Szukaj
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 border-l-4 border-amber-500 text-slate-300"
        >
          {error}
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {entries.map((entry, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl p-6 space-y-4"
          >
            {/* Word header */}
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-white">{entry.word}</h2>
              {entry.phonetic && (
                <span className="text-slate-400 text-lg">{entry.phonetic}</span>
              )}
              <div className="flex gap-2">
                {entry.phonetics?.filter(p => p.audio).map((p, i) => (
                  <button
                    key={i}
                    onClick={() => playAudio(p.audio!)}
                    className="p-2 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors"
                    title="Odtwórz wymowę"
                  >
                    <Volume2 size={18} />
                  </button>
                ))}
                <button
                  onClick={() => speak(entry.word)}
                  className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                  title="Text-to-speech"
                >
                  <Volume2 size={18} />
                </button>
              </div>
            </div>

            {/* Meanings */}
            {entry.meanings?.map((meaning, mIdx) => (
              <div key={mIdx} className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                  {meaning.partOfSpeech}
                </span>

                <ol className="space-y-3 ml-4">
                  {meaning.definitions.slice(0, 5).map((def, dIdx) => (
                    <li key={dIdx} className="text-slate-200">
                      <p>
                        <span className="text-slate-500 mr-2">{dIdx + 1}.</span>
                        {def.definition}
                      </p>
                      {def.example && (
                        <p className="text-sm text-cyan-300/80 italic mt-1 ml-5">
                          &ldquo;{def.example}&rdquo;
                        </p>
                      )}
                      {def.synonyms && def.synonyms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 ml-5">
                          {def.synonyms.slice(0, 5).map((syn, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => {
                                setQuery(syn)
                                search()
                              }}
                              className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            >
                              {syn}
                            </button>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>

                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <div className="ml-4 mt-2">
                    <span className="text-xs text-slate-500">Synonimy: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {meaning.synonyms.slice(0, 8).map((syn, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => {
                            setQuery(syn)
                            setTimeout(search, 100)
                          }}
                          className="text-xs px-2 py-1 rounded bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 transition-colors"
                        >
                          {syn}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Source */}
            {entry.sourceUrls && entry.sourceUrls.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <a
                  href={entry.sourceUrls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink size={12} /> Zrodlo
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Empty state */}
      {!loading && entries.length === 0 && !error && (
        <div className="text-center py-16">
          <BookOpen size={64} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-500 text-lg">Wpisz slowo, aby wyszukac definicje</p>
          <p className="text-slate-600 text-sm mt-2">
            Darmowy slownik z wymowa, przykladami i synonimami
          </p>
        </div>
      )}
    </div>
  )
}
