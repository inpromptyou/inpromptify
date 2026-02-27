import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getSql();

    const [attempt] = await sql`
      SELECT ta.id, ta.candidate_name, ta.score, ta.efficiency, ta.speed, ta.accuracy,
             ta.tokens_used, ta.attempts_used, ta.time_spent_minutes, ta.completed_at,
             t.title as test_name, t.description as test_description
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE ta.id = ${Number(id)} AND ta.status = 'completed'
    `;

    if (!attempt) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    const score = Number(attempt.score) || 0;
    const grade = score >= 95 ? "S" : score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : score >= 35 ? "D" : "F";
    const x = (score - 58) / 15;
    const percentile = Math.min(99, Math.max(1, Math.round((1 / (1 + Math.exp(-x))) * 96 + 2)));

    return NextResponse.json({
      id: attempt.id,
      score,
      grade,
      percentile,
      candidateName: attempt.candidate_name,
      testName: attempt.test_name,
      testDescription: attempt.test_description,
      dimensions: {
        pq: Number(attempt.accuracy) || score,
        eff: Number(attempt.efficiency) || score,
        spd: Number(attempt.speed) || score,
        rq: score,
        iq: score,
      },
      tokensUsed: attempt.tokens_used,
      attemptsUsed: attempt.attempts_used,
      completedAt: attempt.completed_at,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch score" }, { status: 500 });
  }
}
