const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');
const compromise = require('compromise');
const User = require('../models/User');
const { OpenAI } = require('openai');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// Comprehensive skill database with categories
const SKILL_DATABASE = {
  programming: [
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'swift',
    'kotlin', 'scala', 'perl', 'r', 'matlab', 'dart', 'lua', 'groovy', 'clojure', 'haskell'
  ],
  frontend: [
    'react', 'angular', 'vue', 'svelte', 'jquery', 'backbone', 'ember', 'html', 'css',
    'sass', 'less', 'bootstrap', 'tailwind', 'material-ui', 'webpack', 'babel', 'gulp',
    'grunt', 'parcel', 'vite', 'next.js', 'nuxt.js', 'gatsby', 'redux', 'mobx', 'zustand'
  ],
  backend: [
    'node.js', 'express', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'rails',
    'laravel', 'symfony', 'asp.net', 'fastify', 'nest.js', 'koa', 'hapi', 'gin', 'fiber'
  ],
  database: [
    'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis', 'elasticsearch', 'cassandra',
    'dynamodb', 'firebase', 'supabase', 'neo4j', 'couchdb', 'mariadb', 'oracle', 'sql server'
  ],
  cloud: [
    'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digital ocean', 'linode', 'vercel',
    'netlify', 'cloudflare', 'terraform', 'ansible', 'puppet', 'chef', 'jenkins', 'github actions'
  ],
  devops: [
    'docker', 'kubernetes', 'k8s', 'jenkins', 'gitlab ci', 'github actions', 'travis ci',
    'circle ci', 'prometheus', 'grafana', 'elk stack', 'nginx', 'apache', 'iis'
  ],
  ai_ml: [
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras', 'scikit-learn',
    'pandas', 'numpy', 'matplotlib', 'seaborn', 'plotly', 'opencv', 'nlp', 'computer vision',
    'reinforcement learning', 'neural networks', 'cnn', 'rnn', 'transformers', 'bert', 'gpt'
  ],
  data: [
    'data analysis', 'data science', 'data engineering', 'etl', 'data warehousing', 'hadoop',
    'spark', 'kafka', 'airflow', 'dbt', 'tableau', 'power bi', 'looker', 'qlik', 'd3.js'
  ],
  mobile: [
    'react native', 'flutter', 'ionic', 'cordova', 'phonegap', 'xamarin', 'android', 'ios',
    'swift', 'kotlin', 'objective-c', 'jetpack compose', 'swiftui'
  ],
  testing: [
    'jest', 'mocha', 'chai', 'cypress', 'selenium', 'playwright', 'puppeteer', 'junit',
    'pytest', 'unittest', 'integration testing', 'e2e testing', 'tdd', 'bdd'
  ],
  tools: [
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'trello', 'asana',
    'notion', 'slack', 'teams', 'zoom', 'figma', 'sketch', 'adobe xd', 'postman', 'insomnia'
  ],
  methodologies: [
    'agile', 'scrum', 'kanban', 'lean', 'waterfall', 'devops', 'ci/cd', 'microservices',
    'monolith', 'serverless', 'event-driven', 'domain driven design', 'tdd', 'bdd', 'oop'
  ]
};

// Flatten for easy searching
const ALL_SKILLS = Object.values(SKILL_DATABASE).flat();

exports.parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;
    let text = '';
    let metadata = {};

    // Extract text based on file type
    if (fileType === 'application/pdf') {
      const pdfData = await pdfParse(fileBuffer);
      text = pdfData.text;
      metadata = {
        pages: pdfData.numpages,
        info: pdfData.info
      };
    } else if (fileType.includes('word')) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value;
      metadata = {
        wordCount: text.split(/\s+/).length
      };
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Use PDF or Word.' });
    }

    // Clean and normalize text
    const cleanedText = text
      .replace(/[^\w\s.,;:!?@]/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase();

    // Extract information using multiple methods
    const extractedData = extractComprehensiveInformation(cleanedText, text);

    // Update user with extracted information
    const user = await User.findById(req.userId);
    
    // Merge skills intelligently
    const existingSkillNames = user.skills.map(s => s.name.toLowerCase());
    const newSkills = extractedData.skills
      .filter(skill => !existingSkillNames.includes(skill.name.toLowerCase()))
      .map(skill => ({
        name: skill.name,
        category: skill.category,
        extractedFromResume: true,
        proficiency: skill.confidence > 0.8 ? 'advanced' : skill.confidence > 0.5 ? 'intermediate' : 'beginner',
        confidence: skill.confidence
      }));

    user.skills.push(...newSkills);
    
    // Update experience if found and better than current
    if (extractedData.experience.years > (user.experience?.years || 0)) {
      user.experience = {
        ...user.experience,
        ...extractedData.experience,
        level: extractedData.experience.years < 2 ? 'fresher' : 'experienced'
      };
    }
    
    // Update education if found — map to User schema {degree, institution, year, score}
    if (extractedData.education && extractedData.education.length > 0 &&
        (!user.education || user.education.length === 0)) {
      user.education = extractedData.education.map(e => ({
        degree: typeof e === 'string' ? e : (e.degree || ''),
        institution: typeof e === 'string' ? '' : (e.institution || ''),
        year: typeof e === 'object' ? e.year : undefined,
        score: typeof e === 'object' ? e.score : undefined
      })).filter(e => e.degree && e.degree.length > 2);
    }
    
    await user.save();

    res.json({
      success: true,
      extractedData: {
        skills: newSkills.map(s => ({ name: s.name, category: s.category, proficiency: s.proficiency })),
        experience: extractedData.experience,
        education: extractedData.education,
        contactInfo: extractedData.contactInfo,
        summary: extractedData.professionalSummary
      },
      metadata,
      updatedSkills: user.skills.map(s => ({ name: s.name, category: s.category }))
    });

  } catch (error) {
    logger.error('Resume parsing error:', error);
    res.status(500).json({ error: 'Failed to parse resume: ' + error.message });
  }
};

function extractComprehensiveInformation(cleanedText, originalText) {
  const doc = compromise(originalText);
  
  // 1. Extract Skills with context awareness
  const foundSkills = [];
  const skillContext = {}; // Track how skills are mentioned
  
  // Check for skills in different contexts
  ALL_SKILLS.forEach(skill => {
    const variations = generateSkillVariations(skill);
    let bestMatch = null;
    let highestConfidence = 0;
    
    variations.forEach(variation => {
      // Escape special regex chars (e.g. c++, c#, .net, node.js)
      const safe = escapeRegex(variation);
      // Look for skill with context
      const patterns = [
        new RegExp(`\\b${safe}\\b`, 'i'),
        new RegExp(`(proficient|experienced|skilled|expert|knowledgeable).{0,30}${safe}`, 'i'),
        new RegExp(`${safe}.{0,20}(experience|expertise|skill)`, 'i'),
        new RegExp(`(projects?|worked|developed|built|created).{0,40}${safe}`, 'i')
      ];
      
      patterns.forEach((pattern, idx) => {
        const match = cleanedText.match(pattern);
        if (match) {
          const confidence = 0.3 + (0.2 * (3 - idx)); // Higher confidence for contextual matches
          if (confidence > highestConfidence) {
            highestConfidence = Math.min(1, confidence);
            bestMatch = { skill, variation, context: match[0] };
          }
        }
      });
    });
    
    if (bestMatch) {
      const category = findSkillCategory(bestMatch.skill);
      foundSkills.push({
        name: skill,
        category,
        confidence: highestConfidence,
        context: bestMatch.context
      });
    }
  });

  // Remove duplicates and sort by confidence
  const uniqueSkills = foundSkills
    .filter((skill, index, self) => 
      index === self.findIndex(s => s.name === skill.name)
    )
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 15); // Top 15 skills

  // 2. Extract Experience
  const experiencePatterns = [
    /(\d+)\+?\s*(?:years?|yrs?).{0,30}(?:experience|exp|work)/i,
    /(?:experience|work).{0,20}(\d+)\+?\s*(?:years?|yrs?)/i,
    /(?:total|overall).{0,10}(\d+)\+?\s*(?:years?|yrs?)/i
  ];

  let totalYears = 0;
  experiencePatterns.forEach(pattern => {
    const match = cleanedText.match(pattern);
    if (match && parseInt(match[1]) > totalYears) {
      totalYears = parseInt(match[1]);
    }
  });

  // Extract current role
  const rolePatterns = [
    /(?:current|present).{0,20}(?:role|position|designation).{0,10}[:is\s]+([^,\n.]{3,50})/i,
    /(?:working as|work as).{0,5}([^,\n.]{3,50})/i,
    /([^,\n.]{3,50})(?:\s+at\s+|\s+with\s+)([^,\n.]{3,50})/i
  ];

  let currentRole = null;
  let currentCompany = null;
  
  rolePatterns.forEach(pattern => {
    const match = originalText.match(pattern);
    if (match && !currentRole) {
      currentRole = match[1]?.trim();
      if (match[2]) currentCompany = match[2]?.trim();
    }
  });

  // 3. Extract Education — return objects matching User schema {degree, institution, year, score}
  const education = [];

  // Only match degree keywords at word boundaries, not inside URLs or emails
  // Split text into lines first to avoid matching partial URLs
  const lines = originalText.split(/\n/);
  const degreePattern = /\b(bachelor(?:\s+of\s+technology)?|master(?:\s+of\s+technology)?|b\.?tech|m\.?tech|b\.?e\.?|m\.?e\.?|b\.?sc|m\.?sc|mba|bca|mca|phd|doctorate)\b/i;
  const yearPattern = /\b(19|20)\d{2}\b/;

  lines.forEach(line => {
    // Skip lines that look like URLs or emails
    if (line.match(/https?:\/\/|linkedin\.com|github\.com|@[a-zA-Z]/)) return;

    const degMatch = line.match(degreePattern);
    if (degMatch) {
      const yearMatch = line.match(yearPattern);
      // Extract field after degree keyword
      const afterDegree = line.slice(line.toLowerCase().indexOf(degMatch[0].toLowerCase()) + degMatch[0].length);
      const fieldMatch = afterDegree.match(/(?:in|of)?\s*([A-Za-z][^,\n]{3,60})/i);

      education.push({
        degree: degMatch[0].trim(),
        institution: '', // filled below if found
        year: yearMatch ? parseInt(yearMatch[0]) : undefined,
        score: undefined,
        _field: fieldMatch ? fieldMatch[1].trim().substring(0, 80) : ''
      });
    }
  });

  // Try to find institution names (lines near degree lines with "University", "Institute", "College")
  const instPattern = /\b(university|institute|college|school|academy|polytechnic)\b/i;
  lines.forEach((line, idx) => {
    if (line.match(instPattern) && !line.match(/https?:\/\/|linkedin\.com/)) {
      // Attach to nearest unmatched education entry
      const unmatched = education.find(e => !e.institution);
      if (unmatched) unmatched.institution = line.trim().substring(0, 100);
    }
  });

  // 4. Extract Contact Information
  const email = originalText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0];
  const phone = originalText.match(/(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0];
  const linkedin = originalText.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/)?.[0];
  const github = originalText.match(/github\.com\/[a-zA-Z0-9-]+/)?.[0];

  // 5. Extract Professional Summary
  const summaryPatterns = [
    /(?:summary|profile|objective|about me)[:is\s]+([^]*?)(?:\n\n|\n[A-Z]|experience|education|skills)/i,
    /^([^]{100,500}?)(?:\n\n|\n[A-Z])/m
  ];
  
  let professionalSummary = null;
  summaryPatterns.forEach(pattern => {
    const match = originalText.match(pattern);
    if (match && !professionalSummary) {
      professionalSummary = match[1]?.trim().substring(0, 500);
    }
  });

  return {
    skills: uniqueSkills,
    experience: {
      years: totalYears,
      currentRole,
      company: currentCompany,
      level: totalYears < 2 ? 'fresher' : 'experienced'
    },
    education: education
      .filter(e => e.degree)
      .slice(0, 3)
      .map(e => ({
        degree: (e.degree + (e._field ? ' in ' + e._field : '')).substring(0, 100),
        institution: e.institution || '',
        year: e.year,
        score: e.score
      })),
    contactInfo: {
      email,
      phone,
      linkedin,
      github
    },
    professionalSummary
  };
}

function escapeRegex(str) {
  // Escape all special regex characters: . * + ? ^ $ { } [ ] | ( ) \ #
  return str.replace(/[.*+?^${}()|[\]\\#]/g, '\\$&');
}

function generateSkillVariations(skill) {
  const variations = [skill];
  
  // Add common variations
  if (skill.includes('.')) {
    variations.push(skill.replace(/\./g, ''));
    variations.push(skill.replace(/\./g, ' '));
  }
  if (skill.includes(' ')) {
    variations.push(skill.replace(/ /g, ''));
    variations.push(skill.replace(/ /g, '-'));
  }
  if (!skill.includes(' ')) {
    variations.push(skill.replace(/([A-Z])/g, ' $1').trim());
  }
  
  // Add case variations
  variations.push(skill.toUpperCase());
  variations.push(skill.toLowerCase());
  
  return [...new Set(variations)];
}

function findSkillCategory(skill) {
  for (const [category, skills] of Object.entries(SKILL_DATABASE)) {
    if (skills.includes(skill.toLowerCase())) {
      return category;
    }
  }
  return 'other';
}

exports.getSkillSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }
    
    const suggestions = ALL_SKILLS
      .filter(skill => skill.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10)
      .map(skill => ({
        name: skill,
        category: findSkillCategory(skill)
      }));
    
    res.json({ suggestions });
  } catch (error) {
    logger.error('Skill suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
};
// ============================================================
// AI Resume Analysis + Question Generation
// ============================================================
function getAIClient() {
  if (process.env.GROQ_API_KEY) {
    return {
      client: new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' }),
      model: 'llama-3.3-70b-versatile'
    };
  } else if (process.env.OPENAI_API_KEY) {
    return { client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }), model: 'gpt-3.5-turbo' };
  }
  return null;
}

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;
    let text = '';

    if (fileType === 'application/pdf') {
      const pdfData = await pdfParse(fileBuffer);
      text = pdfData.text;
    } else if (fileType.includes('word')) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported format. Use PDF or Word.' });
    }

    const ai = getAIClient();
    if (!ai) return res.status(400).json({ error: 'No AI API key configured' });

    const prompt = `You are an expert HR analyst. Analyze this resume and provide a comprehensive analysis.

RESUME TEXT:
${text.substring(0, 3000)}

Respond ONLY in this exact JSON format:
{
  "candidateName": "extracted name or Unknown",
  "overallScore": number 0-100,
  "experienceLevel": "Fresher/Junior/Mid-level/Senior/Expert",
  "yearsOfExperience": number,
  "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "technicalStrengths": ["strength1", "strength2", "strength3"],
  "skillGaps": ["gap1", "gap2", "gap3"],
  "educationSummary": "brief education summary",
  "careerSummary": "2-3 sentence career summary",
  "strengths": ["strength1", "strength2", "strength3"],
  "areasForImprovement": ["area1", "area2"],
  "recommendedRoles": ["role1", "role2", "role3"],
  "interviewFocus": ["topic1", "topic2", "topic3", "topic4"]
}`;

    const completion = await ai.client.chat.completions.create({
      model: ai.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    });

    let analysis = {};
    try {
      const raw = completion.choices[0].message.content;
      const clean = raw.replace(/```json|```/g, '').trim();
      analysis = JSON.parse(clean);
    } catch(e) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    res.json({ success: true, analysis, resumeText: text.substring(0, 2000) });

  } catch (error) {
    logger.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Analysis failed: ' + error.message });
  }
};

exports.generateQuestionsFromResume = async (req, res) => {
  try {
    const { resumeText, skills, experienceLevel, focusAreas } = req.body;
    if (!resumeText) return res.status(400).json({ error: 'Resume text required' });

    const ai = getAIClient();
    if (!ai) return res.status(400).json({ error: 'No AI API key configured' });

    const prompt = `You are an expert technical interviewer. Based on this candidate's resume, generate targeted interview questions.

RESUME SUMMARY:
${resumeText.substring(0, 1500)}
Skills: ${(skills || []).join(', ')}
Experience Level: ${experienceLevel || 'Unknown'}
Focus Areas: ${(focusAreas || []).join(', ')}

Generate exactly 12 personalized interview questions (4 technical, 4 aptitude, 4 HR) based specifically on their background.

Respond ONLY in this exact JSON format:
{
  "questions": [
    {
      "category": "technical",
      "question": "question text",
      "difficulty": "easy/medium/hard",
      "topic": "specific topic from resume",
      "modelAnswer": "expected answer",
      "keywords": ["kw1", "kw2", "kw3"]
    }
  ]
}`;

    const completion = await ai.client.chat.completions.create({
      model: ai.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 2000
    });

    let result = {};
    try {
      const raw = completion.choices[0].message.content;
      const clean = raw.replace(/```json|```/g, '').trim();
      result = JSON.parse(clean);
    } catch(e) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    res.json({ success: true, questions: result.questions || [] });

  } catch (error) {
    logger.error('Question generation error:', error);
    res.status(500).json({ error: 'Question generation failed: ' + error.message });
  }
};
