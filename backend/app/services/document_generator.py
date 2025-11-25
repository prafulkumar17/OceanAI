import os
import google.generativeai as genai
from typing import Dict, Any
import json
from app.models.project import DocumentType

class DocumentGenerator:
    """Generate documents using Gemini AI"""
    
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('models/gemini-2.5-flash')
    
    async def generate_document(self, topic: str, document_type: DocumentType) -> Dict[str, Any]:
        """
        Generate a complete document in one go
        Returns structured content based on document type
        """
        if document_type == DocumentType.DOCX:
            return await self._generate_word_document(topic)
        elif document_type == DocumentType.PPTX:
            return await self._generate_powerpoint_document(topic)
        else:
            raise ValueError(f"Unsupported document type: {document_type}")
    
    async def _generate_word_document(self, topic: str) -> Dict[str, Any]:
        """Generate a Word document with 3-5 sections"""
        prompt = self._get_docx_prompt(topic)

        try:
            response = await self.model.generate_content_async(prompt)
            content = response.text.strip()
            
            # Parse JSON
            content = self._clean_json_response(content)
            document_data = json.loads(content)
            
            return {
                "type": "docx",
                "sections": document_data.get("sections", [])
            }
        except Exception as e:
            raise Exception(f"Error generating document: {str(e)}")
    
    async def generate_document_stream(self, topic: str, document_type: DocumentType):
        """
        Generate document content with streaming
        Yields chunks of text as they are generated
        """
        if document_type == DocumentType.DOCX:
            prompt = self._get_docx_prompt(topic)
        elif document_type == DocumentType.PPTX:
            prompt = self._get_pptx_prompt(topic)
        else:
            raise ValueError(f"Unsupported document type: {document_type}")

        try:
            response = await self.model.generate_content_async(prompt, stream=True)
            async for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            yield f"Error: {str(e)}"

    def _get_docx_prompt(self, topic: str) -> str:
        return f"""Create a comprehensive document on the topic: "{topic}"

Generate a document with 3-5 well-structured sections. Each section should have:
- A clear section title
- 2-3 paragraphs of content (each paragraph 3-4 sentences)

Respond in JSON format:
{{
    "sections": [
        {{
            "title": "Section Title",
            "content": [
                "First paragraph text...",
                "Second paragraph text...",
                "Third paragraph text..."
            ]
        }},
        ...
    ]
}}

Make the content informative, well-written, and relevant to the topic."""

    def _get_pptx_prompt(self, topic: str) -> str:
        return f"""Create a PowerPoint presentation on the topic: "{topic}"

Generate 5 slides with:
- Clear slide titles
- 3-5 bullet points per slide

Respond in JSON format:
{{
    "slides": [
        {{
            "title": "Slide Title",
            "bullets": [
                "Bullet point 1",
                "Bullet point 2",
                "Bullet point 3"
            ]
        }},
        ...
    ]
}}

Make the content engaging, informative, and well-structured for a presentation."""

    async def _generate_powerpoint_document(self, topic: str) -> Dict[str, Any]:
        """Generate a PowerPoint document with 5 slides"""
        prompt = self._get_pptx_prompt(topic)

        try:
            response = await self.model.generate_content_async(prompt)
            content = response.text.strip()
            
            # Parse JSON
            content = self._clean_json_response(content)
            document_data = json.loads(content)
            
            return {
                "type": "pptx",
                "slides": document_data.get("slides", [])
            }
        except Exception as e:
            raise Exception(f"Error generating presentation: {str(e)}")
    
    async def refine_content(
        self, 
        current_content: str, 
        refinement_prompt: str,
        document_type: DocumentType
    ) -> Dict[str, Any]:
        """Refine existing content based on user prompt"""
        # Handle both Enum and string types safely
        doc_type_str = str(document_type.value) if hasattr(document_type, 'value') else str(document_type)
        
        prompt = f"""Refine the following {doc_type_str.upper()} document based on this instruction: "{refinement_prompt}"

Current content:
{current_content}

Apply the refinement and return the updated content in the same JSON format as the original.
Make sure to maintain the structure but improve it according to the refinement prompt."""

        try:
            response = await self.model.generate_content_async(prompt)
            content = response.text.strip()
            
            # Parse JSON
            content = self._clean_json_response(content)
            refined_data = json.loads(content)
            
            if doc_type_str == "docx":
                return {
                    "type": "docx",
                    "sections": refined_data.get("sections", [])
                }
            else:
                return {
                    "type": "pptx",
                    "slides": refined_data.get("slides", [])
                }
        except Exception as e:
            raise Exception(f"Error refining content: {str(e)}")
    
    def _clean_json_response(self, content: str) -> str:
        """Clean JSON response from markdown code blocks"""
        # Remove markdown code blocks
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        
        if content.endswith("```"):
            content = content[:-3]
            
        content = content.strip()
        
        # Find first { and last }
        start = content.find("{")
        end = content.rfind("}")
        
        if start != -1 and end != -1:
            content = content[start:end+1]
            
        return content

