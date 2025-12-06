# Sprint Plan: Phase 2 - Sprint 1
**Sprint Dates:** Dec 6 - Dec 19, 2025 (2 weeks)
**Sprint Goal:** Harden MVP foundation with comprehensive error handling, loading states, and testing infrastructure while beginning Phase 2 price comparison UI enhancements

**Facilitator:** Project Manager
**Participants:** All 10 project agents

---

## Meeting Transcript

### Opening

**Project Manager:** Good afternoon, team. Welcome to our Phase 2 Sprint 1 planning session. We just completed an excellent retrospective that identified 29 technical debt items and 13 priority action items from Phase 1. Today we need to define a realistic 2-week sprint that balances hardening our MVP with beginning Phase 2 features. Our build is currently passing - TypeScript, lint, all green - which is a great foundation. Let me start with our Product Owner for strategic context.

---

### Strategic Context & Business Priorities

**Product Owner:** Thank you. From a product perspective, Phase 1 was a remarkable success. We shipped a functional gift planning application that I would actually use. The dark theme is gorgeous, the bulk actions work beautifully, and the Selected Items Banner is a genuine innovation over the reference MVP. However, we shipped with critical gaps that prevent this from being production-ready. My priorities for this sprint are:

1. **Make it production-grade** - Error handling, loading states, resilience
2. **Start Phase 2 value-adds** - Price comparison is our core differentiator, needs polish
3. **Documentation** - A developer should be able to clone and run this in 10 minutes
4. **Keep momentum** - Don't slow down, but don't accumulate more debt

I'm committing to the 30% technical debt allocation we discussed in the retro. That means roughly 6 days of effort on hardening, 14 days on features, across our 2-week sprint. Sound reasonable?

**Architect:** Very reasonable. From a technical perspective, I want to emphasize that the debt we're carrying isn't disaster debt - it's manageable. The architecture is sound. The patterns are established. We're not looking at a rewrite. We're looking at systematic hardening. My top concerns are:

1. **Error boundaries** - One unhandled error crashes the whole app
2. **Loading states** - Users have no feedback during async operations
3. **Server action consistency** - Some actions have proper error handling, some don't
4. **Data fetching scalability** - We load everything upfront, won't scale

Those four items, if fixed, would give us a production-ready foundation. The rest is polish and optimization.

**Security:** I agree with Architect's assessment. From a security standpoint, we have the fundamentals right - Supabase RLS, middleware protection, proper SSR auth patterns. But we're missing:

1. **Rate limiting** - Server actions are vulnerable to abuse
2. **Input sanitization** - We're trusting TypeScript types
3. **Security event logging** - We should track failed operations

If we address those three, I'd feel comfortable calling this production-ready from a security perspective.

**Designer:** Visual consistency is excellent across the app right now. My concerns for this sprint:

1. **Loading states have no design** - We need skeleton loaders
2. **Error states are undefined** - What does a failed action look like?
3. **Modal animations** - They feel abrupt, need smooth transitions
4. **Focus indicators** - Keyboard navigation needs visible focus states

These aren't blockers, but they separate a "functional" app from a "polished" app.

**UX:** Building on Designer's points, the user experience has critical gaps:

1. **No visual feedback during operations** - When I mark 10 items as purchased, there's no spinner, no disabled state, nothing
2. **Error recovery is unclear** - If an action fails, can the user retry? Is the error message actionable?
3. **Discovery problems** - The spacebar privacy blur is hidden, users won't find it

My proposal: let's create a "UX hardening" work stream focused on loading states, error states, and progressive disclosure.

**Code Reviewer:** Quality perspective: the code that exists is high quality. Proper TypeScript, consistent patterns, no glaring issues. But we have zero automated tests. Zero. For Phase 2, I want to see:

1. **Testing infrastructure** - Vitest setup with at least one passing test
2. **Pre-commit hooks** - Prevent bad code from being committed
3. **Component documentation** - JSDoc for all public interfaces

We don't need 80% coverage this sprint, but we need the foundation to build on.

**QA Tester:** I'll second Code Reviewer's testing concerns. Everything I tested in Phase 1 was manual. Core flows work great, but I found edge cases:

1. **Tab switching with selections** - Selection state persists incorrectly across tabs
2. **Empty retailer links** - What happens if an item has zero links?
3. **Concurrent edits** - No handling for race conditions

I want this sprint to include at least basic E2E tests for the critical path: create list, add item, mark purchased.

**Researcher:** Documentation is sparse. We have excellent CLAUDE.md for agents, but no user-facing README. A new developer couldn't run this project without digging through files. This sprint should include:

1. **Comprehensive README** - Setup, architecture, contribution guidelines
2. **Server action documentation** - JSDoc with examples
3. **Architecture diagram** - Visual component hierarchy

These aren't nice-to-haves - they're essential for maintainability.

**Cost Director:** From an efficiency perspective, Phase 1 was excellent. We didn't waste tokens, agents coordinated well, build times are fast. For Phase 2, I want to see:

1. **Parallel agent work** - We can spin up specialized agents for testing, docs, features simultaneously
2. **Request caching** - React Query or SWR would reduce redundant data fetches
3. **Bundle optimization** - Let's baseline our bundle size and set a budget

If we parallelize well, we can get 30% more done in the same time.

**Project Manager:** Excellent context from everyone. I'm hearing three clear themes:

**Theme 1: Resilience** - Error handling, loading states, error boundaries
**Theme 2: Testing Foundation** - Vitest setup, first tests, pre-commit hooks
**Theme 3: Documentation** - README, architecture diagram, JSDoc

And we have Phase 2 feature work starting, particularly around price comparison UI polish. Let me propose a sprint structure before we dive into stories.

---

### Sprint Structure Proposal

**Project Manager:** I propose we organize this sprint into four parallel work streams:

**Stream 1: Foundation Hardening** (30% effort - ~6 days)
- Owner: Architect + Security
- Focus: Error boundaries, loading states, rate limiting, input sanitization

**Stream 2: Testing Infrastructure** (20% effort - ~4 days)
- Owner: QA Tester + Code Reviewer
- Focus: Vitest setup, first tests, pre-commit hooks, E2E framework

**Stream 3: Documentation** (15% effort - ~3 days)
- Owner: Researcher + Architect
- Focus: README, architecture diagram, server action docs

**Stream 4: Phase 2 Features** (35% effort - ~7 days)
- Owner: Designer + UX + Product Owner
- Focus: Price comparison UI enhancements, loading/error designs, modal animations

Does this allocation make sense?

**Product Owner:** I like it. The 30/70 split between debt and features is honored. My only concern - can we define "Phase 2 Features" more concretely? What exactly are we building?

**Designer:** I have a proposal. The retrospective identified several visual/UX improvements that directly enhance the price comparison experience:

1. **Skeleton loaders for price grid** - When loading items, show placeholder cards
2. **Error state designs** - When a retailer link fails to load or is broken
3. **Modal enter/exit animations** - Smoother add/edit item experience
4. **Enhanced price display** - Better visual hierarchy for best price, high-end options

Those four items would significantly polish the existing price comparison UI without adding new features. They're enhancements to what we have.

**UX:** Perfect. And I'd add:

5. **Undo functionality** - Toast with "Undo" button after bulk actions
6. **Keyboard shortcuts help modal** - Accessible via "?" key to discover features
7. **Improved empty states** - Better guidance when lists or items are empty

Those are all UX improvements that make the existing functionality more discoverable and forgiving.

**Architect:** I support those as Phase 2 work. They enhance the core value proposition - multi-retailer price comparison and bulk shopping - without scope creep. And they're achievable in a 2-week sprint alongside the hardening work.

---

### Story Breakdown & Estimation

**Project Manager:** Let's break these down into concrete stories with t-shirt sizing. I'll facilitate, and I want everyone to call out if estimates feel wrong.

#### Stream 1: Foundation Hardening

**Project Manager:** Architect, walk us through the error boundary work.

**Architect:** Story 1.1 - "Add Error Boundaries to Critical Components"

**Description:** Wrap DashboardShell and modals with React error boundaries to prevent full app crashes. Display user-friendly error messages with retry options.

**Acceptance Criteria:**
- Error boundary wraps dashboard-shell component
- Error boundary wraps all modal components
- Errors display friendly message: "Something went wrong. [Retry] [Go Home]"
- Errors are logged to console for debugging
- User can retry the failed operation or return to dashboard

**Effort:** Medium

**Architect:** Story 1.2 - "Standardize Server Action Error Handling"

**Description:** Create withAuth wrapper and standardize error return types across all server actions. All actions return { success: boolean, data?: T, error?: string }.

**Acceptance Criteria:**
- withAuth() wrapper handles auth checks and common errors
- All server actions return consistent result type
- Errors include user-friendly messages
- 100% of server actions use standardized pattern
- Update callers to handle new return type

**Effort:** Large

**Security:** Story 1.3 - "Add Rate Limiting Middleware"

**Description:** Implement rate limiting for server actions using upstash/ratelimit or similar. Prevent abuse of create/update/delete operations.

**Acceptance Criteria:**
- Rate limiting middleware installed and configured
- Create/update/delete actions are rate limited
- Rate limit: 20 requests per minute per user
- Exceeding limit returns 429 with clear error message
- Rate limit bypassed in development mode

**Effort:** Medium

**Security:** Story 1.4 - "Implement Input Sanitization"

**Description:** Add DOMPurify or similar to sanitize user-generated content. Prevent XSS attacks in item names, notes, custom fields.

**Acceptance Criteria:**
- Input sanitization library installed
- All user text inputs are sanitized before storage
- Sanitization preserves legitimate formatting (newlines, etc)
- XSS test cases cannot execute scripts
- No breaking changes to existing data

**Effort:** Small

**Designer:** Story 1.5 - "Design and Implement Loading States"

**Description:** Create skeleton loaders for data fetching states. Add loading spinners for async button actions.

**Acceptance Criteria:**
- Skeleton loader design for gift items table
- Loading spinner for buttons during async operations
- Suspense boundaries for data fetching components
- Loading states match dark theme aesthetics
- Smooth transition from loading to content

**Effort:** Medium

**Designer:** Story 1.6 - "Design and Implement Error State Components"

**Description:** Create reusable error state components for failed data fetches, failed actions, and empty states.

**Acceptance Criteria:**
- ErrorDisplay component with icon, message, retry button
- Error states designed for: failed fetch, failed action, network error
- Consistent styling with dark theme
- Accessible (screen reader friendly)
- Used across dashboard and modals

**Effort:** Small

**Project Manager:** Total for Stream 1: 1 Large, 3 Medium, 2 Small = ~6 days effort. Matches our 30% allocation. Any objections?

**Team:** [General agreement]

#### Stream 2: Testing Infrastructure

**QA Tester:** Story 2.1 - "Set Up Vitest Testing Infrastructure"

**Description:** Install and configure Vitest for unit testing. Write first tests for utility functions.

**Acceptance Criteria:**
- Vitest installed with TypeScript support
- Test script added to package.json
- Test utilities for totals calculations (3 tests minimum)
- CI/CD friendly configuration
- Documentation in README for running tests

**Effort:** Medium

**QA Tester:** Story 2.2 - "Create Test Data Seeders"

**Description:** Script to populate database with realistic test data for manual and automated testing.

**Acceptance Criteria:**
- Seed script creates 3 gift lists
- Each list has 5-10 items with varied statuses
- Items have 2-4 retailer links each
- Script is idempotent (can run multiple times)
- Documentation for running seed script

**Effort:** Small

**Code Reviewer:** Story 2.3 - "Add Pre-Commit Hooks"

**Description:** Install Husky and lint-staged to run TypeScript check, ESLint, and tests before commits.

**Acceptance Criteria:**
- Husky installed and configured
- Pre-commit hook runs: tsc --noEmit, eslint, vitest (when tests exist)
- Failed checks prevent commit
- Documented in README
- Works on Windows, Mac, Linux

**Effort:** Small

**QA Tester:** Story 2.4 - "Set Up Playwright for E2E Testing"

**Description:** Install Playwright and write first E2E test for critical user flow.

**Acceptance Criteria:**
- Playwright installed with TypeScript
- Test: Login -> Create List -> Add Item -> Mark Purchased
- Test runs in CI/CD mode (headless)
- Screenshots on failure
- Documentation for running E2E tests

**Effort:** Large

**Project Manager:** Total for Stream 2: 1 Large, 1 Medium, 2 Small = ~4 days effort. Matches our 20% allocation. Good?

**QA Tester:** Yes, that's realistic.

**Code Reviewer:** Agreed. We're setting foundations, not achieving full coverage.

#### Stream 3: Documentation

**Researcher:** Story 3.1 - "Write Comprehensive README.md"

**Description:** User-facing README with setup instructions, architecture overview, contribution guidelines.

**Acceptance Criteria:**
- Project description and features
- Prerequisites (Node version, Supabase account)
- Step-by-step setup instructions
- Environment variables documentation
- Scripts documentation (dev, build, test)
- Architecture overview section
- Contribution guidelines
- License information

**Effort:** Medium

**Researcher:** Story 3.2 - "Document All Server Actions"

**Description:** Add JSDoc comments to all server actions with descriptions, parameters, return types, and examples.

**Acceptance Criteria:**
- 100% of server actions have JSDoc comments
- Include @param and @returns tags
- Example usage for complex actions
- Error cases documented
- Generated docs viewable (or just in-code)

**Effort:** Small

**Architect:** Story 3.3 - "Create Architecture Diagram"

**Description:** Visual diagram of component hierarchy, data flow, and system architecture.

**Acceptance Criteria:**
- Component hierarchy diagram (React components)
- Data flow diagram (Supabase -> Server Components -> Client Components)
- Authentication flow diagram
- Diagrams created in Mermaid (text-based, version controllable)
- Embedded in README or separate ARCHITECTURE.md

**Effort:** Medium

**Project Manager:** Total for Stream 3: 2 Medium, 1 Small = ~3 days effort. Matches our 15% allocation. Any concerns?

**Researcher:** None. This is achievable and high impact.

#### Stream 4: Phase 2 Features

**Designer:** Story 4.1 - "Add Modal Enter/Exit Animations"

**Description:** Smooth animations for modals using Framer Motion or CSS transitions.

**Acceptance Criteria:**
- Modal fades in and slides down on open
- Modal fades out on close
- Animation duration: 200-300ms
- No jank or layout shift
- Respects prefers-reduced-motion

**Effort:** Small

**Designer:** Story 4.2 - "Enhanced Price Display in Grid"

**Description:** Improve visual hierarchy of price information. Make best price more prominent.

**Acceptance Criteria:**
- Best price has visual emphasis (larger font, color accent)
- High-end price has subtle badge or indicator
- Price comparison is visually scannable
- Maintains dark theme consistency
- Responsive on mobile

**Effort:** Small

**UX:** Story 4.3 - "Implement Undo for Bulk Actions"

**Description:** Add "Undo" button to toast notifications after bulk purchase operations.

**Acceptance Criteria:**
- Toast appears after bulk mark as purchased
- "Undo" button in toast reverses the operation
- Undo available for 5 seconds
- Works for mark purchased and unpurchase
- State updates optimistically

**Effort:** Medium

**UX:** Story 4.4 - "Add Keyboard Shortcuts Help Modal"

**Description:** Modal accessible via "?" key showing all keyboard shortcuts.

**Acceptance Criteria:**
- Press "?" to open help modal
- Shows all keyboard shortcuts (spacebar blur, etc)
- Grouped by category (Navigation, Actions, Misc)
- Styled consistently with dark theme
- Closes on Escape or click outside

**Effort:** Small

**UX:** Story 4.5 - "Improve Empty States with Illustrations"

**Description:** Enhance empty states with better copy and optional illustrations/icons.

**Acceptance Criteria:**
- Empty gift lists: helpful message + CTA to create list
- Empty items: message + CTA to add item
- No search results: message suggesting refinement
- Consistent illustration style (Lucide icons or similar)
- Maintains dark theme

**Effort:** Small

**Designer:** Story 4.6 - "Add Skeleton Loaders to Price Grid"

**Description:** Loading placeholders for gift items table showing shape of content.

**Acceptance Criteria:**
- Skeleton matches table/card layout structure
- Animates (subtle pulse or shimmer)
- Displays during initial data fetch
- Smooth transition to actual content
- Accessible (screen readers announce loading)

**Effort:** Small

**Security:** Story 4.7 - "Add Security Event Logging"

**Description:** Log security-relevant events (failed auth, permission denials, rate limit hits).

**Acceptance Criteria:**
- Failed server actions logged with user ID, action, timestamp
- Rate limit exceedances logged
- Logs don't expose sensitive data
- Logs written to console (Vercel will capture)
- Structured log format for parsing

**Effort:** Small

**Project Manager:** Total for Stream 4: 1 Medium, 6 Small = ~3.5 days effort. That's under our 35% allocation (7 days). Should we add more?

**Product Owner:** I have a story. Story 4.8 - "Fix Tab Selection Bug"

**Description:** QA found a bug where selection state persists incorrectly when switching tabs.

**Acceptance Criteria:**
- Switching tabs clears selections (or maintains correct state per tab)
- Selected Items Banner shows only selected items from current tab
- No visual glitches during tab switch
- Regression test added

**Effort:** Small

**Product Owner:** And Story 4.9 - "Bulk Delete Items Action"

**Description:** Missing feature from reference MVP - ability to select multiple items and delete them.

**Acceptance Criteria:**
- "Delete Selected" button in action buttons component
- Confirmation modal before deletion
- Deletes selected items from database
- UI updates immediately
- Toast confirmation

**Effort:** Small

**Architect:** Story 4.10 - "Optimize Server Components Pattern"

**Description:** Refactor DashboardShell to use Server Components for data fetching, client components only for interactivity.

**Acceptance Criteria:**
- Dashboard page fetches data as Server Component
- Smaller client components for tabs, table, actions
- Reduced JavaScript bundle size
- No loss of functionality
- Faster initial page load

**Effort:** Large

**Project Manager:** Total for Stream 4: 1 Large, 1 Medium, 8 Small = ~7 days effort. Perfect 35% allocation. That's our complete backlog. Let's review the full sprint.

---

### Complete Sprint Backlog

**Project Manager:** Here's our complete sprint backlog with 20 stories:

#### Stream 1: Foundation Hardening (6 days)
1. Add Error Boundaries to Critical Components [M]
2. Standardize Server Action Error Handling [L]
3. Add Rate Limiting Middleware [M]
4. Implement Input Sanitization [S]
5. Design and Implement Loading States [M]
6. Design and Implement Error State Components [S]

#### Stream 2: Testing Infrastructure (4 days)
7. Set Up Vitest Testing Infrastructure [M]
8. Create Test Data Seeders [S]
9. Add Pre-Commit Hooks [S]
10. Set Up Playwright for E2E Testing [L]

#### Stream 3: Documentation (3 days)
11. Write Comprehensive README.md [M]
12. Document All Server Actions [S]
13. Create Architecture Diagram [M]

#### Stream 4: Phase 2 Features (7 days)
14. Add Modal Enter/Exit Animations [S]
15. Enhanced Price Display in Grid [S]
16. Implement Undo for Bulk Actions [M]
17. Add Keyboard Shortcuts Help Modal [S]
18. Improve Empty States with Illustrations [S]
19. Add Skeleton Loaders to Price Grid [S]
20. Add Security Event Logging [S]
21. Fix Tab Selection Bug [S]
22. Bulk Delete Items Action [S]
23. Optimize Server Components Pattern [L]

**Sizing:**
- Large (L): ~2 days each = 3 stories = 6 days
- Medium (M): ~1 day each = 6 stories = 6 days
- Small (S): ~0.5 days each = 14 stories = 7 days
- **Total: 19 days of effort across 2-week sprint with 10 agents**

This is realistic with parallel work. Any objections?

**Architect:** The Server Components optimization (4.10) is the riskiest. Large refactor. Should we deprioritize if time runs short?

**Product Owner:** Agreed. Let's mark that as "stretch goal." If we complete the other 22 stories, attempt the optimization. If not, push to Sprint 2.

**Project Manager:** Good call. Story 4.10 is now marked as stretch goal.

---

### Agent Assignments

**Project Manager:** Proposed agent ownership:

**Architect** - Leads Stream 1 (Foundation Hardening)
- Primary: Stories 1.1, 1.2, 4.10
- Support: 1.5, 1.6

**Security** - Supports Stream 1
- Primary: Stories 1.3, 1.4, 4.7

**QA Tester** - Leads Stream 2 (Testing)
- Primary: Stories 2.1, 2.2, 2.4

**Code Reviewer** - Supports Stream 2
- Primary: Story 2.3
- Reviews: All code from other streams

**Researcher** - Leads Stream 3 (Documentation)
- Primary: Stories 3.1, 3.2, 3.3

**Designer** - Leads Stream 4 (Visual Work)
- Primary: Stories 1.5, 1.6, 4.1, 4.2, 4.6

**UX** - Supports Stream 4 (Experience Work)
- Primary: Stories 4.3, 4.4, 4.5

**Product Owner** - Quality Assurance
- Primary: Stories 4.8, 4.9
- Reviews: All features for business value

**Cost Director** - Efficiency Monitoring
- Monitors: Token usage, build times, bundle size
- Reports: Weekly efficiency metrics

**Project Manager** - Coordination
- Coordinates: Daily standups, conflict resolution
- Tracks: Progress, blockers, sprint burndown

Any concerns about assignments?

**Designer:** I'm happy to lead visual work, but I'll need UX collaboration on the loading and error state designs. Can we pair on those?

**UX:** Absolutely. Stories 1.5 and 1.6 should be collaborative design spikes before implementation.

**Architect:** For the Server Components optimization, I'd like Code Reviewer to review the architecture before I start implementation. Measure twice, cut once.

**Code Reviewer:** Agreed. Let's do a design review session first.

**Project Manager:** Great. I'll facilitate those collaboration sessions. Any other concerns?

**Team:** [None]

---

### Definition of Done

**Code Reviewer:** Let's define our Definition of Done for this sprint. Every story must meet:

**Code Quality:**
- TypeScript check passes (npx tsc --noEmit)
- ESLint passes with zero errors
- Code follows established patterns
- No console.log in production code (console.error is OK)

**Functionality:**
- Acceptance criteria 100% met
- Manual testing completed by implementer
- No regressions in existing functionality
- Works on desktop and mobile

**Testing:**
- New utility functions have unit tests (when Stream 2 is complete)
- Critical paths have E2E tests (when Stream 2 is complete)
- Edge cases identified and handled

**Documentation:**
- JSDoc comments for public functions/components
- README updated if new setup steps
- AGENTS.md updated if shared contracts change

**Accessibility:**
- Keyboard navigable
- Screen reader friendly (ARIA labels where needed)
- Color contrast meets WCAG AA

**Performance:**
- No new performance regressions
- Bundle size increase < 10%
- Lighthouse score remains 90+

**Security:**
- No new vulnerabilities introduced
- Input validation for user data
- Authorization checks for server actions

**Project Manager:** Excellent Definition of Done. I'm adding one more:

**Collaboration:**
- Code reviewed by Code Reviewer before merge
- Security-relevant changes reviewed by Security agent
- UI/UX changes reviewed by Designer/UX agents

Agreed?

**Team:** Agreed.

---

### Success Metrics

**Project Manager:** How do we measure success for this sprint?

**Product Owner:** Product metrics:
- 100% of critical stories (non-stretch) completed
- Zero high-priority bugs introduced
- User can complete core flow without errors

**Architect:** Technical metrics:
- Build passes at end of sprint
- Error boundaries protect 100% of critical components
- All server actions use standardized error handling

**QA Tester:** Quality metrics:
- Vitest setup complete with 5+ passing tests
- Playwright setup complete with 1+ E2E test
- Pre-commit hooks prevent bad commits

**Code Reviewer:** Code metrics:
- TypeScript strict mode maintained
- ESLint zero errors
- No decrease in code quality from Phase 1

**Designer:** Design metrics:
- All loading states have visual design
- All error states have visual design
- Modal animations implemented

**UX:** Experience metrics:
- User has visual feedback for 100% of async actions
- Error messages are actionable
- Keyboard shortcuts are discoverable

**Security:** Security metrics:
- Rate limiting implemented
- Input sanitization for all user content
- Security events logged

**Researcher:** Documentation metrics:
- README complete and accurate
- New developer can set up project in 10 minutes
- Architecture diagram created

**Cost Director:** Efficiency metrics:
- Sprint completed within 2-week timeframe
- Token usage within budget
- No wasted agent effort

**Project Manager:** I'll create a SPRINT-METRICS.md dashboard that we update mid-sprint and end-of-sprint. Agreed?

**Team:** Agreed.

---

### Risk Assessment & Mitigations

**Project Manager:** What could go wrong? Let's identify risks and mitigation strategies.

**Architect:** **Risk 1: Server Action Refactor Breaks Existing Functionality**

Story 1.2 touches every server action. High risk of introducing bugs.

**Mitigation:**
- Implement incrementally, one action at a time
- Extensive manual testing after each change
- Add regression tests before refactoring
- Code review before merging

**QA Tester:** **Risk 2: Testing Infrastructure Setup Takes Longer Than Expected**

Vitest and Playwright setup can have unexpected issues with Next.js 16.

**Mitigation:**
- Start Stream 2 on Day 1, not Day 5
- Use official Next.js testing guides
- Allocate buffer time for troubleshooting
- Researcher can assist with documentation lookup

**Security:** **Risk 3: Rate Limiting Breaks Local Development**

Rate limiting middleware could interfere with dev workflow.

**Mitigation:**
- Bypass rate limiting in development mode
- Use generous limits (20/min, not 5/min)
- Clear documentation for disabling in testing
- Environment variable to toggle on/off

**Designer:** **Risk 4: Skeleton Loaders and Loading States Create Layout Shift**

Loading states could cause content to jump when real data loads.

**Mitigation:**
- Design skeletons to match exact layout of real content
- Use min-height to reserve space
- Test transition carefully
- Measure Cumulative Layout Shift (CLS)

**UX:** **Risk 5: Undo Functionality Introduces State Bugs**

Undo for bulk actions could cause state inconsistency.

**Mitigation:**
- Store snapshot of pre-action state
- Implement undo as new server action, not client-side rollback
- Limit undo time window to 5 seconds
- Extensive testing of edge cases

**Product Owner:** **Risk 6: Scope Creep from "Just One More Thing"**

We have 23 stories. Temptation to add more mid-sprint.

**Mitigation:**
- Strict scope freeze after sprint starts
- New ideas go to Sprint 2 backlog
- Project Manager enforces scope discipline
- Focus on Definition of Done, not new features

**Cost Director:** **Risk 7: Agent Coordination Overhead Slows Progress**

With 10 agents and 4 parallel streams, coordination could become bottleneck.

**Mitigation:**
- Daily async standups (status updates in chat)
- Clear file ownership in AGENTS.md
- Project Manager monitors for conflicts
- Use parallel spawning aggressively

**Code Reviewer:** **Risk 8: Pre-Commit Hooks Too Strict, Frustrate Workflow**

If hooks run full test suite on every commit, developers will find ways around them.

**Mitigation:**
- Hooks run only fast checks (lint, type check)
- Full test suite runs in CI/CD, not pre-commit
- Allow --no-verify for emergencies (with clear warning)
- Document hook behavior in README

**Project Manager:** Excellent risk assessment. I'm logging all 8 risks with mitigations. Any others?

**Researcher:** **Risk 9: Documentation Gets Deprioritized Under Time Pressure**

If sprint runs tight, docs often get cut.

**Mitigation:**
- Documentation is in Definition of Done
- README is blocking for sprint completion
- Start docs early (Day 1-2), not end of sprint
- Pair docs work with code work (parallel)

**Project Manager:** Great catch. Added. Let's wrap with final alignment.

---

### Final Alignment & Commitment

**Project Manager:** Last call for concerns, questions, or adjustments.

**Architect:** I'm confident in this plan. The technical work is challenging but achievable. The risks are identified and mitigated. I commit to leading Stream 1 and delivering error boundaries, standardized server actions, and loading states.

**Security:** I commit to Stream 1 security work - rate limiting, input sanitization, security logging. These are critical for production readiness.

**QA Tester:** I commit to Stream 2 testing infrastructure. By end of sprint, we'll have Vitest running, pre-commit hooks in place, and Playwright framework ready. This is foundational for future sprints.

**Code Reviewer:** I commit to supporting Stream 2 with pre-commit hooks, and reviewing all code changes across streams. I'll ensure quality doesn't slip.

**Researcher:** I commit to Stream 3 documentation. README will be complete, server actions will be documented, and architecture diagram will be visual and clear.

**Designer:** I commit to leading visual work in Stream 4. Loading states, error states, modal animations, skeleton loaders. The app will feel polished.

**UX:** I commit to user experience improvements in Stream 4. Undo functionality, keyboard shortcuts help, empty states. The app will be more forgiving and discoverable.

**Product Owner:** I commit to reviewing all work for business value, fixing the tab selection bug, and adding bulk delete. I'll ensure we're building the right things, not just building things right.

**Cost Director:** I commit to monitoring efficiency and providing weekly reports. If we're burning tokens inefficiently or builds are slowing down, I'll flag it immediately.

**Project Manager:** I commit to coordinating this sprint, facilitating collaboration, resolving conflicts, and tracking progress. We'll have daily async standups, mid-sprint check-in, and end-of-sprint review.

**Everyone:** We commit to the Definition of Done, the success metrics, and the 2-week timeline.

**Product Owner:** One final thought - this sprint isn't just about technical work. It's about setting a sustainable pace. Phase 1 was a sprint. Phase 2 should be a marathon. Let's ship quality, not just features.

**Architect:** Well said. Sustainable architecture, sustainable pace.

**Project Manager:** Perfect. Sprint planning is complete. I'll publish this plan, update AGENTS.md, and we'll begin Sprint 2 Phase 2 tomorrow. Meeting adjourned.

---

## Sprint Backlog

### Stream 1: Foundation Hardening (30% - 6 days)

| ID | Story | Owner | Est | Priority |
|----|-------|-------|-----|----------|
| 1.1 | Add Error Boundaries to Critical Components | Architect | M | Critical |
| 1.2 | Standardize Server Action Error Handling | Architect | L | Critical |
| 1.3 | Add Rate Limiting Middleware | Security | M | High |
| 1.4 | Implement Input Sanitization | Security | S | High |
| 1.5 | Design and Implement Loading States | Designer + UX | M | Critical |
| 1.6 | Design and Implement Error State Components | Designer + UX | S | High |

### Stream 2: Testing Infrastructure (20% - 4 days)

| ID | Story | Owner | Est | Priority |
|----|-------|-------|-----|----------|
| 2.1 | Set Up Vitest Testing Infrastructure | QA Tester | M | Critical |
| 2.2 | Create Test Data Seeders | QA Tester | S | Medium |
| 2.3 | Add Pre-Commit Hooks | Code Reviewer | S | High |
| 2.4 | Set Up Playwright for E2E Testing | QA Tester | L | High |

### Stream 3: Documentation (15% - 3 days)

| ID | Story | Owner | Est | Priority |
|----|-------|-------|-----|----------|
| 3.1 | Write Comprehensive README.md | Researcher | M | Critical |
| 3.2 | Document All Server Actions | Researcher | S | Medium |
| 3.3 | Create Architecture Diagram | Architect + Researcher | M | High |

### Stream 4: Phase 2 Features (35% - 7 days)

| ID | Story | Owner | Est | Priority |
|----|-------|-------|-----|----------|
| 4.1 | Add Modal Enter/Exit Animations | Designer | S | Medium |
| 4.2 | Enhanced Price Display in Grid | Designer | S | Medium |
| 4.3 | Implement Undo for Bulk Actions | UX | M | High |
| 4.4 | Add Keyboard Shortcuts Help Modal | UX | S | Medium |
| 4.5 | Improve Empty States with Illustrations | UX | S | Medium |
| 4.6 | Add Skeleton Loaders to Price Grid | Designer | S | High |
| 4.7 | Add Security Event Logging | Security | S | Medium |
| 4.8 | Fix Tab Selection Bug | Product Owner | S | Critical |
| 4.9 | Bulk Delete Items Action | Product Owner | S | High |
| 4.10 | Optimize Server Components Pattern | Architect | L | Stretch |

**Total:** 23 stories, ~19 days effort, 2-week sprint with parallel work

**Estimates:**
- Large (L): ~2 days = 3 stories = 6 days
- Medium (M): ~1 day = 6 stories = 6 days
- Small (S): ~0.5 days = 14 stories = 7 days

---

## Definition of Done

Every story must meet ALL criteria before being marked complete:

### Code Quality
- [ ] TypeScript check passes (npx tsc --noEmit)
- [ ] ESLint passes with zero errors
- [ ] Code follows established patterns
- [ ] No console.log in production code

### Functionality
- [ ] 100% of acceptance criteria met
- [ ] Manual testing completed
- [ ] No regressions in existing features
- [ ] Works on desktop and mobile (responsive)

### Testing
- [ ] New utilities have unit tests (post-Stream 2)
- [ ] Critical paths have E2E coverage (post-Stream 2)
- [ ] Edge cases identified and handled

### Documentation
- [ ] JSDoc comments for public APIs
- [ ] README updated if setup changes
- [ ] AGENTS.md updated if contracts change

### Accessibility
- [ ] Keyboard navigable
- [ ] Screen reader friendly (ARIA labels)
- [ ] Color contrast meets WCAG AA

### Performance
- [ ] No performance regressions
- [ ] Bundle size increase < 10%
- [ ] Lighthouse score 90+

### Security
- [ ] No new vulnerabilities
- [ ] Input validation for user data
- [ ] Authorization checks in server actions

### Collaboration
- [ ] Code reviewed by Code Reviewer
- [ ] Security changes reviewed by Security
- [ ] UI/UX changes reviewed by Designer/UX

---

## Risks & Mitigations

| # | Risk | Impact | Probability | Mitigation |
|---|------|--------|-------------|------------|
| 1 | Server Action Refactor Breaks Functionality | High | Medium | Incremental implementation, extensive testing, regression tests |
| 2 | Testing Setup Takes Longer Than Expected | Medium | Medium | Start Day 1, use official guides, buffer time, Researcher support |
| 3 | Rate Limiting Breaks Local Development | Medium | Low | Bypass in dev mode, generous limits, environment toggle |
| 4 | Skeleton Loaders Create Layout Shift | Medium | Medium | Match exact layout, use min-height, test transitions, measure CLS |
| 5 | Undo Functionality Introduces State Bugs | High | Medium | Store snapshots, server-side undo, 5-sec window, extensive testing |
| 6 | Scope Creep from "Just One More Thing" | High | High | Strict scope freeze, Project Manager discipline, focus on DoD |
| 7 | Agent Coordination Overhead Slows Progress | Medium | Low | Daily standups, AGENTS.md ownership, parallel spawning |
| 8 | Pre-Commit Hooks Too Strict | Low | Medium | Only fast checks, CI/CD for full tests, allow --no-verify |
| 9 | Documentation Gets Deprioritized | Medium | Medium | Docs in DoD, start early, parallel work |

---

## Success Metrics

### Sprint Completion
- [ ] 100% of critical stories completed
- [ ] 90%+ of high priority stories completed
- [ ] 70%+ of medium priority stories completed
- [ ] Zero high-priority bugs introduced

### Technical Quality
- [ ] Build passes (TypeScript, ESLint, build)
- [ ] Error boundaries protect critical components
- [ ] All server actions use standardized error handling
- [ ] Vitest setup with 5+ passing tests
- [ ] Playwright setup with 1+ E2E test
- [ ] Pre-commit hooks prevent bad commits

### Design & UX
- [ ] All loading states have visual design
- [ ] All error states have visual design
- [ ] Modal animations smooth and performant
- [ ] User feedback for 100% of async actions

### Security
- [ ] Rate limiting implemented and tested
- [ ] Input sanitization for all user content
- [ ] Security events logged

### Documentation
- [ ] README complete and accurate
- [ ] New developer can set up in < 10 minutes
- [ ] Architecture diagram complete
- [ ] Server actions documented

### Performance
- [ ] Bundle size increase < 10%
- [ ] Lighthouse score 90+ maintained
- [ ] No perceived performance regressions

### Efficiency
- [ ] Sprint completed within 2 weeks
- [ ] Token usage within budget
- [ ] Agent coordination smooth

---

## Daily Standup Format

Async status updates every day in this format:

**[Agent Name] - [Date]**

**Yesterday:**
- Completed: [stories/tasks]
- Progress: [in-progress work]

**Today:**
- Focus: [planned work]
- Pairing: [any collaboration needed]

**Blockers:**
- [any issues preventing progress]

**Code Reviewer Needed:**
- [any PRs ready for review]

---

## Sprint Schedule

**Week 1 (Dec 6-12):**
- Day 1-2: Stream 1 & 2 foundations (error boundaries, testing setup)
- Day 3-4: Stream 3 & 4 begin (docs, visual work)
- Day 5: Mid-sprint check-in, adjust if needed

**Week 2 (Dec 13-19):**
- Day 6-8: Complete all streams, integration testing
- Day 9: Buffer for overrun, polish, bug fixes
- Day 10: Sprint review, retrospective, planning for Sprint 2

---

## Sprint Goal Reminder

**"Harden MVP foundation with comprehensive error handling, loading states, and testing infrastructure while beginning Phase 2 price comparison UI enhancements"**

This sprint makes our app production-ready while maintaining momentum on features. We're balancing technical excellence with user value.

---

**Sprint Start Date:** 2025-12-06
**Sprint End Date:** 2025-12-19
**Next Sprint Planning:** 2025-12-20
