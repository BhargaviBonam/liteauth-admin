# API Contracts: Tasks

**Base URL**: `/api/tasks`
**Auth**: Bearer token required on all endpoints
**Min Role**: Manager (create/edit); Admin (delete)

---

## GET /api/tasks

**Query Params**: `?page=1&limit=10&status=pending&priority=high&assignedTo=3`

**Response 200**:
```json
{
  "data": [
    {
      "id": 1, "title": "Fix login bug", "description": "...", "status": "pending",
      "priority": "high", "due_date": "2026-06-01T00:00:00Z",
      "assigned_to": 3, "assignee_name": "John Doe", "created_at": "2026-05-26T00:00:00Z"
    }
  ],
  "error": null,
  "meta": { "page": 1, "limit": 10, "total": 20, "totalPages": 2 }
}
```

---

## POST /api/tasks

**Body**:
```json
{ "title": "Review PR", "description": "Review auth PR", "priority": "medium", "due_date": "2026-06-05", "assigned_to": 2 }
```

**Response 201**: Created task object.
**Response 400**: Validation errors.

---

## PUT /api/tasks/:id

**Body** (all fields optional):
```json
{ "title": "Review PR v2", "status": "in_progress", "priority": "high" }
```

**Response 200**: Updated task object.
**Response 404**: Task not found.

---

## DELETE /api/tasks/:id

**Min Role**: Admin
**Response 200**: `{ "data": { "message": "Task deleted" }, "error": null }`
