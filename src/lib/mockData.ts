export interface Test {
  id: string;
  name: string;
  description: string;
  model: string;
  taskDescription: string;
  expectedOutcome: string;
  maxAttempts: number;
  timeLimitMinutes: number;
  tokenBudget: number;
  candidates: number;
  avgScore: number;
  completionRate: number;
  createdAt: string;
  status: "active" | "draft" | "archived";
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  promptScore: number;
  efficiency: number;
  speed: number;
  accuracy: number;
  attemptsUsed: number;
  tokensUsed: number;
  timeSpentMinutes: number;
  testId: string;
  testName: string;
  completedAt: string;
  percentile: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  promptScore: number;
  testsCompleted: number;
  avgEfficiency: number;
  avgSpeed: number;
  avgAccuracy: number;
  badges: string[];
}

export const mockTests: Test[] = [
  {
    id: "test-001",
    name: "Write a Marketing Email",
    description: "Craft a compelling product launch email for a B2B SaaS tool targeting enterprise CTOs. The email should drive demo bookings while maintaining a professional tone.",
    model: "GPT-4o",
    taskDescription: "Write a product launch announcement email for 'CloudSync Pro', a new enterprise data synchronization platform. Target audience: CTOs at companies with 500+ employees. Goal: Drive demo bookings. Include subject line, preview text, and full email body.",
    expectedOutcome: "A professional, compelling email with clear value proposition, social proof elements, and a strong call-to-action for booking a demo.",
    maxAttempts: 5,
    timeLimitMinutes: 15,
    tokenBudget: 2000,
    candidates: 12,
    avgScore: 61,
    completionRate: 83,
    createdAt: "2026-01-15",
    status: "active",
  },
  {
    id: "test-002",
    name: "Debug This Code",
    description: "Identify and fix a subtle bug in a Python async function that handles database connection pooling. Tests ability to provide precise, actionable debugging prompts.",
    model: "Claude",
    taskDescription: "The following Python async function has a race condition in its connection pool management. Use AI to identify the bug, explain why it occurs, and provide a corrected version with proper locking.",
    expectedOutcome: "Correct identification of the race condition, clear explanation of the threading issue, and a working fix using asyncio.Lock or similar mechanism.",
    maxAttempts: 3,
    timeLimitMinutes: 20,
    tokenBudget: 3000,
    candidates: 8,
    avgScore: 54,
    completionRate: 62,
    createdAt: "2026-01-22",
    status: "active",
  },
  {
    id: "test-003",
    name: "Summarize a Legal Document",
    description: "Condense a 12-page software licensing agreement into an executive summary. Measures ability to extract key terms and present them clearly.",
    model: "GPT-4o",
    taskDescription: "Summarize the provided Software License Agreement into a 1-page executive summary. Highlight: key obligations, liability limitations, termination clauses, IP ownership, and any unusual terms that legal should flag.",
    expectedOutcome: "A concise, well-structured executive summary that captures all critical legal terms without losing important nuances.",
    maxAttempts: 4,
    timeLimitMinutes: 12,
    tokenBudget: 1500,
    candidates: 6,
    avgScore: 67,
    completionRate: 83,
    createdAt: "2026-02-01",
    status: "active",
  },
  {
    id: "test-004",
    name: "Create a Data Pipeline",
    description: "Design and document an ETL pipeline architecture using AI assistance. Evaluates ability to break down complex technical requirements into clear prompts.",
    model: "Gemini",
    taskDescription: "Design an ETL pipeline that ingests data from 3 sources (REST API, PostgreSQL database, S3 CSV files), transforms it into a unified schema, and loads it into a Snowflake data warehouse. Include error handling, monitoring, and retry logic.",
    expectedOutcome: "A complete pipeline architecture with technology choices, data flow diagrams described in text, transformation logic, and operational considerations.",
    maxAttempts: 6,
    timeLimitMinutes: 25,
    tokenBudget: 4000,
    candidates: 4,
    avgScore: 52,
    completionRate: 50,
    createdAt: "2026-02-05",
    status: "active",
  },
  {
    id: "test-005",
    name: "Customer Objection Handling",
    description: "Draft responses to common customer objections about pricing.",
    model: "GPT-4o",
    taskDescription: "Draft responses to 5 common pricing objections for a SaaS product. Each response should be empathetic, address the concern directly, and pivot to value.",
    expectedOutcome: "Five distinct responses that feel natural and address each objection without being dismissive.",
    maxAttempts: 4,
    timeLimitMinutes: 10,
    tokenBudget: 1500,
    candidates: 0,
    avgScore: 0,
    completionRate: 0,
    createdAt: "2026-02-08",
    status: "draft",
  },
];

// Realistic score distribution for a small company — some good, mostly average, some poor
export const mockCandidates: Candidate[] = [
  { id: "c-001", name: "Sarah Chen", email: "sarah.chen@meridian.io", promptScore: 87, efficiency: 85, speed: 88, accuracy: 90, attemptsUsed: 2, tokensUsed: 940, timeSpentMinutes: 9, testId: "test-001", testName: "Write a Marketing Email", completedAt: "2026-02-08", percentile: 91 },
  { id: "c-002", name: "Marcus Rodriguez", email: "m.rodriguez@vantage.co", promptScore: 78, efficiency: 75, speed: 82, accuracy: 77, attemptsUsed: 2, tokensUsed: 1180, timeSpentMinutes: 11, testId: "test-002", testName: "Debug This Code", completedAt: "2026-02-08", percentile: 78 },
  { id: "c-003", name: "Aisha Patel", email: "aisha@figmentlabs.com", promptScore: 72, efficiency: 70, speed: 74, accuracy: 73, attemptsUsed: 3, tokensUsed: 1050, timeSpentMinutes: 12, testId: "test-001", testName: "Write a Marketing Email", completedAt: "2026-02-07", percentile: 68 },
  { id: "c-004", name: "James O'Brien", email: "jobrien@clearpoint.dev", promptScore: 68, efficiency: 65, speed: 71, accuracy: 69, attemptsUsed: 3, tokensUsed: 1340, timeSpentMinutes: 14, testId: "test-003", testName: "Summarize a Legal Document", completedAt: "2026-02-07", percentile: 60 },
  { id: "c-005", name: "Yuki Tanaka", email: "y.tanaka@korvus.jp", promptScore: 64, efficiency: 62, speed: 67, accuracy: 63, attemptsUsed: 4, tokensUsed: 1780, timeSpentMinutes: 18, testId: "test-004", testName: "Create a Data Pipeline", completedAt: "2026-02-06", percentile: 52 },
  { id: "c-006", name: "Emma Larsson", email: "emma.l@nordichr.se", promptScore: 61, efficiency: 58, speed: 64, accuracy: 62, attemptsUsed: 3, tokensUsed: 1240, timeSpentMinutes: 13, testId: "test-001", testName: "Write a Marketing Email", completedAt: "2026-02-06", percentile: 46 },
  { id: "c-007", name: "David Kim", email: "d.kim@strata.systems", promptScore: 58, efficiency: 60, speed: 55, accuracy: 59, attemptsUsed: 4, tokensUsed: 2080, timeSpentMinutes: 19, testId: "test-002", testName: "Debug This Code", completedAt: "2026-02-05", percentile: 40 },
  { id: "c-008", name: "Priya Sharma", email: "priya.s@bluespring.in", promptScore: 55, efficiency: 52, speed: 58, accuracy: 56, attemptsUsed: 3, tokensUsed: 1380, timeSpentMinutes: 11, testId: "test-003", testName: "Summarize a Legal Document", completedAt: "2026-02-05", percentile: 34 },
  { id: "c-009", name: "Alex Novak", email: "a.novak@pivotware.cz", promptScore: 51, efficiency: 48, speed: 54, accuracy: 52, attemptsUsed: 5, tokensUsed: 1920, timeSpentMinutes: 22, testId: "test-004", testName: "Create a Data Pipeline", completedAt: "2026-02-04", percentile: 27 },
  { id: "c-010", name: "Fatima Al-Hassan", email: "f.alhassan@qubic.ae", promptScore: 47, efficiency: 44, speed: 50, accuracy: 48, attemptsUsed: 4, tokensUsed: 2340, timeSpentMinutes: 14, testId: "test-001", testName: "Write a Marketing Email", completedAt: "2026-02-04", percentile: 20 },
  { id: "c-011", name: "Tom Fischer", email: "t.fischer@grundwerk.de", promptScore: 43, efficiency: 40, speed: 46, accuracy: 44, attemptsUsed: 5, tokensUsed: 2680, timeSpentMinutes: 15, testId: "test-002", testName: "Debug This Code", completedAt: "2026-02-03", percentile: 14 },
  { id: "c-012", name: "Nina Kowalski", email: "n.kowalski@apexrecruit.pl", promptScore: 38, efficiency: 35, speed: 41, accuracy: 39, attemptsUsed: 4, tokensUsed: 2900, timeSpentMinutes: 12, testId: "test-003", testName: "Summarize a Legal Document", completedAt: "2026-02-03", percentile: 8 },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, id: "c-001", name: "Sarah Chen", promptScore: 87, testsCompleted: 5, avgEfficiency: 85, avgSpeed: 88, avgAccuracy: 90, badges: ["Top 10%"] },
  { rank: 2, id: "c-002", name: "Marcus Rodriguez", promptScore: 78, testsCompleted: 4, avgEfficiency: 75, avgSpeed: 82, avgAccuracy: 77, badges: ["Top 25%"] },
  { rank: 3, id: "c-003", name: "Aisha Patel", promptScore: 72, testsCompleted: 3, avgEfficiency: 70, avgSpeed: 74, avgAccuracy: 73, badges: [] },
  { rank: 4, id: "c-004", name: "James O'Brien", promptScore: 68, testsCompleted: 4, avgEfficiency: 65, avgSpeed: 71, avgAccuracy: 69, badges: [] },
  { rank: 5, id: "c-005", name: "Yuki Tanaka", promptScore: 64, testsCompleted: 2, avgEfficiency: 62, avgSpeed: 67, avgAccuracy: 63, badges: [] },
  { rank: 6, id: "c-006", name: "Emma Larsson", promptScore: 61, testsCompleted: 3, avgEfficiency: 58, avgSpeed: 64, avgAccuracy: 62, badges: [] },
  { rank: 7, id: "c-007", name: "David Kim", promptScore: 58, testsCompleted: 2, avgEfficiency: 60, avgSpeed: 55, avgAccuracy: 59, badges: [] },
  { rank: 8, id: "c-008", name: "Priya Sharma", promptScore: 55, testsCompleted: 3, avgEfficiency: 52, avgSpeed: 58, avgAccuracy: 56, badges: [] },
  { rank: 9, id: "c-009", name: "Alex Novak", promptScore: 51, testsCompleted: 1, avgEfficiency: 48, avgSpeed: 54, avgAccuracy: 52, badges: [] },
  { rank: 10, id: "c-010", name: "Fatima Al-Hassan", promptScore: 47, testsCompleted: 2, avgEfficiency: 44, avgSpeed: 50, avgAccuracy: 48, badges: [] },
  { rank: 11, id: "c-011", name: "Tom Fischer", promptScore: 43, testsCompleted: 1, avgEfficiency: 40, avgSpeed: 46, avgAccuracy: 44, badges: [] },
  { rank: 12, id: "c-012", name: "Nina Kowalski", promptScore: 38, testsCompleted: 1, avgEfficiency: 35, avgSpeed: 41, avgAccuracy: 39, badges: [] },
];

export const dashboardStats = {
  testsCreated: 5,
  candidatesTested: 30,
  avgPromptScore: 60,
  totalTokensSaved: 18400,
};
