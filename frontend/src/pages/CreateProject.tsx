import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectApi } from '../services/api'
import { FileText, Presentation, ArrowLeft, Sparkles, Zap } from 'lucide-react'

type DocumentType = 'docx' | 'pptx'

export default function CreateProject() {
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [documentType, setDocumentType] = useState<DocumentType>('docx')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const project = await projectApi.createProject({
        title,
        topic,
        document_type: documentType
      })
      navigate(`/projects/${project.id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-10 w-10 text-blue-400 animate-pulse-glow" />
        </div>
        <h2 className="text-4xl font-bold gradient-text mb-3">
          Create New Project
        </h2>
        <p className="text-slate-400">
          Let AI generate amazing content for you
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        {/* Project Title */}
        <div className="animate-slideUp">
          <label className="block text-sm font-semibold text-blue-200 mb-3">
            Project Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="e.g., Marketing Strategy 2024"
          />
        </div>

        {/* Description */}
        <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <label className="block text-sm font-semibold text-blue-200 mb-3">
            Description / Topic
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
            placeholder="Describe what you want the document to be about... Be as detailed as possible for better results!"
          />
        </div>

        {/* Document Type */}
        <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <label className="block text-sm font-semibold text-blue-200 mb-4">
            Document Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Word Document */}
            <button
              type="button"
              onClick={() => setDocumentType('docx')}
              className={`group relative p-6 rounded-xl transition-all duration-300 ${documentType === 'docx'
                  ? 'bg-gradient-to-br from-blue-600/20 to-blue-500/10 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800/30 border-2 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50'
                }`}
            >
              <div className={`absolute top-3 right-3 w-3 h-3 rounded-full transition-all ${documentType === 'docx' ? 'bg-blue-400 animate-pulse-glow' : 'bg-slate-600'
                }`}></div>
              <FileText className={`h-12 w-12 mx-auto mb-3 transition-colors ${documentType === 'docx' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'
                }`} />
              <div className={`font-bold text-lg mb-1 ${documentType === 'docx' ? 'text-white' : 'text-slate-300'
                }`}>
                Word Document
              </div>
              <div className="text-sm text-slate-400">
                3-5 detailed sections
              </div>
            </button>

            {/* PowerPoint */}
            <button
              type="button"
              onClick={() => setDocumentType('pptx')}
              className={`group relative p-6 rounded-xl transition-all duration-300 ${documentType === 'pptx'
                  ? 'bg-gradient-to-br from-purple-600/20 to-purple-500/10 border-2 border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'bg-slate-800/30 border-2 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50'
                }`}
            >
              <div className={`absolute top-3 right-3 w-3 h-3 rounded-full transition-all ${documentType === 'pptx' ? 'bg-purple-400 animate-pulse-glow' : 'bg-slate-600'
                }`}></div>
              <Presentation className={`h-12 w-12 mx-auto mb-3 transition-colors ${documentType === 'pptx' ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-400'
                }`} />
              <div className={`font-bold text-lg mb-1 ${documentType === 'pptx' ? 'text-white' : 'text-slate-300'
                }`}>
                PowerPoint
              </div>
              <div className="text-sm text-slate-400">
                5 professional slides
              </div>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm animate-slideUp">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-button text-white py-4 px-6 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-8"
        >
          {loading ? (
            <>
              <div className="spinner h-5 w-5"></div>
              <span>Creating Project...</span>
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              <span>Create Project</span>
            </>
          )}
        </button>

        {/* Info Text */}
        <p className="text-center text-xs text-slate-500 mt-4">
          Your document will be generated using advanced AI technology
        </p>
      </form>
    </div>
  )
}
