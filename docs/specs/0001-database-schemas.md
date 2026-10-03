# 0001. Database Schemas and Storage Setup

**Date**: 2026-10-02
**Status**: Accepted

## Summary

This decision defines the database tables, relations, row level security policies, and storage bucket in InsForge PostgreSQL. It establishes the persistent foundation for user profiles, background job search agent runs, discovered job listings, and audit logs. The setup guarantees tenant data isolation by binding all records to authenticated user identities.

## Context

The INeedAJob application needs persistent storage for user career details, job search agent runs, job postings discovered from external APIs or direct URLs, and execution logs. Without dedicated schemas, user profiles cannot be saved or restored, and autonomous job matching agents cannot persist findings.

InsForge provides a managed PostgreSQL database with PostgREST APIs and S3 compatible file storage. The system must enforce strong multi tenant isolation directly inside the database through Row Level Security so no user can access another user's personal profile, search runs, resumes, or extracted job data.

## Requirements

**User stories**:
* As an authenticated job seeker, I want my profile details, work history, and job preferences stored securely so that autonomous agents can match jobs against my background.
* As an authenticated job seeker, I want my agent search runs and discovered job postings saved with deduplication so that I can track application opportunities over time.
* As an authenticated job seeker, I want my resume stored privately so that only I can access and download it.

**Acceptance criteria**:
* **AC-1**: The database contains four core tables (`profiles`, `agent_runs`, `jobs`, `agent_logs`) with strict foreign key constraints and automated timestamp defaults.
* **AC-2**: The `jobs` table enforces uniqueness on the composite key `(user_id, source_url)` so that re-discovering the same job updates existing records rather than creating duplicates.
* **AC-3**: Row Level Security is enabled on every table, with policies ensuring that users can only select, insert, update, and delete their own records where `auth.uid() = user_id` (or `auth.uid() = id` for `profiles`).
* **AC-4**: A dedicated private storage bucket named `resumes` exists in InsForge Storage, restricted to authenticated owner access at `resumes/{user_id}/*`.
* **AC-5**: Deleting an authenticated user cascades cleanly to remove their profile, runs, saved jobs, and logs.

## Options considered

### Option 1: Native InsForge PostgreSQL schema with Row Level Security and private storage bucket

Create standard PostgreSQL tables directly in InsForge with foreign key constraints, cascade rules, explicit database indices, and Row Level Security policies. Use the native InsForge storage engine with private bucket policies for PDF files.

**Pros**:
* Database level security prevents accidental data leaks even if application code has bugs.
* Relational integrity and cascades maintain consistency automatically.
* Native integration with InsForge Auth `auth.uid()`.

**Cons**:
* Requires writing and testing SQL Row Level Security policies carefully.

### Option 2: Application level filtering with public storage

Rely entirely on Next.js server actions to append `WHERE user_id = ...` to queries, keeping database tables without Row Level Security and using a public storage bucket with random URLs.

**Pros**:
* Slightly faster initial setup with fewer SQL statements.

**Cons**:
* Any missed filter in server code exposes sensitive user career data to other users.
* Public bucket URLs risk enumeration or indexing by search engines.

## Decision

**Chosen option**: Option 1: Native InsForge PostgreSQL schema with Row Level Security and private storage bucket

We will create the database schema in InsForge PostgreSQL with Row Level Security policies on every table and a private storage bucket for resume files.

## Rationale

Career profiles, resumes, and job applications contain sensitive Personally Identifiable Information including legal names, contact numbers, salary history, and employment records. Enforcing access controls at the database layer via PostgreSQL Row Level Security provides defense in depth. Linking `profiles.id` directly to `auth.users(id)` ensures a one to one relationship with zero orphaned rows, and cascading deletes ensure compliance with user deletion requests.

## Feature design

**Data model sketch**:

1. `profiles`:
   * `id`: uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
   * `full_name`: text
   * `email`: text NOT NULL
   * `phone`: text
   * `location`: text
   * `current_title`: text
   * `experience_level`: text (junior, mid, senior, lead)
   * `years_experience`: integer DEFAULT 0
   * `skills`: text[] DEFAULT '{}'
   * `industries`: text[] DEFAULT '{}'
   * `work_experience`: jsonb DEFAULT '[]'
   * `education`: jsonb DEFAULT '{}'
   * `job_titles_seeking`: text[] DEFAULT '{}'
   * `remote_preference`: text DEFAULT 'any' (remote, onsite, hybrid, any)
   * `preferred_locations`: text[] DEFAULT '{}'
   * `salary_expectation`: text
   * `cover_letter_tone`: text DEFAULT 'enthusiastic' (formal, casual, enthusiastic)
   * `linkedin_url`: text
   * `portfolio_url`: text
   * `work_authorization`: text DEFAULT 'citizen' (citizen, permanent_resident, visa_required)
   * `resume_pdf_url`: text
   * `is_complete`: boolean DEFAULT false
   * `created_at`: timestamptz DEFAULT now()
   * `updated_at`: timestamptz DEFAULT now()

2. `agent_runs`:
   * `id`: uuid PRIMARY KEY DEFAULT gen_random_uuid()
   * `user_id`: uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
   * `status`: text NOT NULL DEFAULT 'running' (running, completed, failed)
   * `job_title_searched`: text
   * `location_searched`: text
   * `jobs_found`: integer DEFAULT 0
   * `started_at`: timestamptz DEFAULT now()
   * `completed_at`: timestamptz

3. `jobs`:
   * `id`: uuid PRIMARY KEY DEFAULT gen_random_uuid()
   * `run_id`: uuid REFERENCES agent_runs(id) ON DELETE SET NULL
   * `user_id`: uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
   * `source`: text NOT NULL DEFAULT 'search' (search, url)
   * `source_url`: text NOT NULL
   * `external_apply_url`: text
   * `title`: text NOT NULL
   * `company`: text NOT NULL
   * `location`: text
   * `salary`: text
   * `job_type`: text DEFAULT 'fulltime' (fulltime, parttime, contract)
   * `about_role`: text
   * `responsibilities`: text[] DEFAULT '{}'
   * `requirements`: text[] DEFAULT '{}'
   * `nice_to_have`: text[] DEFAULT '{}'
   * `benefits`: text[] DEFAULT '{}'
   * `about_company`: text
   * `match_score`: integer DEFAULT 0
   * `match_reason`: text
   * `matched_skills`: text[] DEFAULT '{}'
   * `missing_skills`: text[] DEFAULT '{}'
   * `company_research`: jsonb DEFAULT '{}'
   * `found_at`: timestamptz DEFAULT now()
   * UNIQUE (user_id, source_url)

4. `agent_logs`:
   * `id`: uuid PRIMARY KEY DEFAULT gen_random_uuid()
   * `run_id`: uuid NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE
   * `user_id`: uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
   * `message`: text NOT NULL
   * `level`: text NOT NULL DEFAULT 'info' (info, success, warning, error)
   * `job_id`: uuid REFERENCES jobs(id) ON DELETE SET NULL
   * `created_at`: timestamptz DEFAULT now()

5. Storage:
   * Bucket: `resumes` (private, allowed mime type application/pdf, 5MB max size)

**State transitions**:
* `agent_runs.status`: `running` -> `completed` | `failed`
* `jobs.source`: `search` (discovered via API search) | `url` (imported directly by user)

**API surface**:
PostgREST data operations managed through InsForge SDK:
| Surface | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `profiles` | SELECT / UPSERT | user_id, profile fields | profile record | Authenticated (owner) | 401 Unauthorized, 403 Forbidden |
| `agent_runs` | INSERT / UPDATE / SELECT | user_id, status, search params | run record | Authenticated (owner) | 401 Unauthorized, 403 Forbidden |
| `jobs` | INSERT / UPDATE / SELECT | user_id, job details, match score | job record | Authenticated (owner) | 409 Conflict on duplicate source_url |
| `agent_logs` | INSERT / SELECT | run_id, user_id, message, level | log record | Authenticated (owner) | 401 Unauthorized, 403 Forbidden |
| `resumes` storage | UPLOAD / DOWNLOAD | user_id, file buffer (PDF) | file storage path | Authenticated (owner) | 413 Payload Too Large, 403 Forbidden |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Profile read | Profile fields and completion status | `profiles` row matching `auth.uid()` |
| Profile update | Updated timestamp and completion flag | Computed in server action and written to `profiles.updated_at` |
| Job discovery | Job listings with scores and company dossier | Adzuna API + OpenAI synthesis saved to `jobs` |
| Agent progress | Run state and step by step messages | Appended to `agent_runs` and `agent_logs` |
| Resume upload | Storage file key and signed download URL | InsForge Storage under `resumes/{user_id}/resume.pdf` |

**Key invariants**:
* Each user has at most one `profiles` record whose primary key equals their auth user id.
* No duplicate job entries exist for the same user and job URL.
* All runs, jobs, and logs cascade on user deletion.
* A user can never read, modify, or delete another user's profile, jobs, or logs.

**Security model**:
* PostgreSQL Row Level Security enabled on all four tables.
* Policies grant full access (SELECT, INSERT, UPDATE, DELETE) only where `auth.uid() = user_id` (or `auth.uid() = id` on `profiles`).
* Storage bucket `resumes` is private; access restricted to authenticated owners reading or writing their own folder `resumes/{user_id}/*`.

**Configuration required**:
No new environment variables required. Existing `NEXT_PUBLIC_INSFORGE_URL` and `NEXT_PUBLIC_INSFORGE_ANON_KEY` are used.

**Critical test scenarios**:
* Happy path: Authenticated user creates and updates their profile, queries their saved jobs, and views their agent search runs, verifies **AC-1**, **AC-2**.
* Failure case: Attempting to insert a duplicate job for the same user and source URL raises a unique constraint violation that the application handles cleanly with upsert, verifies **AC-2**.
* Auth/permission: An unauthenticated request or a request with another user's session returns zero rows on SELECT and is denied on INSERT/UPDATE/DELETE by Row Level Security, verifies **AC-3**, **AC-4**.

## Build plan

1. Write SQL migration script creating `profiles`, `agent_runs`, `jobs`, `agent_logs` tables with constraints, indexes, and cascades, satisfies **AC-1**, **AC-2**, **AC-5**.
2. Apply Row Level Security enable statements and owner isolation policies on all four tables, satisfies **AC-3**.
3. Create the private `resumes` storage bucket in InsForge, satisfies **AC-4**.
4. Execute SQL migration via InsForge MCP `run-raw-sql` and verify table schemas with `get-table-schema`, satisfies **AC-1**, **AC-5**.

## Consequences

**Positive**:
* Absolute multi tenant isolation guaranteed by PostgreSQL kernel policies.
* Zero orphaned records on user account removal.
* Clean foundation for Feature 06 Profile Save and Feature 10 Job Discovery.

**Negative**:
* Schema changes require migrations executed through SQL.
* Service role bypass is required if system level background workers run without user sessions.

## Follow-up

* Run the SQL migration using InsForge MCP tools to prepare the backend for Feature 06 Profile Save Logic.
