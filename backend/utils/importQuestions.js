/**
 * AI HR Agent Pro — Bulk Question Importer
 * -----------------------------------------
 * Reads questions_import.xlsx and inserts them into MongoDB.
 *
 * Usage (run from project root inside Docker):
 *   docker-compose exec app node backend/utils/importQuestions.js
 *
 * Or locally (with MongoDB running):
 *   node backend/utils/importQuestions.js
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// ── Try to load xlsx library ──────────────────────────────────
let XLSX;
try {
  XLSX = require('xlsx');
} catch (e) {
  console.error('❌  Missing "xlsx" package. Run: npm install xlsx');
  process.exit(1);
}

// ── Load environment ──────────────────────────────────────────
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_interview_agent';

// ── Question schema (inline — no circular dep) ────────────────
const questionSchema = new mongoose.Schema({
  category:       { type: String, enum: ['aptitude','technical','hr'], required: true },
  subcategory:    String,
  difficulty:     { type: String, enum: ['easy','medium','hard'], default: 'medium' },
  question:       { type: String, required: true },
  modelAnswer:    String,
  keywords:       [String],
  expectedPoints: [String],
  relatedSkills:  [String],
  timeLimit:      Number,
  usage: {
    timesAsked:   { type: Number, default: 0 },
    lastAskedTo:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    averageScore: { type: Number, default: 0 }
  },
  createdBy: { type: String, default: 'import' },
  isActive:  { type: Boolean, default: true }
}, { timestamps: true });

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

// ── Helpers ───────────────────────────────────────────────────
const toArr = (val) => {
  if (!val) return [];
  return String(val).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
};

const VALID_CATEGORIES  = ['aptitude', 'technical', 'hr'];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

// ── Main ──────────────────────────────────────────────────────
async function main() {
  // Find the xlsx file
  const candidates = [
    path.join(__dirname, 'questions_import.xlsx'),
    path.join(__dirname, '../questions_import.xlsx'),
    path.join(process.cwd(), 'questions_import.xlsx'),
    path.join(process.cwd(), 'backend/utils/questions_import.xlsx'),
  ];

  let filePath = null;
  for (const p of candidates) {
    if (fs.existsSync(p)) { filePath = p; break; }
  }

  if (!filePath) {
    console.error('❌  questions_import.xlsx not found.');
    console.error('    Place the file in the project root or backend/utils/ folder.');
    process.exit(1);
  }

  console.log(`📂  Reading: ${filePath}`);

  // Parse xlsx
  const wb = XLSX.readFile(filePath);
  const sheetName = wb.SheetNames.find(n => n.toLowerCase() === 'questions') || wb.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' });

  console.log(`📊  Found ${rows.length} rows in sheet "${sheetName}"`);

  // Connect to MongoDB
  await mongoose.connect(MONGODB_URI);
  console.log('🔗  Connected to MongoDB');

  let inserted = 0, skipped = 0, errors = 0;

  for (const [i, row] of rows.entries()) {
    const lineNo = i + 2; // Excel row number (1=header)

    const category   = String(row.category  || '').trim().toLowerCase();
    const difficulty = String(row.difficulty || 'medium').trim().toLowerCase();
    const question   = String(row.question  || '').trim();
    const modelAnswer = String(row.modelAnswer || '').trim();

    // Validation
    if (!question) {
      console.warn(`  ⚠️  Row ${lineNo}: empty question — skipped`);
      skipped++; continue;
    }
    if (!VALID_CATEGORIES.includes(category)) {
      console.warn(`  ⚠️  Row ${lineNo}: invalid category "${category}" — skipped`);
      skipped++; continue;
    }
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      console.warn(`  ⚠️  Row ${lineNo}: invalid difficulty "${difficulty}" — using "medium"`);
    }

    // Skip exact duplicates
    const exists = await Question.findOne({ question: { $regex: new RegExp(`^${question.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
    if (exists) {
      console.log(`  ↩️  Row ${lineNo}: duplicate — skipped ("${question.substring(0,60)}...")`);
      skipped++; continue;
    }

    try {
      await Question.create({
        category,
        subcategory:    String(row.subcategory || '').trim() || undefined,
        difficulty:     VALID_DIFFICULTIES.includes(difficulty) ? difficulty : 'medium',
        question,
        modelAnswer:    modelAnswer || undefined,
        keywords:       toArr(row.keywords),
        expectedPoints: toArr(row.expectedPoints),
        relatedSkills:  toArr(row.relatedSkills),
        timeLimit:      row.timeLimit ? Number(row.timeLimit) : 120,
        createdBy:      'import',
      });
      console.log(`  ✅  Row ${lineNo} [${category}] inserted: "${question.substring(0,60)}..."`);
      inserted++;
    } catch (err) {
      console.error(`  ❌  Row ${lineNo}: error — ${err.message}`);
      errors++;
    }
  }

  await mongoose.disconnect();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅  Inserted : ${inserted}`);
  console.log(`↩️   Skipped  : ${skipped}`);
  console.log(`❌  Errors   : ${errors}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉  Import complete! Restart the interview to see new questions.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
