import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import PromptScoreBadge from '@/components/PromptScoreBadge';

const leaderboardData = [
  { rank: 1, name: 'Sarah Chen', score: 87, tests: 5, avgTokens: 420, avgAttempts: 1.8, topCategory: 'Writing' },
  { rank: 2, name: 'Marcus Rivera', score: 78, tests: 4, avgTokens: 510, avgAttempts: 2.1, topCategory: 'Code Generation' },
  { rank: 3, name: 'Aisha Patel', score: 72, tests: 3, avgTokens: 580, avgAttempts: 2.4, topCategory: 'Writing' },
  { rank: 4, name: 'James O\'Brien', score: 68, tests: 4, avgTokens: 640, avgAttempts: 2.6, topCategory: 'Legal' },
  { rank: 5, name: 'Yuki Tanaka', score: 64, tests: 2, avgTokens: 720, avgAttempts: 3.0, topCategory: 'Data Analysis' },
  { rank: 6, name: 'Emma Larsson', score: 61, tests: 3, avgTokens: 690, avgAttempts: 2.8, topCategory: 'Writing' },
  { rank: 7, name: 'David Kim', score: 58, tests: 2, avgTokens: 810, avgAttempts: 3.2, topCategory: 'Code Generation' },
  { rank: 8, name: 'Priya Sharma', score: 55, tests: 3, avgTokens: 770, avgAttempts: 3.0, topCategory: 'Legal' },
  { rank: 9, name: 'Alex Novak', score: 51, tests: 1, avgTokens: 890, avgAttempts: 3.6, topCategory: 'Data Analysis' },
  { rank: 10, name: 'Fatima Al-Hassan', score: 47, tests: 2, avgTokens: 940, avgAttempts: 3.4, topCategory: 'Writing' },
  { rank: 11, name: 'Tom Fischer', score: 43, tests: 1, avgTokens: 1020, avgAttempts: 4.0, topCategory: 'Code Generation' },
  { rank: 12, name: 'Nina Kowalski', score: 38, tests: 1, avgTokens: 1100, avgAttempts: 3.8, topCategory: 'Legal' },
];

export default function LeaderboardPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-16">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
            <p className="text-sm text-gray-500 max-w-lg">
              Ranked by Prompt Score. Fewer tokens, fewer attempts, better results.
              Scores update as candidates complete new assessments.
            </p>
          </div>

          {/* Full table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 w-14">Rank</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Score</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Tests</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Avg Tokens</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Avg Attempts</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Top Category</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((person) => (
                  <tr key={person.rank} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`text-sm font-mono ${
                        person.rank <= 3 ? "font-bold text-gray-900" : "text-gray-400"
                      }`}>
                        {person.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/profile/${person.rank}`} className="font-medium text-gray-900 hover:text-[#1B5B7D] transition-colors">
                        {person.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <PromptScoreBadge score={person.score} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-center text-gray-500">{person.tests}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">{person.avgTokens.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">{person.avgAttempts}x</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs text-gray-500">
                        {person.topCategory}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-400">
              Want to see your name here?{" "}
              <Link href="/signup" className="text-[#1B5B7D] hover:text-[#14455E] font-medium">
                Take a test
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
