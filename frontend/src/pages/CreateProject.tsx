import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectApi } from '../services/api'
import { FileText, Presentation, ArrowLeft } from 'lucide-react'

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
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </button>

      <h2 className="text-3xl font-bold text-gray-900 mb-6">Create New Project</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Marketing Strategy 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe what you want the document to be about..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Document Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDocumentType('docx')}
              className={`p-4 border-2 rounded-lg transition ${
                documentType === 'docx'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className="h-8 w-8 mx-auto mb-2 text-primary-600" />
              <div className="font-medium">Word Document</div>
              <div className="text-sm text-gray-500">3-5 sections</div>
            </button>
            <button
              type="button"
              onClick={() => setDocumentType('pptx')}
              className={`p-4 border-2 rounded-lg transition ${
                documentType === 'pptx'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Presentation className="h-8 w-8 mx-auto mb-2 text-primary-600" />
              <div className="font-medium">PowerPoint</div>
              <div className="text-sm text-gray-500">5 slides</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  )
}

