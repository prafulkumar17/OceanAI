export interface Project {
  id: number
  title: string
  topic: string
  document_type: 'docx' | 'pptx'
  generated_content?: string
  owner_id: number
  created_at: string
  updated_at?: string
}

export interface ProjectCreate {
  title: string
  topic: string
  document_type: 'docx' | 'pptx'
}

