const aiIntegrationService = require("../services/ai-integration.service");

exports.generateMindMap = async (req, res) => {
  try {
    const { syllabusText, daysRemaining, examDate } = req.body;
    const mindMap = await aiIntegrationService.generateMindMap(syllabusText, daysRemaining, examDate);
    res.status(200).json({ success: true, data: mindMap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const { student_id } = req.body;
    const suggestions = await aiIntegrationService.getSuggestions(student_id);
    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
