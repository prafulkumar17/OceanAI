export interface Document {
  id: number
  filename: string
  original_filename: string
  file_type: string
  file_size: number
  extracted_text?: string
  ai_summary?: string
  ai_keywords?: string[]
  ai_sentiment?: string
  ai_confidence?: number
  ai_analysis_data?: Record<string, any>
  status: string
  owner_id: number
  created_at: string
  updated_at?: string
  processed_at?: string
}


