'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, User, Loader2, Sparkles, Lightbulb, MessageCircle, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  { icon: MessageCircle, label: 'Rozmowa po angielsku', prompt: 'Zacznijmy prostą rozmowę po angielsku na poziomie B2. Ty zaczynasz!' },
  { icon: MessageCircle, label: 'Rozmowa po hiszpansku', prompt: 'Zacznijmy prostą rozmowę po hiszpańsku. Jestem kompletnym początkującym - używaj prostych słów i tłumacz je na polski.' },
  { icon: Lightbulb, label: 'Wyjasnij gramatyke', prompt: 'Wyjaśnij mi różnicę między Present Perfect a Past Simple po angielsku. Podaj przykłady.' },
  { icon: BookOpen, label: 'Hiszpanski od zera', prompt: 'Naucz mnie podstawowych zwrotów po hiszpańsku, których potrzebuję na wakacjach. Zacznij od najważniejszych.' },
  { icon: Sparkles, label: 'Wygeneruj cwiczenia', prompt: 'Wygeneruj 5 ćwiczeń z angielskich phrasal verbs na poziomie B2. Daj zdania do uzupełnienia.' },
  { icon: Sparkles, label: 'Idiomy angielskie', prompt: 'Naucz mnie 5 popularnych angielskich idiomów, których mogę używać na co dzień. Wyjaśnij znaczenie i podaj przykłady.' },
]

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: messageText }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 503) {
          setError(data.message || 'AI nie jest skonfigurowane. Dodaj GROQ_API_KEY.')
        } else {
          setError('Blad AI. Sprobuj ponownie.')
        }
        return
      }

      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    } catch {
      setError('Brak polaczenia z serwerem.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] lg:h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Bot className="text-violet-400" />
          AI Tutor
        </h1>
        <p className="text-slate-400 mt-1">
          Twoj osobisty nauczyciel AI - rozmowy, gramatyka, cwiczenia
        </p>
      </div>

      {/* Chat area */}
      <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <Bot size={32} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Czesc! Jestem Twoj AI Tutor
                </h2>
                <p className="text-slate-400 text-sm max-w-md">
                  Moge uczyc angielskiego i hiszpanskiego, wyjasnic gramatyke,
                  prowadzic konwersacje i generowac cwiczenia.
                </p>
              </motion.div>

              {/* Quick prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => sendMessage(prompt.prompt)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-white/5 text-left hover:bg-white/5 hover:border-brand-500/20 transition-all text-sm"
                  >
                    <prompt.icon size={16} className="text-brand-400 flex-shrink-0" />
                    <span className="text-slate-300">{prompt.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex gap-3',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-brand-500/20 text-white border border-brand-500/20'
                      : 'bg-slate-800/80 text-slate-200 border border-white/5'
                  )}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={16} className="text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 items-start"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-slate-800/80 rounded-2xl px-4 py-3 border border-white/5">
                <Loader2 size={18} className="animate-spin text-brand-400" />
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-4 border-l-4 border-amber-500 text-sm"
            >
              <p className="text-amber-300 font-medium mb-1">Uwaga</p>
              <p className="text-slate-400">{error}</p>
              {error.includes('GROQ_API_KEY') && (
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <p>Aby wlaczyc AI Tutora:</p>
                  <p>1. Wejdz na console.groq.com i zaloz darmowe konto</p>
                  <p>2. Skopiuj API Key</p>
                  <p>3. Dodaj GROQ_API_KEY do zmiennych w Vercel</p>
                </div>
              )}
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-white/5">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Napisz wiadomosc... (Enter = wyslij, Shift+Enter = nowa linia)"
              rows={1}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-colors resize-none"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="px-4 py-3 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
