import numpy as np
from typing import Dict, List, Any
import json

class SuggestionEngine:
    def __init__(self):
        # Simple grade mapping
        self.grade_points = {
            'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
        }
    
    def generate_suggestions(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate academic suggestions based on student performance data"""
        # TODO: Implement more sophisticated ML-based recommendation system
        
        # Extract performance metrics
        performance_analysis = self._analyze_performance(student_data)
        study_recommendations = self._generate_study_recommendations(performance_analysis)
        course_recommendations = self._generate_course_recommendations(student_data, performance_analysis)
        improvement_areas = self._identify_improvement_areas(performance_analysis)
        
        return {
            'performance_analysis': performance_analysis,
            'study_recommendations': study_recommendations,
            'course_recommendations': course_recommendations,
            'improvement_areas': improvement_areas,
            'overall_suggestion': self._generate_overall_suggestion(performance_analysis)
        }
    
    def _analyze_performance(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze student performance metrics"""
        grades = student_data.get('grades', [])
        attendance = student_data.get('attendance', {})
        exam_scores = student_data.get('exam_scores', [])
        
        # Calculate GPA
        if grades:
            grade_points = [self.grade_points.get(grade.get('grade', 'F'), 0) for grade in grades]
            gpa = np.mean(grade_points)
        else:
            gpa = 0.0
        
        # Calculate average attendance
        if attendance:
            avg_attendance = np.mean(list(attendance.values()))
        else:
            avg_attendance = 0.0
        
        # Calculate average exam score
        if exam_scores:
            avg_exam_score = np.mean([score.get('score', 0) for score in exam_scores])
        else:
            avg_exam_score = 0.0
        
        # Determine performance level
        if gpa >= 8.5 and avg_attendance >= 85 and avg_exam_score >= 85:
            performance_level = 'excellent'
        elif gpa >= 7.0 and avg_attendance >= 75 and avg_exam_score >= 70:
            performance_level = 'good'
        elif gpa >= 5.5 and avg_attendance >= 65 and avg_exam_score >= 60:
            performance_level = 'average'
        else:
            performance_level = 'needs_improvement'
        
        # Identify strengths and weaknesses
        strengths = []
        weaknesses = []
        
        if gpa >= 8.0:
            strengths.append('Strong academic performance')
        elif gpa < 6.0:
            weaknesses.append('Academic performance needs improvement')
        
        if avg_attendance >= 85:
            strengths.append('Excellent attendance record')
        elif avg_attendance < 70:
            weaknesses.append('Poor attendance affecting performance')
        
        if avg_exam_score >= 80:
            strengths.append('Good exam performance')
        elif avg_exam_score < 60:
            weaknesses.append('Exam scores need improvement')
        
        return {
            'gpa': round(gpa, 2),
            'avg_attendance': round(avg_attendance, 2),
            'avg_exam_score': round(avg_exam_score, 2),
            'performance_level': performance_level,
            'strengths': strengths,
            'weaknesses': weaknesses,
            'total_courses': len(grades)
        }
    
    def _generate_study_recommendations(self, performance: Dict[str, Any]) -> List[str]:
        """Generate study recommendations based on performance"""
        recommendations = []
        
        performance_level = performance['performance_level']
        
        if performance_level == 'excellent':
            recommendations.extend([
                "Maintain your excellent study habits",
                "Consider mentoring other students",
                "Explore advanced topics in your field of interest",
                "Participate in research projects or competitions"
            ])
        elif performance_level == 'good':
            recommendations.extend([
                "Continue your current study approach with minor improvements",
                "Focus on time management to optimize study sessions",
                "Join study groups for collaborative learning",
                "Set specific goals for each subject"
            ])
        elif performance_level == 'average':
            recommendations.extend([
                "Develop a structured study schedule",
                "Use active learning techniques like flashcards and practice tests",
                "Seek help from professors during office hours",
                "Form study groups with high-performing classmates"
            ])
        else:  # needs_improvement
            recommendations.extend([
                "Create a detailed study plan with daily goals",
                "Attend all classes and take comprehensive notes",
                "Schedule regular meetings with academic advisors",
                "Consider tutoring services for challenging subjects",
                "Eliminate distractions during study time"
            ])
        
        # Specific recommendations based on weaknesses
        if 'Poor attendance affecting performance' in performance['weaknesses']:
            recommendations.append("Improve attendance - aim for at least 85% in all courses")
        
        if 'Exam scores need improvement' in performance['weaknesses']:
            recommendations.extend([
                "Practice past exam papers regularly",
                "Review and understand marking schemes",
                "Develop better exam strategies and time management"
            ])
        
        return recommendations[:6]  # Return top 6 recommendations
    
    def _generate_course_recommendations(self, student_data: Dict, performance: Dict) -> List[str]:
        """Generate course recommendations"""
        recommendations = []
        current_semester = student_data.get('current_semester', 1)
        department = student_data.get('department', '')
        
        # TODO: Implement more sophisticated course recommendation based on performance patterns
        
        if performance['performance_level'] in ['excellent', 'good']:
            recommendations.extend([
                "Consider taking advanced electives in your area of interest",
                "Explore interdisciplinary courses to broaden your knowledge",
                "Look into honors or accelerated programs"
            ])
        else:
            recommendations.extend([
                "Focus on core subjects before taking electives",
                "Consider lighter course load to improve performance",
                "Take prerequisite courses if struggling with advanced topics"
            ])
        
        # Department-specific recommendations
        if 'computer' in department.lower():
            recommendations.append("Consider programming and software development courses")
        elif 'business' in department.lower():
            recommendations.append("Focus on analytical and communication skills courses")
        
        return recommendations[:4]  # Return top 4 recommendations
    
    def _identify_improvement_areas(self, performance: Dict) -> List[Dict[str, Any]]:
        """Identify specific areas for improvement"""
        areas = []
        
        if performance['gpa'] < 7.0:
            areas.append({
                'area': 'Academic Performance',
                'current_score': performance['gpa'],
                'target_score': 7.5,
                'priority': 'high',
                'suggestions': [
                    'Attend all lectures and tutorials',
                    'Complete assignments on time',
                    'Seek help when needed'
                ]
            })
        
        if performance['avg_attendance'] < 80:
            areas.append({
                'area': 'Class Attendance',
                'current_score': performance['avg_attendance'],
                'target_score': 85,
                'priority': 'high',
                'suggestions': [
                    'Set reminders for classes',
                    'Understand the importance of regular attendance',
                    'Communicate with professors about any issues'
                ]
            })
        
        if performance['avg_exam_score'] < 70:
            areas.append({
                'area': 'Exam Performance',
                'current_score': performance['avg_exam_score'],
                'target_score': 75,
                'priority': 'medium',
                'suggestions': [
                    'Practice with past papers',
                    'Improve time management during exams',
                    'Review exam techniques and strategies'
                ]
            })
        
        return areas
    
    def _generate_overall_suggestion(self, performance: Dict) -> str:
        """Generate an overall suggestion summary"""
        performance_level = performance['performance_level']
        
        if performance_level == 'excellent':
            return "You're performing excellently! Continue your current approach and consider taking on leadership roles or advanced challenges."
        elif performance_level == 'good':
            return "You're doing well! With some focused improvements, you can achieve excellent performance."
        elif performance_level == 'average':
            return "Your performance is average. Focus on developing better study habits and seeking help when needed."
        else:
            return "Your performance needs significant improvement. Consider meeting with academic advisors and developing a comprehensive improvement plan."