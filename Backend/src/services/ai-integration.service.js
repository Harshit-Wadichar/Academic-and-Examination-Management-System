const axios = require("axios");

exports.generateMindMap = async (syllabusText) => {
  try {
    // TODO: Integrate with Python AI service
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/api/generate-mindmap`,
      {
        syllabusText,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating mind map:", error);
    // Fallback: simple text processing
    return this.simpleMindMapGeneration(syllabusText);
  }
};

exports.getSuggestions = async (performanceData) => {
  try {
    // TODO: Integrate with Python AI service
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/api/get-suggestions`,
      {
        performanceData,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting suggestions:", error);
    // Fallback: simple suggestions
    return this.simpleSuggestions(performanceData);
  }
};

exports.simpleMindMapGeneration = (text) => {
  // Simple implementation: split text into topics
  const topics = text.split("\n").filter((line) => line.trim().length > 0);
  return {
    nodes: topics.map((topic, index) => ({
      id: index + 1,
      label: topic.trim(),
      x: Math.random() * 400,
      y: Math.random() * 400,
    })),
    edges: [],
  };
};

exports.simpleSuggestions = (data) => {
  // Simple implementation: basic advice based on grades
  const avgGrade =
    data.grades.reduce((sum, grade) => sum + grade, 0) / data.grades.length;
  if (avgGrade >= 85) {
    return ["Excellent performance! Keep up the good work."];
  } else if (avgGrade >= 70) {
    return ["Good performance. Focus on weak areas to improve further."];
  } else {
    return ["Consider seeking additional help in challenging subjects."];
  }
};
