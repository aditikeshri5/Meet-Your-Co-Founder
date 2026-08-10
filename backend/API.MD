# API Documentation — Meet Your Co-Founder Backend

Base URL (dev): `http://127.0.0.1:5000/api`

All protected routes require a header:
`Authorization: Bearer <token>`

---

## Frontend Notes

- After login, store the token as: `localStorage.setItem("token", access_token)`
- Include it on all protected requests: `Authorization: Bearer <token>`


## Auth

### POST /auth/register
Register a new participant.

**Body**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

**Success (201)**
```json
{ "message": "Registration successful", "participant_id": 1 }
```

**Errors**
- 400 — missing fields
- 409 — email or phone already registered

---

### POST /auth/login
Log in and receive a JWT.

**Body**
```json
{ "email": "string", "password": "string" }
```

**Success (200)**
```json
{ "access_token": "..." }
```

---


### GET /dashboard
Get the logged-in participant's info. Requires auth.

**Headers**
`Authorization: Bearer <token>`

**Success (200)**
```json
{
  "participant": {
    "id": 2,
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "room_id": 1
  }
}
```

**Errors**
- 404 — participant not found


## Checkin Flow (QR-based room check-in)

QR codes at each room encode: `https://yourapp.com/checkin?room_id=<id>`

Expected frontend behavior at `/checkin`:
1. Read `room_id` from URL query params
2. Check for saved token in localStorage
   - If missing: save the current URL somewhere (e.g. sessionStorage) and redirect to `/auth`
   - After successful login, redirect back to the saved checkin URL
3. If token present: call `PATCH /api/room` with `{ room_id }` and the token
4. Show success/error message


## Rooms

### PATCH /room
Update the logged-in participant's assigned room. Requires auth.

**Headers**
`Authorization: Bearer <token>`

**Body**
```json
{ "room_id": 1 }
```

**Success (200)**
```json
{
  "message": "Room updated successfully",
  "participant_id": 2,
  "room_id": 1
}
```

**Errors**
- 400 — room_id missing
- 404 — room or participant not found

---

## Ideas
*(coming soon)*