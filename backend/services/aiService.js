const { OpenAI } = require('openai');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// Support both OpenAI and Groq (Groq uses OpenAI-compatible API)
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Only create client if a key exists — prevents crash on startup
let openai = null;
let AI_MODEL = null;

if (GROQ_API_KEY) {
  openai = new OpenAI({
    apiKey: GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
  });
  AI_MODEL = 'llama3-8b-8192';
  logger.info('AI Provider: Groq (llama3-8b-8192)');
} else if (OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  });
  AI_MODEL = 'gpt-3.5-turbo';
  logger.info('AI Provider: OpenAI (gpt-3.5-turbo)');
} else {
  logger.info('AI Provider: Fallback evaluator (no API key found)');
}

class AIService {
  async evaluateAnswer(question, userAnswer, modelAnswer, category, keywords = [], expectedPoints = []) {
    try {
      // If no API client available, use fallback
      if (!openai) {
        return this.fallbackEvaluation(userAnswer, modelAnswer, keywords, expectedPoints, category);
      }

      const isAptitude = (category && category.toLowerCase() === 'aptitude') || (round && round.toLowerCase() === 'aptitude');

      const prompt = `
You are an expert HR interviewer evaluating a candidate's response.

Question: ${question}
Model Answer: ${modelAnswer}
Expected Keywords: ${keywords.join(', ')}
Expected Points: ${expectedPoints.join(', ')}
Candidate's Answer: ${userAnswer}
Category: ${category}

${isAptitude ? `IMPORTANT: This is an APTITUDE question. Aptitude answers are often short and direct (e.g. "5 cats", "3 hours", "10%"). 
- A short correct answer like "5" or "three hours" is FULLY VALID and should score 80-100 if correct.
- Do NOT penalize for lack of explanation in aptitude answers.
- Check if the numerical/logical answer is CORRECT first.
- Only give low scores if the answer is actually wrong or blank.` : 
`Evaluate on clarity, completeness, and depth.`}

Evaluate on a scale of 0-100. For aptitude: prioritize correctness over explanation length.

Provide response in this exact JSON format:
{
  "score": number (0-100),
  "feedback": "1-2 sentences. For aptitude: just say if correct/incorrect and the right answer. No need to ask for more explanation.",
  "keywordsMatched": ["matched1", "matched2"],
  "missingKeywords": ["missing1"],
  "confidence": number (0.0-1.0),
  "sentiment": "positive|neutral|negative",
  "strongPoints": ["point1"],
  "improvementAreas": ["area1"]
}
`;

      const completion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: "system", content: "You are an expert technical interviewer. Be fair but strict in evaluation." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;
      const evaluation = JSON.parse(response);

      return {
        score: Math.min(100, Math.max(0, Math.round(evaluation.score))),
        feedback: evaluation.feedback,
        keywordsMatched: evaluation.keywordsMatched || [],
        missingKeywords: evaluation.missingKeywords || [],
        confidence: evaluation.confidence || 0.8,
        sentiment: evaluation.sentiment || 'neutral',
        strongPoints: evaluation.strongPoints || [],
        improvementAreas: evaluation.improvementAreas || []
      };

    } catch (error) {
      logger.error('AI Evaluation error:', error);
      return this.fallbackEvaluation(userAnswer, modelAnswer, keywords, expectedPoints, category);
    }
  }

  fallbackEvaluation(userAnswer, modelAnswer, keywords = [], expectedPoints = [], category = '', round = '') {
    const isAptitude = (category && category.toLowerCase() === 'aptitude') || (round && round.toLowerCase() === 'aptitude');

    if (!userAnswer || userAnswer.trim().length === 0) {
      return {
        score: 0,
        feedback: "No answer provided.",
        keywordsMatched: [],
        missingKeywords: keywords,
        confidence: 1,
        sentiment: 'negative',
        strongPoints: [],
        improvementAreas: ['Please provide an answer']
      };
    }

    const userLower = userAnswer.toLowerCase().trim();
    const modelLower = modelAnswer.toLowerCase().trim();

    // For aptitude: check if answer appears in model answer (short correct answers)
    if (isAptitude) {
      // Reject noise: must be at least 1 real word (2+ chars) and contain a letter or digit
      const hasContent = /[a-zA-Z0-9]{2,}/.test(userLower);
      // Reject single/double random letters like "r", "tt", "rr" that aren't real answers
      const isGibberish = userLower.length <= 2 && !/^\d+$/.test(userLower);
      if (!hasContent || isGibberish) {
        return {
          score: 0,
          feedback: "Please provide a meaningful answer.",
          keywordsMatched: [], missingKeywords: keywords,
          confidence: 1, sentiment: 'negative',
          strongPoints: [], improvementAreas: ['Please speak your answer clearly']
        };
      }
      // Exact or close match check — userLower must meaningfully match model
      const modelWords = modelLower.split(/\s+/);
      const userWords = userLower.split(/\s+/);
      // Check if key numbers/words from model appear in user answer
      const keyModelTokens = modelWords.filter(w => /\d+|%|days?|hours?|km|rs\.?|decrease|increase/.test(w));
      const tokenMatch = keyModelTokens.length > 0 
        ? keyModelTokens.some(t => userLower.includes(t))
        : modelLower.includes(userLower) || userLower.includes(modelLower.split(' ').slice(0,3).join(' '));
      const isCorrect = tokenMatch || 
                        modelLower.includes(userLower) || 
                        userLower.includes(modelLower.split(' ').slice(0,3).join(' '));
      const score = isCorrect ? 90 : 30;
      return {
        score,
        feedback: isCorrect 
          ? "Correct answer! Well done." 
          : `Incorrect. The correct answer is: ${modelAnswer}`,
        keywordsMatched: isCorrect ? keywords : [],
        missingKeywords: isCorrect ? [] : keywords,
        confidence: 0.85,
        sentiment: isCorrect ? 'positive' : 'negative',
        strongPoints: isCorrect ? ['Correct answer'] : [],
        improvementAreas: isCorrect ? [] : ['Review the correct approach']
      };
    }

    // Keyword matching
    const matchedKeywords = keywords.filter(k => userLower.includes(k.toLowerCase()));
    const keywordScore = keywords.length > 0 ? (matchedKeywords.length / keywords.length) * 40 : 20;

    // Length-based completeness (0-30 points) - don't penalize short answers heavily
    const lengthScore = Math.min(30, Math.max(10, userAnswer.length / 8));

    // Basic relevance check
    const relevanceScore = userLower.length > 20 ? 20 : 10;

    // Clarity
    const clarityScore = 10;

    const totalScore = Math.round(keywordScore + lengthScore + relevanceScore + clarityScore);

    let feedback = "";
    if (totalScore > 80) feedback = "Excellent answer! Well-structured and comprehensive.";
    else if (totalScore > 60) feedback = "Good answer. Could include more technical detail.";
    else if (totalScore > 40) feedback = "Partial answer. Try to cover more key points.";
    else feedback = "Answer needs more depth. Review the topic and try again.";

    return {
      score: Math.min(100, totalScore),
      feedback,
      keywordsMatched: matchedKeywords,
      missingKeywords: keywords.filter(k => !matchedKeywords.includes(k)),
      confidence: 0.6,
      sentiment: totalScore > 60 ? 'positive' : totalScore > 40 ? 'neutral' : 'negative',
      strongPoints: totalScore > 60 ? ['Attempted the question'] : [],
      improvementAreas: totalScore < 80 ? ['Add more technical details', 'Structure your answer better'] : []
    };
  }

  async generateComprehensiveFeedback(interview) {
    try {
      if ((!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') && !process.env.GROQ_API_KEY) {
        return this.fallbackFeedback(interview);
      }

      const rounds = interview.rounds;
      
      // Prepare summary of answers
      const answerSummary = [];
      ['aptitude', 'technical', 'hr'].forEach(round => {
        rounds[round].questions.forEach((q, idx) => {
          if (q.userAnswer) {
            answerSummary.push({
              round,
              question: q.question.substring(0, 100),
              answer: q.userAnswer.substring(0, 200),
              score: q.score
            });
          }
        });
      });

      const prompt = `
Analyze this interview performance and generate detailed feedback:

Scores:
- Aptitude: ${rounds.aptitude.score}/100
- Technical: ${rounds.technical.score}/100
- HR: ${rounds.hr.score}/100
- Overall: ${interview.scores.overall}/100

Answer Summary: ${JSON.stringify(answerSummary)}

Generate feedback in this JSON format:
{
  "summary": "2-3 paragraph overall assessment",
  "strengths": ["specific strength 1", "strength 2", "strength 3"],
  "improvements": ["specific area 1", "area 2", "area 3"],
  "recommendations": ["actionable recommendation 1", "recommendation 2"],
  "personalityInsights": "Assessment of communication style, confidence, and professionalism",
  "technicalAssessment": "Evaluation of technical depth and knowledge application",
  "roleFit": "Assessment of fit for the role based on interview performance"
}
`;

      const completion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: "system", content: "You are a senior HR director providing detailed, actionable candidate feedback." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);

    } catch (error) {
      logger.error('AI Feedback error:', error);
      return this.fallbackFeedback(interview);
    }
  }

  fallbackFeedback(interview) {
    const scores = interview.scores;
    const rounds = interview.rounds;
    
    // Analyze which round was best
    const roundScores = [
      { name: 'Aptitude', score: rounds.aptitude.score },
      { name: 'Technical', score: rounds.technical.score },
      { name: 'HR', score: rounds.hr.score }
    ];
    roundScores.sort((a, b) => b.score - a.score);
    
    return {
      summary: `Overall performance: ${scores.overall}/100. Best performance in ${roundScores[0].name} (${roundScores[0].score}/100). ${roundScores[2].name} needs the most improvement (${roundScores[2].score}/100).`,
      strengths: [
        roundScores[0].score > 70 ? `Strong ${roundScores[0].name.toLowerCase()} skills` : 'Completed all interview rounds',
        'Participated actively in the interview process',
        scores.overall > 60 ? 'Demonstrated good understanding of core concepts' : 'Showed willingness to learn'
      ],
      improvements: [
        roundScores[2].score < 70 ? `Improve ${roundScores[2].name.toLowerCase()} knowledge` : 'Deepen technical expertise',
        'Practice structured communication',
        'Provide more detailed technical explanations'
      ],
      recommendations: [
        'Review fundamental concepts in your weakest area',
        'Practice with mock interviews',
        'Study industry best practices and latest trends'
      ],
      personalityInsights: "Candidate shows potential with room for growth in communication confidence.",
      technicalAssessment: scores.technical > 70 ? "Good technical foundation" : "Technical knowledge needs strengthening.",
      roleFit: scores.overall > 75 ? "Strong fit for junior to mid-level roles" : "Better suited for entry-level positions with training support."
    };
  }

  async generateFollowUpQuestion(previousAnswer, context, skills) {
    try {
      if (!process.env.OPENAI_API_KEY) return null;

      const prompt = `
Based on this candidate's answer, generate a probing follow-up question:
Previous Answer: ${previousAnswer.substring(0, 300)}
Context: ${context}
Candidate Skills: ${skills.join(', ')}

Generate a specific follow-up that digs deeper into their knowledge. Return only the question text, no JSON.
`;

      const completion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: "system", content: "You are a technical interviewer asking probing follow-up questions." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 150
      });

      return completion.choices[0].message.content.trim();

    } catch (error) {
      logger.error('Follow-up generation error:', error);
      return null;
    }
  }
}

module.exports = new AIService();