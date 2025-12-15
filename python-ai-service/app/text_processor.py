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
        """Extract topics from syllabus text"""
        # TODO: Implement more sophisticated topic modeling using LDA or other techniques
        sentences = self.extract_sentences(text)
        topics = []
        
        # Simple pattern matching for common academic topics
        topic_patterns = {
            'introduction': r'introduction|overview|basics|fundamentals',
            'theory': r'theory|theoretical|concept|principle',
            'practical': r'practical|lab|experiment|hands-on|application',
            'advanced': r'advanced|complex|sophisticated|in-depth',
            'assessment': r'assessment|evaluation|test|exam|quiz'
        }
        
        for i, sentence in enumerate(sentences):
            topic_type = 'general'
            for topic, pattern in topic_patterns.items():
                if re.search(pattern, sentence.lower()):
                    topic_type = topic
                    break
            
            topics.append({
                'id': i + 1,
                'title': sentence[:50] + '...' if len(sentence) > 50 else sentence,
                'content': sentence,
                'type': topic_type,
                'keywords': self.extract_keywords(sentence, 3)
            })
        
        return topics[:10]  # Limit to 10 topics
    
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