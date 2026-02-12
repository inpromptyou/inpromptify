import { NextRequest, NextResponse } from "next/server";

// Mock AI responses keyed by test type, with variation based on attempt number
const mockResponsesByContext: Record<string, string[]> = {
  "marketing-email": [
    `Here's a compelling product launch email for CloudSync Pro:

---

**Subject: Your data sync takes 23 hours/week. Let's fix that.**

**Preview text:** Enterprise CTOs are cutting sync time by 96% — here's how.

Dear [Name],

In today's data-driven landscape, enterprise teams lose an average of 23 hours per week to fragmented data systems. CloudSync Pro eliminates that friction entirely.

Our platform delivers real-time, bi-directional data synchronization across your entire stack — from legacy databases to modern cloud services — with enterprise-grade security and zero downtime.

**What sets us apart:**
- 99.99% uptime SLA backed by a service credit guarantee
- SOC 2 Type II certified with end-to-end encryption
- 15-minute implementation — no engineering resources required
- Trusted by 200+ Fortune 500 CTOs including teams at Salesforce, Stripe, and Databricks

**Early adopter results:**
- Meridian Health reduced data lag from 4 hours to 12 seconds
- Vantage Financial cut integration costs by 73%

I'd love to show you what CloudSync Pro can do for your team in a quick 15-minute demo.

[Book Your Demo →]

Best regards,
[Sender Name]
VP of Sales, CloudSync Pro

---

This email uses a problem-agitation-solution framework optimized for technical decision-makers. The subject line leads with a specific, quantifiable pain point. Would you like me to adjust the tone, add more social proof, or create A/B variants?`,

    `Great refinement. Here's the updated version with your feedback incorporated:

---

**Subject: [Name], your team is losing 23 hours/week to broken data sync**

**Preview text:** See how CTOs at Stripe and Databricks fixed it in 15 minutes.

Hi [Name],

I noticed [Company] recently expanded your engineering team — congratulations. With that growth comes a familiar challenge: keeping data consistent across an increasingly complex stack.

CloudSync Pro was built for exactly this moment. We provide:

**🔄 Real-time sync** across 150+ integrations (REST APIs, PostgreSQL, S3, Snowflake, and more)
**🔒 Enterprise security** — SOC 2 Type II, HIPAA-ready, end-to-end encryption
**⚡ 15-minute setup** — no engineering sprint required
**📊 Full observability** — real-time dashboards, anomaly alerts, audit logs

Our customers report 96% reduction in data-related incidents within the first month.

Would 15 minutes on Thursday or Friday work for a quick walkthrough?

[Book a Time →]

Best,
[Sender]

P.S. — We're offering founding enterprise customers a 40% lifetime discount through March. Happy to share details on the call.

---

Key improvements: personalized opening, specific integration list, urgency in the P.S., and a softer CTA with suggested times.`,

    `Here's the final polished version with all your optimizations applied:

The email now has a tighter structure, stronger personalization hooks, and a two-step CTA approach that typically increases enterprise response rates by 25-40%. The P.S. creates genuine urgency without feeling pushy. The metrics are specific and verifiable, which builds trust with technical buyers.

I've also ensured the tone balances professionalism with approachability — critical for CTO-level outreach where overly formal language often gets ignored.`,
  ],
  default: [
    `I'll analyze the requirements you've described and provide a structured response.

**Understanding the Task:**
The core challenge involves creating output that meets specific quality criteria while being efficient and well-organized. Let me break this down systematically.

**Approach:**
1. First, I've identified the key constraints and success criteria
2. Then structured the output to address each requirement
3. Finally, optimized for clarity and completeness

**Here's my solution:**

The output addresses all primary requirements while maintaining a clear structure. Key decisions include prioritizing readability, using concrete examples where applicable, and ensuring each section serves a distinct purpose.

**Quality Considerations:**
- Tone is calibrated for the target audience
- Technical accuracy is verified against common standards
- Structure follows best practices for the content type
- All specified constraints are satisfied

Would you like me to refine any particular aspect, adjust the tone, or expand on specific sections?`,

    `Based on your feedback, here's the refined version:

I've made several targeted improvements:

1. **Tightened the language** — removed unnecessary qualifiers and passive voice
2. **Added specificity** — replaced generic claims with concrete examples and metrics
3. **Improved structure** — reorganized for better logical flow and scannability
4. **Strengthened the conclusion** — more actionable and direct

The overall quality should now better match your expected outcome. The key insight from your feedback was [specific area], which I've addressed by [specific change].

Let me know if you'd like further iterations on any section.`,

    `Here's the final polished version incorporating all rounds of feedback:

This version represents a significant improvement over the initial draft. The language is precise, the structure is optimized for the target audience, and all specified criteria are met. 

I'm confident this addresses the core requirements effectively. The iterative refinement process helped identify and resolve several subtle issues that improved the overall quality substantially.`,
  ],
};

function getContextKey(taskDescription: string): string {
  const lower = taskDescription.toLowerCase();
  if (lower.includes("email") || lower.includes("marketing")) return "marketing-email";
  return "default";
}

function getMockResponse(taskDescription: string, attemptNumber: number): string {
  const key = getContextKey(taskDescription);
  const responses = mockResponsesByContext[key] || mockResponsesByContext.default;
  return responses[Math.min(attemptNumber - 1, responses.length - 1)];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, testId, taskDescription, attemptNumber } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!testId) {
      return NextResponse.json({ error: "Test ID is required" }, { status: 400 });
    }

    // Simulate API latency (1-2.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500));

    const response = getMockResponse(taskDescription || "", attemptNumber || 1);
    const promptTokens = Math.floor(prompt.length / 4) + Math.floor(Math.random() * 30 + 20);
    const completionTokens = Math.floor(response.length / 4) + Math.floor(Math.random() * 40 + 30);

    return NextResponse.json({
      response,
      tokensUsed: {
        prompt: promptTokens,
        completion: completionTokens,
        total: promptTokens + completionTokens,
      },
      model: "gpt-4o-mock",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to process prompt" }, { status: 500 });
  }
}
