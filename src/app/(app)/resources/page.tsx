'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Library, ExternalLink, BookOpen, Headphones, Video, Globe, GraduationCap } from 'lucide-react'

interface Resource {
  name: string
  url: string
  description: string
  type: 'textbook' | 'audio' | 'video' | 'website' | 'app'
  language: 'en' | 'es' | 'both'
  level: string
  free: boolean
}

const resources: Resource[] = [
  // ─── English ───
  {
    name: 'BBC Learning English',
    url: 'https://www.bbc.co.uk/learningenglish',
    description: 'Najlepszy darmowy kurs angielskiego online. Filmy, podcasty, ćwiczenia gramatyczne. Idealne na B2.',
    type: 'website',
    language: 'en',
    level: 'B1-C1',
    free: true,
  },
  {
    name: 'British Council - LearnEnglish',
    url: 'https://learnenglish.britishcouncil.org',
    description: 'Oficjalne materiały British Council. Gramatyka, słownictwo, listening, reading - wszystko za darmo.',
    type: 'website',
    language: 'en',
    level: 'A1-C1',
    free: true,
  },
  {
    name: 'English Grammar in Use (Raymond Murphy)',
    url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/english-grammar-use-5th-edition',
    description: 'BIBLIA gramatyki angielskiej. Najlepsza książka do nauki gramatyki na świecie. Wersja Intermediate idealna na B2.',
    type: 'textbook',
    language: 'en',
    level: 'B1-B2',
    free: false,
  },
  {
    name: 'Podcast: 6 Minute English (BBC)',
    url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english',
    description: 'Krótkie 6-minutowe odcinki na różne tematy. Idealny listening practice na B2. Darmowy z transkrypcjami.',
    type: 'audio',
    language: 'en',
    level: 'B2',
    free: true,
  },
  {
    name: 'TED Talks',
    url: 'https://www.ted.com/talks',
    description: 'Najlepszy sposób na zaawansowany listening. Napisy w wielu językach. Różnorodne tematy.',
    type: 'video',
    language: 'en',
    level: 'B2-C1',
    free: true,
  },
  {
    name: 'YouGlish',
    url: 'https://youglish.com',
    description: 'Wpisz dowolne angielskie słowo i zobacz jak używa je natywny speaker w prawdziwym filmie YT. Genialny do wymowy.',
    type: 'website',
    language: 'en',
    level: 'A2-C2',
    free: true,
  },
  {
    name: 'Podcast: All Ears English',
    url: 'https://www.allearsenglish.com',
    description: 'Naturalny, codzienny angielski. Dwie Amerykanki rozmawiają o życiu. Super do osłuchania z akcentem.',
    type: 'audio',
    language: 'en',
    level: 'B1-B2',
    free: true,
  },
  {
    name: 'News in Levels',
    url: 'https://www.newsinlevels.com',
    description: 'Wiadomości ze świata w 3 poziomach trudności. Możesz czytać to samo na Level 1, 2 i 3.',
    type: 'website',
    language: 'en',
    level: 'A1-B2',
    free: true,
  },

  // ─── Spanish ───
  {
    name: 'SpanishDict',
    url: 'https://www.spanishdict.com',
    description: 'Najlepszy słownik hiszpański + darmowy kurs gramatyki. Tłumaczenia, koniugacja czasowników, lekcje.',
    type: 'website',
    language: 'es',
    level: 'A1-B2',
    free: true,
  },
  {
    name: 'Podcast: Coffee Break Spanish',
    url: 'https://coffeebreaklanguages.com/coffeebreakspanish/',
    description: 'Najlepszy podcast do nauki hiszpańskiego od zera. Krótkie lekcje, jasne tłumaczenia. Prowadzony po angielsku.',
    type: 'audio',
    language: 'es',
    level: 'A1-B1',
    free: true,
  },
  {
    name: 'Dreaming Spanish (YouTube)',
    url: 'https://www.dreamingspanish.com',
    description: 'Comprehensible input - słuchasz hiszpańskiego na swoim poziomie. Najskuteczniejsza metoda nauki. Superbeginner -> Advanced.',
    type: 'video',
    language: 'es',
    level: 'A0-B2',
    free: true,
  },
  {
    name: 'StudySpanish.com',
    url: 'https://studyspanish.com',
    description: 'Darmowe lekcje gramatyki hiszpańskiej od podstaw. Proste wyjaśnienia + ćwiczenia.',
    type: 'website',
    language: 'es',
    level: 'A1-B1',
    free: true,
  },
  {
    name: 'Language Transfer - Spanish',
    url: 'https://www.languagetransfer.org/complete-spanish',
    description: 'GENIALNE darmowe audio-lekcje. Uczy myśleć po hiszpańsku, nie tłumacząc. 90 lekcji od zera. Najlepsza darmowa metoda.',
    type: 'audio',
    language: 'es',
    level: 'A0-B1',
    free: true,
  },
  {
    name: 'Podcast: Notes in Spanish',
    url: 'https://www.notesinspanish.com',
    description: 'Para (on Anglik, ona Hiszpanka) rozmawiają po hiszpańsku. Różne poziomy od Beginner do Advanced.',
    type: 'audio',
    language: 'es',
    level: 'A2-C1',
    free: true,
  },
  {
    name: 'Conjuguemos',
    url: 'https://conjuguemos.com',
    description: 'Darmowe ćwiczenia z koniugacji hiszpańskich czasowników. Interaktywne, z wynikami.',
    type: 'website',
    language: 'es',
    level: 'A1-B2',
    free: true,
  },

  // ─── Both ───
  {
    name: 'Forvo',
    url: 'https://forvo.com',
    description: 'Wymowa dowolnego słowa nagrana przez native speakerów. Działa dla KAŻDEGO języka.',
    type: 'website',
    language: 'both',
    level: 'A1-C2',
    free: true,
  },
  {
    name: 'Clozemaster',
    url: 'https://www.clozemaster.com',
    description: 'Nauka słów w kontekście zdań. Gamifikacja + spaced repetition. Świetne uzupełnienie fiszek.',
    type: 'app',
    language: 'both',
    level: 'A2-C1',
    free: true,
  },
]

const typeIcons: Record<string, typeof BookOpen> = {
  textbook: BookOpen,
  audio: Headphones,
  video: Video,
  website: Globe,
  app: GraduationCap,
}

const typeLabels: Record<string, string> = {
  textbook: 'Podręcznik',
  audio: 'Podcast / Audio',
  video: 'Wideo',
  website: 'Strona WWW',
  app: 'Aplikacja',
}

export default function ResourcesPage() {
  const [filter, setFilter] = useState<'all' | 'en' | 'es'>('all')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  const filtered = resources.filter(r => {
    if (filter !== 'all' && r.language !== filter && r.language !== 'both') return false
    if (typeFilter && r.type !== typeFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Library className="text-amber-400" />
          Zasoby do nauki
        </h1>
        <p className="text-slate-400 mt-1">
          Najlepsze darmowe podręczniki, podcasty, filmy i strony do nauki języków.
          Osobiście wyselekcjonowane i przetestowane.
        </p>
      </div>

      {/* Tip */}
      <div className="glass rounded-2xl p-5 border-l-4 border-amber-500">
        <h3 className="font-bold text-white mb-1">Pro tip</h3>
        <p className="text-sm text-slate-400">
          Najskuteczniejsza strategia: <strong className="text-amber-300">fiszki + listening + czytanie</strong>.
          Ucz się słów w tej appce, słuchaj podcastów w drodze do pracy,
          i czytaj artykuły/oglądaj filmy wieczorem. 30 min dziennie = płynność w 6-12 miesięcy.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === 'all' ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          Wszystkie
        </button>
        <button
          onClick={() => setFilter('en')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${
            filter === 'en' ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          🇬🇧 Angielski
        </button>
        <button
          onClick={() => setFilter('es')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${
            filter === 'es' ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'glass text-slate-400 hover:text-white'
          }`}
        >
          🇪🇸 Hiszpański
        </button>
        <div className="w-px bg-white/10 mx-1" />
        {Object.entries(typeLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTypeFilter(typeFilter === key ? null : key)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              typeFilter === key ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'glass text-slate-500 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Resources list */}
      <div className="space-y-3">
        {filtered.map((resource, idx) => {
          const Icon = typeIcons[resource.type] || Globe
          return (
            <motion.a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.3) }}
              className="block glass rounded-xl p-5 card-hover glow-hover group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white group-hover:text-brand-300 transition-colors">
                      {resource.name}
                    </h3>
                    <ExternalLink size={14} className="text-slate-600 group-hover:text-brand-400 transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-2">{resource.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {resource.language === 'en' ? '🇬🇧 EN' : resource.language === 'es' ? '🇪🇸 ES' : '🌍 Oba'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {resource.level}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {typeLabels[resource.type]}
                    </span>
                    {resource.free && (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                        DARMOWE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.a>
          )
        })}
      </div>
    </div>
  )
}
