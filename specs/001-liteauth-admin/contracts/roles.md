# API Contracts: Roles & Permissions

**Base URL**: `/api/roles`
**Auth**: Bearer token required on all endpoints

---

## GET /api/roles

**Min Role**: Admin

**Response 200**:
```json
{
  "data": [
    {
      "role": "super_admin",
      "label": "Super Admin",
      "permissions": ["create_user", "edit_user", "delete_user", "create_task", "edit_task", "delete_task", "manage_roles", "view_analytics", "view_activity_logs"]
    },
    {
      "role": "admin",
      "label": "Admin",
      "permissions": ["create_user", "edit_user", "delete_user", "create_task", "edit_task", "delete_task", "view_analytics", "view_activity_logs"]
    },
    {
      "role": "manager",
      "label": "Manager",
      "permissions": ["create_task", "edit_task", "view_analytics", "view_activity_logs"]
    },
    {
      "role": "viewer",
      "label": "Viewer",
      "permissions": ["view_analytics"]
    }
  ],
  "error": null
}
```

---

## PUT /api/roles/:role/permissions

**Min Role**: Super Admin

**Body**: `{ "permissions": ["create_task", "edit_task", "view_analytics"] }`

**Response 200**:
```json
{ "data": { "role": "manager", "permissions": ["create_task", "edit_task", "view_analytics"] }, "error": null }
```

**Response 403**: If non-Super Admin attempts this action.

---

## GET /api/dashboard/stats

**Min Role**: Any authenticated user

**Response 200**:
```json
{
  "data": {
    "totalUsers": 42,
    "activeUsers": 38,
    "totalTasks": 120,
    "pendingTasks": 45,
    "completedTasks": 60,
    "registrationTrend": [
      { "date": "2026-05-20", "count": 3 },
      { "date": "2026-05-21", "count": 5 }
    ]
  },
  "error": null
}
```
