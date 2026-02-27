import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET() {
  try {
    const sql = getSql();
    const [attempts] = await sql`SELECT COUNT(*)::int as count FROM test_attempts WHERE status = 'completed'`;
    const [tests] = await sql`SELECT COUNT(*)::int as count FROM tests`;
    return NextResponse.json({
      assessmentsCompleted: attempts?.count || 0,
      testsCreated: tests?.count || 0,
    });
  } catch {
    return NextResponse.json({ assessmentsCompleted: 0, testsCreated: 0 });
  }
}
