'use client'

import { Language } from '@/types'
import { cn, getLanguageFlag, getLanguageName } from '@/lib/utils'

interface LanguageSelectorProps {
  selected: Language
  onChange: (lang: Language) => void
}

export default function LanguageSelector({ selected, onChange }: LanguageSelectorProps) {
  const languages: Language[] = ['en', 'es']

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            selected === lang
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
              : 'glass text-slate-400 hover:text-slate-200 hover:bg-white/5'
          )}
        >
          <span className="text-lg">{getLanguageFlag(lang)}</span>
          {getLanguageName(lang)}
        </button>
      ))}
    </div>
  )
}
