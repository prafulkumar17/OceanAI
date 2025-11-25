import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText, MonitorPlay, Clock, Trash2, Search, ArrowUpRight, Sparkles, ArrowRight } from 'lucide-react'
import { projectApi } from '../services/api'
import { Project } from '../types/project'

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await projectApi.getProjects()
      setProjects(data)
    } catch (err) {
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault() // Prevent navigation
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectApi.deleteProject(id)
        setProjects(projects.filter(p => p.id !== id))
      } catch (err) {
        setError('Failed to delete project')
      }
    }
  }

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.topic.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-[#87CEEB] border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bento-card p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#87CEEB] opacity-5 blur-[100px] rounded-full group-hover:opacity-10 transition-opacity"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#87CEEB]/30 bg-[#87CEEB]/10 text-[#87CEEB] text-xs font-bold mb-4">
              <Sparkles className="w-3 h-3 mr-2" />
              DASHBOARD
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Your <span className="text-gradient-lime">Artifacts</span>
            </h1>
            <p className="text-gray-400 max-w-lg">
              Manage your generated documents. Create, refine, and export with neural precision.
            </p>
          </div>

          <Link
            to="/create"
            className="bg-[#87CEEB] text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#6BB6D6] hover:scale-105 transition-all shadow-[0_0_20px_rgba(135,206,235,0.2)] flex items-center group"
          >
            <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
            New Project
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search archives..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#87CEEB]/50 focus:ring-1 focus:ring-[#87CEEB]/50 transition-all"
        />
      </div>

      {/* Projects Grid */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}

      {/* Guest Mode Info */}
      {localStorage.getItem('is_guest') === 'true' && (
        <div className="bento-card p-6 bg-[#ff00ff]/5 border-[#ff00ff]/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#ff00ff]/10 border border-[#ff00ff]/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#ff00ff]" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Guest Mode</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                You're using OceanAI as a guest. Projects created in guest mode are temporary and won't be saved.
                Create an account to save your work and access it anytime.
              </p>
            </div>
          </div>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bento-card border-dashed border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No Artifacts Found</h3>
          <p className="text-gray-500 mb-8">The archives are empty. Initialize a new project.</p>
          <Link
            to="/create"
            className="inline-flex items-center text-[#87CEEB] hover:text-white font-bold transition-colors"
          >
            Create Project <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="bento-card p-6 group flex flex-col h-full hover:border-[#87CEEB]/30"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${project.document_type === 'docx'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-orange-500/10 text-orange-400'
                  }`}>
                  {project.document_type === 'docx' ? <FileText className="w-6 h-6" /> : <MonitorPlay className="w-6 h-6" />}
                </div>
                <button
                  onClick={(e) => handleDelete(e, project.id)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-[#87CEEB] transition-colors line-clamp-1">
                {project.title}
              </h3>

              <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">
                {project.topic}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center text-xs font-medium text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#87CEEB] group-hover:text-black transition-all">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
