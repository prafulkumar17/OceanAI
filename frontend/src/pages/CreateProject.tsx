import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, MonitorPlay, ArrowRight, Loader, AlertTriangle, Sparkles } from 'lucide-react'
import { projectApi } from '../services/api'

export default function CreateProject() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [documentType, setDocumentType] = useState<'docx' | 'pptx'>('docx')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const project = await projectApi.createProject({
        title,
        topic,
        document_type: documentType,
      })
      navigate(`/projects/${project.id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bento-card p-8 md:p-12 relative overflow-hidden">
        {/* Decorative Header */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ffff] opacity-5 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="mb-10 text-center relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#00ffff]/30 bg-[#00ffff]/10 text-[#00ffff] text-xs font-bold mb-4">
            <Sparkles className="w-3 h-3 mr-2" />
            NEW ARTIFACT
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Initiate <span className="text-gradient-cyan">Protocol</span>
          </h1>
          <p className="text-gray-400">
            Define parameters for your new document generation.
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">
                Project Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffff]/50 focus:ring-1 focus:ring-[#00ffff]/50 transition-all"
                placeholder="Enter title..."
              />
            </div>

            {/* Topic Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">
                Description
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ccff00]/50 focus:ring-1 focus:ring-[#ccff00]/50 transition-all"
                placeholder="Enter topic..."
              />
            </div>
          </div>

          {/* Document Type Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider text-center">
              Select Format
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setDocumentType('docx')}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 ${documentType === 'docx'
                    ? 'bg-[#00ffff]/10 border-[#00ffff]/50 shadow-[0_0_30px_-10px_rgba(0,255,255,0.3)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
              >
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                  {documentType === 'docx' && <div className="w-3 h-3 bg-[#00ffff] rounded-full shadow-[0_0_10px_#00ffff]" />}
                </div>
                <FileText className={`h-12 w-12 mb-4 mx-auto transition-colors ${documentType === 'docx' ? 'text-[#00ffff]' : 'text-gray-500'}`} />
                <h3 className="text-xl font-bold mb-1 text-white">Word Document</h3>
                <p className="text-sm text-gray-500">
                  Standard text-based report format.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDocumentType('pptx')}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 ${documentType === 'pptx'
                    ? 'bg-[#ff00ff]/10 border-[#ff00ff]/50 shadow-[0_0_30px_-10px_rgba(255,0,255,0.3)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
              >
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                  {documentType === 'pptx' && <div className="w-3 h-3 bg-[#ff00ff] rounded-full shadow-[0_0_10px_#ff00ff]" />}
                </div>
                <MonitorPlay className={`h-12 w-12 mb-4 mx-auto transition-colors ${documentType === 'pptx' ? 'text-[#ff00ff]' : 'text-gray-500'}`} />
                <h3 className="text-xl font-bold mb-1 text-white">PowerPoint</h3>
                <p className="text-sm text-gray-500">
                  Presentation slides with visual layout.
                </p>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center group"
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-3 h-5 w-5" />
                Processing...
              </>
            ) : (
              <>
                Launch Project
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
