import { getSql } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/db/migrate
 * Run safe, idempotent migrations (CREATE TABLE IF NOT EXISTS).
 * No auth required since all operations are idempotent.
 */
export async function GET() {
  try {
    const sql = getSql();

    // Create invite_links table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS invite_links (
        id SERIAL PRIMARY KEY,
        test_id INTEGER NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
        token VARCHAR(64) UNIQUE NOT NULL,
        created_by INTEGER NOT NULL REFERENCES users(id),
        candidate_name VARCHAR(255),
        candidate_email VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        attempt_id INTEGER REFERENCES test_attempts(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
      )
    `;

    return NextResponse.json({ success: true, message: "Migration complete" });
  } catch (e) {
    console.error("Migration error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
