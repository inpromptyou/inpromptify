import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    // In production, verify webhook signature with STRIPE_WEBHOOK_SECRET
    // For now, parse the event directly
    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.metadata?.email || session.customer_email;
      const plan = session.metadata?.plan;

      if (email && plan) {
        const sql = getSql();
        await sql`
          UPDATE users SET plan = ${plan}, updated_at = NOW()
          WHERE email = ${email}
        `;
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const email = subscription.metadata?.email;
      if (email) {
        const sql = getSql();
        await sql`
          UPDATE users SET plan = 'free', updated_at = NOW()
          WHERE email = ${email}
        `;
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
