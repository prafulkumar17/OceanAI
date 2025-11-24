import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, AlertTriangle, Sparkles } from 'lucide-react'
import { authApi } from '../services/api'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await authApi.login(email, password)
      } else {
        await authApi.register(email, password, fullName)
      }
      navigate('/projects')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await authApi.guestLogin()
      navigate('/create')
    } catch (err: any) {
      setError('Failed to login as guest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="bg-mesh"></div>
      <div className="bg-noise"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#87CEEB] opacity-5 blur-[100px] rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#00ffff] opacity-5 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-md w-full relative z-10">
        {/* Main Card */}
        <div className="bento-card p-8 border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#87CEEB] rounded-xl mb-4 shadow-[0_0_20px_rgba(135,206,235,0.3)]">
              <span className="font-bold text-black text-2xl">O</span>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white">
              {isLogin ? 'Welcome Back' : 'Join OceanAI'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Enter your credentials to access your workspace.' : 'Create your account to start generating.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center text-sm">
              <AlertTriangle className="h-4 w-4 mr-3 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#87CEEB]/50 focus:ring-1 focus:ring-[#87CEEB]/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#87CEEB]/50 focus:ring-1 focus:ring-[#87CEEB]/50 transition-all"
                placeholder="user@oceanai.app"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#87CEEB]/50 focus:ring-1 focus:ring-[#87CEEB]/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#87CEEB] text-black py-3 rounded-xl font-bold hover:bg-[#6BB6D6] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(135,206,235,0.2)] hover:shadow-[0_0_30px_rgba(135,206,235,0.4)] group"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Sparkles className="animate-spin mr-2 h-4 w-4" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  {isLogin ? 'Enter System' : 'Create Account'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* Guest Login */}
          {isLogin && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/40 px-2 text-gray-500">Or</span>
                </div>
              </div>
              <button
                onClick={handleGuestLogin}
                disabled={loading}
                className="mt-6 w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Try as Guest
              </button>
            </div>
          )}

          {/* Toggle */}
          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-400 hover:text-[#87CEEB] transition-colors"
            >
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
