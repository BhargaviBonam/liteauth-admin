# API Contracts: Activity Logs & Profile

---

## GET /api/activity-logs

**Auth**: Bearer token required
**Min Role**: Manager

**Query Params**: `?page=1&limit=20`

**Response 200**:
```json
{
  "data": [
    {
      "id": 101,
      "actor_name": "Super Admin",
      "action": "Created user jane@example.com",
      "target_type": "user",
      "target_id": 5,
      "created_at": "2026-05-26T10:30:00Z"
    }
  ],
  "error": null,
  "meta": { "page": 1, "limit": 20, "total": 200, "totalPages": 10 }
}
```

---

## PUT /api/profile

**Auth**: Bearer token required (any role)

**Body** (all fields optional):
```json
{ "name": "Updated Name", "currentPassword": "oldpass", "newPassword": "NewPass@123" }
```

**Response 200**: Updated user object (without password field).
**Response 400**: Validation error or incorrect current password.

---

## POST /api/profile/avatar

**Auth**: Bearer token required (any role)
**Content-Type**: multipart/form-data

**Body**: Form field `avatar` (image file, max 2MB, jpg/png/webp)

**Response 200**:
```json
{ "data": { "avatar": "/uploads/avatars/user-1-abc123.jpg" }, "error": null }
```
