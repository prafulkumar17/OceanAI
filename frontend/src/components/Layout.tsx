import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FileText, FolderKanban, LogOut, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNTllMGIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yNCAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHpNMTIgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 glass-card border-b border-amber-500/10 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-amber-500 animate-pulse-glow" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">OceanAI</h1>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <Link
                to="/projects"
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive('/projects')
                    ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-lg shadow-amber-500/30'
                    : 'text-amber-200 hover:text-white hover:bg-neutral-800/50'
                  }`}
              >
                <FolderKanban className="h-4 w-4 mr-2" />
                Projects
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-amber-200 hover:text-white hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {children}
      </main>
    </div>
  )
}
