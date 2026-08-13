# Admin setup

`POST /api/room/<room_id>/start-event` is restricted to authenticated users
whose `participants.is_admin` value is `true`.

## Apply the database change

For the existing Supabase database, run this once from the backend directory:

```powershell
python add_admin_column.py
```

The script is safe to run again; it checks whether the column already exists.

## Grant an admin role

In the Supabase SQL editor, replace the email and run:

```sql
UPDATE participants
SET is_admin = TRUE
WHERE email = 'your-admin-email@example.com';
```

To revoke access:

```sql
UPDATE participants
SET is_admin = FALSE
WHERE email = 'your-admin-email@example.com';
```

The user should log in again after a role change. The backend checks the role
from the database on every protected request, so no frontend-supplied role is
trusted.

## Test

1. Log in as a regular user and call `POST /api/room/1/start-event`; expect
   `403 {"error":"Admin access required"}`.
2. Log in as the administrator and call the same endpoint; expect the existing
   successful event-start response.
