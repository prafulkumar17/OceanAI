import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectApi } from '../services/api'
import { Project } from '../types/project'
import { ArrowLeft, Sparkles, Download, RefreshCw, Loader, Brain, FileText, PenTool, CheckCircle, Undo } from 'lucide-react'

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [refining, setRefining] = useState(false)
    const [refinementPrompt, setRefinementPrompt] = useState('')
    const [streamingContent, setStreamingContent] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState<any>(null)
    const [saving, setSaving] = useState(false)
    const [contentHistory, setContentHistory] = useState<string[]>([])
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
    const [loadingPdf, setLoadingPdf] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (id) {
            loadProject(parseInt(id))
        }
    }, [id])

    useEffect(() => {
        // Auto-load PDF preview when PPTX content changes
        if (project?.generated_content && project.document_type === 'pptx' && id) {
            loadPdfPreview(parseInt(id))
        }
    }, [project?.generated_content, project?.document_type, id])

    const loadProject = async (projectId: number) => {
        try {
            setLoading(true)
            const data = await projectApi.getProject(projectId)
            setProject(data)
            setError(null)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load project')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerate = async () => {
        if (!id) return

        setGenerating(true)
        setError(null)
        setStreamingContent('')

        const token = localStorage.getItem('access_token')
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const eventSource = new EventSource(`${API_URL}/api/projects/${id}/generate/stream?token=${token}`)

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)

                if (data.chunk) {
                    setStreamingContent(prev => prev + data.chunk)
                } else if (data.status === 'complete') {
                    // Save current content to history before updating
                    if (project?.generated_content) {
                        setContentHistory(prev => [...prev, project.generated_content!])
                    }
                    setProject(prev => prev ? { ...prev, generated_content: JSON.stringify(data.content) } : null)
                    setGenerating(false)
                    setStreamingContent('')
                    eventSource.close()
                } else if (data.error) {
                    setError(data.error)
                    setGenerating(false)
                    eventSource.close()
                }
            } catch (e) {
                console.error('Error parsing event data:', e)
            }
        }

        eventSource.onerror = (err) => {
            console.error('EventSource error:', err)
            setError('Connection failed')
            setGenerating(false)
            eventSource.close()
        }
    }

    const handleRefine = async () => {
        if (!id || !refinementPrompt.trim()) return
        try {
            setRefining(true)
            setError(null)
            // Save current content to history before refining
            if (project?.generated_content) {
                setContentHistory(prev => [...prev, project.generated_content!])
            }
            const updated = await projectApi.refineDocument(parseInt(id), refinementPrompt)
            setProject(updated)
            setRefinementPrompt('')
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to refine document')
        } finally {
            setRefining(false)
        }
    }

    const handleExport = async () => {
        if (!id) return
        try {
            const blob = await projectApi.exportDocument(parseInt(id))
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${project?.title || 'document'}.${project?.document_type || 'docx'}`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to export document')
        }
    }

    const handleEdit = () => {
        if (project?.generated_content) {
            const content = JSON.parse(project.generated_content)
            setEditedContent(content)
            setIsEditing(true)
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditedContent(null)
    }

    const handleSaveEdit = async () => {
        if (!id || !editedContent) return
        try {
            setSaving(true)
            const updated = await projectApi.updateProjectContent(parseInt(id), editedContent)
            setProject(updated)
            setIsEditing(false)
            setEditedContent(null)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to save changes')
        } finally {
            setSaving(false)
        }
    }

    const handleRevert = () => {
        if (contentHistory.length === 0) return

        const previousContent = contentHistory[contentHistory.length - 1]
        const newHistory = contentHistory.slice(0, -1)

        setProject(prev => prev ? { ...prev, generated_content: previousContent } : null)
        setContentHistory(newHistory)
    }

    const loadPdfPreview = async (projectId: number) => {
        try {
            setLoadingPdf(true)
            const blob = await projectApi.getPdfPreview(projectId)
            const url = window.URL.createObjectURL(blob)

            // Clean up old URL
            if (pdfPreviewUrl) {
                window.URL.revokeObjectURL(pdfPreviewUrl)
            }

            setPdfPreviewUrl(url)
        } catch (err: any) {
            console.error('Failed to load PDF preview:', err)
            // Silently fail - will show fallback message
        } finally {
            setLoadingPdf(false)
        }
    }

    const getProgressStep = (length: number) => {
        if (length < 100) return 0
        if (length < 300) return 1
        if (length < 1000) return 2
        return 3
    }

    const renderLoadingSteps = () => {
        const currentStep = getProgressStep(streamingContent.length)
        const steps = [
            { label: 'Analyzing Topic', icon: Brain },
            { label: 'Structuring Outline', icon: FileText },
            { label: 'Drafting Content', icon: PenTool },
            { label: 'Refining Details', icon: Sparkles },
            { label: 'Finalizing', icon: CheckCircle },
        ]

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto my-12">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900">Generating Your Document</h3>
                    <p className="text-gray-500 mt-2">OceanAI is crafting your content...</p>
                </div>

                <div className="space-y-6">
                    {steps.map((step, idx) => {
                        const isActive = idx === currentStep
                        const isCompleted = idx < currentStep

                        return (
                            <div key={idx} className={`flex items-center transition-all duration-500 ${isActive || isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`
                  flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4 border-2
                  ${isActive ? 'border-primary-600 bg-primary-50 text-primary-600' : ''}
                  ${isCompleted ? 'border-green-500 bg-green-50 text-green-500' : ''}
                  ${!isActive && !isCompleted ? 'border-gray-200 bg-gray-50 text-gray-400' : ''}
                `}>
                                    {isCompleted ? (
                                        <CheckCircle className="h-6 w-6" />
                                    ) : (
                                        <step.icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h4 className={`font-medium ${isActive ? 'text-primary-700' : 'text-gray-900'}`}>
                                        {step.label}
                                    </h4>
                                    {isActive && (
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-primary-500 rounded-full animate-progress"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Live Preview</p>
                    <div className="font-mono text-xs text-gray-500 h-12 overflow-hidden opacity-70">
                        {streamingContent.slice(-150)}
                        <span className="animate-pulse">_</span>
                    </div>
                </div>
            </div>
        )
    }

    const renderPreview = () => {
        if (!project?.generated_content) return null

        try {
            const content = JSON.parse(project.generated_content)

            if (project.document_type === 'docx' && content.sections) {
                return (
                    <div className="bg-white rounded-lg shadow-xl border border-gray-300 p-12 max-w-4xl mx-auto mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                        <div className="prose prose-lg max-w-none">
                            <h1 className="text-4xl font-bold text-center mb-8 pb-4 border-b-2 border-gray-300">
                                {project.title}
                            </h1>
                            {content.sections.map((section: any, idx: number) => (
                                <div key={idx} className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6">
                                        {section.title}
                                    </h2>
                                    {section.content?.map((para: string, pIdx: number) => (
                                        <p key={pIdx} className="text-gray-800 leading-relaxed mb-4 text-justify">
                                            {para}
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }

            if (project.document_type === 'pptx' && content.slides) {
                // Show PDF preview if available
                if (pdfPreviewUrl) {
                    return (
                        <div className="mb-8 relative">
                            <iframe
                                src={pdfPreviewUrl}
                                className={`w-full border-2 border-gray-300 rounded-lg shadow-xl transition-all duration-300 ${loadingPdf ? 'blur-sm' : ''}`}
                                style={{ height: '600px' }}
                                title="PDF Preview"
                            />
                            {loadingPdf && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
                                    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
                                        <Loader className="h-8 w-8 animate-spin text-primary-600 mb-2" />
                                        <p className="text-gray-700 font-medium">Updating preview...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }

                // Show loading state
                if (loadingPdf) {
                    return (
                        <div className="text-center py-12">
                            <Loader className="h-8 w-8 mx-auto animate-spin text-primary-600 mb-2" />
                            <p className="text-gray-500">Generating preview...</p>
                        </div>
                    )
                }

                // Fallback message
                return (
                    <div className="text-center py-12 text-gray-500">
                        <p>Preview not available</p>
                    </div>
                )
            }
        } catch (e) {
            return null
        }

        return null
    }

    const renderEditableContent = () => {
        if (!project?.generated_content) return null

        try {
            const content = editedContent || JSON.parse(project.generated_content)

            if (project.document_type === 'docx' && content.sections) {
                return (
                    <div className="space-y-6">
                        {content.sections.map((section: any, idx: number) => (
                            <div key={idx} className="border-l-4 border-primary-500 pl-4">
                                <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => {
                                        const newContent = { ...content }
                                        newContent.sections[idx].title = e.target.value
                                        setEditedContent(newContent)
                                    }}
                                    className="text-xl font-semibold text-gray-900 mb-2 w-full border-b-2 border-primary-300 focus:outline-none focus:border-primary-600"
                                />
                                {section.content?.map((para: string, pIdx: number) => (
                                    <textarea
                                        key={pIdx}
                                        value={para}
                                        onChange={(e) => {
                                            const newContent = { ...content }
                                            newContent.sections[idx].content[pIdx] = e.target.value
                                            setEditedContent(newContent)
                                        }}
                                        rows={3}
                                        className="w-full text-gray-700 mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                )
            }

            if (project.document_type === 'pptx' && content.slides) {
                return (
                    <div className="space-y-6">
                        {content.slides.map((slide: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <input
                                    type="text"
                                    value={slide.title}
                                    onChange={(e) => {
                                        const newContent = { ...content }
                                        newContent.slides[idx].title = e.target.value
                                        setEditedContent(newContent)
                                    }}
                                    className="text-xl font-semibold text-gray-900 mb-4 w-full border-b-2 border-primary-300 focus:outline-none focus:border-primary-600"
                                />
                                <ul className="space-y-2">
                                    {slide.bullets?.map((bullet: string, bIdx: number) => (
                                        <li key={bIdx} className="flex items-start">
                                            <span className="text-primary-600 mr-2">•</span>
                                            <input
                                                type="text"
                                                value={bullet}
                                                onChange={(e) => {
                                                    const newContent = { ...content }
                                                    newContent.slides[idx].bullets[bIdx] = e.target.value
                                                    setEditedContent(newContent)
                                                }}
                                                className="flex-1 text-gray-700 border-b border-gray-300 focus:outline-none focus:border-primary-600"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )
            }
        } catch (e) {
            return <div className="text-gray-500">Error parsing content</div>
        }

        return null
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
        )
    }

    if (error && !project) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
                <button
                    onClick={() => navigate('/projects')}
                    className="mt-4 text-primary-600 hover:text-primary-700"
                >
                    ← Back to Projects
                </button>
            </div>
        )
    }

    if (!project) {
        return <div>Project not found</div>
    }

    return (
        <div className="animate-fadeIn">
            <button
                onClick={() => navigate('/projects')}
                className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
            </button>

            <div className="glass-card overflow-hidden">
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 px-6 py-6 border-b border-amber-900/20">
                    <h1 className="text-3xl font-bold text-white mb-2 animate-slideUp">{project.title}</h1>
                    <p className="text-amber-100">Topic: {project.topic}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                        {project.document_type.toUpperCase()}
                    </span>
                </div>

                <div className="px-6 py-4 border-b border-amber-900/30 bg-neutral-900/30 backdrop-blur-sm">
                    {!project.generated_content ? (
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="gradient-button flex items-center px-6 py-3 rounded-xl font-semibold text-white disabled:opacity-50"
                        >
                            {generating ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate Document
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="flex space-x-3">
                            <button
                                onClick={handleExport}
                                className="flex items-center px-4 py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-amber-900/30 transition-all duration-300"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </button>

                            <button
                                onClick={handleRevert}
                                disabled={contentHistory.length === 0}
                                className="flex items-center px-4 py-2.5 bg-gradient-to-r from-orange-700 to-orange-800 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-orange-900/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={contentHistory.length === 0 ? 'No previous versions' : `Revert to previous version (${contentHistory.length} version${contentHistory.length > 1 ? 's' : ''} available)`}
                            >
                                <Undo className="h-4 w-4 mr-2" />
                                Revert
                            </button>

                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center px-4 py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-amber-900/30 transition-all duration-300"
                                    >
                                        <PenTool className="h-4 w-4 mr-2" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={generating}
                                        className="gradient-button flex items-center px-4 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
                                    >
                                        {generating ? (
                                            <>
                                                <Loader className="h-4 w-4 mr-2 animate-spin" />
                                                Regenerating...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Regenerate
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSaveEdit}
                                        disabled={saving}
                                        className="gradient-button flex items-center px-4 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader className="h-4 w-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Save
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center px-4 py-2.5 bg-neutral-800 text-white rounded-xl font-semibold hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-neutral-900/20 backdrop-blur-sm">
                    {generating ? (
                        renderLoadingSteps()
                    ) : project.generated_content ? (
                        <>
                            {/* Show preview when NOT editing, show editable content when editing */}
                            {!isEditing ? renderPreview() : (
                                <div className="mb-6">{renderEditableContent()}</div>
                            )}

                            {/* Refinement Section - always visible at bottom */}
                            {!isEditing && (
                                <div className="border-t border-amber-900/30 pt-6 mt-6">
                                    <h3 className="text-lg font-semibold text-amber-100 mb-3">
                                        Refine Content
                                    </h3>
                                    <div className="space-y-3">
                                        <textarea
                                            value={refinementPrompt}
                                            onChange={(e) => setRefinementPrompt(e.target.value)}
                                            placeholder="Enter your refinement instructions (e.g., 'Make it more formal', 'Add more details about X', 'Simplify the language')"
                                            rows={3}
                                            className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 resize-none"
                                        />
                                        <button
                                            onClick={handleRefine}
                                            disabled={refining || !refinementPrompt.trim()}
                                            className="gradient-button flex items-center px-4 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {refining ? (
                                                <>
                                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                                    Refining...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="h-4 w-4 mr-2" />
                                                    Refine Content
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 text-neutral-400">
                            <Sparkles className="h-12 w-12 mx-auto mb-4 text-amber-500/50" />
                            <p>No content generated yet. Click "Generate Document" to create your document.</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                            <p className="text-red-300">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
