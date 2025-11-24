import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import { LogIn, Mail, Lock, Sparkles, Zap } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setRegistrationSuccess(false)

    try {
      if (isLogin) {
        await authApi.login(email, password)
        navigate('/projects')
      } else {
        await authApi.register(email, password, fullName)
        setRegistrationSuccess(true)
        setIsLogin(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (login: boolean) => {
    setIsLogin(login)
    setError(null)
    setRegistrationSuccess(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNTllMGIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yNCAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHpNMTIgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full opacity-60 animate-float"></div>
        <div className="particle absolute top-1/3 right-1/4 w-1 h-1 bg-orange-400 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="particle absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-red-400 rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="particle absolute top-2/3 right-1/3 w-2 h-2 bg-amber-300 rounded-full opacity-30 animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full relative z-10 animate-fadeIn">
        {/* Glass Card */}
        <div className="glass-card p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Sparkles className="h-12 w-12 text-amber-500 animate-pulse-glow" />
                <Zap className="h-6 w-6 text-red-500 absolute -top-1 -right-1 animate-float" />
              </div>
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-2 animate-slideUp">
              OceanAI
            </h1>
            <p className="text-amber-200 text-sm font-light tracking-wide">
              Welcome to the Future of Document Generation
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex mb-6 bg-neutral-900/50 rounded-xl p-1.5 backdrop-blur-sm border border-amber-900/30">
            <button
              type="button"
              onClick={() => handleTabChange(true)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin
                ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-lg shadow-amber-500/30'
                : 'text-amber-400/60 hover:text-white'
                }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleTabChange(false)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin
                ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-lg shadow-amber-500/30'
                : 'text-amber-400/60 hover:text-white'
                }`}
            >
              Register
            </button>
          </div>

          {/* Success Message */}
          {registrationSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm animate-slideUp">
              <p className="text-sm text-emerald-300 text-center font-medium">
                ✨ Registration successful! You can now log in.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-slideUp">
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm animate-slideUp">
                <p className="text-sm text-red-300 text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-button text-white py-3.5 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="spinner h-5 w-5"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>{isLogin ? 'Login' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500">
              Powered by AI • Secured with OAuth 2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
