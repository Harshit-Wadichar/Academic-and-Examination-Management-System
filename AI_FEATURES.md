# AI Features Documentation

## Overview
The Academic and Examination Management System includes AI-powered features to enhance academic learning and performance analysis.

## Available AI Features

### 1. Mindmap Generation
**Location**: Syllabus Page → Generate Mindmap

**What it does:**
- Analyzes syllabus content and creates interactive mindmaps
- Extracts key topics, concepts, and relationships
- Generates a visual representation of course structure

**How to use:**
1. Navigate to Syllabus page
2. Select or view a syllabus
3. Click "Generate Mindmap" button
4. The system processes the syllabus content
5. View the generated mindmap with:
   - Central topic (Course Overview)
   - Main topics and subtopics
   - Keywords and concepts
   - Connections between topics

**Benefits:**
- Visual learning aid
- Better understanding of course structure
- Quick revision tool
- Identifies key concepts automatically

**Technical Details:**
- Uses NLP (Natural Language Processing)
- TextBlob for text analysis
- NetworkX for graph structure
- Keyword extraction algorithms

---

### 2. Academic Suggestions Engine
**Location**: Student Dashboard → AI Suggestions

**What it does:**
- Analyzes student performance data
- Provides personalized study recommendations
- Suggests improvement areas
- Recommends courses based on performance

**How to use:**
1. Go to Student Dashboard
2. Scroll to "AI Suggestions" section
3. The system analyzes:
   - Grades and exam scores
   - Attendance records
   - Course performance
4. View personalized recommendations:
   - Study tips
   - Weak areas to focus on
   - Recommended courses
   - Performance improvement strategies

**Benefits:**
- Personalized learning recommendations
- Identifies weak areas automatically
- Suggests improvement strategies
- Course recommendations based on performance

**Data Analyzed:**
- Exam scores
- Assignment grades
- Attendance percentage
- Course completion rates
- Performance trends

**Recommendation Types:**
1. **Study Recommendations**: Tips for better study habits
2. **Course Recommendations**: Suggest courses based on performance
3. **Improvement Areas**: Identify subjects needing attention
4. **Performance Analysis**: Overall performance insights

---

## AI Service Architecture

### Backend Service
- **Port**: 8000
- **Framework**: FastAPI (Python)
- **Endpoints**:
  - `POST /api/generate-mindmap` - Generate mindmap from syllabus
  - `POST /api/get-suggestions` - Get academic suggestions
  - `GET /health` - Service health check

### Request Format

**Mindmap Generation:**
```json
{
  "syllabus_text": "Course syllabus content...",
  "course_name": "Computer Science 101",
  "department": "Computer Science"
}
```

**Academic Suggestions:**
```json
{
  "student_id": "student123",
  "grades": [{"course": "Math", "grade": "A"}],
  "attendance": {"Math": 95, "Science": 88},
  "exam_scores": [{"exam": "Midterm", "score": 85}],
  "current_semester": 3,
  "department": "Engineering"
}
```

---

## Usage Examples

### Example 1: Generate Mindmap
```javascript
// Frontend API call
const response = await api.post('/ai/generate-mindmap', {
  syllabus_text: syllabusContent,
  course_name: 'Data Structures',
  department: 'Computer Science'
});
```

### Example 2: Get Suggestions
```javascript
// Frontend API call
const response = await api.post('/ai/get-suggestions', {
  student_id: user.id,
  grades: studentGrades,
  attendance: attendanceData,
  exam_scores: examResults,
  current_semester: 2
});
```

---

## Future AI Features (Planned)

1. **Predictive Analytics**
   - Predict exam performance
   - Identify at-risk students
   - Course recommendation engine

2. **Automated Grading**
   - AI-powered assignment grading
   - Feedback generation
   - Performance analysis

3. **Intelligent Chatbot**
   - Answer student queries
   - Course information
   - Academic guidance

4. **Learning Path Optimization**
   - Personalized learning paths
   - Adaptive learning recommendations
   - Progress tracking

---

## Troubleshooting

### Issue: Mindmap not generating
**Solution:**
- Ensure syllabus content is at least 50 characters
- Check AI service is running on port 8000
- Verify backend can connect to AI service

### Issue: Suggestions not appearing
**Solution:**
- Ensure student has performance data
- Check all required fields are provided
- Verify AI service connectivity

### Service Status
Check AI service health:
```
GET http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Academic AI Service is running",
  "version": "1.0.0"
}
```

---

## Technical Stack

- **Python 3.11+**
- **FastAPI**: Web framework
- **TextBlob**: NLP library
- **NLTK**: Natural language toolkit
- **NetworkX**: Graph algorithms
- **Uvicorn**: ASGI server

---

## API Documentation

Full API documentation available at:
```
http://localhost:8000/docs
```
(Swagger UI interface when AI service is running)

