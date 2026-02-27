"use client";

import { useState, useEffect } from "react";

interface Analytics {
  summary: {
    avgScore: number;
    avgEfficiency: number;
    avgTokens: number;
    uniqueCandidates: number;
    totalAttempts: number;
    estimatedAnnualSavings: number;
  };
  distribution: Array<{ range: string; count: number }>;
  people: Array<{
    email: string;
    name: string;
    avg_score: number;
    tests_taken: number;
    avg_tokens: number;
    avg_efficiency: number;
    last_active: string;
  }>;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-indigo-500" : score >= 60 ? "bg-indigo-500/60" : score >= 40 ? "bg-indigo-500/40" : "bg-indigo-500/20";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-white/[0.04] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[13px] font-mono text-gray-400 w-8">{score}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!data || data.summary.totalAttempts === 0) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-white mb-2">Team Analytics</h1>
        <p className="text-sm text-gray-500 mb-6">No assessment data yet. Create a test and invite your team to get started.</p>
        <a href="/dashboard/create" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Create your first assessment</a>
      </div>
    );
  }

  const { summary, distribution, people } = data;
  const allBuckets = ["0-19", "20-39", "40-59", "60-79", "80-89", "90-100"];
  const distMap = Object.fromEntries(distribution.map((d) => [d.range, d.count]));
  const maxCount = Math.max(...allBuckets.map((b) => distMap[b] || 0), 1);

  const topPerformers = people.filter((p) => p.avg_score >= 80);
  const needsTraining = people.filter((p) => p.avg_score < 50);

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-1">Team Analytics</h1>
        <p className="text-sm text-gray-500">AI prompting performance across your organization.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Team Avg Score", value: summary.avgScore, suffix: "/100" },
          { label: "People Assessed", value: summary.uniqueCandidates, suffix: "" },
          { label: "Total Assessments", value: summary.totalAttempts, suffix: "" },
          { label: "Est. Annual Savings", value: `$${summary.estimatedAnnualSavings.toLocaleString()}`, suffix: "", highlight: true },
        ].map((card) => (
          <div key={card.label} className={`bg-[#0C1120] rounded-lg border ${card.highlight ? "border-indigo-500/20 bg-indigo-500/10" : "border-white/[0.06]"} p-4`}>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">{card.label}</div>
            <div className="text-2xl font-bold text-white">
              {typeof card.value === "number" ? card.value : card.value}
              {card.suffix && <span className="text-sm text-gray-400 font-normal">{card.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Score Distribution */}
        <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Score Distribution</h2>
          <div className="space-y-2.5">
            {allBuckets.map((bucket) => {
              const count = distMap[bucket] || 0;
              const pct = (count / maxCount) * 100;
              return (
                <div key={bucket} className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400 w-12 text-right font-mono">{bucket}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-sm overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-sm transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-gray-400 w-6 font-mono">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-4">
          <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Top Performers</h2>
            {topPerformers.length === 0 ? (
              <p className="text-sm text-gray-400">No one scoring 80+ yet.</p>
            ) : (
              <div className="space-y-2">
                {topPerformers.slice(0, 5).map((p) => (
                  <div key={p.email} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-white font-medium">{p.name}</span>
                      <span className="text-[11px] text-gray-400 ml-2">{p.tests_taken} tests</span>
                    </div>
                    <span className="text-sm font-semibold text-indigo-600">{p.avg_score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Needs Training</h2>
            {needsTraining.length === 0 ? (
              <p className="text-sm text-gray-400">Everyone is scoring above 50.</p>
            ) : (
              <div className="space-y-2">
                {needsTraining.slice(0, 5).map((p) => (
                  <div key={p.email} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-white font-medium">{p.name}</span>
                      <span className="text-[11px] text-gray-400 ml-2">{p.tests_taken} tests</span>
                    </div>
                    <span className="text-sm font-semibold text-red-500">{p.avg_score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full People Table */}
      <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h2 className="text-sm font-semibold text-white">All Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Name</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Avg Score</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Tests</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Avg Tokens</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Efficiency</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Rating</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.email} className="border-b border-gray-50 hover:bg-white/[0.02]/50">
                  <td className="px-5 py-3">
                    <div className="text-[13px] font-medium text-white">{p.name}</div>
                    <div className="text-[11px] text-gray-400">{p.email}</div>
                  </td>
                  <td className="px-5 py-3"><ScoreBar score={p.avg_score} /></td>
                  <td className="px-5 py-3 text-[13px] text-gray-500">{p.tests_taken}</td>
                  <td className="px-5 py-3 text-[13px] text-gray-500 font-mono">{p.avg_tokens.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[13px] text-gray-500">{p.avg_efficiency}/100</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      p.avg_score >= 80 ? "bg-emerald-50 text-emerald-600" :
                      p.avg_score >= 60 ? "bg-blue-50 text-blue-600" :
                      p.avg_score >= 40 ? "bg-amber-50 text-amber-600" :
                      "bg-red-50 text-red-600"
                    }`}>
                      {p.avg_score >= 80 ? "Top Performer" : p.avg_score >= 60 ? "Proficient" : p.avg_score >= 40 ? "Developing" : "Needs Training"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
