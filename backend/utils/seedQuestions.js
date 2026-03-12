// utils/seedQuestions.js
const Question = require('../models/Question');
const { questionDatabase } = require('./questions');

async function seedQuestions() {
  try {
    const count = await Question.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} questions. Skipping seed.`);
      return;
    }

    console.log('Seeding questions database...');
    let totalSeeded = 0;

    // Seed aptitude questions
    for (const q of questionDatabase.aptitude) {
      await Question.create({
        ...q,
        category: 'aptitude',
        relatedSkills: [],
        isActive: true
      });
      totalSeeded++;
    }

    // Seed technical questions by skill
    for (const [skill, questions] of Object.entries(questionDatabase.technical)) {
      for (const q of questions) {
        await Question.create({
          ...q,
          category: 'technical',
          relatedSkills: [skill.toLowerCase(), ...(q.relatedSkills || [])],
          isActive: true
        });
        totalSeeded++;
      }
    }

    // Seed HR questions
    for (const q of questionDatabase.hr) {
      await Question.create({
        ...q,
        category: 'hr',
        relatedSkills: [],
        isActive: true
      });
      totalSeeded++;
    }

    console.log(`✅ Successfully seeded ${totalSeeded} questions`);
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
  }
}

module.exports = seedQuestions;