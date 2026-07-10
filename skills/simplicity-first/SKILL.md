---
name: simplicity-first
description: Mandatory pre-planning filter for every new project, major feature, integration, infrastructure or architecture decision. Research the simplest viable approaches, simplify repeatedly, and only then prepare implementation instructions.
---

# Simplicity First

## Core rule
Build the smallest system that can safely prove the business result. Do not design the most complete system.

## Run this skill before
- a new project or repository;
- a major feature or integration;
- choosing architecture, framework, database, queue, worker, service or deployment;
- writing a PRD, technical plan, file tree or Codex instructions.

## Mandatory workflow
1. Define the result without technology: user, exact action, measurable proof, non-goals, manual fallback.
2. Research at least three current options: manual/semi-manual, simplest existing-tool approach, and more automated comparison.
3. Simplification pass 1: remove everything not required for the first business proof.
4. Simplification pass 2: combine components; prefer one repo, one app, one database, zero or one worker, one deployment and one provider per function.
5. Simplification pass 3: remove dependencies not materially reducing current risk or time.
6. Simplification pass 4: verify simple start, stop, configuration, diagnosis, backup and restore.
7. Score 0–2 for ten criteria: clear outcome, few services, few dependencies, one deployment, easy local start, rollback, manual fallback, no speculative scope, understandable by one developer, end-to-end testability. Proceed only at 16/20 or higher.

## Default MVP budget
One repository, one main application, one database, zero or one worker, zero or one queue, one deployment target, one external provider per function, logs plus health endpoint first.

## Stop and simplify again when
A second repo/database/queue/deployment appears; more than one worker is proposed without measured load; architecture targets hypothetical scale; automation precedes a working manual flow; local launch requires more than five containers.

## Required output before coding
Create or update `SIMPLICITY_REVIEW.md` with business result, non-goals, approaches researched, simplification passes, final workflow, kept/postponed/rejected components, simplicity score, risks, manual fallback and evidence required before adding complexity.

Only after this review passes may the agent create architecture, schemas, file structures, deployment configuration or coder instructions.

## Completion rule
The final proposal must be simpler than the initial proposal, with removed and postponed complexity explicitly documented.
