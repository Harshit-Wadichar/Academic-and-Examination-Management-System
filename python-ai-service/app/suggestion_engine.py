import numpy as np
from typing import Dict, List, Any
import json
import random

class SuggestionEngine:
    def __init__(self):
        # Simple grade mapping
        self.grade_points = {
            'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
        }
        
        self.generic_tips = [
            "Drink plenty of water while studying to stay hydrated.",
            "Take a 5-minute break every 25 minutes (Pomodoro technique).",
            "Explain concepts to a friend to test your understanding.",
            "Get at least 7-8 hours of sleep before exams.",
            "Keep your study area organized and free of distractions.",
            "Use mind maps to visualize connections between topics.",
            "Practice relaxation techniques to manage exam stress.",
            "Review your notes within 24 hours of taking them.",
            "Eat healthy snacks like nuts or fruit for brain energy.",
            "Set specific, achievable goals for each study session."
        ]
    
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
        if grades:
            grade_points = [self.grade_points.get(grade.get('grade', 'F'), 0) for grade in grades]
            gpa = np.mean(grade_points)
        else:
            gpa = 7.5 # Default to 'good' if no data available, to avoid negative bias
        
        # Calculate average attendance
        if isinstance(attendance, (int, float)):
             avg_attendance = float(attendance)
        elif isinstance(attendance, dict) and attendance:
            avg_attendance = np.mean(list(attendance.values()))
        else:
            avg_attendance = 0.0
        
        # Calculate average exam score
        if exam_scores:
            avg_exam_score = np.mean([score.get('score', 0) for score in exam_scores])
        else:
            avg_exam_score = 75.0 # Default to 'good' if no data available
        
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
            'total_courses': len(grades),
            'days_remaining': student_data.get('days_remaining'),
            'upcoming_exams': student_data.get('upcoming_exams', []),
            'syllabus_focus_areas': student_data.get('syllabus_focus_areas', [])
        }
    
    
    def _generate_study_recommendations(self, performance: Dict[str, Any]) -> List[str]:
        """Generate study recommendations based on performance and exam context"""
        recommendations = []
        
        # 0. URGENCY BASED SUGGESTIONS (Exam Context)
        upcoming_exams = performance.get('upcoming_exams', [])
        syllabus_focus = performance.get('syllabus_focus_areas', [])
        
        if not upcoming_exams:
             # DEMO MODE: Inject a mock exam if no real data is found, so the user sees the feature
             upcoming_exams = [{
                 'course': 'Introduction to AI',
                 'date': '2025-01-10',
                 'days_remaining': 5,
                 'total_marks': 100
             }]
             syllabus_focus.append({
                 'course': 'Introduction to AI',
                 'topics': ['Neural Networks', 'Machine Learning Basics', 'Python for AI'],
                 'content_summary': 'Focus on Unit 3: Supervised Learning algorithms.'
             })

        if upcoming_exams:
            # Sort by nearest date
            upcoming_exams.sort(key=lambda x: x.get('days_remaining', 999))
            nearest_exam = upcoming_exams[0]
            days = nearest_exam.get('days_remaining')
            course = nearest_exam.get('course', 'Exam')
            
            # Find syllabus context for this exam
            syllabus_ctx = next((s for s in syllabus_focus if s['course'] == course), None)
            
            if days is not None:
                if days <= 3:
                    recommendations.append(f"⚠️ URGENT: {course} Exam in {days} days!")
                    if syllabus_ctx and syllabus_ctx.get('topics'):
                         topics = syllabus_ctx.get('topics')[:3] # Suggest first 3 topics
                         recommendations.append(f"Focus ONLY on key topics: {', '.join(topics)}.")
                    else:
                         recommendations.append("Review your class notes and past year papers immediately.")
                         
                elif days <= 7:
                    recommendations.append(f"⏰ {course} Assessment next week ({days} days left).")
                    if syllabus_ctx:
                        recommendations.append(f"Study Plan: Break down '{course}' into 2 units per day.")
                    else:
                        recommendations.append("Create a revision timetable now.")
                        
                elif days <= 14:
                    recommendations.append(f"📅 Upcoming {course} Exam in 2 weeks.")
                    recommendations.append("Start with the most difficult topics first.")
                else:
                    # Catch-all for exams further out
                    recommendations.append(f"📌 Preparedness: You have {days} days for {course}.")
                    recommendations.append("Create a long-term study plan. Focus on one unit per week.")

            # Always add a syllabus-based strategy if context is available
            if syllabus_ctx and syllabus_ctx.get('content_summary'):
                 recommendations.append(f"Strategy: {syllabus_ctx.get('content_summary')}")

        # 1. Performance Based
        performance_level = performance.get('performance_level')
        
        if not upcoming_exams:
             if performance_level == 'excellent':
                 recommendations.append("Great job! Consider exploring advanced materials.")
             elif performance_level == 'needs_improvement':
                 recommendations.append("Review daily class concepts to avoid backlog.")
             else:
                 recommendations.append("Maintain a consistent study schedule.")
        
        # FAIL-SAFE: Ensure we never return empty list
        if not recommendations:
            recommendations.append("Create a balanced study routine.")
            recommendations.append("Focus on your weakest subjects first.")

        # VARIETY BOOSTER: Add 2 random generic tips to every response
        generic_picks = random.sample(self.generic_tips, 2)
        
        # LOGIC: 
        # 1. 'urgent_recs' = Directly related to Upcoming Exams (High Priority)
        # 2. 'syllabus_recs' = Strategy from Syllabus (High Priority)
        # 3. 'other_recs' = General performance advice + Random tips (Lower Priority)

        urgent_recs = [r for r in recommendations if "URGENT" in r or "Exam" in r or "Assessment" in r]
        syllabus_recs = [r for r in recommendations if "Strategy:" in r]
        
        # Filter these out from the main list so we don't duplicate
        base_recs = [r for r in recommendations if r not in urgent_recs and r not in syllabus_recs]
        
        # Combine base + generic
        mixed_recs = base_recs + generic_picks
        random.shuffle(mixed_recs) 

        # FINAL ORDER: Urgent -> Syllabus -> shuffled(Base + Generic)
        final_recommendations = urgent_recs + syllabus_recs + mixed_recs

        print(f"DEBUG: Recommendations generated: {final_recommendations}")
        return final_recommendations[:6]  # Return top 6 recommendations
    
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