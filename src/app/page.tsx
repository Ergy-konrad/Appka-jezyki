'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Layers,
  Brain,
  TrendingUp,
  Volume2,
  Flame,
  BookOpen,
  BookMarked,
  Bot,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: Layers,
    title: 'Fiszki z powtórkami',
    desc: 'Algorytm spaced repetition - powtarzasz wtedy, kiedy zaczynasz zapominać',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Brain,
    title: 'Interaktywne quizy',
    desc: 'Różne typy pytań, feedback w czasie rzeczywistym',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Bot,
    title: 'AI Tutor',
    desc: 'Osobisty nauczyciel AI - rozmowy, gramatyka, ćwiczenia',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: BookMarked,
    title: 'Darmowy słownik',
    desc: 'Definicje, wymowa, przykłady i synonimy - zero kosztów',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Volume2,
    title: 'Wymowa',
    desc: 'Słuchaj jak wymawiać słowa - wbudowany text-to-speech',
    color: 'from-emerald-500 to-green-600',
  },
  {
    icon: TrendingUp,
    title: 'Śledzenie postępu',
    desc: 'XP, poziomy, serie dni - motywacja do codziennej nauki',
    color: 'from-orange-500 to-red-600',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
}

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg overflow-hidden">
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white">
            L
          </div>
          <span className="text-xl font-bold gradient-text">LinguaApp</span>
        </div>
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-xl glass text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Zaloguj się
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-brand-300 mb-8">
            <Sparkles size={16} />
            Angielski B2 + Hiszpański od zera
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight">
            Naucz się
            <br />
            <span className="gradient-text">języków obcych</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Fiszki z inteligentnym algorytmem powtórek, quizy, wymowa
            i śledzenie postępu. Wszystko czego potrzebujesz w jednej appce.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              Zacznij naukę
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/vocabulary"
              className="px-8 py-4 rounded-2xl glass text-slate-300 font-bold text-lg hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <BookOpen size={20} />
              Przeglądaj słówka
            </Link>
          </div>
        </motion.div>

        {/* Language badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center gap-4 mt-12"
        >
          <div className="glass rounded-2xl px-6 py-3 flex items-center gap-3">
            <span className="text-3xl">🇬🇧</span>
            <div className="text-left">
              <p className="font-bold text-white">Angielski</p>
              <p className="text-xs text-slate-400">Poziom B2 - 160 słów + OZE</p>
            </div>
          </div>
          <div className="glass rounded-2xl px-6 py-3 flex items-center gap-3">
            <span className="text-3xl">🇪🇸</span>
            <div className="text-left">
              <p className="font-bold text-white">Hiszpański</p>
              <p className="text-xs text-slate-400">Od zera - 150 słów</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Wszystko, czego potrzebujesz
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="glass rounded-2xl p-6 card-hover glow-hover"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 text-center glow"
        >
          <Flame size={48} className="text-orange-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">
            Gotowy na wyzwanie?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Zacznij dzisiaj i zbuduj serię codziennej nauki.
            Wystarczy 5 minut dziennie!
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg hover:scale-105 transition-transform"
          >
            Zaczynam! <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-slate-600">
        LinguaApp &copy; 2025 &mdash; Zbudowane z pasją do nauki języków
      </footer>
    </div>
  )
}
