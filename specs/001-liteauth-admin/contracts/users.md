# API Contracts: Users

**Base URL**: `/api/users`
**Auth**: Bearer token required on all endpoints
**Min Role**: Admin

---

## GET /api/users

**Query Params**: `?page=1&limit=10&search=john&role=admin&status=active`

**Response 200**:
```json
{
  "data": [
    { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "admin", "status": "active", "avatar": null, "created_at": "2026-05-26T00:00:00Z" }
  ],
  "error": null,
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

---

## POST /api/users

**Body**:
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "SecurePass@1", "role": "viewer" }
```

**Response 201**:
```json
{ "data": { "id": 5, "name": "Jane Doe", "email": "jane@example.com", "role": "viewer", "status": "active", "avatar": null, "created_at": "2026-05-26T00:00:00Z" }, "error": null }
```

**Response 400**: Validation errors (missing fields, weak password, duplicate email).

---

## GET /api/users/:id

**Response 200**: Single user object (same shape as list item).
**Response 404**: `{ "data": null, "error": "User not found" }`

---

## PUT /api/users/:id

**Body** (all fields optional):
```json
{ "name": "Jane Smith", "email": "janesmith@example.com", "role": "manager" }
```

**Response 200**: Updated user object.

---

## DELETE /api/users/:id

**Response 200**: `{ "data": { "message": "User deleted" }, "error": null }`
**Response 403**: If attempting to delete own account as Super Admin.

---

## PATCH /api/users/:id/status

**Body**: `{ "status": "inactive" }`
**Response 200**: `{ "data": { "id": 5, "status": "inactive" }, "error": null }`
