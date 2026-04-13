'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, WifiOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Wypełnij wszystkie pola.')
      return
    }

    setLoading(true)

    try {
      const { error: authError } = await supabase!.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Nieprawidłowy email lub hasło.')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Potwierdź swój adres email. Sprawdź skrzynkę pocztową.')
        } else {
          setError(authError.message)
        }
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Coś poszło nie tak. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
            L
          </div>
          <span className="text-2xl font-bold gradient-text">LinguaApp</span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 glow">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Witaj z powrotem!</h1>
            <p className="text-slate-400 text-sm">Zaloguj się, aby kontynuować naukę</p>
          </div>

          {/* Guest mode banner */}
          {!supabase && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <WifiOff size={20} className="text-amber-400 shrink-0" />
                <p className="text-sm text-amber-300 font-medium">
                  Tryb gościa - dane zapisywane lokalnie
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-[1.02]"
              >
                Przejdź do aplikacji
              </button>
            </motion.div>
          )}

          {/* Login form */}
          {supabase && (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <AlertCircle size={18} className="text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@email.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Hasło
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Twoje hasło"
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold hover:from-brand-600 hover:to-brand-700 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Zaloguj się
                  </>
                )}
              </button>
            </form>
          )}

          {/* Register link */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-slate-400">
              Nie masz konta?{' '}
              <Link
                href="/register"
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                Załóż konto
              </Link>
            </p>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-[rgba(30,30,60,0.6)] text-xs text-slate-500">lub</span></div>
            </div>

            <button
              onClick={() => {
                document.cookie = 'lingua_guest=true; path=/; max-age=31536000'
                router.push('/dashboard')
              }}
              className="w-full py-3 rounded-xl glass text-slate-300 font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Kontynuuj jako gość
            </button>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            Powrót na stronę główną
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
