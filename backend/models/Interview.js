const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  configuration: {
    experience: String,
    mode: String,
    duration: Number,
    skills: [String]
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'terminated'],
    default: 'in-progress'
  },
  currentRound: {
    type: String,
    default: 'aptitude'
  },
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  timeRemaining: Number,
  rounds: {
    aptitude: {
      questions: [{
        questionId: mongoose.Schema.Types.ObjectId,
        question: String,
        modelAnswer: String,
        category: String,
        keywords: [String],
        expectedPoints: [String],
        relatedSkills: [String],
        questionIndex: Number,
        userAnswer: String,
        score: Number,
        feedback: String,
        timeTaken: Number,
        keywordsMatched: [String],
        confidence: Number
      }],
      score: { type: Number, default: 0 },
      completed: { type: Boolean, default: false },
      completedAt: Date
    },
    technical: {
      questions: [{
        questionId: mongoose.Schema.Types.ObjectId,
        question: String,
        modelAnswer: String,
        category: String,
        keywords: [String],
        expectedPoints: [String],
        relatedSkills: [String],
        questionIndex: Number,
        userAnswer: String,
        score: Number,
        feedback: String,
        timeTaken: Number,
        keywordsMatched: [String],
        confidence: Number
      }],
      score: { type: Number, default: 0 },
      completed: { type: Boolean, default: false },
      completedAt: Date
    },
    hr: {
      questions: [{
        questionId: mongoose.Schema.Types.ObjectId,
        question: String,
        modelAnswer: String,
        category: String,
        keywords: [String],
        expectedPoints: [String],
        questionIndex: Number,
        userAnswer: String,
        score: Number,
        feedback: String,
        timeTaken: Number,
        keywordsMatched: [String],
        confidence: Number
      }],
      score: { type: Number, default: 0 },
      completed: { type: Boolean, default: false },
      completedAt: Date
    }
  },
  scores: {
    overall: Number,
    aptitude: Number,
    technical: Number,
    hr: Number
  },
  feedback: {
    summary: String,
    strengths: [String],
    improvements: [String],
    personalityInsights: String
  },
  timing: {
    startedAt: Date,
    endedAt: Date,
    actualDuration: Number,
    timeRemaining: Number
  },
  transcript: [{
    speaker: String,
    message: String,
    timestamp: Date,
    sentiment: String
  }],
  securityLog: [{
    timestamp: Date,
    description: String,
    severity: String,
    questionIndex: Number,
    round: String
  }],
  securityReport: {
    violations: Array,
    totalViolations: Number,
    integrityScore: Number
  },
  securityEnabled: {
    type: Boolean,
    default: false
  },
  terminationReason: String,
  terminatedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Calculate overall score
interviewSchema.methods.calculateOverallScore = function() {
  const scores = [
    this.rounds.aptitude.score,
    this.rounds.technical.score,
    this.rounds.hr.score
  ].filter(s => s > 0);
  
  this.scores = {
    aptitude: this.rounds.aptitude.score,
    technical: this.rounds.technical.score,
    hr: this.rounds.hr.score,
    overall: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  };
};

module.exports = mongoose.model('Interview', interviewSchema);