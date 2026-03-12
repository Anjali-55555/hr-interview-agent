const Question = require('../models/Question');

const comprehensiveQuestionBank = {
  aptitude: [
    {
      question: "If a train travels 360 km in 4 hours, how long will it take to travel 270 km at the same speed?",
      modelAnswer: "3 hours. Speed = 360/4 = 90 km/h. Time = 270/90 = 3 hours.",
      subcategory: "mathematical",
      difficulty: "easy",
      keywords: ["speed", "time", "distance", "calculation"],
      expectedPoints: ["calculate speed", "apply formula", "correct answer 3 hours"]
    },
    {
      question: "Complete the series: 2, 6, 12, 20, 30, ?",
      modelAnswer: "42. The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.",
      subcategory: "logical",
      difficulty: "medium",
      keywords: ["series", "pattern", "multiplication", "sequence"],
      expectedPoints: ["identify pattern", "n(n+1) formula", "answer 42"]
    },
    {
      question: "A is twice as efficient as B. Together they complete work in 18 days. How long will A take alone?",
      modelAnswer: "27 days. If B does 1 unit/day, A does 2 units/day. Together 3 units/day. Total work = 54 units. A alone = 54/2 = 27 days.",
      subcategory: "work",
      difficulty: "hard",
      keywords: ["efficiency", "work", "days", "calculation"],
      expectedPoints: ["efficiency ratio", "work units", "calculation steps", "27 days"]
    },
    {
      question: "Find the odd one out: Apple, Banana, Carrot, Mango",
      modelAnswer: "Carrot. All others are fruits, carrot is a vegetable.",
      subcategory: "verbal",
      difficulty: "easy",
      keywords: ["classification", "fruits", "vegetables", "logic"],
      expectedPoints: ["identify categories", "carrot is vegetable", "others are fruits"]
    },
    {
      question: "If 5 cats catch 5 mice in 5 minutes, how many cats are needed to catch 100 mice in 100 minutes?",
      modelAnswer: "5 cats. Each cat catches 1 mouse in 5 minutes, so 1 mouse per 5 minutes. In 100 minutes, 1 cat catches 20 mice. 100 mice / 20 = 5 cats.",
      subcategory: "logical",
      difficulty: "medium",
      keywords: ["cats", "mice", "rate", "logic"],
      expectedPoints: ["rate calculation", "per cat rate", "5 cats answer"]
    },
    // ADDED 5 MORE QUESTIONS TO REACH 10
    {
      question: "What is 25% of 480?",
      modelAnswer: "120. 25% = 1/4, so 480/4 = 120.",
      subcategory: "mathematical",
      difficulty: "easy",
      keywords: ["percentage", "calculation", "fraction"],
      expectedPoints: ["25% = 1/4", "480/4", "answer 120"]
    },
    {
      question: "A shopkeeper buys an item for $80 and sells it for $100. What is the profit percentage?",
      modelAnswer: "25%. Profit = $20. Profit % = (20/80) × 100 = 25%.",
      subcategory: "mathematical",
      difficulty: "medium",
      keywords: ["profit", "percentage", "calculation"],
      expectedPoints: ["profit amount", "profit percentage formula", "25% answer"]
    },
    {
      question: "If the ratio of ages of A and B is 3:5 and A is 15 years old, how old is B?",
      modelAnswer: "25 years. 3 parts = 15, so 1 part = 5. B = 5 parts = 25 years.",
      subcategory: "mathematical",
      difficulty: "easy",
      keywords: ["ratio", "age", "calculation"],
      expectedPoints: ["ratio parts", "value per part", "B's age 25"]
    },
    {
      question: "What comes next: AZ, BY, CX, DW, ?",
      modelAnswer: "EV. First letter increments: A,B,C,D,E. Second letter decrements: Z,Y,X,W,V.",
      subcategory: "logical",
      difficulty: "hard",
      keywords: ["series", "pattern", "alphabet"],
      expectedPoints: ["first letter increments", "second letter decrements", "EV answer"]
    },
    {
      question: "A boat travels 20 km upstream in 4 hours and 20 km downstream in 2 hours. What is the speed of the stream?",
      modelAnswer: "2.5 km/h. Upstream speed = 5 km/h, downstream = 10 km/h. Stream speed = (10-5)/2 = 2.5 km/h.",
      subcategory: "mathematical",
      difficulty: "hard",
      keywords: ["upstream", "downstream", "speed", "stream"],
      expectedPoints: ["upstream speed", "downstream speed", "stream speed formula", "2.5 km/h"]
    }
  ],
  
  technical: {
    'javascript': [
      {
        question: "Explain the difference between 'let', 'const', and 'var' in JavaScript.",
        modelAnswer: "var is function-scoped and can be redeclared. let is block-scoped and can be reassigned but not redeclared. const is block-scoped and cannot be reassigned or redeclared. Prefer const by default, use let when reassignment needed.",
        subcategory: "fundamentals",
        difficulty: "easy",
        keywords: ["scope", "block", "function", "reassignment", "declaration"],
        expectedPoints: ["var function scoped", "let block scoped", "const immutable", "redeclaration vs reassignment"]
      },
      {
        question: "What are closures in JavaScript and provide a practical example?",
        modelAnswer: "A closure is a function that remembers its outer variables even when the function is executed elsewhere. Example: function makeCounter() { let count = 0; return function() { return ++count; }; }",
        subcategory: "advanced",
        difficulty: "hard",
        keywords: ["closure", "scope", "lexical", "memory", "function"],
        expectedPoints: ["definition", "lexical scope", "practical example", "memory retention"]
      },
      {
        question: "Explain the Event Loop in JavaScript.",
        modelAnswer: "The Event Loop allows JavaScript to perform non-blocking operations despite being single-threaded. It manages the call stack, callback queue, and microtask queue, executing callbacks when the stack is clear.",
        subcategory: "async",
        difficulty: "hard",
        keywords: ["event loop", "call stack", "queue", "async", "single threaded"],
        expectedPoints: ["single threaded", "call stack", "callback queue", "microtasks", "non-blocking"]
      },
      {
        question: "What is the difference between == and === in JavaScript?",
        modelAnswer: "== performs type coercion before comparison (loose equality), while === checks both value and type without coercion (strict equality). Always use === to avoid unexpected type conversions.",
        subcategory: "fundamentals",
        difficulty: "easy",
        keywords: ["equality", "type coercion", "strict", "loose", "comparison"],
        expectedPoints: ["type coercion", "strict equality", "=== preferred", "examples"]
      },
      // ADDED 6 MORE JAVASCRIPT QUESTIONS
      {
        question: "Explain Promises and async/await in JavaScript.",
        modelAnswer: "Promises represent eventual completion of async operations. async/await is syntactic sugar over Promises making async code look synchronous. async functions return Promises, await pauses execution until Promise resolves.",
        subcategory: "async",
        difficulty: "medium",
        keywords: ["promises", "async", "await", "asynchronous"],
        expectedPoints: ["promise states", "async function", "await keyword", "error handling"]
      },
      {
        question: "What is the 'this' keyword in JavaScript and how does it work?",
        modelAnswer: "'this' refers to the object executing the current function. In methods, it's the object. In functions, it's global (window) or undefined in strict mode. Can be bound with call/apply/bind. Arrow functions inherit 'this' from parent scope.",
        subcategory: "fundamentals",
        difficulty: "medium",
        keywords: ["this", "context", "binding", "arrow functions"],
        expectedPoints: ["context dependent", "method vs function", "binding methods", "arrow function behavior"]
      },
      {
        question: "Explain prototype inheritance in JavaScript.",
        modelAnswer: "JavaScript uses prototype-based inheritance. Each object has a prototype property linking to another object. When accessing a property, JS looks up the prototype chain until found. Class syntax is syntactic sugar over prototypes.",
        subcategory: "advanced",
        difficulty: "hard",
        keywords: ["prototype", "inheritance", "__proto__", "chain"],
        expectedPoints: ["prototype chain", "property lookup", "Object.create", "class vs prototype"]
      },
      {
        question: "What are JavaScript generators and how do they work?",
        modelAnswer: "Generators are functions that can pause and resume execution using yield keyword. They return iterator objects. Useful for lazy evaluation, infinite sequences, and async flow control. function* syntax defines generators.",
        subcategory: "advanced",
        difficulty: "hard",
        keywords: ["generators", "yield", "iterator", "function*"],
        expectedPoints: ["function* syntax", "yield keyword", "iterator protocol", "use cases"]
      },
      {
        question: "Explain the Map and Set objects in JavaScript ES6.",
        modelAnswer: "Map is a key-value collection where keys can be any type. Set is a collection of unique values. Both maintain insertion order. Map has get/set/has methods. Set has add/has/delete. Better performance than objects for frequent additions.",
        subcategory: "fundamentals",
        difficulty: "easy",
        keywords: ["Map", "Set", "ES6", "collection"],
        expectedPoints: ["Map vs Object", "Set uniqueness", "any type keys", "iteration order"]
      },
      {
        question: "What is debouncing and throttling in JavaScript?",
        modelAnswer: "Debouncing delays function execution until after a pause in events (e.g., search input). Throttling limits execution to once per time period (e.g., scroll handlers). Both optimize performance for frequent events.",
        subcategory: "performance",
        difficulty: "medium",
        keywords: ["debounce", "throttle", "performance", "optimization"],
        expectedPoints: ["debounce behavior", "throttle behavior", "use cases", "implementation"]
      }
    ],
    
    'python': [
      {
        question: "Explain list comprehensions in Python with examples.",
        modelAnswer: "List comprehensions provide a concise way to create lists. Syntax: [expression for item in iterable if condition]. Example: [x**2 for x in range(10) if x % 2 == 0] creates squares of even numbers.",
        subcategory: "syntax",
        difficulty: "easy",
        keywords: ["list comprehension", "concise", "iteration", "filter"],
        expectedPoints: ["syntax", "concise creation", "if condition", "performance benefit"]
      },
      {
        question: "What are decorators in Python and how do they work?",
        modelAnswer: "Decorators are functions that modify other functions without changing their source code. They use @syntax and are wrappers that execute code before/after the target function. Example: @timer decorator to measure execution time.",
        subcategory: "advanced",
        difficulty: "hard",
        keywords: ["decorator", "wrapper", "higher order function", "syntactic sugar"],
        expectedPoints: ["@syntax", "wrapper function", "before/after execution", "use cases"]
      },
      {
        question: "Explain the difference between lists and tuples in Python.",
        modelAnswer: "Lists are mutable (can be modified), use [], slower, for changing data. Tuples are immutable (cannot change), use (), faster, hashable, for fixed data. Tuples can be dictionary keys, lists cannot.",
        subcategory: "fundamentals",
        difficulty: "easy",
        keywords: ["mutable", "immutable", "list", "tuple", "performance"],
        expectedPoints: ["mutability", "syntax difference", "performance", "use cases", "hashable"]
      },
      {
        question: "How does Python's garbage collection work?",
        modelAnswer: "Python uses reference counting and generational garbage collection. Objects are freed when reference count reaches zero. Cyclic garbage collector handles circular references in three generations based on survival time.",
        subcategory: "memory",
        difficulty: "hard",
        keywords: ["garbage collection", "reference counting", "cyclic", "memory management"],
        expectedPoints: ["reference counting", "cyclic GC", "generations", "memory leaks"]
      },
      // ADDED 6 MORE PYTHON QUESTIONS
      {
        question: "Explain Python's GIL (Global Interpreter Lock).",
        modelAnswer: "GIL ensures only one thread executes Python bytecode at a time. It simplifies memory management but prevents true parallelism in threads. Use multiprocessing for CPU-bound tasks, threads for I/O-bound tasks.",
        subcategory: "advanced",
        difficulty: "hard",
        keywords: ["GIL", "threading", "multiprocessing", "concurrency"],
        expectedPoints: ["GIL purpose", "thread limitation", "multiprocessing solution", "I/O vs CPU bound"]
      },
      {
        question: "What are Python context managers and how do you create them?",
        modelAnswer: "Context managers handle resource setup/teardown using 'with' statement. Implement __enter__ and __exit__ methods. Used for files, locks, connections. contextlib module provides @contextmanager decorator for simple cases.",
        subcategory: "advanced",
        difficulty: "medium",
        keywords: ["context manager", "with statement", "__enter__", "__exit__"],
        expectedPoints: ["with statement", "__enter__/__exit__", "resource management", "contextlib"]
      },
      {
        question: "Explain Python's method resolution order (MRO) in inheritance.",
        modelAnswer: "MRO determines method lookup order in multiple inheritance. Python uses C3 linearization algorithm. Check with ClassName.__mro__ or mro() method. Ensures consistent, predictable inheritance hierarchy.",
        subcategory: "advanced",
        difficulty: "hard",
        keywords: ["MRO", "inheritance", "super", "C3 linearization"],
        expectedPoints: ["method lookup order", "C3 linearization", "diamond problem", "__mro__ attribute"]
      },
      {
        question: "What is the difference between __str__ and __repr__ in Python?",
        modelAnswer: "__str__ is for user-readable string representation (print()). __repr__ is for developer/debugging representation, should ideally be valid Python code to recreate object. __repr__ fallback for __str__ if not defined.",
        subcategory: "fundamentals",
        difficulty: "medium",
        keywords: ["__str__", "__repr__", "string representation", "dunder methods"],
        expectedPoints: ["user vs developer", "print() vs repr()", "fallback behavior", "best practices"]
      },
      {
        question: "Explain Python's asyncio and asynchronous programming.",
        modelAnswer: "asyncio enables concurrent I/O-bound operations using async/await syntax. Event loop manages coroutines. Unlike threads, coroutines are cooperative multitasking. Ideal for high-concurrency network operations.",
        subcategory: "async",
        difficulty: "hard",
        keywords: ["asyncio", "async", "await", "coroutines"],
        expectedPoints: ["event loop", "async/await syntax", "coroutines vs threads", "use cases"]
      },
      {
        question: "What are Python metaclasses and when would you use them?",
        modelAnswer: "Metaclasses are classes of classes. They control class creation (like classes control instance creation). Use for ORMs, API frameworks, validation. type is default metaclass. Define by setting __metaclass__ or using metaclass= keyword.",
        subcategory: "advanced",
        difficulty: "hard",
        keywords: ["metaclass", "type", "class creation", "metaprogramming"],
        expectedPoints: ["class of classes", "type metaclass", "control class creation", "use cases"]
      }
    ],
    
    'react': [
      {
        question: "Explain the Virtual DOM and its benefits in React.",
        modelAnswer: "Virtual DOM is a lightweight JavaScript representation of the real DOM. React updates the Virtual DOM first, compares with previous state (diffing), then only updates changed elements in real DOM. Benefits: faster updates, less memory, better performance.",
        subcategory: "architecture",
        difficulty: "medium",
        keywords: ["virtual dom", "diffing", "reconciliation", "performance"],
        expectedPoints: ["lightweight copy", "diffing algorithm", "selective updates", "performance benefit"]
      },
      {
        question: "What are React Hooks and why were they introduced?",
        modelAnswer: "Hooks are functions that let you use state and lifecycle features in functional components. useState, useEffect, useContext, etc. They allow logic reuse without class components, solving wrapper hell and making code more readable.",
        subcategory: "hooks",
        difficulty: "medium",
        keywords: ["hooks", "useState", "useEffect", "functional components", "reuse"],
        expectedPoints: ["useState", "useEffect", "functional components", "logic reuse", "no classes needed"]
      },
      {
        question: "Explain useEffect hook with all its dependency scenarios.",
        modelAnswer: "useEffect runs side effects in functional components. [] runs once on mount, [dep] runs when dep changes, no array runs every render. Cleanup function returned runs before next effect or unmount.",
        subcategory: "hooks",
        difficulty: "hard",
        keywords: ["useEffect", "dependencies", "cleanup", "side effects", "lifecycle"],
        expectedPoints: ["dependency array", "mount/unmount", "cleanup function", "update scenarios"]
      },
      // ADDED 7 MORE REACT QUESTIONS
      {
        question: "What is React Context and when should you use it?",
        modelAnswer: "Context provides global state without prop drilling. Create with createContext(), provide with Provider, consume with useContext() or Consumer. Use for theme, auth, language - not for all state (use Redux/Zustand for complex).",
        subcategory: "state",
        difficulty: "medium",
        keywords: ["Context", "createContext", "Provider", "useContext"],
        expectedPoints: ["prop drilling solution", "createContext", "Provider/Consumer", "appropriate use cases"]
      },
      {
        question: "Explain React's useReducer hook and when to prefer it over useState.",
        modelAnswer: "useReducer manages complex state logic with reducer function (state, action) => newState. Prefer over useState when: next state depends on previous, complex state shape, or state logic involves multiple sub-values.",
        subcategory: "hooks",
        difficulty: "hard",
        keywords: ["useReducer", "reducer", "dispatch", "complex state"],
        expectedPoints: ["reducer function", "action dispatching", "vs useState", "complex state scenarios"]
      },
      {
        question: "What are React Portals and why are they useful?",
        modelAnswer: "Portals render children into a DOM node outside parent hierarchy. Use for modals, tooltips, popovers to avoid z-index and overflow:hidden issues. Created with ReactDOM.createPortal(child, container).",
        subcategory: "rendering",
        difficulty: "medium",
        keywords: ["Portal", "createPortal", "DOM", "modals"],
        expectedPoints: ["outside hierarchy", "createPortal API", "use cases", "event bubbling"]
      },
      {
        question: "Explain React's Suspense and lazy loading.",
        modelAnswer: "React.lazy() enables code-splitting by loading components on demand. Suspense shows fallback UI while lazy components load. Also used for data fetching with Suspense boundaries. Improves initial load performance.",
        subcategory: "performance",
        difficulty: "hard",
        keywords: ["Suspense", "lazy", "code splitting", "fallback"],
        expectedPoints: ["React.lazy()", "Suspense component", "fallback UI", "code splitting benefits"]
      },
      {
        question: "What is the difference between controlled and uncontrolled components in React?",
        modelAnswer: "Controlled: React state is single source of truth, form values controlled via onChange handlers. Uncontrolled: DOM handles state, accessed via refs. Controlled preferred for validation, instant updates, predictable state.",
        subcategory: "forms",
        difficulty: "easy",
        keywords: ["controlled", "uncontrolled", "state", "refs"],
        expectedPoints: ["React state vs DOM", "onChange handlers", "useRef access", "when to use each"]
      },
      {
        question: "Explain React's memo, useMemo, and useCallback.",
        modelAnswer: "React.memo prevents re-render if props unchanged. useMemo caches expensive computation results. useCallback caches function references. All optimize performance by preventing unnecessary work.",
        subcategory: "performance",
        difficulty: "hard",
        keywords: ["memo", "useMemo", "useCallback", "optimization"],
        expectedPoints: ["React.memo HOC", "useMemo for values", "useCallback for functions", "dependency arrays"]
      },
      {
        question: "How does React's new Suspense for Data Fetching work?",
        modelAnswer: "Suspense integrates with data fetching libraries. Components 'suspend' while waiting for data, showing nearest Suspense fallback. Avoids race conditions, loading states, and callback hell. Works with Relay, SWR, React Query.",
        subcategory: "async",
        difficulty: "hard",
        keywords: ["Suspense", "data fetching", "concurrent", "transitions"],
        expectedPoints: ["throwing promises", "Suspense boundaries", "fallback states", "concurrent features"]
      }
    ],
    
    'node.js': [
      {
        question: "How does the Node.js event loop work?",
        modelAnswer: "Node.js uses libuv for event loop. Phases: timers, pending callbacks, idle/prepare, poll, check, close callbacks. Async operations are offloaded to thread pool, callbacks queued to event loop phases.",
        subcategory: "architecture",
        difficulty: "hard",
        keywords: ["event loop", "libuv", "phases", "async", "non-blocking"],
        expectedPoints: ["libuv", "event loop phases", "thread pool", "callback queue"]
      },
      {
        question: "What is the difference between require and import in Node.js?",
        modelAnswer: "require is CommonJS, synchronous, runtime, can be conditional. import is ES6, asynchronous, static parsing, hoisted. Node supports both with .mjs or 'type': 'module' in package.json.",
        subcategory: "modules",
        difficulty: "medium",
        keywords: ["require", "import", "CommonJS", "ES6", "modules"],
        expectedPoints: ["CommonJS vs ES6", "synchronous vs async", "static vs dynamic", "usage"]
      },
      // ADDED 8 MORE NODE.JS QUESTIONS
      {
        question: "Explain Node.js streams and their types.",
        modelAnswer: "Streams handle continuous data flow efficiently. Types: Readable, Writable, Duplex (both), Transform (modify data). Use for large files, compression, encryption. Event-driven with data, end, error events.",
        subcategory: "streams",
        difficulty: "hard",
        keywords: ["streams", "Readable", "Writable", "Duplex", "Transform"],
        expectedPoints: ["four stream types", "event-driven", "pipe method", "memory efficiency"]
      },
      {
        question: "What is the cluster module in Node.js and how does it work?",
        modelAnswer: "cluster module enables multi-process Node.js. Master process forks worker processes sharing same port. Workers handle requests independently. Improves performance on multi-core systems. Automatic load balancing.",
        subcategory: "performance",
        difficulty: "hard",
        keywords: ["cluster", "fork", "workers", "multi-core"],
        expectedPoints: ["master/worker pattern", "fork method", "shared port", "load balancing"]
      },
      {
        question: "Explain Node.js Buffer and its purpose.",
        modelAnswer: "Buffer handles binary data in Node.js. Fixed-size chunk of memory outside V8 heap. Used for file system operations, network streams, crypto. Created with Buffer.alloc(), Buffer.from(). Essential for non-string data.",
        subcategory: "buffers",
        difficulty: "medium",
        keywords: ["Buffer", "binary", "memory", "alloc"],
        expectedPoints: ["binary data", "outside V8 heap", "Buffer methods", "use cases"]
      },
      {
        question: "What are Node.js worker_threads and when to use them?",
        modelAnswer: "worker_threads enable true parallelism in Node.js. Run JavaScript in parallel threads, share memory with SharedArrayBuffer. Use for CPU-intensive tasks (image processing, complex calculations) that block event loop.",
        subcategory: "async",
        difficulty: "hard",
        keywords: ["worker_threads", "parallelism", "SharedArrayBuffer", "CPU intensive"],
        expectedPoints: ["true threads", "vs cluster", "SharedArrayBuffer", "CPU-bound tasks"]
      },
      {
        question: "Explain Node.js middleware pattern in Express.",
        modelAnswer: "Middleware are functions with (req, res, next) signature. Execute sequentially, can modify request/response, end cycle, or call next(). Used for logging, auth, parsing, error handling. Order matters.",
        subcategory: "express",
        difficulty: "medium",
        keywords: ["middleware", "Express", "next()", "pipeline"],
        expectedPoints: ["(req,res,next)", "execution order", "modifying req/res", "error handling"]
      },
      {
        question: "What is the difference between process.nextTick() and setImmediate()?",
        modelAnswer: "nextTick() runs after current operation, before event loop continues (microtask). setImmediate() runs on next event loop iteration (check phase). nextTick has higher priority, can starve I/O if overused.",
        subcategory: "async",
        difficulty: "hard",
        keywords: ["nextTick", "setImmediate", "event loop", "microtask"],
        expectedPoints: ["execution timing", "priority order", "use cases", "starvation risk"]
      },
      {
        question: "Explain Node.js REPL and its features.",
        modelAnswer: "REPL (Read-Eval-Print Loop) is interactive Node.js shell. Features: tab completion, command history (.break, .clear, .exit, .save, .load), underscore for last result. Great for experimentation and debugging.",
        subcategory: "tools",
        difficulty: "easy",
        keywords: ["REPL", "interactive", "shell", "commands"],
        expectedPoints: ["Read-Eval-Print", "tab completion", "special commands", "use cases"]
      },
      {
        question: "How do you handle errors in Node.js streams?",
        modelAnswer: "Stream errors emit 'error' event. Must attach error listeners to prevent crashes. Use pipeline() utility for automatic error propagation and cleanup. Destroy streams properly on error to free resources.",
        subcategory: "streams",
        difficulty: "medium",
        keywords: ["stream errors", "error event", "pipeline", "destroy"],
        expectedPoints: ["error event listener", "pipeline utility", "resource cleanup", "best practices"]
      }
    ],
    
    'sql': [
      {
        question: "Explain SQL JOIN types with examples.",
        modelAnswer: "INNER JOIN returns matching rows. LEFT JOIN returns all left rows with matching right. RIGHT JOIN opposite. FULL OUTER JOIN all rows from both. CROSS JOIN cartesian product.",
        subcategory: "queries",
        difficulty: "medium",
        keywords: ["JOIN", "INNER", "LEFT", "RIGHT", "FULL OUTER"],
        expectedPoints: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER", "use cases"]
      },
      {
        question: "What are database indexes and when should you use them?",
        modelAnswer: "Indexes speed up SELECT queries by creating data structures (B-trees) for fast lookup. Trade-off: slower INSERT/UPDATE/DELETE and more storage. Use on frequently queried columns, avoid on frequently updated tables.",
        subcategory: "optimization",
        difficulty: "medium",
        keywords: ["index", "B-tree", "performance", "optimization", "trade-off"],
        expectedPoints: ["fast lookup", "B-tree structure", "storage trade-off", "when to use"]
      },
      // ADDED 8 MORE SQL QUESTIONS
      {
        question: "Explain database normalization and its normal forms.",
        modelAnswer: "Normalization reduces redundancy and improves integrity. 1NF: atomic values. 2NF: 1NF + no partial dependencies. 3NF: 2NF + no transitive dependencies. BCNF: stricter 3NF. Higher normal forms exist but rarely used.",
        subcategory: "design",
        difficulty: "hard",
        keywords: ["normalization", "1NF", "2NF", "3NF", "BCNF"],
        expectedPoints: ["redundancy elimination", "each normal form", "dependencies", "trade-offs"]
      },
      {
        question: "What is the difference between WHERE and HAVING in SQL?",
        modelAnswer: "WHERE filters rows before grouping. HAVING filters groups after GROUP BY. WHERE cannot use aggregate functions. HAVING operates on aggregated results. Use WHERE first for performance, HAVING for group conditions.",
        subcategory: "queries",
        difficulty: "medium",
        keywords: ["WHERE", "HAVING", "GROUP BY", "filtering"],
        expectedPoints: ["row vs group filtering", "aggregate functions", "execution order", "performance"]
      },
      {
        question: "Explain SQL transactions and ACID properties.",
        modelAnswer: "Transaction is logical unit of work. ACID: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don't interfere), Durability (committed changes persist). BEGIN, COMMIT, ROLLBACK commands.",
        subcategory: "transactions",
        difficulty: "hard",
        keywords: ["transaction", "ACID", "atomicity", "consistency", "isolation", "durability"],
        expectedPoints: ["each ACID property", "BEGIN/COMMIT/ROLLBACK", "isolation levels", "use cases"]
      },
      {
        question: "What are SQL window functions and provide examples?",
        modelAnswer: "Window functions perform calculations across row sets related to current row. ROW_NUMBER(), RANK(), DENSE_RANK() for ranking. LAG(), LEAD() for accessing other rows. OVER() clause defines window. No GROUP BY needed.",
        subcategory: "advanced",
        difficulty: "hard",
        keywords: ["window functions", "OVER", "ROW_NUMBER", "LAG", "LEAD"],
        expectedPoints: ["OVER clause", "partitioning", "ordering", "common functions", "vs GROUP BY"]
      },
      {
        question: "Explain database sharding and its strategies.",
        modelAnswer: "Sharding distributes data across multiple servers. Strategies: horizontal (rows across shards), vertical (columns across shards), hash-based (deterministic distribution), range-based (by key range). Improves scalability, adds complexity.",
        subcategory: "scaling",
        difficulty: "hard",
        keywords: ["sharding", "horizontal", "vertical", "hash", "range"],
        expectedPoints: ["sharding types", "distribution strategies", "benefits", "challenges"]
      },
      {
        question: "What is the difference between clustered and non-clustered indexes?",
        modelAnswer: "Clustered index determines physical row order (one per table). Non-clustered is separate structure with pointers to data (many allowed). Clustered faster for range queries, non-clustered better for lookups.",
        subcategory: "optimization",
        difficulty: "hard",
        keywords: ["clustered index", "non-clustered", "physical order", "pointers"],
        expectedPoints: ["physical vs logical", "one vs many", "performance characteristics", "use cases"]
      },
      {
        question: "Explain SQL injection and how to prevent it.",
        modelAnswer: "SQL injection is malicious SQL inserted via user input. Prevention: parameterized queries/prepared statements (never concatenate), input validation, least privilege principle, ORM usage, escaping (last resort).",
        subcategory: "security",
        difficulty: "medium",
        keywords: ["SQL injection", "prepared statements", "parameterized", "security"],
        expectedPoints: ["attack mechanism", "parameterized queries", "input validation", "ORM protection"]
      },
      {
        question: "What are common table expressions (CTEs) in SQL?",
        modelAnswer: "CTEs are temporary result sets defined with WITH clause. Improve readability vs subqueries. Recursive CTEs handle hierarchical data. Materialized CTEs (in some DBs) cache results. Scope is single query.",
        subcategory: "queries",
        difficulty: "medium",
        keywords: ["CTE", "WITH clause", "recursive", "temporary"],
        expectedPoints: ["WITH syntax", "vs subqueries", "recursive CTEs", "readability benefits"]
      }
    ],
    
    'machine learning': [
      {
        question: "Explain the difference between supervised and unsupervised learning.",
        modelAnswer: "Supervised learning uses labeled data (input-output pairs) to train models for prediction (regression, classification). Unsupervised learning finds patterns in unlabeled data (clustering, dimensionality reduction).",
        subcategory: "fundamentals",
        difficulty: "easy",
        keywords: ["supervised", "unsupervised", "labeled data", "clustering", "classification"],
        expectedPoints: ["labeled vs unlabeled", "supervised examples", "unsupervised examples", "use cases"]
      },
      {
        question: "What is overfitting and how do you prevent it?",
        modelAnswer: "Overfitting: model learns training data too well, performs poorly on new data. Solutions: cross-validation, regularization (L1/L2), dropout, early stopping, more data, feature selection, simpler model.",
        subcategory: "optimization",
        difficulty: "medium",
        keywords: ["overfitting", "regularization", "cross-validation", "generalization"],
        expectedPoints: ["definition", "symptoms", "regularization", "cross-validation", "early stopping"]
      },
      // ADDED 8 MORE ML QUESTIONS
      {
        question: "Explain precision, recall, and F1-score in classification.",
        modelAnswer: "Precision: true positives / (true positives + false positives). Recall: true positives / (true positives + false negatives). F1: harmonic mean of precision and recall. Use precision when FP costly, recall when FN costly.",
        subcategory: "evaluation",
        difficulty: "medium",
        keywords: ["precision", "recall", "F1-score", "confusion matrix"],
        expectedPoints: ["precision formula", "recall formula", "F1 calculation", "when to use each"]
      },
      {
        question: "What is gradient descent and how does it work?",
        modelAnswer: "Gradient descent optimizes model parameters by iteratively moving in direction of steepest descent (negative gradient). Learning rate controls step size. Variants: batch, stochastic, mini-batch. Converges to local minimum.",
        subcategory: "optimization",
        difficulty: "medium",
        keywords: ["gradient descent", "learning rate", "convergence", "optimization"],
        expectedPoints: ["gradient calculation", "learning rate", "batch vs stochastic", "convergence"]
      },
      {
        question: "Explain the bias-variance tradeoff in machine learning.",
        modelAnswer: "Bias: error from oversimplified assumptions. Variance: error from sensitivity to training data. High bias causes underfitting, high variance causes overfitting. Goal: find balance for optimal generalization.",
        subcategory: "fundamentals",
        difficulty: "hard",
        keywords: ["bias", "variance", "tradeoff", "underfitting", "overfitting"],
        expectedPoints: ["bias definition", "variance definition", "underfitting vs overfitting", "balancing"]
      },
      {
        question: "What are ensemble methods and why are they effective?",
        modelAnswer: "Ensemble methods combine multiple models for better performance. Bagging (Random Forest) reduces variance. Boosting (AdaBoost, XGBoost) reduces bias. Stacking combines different model types. Wisdom of crowds effect.",
        subcategory: "advanced",
        difficulty: "hard",
        keywords: ["ensemble", "bagging", "boosting", "Random Forest", "XGBoost"],
        expectedPoints: ["bagging vs boosting", "Random Forest", "AdaBoost/XGBoost", "why they work"]
      },
      {
        question: "Explain neural network backpropagation.",
        modelAnswer: "Backpropagation calculates gradients for weight updates. Forward pass computes output, backward pass propagates error from output to input using chain rule. Combined with optimizer (SGD, Adam) to update weights.",
        subcategory: "deep learning",
        difficulty: "hard",
        keywords: ["backpropagation", "gradient", "chain rule", "weight update"],
        expectedPoints: ["forward pass", "backward pass", "chain rule", "gradient calculation"]
      },
      {
        question: "What is the difference between bagging and boosting?",
        modelAnswer: "Bagging: trains models in parallel on random subsets, averages predictions (reduces variance). Boosting: trains models sequentially, each correcting previous errors (reduces bias). Random Forest vs Gradient Boosting.",
        subcategory: "advanced",
        difficulty: "medium",
        keywords: ["bagging", "boosting", "parallel", "sequential", "ensemble"],
        expectedPoints: ["parallel vs sequential", "variance vs bias reduction", "Random Forest", "Gradient Boosting"]
      },
      {
        question: "Explain feature scaling and normalization in ML.",
        modelAnswer: "Feature scaling ensures all features contribute equally. Normalization scales to [0,1] range. Standardization (z-score) scales to mean=0, std=1. Essential for distance-based algorithms (KNN, SVM, neural networks).",
        subcategory: "preprocessing",
        difficulty: "medium",
        keywords: ["feature scaling", "normalization", "standardization", "preprocessing"],
        expectedPoints: ["normalization formula", "standardization formula", "when to use", "affected algorithms"]
      },
      {
        question: "What are convolutional neural networks (CNNs) and their applications?",
        modelAnswer: "CNNs are neural networks for grid-like data (images). Use convolutional layers (filters), pooling (downsampling), fully-connected layers. Translation invariant, parameter efficient. Applications: image classification, object detection, medical imaging.",
        subcategory: "deep learning",
        difficulty: "hard",
        keywords: ["CNN", "convolution", "pooling", "image classification"],
        expectedPoints: ["convolution operation", "pooling purpose", "layer architecture", "applications"]
      }
    ],
    
    'general': [
      {
        question: "Explain REST API principles and best practices.",
        modelAnswer: "REST: Stateless, client-server, cacheable, uniform interface. Use HTTP methods correctly: GET (read), POST (create), PUT/PATCH (update), DELETE (remove). Use proper status codes, versioning, pagination.",
        subcategory: "web",
        difficulty: "medium",
        keywords: ["REST", "API", "HTTP methods", "stateless", "resources"],
        expectedPoints: ["stateless", "HTTP verbs", "status codes", "resource-based URLs", "versioning"]
      },
      {
        question: "What is the difference between monolithic and microservices architecture?",
        modelAnswer: "Monolithic: single codebase, easier development, harder scaling. Microservices: independent services, decentralized, better scaling, harder coordination. Choose based on team size, complexity, scaling needs.",
        subcategory: "architecture",
        difficulty: "medium",
        keywords: ["monolithic", "microservices", "architecture", "scaling", "distributed"],
        expectedPoints: ["single vs distributed", "pros/cons", "when to use which", "communication"]
      },
      {
        question: "Explain the CAP theorem in distributed systems.",
        modelAnswer: "CAP: Consistency, Availability, Partition tolerance. You can only guarantee two of three. CP: consistent during partitions (databases). AP: available during partitions (web apps). All distributed systems must choose P.",
        subcategory: "distributed",
        difficulty: "hard",
        keywords: ["CAP", "consistency", "availability", "partition tolerance", "trade-off"],
        expectedPoints: ["three properties", "pick two", "CP systems", "AP systems", "partition tolerance required"]
      },
      // ADDED 7 MORE GENERAL QUESTIONS
      {
        question: "What is OAuth 2.0 and how does it work?",
        modelAnswer: "OAuth 2.0 is authorization framework for delegated access. Roles: Resource Owner, Client, Authorization Server, Resource Server. Flows: Authorization Code (secure), Implicit (legacy), Client Credentials (server-to-server), Device Code.",
        subcategory: "security",
        difficulty: "hard",
        keywords: ["OAuth 2.0", "authorization", "token", "authentication"],
        expectedPoints: ["roles", "authorization code flow", "access tokens", "refresh tokens", "security"]
      },
      {
        question: "Explain the difference between authentication and authorization.",
        modelAnswer: "Authentication verifies identity (who you are) - passwords, biometrics, MFA. Authorization determines access rights (what you can do) - roles, permissions, ACLs. Authentication first, then authorization.",
        subcategory: "security",
        difficulty: "easy",
        keywords: ["authentication", "authorization", "identity", "permissions"],
        expectedPoints: ["identity verification", "access control", "order of operations", "examples"]
      },
      {
        question: "What are design patterns and name some common ones.",
        modelAnswer: "Design patterns are reusable solutions to common problems. Creational: Singleton, Factory. Structural: Adapter, Decorator, Facade. Behavioral: Observer, Strategy, Command. Improve code maintainability and communication.",
        subcategory: "design",
        difficulty: "medium",
        keywords: ["design patterns", "creational", "structural", "behavioral"],
        expectedPoints: ["pattern categories", "examples from each", "benefits", "when to use"]
      },
      {
        question: "Explain Big O notation and common time complexities.",
        modelAnswer: "Big O describes algorithm efficiency as input grows. O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic, O(2^n) exponential. Lower is better. Analyze worst-case scenario.",
        subcategory: "algorithms",
        difficulty: "medium",
        keywords: ["Big O", "time complexity", "space complexity", "algorithm analysis"],
        expectedPoints: ["common notations", "growth rates", "best to worst", "analysis examples"]
      },
      {
        question: "What is Continuous Integration/Continuous Deployment (CI/CD)?",
        modelAnswer: "CI: automate building/testing code on every commit. CD: automate deployment after successful CI. Tools: Jenkins, GitHub Actions, GitLab CI. Benefits: faster releases, fewer bugs, automated testing, consistent deployments.",
        subcategory: "devops",
        difficulty: "medium",
        keywords: ["CI/CD", "continuous integration", "continuous deployment", "automation"],
        expectedPoints: ["CI process", "CD process", "pipeline stages", "benefits", "tools"]
      },
      {
        question: "Explain the difference between TCP and UDP.",
        modelAnswer: "TCP: connection-oriented, reliable, ordered delivery, flow control, error checking (HTTP, FTP). UDP: connectionless, fast, no guarantees, no ordering (streaming, DNS, gaming). Choose based on reliability vs speed needs.",
        subcategory: "networking",
        difficulty: "medium",
        keywords: ["TCP", "UDP", "protocol", "reliable", "connection"],
        expectedPoints: ["connection oriented vsless", "reliability", "ordering", "use cases", "speed"]
      },
      {
        question: "What is Docker and how does containerization work?",
        modelAnswer: "Docker packages applications with dependencies into containers. Containers share OS kernel but isolated processes, filesystem, network. Lightweight vs VMs. Dockerfile defines image. Docker Compose for multi-container apps.",
        subcategory: "devops",
        difficulty: "medium",
        keywords: ["Docker", "container", "image", "Dockerfile", "containerization"],
        expectedPoints: ["containers vs VMs", "Dockerfile", "images and layers", "Docker Compose", "benefits"]
      }
    ]
  },
  
  hr: [
    {
      question: "Tell me about yourself.",
      modelAnswer: "Structure: Present (current role), Past (relevant experience), Future (why this role). 1-2 minutes, professional focus, highlight achievements relevant to job. Example: 'I'm a software engineer with 3 years in web development, specializing in React and Node.js. I led a team that reduced load times by 40%. I'm excited about this role because...'",
      subcategory: "introduction",
      difficulty: "easy",
      keywords: ["present", "past", "future", "relevant", "concise"],
      expectedPoints: ["present role", "past experience", "future goals", "relevance to job", "time management"]
    },
    {
      question: "Why do you want to work for our company?",
      modelAnswer: "Research company thoroughly. Mention specific values, projects, culture. Connect your skills to their needs. Show genuine enthusiasm. Avoid generic answers like 'good reputation'.",
      subcategory: "motivation",
      difficulty: "medium",
      keywords: ["research", "values", "culture", "specific", "enthusiasm"],
      expectedPoints: ["company research", "specific values", "skill alignment", "genuine interest", "not generic"]
    },
    {
      question: "What are your greatest strengths?",
      modelAnswer: "Choose 2-3 relevant strengths with specific examples. Technical: problem-solving, quick learning. Soft skills: communication, teamwork. Back up with STAR method examples.",
      subcategory: "self-awareness",
      difficulty: "easy",
      keywords: ["strengths", "relevant", "examples", "STAR method", "honesty"],
      expectedPoints: ["2-3 strengths", "job relevant", "specific examples", "STAR format", "not arrogant"]
    },
    {
      question: "Describe a challenging situation you faced and how you handled it.",
      modelAnswer: "Use STAR: Situation (brief context), Task (your responsibility), Action (steps you took), Result (quantified outcome). Focus on your contribution, not team. Show problem-solving.",
      subcategory: "behavioral",
      difficulty: "medium",
      keywords: ["STAR", "challenge", "action", "result", "problem-solving"],
      expectedPoints: ["STAR format", "specific situation", "your actions", "quantified result", "learning"]
    },
    {
      question: "Where do you see yourself in 5 years?",
      modelAnswer: "Show ambition but realism. Growing expertise, taking responsibility, contributing to company success. Align with company trajectory. Avoid 'in your job' or 'starting my own company'.",
      subcategory: "career-goals",
      difficulty: "medium",
      keywords: ["growth", "ambition", "realistic", "alignment", "commitment"],
      expectedPoints: ["skill growth", "responsibility", "company alignment", "realistic timeline", "commitment"]
    },
    {
      question: "Why should we hire you over other candidates?",
      modelAnswer: "Don't put others down. Focus on unique combination of skills, experiences, and personal qualities. Connect directly to job requirements. Be confident but not arrogant.",
      subcategory: "differentiation",
      difficulty: "hard",
      keywords: ["unique", "skills", "value", "confidence", "fit"],
      expectedPoints: ["unique combination", "direct job fit", "proven results", "cultural fit", "confidence"]
    },
    {
      question: "Tell me about a time you failed and what you learned.",
      modelAnswer: "Choose real but not catastrophic failure. Show ownership, not excuses. Focus on learning and improvement. End with how you apply that lesson now.",
      subcategory: "behavioral",
      difficulty: "hard",
      keywords: ["failure", "learning", "growth", "ownership", "resilience"],
      expectedPoints: ["real example", "took ownership", "no excuses", "what learned", "applied since"]
    },
    // ADDED 3 MORE HR QUESTIONS TO REACH 10
    {
      question: "How do you handle conflict in a team?",
      modelAnswer: "Address directly and professionally. Listen to all sides, find common ground, focus on issue not personalities. Seek win-win solutions. Escalate only if necessary. Example of successful resolution.",
      subcategory: "behavioral",
      difficulty: "medium",
      keywords: ["conflict", "team", "resolution", "communication"],
      expectedPoints: ["direct approach", "active listening", "common ground", "win-win", "example"]
    },
    {
      question: "What is your preferred work style?",
      modelAnswer: "Describe environment where you thrive: collaborative vs independent, structured vs flexible. Show adaptability. Connect to company's work culture. Mention tools/methods that help you succeed.",
      subcategory: "culture-fit",
      difficulty: "easy",
      keywords: ["work style", "environment", "collaboration", "adaptability"],
      expectedPoints: ["preferred environment", "collaboration level", "adaptability", "company alignment"]
    },
    {
      question: "Describe your ideal manager.",
      modelAnswer: "Focus on leadership qualities: supportive, provides autonomy, gives constructive feedback, communicates clearly. Show you can work with various styles. Avoid demanding specific personality type.",
      subcategory: "culture-fit",
      difficulty: "medium",
      keywords: ["manager", "leadership", "feedback", "autonomy"],
      expectedPoints: ["key qualities", "communication style", "autonomy level", "flexibility"]
    }
  ]
};

async function seedQuestions() {
  try {
    const count = await Question.countDocuments();
    if (count > 0) {
      console.log('Questions already seeded');
      return;
    }

    console.log('Seeding questions...');

    // Seed aptitude questions (10 total)
    for (const q of comprehensiveQuestionBank.aptitude) {
      await Question.create({
        ...q,
        category: 'aptitude',
        relatedSkills: []
      });
    }

    // Seed technical questions (10+ per skill)
    for (const [skill, questions] of Object.entries(comprehensiveQuestionBank.technical)) {
      for (const q of questions) {
        await Question.create({
          ...q,
          category: 'technical',
          relatedSkills: [skill.toLowerCase(), ...(q.relatedSkills || [])]
        });
      }
    }

    // Seed HR questions (10 total)
    for (const q of comprehensiveQuestionBank.hr) {
      await Question.create({
        ...q,
        category: 'hr',
        relatedSkills: []
      });
    }

    console.log('Questions seeded successfully');
    console.log(`Aptitude: ${comprehensiveQuestionBank.aptitude.length}`);
    console.log(`Technical skills: ${Object.keys(comprehensiveQuestionBank.technical).length} categories`);
    console.log(`HR: ${comprehensiveQuestionBank.hr.length}`);
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
}

module.exports = seedQuestions;