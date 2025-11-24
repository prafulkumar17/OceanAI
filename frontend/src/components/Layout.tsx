import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Zap, LayoutGrid } from 'lucide-react'
import { authApi } from '../services/api'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    authApi.logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      {/* Background Effects */}
      <div className="bg-mesh"></div>
      <div className="bg-noise"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-[#87CEEB] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="font-bold text-black text-xl">O</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">OceanAI</h1>
              {localStorage.getItem('is_guest') === 'true' && (
                <span className="px-2 py-0.5 bg-[#ff00ff]/10 border border-[#ff00ff]/30 text-[#ff00ff] text-xs font-bold rounded-md">
                  GUEST
                </span>
              )}
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <Link
                to="/create"
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/create')
                  ? 'bg-[#87CEEB] text-black shadow-[0_0_15px_rgba(135,206,235,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Zap className="h-4 w-4 mr-2" />
                New Project
              </Link>
              <Link
                to="/projects"
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/projects')
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {children}
      </main>
    </div>
  )
}
