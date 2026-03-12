const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    phone: String,
    location: String,
    linkedin: String,
    portfolio: String
  },
  skills: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    extractedFromResume: { type: Boolean, default: false }
  }],
  experience: {
    level: {
      type: String,
      enum: ['fresher', 'experienced'],
      default: 'fresher'
    },
    years: Number,
    currentRole: String,
    company: String
  },
  education: [{
    degree: String,
    institution: String,
    year: Number,
    score: String
  }],
  interviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  }],
  statistics: {
    totalInterviews: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 } // in minutes
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update statistics method
userSchema.methods.updateStatistics = async function(interviewScore, duration) {
  const stats = this.statistics;
  stats.totalInterviews += 1;
  stats.totalTimeSpent += duration;
  
  // Update average
  stats.averageScore = ((stats.averageScore * (stats.totalInterviews - 1)) + interviewScore) / stats.totalInterviews;
  
  // Update best score
  if (interviewScore > stats.bestScore) {
    stats.bestScore = interviewScore;
  }
  
  await this.save();
};

module.exports = mongoose.model('User', userSchema);