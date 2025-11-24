import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectApi } from '../services/api'
import { Project } from '../types/project'
import { FileText, Presentation, Plus, Loader } from 'lucide-react'

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">My Projects</h2>
        <Link
          to="/projects/new"
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Create your first project to get started</p>
          <Link
            to="/projects/new"
            className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {project.document_type === 'docx' ? (
                      <FileText className="h-5 w-5 text-primary-600" />
                    ) : (
                      <Presentation className="h-5 w-5 text-primary-600" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.title}
                    </h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      {project.document_type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{project.topic}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>Created {formatDate(project.created_at)}</span>
                    {project.generated_content && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-green-600 font-medium">Content Generated</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

