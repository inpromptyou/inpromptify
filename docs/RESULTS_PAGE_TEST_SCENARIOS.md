# Results Page — Test Scenarios & Data Flow

## Data Flow: Sandbox → Evaluate → Results

```
1. User types prompts in Sandbox (/test/[id]/sandbox)
2. Each prompt → POST /api/test/submit → mock AI response
3. Messages accumulate in state, tokens/attempts tracked
4. User clicks "Submit Final" → POST /api/test/evaluate
   Body: { testId, messages, attemptsUsed, tokensUsed, timeSpentSeconds, ... }
5. Evaluate API calls scoreSubmission() from scoring engine
6. Returns full ScoringResult (5 dimensions, feedback, stats)
7. Sandbox stores result + messages in sessionStorage: `test-result-{id}`
8. Router pushes to /test/[id]/results
9. Results page reads sessionStorage, renders ScoreCard + journey + comparison
```

## Test Scenarios

### Scenario 1: Normal 3-attempt session (email test)
- **Input**: 3 user prompts, 3 AI responses, 1200 tokens, 540s, test-001
- **Expected**: Score 55-75 range (B-C), all 5 dimensions populated, feedback has strengths + suggestions
- **Results page**: Overview shows ScoreCard, Journey tab shows 3 expandable attempts, Comparison shows percentile

### Scenario 2: Single attempt (one-shot)
- **Input**: 1 user prompt, 1 AI response, 400 tokens, 120s
- **Expected**: Efficiency high (85+), Iteration IQ neutral (60), Speed high if fast
- **Results page**: Journey tab shows 1 attempt, Iteration section says "Completed in single attempt"

### Scenario 3: Perfect efficiency
- **Input**: 1 prompt, 1 response, 200 tokens, 180s, maxAttempts=5, budget=2000
- **Expected**: Efficiency 90+, Speed 90+ (used 20% of time)
- **Percentile**: 70-90 range

### Scenario 4: Used all attempts
- **Input**: 5/5 attempts, 1900/2000 tokens, 850/900s
- **Expected**: Efficiency low (30-50), Speed low (35-55), employer panel flags "used all attempts"
- **Iteration IQ**: depends on prompt evolution

### Scenario 5: Timeout (auto-submit)
- **Input**: 3 attempts, timeLeft=0 (auto-submitted)
- **Expected**: Speed score ~35 (used almost all time)
- **Results page**: renders normally, time shows full duration

### Scenario 6: Zero attempts (edge case)
- **Input**: 0 messages
- **Expected**: All dimensions return 0, feedback says "No prompts submitted"
- **Results page**: fallback to default mock data (never reaches 0 in practice since submit requires messages)

### Scenario 7: Direct URL navigation (no sessionStorage)
- **Input**: Navigate directly to /test/test-001/results with no stored data
- **Expected**: Falls back to buildDefaultResult (score 68, grade B)
- **Results page**: Renders with mock data, Journey tab shows "history not available"

### Scenario 8: Employer view
- **Toggle**: isEmployer=true (currently hardcoded)
- **Expected**: Shows employer panel with candidate ranking, flags, shortlist/reject buttons
- **Low score (<40)**: Shows red flag
- **All attempts used**: Shows amber warning
- **Normal**: Shows "No flags"

## Verification Checklist
- [x] TypeScript compiles with zero errors
- [x] ScoreCard displays all 5 dimensions from scoring engine
- [x] Messages stored in sessionStorage for journey display
- [x] Backward compatible with legacy scoring format
- [x] Download report generates text file with all scores
- [x] Share button uses Web Share API with clipboard fallback
- [x] Responsive layout (tested mentally: tabs stack, grid adapts)
- [x] Ocean theme colors consistent (#1B5B7D, #0C2A3A)
- [x] Loading state with spinner
- [x] Error handling for malformed sessionStorage data
- [x] Employer panel with ranking, flags, hire/reject actions
- [x] Score distribution chart with "YOU" indicator
- [x] Percentile and average comparison visualizations
