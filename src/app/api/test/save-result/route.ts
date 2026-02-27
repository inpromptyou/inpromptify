import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * POST /api/test/save-result
 * Saves a completed test attempt and all submissions to the database.
 * Called after evaluation in the sandbox.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      testId,
      candidateName,
      candidateEmail,
      score,
      efficiency,
      speed,
      accuracy,
      tokensUsed,
      attemptsUsed,
      timeSpentMinutes,
      messages,
      inviteToken,
      scoringResult,
    } = body;

    if (!testId) {
      return NextResponse.json({ error: "testId is required" }, { status: 400 });
    }

    const sql = getSql();

    // Get authenticated user if available
    const session = await auth();
    const userId = session?.user ? (session.user as Record<string, unknown>).id : null;

    // Determine candidate info
    const name = candidateName || (session?.user?.name) || "Anonymous";
    const email = candidateEmail || (session?.user?.email) || "anonymous@test.com";

    // Verify test exists
    const [test] = await sql`SELECT id, user_id FROM tests WHERE id = ${Number(testId)}`;
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Create test_attempt
    const [attempt] = await sql`
      INSERT INTO test_attempts (
        test_id, user_id, candidate_name, candidate_email, status,
        score, efficiency, speed, accuracy,
        tokens_used, attempts_used, time_spent_minutes,
        started_at, completed_at
      ) VALUES (
        ${Number(testId)},
        ${userId ? Number(userId) : null},
        ${name},
        ${email},
        'completed',
        ${score || 0},
        ${efficiency || 0},
        ${speed || 0},
        ${accuracy || 0},
        ${tokensUsed || 0},
        ${attemptsUsed || 0},
        ${timeSpentMinutes || 0},
        NOW() - INTERVAL '${timeSpentMinutes || 1} minutes',
        NOW()
      ) RETURNING id
    `;

    // Save individual submissions (prompt/response pairs)
    if (messages && Array.isArray(messages)) {
      for (let i = 0; i < messages.length; i += 2) {
        const userMsg = messages[i];
        const assistantMsg = messages[i + 1];
        if (userMsg?.role === "user") {
          await sql`
            INSERT INTO test_submissions (attempt_id, prompt_text, response_text, tokens_used)
            VALUES (
              ${attempt.id},
              ${userMsg.content},
              ${assistantMsg?.content || ""},
              ${0}
            )
          `;
        }
      }
    }

    // Update test stats
    await sql`
      UPDATE tests SET
        candidates_count = (SELECT COUNT(*) FROM test_attempts WHERE test_id = ${Number(testId)} AND status = 'completed'),
        avg_score = (SELECT COALESCE(AVG(score), 0) FROM test_attempts WHERE test_id = ${Number(testId)} AND status = 'completed'),
        completion_rate = CASE
          WHEN (SELECT COUNT(*) FROM test_attempts WHERE test_id = ${Number(testId)}) > 0
          THEN (SELECT COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / COUNT(*) FROM test_attempts WHERE test_id = ${Number(testId)})
          ELSE 0
        END,
        updated_at = NOW()
      WHERE id = ${Number(testId)}
    `;

    // Update invite link if token provided
    if (inviteToken) {
      await sql`
        UPDATE invite_links SET status = 'completed', attempt_id = ${attempt.id}
        WHERE token = ${inviteToken} AND test_id = ${Number(testId)}
      `.catch(() => {}); // Table might not exist yet
    }

    // Update user's prompt_score if authenticated
    if (userId && score) {
      await sql`
        UPDATE users SET
          prompt_score = COALESCE(
            (SELECT ROUND(AVG(score))::int FROM test_attempts WHERE user_id = ${Number(userId)} AND status = 'completed'),
            ${score}
          ),
          updated_at = NOW()
        WHERE id = ${Number(userId)}
      `;
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      score,
    });
  } catch (e) {
    console.error("Save result error:", e);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }
}
