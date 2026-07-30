# Blitzy's 10 Golden Rules (with the header vocabulary)

Official prompt-engineering guidance from Blitzy's docs (prompt-engineering/golden-rules),
condensed for drafting. Apply every rule; the weak→strong pairs show the standard.

| # | Rule | Action |
|---|---|---|
| 1 | Objective Clarity | Use clear headers. Front-load constraints. |
| 2 | Scope Boundaries | Label lists as "exhaustive" or "examples". |
| 3 | Success Criteria | Specify measurable thresholds and validation steps. |
| 4 | Technology Stack | Pin versions. Reference specific files. |
| 5 | Constraints & Preservation | Use DO NOT, MUST, NEVER. Add rationale when critical. |
| 6 | Architectural Patterns | Point to existing code examples in your repo. |
| 7 | Error Handling & Edge Cases | Write commands, not suggestions. |
| 8 | File Organization | Make explicit decisions. No fallback options. |
| 9 | Testing Requirements | Define coverage, test types, and critical scenarios. |
| 10 | Dependencies & Build | Pin dependency versions. Document build prerequisites. |

## Canonical header vocabulary

Use these exact headers — Blitzy's own examples are built from them:

```
OBJECTIVE:
IN SCOPE (exhaustive):
OUT OF SCOPE (exhaustive):
EXAMPLES of affected areas (non-exhaustive):
CONSTRAINTS:
SUCCESS CRITERIA:
VALIDATION:
TECHNOLOGY STACK:
KEY FILES:
INTEGRATION POINTS:
ARCHITECTURE PATTERNS:
REFERENCE DOCS:
TESTING REQUIREMENTS:
CRITICAL TEST SCENARIOS:
TEST COMMANDS:
BUILD REQUIREMENTS:
DEPENDENCIES:
CRITICAL NOTES:
```

## Weak → strong rewrites (the standard to hit)

Banned hedges: **maybe, try, consider, should, ideally.**

| Weak | Strong |
|---|---|
| Add validation if it seems necessary | Validate email using RFC 5322 format. Reject invalid emails with 400 status. |
| Add error handling as appropriate | Catch Stripe errors. Log to Sentry. Return payment_failed error code. |
| The API should be fast | API must respond within 500ms at p95. Retry failures 3 times with exponential backoff. |
| Create new files as needed | Create new components in /src/components/profile/ |
| Follow existing patterns where possible | Follow PaymentService error handling pattern (wrap calls, log errors, return Result type) |
| Organize files logically | Place all payment-related services in /src/services/payments/ |

Rule 8's principle, verbatim intent: never give Blitzy choices or conditional logic
about where to create files or how to organize code — make all decisions yourself and
state them as absolute requirements.

## Post-AAP validation checklist

After the AAP comes back, re-check the prompt against the same 10 rules — simple bug
fixes may only need a few items; complex features need all of them. Add specificity
tactically where the AAP shows gaps (that's the official 5-step loop: draft → submit →
identify gaps → add specificity → iterate).
