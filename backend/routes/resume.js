const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Parse resume and extract skills
router.post('/parse', authMiddleware, upload.single('resume'), resumeController.parseResume);

// Get skill suggestions
router.get('/skills/suggestions', authMiddleware, resumeController.getSkillSuggestions);

module.exports = router;