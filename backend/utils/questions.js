// utils/questions.js
// Utility functions for question management and seeding

const Question = require('../models/Question');

// Comprehensive question database organized by skills
const questionDatabase = {
  // ==================== APTITUDE QUESTIONS ====================
  aptitude: [
    {
      question: "A train travels 360 km in 4 hours. How long will it take to travel 270 km at the same speed?",
      modelAnswer: "3 hours. Speed = 360/4 = 90 km/h. Time = 270/90 = 3 hours.",
      subcategory: "mathematical",
      difficulty: "easy",
      keywords: ["speed", "time", "distance", "calculation", "km", "hours"],
      expectedPoints: ["calculate speed", "apply formula", "correct answer 3 hours"]
    },
    {
      question: "Complete the series: 2, 6, 12, 20, 30, ?",
      modelAnswer: "42. Pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.",
      subcategory: "logical",
      difficulty: "medium",
      keywords: ["series", "pattern", "multiplication", "sequence", "n(n+1)"],
      expectedPoints: ["identify pattern", "n(n+1) formula", "answer 42"]
    },
    {
      question: "A is twice as efficient as B. Together they complete work in 18 days. How long will A take alone?",
      modelAnswer: "27 days. If B does 1 unit/day, A does 2 units/day. Together 3 units/day. Total work = 54 units. A alone = 54/2 = 27 days.",
      subcategory: "work",
      difficulty: "hard",
      keywords: ["efficiency", "work", "days", "calculation", "units"],
      expectedPoints: ["efficiency ratio", "work units", "calculation steps", "27 days"]
    },
    {
      question: "Find the odd one out: Apple, Banana, Carrot, Mango",
      modelAnswer: "Carrot. All others are fruits, carrot is a vegetable.",
      subcategory: "verbal",
      difficulty: "easy",
      keywords: ["classification", "fruits", "vegetables", "logic", "odd one out"],
      expectedPoints: ["identify categories", "carrot is vegetable", "others are fruits"]
    },
    {
      question: "If 5 cats catch 5 mice in 5 minutes, how many cats are needed to catch 100 mice in 100 minutes?",
      modelAnswer: "5 cats. Each cat catches 1 mouse in 5 minutes. In 100 minutes, 1 cat catches 20 mice. 100/20 = 5 cats.",
      subcategory: "logical",
      difficulty: "medium",
      keywords: ["cats", "mice", "rate", "logic", "time"],
      expectedPoints: ["rate calculation", "per cat rate", "5 cats answer"]
    },
    {
      question: "The sum of ages of 5 children born at intervals of 3 years each is 50 years. What is the age of the youngest child?",
      modelAnswer: "4 years. Let youngest be x. Ages: x, x+3, x+6, x+9, x+12. Sum = 5x + 30 = 50. So x = 4.",
      subcategory: "mathematical",
      difficulty: "medium",
      keywords: ["age", "sum", "intervals", "algebra", "equation"],
      expectedPoints: ["set up equation", "5x + 30 = 50", "solve for x", "4 years"]
    },
    {
      question: "A bag contains 2 red, 3 green and 2 blue balls. Two balls are drawn at random. What is the probability that none of the balls drawn is blue?",
      modelAnswer: "10/21. Total balls = 7. Non-blue = 5. Probability = C(5,2)/C(7,2) = 10/21.",
      subcategory: "probability",
      difficulty: "hard",
      keywords: ["probability", "balls", "combinations", "random", "blue"],
      expectedPoints: ["total combinations", "favorable outcomes", "combination formula", "10/21"]
    }
  ],

  // ==================== TECHNICAL QUESTIONS BY SKILL ====================
  technical: {
    // JavaScript
    javascript: [
      {
        question: "Explain the difference between 'let', 'const', and 'var' in JavaScript.",
        modelAnswer: "var is function-scoped, can be redeclared and updated. let is block-scoped, can be updated but not redeclared. const is block-scoped, cannot be updated or redeclared. Prefer const by default.",
        subcategory: "fundamentals",
        difficulty: "easy",
        keywords: ["scope", "block", "function", "reassignment", "declaration", "hoisting"],
        expectedPoints: ["var function scoped", "let block scoped", "const immutable", "redeclaration vs reassignment", "hoisting behavior"]
      },
      {
        question: "What are closures in JavaScript and provide a practical example?",
        modelAnswer: "A closure is a function that remembers its outer variables even when executed elsewhere. Example: function makeCounter() { let count = 0; return function() { return ++count; }; }",
        subcategory: "advanced",
        difficulty: "hard",
        keywords: ["closure", "scope", "lexical", "memory", "function", "outer variables"],
        expectedPoints: ["definition", "lexical scope", "practical example", "data privacy", "memory retention"]
      },
      {
        question: "Explain the Event Loop in JavaScript with call stack, web APIs, and callback queue.",
        modelAnswer: "The Event Loop allows non-blocking operations. Call stack executes code. Async operations go to Web APIs. Callbacks queue in microtask (promises) and macrotask (setTimeout) queues. Event loop pushes to stack when clear.",
        subcategory: "async",
        difficulty: "hard",
        keywords: ["event loop", "call stack", "web apis", "callback queue", "microtask", "macrotask"],
        expectedPoints: ["call stack execution", "web APIs handling", "queue priority", "microtask vs macrotask", "non-blocking"]
      },
      {
        question: "What is the difference between == and === in JavaScript?",
        modelAnswer: "== performs type coercion before comparison (loose equality). === checks both value and type without coercion (strict equality). Always use === to avoid unexpected conversions like 0 == false being true.",
        subcategory: "fundamentals",
        difficulty: "easy",
        keywords: ["equality", "type coercion", "strict", "loose", "comparison", "types"],
        expectedPoints: ["type coercion explanation", "strict equality", "=== preferred", "examples of difference"]
      },
      {
        question: "Explain Promises and async/await in JavaScript.",
        modelAnswer: "Promises represent future values with .then() and .catch(). Async/await is syntactic sugar over Promises making async code look synchronous. Async functions return Promises, await pauses execution until resolved.",
        subcategory: "async",
        difficulty: "medium",
        keywords: ["promises", "async", "await", "then", "catch", "synchronous"],
        expectedPoints: ["promise states", "then/catch chaining", "async function", "await keyword", "error handling"]
      }
    ],

    // Python
    python: [
      {
        question: "Explain list comprehensions in Python with examples.",
        modelAnswer: "List comprehensions provide concise list creation: [expression for item in iterable if condition]. Example: [x**2 for x in range(10) if x % 2 == 0] creates squares of even numbers. More readable and faster than loops.",
        subcategory: "syntax",
        difficulty: "easy",
        keywords: ["list comprehension", "concise", "iteration", "filter", "expression"],
        expectedPoints: ["syntax structure", "if condition", "performance benefit", "readability", "examples"]
      },
      {
        question: "What are decorators in Python and how do they work?",
        modelAnswer: "Decorators are functions that modify other functions using @syntax. They wrap the target function to execute code before/after. Example: @timer measures execution time. Implemented as higher-order functions.",
        subcategory: "advanced",
        difficulty: "hard",
        keywords: ["decorator", "wrapper", "higher order function", "syntactic sugar", "@syntax"],
        expectedPoints: ["@syntax usage", "wrapper function", "before/after execution", "higher-order function", "use cases"]
      },
      {
        question: "Explain the difference between lists and tuples in Python.",
        modelAnswer: "Lists are mutable, use [], slower, for changing data. Tuples are immutable, use (), faster, hashable, for fixed data. Tuples can be dictionary keys and set elements, lists cannot.",
        subcategory: "fundamentals",
        difficulty: "easy",
        keywords: ["mutable", "immutable", "list", "tuple", "performance", "hashable"],
        expectedPoints: ["mutability difference", "syntax [] vs ()", "performance comparison", "hashability", "use cases"]
      },
      {
        question: "How does Python's garbage collection work?",
        modelAnswer: "Python uses reference counting and generational garbage collection. Objects freed when ref count hits zero. Cyclic GC handles circular references in 3 generations (0, 1, 2) based on survival time.",
        subcategory: "memory",
        difficulty: "hard",
        keywords: ["garbage collection", "reference counting", "cyclic", "memory management", "generations"],
        expectedPoints: ["reference counting", "cyclic GC purpose", "three generations", "memory leaks prevention"]
      },
      {
        question: "Explain Python's GIL (Global Interpreter Lock) and its implications.",
        modelAnswer: "GIL ensures only one thread executes Python bytecode at a time. Simplifies memory management but prevents true parallelism in threads. Use multiprocessing for CPU-bound, threads for I/O-bound tasks.",
        subcategory: "concurrency",
        difficulty: "hard",
        keywords: ["GIL", "global interpreter lock", "threading", "multiprocessing", "parallelism"],
        expectedPoints: ["GIL purpose", "thread limitation", "multiprocessing solution", "I/O vs CPU bound", "workarounds"]
      }
    ],

    // React
    react: [
      {
        question: "Explain the Virtual DOM and its benefits in React.",
        modelAnswer: "Virtual DOM is a lightweight JavaScript copy of real DOM. React updates Virtual DOM, compares with previous state (diffing/reconciliation), then only updates changed elements in real DOM. Benefits: faster updates, less memory, better performance.",
        subcategory: "architecture",
        difficulty: "medium",
        keywords: ["virtual dom", "diffing", "reconciliation", "performance", "real dom"],
        expectedPoints: ["lightweight copy", "diffing algorithm", "reconciliation process", "selective updates", "performance benefit"]
      },
      {
        question: "What are React Hooks and why were they introduced?",
        modelAnswer: "Hooks are functions for state and lifecycle in functional components (useState, useEffect, useContext). They replace class components, enable logic reuse without HOCs/render props, solving wrapper hell.",
        subcategory: "hooks",
        difficulty: "medium",
        keywords: ["hooks", "useState", "useEffect", "functional components", "reuse"],
        expectedPoints: ["useState usage", "useEffect purpose", "functional components benefit", "custom hooks", "no classes needed"]
      },
      {
        question: "Explain useEffect hook with all dependency scenarios.",
        modelAnswer: "useEffect runs side effects. [] runs once on mount. [dep] runs when dep changes. No array runs every render. Cleanup function runs before next effect or unmount. Multiple effects can be separated.",
        subcategory: "hooks",
        difficulty: "medium",
        keywords: ["useEffect", "dependencies", "cleanup", "side effects", "lifecycle"],
        expectedPoints: ["empty array behavior", "specific dependencies", "no array behavior", "cleanup function", "separation of concerns"]
      },
      {
        question: "What is Redux and when should you use it?",
        modelAnswer: "Redux is predictable state container using single store, actions, and reducers. Use for: global state needed across app, complex state logic, time-travel debugging needs. Avoid for simple local state.",
        subcategory: "state-management",
        difficulty: "medium",
        keywords: ["redux", "store", "actions", "reducers", "global state"],
        expectedPoints: ["single source of truth", "actions and reducers", "when to use", "alternatives", "middleware"]
      }
    ],

    // Node.js
    nodejs: [
      {
        question: "How does the Node.js event loop work?",
        modelAnswer: "Node.js uses libuv for event loop with phases: timers, pending callbacks, idle/prepare, poll, check, close callbacks. Async operations offloaded to thread pool, callbacks queued to appropriate phases.",
        subcategory: "architecture",
        difficulty: "hard",
        keywords: ["event loop", "libuv", "phases", "async", "non-blocking", "thread pool"],
        expectedPoints: ["libuv role", "event loop phases", "thread pool workers", "callback queue", "non-blocking I/O"]
      },
      {
        question: "What is the difference between require and import in Node.js?",
        modelAnswer: "require is CommonJS, synchronous, runtime, can be conditional. import is ES6, asynchronous, static parsing, hoisted. Node supports both with .mjs extension or 'type': 'module' in package.json.",
        subcategory: "modules",
        difficulty: "medium",
        keywords: ["require", "import", "CommonJS", "ES6", "modules", "synchronous"],
        expectedPoints: ["CommonJS vs ES6", "synchronous vs async", "static vs dynamic", "conditional loading", "configuration"]
      },
      {
        question: "Explain the cluster module in Node.js.",
        modelAnswer: "Cluster module creates child processes that share server ports, utilizing multiple CPU cores. Master process forks workers. If worker dies, master can fork new one. Improves performance on multi-core systems.",
        subcategory: "performance",
        difficulty: "hard",
        keywords: ["cluster", "child processes", "CPU cores", "master", "workers", "scaling"],
        expectedPoints: ["master-worker pattern", "port sharing", "CPU utilization", "fault tolerance", "load balancing"]
      }
    ],

    // Databases
    sql: [
      {
        question: "Explain SQL JOIN types with examples.",
        modelAnswer: "INNER JOIN returns matching rows from both tables. LEFT JOIN returns all left rows with matching right (NULL if no match). RIGHT JOIN opposite. FULL OUTER JOIN all rows from both. CROSS JOIN cartesian product.",
        subcategory: "queries",
        difficulty: "medium",
        keywords: ["JOIN", "INNER", "LEFT", "RIGHT", "FULL OUTER", "CROSS"],
        expectedPoints: ["INNER JOIN behavior", "LEFT JOIN behavior", "RIGHT JOIN behavior", "FULL OUTER", "use cases for each"]
      },
      {
        question: "What are database indexes and when should you use them?",
        modelAnswer: "Indexes speed up SELECT queries by creating B-tree data structures for fast lookup. Trade-off: slower INSERT/UPDATE/DELETE and more storage. Use on frequently queried columns, WHERE, JOIN, ORDER BY clauses.",
        subcategory: "optimization",
        difficulty: "medium",
        keywords: ["index", "B-tree", "performance", "optimization", "trade-off", "query speed"],
        expectedPoints: ["B-tree structure", "fast lookup", "storage trade-off", "write performance impact", "when to index"]
      },
      {
        question: "Explain database normalization and its normal forms.",
        modelAnswer: "Normalization reduces redundancy and improves integrity. 1NF: atomic values. 2NF: 1NF + no partial dependency. 3NF: 2NF + no transitive dependency. BCNF: stricter version of 3NF.",
        subcategory: "design",
        difficulty: "hard",
        keywords: ["normalization", "1NF", "2NF", "3NF", "BCNF", "redundancy"],
        expectedPoints: ["reduction of redundancy", "1NF atomic values", "2NF partial dependency", "3NF transitive dependency", "BCNF"]
      }
    ],

    mongodb: [
      {
        question: "What is the difference between SQL and MongoDB?",
        modelAnswer: "SQL is relational with fixed schema, tables, rows, ACID transactions. MongoDB is document-oriented, schema-less, stores JSON-like documents, horizontal scaling, flexible for unstructured data.",
        subcategory: "fundamentals",
        difficulty: "easy",
        keywords: ["SQL", "NoSQL", "document", "schema", "scaling", "relational"],
        expectedPoints: ["schema flexibility", "document vs table", "horizontal scaling", "use cases", "ACID vs BASE"]
      },
      {
        question: "Explain MongoDB aggregation pipeline.",
        modelAnswer: "Aggregation pipeline processes documents through stages: $match (filter), $group (aggregate), $sort, $project (shape output), $lookup (join). Pipeline executed in order, efficient for complex data processing.",
        subcategory: "queries",
        difficulty: "hard",
        keywords: ["aggregation", "pipeline", "stages", "$match", "$group", "$lookup"],
        expectedPoints: ["pipeline stages", "$match filtering", "$group aggregation", "$lookup joining", "performance optimization"]
      }
    ],

    // Cloud/DevOps
    aws: [
      {
        question: "What are the main AWS compute services and their use cases?",
        modelAnswer: "EC2: Virtual servers full control. Lambda: Serverless functions, event-driven. ECS/EKS: Container orchestration. Fargate: Serverless containers. Elastic Beanstalk: Managed application deployment.",
        subcategory: "compute",
        difficulty: "medium",
        keywords: ["EC2", "Lambda", "ECS", "EKS", "Fargate", "serverless"],
        expectedPoints: ["EC2 use case", "Lambda serverless", "container services", "Fargate benefits", "selection criteria"]
      },
      {
        question: "Explain AWS S3 storage classes.",
        modelAnswer: "S3 Standard: frequent access. S3 IA: infrequent access, lower cost. S3 Glacier: archival, very low cost, retrieval minutes-hours. S3 Intelligent-Tiering: automatic cost optimization based on access patterns.",
        subcategory: "storage",
        difficulty: "medium",
        keywords: ["S3", "storage classes", "Standard", "IA", "Glacier", "Intelligent-Tiering"],
        expectedPoints: ["Standard for hot data", "IA for warm data", "Glacier for cold data", "retrieval times", "cost optimization"]
      }
    ],

    docker: [
      {
        question: "What is the difference between Docker image and container?",
        modelAnswer: "Image is read-only template with application code, libraries, dependencies. Container is running instance of image, isolated process with its own filesystem, network, and process space. Multiple containers can run from one image.",
        subcategory: "fundamentals",
        difficulty: "easy",
        keywords: ["image", "container", "template", "instance", "isolation"],
        expectedPoints: ["image as template", "container as runtime", "layers concept", "isolation benefits", "relationship"]
      },
      {
        question: "Explain Docker multi-stage builds.",
        modelAnswer: "Multi-stage builds use multiple FROM statements in Dockerfile. Each stage can copy artifacts from previous stages. Final image contains only necessary artifacts, reducing size and attack surface. Build tools excluded from production image.",
        subcategory: "optimization",
        difficulty: "hard",
        keywords: ["multi-stage", "build", "artifacts", "image size", "FROM"],
        expectedPoints: ["multiple FROM statements", "COPY between stages", "smaller final image", "build vs runtime dependencies", "security benefits"]
      }
    ],

    // Machine Learning
    machinelearning: [
      {
        question: "Explain the difference between supervised and unsupervised learning.",
        modelAnswer: "Supervised learning uses labeled data (input-output pairs) for prediction tasks like classification and regression. Unsupervised learning finds patterns in unlabeled data through clustering, dimensionality reduction, or association.",
        subcategory: "fundamentals",
        difficulty: "easy",
        keywords: ["supervised", "unsupervised", "labeled data", "clustering", "classification", "regression"],
        expectedPoints: ["labeled vs unlabeled", "supervised examples", "unsupervised examples", "use cases", "algorithms for each"]
      },
      {
        question: "What is overfitting and how do you prevent it?",
        modelAnswer: "Overfitting: model learns training data too well, performs poorly on new data. Solutions: cross-validation, regularization (L1/L2), dropout, early stopping, more data, feature selection, simpler model architecture.",
        subcategory: "optimization",
        difficulty: "medium",
        keywords: ["overfitting", "regularization", "cross-validation", "dropout", "generalization"],
        expectedPoints: ["definition and symptoms", "train-test split importance", "regularization L1/L2", "dropout", "early stopping", "more data"]
      },
      {
        question: "Explain gradient descent and its variants.",
        modelAnswer: "Gradient descent minimizes loss by updating weights in direction of negative gradient. Variants: Batch (all data, stable but slow), Stochastic (single sample, fast but noisy), Mini-batch (compromise), Adam (adaptive learning rates).",
        subcategory: "algorithms",
        difficulty: "hard",
        keywords: ["gradient descent", "SGD", "Adam", "learning rate", "optimization"],
        expectedPoints: ["gradient concept", "batch GD", "stochastic GD", "mini-batch", "Adam optimizer", "learning rate importance"]
      }
    ],

    // General Technical
    general: [
      {
        question: "Explain REST API principles and best practices.",
        modelAnswer: "REST: Stateless, client-server, cacheable, uniform interface. Use HTTP methods correctly: GET (read), POST (create), PUT/PATCH (update), DELETE (remove). Use proper status codes, versioning, pagination, HATEOAS.",
        subcategory: "web",
        difficulty: "medium",
        keywords: ["REST", "API", "HTTP methods", "stateless", "resources", "status codes"],
        expectedPoints: ["stateless architecture", "HTTP verbs correct usage", "resource-based URLs", "proper status codes", "versioning strategies"]
      },
      {
        question: "What is the difference between monolithic and microservices architecture?",
        modelAnswer: "Monolithic: single codebase, easier development and testing, harder scaling, single point of failure. Microservices: independent services, decentralized data, better scaling, harder coordination, distributed system complexity.",
        subcategory: "architecture",
        difficulty: "medium",
        keywords: ["monolithic", "microservices", "architecture", "scaling", "distributed", "services"],
        expectedPoints: ["single vs distributed", "data management", "deployment differences", "scaling approaches", "when to use which"]
      },
      {
        question: "Explain the CAP theorem in distributed systems.",
        modelAnswer: "CAP: Consistency (all nodes see same data), Availability (every request gets response), Partition tolerance (system works despite network failures). You can only guarantee two of three. Distributed systems must choose CP or AP.",
        subcategory: "distributed",
        difficulty: "hard",
        keywords: ["CAP", "consistency", "availability", "partition tolerance", "trade-off"],
        expectedPoints: ["three properties defined", "pick two constraint", "CP systems examples", "AP systems examples", "partition tolerance requirement"]
      },
      {
        question: "What is Git and explain its workflow?",
        modelAnswer: "Git is distributed version control system. Workflow: working directory → staging (git add) → local repository (git commit) → remote repository (git push). Branches enable parallel development, merged via pull requests.",
        subcategory: "tools",
        difficulty: "easy",
        keywords: ["git", "version control", "staging", "commit", "branch", "merge"],
        expectedPoints: ["distributed VCS", "staging area concept", "commit history", "branching strategy", "remote collaboration"]
      }
    ]
  },

  // ==================== HR QUESTIONS ====================
  hr: [
    {
      question: "Tell me about yourself.",
      modelAnswer: "Structure: Present (current role), Past (relevant experience), Future (why this role). 1-2 minutes, professional focus, highlight achievements relevant to job using STAR method examples.",
      subcategory: "introduction",
      difficulty: "easy",
      keywords: ["present", "past", "future", "relevant", "concise", "STAR"],
      expectedPoints: ["present role briefly", "past relevant experience", "future goals alignment", "time management", "professional focus"]
    },
    {
      question: "Why do you want to work for our company?",
      modelAnswer: "Research company thoroughly. Mention specific values, projects, culture, technology stack. Connect your skills to their needs. Show genuine enthusiasm with concrete examples, not generic praise.",
      subcategory: "motivation",
      difficulty: "medium",
      keywords: ["research", "values", "culture", "specific", "enthusiasm", "alignment"],
      expectedPoints: ["company research evidence", "specific values mentioned", "skill alignment shown", "genuine interest demonstrated", "not generic answer"]
    },
    {
      question: "What are your greatest strengths?",
      modelAnswer: "Choose 2-3 relevant strengths with specific examples. Technical: problem-solving, quick learning. Soft skills: communication, teamwork. Back up with STAR method examples from experience.",
      subcategory: "self-awareness",
      difficulty: "easy",
      keywords: ["strengths", "relevant", "examples", "STAR method", "honesty", "job fit"],
      expectedPoints: ["2-3 strengths only", "job relevant choices", "specific examples given", "STAR format used", "humble confidence"]
    },
    {
      question: "Describe a challenging situation you faced and how you handled it.",
      modelAnswer: "Use STAR: Situation (brief context), Task (your responsibility), Action (steps you took), Result (quantified positive outcome). Focus on your contribution, learning, and positive resolution.",
      subcategory: "behavioral",
      difficulty: "medium",
      keywords: ["STAR", "challenge", "action", "result", "problem-solving", "learning"],
      expectedPoints: ["STAR format clear", "specific situation", "your actions emphasized", "quantified result", "learning demonstrated"]
    },
    {
      question: "Where do you see yourself in 5 years?",
      modelAnswer: "Show ambition but realism. Growing expertise in field, taking more responsibility, contributing to company success. Align with company trajectory. Show commitment to growth without being unrealistic.",
      subcategory: "career-goals",
      difficulty: "medium",
      keywords: ["growth", "ambition", "realistic", "alignment", "commitment", "expertise"],
      expectedPoints: ["skill growth plan", "responsibility increase", "company alignment", "realistic timeline", "commitment shown"]
    },
    {
      question: "Why should we hire you over other candidates?",
      modelAnswer: "Don't put others down. Focus on unique combination of skills, experiences, personal qualities. Connect directly to job requirements. Differentiate with specific achievements and cultural fit.",
      subcategory: "differentiation",
      difficulty: "hard",
      keywords: ["unique", "skills", "value", "confidence", "fit", "differentiation"],
      expectedPoints: ["unique value proposition", "specific skill combination", "proven results cited", "cultural fit evidence", "confidence without arrogance"]
    },
    {
      question: "Tell me about a time you failed and what you learned.",
      modelAnswer: "Choose real but not catastrophic failure. Show ownership without excuses. Focus on learning, improvement actions taken, and how you apply lesson now. Demonstrates growth mindset.",
      subcategory: "behavioral",
      difficulty: "hard",
      keywords: ["failure", "learning", "growth", "ownership", "resilience", "improvement"],
      expectedPoints: ["real example chosen", "ownership taken", "no excuses made", "learning articulated", "improvement demonstrated"]
    },
    {
      question: "How do you handle stress and pressure?",
      modelAnswer: "Describe specific strategies: prioritization, breaking tasks down, time management, seeking help when needed, maintaining work-life balance. Give example of successfully handling pressure.",
      subcategory: "stress-management",
      difficulty: "medium",
      keywords: ["stress", "pressure", "prioritization", "time management", "coping strategies"],
      expectedPoints: ["specific strategies listed", "prioritization method", "example provided", "healthy coping mechanisms", "results under pressure"]
    }
  ]
};

// Function to seed database with questions
async function seedQuestions() {
  try {
    const Question = require('../models/Question');
    
    const existingCount = await Question.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} questions. Skipping seed.`);
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

// Function to get questions by skill
function getQuestionsBySkill(skillName) {
  const normalizedSkill = skillName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (const [skill, questions] of Object.entries(questionDatabase.technical)) {
    const normalizedKey = skill.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedKey === normalizedSkill) {
      return questions;
    }
  }
  
  return questionDatabase.technical.general || [];
}

// Function to add custom question
async function addCustomQuestion(questionData) {
  const Question = require('../models/Question');
  return await Question.create({
    ...questionData,
    createdBy: 'admin',
    isActive: true
  });
}

module.exports = {
  questionDatabase,
  seedQuestions,
  getQuestionsBySkill,
  addCustomQuestion
};