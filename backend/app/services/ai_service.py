import os
import google.generativeai as genai
from typing import Dict, List, Any, Optional
import json

class AIService:
    """Service for AI-powered document analysis using Google Gemini"""
    
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        genai.configure(api_key=api_key)
        # Use gemini-2.5-flash (stable, fast, good for document analysis)
        self.model = genai.GenerativeModel('models/gemini-2.5-flash')
    
    async def analyze_document(self, text: str) -> Dict[str, Any]:
        """
        Analyze document text using AI
        Returns: summary, keywords, sentiment, and additional insights
        """
        if not text or len(text.strip()) < 50:
            return {
                "summary": "Document is too short for meaningful analysis.",
                "keywords": [],
                "sentiment": "neutral",
                "confidence": 0.0,
                "analysis_data": {}
            }
        
        # Truncate text if too long (Gemini has token limits)
        max_chars = 30000  # Gemini Pro supports up to ~30k tokens, leave room for prompt
        if len(text) > max_chars:
            text = text[:max_chars] + "..."
        
        try:
            prompt = f"""Analyze the following document and provide:
1. A concise summary (2-3 sentences)
2. Top 5-10 key keywords or topics
3. Overall sentiment (positive, negative, or neutral)
4. Confidence score (0.0 to 1.0)

Document text:
{text}

Respond in JSON format with the following structure:
{{
    "summary": "brief summary here",
    "keywords": ["keyword1", "keyword2", ...],
    "sentiment": "positive/negative/neutral",
    "confidence": 0.85,
    "insights": {{
        "main_topics": ["topic1", "topic2"],
        "key_points": ["point1", "point2"],
        "document_type": "type of document"
    }}
}}

Important: Respond ONLY with valid JSON, no additional text or markdown formatting."""

            response = self.model.generate_content(
                prompt,
                generation_config={
                    'temperature': 0.3,
                    'max_output_tokens': 500,
                }
            )
            
            content = response.text.strip() if response.text else ""
            
            # Parse JSON response
            try:
                # Remove markdown code blocks if present
                if content.startswith("```json"):
                    content = content[7:]
                if content.startswith("```"):
                    content = content[3:]
                if content.endswith("```"):
                    content = content[:-3]
                content = content.strip()
                
                analysis = json.loads(content)
                
                return {
                    "summary": analysis.get("summary", ""),
                    "keywords": analysis.get("keywords", []),
                    "sentiment": analysis.get("sentiment", "neutral"),
                    "confidence": float(analysis.get("confidence", 0.5)),
                    "analysis_data": analysis.get("insights", {})
                }
            except json.JSONDecodeError:
                # Fallback parsing
                return self._parse_fallback_response(content)
                
        except Exception as e:
            # Return basic analysis on error
            return {
                "summary": f"Error during AI analysis: {str(e)}",
                "keywords": self._extract_simple_keywords(text),
                "sentiment": "neutral",
                "confidence": 0.0,
                "analysis_data": {"error": str(e)}
            }
    
    def _parse_fallback_response(self, content: str) -> Dict[str, Any]:
        """Fallback parser for non-JSON responses"""
        return {
            "summary": content[:200] if content else "Analysis completed",
            "keywords": [],
            "sentiment": "neutral",
            "confidence": 0.5,
            "analysis_data": {"raw_response": content}
        }
    
    def _extract_simple_keywords(self, text: str) -> List[str]:
        """Simple keyword extraction as fallback"""
        # Basic keyword extraction (can be improved)
        words = text.lower().split()
        # Filter common words
        common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can'}
        keywords = [w for w in words if len(w) > 4 and w not in common_words]
        # Return top 10 most frequent
        from collections import Counter
        return [word for word, count in Counter(keywords).most_common(10)]

