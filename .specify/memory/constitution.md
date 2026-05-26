<!-- Sync Impact Report
Version change: 0.0.0 → 1.0.0
Added sections: All (initial ratification)
Templates requiring updates: ✅ All templates reviewed and aligned
Follow-up TODOs: None
-->

# LiteAuth Admin Constitution

## Core Principles

### I. Component-First Frontend (NON-NEGOTIABLE)
All UI MUST be built as reusable React functional components. Components must be organized by domain (auth, users, tasks, roles). No class components. TypeScript MUST be used throughout. Shadcn UI primitives are the foundation; custom styles via Tailwind CSS only. Lucide Icons for all iconography.

### II. Secure by Default (NON-NEGOTIABLE)
All API routes MUST be protected by JWT middleware unless explicitly public (login endpoint only). Passwords MUST be hashed with bcrypt (min 10 salt rounds). All user inputs MUST be validated with express-validator on the server. JWT tokens MUST be short-lived (1h access token, 7d refresh token with Remember Me). No sensitive data in localStorage — use httpOnly cookies or memory.

### III. Role-Based Access Control (NON-NEGOTIABLE)
Every protected action MUST enforce RBAC. Four roles exist: Super Admin, Admin, Manager, Viewer. Permission checks MUST happen server-side — never trust client-supplied roles. Frontend hides unauthorized UI but server enforces. Permission matrix MUST be declarative and centralized.

### IV. REST API Conventions (NON-NEGOTIABLE)
All backend endpoints MUST follow REST conventions: proper HTTP verbs (GET/POST/PUT/PATCH/DELETE), appropriate status codes, consistent JSON response envelope `{ data, error, meta }`. Express Router MUST be used per domain module. No route logic in server entry file.

### V. Activity Audit Trail
Every significant state change MUST be logged to the `activity_logs` table: user creation/deletion, login/logout, task changes, role assignments. Logs are append-only — no update or delete on log entries.

## Technology Standards

**Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Shadcn UI + Lucide Icons + Recharts
**Backend**: Node.js 20 + Express 4 + express-validator + jsonwebtoken + bcrypt
**Database**: SQLite (via better-sqlite3) — PostgreSQL-compatible schema for easy migration
**Dev Tooling**: ESLint + Prettier + tsx for TypeScript execution

## Development Workflow

Code MUST pass ESLint and TypeScript checks before commit. API endpoints MUST be manually tested before marking a task complete. Dark/Light mode MUST be verified on every UI change. Folder structure per the project guide MUST be respected: `client/` for frontend, `server/` for backend.

## Governance

This constitution supersedes all other practices. Amendments require documented rationale and version bump. All implementation tasks must verify compliance with Principles I–V before marking complete. RBAC (Principle III) and Security (Principle II) violations are blocking — they MUST be resolved before any related task proceeds.

**Version**: 1.0.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-05-26
