import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

/**
 * GET /api/tests/invite/lookup?token=X
 * Look up an invite token and return the test info.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const sql = getSql();

    const [invite] = await sql`
      SELECT il.id, il.test_id, il.candidate_name, il.candidate_email, il.status, il.expires_at,
             t.title, t.description, t.time_limit_minutes, t.max_attempts, t.token_budget, t.model
      FROM invite_links il
      JOIN tests t ON il.test_id = t.id
      WHERE il.token = ${token}
    `;

    if (!invite) {
      return NextResponse.json({ error: "Invalid invite link" }, { status: 404 });
    }

    if (invite.status === "completed") {
      return NextResponse.json({ error: "This invite has already been used", status: "completed" }, { status: 410 });
    }

    if (invite.expires_at && new Date(invite.expires_at as string) < new Date()) {
      return NextResponse.json({ error: "This invite has expired", status: "expired" }, { status: 410 });
    }

    // Mark as started
    await sql`UPDATE invite_links SET status = 'started' WHERE token = ${token} AND status = 'pending'`;

    return NextResponse.json({
      testId: invite.test_id,
      title: invite.title,
      description: invite.description,
      timeLimitMinutes: invite.time_limit_minutes,
      maxAttempts: invite.max_attempts,
      tokenBudget: invite.token_budget,
      model: invite.model,
      prefillName: invite.candidate_name,
      prefillEmail: invite.candidate_email,
    });
  } catch (e) {
    console.error("Invite lookup error:", e);
    return NextResponse.json({ error: "Failed to look up invite" }, { status: 500 });
  }
}
