import { mockTests, mockCandidates } from "@/lib/mockData";
import PromptScoreBadge from "@/components/PromptScoreBadge";
import Link from "next/link";

export default async function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = mockTests.find((t) => t.id === id) || mockTests[0];
  const candidates = mockCandidates
    .filter((c) => c.testId === test.id)
    .sort((a, b) => b.promptScore - a.promptScore);

  // Realistic distributions for a small test
  const tokenBuckets = [
    { range: "0-500", count: 0 },
    { range: "500-1K", count: 2 },
    { range: "1K-1.5K", count: 4 },
    { range: "1.5K-2K", count: 3 },
    { range: "2K+", count: 3 },
  ];
  const maxTokenCount = Math.max(...tokenBuckets.map((b) => b.count));

  const attemptBuckets = [
    { attempts: "1", count: 0 },
    { attempts: "2", count: 3 },
    { attempts: "3", count: 4 },
    { attempts: "4", count: 3 },
    { attempts: "5+", count: 2 },
  ];
  const maxAttemptCount = Math.max(...attemptBuckets.map((b) => b.count));

  const timeBuckets = [
    { range: "0-5m", count: 0 },
    { range: "5-10m", count: 2 },
    { range: "10-15m", count: 5 },
    { range: "15-20m", count: 3 },
    { range: "20m+", count: 2 },
  ];
  const maxTimeCount = Math.max(...timeBuckets.map((b) => b.count));

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/dashboard/tests" className="text-xs text-gray-400 hover:text-gray-600 mb-2 inline-flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Back to My Tests
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">{test.name}</h1>
        <p className="text-gray-500 text-sm mt-1">{test.description}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {[
          { label: "Candidates", value: test.candidates.toString() },
          { label: "Avg Score", value: test.avgScore.toString() },
          { label: "Completion", value: `${test.completionRate}%` },
          { label: "Model", value: test.model },
          { label: "Time Limit", value: `${test.timeLimitMinutes}m` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-3.5">
            <div className="text-xs text-gray-400 mb-0.5">{stat.label}</div>
            <div className="text-lg font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* Token Usage Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Token Usage</h3>
          <div className="space-y-2.5">
            {tokenBuckets.map((b) => (
              <div key={b.range} className="flex items-center gap-2.5">
                <span className="text-xs text-gray-400 w-10 text-right font-mono">{b.range}</span>
                <div className="flex-1 bg-gray-100 rounded h-4 overflow-hidden">
                  <div
                    className="bg-[#4F46E5] h-full rounded transition-all"
                    style={{ width: maxTokenCount > 0 ? `${(b.count / maxTokenCount) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-4 font-mono">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attempt Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Attempts Used</h3>
          <div className="space-y-2.5">
            {attemptBuckets.map((b) => (
              <div key={b.attempts} className="flex items-center gap-2.5">
                <span className="text-xs text-gray-400 w-10 text-right font-mono">{b.attempts}</span>
                <div className="flex-1 bg-gray-100 rounded h-4 overflow-hidden">
                  <div
                    className="bg-[#10B981] h-full rounded transition-all"
                    style={{ width: maxAttemptCount > 0 ? `${(b.count / maxAttemptCount) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-4 font-mono">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Time Spent</h3>
          <div className="space-y-2.5">
            {timeBuckets.map((b) => (
              <div key={b.range} className="flex items-center gap-2.5">
                <span className="text-xs text-gray-400 w-10 text-right font-mono">{b.range}</span>
                <div className="flex-1 bg-gray-100 rounded h-4 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded transition-all"
                    style={{ width: maxTimeCount > 0 ? `${(b.count / maxTimeCount) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-4 font-mono">{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate Leaderboard */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-3.5 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Candidate Results</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-2.5 font-medium w-10">Rank</th>
                <th className="px-5 py-2.5 font-medium">Candidate</th>
                <th className="px-5 py-2.5 font-medium">Score</th>
                <th className="px-5 py-2.5 font-medium">Efficiency</th>
                <th className="px-5 py-2.5 font-medium">Speed</th>
                <th className="px-5 py-2.5 font-medium">Accuracy</th>
                <th className="px-5 py-2.5 font-medium">Tokens</th>
                <th className="px-5 py-2.5 font-medium">Time</th>
                <th className="px-5 py-2.5 font-medium">Attempts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {candidates.map((c, i) => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <span className={`text-xs font-mono ${i < 3 ? "font-bold text-gray-900" : "text-gray-400"}`}>{i + 1}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-sm font-medium text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.email}</div>
                  </td>
                  <td className="px-5 py-3"><PromptScoreBadge score={c.promptScore} size="sm" /></td>
                  <td className="px-5 py-3 text-sm text-gray-500">{c.efficiency}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{c.speed}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{c.accuracy}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{c.tokensUsed.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{c.timeSpentMinutes}m</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{c.attemptsUsed}</td>
                </tr>
              ))}
              {candidates.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-gray-400 text-sm">No candidates have taken this test yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
