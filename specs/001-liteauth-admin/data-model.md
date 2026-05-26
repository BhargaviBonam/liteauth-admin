# Data Model: LiteAuth Admin

**Date**: 2026-05-26 | **Plan**: [plan.md](./plan.md)

## Database: SQLite (PostgreSQL-compatible schema)

---

## Tables

### users

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | |
| name | TEXT | NOT NULL | |
| email | TEXT | NOT NULL UNIQUE | Lowercase, validated |
| password | TEXT | NOT NULL | bcrypt hash |
| role | TEXT | NOT NULL DEFAULT 'viewer' | 'super_admin' \| 'admin' \| 'manager' \| 'viewer' |
| status | TEXT | NOT NULL DEFAULT 'active' | 'active' \| 'inactive' |
| avatar | TEXT | NULLABLE | Relative path to upload |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'manager', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### tasks

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | |
| title | TEXT | NOT NULL | |
| description | TEXT | NULLABLE | |
| assigned_to | INTEGER | NULLABLE FK → users.id | ON DELETE SET NULL |
| status | TEXT | NOT NULL DEFAULT 'pending' | 'pending' \| 'in_progress' \| 'completed' |
| priority | TEXT | NOT NULL DEFAULT 'medium' | 'low' \| 'medium' \| 'high' |
| due_date | DATETIME | NULLABLE | |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### activity_logs

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | |
| user_id | INTEGER | NULLABLE FK → users.id | NULL if actor deleted |
| actor_name | TEXT | NOT NULL | Denormalized for log durability |
| action | TEXT | NOT NULL | Human-readable event string |
| target_type | TEXT | NULLABLE | 'user' \| 'task' \| 'role' \| 'auth' |
| target_id | INTEGER | NULLABLE | ID of affected resource |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |

```sql
CREATE TABLE activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id INTEGER,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## Role-Permission Matrix

Roles are stored as enum values on the `users.role` column. Permissions are enforced in code via a centralized permission map.

| Permission | Super Admin | Admin | Manager | Viewer |
|------------|:-----------:|:-----:|:-------:|:------:|
| create_user | ✅ | ✅ | ❌ | ❌ |
| edit_user | ✅ | ✅ | ❌ | ❌ |
| delete_user | ✅ | ✅ | ❌ | ❌ |
| create_task | ✅ | ✅ | ✅ | ❌ |
| edit_task | ✅ | ✅ | ✅ | ❌ |
| delete_task | ✅ | ✅ | ❌ | ❌ |
| manage_roles | ✅ | ❌ | ❌ | ❌ |
| view_analytics | ✅ | ✅ | ✅ | ✅ |
| view_activity_logs | ✅ | ✅ | ✅ | ❌ |

---

## Seed Data

Initial Super Admin account seeded at startup:

```
name: Super Admin
email: admin@liteauth.dev
password: Admin@123  (bcrypt hashed)
role: super_admin
status: active
```

Additional demo users seeded:
- `manager@liteauth.dev` (Manager role)
- `viewer@liteauth.dev` (Viewer role)
