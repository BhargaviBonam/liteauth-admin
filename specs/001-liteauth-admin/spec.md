# Feature Specification: LiteAuth Admin — Lightweight User Management Dashboard

**Feature Branch**: `001-liteauth-admin`

**Created**: 2026-05-26

**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Admin Authentication & Protected Access (Priority: P1)

An administrator visits the app and is presented with a login page. They enter valid credentials and are redirected to the dashboard. If credentials are invalid, they see an error. Authenticated sessions persist via "Remember Me." Logging out clears the session and redirects to login. Unauthenticated access to any dashboard route redirects to login.

**Why this priority**: Nothing in the system is accessible without authentication. This is the entry gate to all functionality.

**Independent Test**: Can be fully tested by navigating to `/login`, submitting valid/invalid credentials, verifying redirect behaviour, and confirming protected routes redirect unauthenticated users back to `/login`.

**Acceptance Scenarios**:

1. **Given** a user on `/login`, **When** they submit valid email/password, **Then** they are redirected to `/dashboard` and see their name/role.
2. **Given** a user on `/login`, **When** they submit invalid credentials, **Then** an error message is shown and they remain on `/login`.
3. **Given** an unauthenticated user navigating to `/users`, **When** the page loads, **Then** they are redirected to `/login`.
4. **Given** a logged-in user, **When** they click Logout, **Then** their session is cleared and they are redirected to `/login`.
5. **Given** a user checking "Remember Me", **When** they close and reopen the browser, **Then** their session remains active.

---

### User Story 2 — Dashboard Overview & Analytics (Priority: P2)

An authenticated admin opens the dashboard and sees key metrics at a glance: total users, active users, total tasks, pending/completed task counts. A user registration trend chart shows signups over time. A recent activity timeline shows the last 10 system events.

**Why this priority**: The dashboard is the home screen. It gives context before the admin navigates to any module. Required early to validate data flows from backend.

**Independent Test**: Can be fully tested by logging in as admin and verifying all stat cards show correct counts matching database state, and the chart renders with data.

**Acceptance Scenarios**:

1. **Given** an admin on `/dashboard`, **When** the page loads, **Then** stat cards display accurate counts for users, tasks, and activity.
2. **Given** users registered over multiple days, **When** the admin views the registration chart, **Then** the trend line reflects daily signup counts.
3. **Given** recent activity in the system, **When** the admin views the activity timeline, **Then** the last 10 events are shown with timestamps and actor names.

---

### User Story 3 — User Management CRUD (Priority: P3)

An admin can view a paginated, searchable, filterable list of users. They can create new users (with name, email, role, password), edit existing users, delete users, and toggle active/inactive status. Each action is reflected immediately in the list.

**Why this priority**: Core admin function. Depends on auth (US1) being complete.

**Independent Test**: Can be fully tested by navigating to `/users`, creating a user, editing them, toggling status, and deleting — then verifying the list updates correctly after each action.

**Acceptance Scenarios**:

1. **Given** an admin on `/users`, **When** the page loads, **Then** a paginated list of users is shown (10 per page).
2. **Given** the user list, **When** the admin types in the search box, **Then** results filter in real time by name or email.
3. **Given** the user list, **When** the admin clicks "Create User" and fills the form, **Then** the new user appears in the list.
4. **Given** a user row, **When** the admin clicks "Edit" and changes the role, **Then** the updated role is reflected in the list.
5. **Given** a user row, **When** the admin toggles the active status, **Then** the status badge changes immediately.
6. **Given** a user row, **When** the admin clicks "Delete" and confirms, **Then** the user is removed from the list.

---

### User Story 4 — Task Management (Priority: P4)

An admin can create tasks with a title, description, priority (Low/Medium/High), due date, and assignment to a user. Tasks can be edited, deleted, and have their status updated (Pending → In Progress → Completed). A task list shows all tasks with filters for status and priority.

**Why this priority**: Secondary module. Requires users to exist (US3) for assignment. Demonstrates relational data handling.

**Independent Test**: Can be tested by creating a task, assigning it to a user, updating its status, and verifying the task list reflects all changes with correct filters.

**Acceptance Scenarios**:

1. **Given** an admin on `/tasks`, **When** they click "Create Task", **Then** a form appears with title, description, priority, due date, and user assignment fields.
2. **Given** a task in Pending status, **When** the admin updates it to In Progress, **Then** the status badge updates immediately.
3. **Given** the task list, **When** the admin filters by "High Priority", **Then** only high-priority tasks are shown.
4. **Given** a task row, **When** the admin clicks "Delete" and confirms, **Then** the task is removed from the list.

---

### User Story 5 — Roles & Permissions Management (Priority: P5)

A Super Admin can view roles (Super Admin, Admin, Manager, Viewer) and their associated permissions. They can assign or remove permissions per role. Changing a role's permissions immediately affects all users with that role.

**Why this priority**: Governance layer. Depends on users (US3) and auth (US1). Required for demonstrating full RBAC.

**Independent Test**: Can be tested by logging in as Super Admin, navigating to `/roles`, modifying Manager permissions, then verifying a Manager-role user's access reflects the change.

**Acceptance Scenarios**:

1. **Given** a Super Admin on `/roles`, **When** the page loads, **Then** all four roles and their current permissions are shown.
2. **Given** the roles page, **When** the Super Admin toggles a permission for Manager, **Then** the change saves and a Manager-role user immediately loses or gains that access.

---

### User Story 6 — Activity Logs & Profile/Settings (Priority: P6)

Any authenticated user can view the activity log at `/activity-logs` showing timestamped records of system events. At `/profile`, users can update their name, change their password, and upload an avatar. At `/settings`, users can toggle between dark and light mode.

**Why this priority**: Supporting features. No blocking dependencies. Enhances completeness of the demo flow.

**Independent Test**: Can be tested by performing actions (login, create user), then visiting `/activity-logs` to verify entries appear. Profile update and dark mode toggle can be tested independently.

**Acceptance Scenarios**:

1. **Given** an admin on `/activity-logs`, **When** the page loads, **Then** a timeline of events is shown with actor, action, and timestamp.
2. **Given** an admin on `/profile`, **When** they update their name and save, **Then** the navbar reflects the new name.
3. **Given** a user on `/settings`, **When** they toggle dark mode, **Then** the entire UI switches to dark theme and the preference persists on reload.

---

### Edge Cases

- What happens when a Super Admin tries to delete their own account? (Should be blocked.)
- How does the system handle a session token expiry mid-session? (Should redirect to login with an "expired session" message.)
- What if a user is assigned a task and then deactivated? (Task remains, user shown as inactive in assignment.)
- What if two admins edit the same user simultaneously? (Last write wins; no optimistic locking required for v1.)
- What happens when the search returns zero results? (Show an empty state with a clear message.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via email/password with JWT (access token 1h, refresh token 7d with Remember Me).
- **FR-002**: System MUST protect all routes except `/login` — unauthenticated requests redirect to `/login`.
- **FR-003**: System MUST enforce RBAC on all data-mutating API endpoints based on the authenticated user's role.
- **FR-004**: Dashboard MUST display: total users, active users, total tasks, pending tasks, completed tasks, user registration chart, and recent activity timeline.
- **FR-005**: System MUST support full CRUD operations on users (create, read, update, delete, activate/deactivate).
- **FR-006**: User list MUST support search by name/email, filter by role/status, and pagination (10 per page).
- **FR-007**: System MUST support full CRUD operations on tasks with status tracking (Pending, In Progress, Completed) and priority levels (Low, Medium, High).
- **FR-008**: Tasks MUST be assignable to registered users and include due dates.
- **FR-009**: System MUST define four roles: Super Admin, Admin, Manager, Viewer with configurable permission sets.
- **FR-010**: System MUST log all significant events (login, logout, user creation/deletion, task creation/update, role changes) to activity_logs.
- **FR-011**: Users MUST be able to update their profile (name, password, avatar).
- **FR-012**: System MUST support dark/light mode toggle with persistence across sessions.
- **FR-013**: Passwords MUST be stored as bcrypt hashes — never in plaintext.
- **FR-014**: All form inputs MUST be validated server-side with descriptive error messages.

### Key Entities

- **User**: Represents a system user with id, name, email, hashed password, role, status (active/inactive), avatar, created_at.
- **Task**: Represents a work item with id, title, description, assigned_to (user FK), status, priority, due_date, created_at.
- **ActivityLog**: Append-only event record with id, user_id (actor FK), action (string), created_at.
- **Role**: Enum type (Super Admin, Admin, Manager, Viewer) with associated permission set.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can complete the full demo flow (login → dashboard → create user → create task → assign task → update status → view logs → logout) in under 5 minutes.
- **SC-002**: All list pages (users, tasks, logs) load and display data within 2 seconds on a local development machine.
- **SC-003**: Role-based access control correctly restricts 100% of unauthorized actions — a Viewer cannot create or delete any resource.
- **SC-004**: Dark mode and profile preferences persist across browser refresh without re-configuration.
- **SC-005**: All form validation errors are shown inline with descriptive messages — 0 silent failures.

## Assumptions

- Single-tenant application — one organization, one set of admins.
- The first Super Admin account will be seeded via a database seed script.
- Mobile responsiveness is a nice-to-have for v1 but not required for the demo flow.
- SQLite is used for development; schema is PostgreSQL-compatible for future migration.
- Avatar upload stores files on the local filesystem (no external blob storage) for v1.
- Email sending (e.g., password reset emails) is out of scope for v1.
