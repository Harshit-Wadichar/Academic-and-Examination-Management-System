#!/usr/bin/env python3
"""
Simple test script to verify the AI service functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.mindmap_generator import MindmapGenerator
from app.suggestion_engine import SuggestionEngine

def test_mindmap_generation():
    """Test mindmap generation"""
    print("Testing Mindmap Generation...")
    
    generator = MindmapGenerator()
    
    sample_syllabus = """
    Introduction to Computer Science
    
    This course covers fundamental concepts in computer science including:
    
    1. Programming Fundamentals
       - Variables and data types
       - Control structures
       - Functions and procedures
    
    2. Data Structures
       - Arrays and lists
       - Stacks and queues
       - Trees and graphs
    
    3. Algorithms
       - Sorting algorithms
       - Search algorithms
       - Algorithm complexity
    
    4. Object-Oriented Programming
       - Classes and objects
       - Inheritance and polymorphism
       - Encapsulation and abstraction
    
    Assessment Methods:
    - Assignments (30%)
    - Midterm Exam (30%)
    - Final Exam (40%)
    """
    
    try:
        result = generator.generate_mindmap(sample_syllabus)
        print("SUCCESS: Mindmap generation successful!")
        print(f"   - Generated {len(result['mindmap']['nodes'])} nodes")
        print(f"   - Generated {len(result['mindmap']['edges'])} edges")
        print(f"   - Identified {len(result['analysis']['topics'])} topics")
        print(f"   - Extracted {len(result['analysis']['keywords'])} keywords")
        return True
    except Exception as e:
        print(f"FAILED: Mindmap generation failed: {e}")
        return False

def test_suggestion_engine():
    """Test suggestion engine"""
    print("\nTesting Suggestion Engine...")
    
    engine = SuggestionEngine()
    
    sample_student_data = {
        'student_id': 'STU001',
        'grades': [
            {'course': 'Mathematics', 'grade': 'B+'},
            {'course': 'Physics', 'grade': 'A'},
            {'course': 'Chemistry', 'grade': 'B'},
            {'course': 'Computer Science', 'grade': 'A+'}
        ],
        'attendance': {
            'Mathematics': 85.5,
            'Physics': 92.0,
            'Chemistry': 78.5,
            'Computer Science': 95.0
        },
        'exam_scores': [
            {'exam': 'Math Midterm', 'score': 78},
            {'exam': 'Physics Final', 'score': 88},
            {'exam': 'CS Project', 'score': 95}
        ],
        'current_semester': 3,
        'department': 'Computer Science'
    }
    
    try:
        result = engine.generate_suggestions(sample_student_data)
        print("SUCCESS: Suggestion generation successful!")
        print(f"   - Performance level: {result['performance_analysis']['performance_level']}")
        print(f"   - GPA: {result['performance_analysis']['gpa']}")
        print(f"   - Generated {len(result['study_recommendations'])} study recommendations")
        print(f"   - Generated {len(result['course_recommendations'])} course recommendations")
        return True
    except Exception as e:
        print(f"FAILED: Suggestion generation failed: {e}")
        return False

def main():
    """Run all tests"""
    print("Testing Academic AI Service Components\n")
    
    tests_passed = 0
    total_tests = 2
    
    if test_mindmap_generation():
        tests_passed += 1
    
    if test_suggestion_engine():
        tests_passed += 1
    
    print(f"\nTest Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("All tests passed! AI service is ready.")
        return True
    else:
        print("Some tests failed. Please check the implementation.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)