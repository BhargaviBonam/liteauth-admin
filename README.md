# LiteAuth Admin

A full-stack user management dashboard built with React, Node.js, and SQLite. Features JWT authentication, role-based access control, a Jira-style task Kanban board, live analytics, and a full activity audit trail.

**GitHub**: https://github.com/BhargaviBonam/liteauth-admin

---

## Features

- **JWT Authentication** — secure login/logout with token-based sessions
- **Role-Based Access Control** — four roles (Super Admin, Admin, Manager, Viewer) with a centralized permission matrix enforced server-side
- **User Management** — full CRUD with search, pagination, role assignment, and active/inactive toggle
- **Jira-Style Task Board** — Kanban board with six statuses (Backlog, To Do, In Progress, In Review, Done, Blocked) and HTML5 drag-and-drop
- **Live Dashboard** — stat cards and task status breakdown that refresh every 15 seconds and update instantly on any change
- **Activity Audit Log** — append-only record of every login, logout, user change, and task update
- **Profile & Settings** — name/password update, avatar upload, dark/light mode toggle with persistence

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3 (dark mode) |
| Charts | Recharts |
| Routing | React Router v6 |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Backend | Node.js 20 + Express 4 + TypeScript |
| Database | SQLite via better-sqlite3 |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Validation | express-validator |
| Runtime | tsx |

---

## Prerequisites

- Node.js 18+ (v20 LTS recommended)
- npm 9+

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/BhargaviBonam/liteauth-admin.git
cd liteauth-admin
```

### 2. Install dependencies

```bash
# Install root dependencies (if any)
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 3. Start the backend

```bash
cd server
npm run dev
```

The server starts on **http://localhost:3001**. On first run it automatically creates the SQLite database and seeds demo data.

### 4. Start the frontend

Open a second terminal:

```bash
cd client
npm run dev
```

The app is now available at **http://localhost:5173**.

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@liteauth.dev | password123 |
| Admin | carol@liteauth.dev | password123 |
| Manager | alice@liteauth.dev | password123 |
| Viewer | bob@liteauth.dev | password123 |

> Each role has different permissions. Log in as Super Admin to access all features including Roles management.

---

## Project Structure

```
liteauth-admin/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── layout/        # Sidebar, Navbar, PageWrapper
│       │   ├── dashboard/     # StatCard, RegistrationChart, ActivityTimeline
│       │   ├── users/         # UserTable, UserForm, UserStatusBadge
│       │   ├── tasks/         # KanbanBoard, TaskTable, TaskForm, TaskStatusBadge
│       │   ├── roles/         # RoleCard, PermissionToggle
│       │   └── shared/        # Pagination, ConfirmDialog, SearchInput
│       ├── pages/             # LoginPage, DashboardPage, UsersPage, TasksPage ...
│       ├── hooks/             # useAuth, useStats, useTheme
│       ├── services/          # api, authService, userService, taskService
│       ├── context/           # AuthContext
│       ├── utils/             # permissions
│       └── types/             # Shared TypeScript interfaces
│
├── server/                    # Express backend
│   └── src/
│       ├── controllers/       # auth, user, task, role, activity
│       ├── routes/            # auth, users, tasks, roles, activityLogs, profile
│       ├── middleware/        # authMiddleware, rbacMiddleware
│       ├── database/          # schema.sql, db.ts, seed.ts
│       └── utils/             # jwt.ts, permissions.ts
│
├── specs/001-liteauth-admin/  # Spec-Kit documentation
│   ├── spec.md                # User stories and requirements
│   ├── plan.md                # Architecture and API contracts
│   ├── data-model.md          # Database schema and role-permission matrix
│   ├── tasks.md               # 84-task implementation checklist
│   └── contracts/             # Per-domain API contracts
│
└── docs/                      # Project documentation
    └── LiteAuth_Admin_Speckit_Documentation.pdf
```

---

## API Endpoints

| Method | Endpoint | Role Required |
|--------|----------|---------------|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Any |
| GET | `/api/auth/me` | Any |
| GET | `/api/users` | Admin+ |
| POST | `/api/users` | Admin+ |
| PUT | `/api/users/:id` | Admin+ |
| DELETE | `/api/users/:id` | Admin+ |
| PATCH | `/api/users/:id/status` | Admin+ |
| GET | `/api/tasks` | Manager+ |
| POST | `/api/tasks` | Manager+ |
| PUT | `/api/tasks/:id` | Manager+ |
| DELETE | `/api/tasks/:id` | Admin+ |
| GET | `/api/roles` | Admin+ |
| PUT | `/api/roles/:role/permissions` | Super Admin |
| GET | `/api/activity-logs` | Admin+ |
| GET | `/api/dashboard/stats` | Any |
| PUT | `/api/profile` | Any |
| POST | `/api/profile/avatar` | Any |

---

## Role Permissions

| Permission | Super Admin | Admin | Manager | Viewer |
|------------|:-----------:|:-----:|:-------:|:------:|
| view_users | ✓ | ✓ | | |
| create_user | ✓ | ✓ | | |
| edit_user | ✓ | ✓ | | |
| delete_user | ✓ | | | |
| view_tasks | ✓ | ✓ | ✓ | ✓ |
| create_task | ✓ | ✓ | ✓ | |
| edit_task | ✓ | ✓ | ✓ | |
| delete_task | ✓ | ✓ | | |
| view_roles | ✓ | ✓ | | |
| edit_roles | ✓ | | | |
| view_logs | ✓ | ✓ | | |

---

## Built with Spec-Kit

This project was built using **Spec-Driven Development** with Spec-Kit — a structured workflow that produces a Constitution, Specification, Plan, and Task checklist before any code is written.

All spec artifacts are in [`specs/001-liteauth-admin/`](specs/001-liteauth-admin/). The full write-up is in [`docs/LiteAuth_Admin_Speckit_Documentation.pdf`](docs/LiteAuth_Admin_Speckit_Documentation.pdf).

---

## License

MIT
