from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
import logging

from app.mindmap_generator import MindmapGenerator
from app.suggestion_engine import SuggestionEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Academic AI Service",
    description="AI-powered academic assistance for mindmap generation and student suggestions",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],  # Frontend and Backend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI components
mindmap_generator = MindmapGenerator()
suggestion_engine = SuggestionEngine()

# Pydantic models for request/response
class MindmapRequest(BaseModel):
    syllabus_text: str
    course_name: Optional[str] = None
    department: Optional[str] = None

class SuggestionRequest(BaseModel):
    student_id: str
    grades: List[Dict[str, Any]] = []
    attendance: Dict[str, float] = {}
    exam_scores: List[Dict[str, Any]] = []
    current_semester: Optional[int] = 1
    department: Optional[str] = ""

class HealthResponse(BaseModel):
    status: str
    message: str
    version: str

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="Academic AI Service is running",
        version="1.0.0"
    )

# Mindmap generation endpoint
@app.post("/api/generate-mindmap")
async def generate_mindmap(request: MindmapRequest):
    """
    Generate a mindmap from syllabus text
    
    This endpoint accepts syllabus content and returns a structured mindmap
    with nodes, edges, and analysis data that can be visualized on the frontend.
    """
    try:
        logger.info(f"Generating mindmap for course: {request.course_name}")
        
        if not request.syllabus_text or len(request.syllabus_text.strip()) < 50:
            raise HTTPException(
                status_code=400, 
                detail="Syllabus text must be at least 50 characters long"
            )
        
        # Generate mindmap
        result = mindmap_generator.generate_mindmap(request.syllabus_text)
        
        # Add request metadata to response
        result['metadata'] = {
            'course_name': request.course_name,
            'department': request.department,
            'text_length': len(request.syllabus_text),
            'processing_status': 'success'
        }
        
        logger.info("Mindmap generated successfully")
        return {
            'success': True,
            'data': result,
            'message': 'Mindmap generated successfully'
        }
        
    except Exception as e:
        logger.error(f"Error generating mindmap: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating mindmap: {str(e)}")

# Academic suggestions endpoint
@app.post("/api/get-suggestions")
async def get_suggestions(request: SuggestionRequest):
    """
    Generate academic suggestions based on student performance data
    
    This endpoint analyzes student performance metrics and provides
    personalized recommendations for improvement.
    """
    try:
        logger.info(f"Generating suggestions for student: {request.student_id}")
        
        # Prepare student data
        student_data = {
            'student_id': request.student_id,
            'grades': request.grades,
            'attendance': request.attendance,
            'exam_scores': request.exam_scores,
            'current_semester': request.current_semester,
            'department': request.department
        }
        
        # Generate suggestions
        result = suggestion_engine.generate_suggestions(student_data)
        
        logger.info("Suggestions generated successfully")
        return {
            'success': True,
            'data': result,
            'message': 'Academic suggestions generated successfully'
        }
        
    except Exception as e:
        logger.error(f"Error generating suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating suggestions: {str(e)}")

# Additional utility endpoints
@app.get("/api/status")
async def get_service_status():
    """Get detailed service status"""
    return {
        'service': 'Academic AI Service',
        'status': 'running',
        'endpoints': {
            'mindmap': '/api/generate-mindmap',
            'suggestions': '/api/get-suggestions',
            'health': '/health'
        },
        'features': [
            'Syllabus mindmap generation',
            'Academic performance analysis',
            'Personalized study recommendations',
            'Course suggestions'
        ]
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        'success': False,
        'message': 'Endpoint not found',
        'available_endpoints': [
            '/health',
            '/api/generate-mindmap',
            '/api/get-suggestions',
            '/api/status'
        ]
    }

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {str(exc)}")
    return {
        'success': False,
        'message': 'Internal server error',
        'detail': 'Please check the logs for more information'
    }

# Main execution
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )