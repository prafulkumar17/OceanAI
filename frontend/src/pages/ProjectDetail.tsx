import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
    Save,
    ArrowLeft,
    Download,
    RefreshCw,
    PenTool,
    Undo,
    FileText,
    MonitorPlay,
    Sparkles,
    Loader,
    Plus,
    Trash2,
    X
} from 'lucide-react'
import { projectApi } from '../services/api'
import { Project } from '../types/project'
import LoadingSteps from '../components/LoadingSteps'

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [refining, setRefining] = useState(false)
    const [error, setError] = useState('')
    const [refinementPrompt, setRefinementPrompt] = useState('')
    const [streamedContent, setStreamedContent] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editableContent, setEditableContent] = useState('') // For raw JSON editing (fallback)
    const [structuredContent, setStructuredContent] = useState<any>(null) // For structured DOCX/PPTX editing
    const [saving, setSaving] = useState(false)
    const [contentHistory, setContentHistory] = useState<string[]>([])
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
    const [loadingPdf, setLoadingPdf] = useState(false)

    useEffect(() => {
        if (location.state?.project) {
            setProject(location.state.project)
            setLoading(false)
        } else if (id) {
            loadProject(parseInt(id))
        }
    }, [id, location.state])

    // Load PDF preview when content changes for PPTX
    useEffect(() => {
        if (project?.document_type === 'pptx' && project.generated_content && !isEditing && id) {
            loadPdfPreview(parseInt(id))
        }
    }, [project?.generated_content, isEditing, id])

    // Auto-generate content if new project
    useEffect(() => {
        if (project && !project.generated_content && !generating && !error && id) {
            handleGenerate()
        }
    }, [project, id])

    const loadProject = async (projectId: number) => {
        try {
            const data = await projectApi.getProject(projectId)
            setProject(data)
            setStreamedContent(data.generated_content ? JSON.parse(data.generated_content) : '')
        } catch (err) {
            setError('Failed to load project')
        } finally {
            setLoading(false)
        }
    }

    const loadPdfPreview = async (projectId: number) => {
        setLoadingPdf(true)
        try {
            const blob = await projectApi.getPdfPreview(projectId)
            const url = URL.createObjectURL(blob)
            setPdfPreviewUrl(prev => {
                if (prev) URL.revokeObjectURL(prev)
                return url
            })
        } catch (err) {
            console.error('Failed to load PDF preview:', err)
        } finally {
            setLoadingPdf(false)
        }
    }

    const saveVersion = () => {
        if (project?.generated_content) {
            setContentHistory(prev => [...prev, project.generated_content!])
        }
    }

    const handleRevert = async () => {
        if (contentHistory.length === 0 || !project || !id) return

        const previousContent = contentHistory[contentHistory.length - 1]
        const newHistory = contentHistory.slice(0, -1)

        try {
            setSaving(true)
            await projectApi.updateProjectContent(parseInt(id), JSON.parse(previousContent))
            setProject({ ...project, generated_content: previousContent })
            setStreamedContent(JSON.parse(previousContent))
            setContentHistory(newHistory)
        } catch (err) {
            setError('Failed to revert changes')
        } finally {
            setSaving(false)
        }
    }

    const handleGenerate = async () => {
        if (!project || !id) return
        setGenerating(true)
        setError('')
        setStreamedContent('')
        saveVersion()

        try {
            const updatedProject = await projectApi.generateDocument(
                parseInt(id),
                project.topic,
                project.document_type
            )
            setProject(updatedProject)
            setStreamedContent(updatedProject.generated_content ? JSON.parse(updatedProject.generated_content) : '')
        } catch (err) {
            setError('Failed to generate content')
        } finally {
            setGenerating(false)
        }
    }

    const handleRefine = async () => {
        if (!project || !refinementPrompt.trim() || !id) return
        setRefining(true)
        setError('')
        saveVersion()

        try {
            const updatedProject = await projectApi.refineDocument(parseInt(id), refinementPrompt)
            setProject(updatedProject)
            setStreamedContent(updatedProject.generated_content ? JSON.parse(updatedProject.generated_content) : '')
            setRefinementPrompt('')
        } catch (err) {
            setError('Failed to refine content')
        } finally {
            setRefining(false)
        }
    }

    const handleExport = async () => {
        if (!project || !id) return

        if (localStorage.getItem('is_guest') === 'true') {
            setError('Login to export')
            return
        }

        try {
            const blob = await projectApi.exportDocument(parseInt(id))
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${project.title}.${project.document_type}`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (err) {
            setError('Failed to export project')
        }
    }

    const handleEdit = () => {
        if (project?.generated_content) {
            try {
                const content = JSON.parse(project.generated_content)

                if (project.document_type === 'docx' && content.sections && Array.isArray(content.sections)) {
                    // Normalize content to array if it's a string
                    const normalizedSections = content.sections.map((section: any) => ({
                        ...section,
                        content: Array.isArray(section.content) ? section.content : [section.content || ""]
                    }))
                    setStructuredContent({ ...content, sections: normalizedSections })
                } else if (project.document_type === 'pptx' && content.slides && Array.isArray(content.slides)) {
                    // Normalize content to array if it's a string, and map bullets to content
                    const normalizedSlides = content.slides.map((slide: any) => ({
                        ...slide,
                        content: slide.bullets || (Array.isArray(slide.content) ? slide.content : [slide.content || ""])
                    }))
                    setStructuredContent({ ...content, slides: normalizedSlides })
                } else {
                    setEditableContent(JSON.stringify(content, null, 2))
                }
                setIsEditing(true)
            } catch (e) {
                console.error("Error parsing content for edit:", e)
                setEditableContent(project.generated_content)
                setIsEditing(true)
            }
        }
    }

    const handleSaveEdit = async () => {
        if (!project || !id) return
        setSaving(true)
        saveVersion()
        try {
            let contentObj

            if ((project.document_type === 'docx' || project.document_type === 'pptx') && structuredContent) {
                if (project.document_type === 'pptx') {
                    // Map content back to bullets for PPTX
                    contentObj = {
                        ...structuredContent,
                        slides: structuredContent.slides.map((slide: any) => {
                            // Create a new object to avoid mutating state
                            const newSlide = { ...slide, bullets: slide.content };
                            delete newSlide.content;
                            return newSlide;
                        })
                    }
                } else {
                    contentObj = structuredContent
                }
            } else {
                contentObj = JSON.parse(editableContent)
            }

            await projectApi.updateProjectContent(parseInt(id), contentObj)

            const newContentStr = JSON.stringify(contentObj)
            setProject({ ...project, generated_content: newContentStr })
            setStreamedContent(contentObj)
            setIsEditing(false)
            setStructuredContent(null)
        } catch (err) {
            setError('Failed to save changes: Invalid format')
        } finally {
            setSaving(false)
        }
    }

    // DOCX Helpers
    const updateSectionTitle = (index: number, newTitle: string) => {
        if (!structuredContent?.sections) return
        const newSections = [...structuredContent.sections]
        newSections[index].title = newTitle
        setStructuredContent({ ...structuredContent, sections: newSections })
    }

    const updateParagraph = (sectionIndex: number, pIndex: number, newText: string) => {
        if (!structuredContent?.sections) return
        const newSections = [...structuredContent.sections]
        if (!newSections[sectionIndex].content) newSections[sectionIndex].content = []
        newSections[sectionIndex].content[pIndex] = newText
        setStructuredContent({ ...structuredContent, sections: newSections })
    }

    const addParagraph = (sectionIndex: number) => {
        if (!structuredContent?.sections) return
        const newSections = [...structuredContent.sections]
        if (!newSections[sectionIndex].content) newSections[sectionIndex].content = []
        newSections[sectionIndex].content.push("New paragraph...")
        setStructuredContent({ ...structuredContent, sections: newSections })
    }

    const removeParagraph = (sectionIndex: number, pIndex: number) => {
        if (!structuredContent?.sections) return
        const newSections = [...structuredContent.sections]
        if (newSections[sectionIndex].content) {
            newSections[sectionIndex].content.splice(pIndex, 1)
            setStructuredContent({ ...structuredContent, sections: newSections })
        }
    }

    const addSection = () => {
        const sections = structuredContent?.sections || []
        const newSections = [...sections, { title: "New Section", content: ["New paragraph..."] }]
        setStructuredContent({ ...structuredContent, sections: newSections })
    }

    const removeSection = (index: number) => {
        if (!structuredContent?.sections) return
        const newSections = [...structuredContent.sections]
        newSections.splice(index, 1)
        setStructuredContent({ ...structuredContent, sections: newSections })
    }

    // PPTX Helpers
    const updateSlideTitle = (index: number, newTitle: string) => {
        if (!structuredContent?.slides) return
        const newSlides = [...structuredContent.slides]
        newSlides[index].title = newTitle
        setStructuredContent({ ...structuredContent, slides: newSlides })
    }

    const updateSlidePoint = (slideIndex: number, pIndex: number, newText: string) => {
        if (!structuredContent?.slides) return
        const newSlides = [...structuredContent.slides]
        if (!newSlides[slideIndex].content) newSlides[slideIndex].content = []
        newSlides[slideIndex].content[pIndex] = newText
        setStructuredContent({ ...structuredContent, slides: newSlides })
    }

    const addSlidePoint = (slideIndex: number) => {
        if (!structuredContent?.slides) return
        const newSlides = [...structuredContent.slides]
        if (!newSlides[slideIndex].content) newSlides[slideIndex].content = []
        newSlides[slideIndex].content.push("New bullet point...")
        setStructuredContent({ ...structuredContent, slides: newSlides })
    }

    const removeSlidePoint = (slideIndex: number, pIndex: number) => {
        if (!structuredContent?.slides) return
        const newSlides = [...structuredContent.slides]
        if (newSlides[slideIndex].content) {
            newSlides[slideIndex].content.splice(pIndex, 1)
            setStructuredContent({ ...structuredContent, slides: newSlides })
        }
    }

    const addSlide = () => {
        const slides = structuredContent?.slides || []
        const newSlides = [...slides, { title: "New Slide", content: ["New point..."] }]
        setStructuredContent({ ...structuredContent, slides: newSlides })
    }

    const removeSlide = (index: number) => {
        if (!structuredContent?.slides) return
        const newSlides = [...structuredContent.slides]
        newSlides.splice(index, 1)
        setStructuredContent({ ...structuredContent, slides: newSlides })
    }

    const renderContent = () => {
        if (generating) {
            return <LoadingSteps />
        }

        if (isEditing) {
            // Structured Editor for DOCX
            if (project?.document_type === 'docx' && structuredContent?.sections && Array.isArray(structuredContent.sections)) {
                return (
                    <div className="h-full flex flex-col bg-[#111] border border-white/10 rounded-xl overflow-hidden">
                        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar space-y-8">
                            {structuredContent.sections.map((section: any, sIndex: number) => (
                                <div key={sIndex} className="bento-card p-6 border-white/5 bg-white/5 relative group">
                                    <button
                                        onClick={() => removeSection(sIndex)}
                                        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Remove Section"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="mb-4">
                                        <label className="text-xs font-bold text-[#87CEEB] uppercase tracking-wider mb-2 block">Section Title</label>
                                        <input
                                            type="text"
                                            value={section.title || ''}
                                            onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-lg font-bold text-white focus:border-[#87CEEB] focus:outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Content</label>
                                        {Array.isArray(section.content) && section.content.map((para: string, pIndex: number) => (
                                            <div key={pIndex} className="flex gap-2 group/para">
                                                <textarea
                                                    value={para || ''}
                                                    onChange={(e) => updateParagraph(sIndex, pIndex, e.target.value)}
                                                    rows={3}
                                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-gray-300 focus:border-[#00ffff] focus:outline-none transition-colors resize-y"
                                                />
                                                <button
                                                    onClick={() => removeParagraph(sIndex, pIndex)}
                                                    className="p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover/para:opacity-100 transition-opacity self-start"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addParagraph(sIndex)}
                                            className="w-full py-2 border border-dashed border-white/10 rounded-lg text-xs font-bold text-gray-500 hover:text-white hover:border-white/30 transition-all flex items-center justify-center"
                                        >
                                            <Plus className="w-3 h-3 mr-2" /> Add Paragraph
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={addSection}
                                className="w-full py-4 border border-dashed border-[#87CEEB]/30 rounded-xl text-[#87CEEB] font-bold hover:bg-[#87CEEB]/10 transition-all flex items-center justify-center"
                            >
                                <Plus className="w-5 h-5 mr-2" /> Add New Section
                            </button>
                        </div>

                        <div className="p-4 border-t border-white/10 bg-[#050505] flex justify-end space-x-4">
                            <button
                                onClick={() => { setIsEditing(false); setStructuredContent(null); }}
                                className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="bg-[#00ffff] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#00e6e6] transition-colors flex items-center shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                            >
                                {saving ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                )
            }

            // Structured Editor for PPTX
            if (project?.document_type === 'pptx' && structuredContent?.slides && Array.isArray(structuredContent.slides)) {
                return (
                    <div className="h-full flex flex-col bg-[#050505] border border-white/10 rounded-xl overflow-hidden">
                        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar space-y-6">
                            {structuredContent.slides.map((slide: any, sIndex: number) => (
                                <div key={sIndex} className="bg-[#111] border border-white/10 rounded-xl p-6 relative">
                                    <div className="absolute -left-3 top-6 w-6 h-6 bg-[#ff00ff] rounded-full flex items-center justify-center text-xs font-bold text-black border-2 border-[#111] z-10">
                                        {sIndex + 1}
                                    </div>
                                    <button
                                        onClick={() => removeSlide(sIndex)}
                                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 transition-colors"
                                        title="Remove Slide"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="mb-6 ml-4">
                                        <label className="text-xs font-bold text-[#ff00ff] uppercase tracking-wider mb-2 block">Slide Title</label>
                                        <input
                                            type="text"
                                            value={slide.title || ''}
                                            onChange={(e) => updateSlideTitle(sIndex, e.target.value)}
                                            className="w-full bg-black border border-white/20 rounded-lg p-3 text-lg font-bold text-white focus:border-[#ff00ff] focus:outline-none transition-colors"
                                            placeholder="Enter slide title..."
                                        />
                                    </div>

                                    <div className="space-y-3 ml-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Bullet Points</label>
                                        {Array.isArray(slide.content) && slide.content.map((point: any, pIndex: number) => {
                                            const pointText = typeof point === 'object' ? (point.text || JSON.stringify(point)) : point;
                                            return (
                                                <div key={pIndex} className="flex gap-3 items-start">
                                                    <div className="mt-3 w-1.5 h-1.5 rounded-full bg-[#ff00ff]/50 flex-shrink-0" />
                                                    <textarea
                                                        value={pointText || ''}
                                                        onChange={(e) => updateSlidePoint(sIndex, pIndex, e.target.value)}
                                                        rows={2}
                                                        className="w-full bg-black border border-white/20 rounded-lg p-3 text-sm text-gray-300 focus:border-[#ff00ff] focus:outline-none transition-colors resize-y"
                                                        placeholder="Enter bullet point..."
                                                    />
                                                    <button
                                                        onClick={() => removeSlidePoint(sIndex, pIndex)}
                                                        className="mt-2 p-1 text-gray-600 hover:text-red-400 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        <button
                                            onClick={() => addSlidePoint(sIndex)}
                                            className="w-full py-3 border border-dashed border-white/20 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-white/40 transition-all flex items-center justify-center mt-4"
                                        >
                                            <Plus className="w-3 h-3 mr-2" /> Add Bullet Point
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={addSlide}
                                className="w-full py-4 border border-dashed border-[#ff00ff]/30 rounded-xl text-[#ff00ff] font-bold hover:bg-[#ff00ff]/10 transition-all flex items-center justify-center"
                            >
                                <Plus className="w-5 h-5 mr-2" /> Add New Slide
                            </button>
                        </div>

                        <div className="p-4 border-t border-white/10 bg-[#050505] flex justify-end space-x-4">
                            <button
                                onClick={() => { setIsEditing(false); setStructuredContent(null); }}
                                className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="bg-[#ff00ff] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#e600e6] transition-colors flex items-center shadow-[0_0_15px_rgba(255,0,255,0.2)]"
                            >
                                {saving ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                )
            }

            // Fallback Raw Editor
            return (
                <div className="h-full flex flex-col">
                    <textarea
                        value={editableContent}
                        onChange={(e) => setEditableContent(e.target.value)}
                        className="flex-grow w-full p-6 font-mono text-sm bg-[#050505] text-gray-300 border border-white/10 resize-none focus:outline-none focus:border-[#87CEEB]/50 rounded-xl"
                        spellCheck={false}
                    />
                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="bg-[#00ffff] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#00e6e6] transition-colors flex items-center"
                        >
                            {saving ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            );
        }

        // PPTX Preview - show loading if PDF not ready yet
        if (project?.document_type === 'pptx' && project.generated_content) {
            if (pdfPreviewUrl) {
                return (
                    <div className="relative h-full w-full bg-[#111] border border-white/10 rounded-xl overflow-hidden group">
                        {loadingPdf && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                                <Loader className="h-10 w-10 text-[#ff00ff] animate-spin mb-4" />
                                <p className="font-bold text-gray-300">Updating Preview...</p>
                            </div>
                        )}
                        <iframe
                            src={`${pdfPreviewUrl}#zoom=67&navpanes=0&toolbar=0&view=FitH`}
                            className={`w-full h-full transition-opacity duration-300 ${loadingPdf ? 'opacity-50' : 'opacity-100'}`}
                            title="PDF Preview"
                        />
                    </div>
                )
            } else {
                // Show loading while PDF is being generated
                return (
                    <div className="relative h-full w-full bg-[#111] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <Loader className="h-10 w-10 text-[#ff00ff] animate-spin mb-4" />
                        <p className="font-bold text-gray-300">Generating Preview...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                    </div>
                )
            }
        }

        // Render DOCX Content (Preview Mode)
        if (project?.document_type === 'docx' && typeof streamedContent === 'object' && streamedContent !== null) {
            const content = streamedContent as any
            if (content.sections && Array.isArray(content.sections)) {
                return (
                    <div className="prose prose-invert max-w-none p-8 bg-[#111] border border-white/10 rounded-xl h-full overflow-y-auto custom-scrollbar">
                        {content.sections.map((section: any, index: number) => (
                            <div key={index} className="mb-10 last:mb-0 animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <h2 className="text-2xl font-bold mb-4 text-[#87CEEB] border-b border-white/10 pb-2">
                                    {section.title}
                                </h2>
                                <div className="space-y-4 text-gray-300 leading-relaxed">
                                    {section.content.map((paragraph: string, pIndex: number) => (
                                        <p key={pIndex}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        }
        return (
            <div className="prose prose-invert max-w-none p-8 bg-[#111] border border-white/10 rounded-xl h-full overflow-y-auto font-mono text-sm text-gray-300">
                <pre className="whitespace-pre-wrap font-mono">
                    {typeof streamedContent === 'string' ? streamedContent : JSON.stringify(streamedContent, null, 2)}
                </pre>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-12 w-12 border-4 border-[#87CEEB] border-t-transparent rounded-full"></div>
            </div>
        )
    }

    if (!project) return <div>Project not found</div>

    return (
        <div className="min-h-screen pb-20">
            {/* Top Bar */}
            <div className="bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 sticky top-16 z-40 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/projects')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">{project.title}</h1>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${project.document_type === 'docx' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'
                                }`}>
                                {project.document_type.toUpperCase()}
                            </span>
                            <span>•</span>
                            <span>{project.topic}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleRevert}
                        disabled={contentHistory.length === 0}
                        className="bg-white/5 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors flex items-center border border-white/10"
                        title="Revert to previous version"
                    >
                        <Undo className="h-4 w-4 mr-2" />
                        Revert
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={!project.generated_content}
                        className="bg-[#87CEEB] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#6BB6D6] disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors shadow-[0_0_15px_rgba(135,206,235,0.2)]"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>

                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            disabled={!project.generated_content}
                            className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 disabled:opacity-50 transition-colors flex items-center"
                        >
                            <PenTool className="h-4 w-4 mr-2" />
                            Edit
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center animate-fadeIn">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">

                    {/* Main Content / Preview Area */}
                    <div className="lg:col-span-2 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <div className="flex items-center text-sm font-medium text-gray-400">
                                {project.document_type === 'pptx' ? <MonitorPlay className="h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                                {isEditing ? 'Editor Mode' : 'Preview Mode'}
                            </div>
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                            </div>
                        </div>

                        <div className="flex-grow">
                            {renderContent()}
                        </div>
                    </div>

                    {/* Controls Sidebar */}
                    <div className="space-y-6">
                        {/* Generate / Regenerate Box */}
                        <div className="bento-card p-6 border-[#87CEEB]/20">
                            <h3 className="text-lg font-bold mb-4 text-white flex items-center">
                                <Sparkles className="w-4 h-4 mr-2 text-[#87CEEB]" />
                                Did not like the content?
                            </h3>

                            {!project.generated_content ? (
                                <button
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    className="w-full bg-[#87CEEB] text-black py-3 rounded-xl font-bold hover:bg-[#6BB6D6] disabled:opacity-50 transition-colors shadow-[0_0_20px_rgba(135,206,235,0.2)]"
                                >
                                    {generating ? (
                                        <span className="flex items-center justify-center">
                                            <Loader className="animate-spin h-5 w-5 mr-2" />
                                            Generating...
                                        </span>
                                    ) : (
                                        'Generate Content'
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    className="w-full bg-white/5 text-white py-3 rounded-xl font-medium hover:bg-white/10 disabled:opacity-50 transition-colors border border-white/10"
                                >
                                    <span className="flex items-center justify-center">
                                        <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
                                        Regenerate All
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Refinement Box */}
                        {project.generated_content && !isEditing && (
                            <div className="bento-card p-6">
                                <h3 className="text-lg font-bold mb-4 text-white">Refine Artifact</h3>
                                <textarea
                                    value={refinementPrompt}
                                    onChange={(e) => setRefinementPrompt(e.target.value)}
                                    placeholder="Enter instructions (e.g., 'Make it more formal', 'Expand section 2')..."
                                    rows={4}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffff]/50 mb-4 resize-none"
                                />
                                <button
                                    onClick={handleRefine}
                                    disabled={refining || !refinementPrompt.trim()}
                                    className="w-full bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/50 py-3 rounded-xl font-bold hover:bg-[#00ffff]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {refining ? (
                                        <span className="flex items-center justify-center">
                                            <Loader className="animate-spin h-4 w-4 mr-2" />
                                            Refining...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Apply Changes
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
    )
}
