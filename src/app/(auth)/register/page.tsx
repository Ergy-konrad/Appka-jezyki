'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, UserPlus, Eye, EyeOff, AlertCircle, WifiOff, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const passwordChecks = [
    { label: 'Min. 6 znakow', valid: password.length >= 6 },
    { label: 'Hasla sa takie same', valid: password.length > 0 && password === confirmPassword },
  ]

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Wypelnij wszystkie pola.')
      return
    }

    if (password.length < 6) {
      setError('Haslo musi miec co najmniej 6 znakow.')
      return
    }

    if (password !== confirmPassword) {
      setError('Hasla nie sa takie same.')
      return
    }

    setLoading(true)

    try {
      const { error: authError } = await supabase!.auth.signUp({
        email: email.trim(),
        password,
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Ten email jest juz zarejestrowany. Sprobuj sie zalogowac.')
        } else if (authError.message.includes('valid email')) {
          setError('Podaj prawidlowy adres email.')
        } else {
          setError(authError.message)
        }
        return
      }

      setSuccess('Konto utworzone! Sprawdz skrzynke email, aby potwierdzic rejestracje.')

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch {
      setError('Cos poszlo nie tak. Sprobuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float-delayed" />
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
            <h1 className="text-2xl font-bold text-white mb-2">Stworz konto</h1>
            <p className="text-slate-400 text-sm">Dolacz i zacznij nauke jezykow</p>
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
                  Tryb goscia - dane zapisywane lokalnie
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-[1.02]"
              >
                Przejdz do aplikacji
              </button>
            </motion.div>
          )}

          {/* Register form */}
          {supabase && (
            <form onSubmit={handleRegister} className="space-y-5">
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

              {/* Success message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                >
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <p className="text-sm text-emerald-300">{success}</p>
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
                  Haslo
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 znakow"
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Powtorz haslo
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Powtorz haslo"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Password strength indicators */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1.5"
                >
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          check.valid
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-700/50 text-slate-500'
                        }`}
                      >
                        <CheckCircle2 size={12} />
                      </div>
                      <span
                        className={`text-xs ${
                          check.valid ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

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
                    <UserPlus size={18} />
                    Zaloz konto
                  </>
                )}
              </button>
            </form>
          )}

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Masz juz konto?{' '}
              <Link
                href="/login"
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                Zaloguj sie
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            Powrot na strone glowna
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
