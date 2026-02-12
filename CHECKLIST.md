# InpromptYou.ai — Production Readiness Audit & Go-to-Market Plan

**Audited:** 12 Feb 2026  
**Auditor:** Banks (AI Assistant)  
**Codebase:** Next.js 16 + Tailwind 4 + NextAuth 5 + Neon Postgres

---

## Executive Summary

InpromptYou has a **strong landing page, clear value prop, and solid visual design**. The concept is genuinely good — there's real market demand for AI skills assessment. However, the product is currently a **frontend shell with mock data**. The core functionality (the actual test sandbox where candidates interact with an LLM) doesn't exist yet. No company would pay for this today.

**Verdict:** ~30% to MVP. The marketing site is 80% done. The product is 10% done.

### What's Good
- Landing page copy is excellent — clear, specific, not generic SaaS drivel
- Visual design is cohesive and professional (ocean theme, consistent brand colors)
- Auth flow is properly implemented (Google OAuth + credentials, bcrypt, JWT)
- DB schema is well-designed for the use case
- Pricing page is compelling with good FAQ
- Legal pages (privacy, terms, security) exist and are reasonable
- Mobile nav works
- Good use of semantic HTML on marketing pages

### What's Missing (Showstoppers)
- **The actual product doesn't exist** — test/[id], test/[id]/sandbox, test/[id]/results, profile/[id], dashboard/tests/[id] are all NOT FOUND (empty routes)
- No LLM integration whatsoever — no OpenAI/Anthropic/Google API calls
- No scoring engine
- All dashboard data is hardcoded mock data
- No real CRUD operations (create test form doesn't submit anywhere)
- No candidate invitation flow
- No test-taking experience

---

## Part 1: Full Code Review

### 🔍 SEO

| Issue | Severity | Details |
|-------|----------|---------|
| No Open Graph tags | Important | `layout.tsx` has title/description but no `og:image`, `og:type`, `og:url`, `twitter:card` |
| No sitemap.xml | Important | Need `app/sitemap.ts` for automatic generation |
| No robots.txt | Important | Need `app/robots.ts` |
| No structured data (JSON-LD) | Important | Add Organization, SoftwareApplication, FAQ schema on pricing page |
| No per-page metadata | Important | Only root layout has metadata. Dashboard, how-it-works, leaderboard, pricing, login, signup pages have no `<title>` or description (privacy/terms/security do) |
| No canonical URLs | Nice-to-Have | Prevents duplicate content issues |
| Images are .jpg not .webp | Nice-to-Have | hero-bg.gif is likely huge; logos should be SVG or webp |
| No alt text on SVG icons | Minor | Decorative SVGs should have `aria-hidden="true"` |
| h1 usage is correct | ✅ | Each page has a single h1 |

### ⚡ Performance

| Issue | Severity | Details |
|-------|----------|---------|
| hero-bg.gif as background-image | Critical | GIFs are massive and uncompressed. Convert to WebM/MP4 video or use CSS animation. This is likely 5-20MB |
| Login/signup use `<img>` not `<Image>` | Important | Logo on login/signup uses raw `<img>` instead of Next.js `<Image>`, missing optimization |
| No loading states anywhere | Important | No skeleton screens, no spinners, no Suspense boundaries |
| OceanBackground renders 20 particles | Minor | Fine for now, but unnecessary on mobile |
| No font optimization | Minor | Inter is referenced in CSS but not imported via `next/font` — causes FOIT/FOUT |
| No bundle analysis configured | Nice-to-Have | Add `@next/bundle-analyzer` |

### ♿ Accessibility

| Issue | Severity | Details |
|-------|----------|---------|
| Toggle buttons have no aria-label | Important | Settings page toggles and pricing annual toggle lack accessible names |
| No skip-to-content link | Important | Standard a11y requirement |
| Color contrast unchecked | Important | Gray-on-gray text (e.g., `text-gray-400` on white) likely fails WCAG AA |
| Sort buttons in candidates table lack aria | Minor | No `aria-sort` attribute on sortable columns |
| Mobile menu has good aria-label | ✅ | "Toggle menu" is present |
| Form labels are properly associated | ✅ | Login/signup use `htmlFor` correctly |

### 🔒 Security

| Issue | Severity | Details |
|-------|----------|---------|
| DB init route is publicly accessible | **Critical** | `POST /api/db/init` creates all tables with no auth check — anyone can call it |
| No CSRF protection on signup | Important | Signup API has no rate limiting or CSRF token |
| No rate limiting on auth routes | Important | Brute-force login attacks are possible |
| No email validation (format/domain) | Important | Signup accepts any string as email |
| `NEXTAUTH_SECRET` not validated at startup | Minor | App will crash cryptically if env var missing |
| NextAuth [...nextauth] route.ts is missing | **Critical** | File doesn't exist at the expected bracket path (may be a filesystem issue with `[...nextauth]`) — auth won't work |
| No input sanitization on test creation | Important | Task descriptions could contain XSS (though React escapes by default) |
| SQL injection protected | ✅ | Using parameterized queries via neon template literals |
| Passwords hashed with bcrypt cost 12 | ✅ | Good |

### 🎯 UX / Conversion

| Issue | Severity | Details |
|-------|----------|---------|
| "Try a sample test" links to /test/test-001 which doesn't exist | **Critical** | Primary CTA on homepage is broken — this is the #1 conversion killer |
| No onboarding flow after signup | Important | User lands on dashboard with mock data, no guidance |
| Dashboard sidebar user is hardcoded "Jane Doe" | Important | Not connected to auth session |
| Create test form doesn't submit | Important | "Publish Test" button does nothing |
| No "forgot password" flow | Important | Standard expectation |
| No email verification | Important | Users can sign up with fake emails |
| Footer "About", "Blog", "Contact" are dead spans | Minor | Not links, just text with cursor-default |
| No empty states | Minor | What does dashboard look like with 0 tests? |
| Mobile: dashboard sidebar is hidden with no mobile alternative | Important | `hidden md:flex` on sidebar means mobile users can't navigate dashboard |

### 🧩 Missing Features for a Real SaaS

| Feature | Priority | Effort |
|---------|----------|--------|
| **Test sandbox (LLM chat interface)** | Critical | 2-3 weeks |
| **Scoring engine** | Critical | 1-2 weeks |
| **Test results page** | Critical | 3-5 days |
| **Real CRUD for tests** | Critical | 1 week |
| **Candidate invitation (email/link sharing)** | Critical | 3-5 days |
| **Profile pages** | Important | 2-3 days |
| Analytics/tracking (PostHog, Plausible) | Important | 1 day |
| Error boundary / global error handling | Important | 1 day |
| 404 page (`not-found.tsx`) | Important | 2 hours |
| Loading states (`loading.tsx`) | Important | 1 day |
| Toast/notification system | Important | 1 day |
| Stripe/payment integration | Important | 1 week |
| Email transactional (Resend/Postmark) | Important | 2-3 days |
| Test detail page for creators | Important | 2-3 days |
| CSV export of results | Nice-to-Have | 1 day |
| ATS webhook integrations | Nice-to-Have | 1-2 weeks |
| Custom branding per company | Nice-to-Have | 1 week |
| API for programmatic access | Nice-to-Have | 1-2 weeks |

---

## Part 2: Prioritized Checklist

### 🔴 Critical (Must fix before any public launch)

- [ ] **Build the test sandbox** — The core product. Chat UI where candidates interact with a real LLM (OpenAI/Anthropic API). Track tokens, attempts, time. This is the entire value prop. *(2-3 weeks)*
- [ ] **Build the scoring engine** — Evaluate output against expected outcome (can use LLM-as-judge). Calculate composite Prompt Score. *(1-2 weeks)*
- [ ] **Build test results page** — Show candidate their score breakdown after completion. *(3-5 days)*
- [ ] **Wire up Create Test form** — Save to DB, generate shareable link. *(3-5 days)*
- [ ] **Fix auth route** — Ensure `[...nextauth]/route.ts` is properly deployed/accessible. *(1 hour)*
- [ ] **Protect /api/db/init** — Add auth check or remove entirely (use migrations instead). *(1 hour)*
- [ ] **Replace mock data with real DB queries** — Dashboard, tests list, candidates list all need real data. *(3-5 days)*
- [ ] **Fix "Try a sample test" CTA** — Either build the test experience or remove the button. A broken primary CTA is worse than no CTA. *(depends on sandbox)*
- [ ] **Add mobile dashboard navigation** — Bottom tab bar or hamburger menu for mobile. *(1 day)*

### 🟡 Important (Before paid customers)

- [ ] **Add Open Graph / Twitter meta tags** — Essential for social sharing. Add og:image (create a branded card). *(2 hours)*
- [ ] **Add per-page metadata** — Title and description for every page. *(1 hour)*
- [ ] **Add sitemap.xml and robots.txt** — Use Next.js `app/sitemap.ts` and `app/robots.ts`. *(30 min)*
- [ ] **Convert hero-bg.gif to video** — Or replace with CSS animation (OceanBackground already exists!). Use it on the hero instead. *(2 hours)*
- [ ] **Fix `<img>` to `<Image>`** — Login and signup pages use raw `<img>`. *(15 min)*
- [ ] **Add `next/font` for Inter** — Eliminate FOUT. *(15 min)*
- [ ] **Connect dashboard sidebar to auth session** — Show real user name/email. *(30 min)*
- [ ] **Add forgot password flow** — Standard auth requirement. *(1 day)*
- [ ] **Add email verification** — Send verification email on signup. *(1 day)*
- [ ] **Add rate limiting** — At minimum on /api/auth/signup and login. Use Vercel KV or upstash. *(1 day)*
- [ ] **Add 404 page** — `app/not-found.tsx`. *(1 hour)*
- [ ] **Add loading states** — `loading.tsx` files + Suspense boundaries. *(1 day)*
- [ ] **Add error boundary** — `error.tsx` at root and dashboard level. *(2 hours)*
- [ ] **Add analytics** — PostHog, Plausible, or Vercel Analytics. *(1 hour)*
- [ ] **Stripe integration** — For Pro/Business/Enterprise plans. *(1 week)*
- [ ] **Add candidate invitation flow** — Generate unique test URLs, optional email invite. *(3-5 days)*
- [ ] **Accessibility: skip-to-content, aria-labels on toggles, contrast check** *(1 day)*
- [ ] **Add structured data (JSON-LD)** — Organization schema, FAQ schema on pricing. *(2 hours)*

### 🟢 Nice-to-Have (Post-launch polish)

- [ ] **Blog / content section** — For SEO and content marketing. *(1 week)*
- [ ] **Public profile pages** — `/profile/[id]` with Prompt Score badge, test history. *(2-3 days)*
- [ ] **CSV export** — Download candidate results. *(1 day)*
- [ ] **Custom branding** — Company logo on test pages. *(1 week)*
- [ ] **API access** — For Enterprise plan. *(1-2 weeks)*
- [ ] **ATS integrations** — Greenhouse, Lever, Ashby webhooks. *(1-2 weeks)*
- [ ] **Test templates library** — Pre-built tests users can clone. *(3-5 days)*
- [ ] **Candidate comparison view** — Side-by-side scoring. *(2-3 days)*
- [ ] **LinkedIn badge/verification** — Shareable Prompt Score credential. *(1 week)*
- [ ] **Dark mode** — *(2-3 days)*
- [ ] **i18n** — *(1-2 weeks)*
- [ ] **SOC 2 Type II certification** — Claimed on pricing page but obviously not done yet. Either pursue it or soften the claim. *(months + $$$)*

---

## Part 3: Marketing Strategy

### Competitive Landscape

**Direct competitors** (AI skills assessment):
1. **Turing** — AI-powered developer vetting. Enterprise-focused, expensive. Tests coding skills including AI pair programming.
2. **TestGorilla / Vervoe** — General pre-employment testing platforms. Some have added "AI literacy" tests but they're multiple-choice, not hands-on.
3. **HackerRank / Codility** — Code assessment platforms. Some are adding AI/prompt engineering challenges. HackerRank launched "AI Skills Assessments" in 2024.
4. **Prompt Engineering Institute** — Certifications and training, not SaaS assessment tools.
5. **Promptheus / PromptLayer** — Prompt management tools, not assessment platforms.

**Adjacent competitors:**
- LinkedIn Skills Assessments (free, but MCQ-based, no AI prompting)
- Workera (AI skills assessment by Andrew Ng, enterprise-focused)
- Filtered.ai (skills-based hiring platform)

### InpromptYou's Positioning

**Key differentiator:** Hands-on sandbox assessment, not multiple choice. Candidates actually use an LLM under constraints. This is genuinely novel and defensible.

**Positioning statement:**  
*"The only hiring assessment where candidates actually prompt an AI — not answer questions about it."*

**Target segments (in order of priority):**
1. **Tech recruiters at mid-market companies (100-2000 employees)** — Hiring for roles that use AI daily. Need to filter 50+ applicants efficiently.
2. **HR/L&D teams** — Internal AI readiness assessments for existing employees.
3. **Bootcamps / universities** — Teaching AI literacy, need assessment tools.
4. **Individual practitioners** — Want a portable "AI skill credential" for their resume.

### Go-to-Market Strategy (Bootstrapped)

#### Phase 1: Validate & Get First 10 Customers (Months 1-3)

**1. Product-Led Growth — The Sample Test**
- Make the sample test incredible. This IS your marketing.
- Add sharing: "I scored 78/100 on InpromptYou. Can you beat me?" → Twitter/LinkedIn viral loop.
- Add an embeddable widget companies can put on job listings.

**2. LinkedIn Content (FREE, highest ROI)**
- Post 3-5x/week about AI hiring, prompting skills, bad interview practices.
- Content angles:
  - "We gave 100 candidates the same AI task. Here's what separated the top 10%."
  - "Your interview question about ChatGPT is useless. Here's what to ask instead."
  - "The $200/month AI bill your team is wasting" (reuse hero copy — it's great).
  - Share anonymized data from beta tests (score distributions, common mistakes).
- Target: Hiring managers, HR tech buyers, L&D professionals.

**3. Cold Outreach to Recruiters**
- Find companies actively hiring for "AI" roles on LinkedIn/Indeed.
- Offer free pilot: "Send us your next 10 candidates, we'll score them for free."
- Personal email, not blast. 20-30 targeted emails/week.

**4. Launch on Product Hunt**
- Time it when the sandbox is working.
- Prepare: 5-10 beta testers with testimonials, demo video, killer screenshots.

#### Phase 2: Scale to 100 Customers (Months 3-6)

**5. Content Marketing / SEO**
- Blog targeting:
  - "how to assess AI skills in hiring" (informational, top of funnel)
  - "AI prompting test for candidates" (commercial, high intent)
  - "prompt engineering interview questions" (informational, adjacent)
  - "AI literacy assessment tools" (commercial, comparison)
- Publish benchmark reports: "State of AI Prompting Skills 2026" — use aggregated platform data.

**6. Partnerships**
- Integrate with ATS platforms (Greenhouse, Lever). Get listed in their marketplace.
- Partner with AI bootcamps (offer free assessments for their graduates → graduates share scores → employers discover platform).
- Sponsor HR/recruiting podcasts (Recruiting Daily, HR Happy Hour).

**7. Community / Leaderboard Virality**
- Make the public leaderboard genuinely interesting.
- Monthly "Prompt Challenge" — public competition with a fun task. Winners get featured.
- Discord/Slack community for AI-forward recruiters.

#### Phase 3: Expand (Months 6-12)

**8. Enterprise Sales**
- Case studies from Phase 1-2 customers.
- SOC 2 certification (required for enterprise).
- ATS integrations, SSO, white-label.

**9. Education Vertical**
- University partnerships for AI curriculum.
- Student pricing / free tier for .edu emails.

### Pricing Strategy Notes
- Current pricing ($0 / $79 / $249 / $799) looks reasonable.
- Consider a "pay-per-test" option for small teams who don't need a subscription.
- The "3 tests/month free" is good — enough to validate, forces upgrade for real use.
- Enterprise at $799 may be low. Enterprise buyers expect $2-5K/month minimum. Low price signals "not enterprise-ready."

### Key Metrics to Track
- **Activation rate:** % of signups who create their first test
- **Test completion rate:** % of invited candidates who finish
- **Viral coefficient:** How many new users each user brings (via shared scores/test links)
- **Time-to-value:** How fast a new user gets their first scored result
- **NPS:** Would users recommend this?

---

## Would a Company Pay for This Today?

**No.** The marketing site is compelling but the product doesn't exist yet. A recruiter would sign up, try to create a test, and hit a dead end. The "Try a sample test" button goes to a 404.

**What's needed for first dollar:**
1. Working test sandbox with real LLM
2. Working scoring
3. Working results page
4. Working test creation + sharing

**Estimated time to payable MVP:** 4-6 weeks of focused full-time development.

**The good news:** The hard part (design, positioning, messaging, auth, DB schema) is already done well. The remaining work is primarily backend/integration — wiring up LLM APIs, building the chat UI, and implementing scoring. The foundation is solid.

---

*Generated by Banks for Boss. Last updated 12 Feb 2026.*
