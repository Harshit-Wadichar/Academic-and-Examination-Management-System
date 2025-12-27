import re
import nltk
from textblob import TextBlob
from typing import List, Dict, Any

# Download required NLTK data (run once)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class TextProcessor:
    def __init__(self):
        self.stop_words = set(nltk.corpus.stopwords.words('english'))
    
    def clean_text(self, text: str) -> str:
        """Clean and preprocess text"""
        # Remove extra whitespace and newlines
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s.,;:!?-]', '', text)
        return text.strip()
    
    def extract_sentences(self, text: str) -> List[str]:
        """Extract sentences from text"""
        blob = TextBlob(text)
        return [str(sentence).strip() for sentence in blob.sentences if len(str(sentence).strip()) > 10]
    
    def extract_keywords(self, text: str, max_keywords: int = 10) -> List[str]:
        """Extract keywords from text using simple frequency analysis"""
        # TODO: Implement more sophisticated keyword extraction using TF-IDF or other NLP techniques
        blob = TextBlob(text.lower())
        words = [word for word in blob.words if word not in self.stop_words and len(word) > 3]
        
        # Simple frequency count
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        # Sort by frequency and return top keywords
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, freq in sorted_words[:max_keywords]]
    
    def extract_topics(self, text: str) -> List[Dict[str, Any]]:
        """Extract hierarchically structured topics from syllabus text"""
        lines = text.split('\n')
        topics = []
        current_unit = None
        
        # Regex patterns for structural elements
        unit_pattern = re.compile(r'^(unit|module|chapter|section)\s+\d+[:.]?\s*', re.IGNORECASE)
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Check for Unit header
            unit_match = unit_pattern.match(line)
            if unit_match:
                # Start new unit
                current_unit = {
                    'id': f"unit_{len(topics) + 1}",
                    'title': line,
                    'type': 'unit',
                    'content': line,
                    'subtopics': []
                }
                topics.append(current_unit)
            elif current_unit:
                # Add content as subtopic to current unit if it's substantial
                if len(line) > 5 and not unit_pattern.match(line):
                     subtopic = {
                        'id': f"{current_unit['id']}_sub_{len(current_unit['subtopics']) + 1}",
                        'title': line, # Use full line as title for subtopics
                        'type': 'topic',
                        'content': line
                     }
                     current_unit['subtopics'].append(subtopic)
            else:
                # Content before any unit (Introduction or Course Info)
                # Group them into a generic "Overview" unit if not already present
                if not topics or topics[0]['title'] != "Course Overview":
                     topics.insert(0, {
                        'id': "unit_0",
                        'title': "Course Overview",
                        'type': 'unit',
                        'content': "General course information",
                        'subtopics': []
                     })
                
                topics[0]['subtopics'].append({
                    'id': f"unit_0_sub_{len(topics[0]['subtopics']) + 1}",
                    'title': line,
                    'type': 'topic',
                    'content': line
                })
        
        return topics
    
    def analyze_complexity(self, text: str) -> Dict[str, Any]:
        """Analyze text complexity"""
        blob = TextBlob(text)
        sentences = blob.sentences
        words = blob.words
        
        # Basic complexity metrics
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
        
        # Determine complexity level
        if avg_sentence_length > 20 and avg_word_length > 6:
            complexity = 'high'
        elif avg_sentence_length > 15 and avg_word_length > 5:
            complexity = 'medium'
        else:
            complexity = 'low'
        
        return {
            'complexity_level': complexity,
            'avg_sentence_length': round(avg_sentence_length, 2),
            'avg_word_length': round(avg_word_length, 2),
            'total_sentences': len(sentences),
            'total_words': len(words)
        }