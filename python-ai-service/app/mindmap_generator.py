import networkx as nx
from typing import Dict, List, Any
from .text_processor import TextProcessor

class MindmapGenerator:
    def __init__(self):
        self.text_processor = TextProcessor()
    
    def generate_mindmap(self, syllabus_text: str) -> Dict[str, Any]:
        """Generate a mindmap structure from syllabus text"""
        # TODO: Implement more sophisticated mindmap generation using graph algorithms
        
        # Clean and process the text
        cleaned_text = self.text_processor.clean_text(syllabus_text)
        topics = self.text_processor.extract_topics(cleaned_text)
        keywords = self.text_processor.extract_keywords(cleaned_text, 15)
        
        # Create a simple graph structure
        G = nx.Graph()
        
        # Add central node (course/subject)
        central_node = "Course Overview"
        G.add_node(central_node, type="central", level=0)
        
        # Add topic nodes
        topic_nodes = []
        for i, topic in enumerate(topics):
            topic_id = f"topic_{i+1}"
            topic_nodes.append(topic_id)
            G.add_node(topic_id, 
                      title=topic['title'], 
                      type=topic['type'], 
                      level=1,
                      content=topic['content'])
            G.add_edge(central_node, topic_id)
        
        # Add keyword nodes connected to relevant topics
        for keyword in keywords[:10]:  # Limit to 10 keywords
            keyword_id = f"keyword_{keyword}"
            G.add_node(keyword_id, title=keyword, type="keyword", level=2)
            
            # Connect to most relevant topic (simple heuristic)
            best_topic = None
            max_relevance = 0
            for topic_id in topic_nodes:
                topic_data = G.nodes[topic_id]
                if keyword.lower() in topic_data['content'].lower():
                    relevance = topic_data['content'].lower().count(keyword.lower())
                    if relevance > max_relevance:
                        max_relevance = relevance
                        best_topic = topic_id
            
            if best_topic:
                G.add_edge(best_topic, keyword_id)
            else:
                # Connect to central node if no specific topic match
                G.add_edge(central_node, keyword_id)
        
        # Convert graph to JSON-serializable format
        nodes = []
        edges = []
        
        for node_id, node_data in G.nodes(data=True):
            nodes.append({
                'id': node_id,
                'label': node_data.get('title', node_id),
                'type': node_data.get('type', 'default'),
                'level': node_data.get('level', 0),
                'content': node_data.get('content', '')
            })
        
        for edge in G.edges():
            edges.append({
                'source': edge[0],
                'target': edge[1]
            })
        
        # Calculate some basic statistics
        complexity_analysis = self.text_processor.analyze_complexity(syllabus_text)
        
        return {
            'mindmap': {
                'nodes': nodes,
                'edges': edges,
                'metadata': {
                    'total_nodes': len(nodes),
                    'total_edges': len(edges),
                    'topics_count': len(topics),
                    'keywords_count': len(keywords)
                }
            },
            'analysis': {
                'complexity': complexity_analysis,
                'topics': topics[:5],  # Return top 5 topics for preview
                'keywords': keywords[:10]  # Return top 10 keywords
            },
            'suggestions': self._generate_study_suggestions(topics, complexity_analysis)
        }
    
    def _generate_study_suggestions(self, topics: List[Dict], complexity: Dict) -> List[str]:
        """Generate study suggestions based on content analysis"""
        suggestions = []
        
        # Suggestions based on complexity
        if complexity['complexity_level'] == 'high':
            suggestions.append("This syllabus appears complex. Consider breaking it into smaller study sessions.")
            suggestions.append("Focus on understanding fundamental concepts before moving to advanced topics.")
        elif complexity['complexity_level'] == 'medium':
            suggestions.append("This syllabus has moderate complexity. Regular study sessions should be sufficient.")
        else:
            suggestions.append("This syllabus appears straightforward. You can cover it with consistent daily study.")
        
        # Suggestions based on topic types
        topic_types = [topic['type'] for topic in topics]
        if 'practical' in topic_types:
            suggestions.append("This course includes practical components. Allocate time for hands-on practice.")
        if 'theory' in topic_types:
            suggestions.append("Strong theoretical foundation is important for this course.")
        if 'advanced' in topic_types:
            suggestions.append("Some advanced topics are covered. Ensure you have mastered the basics first.")
        
        # General suggestions
        suggestions.extend([
            "Create a study schedule covering all major topics.",
            "Use active learning techniques like summarizing and self-testing.",
            "Form study groups to discuss complex concepts."
        ])
        
        return suggestions[:5]  # Return top 5 suggestions