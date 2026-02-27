import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSql } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as Record<string, unknown>).id;
    const sql = getSql();

    // Team average
    const [avgRow] = await sql`
      SELECT
        COALESCE(AVG(ta.score), 0)::int as avg_score,
        COALESCE(AVG(ta.efficiency), 0)::int as avg_efficiency,
        COALESCE(AVG(ta.tokens_used), 0)::int as avg_tokens,
        COUNT(DISTINCT ta.candidate_email)::int as unique_candidates,
        COUNT(*)::int as total_attempts
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE t.user_id = ${Number(userId)} AND ta.status = 'completed'
    `;

    // Score distribution
    const distribution = await sql`
      SELECT
        CASE
          WHEN ta.score < 20 THEN '0-19'
          WHEN ta.score < 40 THEN '20-39'
          WHEN ta.score < 60 THEN '40-59'
          WHEN ta.score < 80 THEN '60-79'
          WHEN ta.score < 90 THEN '80-89'
          ELSE '90-100'
        END as range,
        COUNT(*)::int as count
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE t.user_id = ${Number(userId)} AND ta.status = 'completed'
      GROUP BY 1
      ORDER BY 1
    `;

    // Per-person breakdown
    const people = await sql`
      SELECT
        ta.candidate_email as email,
        ta.candidate_name as name,
        ROUND(AVG(ta.score))::int as avg_score,
        COUNT(*)::int as tests_taken,
        ROUND(AVG(ta.tokens_used))::int as avg_tokens,
        ROUND(AVG(ta.efficiency))::int as avg_efficiency,
        MAX(ta.completed_at) as last_active
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE t.user_id = ${Number(userId)} AND ta.status = 'completed'
      GROUP BY ta.candidate_email, ta.candidate_name
      ORDER BY avg_score DESC
    `;

    // Estimated savings
    const avgTokensPerPerson = Number(avgRow.avg_tokens) || 0;
    const optimalTokens = Math.round(avgTokensPerPerson * 0.4); // assume 60% waste
    const tokenSavings = avgTokensPerPerson - optimalTokens;
    const costPer1kTokens = 0.003; // rough average
    const monthlySavingsPerPerson = (tokenSavings / 1000) * costPer1kTokens * 22; // 22 work days
    const totalPeople = Number(avgRow.unique_candidates) || 1;
    const annualSavings = Math.round(monthlySavingsPerPerson * 12 * totalPeople);

    return NextResponse.json({
      summary: {
        avgScore: avgRow.avg_score || 0,
        avgEfficiency: avgRow.avg_efficiency || 0,
        avgTokens: avgRow.avg_tokens || 0,
        uniqueCandidates: avgRow.unique_candidates || 0,
        totalAttempts: avgRow.total_attempts || 0,
        estimatedAnnualSavings: annualSavings,
      },
      distribution,
      people,
    });
  } catch (e) {
    console.error("Analytics error:", e);
    return NextResponse.json({
      summary: { avgScore: 0, avgEfficiency: 0, avgTokens: 0, uniqueCandidates: 0, totalAttempts: 0, estimatedAnnualSavings: 0 },
      distribution: [],
      people: [],
    });
  }
}
