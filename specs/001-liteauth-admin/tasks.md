# Tasks: LiteAuth Admin

**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project scaffolding, tooling, and folder structure

- [ ] T001 Initialize monorepo: create `client/` and `server/` directories with `package.json` at root
- [ ] T002 [P] Scaffold frontend: `npm create vite@latest client -- --template react-ts`, install Tailwind CSS, Shadcn UI, Lucide Icons, Recharts, React Router v6, React Hook Form, Zod, Axios
- [ ] T003 [P] Scaffold backend: `npm init` in `server/`, install Express, better-sqlite3, jsonwebtoken, bcrypt, express-validator, cors, cookie-parser, multer, tsx, TypeScript
- [ ] T004 [P] Configure `client/tailwind.config.ts` with Shadcn UI dark mode class strategy
- [ ] T005 [P] Configure `server/tsconfig.json` and `client/tsconfig.json`
- [ ] T006 [P] Add ESLint + Prettier config at root
- [ ] T007 Create `.env.example` with `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `CLIENT_URL`
- [ ] T008 [P] Create `uploads/avatars/` directory and add to `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database, auth infrastructure, and shared middleware — nothing else can start until this is done

**⚠️ CRITICAL**: No user story implementation begins until this phase is complete

- [ ] T009 Create `server/src/database/schema.sql` with users, tasks, activity_logs tables per data-model.md
- [ ] T010 Create `server/src/database/db.ts` — better-sqlite3 singleton with schema auto-run on startup
- [ ] T011 Create `server/src/database/seed.ts` — seed Super Admin, Manager, Viewer demo accounts with bcrypt-hashed passwords
- [ ] T012 [P] Create `server/src/utils/jwt.ts` — `signToken()`, `verifyToken()` helpers using jsonwebtoken
- [ ] T013 [P] Create `server/src/utils/permissions.ts` — declarative role→permissions map (matches data-model.md Role-Permission Matrix)
- [ ] T014 Create `server/src/middleware/authMiddleware.ts` — extract Bearer token, verify JWT, attach `req.user`
- [ ] T015 [P] Create `server/src/middleware/rbacMiddleware.ts` — `requirePermission(permission)` factory using permissions map
- [ ] T016 Create `server/src/app.ts` — Express app with cors, cookie-parser, JSON body parser, `/api` router mount, global error handler
- [ ] T017 Create `server/server.ts` — entry point, start server on `PORT`
- [ ] T018 [P] Create `client/src/services/api.ts` — Axios instance pointed at backend, request interceptor to attach `Authorization: Bearer <token>`, response interceptor to redirect to `/login` on 401
- [ ] T019 [P] Create `client/src/types/index.ts` — shared TypeScript interfaces: `User`, `Task`, `ActivityLog`, `AuthResponse`, `PaginatedResponse`, `ApiResponse`
- [ ] T020 Create `client/src/hooks/useAuth.ts` — auth state (user, token), `login()`, `logout()`, `isAuthenticated` derived from localStorage/memory
- [ ] T021 Create `client/src/components/auth/ProtectedRoute.tsx` — redirects to `/login` if not authenticated
- [ ] T022 [P] Create `client/src/components/layout/Sidebar.tsx` — nav links to all pages, role-aware (hide unauthorized sections)
- [ ] T023 [P] Create `client/src/components/layout/Navbar.tsx` — user name/avatar, logout button, dark mode toggle
- [ ] T024 Create `client/src/App.tsx` — React Router setup with all 9 routes wrapped in `ProtectedRoute`

**Checkpoint**: Backend starts, DB initializes, seed runs, frontend routes are set up with auth guard

---

## Phase 3: User Story 1 — Auth & Protected Access (Priority: P1) 🎯 MVP

**Goal**: Login/logout flow with JWT, protected routes, Remember Me

**Independent Test**: Navigate to `/login`, submit valid credentials → redirected to `/dashboard`. Refresh page → stays on dashboard (Remember Me). Logout → back to `/login`. Navigate to `/users` without logging in → redirected to `/login`.

### Implementation

- [ ] T025 Create `server/src/models/userModel.ts` — `findByEmail()`, `findById()`, `verifyPassword()` functions
- [ ] T026 Create `server/src/controllers/authController.ts` — `login()` (validate, compare bcrypt, sign JWT, set refreshToken cookie), `logout()` (clear cookie), `getMe()` (return req.user)
- [ ] T027 Create `server/src/routes/auth.ts` — mount POST `/login`, POST `/logout` (auth required), GET `/me` (auth required)
- [ ] T028 Create `client/src/pages/LoginPage.tsx` — React Hook Form + Zod schema, email/password fields, Remember Me checkbox, error display, calls `authService.login()`, stores token, redirects to `/dashboard`
- [ ] T029 [P] Create `client/src/services/authService.ts` — `login()`, `logout()`, `getMe()` API calls
- [ ] T030 Log activity: "User logged in" and "User logged out" events in authController

**Checkpoint**: Full login/logout flow works. Protected routes redirect correctly.

---

## Phase 4: User Story 2 — Dashboard Overview & Analytics (Priority: P2)

**Goal**: Stat cards, registration trend chart, recent activity timeline

**Independent Test**: Log in as admin. Navigate to `/dashboard`. Verify all 5 stat cards show numbers. Chart renders with at least one data point. Activity timeline shows at least 1 event.

### Implementation

- [ ] T031 Create `server/src/controllers/activityController.ts` — `getStats()` (query user/task counts + registration trend), `getLogs()` (paginated activity_logs with actor_name)
- [ ] T032 Create `server/src/routes/activityLogs.ts` — GET `/api/dashboard/stats` (auth required), GET `/api/activity-logs` (auth + Manager role)
- [ ] T033 [P] Create `client/src/components/dashboard/StatCard.tsx` — icon, label, count display using Shadcn Card
- [ ] T034 [P] Create `client/src/components/dashboard/RegistrationChart.tsx` — Recharts LineChart with date/count data
- [ ] T035 [P] Create `client/src/components/dashboard/ActivityTimeline.tsx` — last 10 activity_logs displayed as timeline
- [ ] T036 Create `client/src/services/activityService.ts` — `getStats()`, `getLogs()` API calls
- [ ] T037 Create `client/src/pages/DashboardPage.tsx` — fetch stats on mount, render 5 StatCards + RegistrationChart + ActivityTimeline

**Checkpoint**: Dashboard displays live data from the database.

---

## Phase 5: User Story 3 — User Management CRUD (Priority: P3)

**Goal**: Full user CRUD with search, filter, pagination, and status toggle

**Independent Test**: Navigate to `/users`. See paginated list. Search by email → filters results. Create a user → appears in list. Edit role → updates immediately. Toggle status → badge updates. Delete → removed from list.

### Implementation

- [ ] T038 Create `server/src/models/userModel.ts` — add `listUsers(filters, pagination)`, `createUser()`, `updateUser()`, `deleteUser()`, `toggleStatus()` (extend from T025)
- [ ] T039 Create `server/src/controllers/userController.ts` — all CRUD handlers, block self-deletion for Super Admin
- [ ] T040 Create `server/src/routes/users.ts` — all 6 user endpoints with auth + RBAC middleware (Admin role min)
- [ ] T041 [P] Create `client/src/components/shared/SearchInput.tsx` — debounced search input component
- [ ] T042 [P] Create `client/src/components/shared/Pagination.tsx` — prev/next/page number controls
- [ ] T043 [P] Create `client/src/components/shared/ConfirmDialog.tsx` — Shadcn AlertDialog for delete confirmations
- [ ] T044 [P] Create `client/src/components/users/UserStatusBadge.tsx` — colored badge for active/inactive
- [ ] T045 [P] Create `client/src/components/users/UserForm.tsx` — React Hook Form modal for create/edit with Zod validation
- [ ] T046 Create `client/src/components/users/UserTable.tsx` — data table with search, role/status filters, pagination, edit/delete/toggle actions
- [ ] T047 Create `client/src/services/userService.ts` — all user API calls
- [ ] T048 Create `client/src/hooks/useUsers.ts` — state management for user list, pagination, filters
- [ ] T049 Create `client/src/pages/UsersPage.tsx` — compose UserTable + UserForm + ConfirmDialog
- [ ] T050 Ensure activity logging in userController for create, update, delete, status change events

**Checkpoint**: Full user CRUD flow works end-to-end.

---

## Phase 6: User Story 4 — Task Management (Priority: P4)

**Goal**: Task CRUD with status progression, priority filter, user assignment

**Independent Test**: Navigate to `/tasks`. Create a task → appears in list. Filter by "High" priority → only high tasks shown. Update status to "In Progress" → badge changes. Delete task → removed.

### Implementation

- [ ] T051 Create `server/src/models/taskModel.ts` — `listTasks(filters, pagination)`, `createTask()`, `updateTask()`, `deleteTask()`
- [ ] T052 Create `server/src/controllers/taskController.ts` — CRUD handlers with RBAC (Manager can create/edit, Admin can delete)
- [ ] T053 Create `server/src/routes/tasks.ts` — all 4 task endpoints with auth + RBAC middleware
- [ ] T054 [P] Create `client/src/components/tasks/TaskStatusBadge.tsx` — colored badge for pending/in_progress/completed
- [ ] T055 [P] Create `client/src/components/tasks/TaskForm.tsx` — React Hook Form modal: title, description, priority select, due date, user assignment select
- [ ] T056 Create `client/src/components/tasks/TaskTable.tsx` — data table with status/priority filters, assignee display, pagination, edit/delete actions
- [ ] T057 Create `client/src/services/taskService.ts` — all task API calls
- [ ] T058 Create `client/src/hooks/useTasks.ts` — state management for task list, pagination, filters
- [ ] T059 Create `client/src/pages/TasksPage.tsx` — compose TaskTable + TaskForm + ConfirmDialog
- [ ] T060 Ensure activity logging in taskController for create, update, delete events

**Checkpoint**: Full task CRUD flow works end-to-end with filters.

---

## Phase 7: User Story 5 — Roles & Permissions (Priority: P5)

**Goal**: Super Admin can view roles and update permission sets per role

**Independent Test**: Log in as Super Admin → `/roles` shows 4 roles with permissions. Toggle a Manager permission → save → log in as Manager and verify access change reflects correctly.

### Implementation

- [ ] T061 Create `server/src/controllers/roleController.ts` — `listRoles()` (return permission map), `updateRolePermissions()` (Super Admin only, persist to in-memory map + optional JSON file)
- [ ] T062 Create `server/src/routes/roles.ts` — GET `/api/roles` (Admin+), PUT `/api/roles/:role/permissions` (Super Admin only)
- [ ] T063 [P] Create `client/src/components/roles/PermissionToggle.tsx` — checkbox toggle for a single permission on a role (disabled for non-Super Admin)
- [ ] T064 Create `client/src/components/roles/RoleCard.tsx` — displays role name, label, and permission toggles using PermissionToggle
- [ ] T065 Create `client/src/pages/RolesPage.tsx` — fetch roles, render RoleCard for each, save changes button for Super Admin
- [ ] T066 Create `client/src/pages/PermissionsPage.tsx` — read-only matrix view showing all roles vs permissions
- [ ] T067 Ensure activity logging for role permission changes

**Checkpoint**: Super Admin can view and modify role permissions. Changes enforce correctly on next request.

---

## Phase 8: User Story 6 — Activity Logs, Profile & Settings (Priority: P6)

**Goal**: Activity log page, profile update, avatar upload, dark mode toggle

**Independent Test**: Perform actions → visit `/activity-logs` and see entries. Update name on `/profile` → navbar reflects new name. Toggle dark mode on `/settings` → UI changes and preference persists.

### Implementation

- [ ] T068 Create `client/src/pages/ActivityLogsPage.tsx` — paginated list using activityService.getLogs(), display actor name + action + timestamp
- [ ] T069 Create `server/src/middleware/uploadMiddleware.ts` — multer config for avatar: max 2MB, jpg/png/webp, stored in `uploads/avatars/`
- [ ] T070 Add `PUT /api/profile` and `POST /api/profile/avatar` to a new `server/src/routes/profile.ts` with auth middleware
- [ ] T071 Create `server/src/controllers/profileController.ts` — `updateProfile()` (name + password change with current password verification), `uploadAvatar()` (save path to users.avatar)
- [ ] T072 Create `client/src/components/shared/Avatar.tsx` — displays user avatar image or initials fallback
- [ ] T073 Create `client/src/pages/ProfilePage.tsx` — name update form, change password form, avatar upload button with preview
- [ ] T074 [P] Create `client/src/hooks/useTheme.ts` — reads/writes `theme` to localStorage, toggles `dark` class on `<html>`
- [ ] T075 Create `client/src/pages/SettingsPage.tsx` — dark/light mode toggle using useTheme, persists to localStorage

**Checkpoint**: Activity logs visible, profile editable, dark mode toggle works and persists.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final integrations and production-readiness touches

- [ ] T076 [P] Add `Express.static('uploads')` in `server/src/app.ts` to serve avatar files
- [ ] T077 [P] Implement toast notifications (Shadcn Toaster) for success/error feedback on all form submissions
- [ ] T078 [P] Add loading spinners/skeleton states to all data-fetching pages (users, tasks, dashboard)
- [ ] T079 [P] Add empty state components to UserTable and TaskTable when no results match filters
- [ ] T080 Verify RBAC: log in as each role (Viewer, Manager, Admin, Super Admin) and confirm unauthorized actions are blocked on both frontend (hidden UI) and backend (403 response)
- [ ] T081 [P] Add `client/src/utils/permissions.ts` — `hasPermission(user, permission)` helper for frontend UI gating
- [ ] T082 Update Sidebar.tsx to use `hasPermission()` — hide menu items the current user cannot access
- [ ] T083 [P] Update `.env.example` with all required environment variables and add setup notes
- [ ] T084 Run the full demo flow: login → dashboard → create user → create task → assign → update status → view logs → logout. Verify all steps complete within 5 minutes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Stories (Phases 3–8)**: Require Foundational (Phase 2); P1 (Phase 3) must complete before P2+ as auth is required
- **Polish (Phase 9)**: Depends on all user story phases completing

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational
- **US2 (P2)**: Depends on US1 (requires login to test)
- **US3 (P3)**: Depends on US1
- **US4 (P4)**: Depends on US3 (needs users for assignment)
- **US5 (P5)**: Depends on US1 + US3
- **US6 (P6)**: Depends on US1; activity logs depend on US3/US4/US5 having generated data

### Parallel Opportunities

All tasks marked `[P]` within a phase can run simultaneously. US3 and US2 can be worked on in parallel after US1 completes.

---

## Implementation Strategy

### MVP First

1. Phase 1 → Phase 2 → Phase 3 → **STOP and VALIDATE login flow**
2. Phase 4 → **STOP and VALIDATE dashboard**
3. Phase 5 → **STOP and VALIDATE user management**
4. Phases 6–8 → Phases 9

### Demo Flow Validation (Final Check)

Run through the Best Demo Flow from the project guide:
1. Login as Admin (`admin@liteauth.dev`)
2. Open Dashboard → verify stats
3. Create a User
4. Create a Task
5. Assign Task to the new User
6. Update Task Status to Completed
7. Delete the Task
8. View Activity Logs → see all actions
9. Switch Dark/Light Mode
10. Logout
