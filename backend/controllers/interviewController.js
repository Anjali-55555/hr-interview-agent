const { v4: uuidv4 } = require('uuid');
const Interview = require('../models/Interview');
const Question = require('../models/Question');
const User = require('../models/User');
const aiService = require('../services/aiService');

// Start new interview
exports.startInterview = async (req, res) => {
  try {
    const { experience, mode, duration, skills, securityEnabled, excludeQuestionIds } = req.body;
    const userId = req.userId;

    // Get 10 questions for each round
    const questions = await Question.getUniqueQuestionsForUser(
      userId,
      skills,
      experience,
      { aptitude: 10, technical: 10, hr: 10 },
      excludeQuestionIds || []
    );

    // Create interview session
    const sessionId = uuidv4();
    const interview = new Interview({
      user: userId,
      sessionId,
      configuration: {
        experience,
        mode,
        duration,
        skills
      },
      status: 'in-progress',
      currentRound: 'aptitude',
      currentQuestionIndex: 0,
      timing: {
        startedAt: new Date(),
        timeRemaining: duration * 60
      },
      rounds: {
        aptitude: {
          questions: questions.aptitude.map((q, idx) => ({
            questionId: q._id,
            question: q.question,
            modelAnswer: q.modelAnswer,
            category: 'aptitude',
            keywords: q.keywords,
            expectedPoints: q.expectedPoints,
            questionIndex: idx
          })),
          score: 0,
          completed: false
        },
        technical: {
          questions: questions.technical.map((q, idx) => ({
            questionId: q._id,
            question: q.question,
            modelAnswer: q.modelAnswer,
            category: 'technical',
            keywords: q.keywords,
            expectedPoints: q.expectedPoints,
            relatedSkills: q.relatedSkills,
            questionIndex: idx
          })),
          score: 0,
          completed: false
        },
        hr: {
          questions: questions.hr.map((q, idx) => ({
            questionId: q._id,
            question: q.question,
            modelAnswer: q.modelAnswer,
            category: 'hr',
            keywords: q.keywords,
            expectedPoints: q.expectedPoints,
            questionIndex: idx
          })),
          score: 0,
          completed: false
        }
      },
      securityLog: [],
      securityEnabled: securityEnabled || false
    });

    await interview.save();

    // Add to user's interviews
    await User.findByIdAndUpdate(userId, {
      $push: { interviews: interview._id }
    });

    // Notify via socket
    const io = req.app.get('io');
    io.to(sessionId).emit('interview-started', { sessionId });

    // Return format matching frontend expectations
    res.json({
      success: true,
      sessionId,
      interviewId: interview._id,
      configuration: interview.configuration,
      questions: {
        aptitude: questions.aptitude.map(q => ({
          _id: q._id,
          question: q.question,
          modelAnswer: q.modelAnswer,
          category: 'aptitude',
          difficulty: q.difficulty,
          keywords: q.keywords,
          expectedPoints: q.expectedPoints
        })),
        technical: questions.technical.map(q => ({
          _id: q._id,
          question: q.question,
          modelAnswer: q.modelAnswer,
          category: 'technical',
          difficulty: q.difficulty,
          keywords: q.keywords,
          expectedPoints: q.expectedPoints,
          relatedSkills: q.relatedSkills
        })),
        hr: questions.hr.map(q => ({
          _id: q._id,
          question: q.question,
          modelAnswer: q.modelAnswer,
          category: 'hr',
          difficulty: q.difficulty,
          keywords: q.keywords,
          expectedPoints: q.expectedPoints
        }))
      }
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ error: 'Failed to start interview' });
  }
};
// Submit answers
exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId, round, questionIndex, answer, timeTaken, securityData } = req.body;

    const interview = await Interview.findOne({ sessionId, user: req.userId });
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Get question details
    const questionData = interview.rounds[round].questions[questionIndex];
    if (!questionData) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Evaluate answer
    const evaluation = await aiService.evaluateAnswer(
      questionData.question,
      answer,
      questionData.modelAnswer,
      round,
      questionData.keywords || [],
      questionData.expectedPoints || []
    );

    // Ensure score is properly set
    const score = Math.min(100, Math.max(0, evaluation.score || 0));

    // Update answer with score
    interview.rounds[round].questions[questionIndex].userAnswer = answer;
    interview.rounds[round].questions[questionIndex].score = score;
    interview.rounds[round].questions[questionIndex].feedback = evaluation.feedback;
    interview.rounds[round].questions[questionIndex].timeTaken = timeTaken;
    interview.rounds[round].questions[questionIndex].keywordsMatched = evaluation.keywordsMatched;
    interview.rounds[round].questions[questionIndex].confidence = evaluation.confidence;

    // Log security data 
    if (securityData) {
      interview.securityLog.push({
        timestamp: new Date(),
        violations: securityData.violations || [],
        typingPattern: securityData.typingPattern || [],
        isSuspectedAI: securityData.isSuspectedAI || false
      });
    }

    // Add to transcript
    interview.transcript.push({
      speaker: 'user',
      message: answer,
      timestamp: new Date(),
      sentiment: evaluation.sentiment
    });

    await interview.save();

    // Check if this is the last question of the round
    const totalQuestions = interview.rounds[round].questions.length;
    const isLastQuestion = questionIndex >= totalQuestions - 1;
    
    let isRoundComplete = false;
    let nextRound = null;
    let isInterviewComplete = false;

    if (isLastQuestion) {
      // Mark current round as complete
      interview.rounds[round].completed = true;
      interview.rounds[round].completedAt = new Date();
      
      // Calculate round score
      const roundQuestions = interview.rounds[round].questions;
      const roundScore = roundQuestions.reduce((acc, q) => acc + (q.score || 0), 0) / roundQuestions.length;
      interview.rounds[round].score = Math.round(roundScore);
      
      isRoundComplete = true;

      // Determine next round
      const roundOrder = ['aptitude', 'technical', 'hr'];
      const currentRoundIndex = roundOrder.indexOf(round);
      
      console.log(`Round ${round} completed. Current index: ${currentRoundIndex}`);

      if (currentRoundIndex < roundOrder.length - 1) {
        // Move to next round
        nextRound = roundOrder[currentRoundIndex + 1];
        interview.currentRound = nextRound;
        interview.currentQuestionIndex = 0;
        
        // Check if next round has questions
        if (!interview.rounds[nextRound].questions || interview.rounds[nextRound].questions.length === 0) {
          console.log(`Warning: ${nextRound} round has no questions`);
          // If HR has no questions, end interview
          if (nextRound === 'hr') {
            isInterviewComplete = true;
            nextRound = null;
          }
        }
        
        console.log(`Moving to ${nextRound} round`);
      } else {
        // All rounds complete
        isInterviewComplete = true;
        console.log('All rounds complete - ending interview');
      }

      await interview.save();
    } else {
      // Move to next question in same round
      interview.currentQuestionIndex = questionIndex + 1;
      await interview.save();
    }

    // Socket notification
    const io = req.app.get('io');
    io.to(sessionId).emit('answer-submitted', {
      round,
      questionIndex,
      score: score,
      isRoundComplete,
      nextRound,
      isInterviewComplete
    });

    // Return response
    res.json({
      success: true,
      evaluation: {
        score: score,
        feedback: evaluation.feedback,
        isRoundComplete: isRoundComplete,
        nextRound: nextRound,
        isInterviewComplete: isInterviewComplete,
        confidence: evaluation.confidence,
        keywordsMatched: evaluation.keywordsMatched,
        sentiment: evaluation.sentiment
      }
    });

  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Failed to submit answer: ' + error.message });
  }
};
// Get next question
exports.getNextQuestion = async (req, res) => {
  try {
    const { sessionId, currentRound, currentIndex } = req.params;

    const interview = await Interview.findOne({ sessionId, user: req.userId });
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    const round = interview.rounds[currentRound];
    const nextIndex = parseInt(currentIndex) + 1;

    if (nextIndex >= round.questions.length) {
      // Move to next round or finish
      const rounds = ['aptitude', 'technical', 'hr'];
      const currentRoundIndex = rounds.indexOf(currentRound);

      if (currentRoundIndex < rounds.length - 1) {
        const nextRound = rounds[currentRoundIndex + 1];
        res.json({
          roundComplete: true,
          nextRound,
          nextQuestion: interview.rounds[nextRound].questions[0]
        });
      } else {
        res.json({ interviewComplete: true });
      }
    } else {
      res.json({
        question: round.questions[nextIndex],
        index: nextIndex
      });
    }
  } catch (error) {
    console.error('Get next question error:', error);
    res.status(500).json({ error: 'Failed to get next question' });
  }
};

// Update timing
exports.updateTiming = async (req, res) => {
  try {
    const { sessionId, timeRemaining } = req.body;

    await Interview.findOneAndUpdate(
      { sessionId, user: req.userId },
      { 'timing.timeRemaining': timeRemaining }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update timing error:', error);
    res.status(500).json({ error: 'Failed to update timing' });
  }
};

// End interview
exports.endInterview = async (req, res) => {
  try {
    const { sessionId, securityReport } = req.body;

    const interview = await Interview.findOne({ sessionId, user: req.userId });
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Calculate all scores
    ['aptitude', 'technical', 'hr'].forEach(round => {
      const questions = interview.rounds[round].questions;
      if (questions.length > 0) {
        const score = questions.reduce((acc, q) => acc + (q.score || 0), 0) / questions.length;
        interview.rounds[round].score = Math.round(score);
      }
    });

    // Calculate overall
    interview.calculateOverallScore();

    // Generate comprehensive feedback
    const feedback = await aiService.generateComprehensiveFeedback(interview);
    interview.feedback = feedback;

    // Update timing
    interview.timing.endedAt = new Date();
    interview.timing.actualDuration = Math.floor(
      (interview.timing.endedAt - interview.timing.startedAt) / 1000
    );

    // Add security report if provided
    if (securityReport) {
      interview.securityReport = securityReport;
    }

    interview.status = 'completed';
    interview.completedAt = new Date();

    await interview.save();

    // Update user statistics
    const user = await User.findById(req.userId);
    await user.updateStatistics(interview.scores.overall, interview.timing.actualDuration / 60);

    // Socket notification
    const io = req.app.get('io');
    io.to(sessionId).emit('interview-completed', {
      sessionId,
      overallScore: interview.scores.overall
    });

    // Return format matching frontend expectations
    res.json({
      success: true,
      results: {
        scores: interview.scores,
        feedback: interview.feedback,
        transcript: interview.transcript,
        securityReport: interview.securityReport
      }
    });
  } catch (error) {
    console.error('End interview error:', error);
    res.status(500).json({ error: 'Failed to end interview' });
  }
};

// Get interview history
exports.getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.userId })
      .select('sessionId status scores configuration completedAt createdAt')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(interviews);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// Get detailed interview results
exports.getInterviewDetails = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.userId
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json(interview);
  } catch (error) {
    console.error('Get details error:', error);
    res.status(500).json({ error: 'Failed to fetch details' });
  }
};

// Record security violation
exports.recordViolation = async (req, res) => {
  try {
    const { sessionId, violation } = req.body;
    
    const interview = await Interview.findOne({ sessionId, user: req.userId });
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    interview.securityLog.push({
      timestamp: new Date(violation.timestamp),
      description: violation.description,
      severity: violation.severity,
      questionIndex: violation.questionIndex,
      round: violation.round
    });
    
    await interview.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Record violation error:', error);
    res.status(500).json({ error: 'Failed to record violation' });
  }
};

// Sync interview state (for persistence)
exports.syncState = async (req, res) => {
  try {
    const { sessionId, currentRound, questionIndex, timeRemaining, securityViolations } = req.body;
    
    const interview = await Interview.findOne({ sessionId, user: req.userId });
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    interview.currentRound = currentRound;
    interview.currentQuestionIndex = questionIndex;
    interview.timeRemaining = timeRemaining;
    
    if (securityViolations && securityViolations.length > 0) {
      interview.securityLog.push(...securityViolations.map(v => ({
        timestamp: new Date(v.timestamp),
        description: v.description,
        severity: v.severity
      })));
    }
    
    await interview.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync state' });
  }
};

// Terminate interview due to violation
exports.terminateInterview = async (req, res) => {
  try {
    const { sessionId, reason, violations } = req.body;
    
    const interview = await Interview.findOne({ sessionId, user: req.userId });
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    interview.status = 'terminated';
    interview.terminationReason = reason;
    interview.terminatedAt = new Date();
    
    if (violations) {
      interview.securityLog.push(...violations.map(v => ({
        timestamp: new Date(v.timestamp),
        description: v.description,
        severity: v.severity
      })));
    }
    
    await interview.save();
    
    // Socket notification
    const io = req.app.get('io');
    io.to(sessionId).emit('interview-terminated', { reason });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Terminate error:', error);
    res.status(500).json({ error: 'Failed to terminate interview' });
  }
};