const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const authMiddleware = require('../middleware/auth');

// Start new interview
router.post('/start', authMiddleware, interviewController.startInterview);

// Submit answer
router.post('/answer', authMiddleware, interviewController.submitAnswer);

// Get next question
router.get('/next/:sessionId/:currentRound/:currentIndex', authMiddleware, interviewController.getNextQuestion);

// Update timing
router.post('/timing', authMiddleware, interviewController.updateTiming);

// End interview
router.post('/end', authMiddleware, interviewController.endInterview);

// Get interview history
router.get('/history', authMiddleware, interviewController.getInterviewHistory);

// Get detailed results
router.get('/details/:interviewId', authMiddleware, interviewController.getInterviewDetails);

// Record security violation
router.post('/violation', authMiddleware, interviewController.recordViolation);

// Sync interview state (for persistence)
router.post('/sync', authMiddleware, interviewController.syncState);

// Terminate interview due to violation
router.post('/terminate', authMiddleware, interviewController.terminateInterview);

// Get skill suggestions for autocomplete
router.get('/skills/suggestions', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }
    
    const suggestions = [
      { name: 'JavaScript', category: 'Programming' },
      { name: 'Python', category: 'Programming' },
      { name: 'React', category: 'Frontend' },
      { name: 'Node.js', category: 'Backend' },
      { name: 'Machine Learning', category: 'AI/ML' },
      { name: 'SQL', category: 'Database' },
      { name: 'AWS', category: 'Cloud' },
      { name: 'Docker', category: 'DevOps' },
      { name: 'Git', category: 'Tools' },
      { name: 'Java', category: 'Programming' },
      { name: 'C++', category: 'Programming' },
      { name: 'C#', category: 'Programming' },
      { name: 'TypeScript', category: 'Programming' },
      { name: 'Angular', category: 'Frontend' },
      { name: 'Vue.js', category: 'Frontend' },
      { name: 'Express', category: 'Backend' },
      { name: 'Django', category: 'Backend' },
      { name: 'Flask', category: 'Backend' },
      { name: 'MongoDB', category: 'Database' },
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'MySQL', category: 'Database' },
      { name: 'Redis', category: 'Database' },
      { name: 'Kubernetes', category: 'DevOps' },
      { name: 'Jenkins', category: 'DevOps' },
      { name: 'Terraform', category: 'DevOps' },
      { name: 'Deep Learning', category: 'AI/ML' },
      { name: 'TensorFlow', category: 'AI/ML' },
      { name: 'PyTorch', category: 'AI/ML' },
      { name: 'NLP', category: 'AI/ML' },
      { name: 'Computer Vision', category: 'AI/ML' },
      { name: 'Data Analysis', category: 'Data' },
      { name: 'Data Science', category: 'Data' },
      { name: 'Tableau', category: 'Data' },
      { name: 'Power BI', category: 'Data' },
      { name: 'React Native', category: 'Mobile' },
      { name: 'Flutter', category: 'Mobile' },
      { name: 'Android', category: 'Mobile' },
      { name: 'iOS', category: 'Mobile' },
      { name: 'Swift', category: 'Mobile' },
      { name: 'Kotlin', category: 'Mobile' },
      { name: 'Jest', category: 'Testing' },
      { name: 'Cypress', category: 'Testing' },
      { name: 'Selenium', category: 'Testing' },
      { name: 'Agile', category: 'Methodology' },
      { name: 'Scrum', category: 'Methodology' },
      { name: 'DevOps', category: 'Methodology' },
      { name: 'CI/CD', category: 'Methodology' },
      { name: 'Microservices', category: 'Architecture' },
      { name: 'REST API', category: 'Architecture' },
      { name: 'GraphQL', category: 'Architecture' }
    ].filter(s => s.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
    
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

module.exports = router;