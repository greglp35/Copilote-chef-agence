# SPEC TEMPLATE

> Single-file, CLI-free adaptation of the `specify → plan → tasks` structure used by `github/spec-kit`.
> Reviewed against the upstream `spec-template.md`, `plan-template.md`, and `tasks-template.md` on 2026-08-15.
>
> **Workflow rule:** complete the three sections in order.
>
> * **Specify** = what users need and why.
> * **Plan** = how the feature will be built.
> * **Tasks** = concrete implementation work, ordered for incremental delivery.
>
> Keep the specification technology-agnostic until the **Plan** section.

---

# 1. Specify

## Feature: [FEATURE NAME]

**Status:** Draft
**Created:** [YYYY-MM-DD]
**Input / Context:** [Short description of the requested feature or problem]

## User Scenarios & Testing

Order user stories by value: **P1** is the smallest/highest-value viable slice, then P2, P3, etc.

Each story should be independently implementable, testable, and demonstrable.

### User Story 1 — [SHORT TITLE] (Priority: P1)

[Describe the user journey in plain language.]

**Why this priority:**
[Explain the user/business value and why this story comes first.]

**Independent test:**
[Describe one end-to-end way to verify this story without requiring later stories.]

**Acceptance scenarios:**

1. **Given** [initial state], **when** [action], **then** [expected result].
2. **Given** [initial state], **when** [action], **then** [expected result].

### User Story 2 — [SHORT TITLE] (Priority: P2)

[Describe the user journey.]

**Why this priority:**
[Value and ordering rationale.]

**Independent test:**
[Standalone verification method.]

**Acceptance scenarios:**

1. **Given** [initial state], **when** [action], **then** [expected result].

### User Story 3 — [SHORT TITLE] (Priority: P3)

[Describe the user journey.]

**Why this priority:**
[Value and ordering rationale.]

**Independent test:**
[Standalone verification method.]

**Acceptance scenarios:**

1. **Given** [initial state], **when** [action], **then** [expected result].

<!-- Add or remove user-story sections as needed. -->

## Edge Cases

* [Boundary condition and expected behavior]
* [Invalid or unexpected input and expected behavior]
* [Empty state / first-run behavior]
* [Failure or unavailable dependency]
* [Accessibility or degraded-environment case, when relevant]

## Requirements

### Functional Requirements

* **FR-001:** The system MUST [observable capability].
* **FR-002:** The system MUST [observable capability].
* **FR-003:** Users MUST be able to [key interaction].
* **FR-004:** The system MUST [state/data behavior].
* **FR-005:** The system MUST [error, security, or recovery behavior].

Use this marker when a requirement cannot yet be made precise:

* **FR-XXX:** [Requirement] — **NEEDS CLARIFICATION:** [specific unresolved question]

### Key Entities

<!-- Include only when the feature has meaningful data/domain objects. -->

* **[Entity]:** [What it represents; important attributes; relationships. Avoid implementation details.]
* **[Entity]:** [What it represents; important attributes; relationships.]

## Success Criteria

Success criteria should be measurable and independent of a specific implementation.

* **SC-001:** [Measurable user outcome]
* **SC-002:** [Measurable quality/performance outcome]
* **SC-003:** [Completion, reliability, or usability target]
* **SC-004:** [Business or operational outcome, if relevant]

## Assumptions

* [Assumption made because the request did not specify this point]
* [Scope boundary]
* [Expected environment or user capability]
* [Dependency on an existing system, service, asset, or process]

## Out of Scope

* [Explicitly excluded behavior]
* [Deferred capability]

---

# 2. Plan

## Implementation Plan: [FEATURE NAME]

**Based on:** the Specify section above
**Date:** [YYYY-MM-DD]

## Summary

[Summarize the primary requirement and the chosen technical approach in a few sentences.]

## Technical Context

**Language / Version:** [e.g. HTML5, CSS, JavaScript ES202x]
**Primary Dependencies:** [libraries/tools, or "None"]
**Storage:** [LocalStorage / IndexedDB / files / API / N/A]
**Testing:** [browser/manual/unit/e2e tooling]
**Target Platform:** [modern browsers / static hosting / other]
**Project Type:** [static site / SPA / multi-page web app / other]
**Performance Goals:** [measurable targets]
**Constraints:** [no framework, offline, accessibility, bundle size, compatibility, etc.]
**Scale / Scope:** [pages, screens, data volume, expected users, or other relevant bounds]

## Quality Gates

* [ ] The plan satisfies every P1 requirement and acceptance scenario.
* [ ] User stories remain independently testable where practical.
* [ ] Dependencies are justified; simpler options were considered.
* [ ] Accessibility, security, performance, and failure states are addressed where relevant.
* [ ] No unresolved item blocks implementation.

## Project Structure

Document the **actual** structure to create or modify.

```text
/
├── index.html
├── assets/
├── css/
│   └── ...
├── js/
│   └── ...
└── tests/
    └── ...
```

**Structure decision:**
[Explain why this layout fits the feature and identify the main files/directories involved.]

## Design / Implementation Notes

### State & Data Flow

[Describe important state, persistence, events, and data transformations.]

### Interfaces / Contracts

[Describe relevant DOM contracts, public functions/modules, API calls, file formats, or integration boundaries.]

### Error & Empty States

[Describe expected behavior for failure, invalid data, loading, empty states, and recovery.]

### Accessibility

[Keyboard behavior, semantics, focus management, announcements, contrast, reduced motion, etc.]

### Performance

[Rendering strategy, asset loading, DOM size, caching, interaction responsiveness, or other relevant constraints.]

## Complexity Exceptions

| Complexity / Exception | Why Needed | Simpler Alternative Rejected Because |
| ---------------------- | ---------- | ------------------------------------ |
| [Example]              | [Reason]   | [Reason]                             |

---

# 3. Tasks

## Task Format

Use:

`- [ ] T### [P?] [US#?] Action, including exact file path when applicable`

Where:

* `T###` is a sequential task ID.
* `[P]` means the task can run in parallel with nearby tasks because it touches independent work and has no unmet dependency.
* `[US1]`, `[US2]`, etc. links a task to a user story.
* Setup/foundational/cross-cutting tasks do not need a user-story tag.
* A task should be small enough to complete and verify as one unit.

## Phase 1 — Setup

**Purpose:** establish the project structure and baseline tooling needed by the feature.

* [ ] T001 [Concrete setup action] in `[path]`
* [ ] T002 [Concrete setup action] in `[path]`
* [ ] T003 [P] [Independent setup action] in `[path]`

**Checkpoint:** project skeleton is ready for shared prerequisites.

## Phase 2 — Foundational

**Purpose:** implement shared prerequisites that block all or most user stories.

* [ ] T004 [Shared prerequisite] in `[path]`
* [ ] T005 [P] [Shared prerequisite] in `[path]`
* [ ] T006 [Shared state/data/error-handling foundation] in `[path]`

**Checkpoint:** user-story implementation can begin.

## Phase 3 — User Story 1: [TITLE] (P1 / MVP)

**Goal:** [What this story delivers.]

**Independent test:** [How this story can be verified on its own.]

### Tests for US1

* [ ] T007 [P] [US1] [Test/verification task] in `[path]`

### Implementation for US1

* [ ] T008 [P] [US1] [Independent implementation task] in `[path]`
* [ ] T009 [US1] [Implementation task depending on T008] in `[path]`
* [ ] T010 [US1] [Validation/error-state task] in `[path]`
* [ ] T011 [US1] Verify all US1 acceptance scenarios

**Checkpoint:** US1 is functional, testable, and demonstrable as the MVP.

## Phase 4 — User Story 2: [TITLE] (P2)

**Goal:** [What this story adds.]

**Independent test:** [How to verify it without requiring later stories.]

### Tests for US2

* [ ] T012 [P] [US2] [Test/verification task] in `[path]`

### Implementation for US2

* [ ] T013 [P] [US2] [Implementation task] in `[path]`
* [ ] T014 [US2] [Implementation/integration task] in `[path]`
* [ ] T015 [US2] Verify all US2 acceptance scenarios

**Checkpoint:** US2 works independently and does not break US1.

## Phase 5 — User Story 3: [TITLE] (P3)

**Goal:** [What this story adds.]

**Independent test:** [How to verify it.]

### Tests for US3

* [ ] T016 [P] [US3] [Test/verification task] in `[path]`

### Implementation for US3

* [ ] T017 [P] [US3] [Implementation task] in `[path]`
* [ ] T018 [US3] [Implementation/integration task] in `[path]`
* [ ] T019 [US3] Verify all US3 acceptance scenarios

**Checkpoint:** all selected user stories are independently functional.

## Final Phase — Polish & Cross-Cutting Concerns

* [ ] T020 [P] Documentation / inline guidance updates in `[path]`
* [ ] T021 Refactor duplicated or fragile code
* [ ] T022 Performance pass against the Plan targets
* [ ] T023 Accessibility pass against the Plan requirements
* [ ] T024 Security / input-safety review where applicable
* [ ] T025 Cross-browser / target-platform verification
* [ ] T026 Final verification of FR-* and SC-* coverage

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup** starts first.
2. **Foundational** depends on Setup and blocks story work when it contains shared prerequisites.
3. **User stories** start after their prerequisites; independent stories may proceed in parallel.
4. **Polish** follows the stories selected for the release.

### User Story Dependencies

* **US1 (P1):** [None / dependency]
* **US2 (P2):** [None / dependency]
* **US3 (P3):** [None / dependency]

Avoid making later stories mandatory for earlier stories unless the product requirement truly requires it.

### Parallel Opportunities

* Tasks marked `[P]` may run concurrently.
* Separate files/modules are preferred for parallel tasks.
* Independent user stories may be implemented concurrently after shared prerequisites are complete.

## Delivery Strategy

### MVP

Deliver **US1 / P1** first as the smallest independently useful increment.

### Incremental Delivery

1. Setup + foundational work
2. US1 → verify → usable MVP
3. US2 → verify → additive increment
4. US3 → verify → additive increment
5. Cross-cutting polish and final success-criteria verification

---

# Coverage Check

Before implementation starts, confirm:

* [ ] Every P1/P2/P3 story has an independent test.
* [ ] Every acceptance scenario maps to one or more requirements/tasks.
* [ ] Every `FR-*` is covered by at least one implementation or verification task.
* [ ] Every `SC-*` has a measurable verification method.
* [ ] Every task has a clear outcome and, when relevant, an exact file path.
* [ ] Dependencies and `[P]` markers are consistent.
* [ ] The P1 path can be delivered as a meaningful MVP.
