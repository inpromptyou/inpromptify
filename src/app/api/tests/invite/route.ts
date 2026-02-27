import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSql } from "@/lib/db";
import crypto from "crypto";

/**
 * POST /api/tests/invite
 * Generate invite link(s) for a test.
 * Body: { testId, emails?: string[], count?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as Record<string, unknown>).id;

    const body = await request.json();
    const { testId, emails, count = 1 } = body;

    if (!testId) {
      return NextResponse.json({ error: "testId is required" }, { status: 400 });
    }

    const sql = getSql();

    // Verify test ownership
    const [test] = await sql`SELECT id, title FROM tests WHERE id = ${Number(testId)} AND user_id = ${Number(userId)}`;
    if (!test) {
      return NextResponse.json({ error: "Test not found or not owned by you" }, { status: 404 });
    }

    const invites: Array<{ token: string; email?: string; url: string }> = [];

    if (emails && Array.isArray(emails)) {
      // Create named invites for specific emails
      for (const email of emails) {
        const token = crypto.randomBytes(24).toString("hex");
        await sql`
          INSERT INTO invite_links (test_id, token, created_by, candidate_email)
          VALUES (${Number(testId)}, ${token}, ${Number(userId)}, ${email})
        `;
        invites.push({ token, email, url: `/test/invite/${token}` });
      }
    } else {
      // Create anonymous invite links
      for (let i = 0; i < Math.min(count, 50); i++) {
        const token = crypto.randomBytes(24).toString("hex");
        await sql`
          INSERT INTO invite_links (test_id, token, created_by)
          VALUES (${Number(testId)}, ${token}, ${Number(userId)})
        `;
        invites.push({ token, url: `/test/invite/${token}` });
      }
    }

    return NextResponse.json({
      success: true,
      testTitle: test.title,
      invites,
    });
  } catch (e) {
    console.error("Invite error:", e);
    return NextResponse.json({ error: "Failed to create invites" }, { status: 500 });
  }
}

/**
 * GET /api/tests/invite?testId=X
 * List invite links for a test.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as Record<string, unknown>).id;
    const testId = request.nextUrl.searchParams.get("testId");

    if (!testId) {
      return NextResponse.json({ error: "testId is required" }, { status: 400 });
    }

    const sql = getSql();

    const invites = await sql`
      SELECT il.id, il.token, il.candidate_name, il.candidate_email, il.status, il.created_at,
             ta.score as attempt_score
      FROM invite_links il
      LEFT JOIN test_attempts ta ON il.attempt_id = ta.id
      WHERE il.test_id = ${Number(testId)} AND il.created_by = ${Number(userId)}
      ORDER BY il.created_at DESC
    `;

    return NextResponse.json(invites);
  } catch (e) {
    console.error("List invites error:", e);
    return NextResponse.json([]);
  }
}
