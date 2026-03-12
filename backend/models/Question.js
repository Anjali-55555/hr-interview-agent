const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['aptitude', 'technical', 'hr'],
    required: true
  },
  subcategory: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  question: {
    type: String,
    required: true
  },
  modelAnswer: String,
  keywords: [String],
  expectedPoints: [String],
  relatedSkills: [{
    type: String,
    index: true
  }],
  timeLimit: Number,
  usage: {
    timesAsked: { type: Number, default: 0 },
    lastAskedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    averageScore: { type: Number, default: 0 }
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Compound indexes for efficient queries
questionSchema.index({ category: 1, relatedSkills: 1, isActive: 1 });
questionSchema.index({ 'usage.timesAsked': 1 });
questionSchema.index({ 'usage.lastAskedTo': 1 });

// Static method to get unique questions for each user
questionSchema.statics.getUniqueQuestionsForUser = async function(
  userId, 
  skills, 
  experience, 
  counts = { aptitude: 10, technical: 10, hr: 10 },
  excludeIds = []
) {
  const questions = {
    aptitude: [],
    technical: [],
    hr: []
  };

  // ========== APTITUDE QUESTIONS ==========
  questions.aptitude = await this.find({
    category: 'aptitude',
    isActive: true,
    _id: { $nin: excludeIds },
    'usage.lastAskedTo': { $ne: userId }
  }).sort({ 'usage.timesAsked': 1, createdAt: -1 }).limit(counts.aptitude * 2);

  // Fallback: include previously asked but least frequently used
  if (questions.aptitude.length < counts.aptitude) {
    const additional = await this.find({
      category: 'aptitude',
      isActive: true,
      _id: { $nin: [...excludeIds, ...questions.aptitude.map(q => q._id)] }
    }).sort({ 'usage.timesAsked': 1 }).limit(counts.aptitude - questions.aptitude.length);
    questions.aptitude.push(...additional);
  }

  // ========== TECHNICAL QUESTIONS ==========
  const skillLowerCase = skills.map(s => s.toLowerCase());
  
  // First: Exact skill matches not asked before
  let techQuestions = await this.find({
    category: 'technical',
    relatedSkills: { $in: skillLowerCase },
    isActive: true,
    _id: { $nin: excludeIds },
    'usage.lastAskedTo': { $ne: userId }
  }).sort({ difficulty: experience === 'fresher' ? 1 : -1 }).limit(counts.technical * 2);

  // Fallback 1: Skill matches that were asked before (least frequently)
  if (techQuestions.length < counts.technical) {
    const additionalTech = await this.find({
      category: 'technical',
      relatedSkills: { $in: skillLowerCase },
      isActive: true,
      _id: { $nin: [...excludeIds, ...techQuestions.map(q => q._id)] }
    }).sort({ 'usage.timesAsked': 1 }).limit(counts.technical - techQuestions.length);
    
    techQuestions.push(...additionalTech);
  }

  // Fallback 2: General technical questions (no specific skills)
  if (techQuestions.length < counts.technical) {
    const generalTech = await this.find({
      category: 'technical',
      $or: [
        { relatedSkills: { $size: 0 } },
        { relatedSkills: { $exists: false } }
      ],
      isActive: true,
      _id: { $nin: [...excludeIds, ...techQuestions.map(q => q._id)] }
    }).limit(counts.technical - techQuestions.length);
    
    techQuestions.push(...generalTech);
  }

  questions.technical = techQuestions;

  // ========== HR QUESTIONS ==========
  questions.hr = await this.find({
    category: 'hr',
    isActive: true,
    _id: { $nin: excludeIds },
    'usage.lastAskedTo': { $ne: userId }
  }).sort({ 'usage.timesAsked': 1 }).limit(counts.hr * 3);

  // Fallback: include previously asked but least frequently used
  if (questions.hr.length < counts.hr) {
    const additional = await this.find({
      category: 'hr',
      isActive: true,
      _id: { $nin: [...excludeIds, ...questions.hr.map(q => q._id)] }
    }).sort({ 'usage.timesAsked': 1 }).limit(counts.hr - questions.hr.length);
    questions.hr.push(...additional);
  }

  // ========== SHUFFLE AND SELECT FINAL QUESTIONS ==========
  const shuffle = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };
  
  const finalQuestions = {
    aptitude: shuffle(questions.aptitude).slice(0, counts.aptitude),
    technical: shuffle(questions.technical).slice(0, counts.technical),
    hr: shuffle(questions.hr).slice(0, counts.hr)
  };

  // ========== MARK QUESTIONS AS ASKED ==========
  const allQuestionIds = [
    ...finalQuestions.aptitude.map(q => q._id),
    ...finalQuestions.technical.map(q => q._id),
    ...finalQuestions.hr.map(q => q._id)
  ];

  await this.updateMany(
    { _id: { $in: allQuestionIds } },
    { 
      $addToSet: { 'usage.lastAskedTo': userId },
      $inc: { 'usage.timesAsked': 1 }
    }
  );

  return finalQuestions;
};

module.exports = mongoose.model('Question', questionSchema);