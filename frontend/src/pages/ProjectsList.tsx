import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectApi } from '../services/api'
import { Project } from '../types/project'
import { FileText, Presentation, Plus, Loader, Sparkles, Zap, TrendingUp } from 'lucide-react'

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await projectApi.getProjects()
      setProjects(data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const stats = {
    total: projects.length,
    generated: projects.filter(p => p.generated_content).length,
    thisMonth: projects.filter(p => {
      const projectDate = new Date(p.created_at)
      const now = new Date()
      return projectDate.getMonth() === now.getMonth() &&
        projectDate.getFullYear() === now.getFullYear()
    }).length
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3 animate-slideUp">
          Welcome Back! 🚀
        </h1>
        <p className="text-slate-400 text-lg">
          Create amazing documents with the power of AI
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Projects */}
        <div className="glass-card p-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.total}</h3>
          <p className="text-slate-400 text-sm">Total Projects</p>
        </div>

        {/* This Month */}
        <div className="glass-card p-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-xs text-purple-400 font-semibold">THIS MONTH</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.thisMonth}</h3>
          <p className="text-slate-400 text-sm">New This Month</p>
        </div>

        {/* Generated */}
        <div className="glass-card p-6 animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <Zap className="h-6 w-6 text-cyan-400" />
            </div>
            <span className="text-xs text-emerald-400 font-semibold">COMPLETED</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.generated}</h3>
          <p className="text-slate-400 text-sm">Content Generated</p>
        </div>
      </div>

      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Your Projects</h2>
        <Link
          to="/projects/new"
          className="gradient-button flex items-center px-6 py-3 rounded-xl font-semibold text-white"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Project
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm animate-slideUp">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center animate-slideUp">
          <div className="max-w-md mx-auto">
            <div className="mb-6 relative">
              <FileText className="h-20 w-20 text-slate-600 mx-auto animate-float" />
              <Sparkles className="h-8 w-8 text-blue-400 absolute top-0 right-1/3 animate-pulse-glow" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No projects yet</h3>
            <p className="text-slate-400 mb-6">
              Start your journey by creating your first AI-powered document
            </p>
            <Link
              to="/projects/new"
              className="gradient-button inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="glass-card p-6 group animate-slideUp"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Document Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {project.document_type === 'docx' ? (
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-400" />
                    </div>
                  ) : (
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Presentation className="h-5 w-5 text-purple-400" />
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.document_type === 'docx'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-purple-500/20 text-purple-300'
                    }`}>
                    {project.document_type.toUpperCase()}
                  </span>
                </div>
                {project.generated_content && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-glow"></div>
                    <span className="text-xs text-emerald-400 font-medium">Ready</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {project.title}
              </h3>

              {/* Topic */}
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {project.topic}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className="text-xs text-slate-500">
                  {formatDate(project.created_at)}
                </span>
                <div className="flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
