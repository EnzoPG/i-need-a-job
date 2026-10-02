# Git Workflow & Collaboration Guide

This document outlines the standard Git workflow, branching strategy, commit conventions, and secret management rules for the project.

---

## 1. Branch Strategy

We use a feature-branch workflow centered around two primary branches:

| Branch | Purpose | Protection |
| :--- | :--- | :--- |
| `main` | Production-ready, stable releases. | Protected. Direct pushes disabled. Merges only from `development` via release PRs. |
| `development` | Active integration branch. **All feature and fix PRs target this branch.** | Protected. Code enters via approved PRs only. |

---

## 2. Branch Naming Conventions

All work must be isolated into dedicated branches created off the latest `development` branch. Use kebab-case for branch names:

### ✨ Features
- **Format**: `feat/name-feature`
- **Examples**:
  - `feat/auth-integration`
  - `feat/job-card-component`
  - `feat/resume-upload`
  - `feat/application-tracker-filters`

### 🐛 Bug Fixes
- **Format**: `fix/what-is-fixing`
- **Examples**:
  - `fix/oauth-redirect-loop`
  - `fix/navbar-mobile-overflow`
  - `fix/session-token-expiration`
  - `fix/insforge-storage-cors`

### 🔧 Other Branches (Optional / Supportive)
- **Chores / Config**: `chore/name-task` (e.g. `chore/update-dependencies`)
- **Documentation**: `docs/topic-covered` (e.g. `docs/api-contracts`)
- **Refactoring**: `refactor/scope` (e.g. `refactor/auth-middleware`)

---

## 3. Pull Request (PR) Rules

### 🎯 Target Branch
> **CRITICAL RULE**: Every pull request for new features or fixes **MUST target the `development` branch**, never `main`.

```
feat/name-feature  ───▶  PR  ───▶  development  ───▶  Release PR  ───▶  main
fix/what-is-fixing ───▶  PR  ───▶  development
```

### PR Requirements Checklist
Before submitting a PR:
- [ ] Branch is up to date with `development` (`git pull origin development` or rebase).
- [ ] Code builds without errors (`npm run build` or local dev verification).
- [ ] No hardcoded secrets, API keys, or `.env` files staged or committed.
- [ ] Linting and type checks pass.
- [ ] Documentation / specs updated (e.g., `context/progress-tracker.md`, `context/ui-registry.md`).
- [ ] Clear PR title following conventional format (e.g., `feat(auth): integrate InsForge OAuth flow`).
- [ ] Descriptive PR body with:
  - **Summary**: What changed and why.
  - **Testing**: How changes were verified.
  - **Screenshots / Recordings**: For any UI updates.

---

## 4. Secret & Environment Variable Management

To protect credentials, API keys, and internal endpoints, strict environment isolation is enforced:

### 🛡️ What Belongs in `.gitignore`
- `.env*` (all local environment files: `.env`, `.env.local`, `.env.development.local`, `.env.production.local`, etc.)
- Secret and private keys: `*.pem`, `*.key`, `*.cert`, `*.crt`, `*.pfx`, `*.p12`, `*.secret*`
- Service accounts & credentials: `credentials.json`, `service-account*.json`
- `.env.vault`

### 📋 Public Template: `.env.example`
- Commit **only** `.env.example`.
- `.env.example` must contain only variable names and dummy/placeholder values. Never include production or actual development credentials.

### 🔍 Pre-Commit Safety Check
Before running `git commit`, always verify:
```bash
# Verify modified and untracked files
git status

# Inspect exact staged changes for sensitive keys
git diff --cached
```

### 🚨 What to Do If a Secret Is Committed Accidentally
1. **If not yet pushed**:
   ```bash
   # Reset the commit but keep changes
   git reset HEAD~1
   # Remove the file from tracking
   git rm --cached <sensitive-file>
   ```
2. **If already pushed to remote**:
   - Immediately rotate/revoke the compromised key in InsForge / third-party provider dashboards.
   - Do **not** simply commit a deletion (the secret remains in Git history). Notify the team to purge the secret from Git history using tools like `git-filter-repo` or BFG Repo-Cleaner.

---

## 5. Step-by-Step Implementation Workflow

Follow these steps for every feature or fix:

### Step 1: Start from Clean, Updated `development`
```bash
git checkout development
git pull origin development
```

### Step 2: Create Your Feature or Fix Branch
```bash
# For a new feature:
git checkout -b feat/my-new-feature

# For a bug fix:
git checkout -b fix/issue-description
```

### Step 3: Implement & Test
Make your changes, run tests, and test locally (`npm run dev`).

### Step 4: Stage & Commit (Conventional Commits)
```bash
# Check status and ensure no secret files are listed
git status

# Stage specific files
git add <files>

# Commit with a clear conventional message
git commit -m "feat(module): description of changes"
# or
git commit -m "fix(module): description of bug fix"
```

### Step 5: Keep Up to Date with `development`
```bash
git fetch origin
git rebase origin/development
# Resolve any conflicts if they occur, then git rebase --continue
```

### Step 6: Push Branch & Create PR
```bash
git push -u origin feat/my-new-feature
```
Open a Pull Request on GitHub with:
- **Base**: `development`
- **Compare**: `feat/my-new-feature`

---

## 6. Commit Message Guidelines

We follow Conventional Commits formatting:
`<type>(<scope>): <short description>`

- `feat`: A new user-facing feature or capability
- `fix`: A bug fix
- `docs`: Documentation updates only
- `style`: Formatting, missing semicolons, white-space changes (no production code change)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Maintenance tasks, dependencies, build configurations
