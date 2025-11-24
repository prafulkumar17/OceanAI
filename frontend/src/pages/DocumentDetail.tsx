import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { documentApi } from '../services/api'
import { Document } from '../types/document'
import {
  FileText,
  ArrowLeft,
  Loader,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [reanalyzing, setReanalyzing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadDocument(parseInt(id))
    }
  }, [id])

  const loadDocument = async (docId: number) => {
    try {
      setLoading(true)
      const data = await documentApi.getDocument(docId)
      setDocument(data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load document')
    } finally {
      setLoading(false)
    }
  }

  const handleReanalyze = async () => {
    if (!id) return
    try {
      setReanalyzing(true)
      const updated = await documentApi.reanalyzeDocument(parseInt(id))
      setDocument(updated)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to reanalyze document')
    } finally {
      setReanalyzing(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this document?')) return
    try {
      setDeleting(true)
      await documentApi.deleteDocument(parseInt(id))
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete document')
      setDeleting(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (error && !document) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          ← Back to Dashboard
        </button>
      </div>
    )
  }

  if (!document) {
    return <div>Document not found</div>
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <FileText className="h-10 w-10 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {document.original_filename}
                </h1>
                <div className="flex items-center space-x-4 text-primary-100 text-sm">
                  <span>{document.file_type.toUpperCase()}</span>
                  <span>•</span>
                  <span>{formatFileSize(document.file_size)}</span>
                  <span>•</span>
                  <span>Uploaded {formatDate(document.created_at)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(document.status)}
              <span className="text-white font-medium capitalize">{document.status}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleReanalyze}
            disabled={reanalyzing || document.status === 'processing'}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reanalyzing ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Re-analyze
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* AI Analysis Summary */}
          {document.ai_summary && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">AI Summary</h3>
              <p className="text-gray-700">{document.ai_summary}</p>
            </div>
          )}

          {/* Analysis Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {document.ai_sentiment && (
              <div className="bg-white border-2 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Sentiment</h4>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border-2 ${getSentimentColor(
                    document.ai_sentiment
                  )}`}
                >
                  {document.ai_sentiment}
                </span>
              </div>
            )}
            {document.ai_confidence !== null && document.ai_confidence !== undefined && (
              <div className="bg-white border-2 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Confidence</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {(document.ai_confidence * 100).toFixed(1)}%
                </p>
              </div>
            )}
            {document.processed_at && (
              <div className="bg-white border-2 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Processed</h4>
                <p className="text-sm text-gray-900">{formatDate(document.processed_at)}</p>
              </div>
            )}
          </div>

          {/* Keywords */}
          {document.ai_keywords && document.ai_keywords.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {document.ai_keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Text */}
          {document.extracted_text && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Extracted Text</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {document.extracted_text}
                </pre>
              </div>
            </div>
          )}

          {/* Additional Analysis Data */}
          {document.ai_analysis_data && Object.keys(document.ai_analysis_data).length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Additional Insights</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(document.ai_analysis_data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


