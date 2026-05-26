# API Contracts: Authentication

**Base URL**: `/api/auth`

---

## POST /api/auth/login

**Auth**: None (public endpoint)

**Request**:
```json
{ "email": "admin@liteauth.dev", "password": "Admin@123", "rememberMe": true }
```

**Response 200**:
```json
{ "data": { "user": { "id": 1, "name": "Super Admin", "email": "admin@liteauth.dev", "role": "super_admin", "avatar": null }, "accessToken": "<jwt>" }, "error": null }
```
Sets httpOnly cookie `refreshToken` (7d if rememberMe, session-only otherwise).

**Response 401**:
```json
{ "data": null, "error": "Invalid email or password" }
```

---

## POST /api/auth/logout

**Auth**: Bearer token required

**Response 200**:
```json
{ "data": { "message": "Logged out successfully" }, "error": null }
```
Clears `refreshToken` cookie.

---

## GET /api/auth/me

**Auth**: Bearer token required

**Response 200**:
```json
{ "data": { "id": 1, "name": "Super Admin", "email": "admin@liteauth.dev", "role": "super_admin", "status": "active", "avatar": null, "created_at": "2026-05-26T00:00:00Z" }, "error": null }
```

**Response 401**:
```json
{ "data": null, "error": "Unauthorized" }
```
