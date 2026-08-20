# Frontend integration: live matching and swipes

Base API URL in development: `http://127.0.0.1:5000/api`.

For every protected request, send:

```http
Authorization: Bearer <token>
```

The backend is the source of truth for matching time, phase changes, and the
current opponent. The frontend must never decide that a round has ended or call
an endpoint to force the next round.

## 1. Check into a room

After login, check the participant into their QR-selected room:

```http
PATCH /api/room
Content-Type: application/json

{ "room_id": 1 }
```

## 2. Start an event (admin UI only)

Only show this control to the event host/admin. The backend enforces this role
regardless of what the UI displays.

```http
POST /api/room/1/start-event
```

A normal user receives `403`. An already-started room returns `409`.

## 3. Poll the current round

While the matching screen is open, poll every 5–10 seconds:

```http
GET /api/room/1/current-round
```

Every event round has a 180-second conversation and a 15-second transition.
Polling also catches the room up if a device sleeps or a user returns later.

```json
{
  "room_id": 1,
  "phase": "active",
  "transition_seconds": 15,
  "round": {
    "id": 12,
    "number": 2,
    "duration_seconds": 180,
    "started_at": "2026-08-12T14:30:00+00:00",
    "expires_at": "2026-08-12T14:33:00+00:00",
    "seconds_remaining": 121
  },
  "pairing": {
    "id": 44,
    "is_bye": false,
    "opponent": { "id": 9, "name": "Asha" }
  },
  "next_round_number": 3,
  "event_completed": false
}
```

Render by phase:

- `active`: show `pairing.opponent`, swipe controls, and a countdown to
  `round.expires_at`. `is_bye: true` means show a sit-out state instead.
- `transition`: `pairing` is `null`. Show “Please move to your next match” and
  the countdown. Do not display the next opponent yet.
- `completed`: stop polling and show the post-event review screen.

Update the visual countdown locally once per second, calculated from
`round.expires_at`; use every polling response to correct it. If `round.id`
changes, reset the matching-screen state immediately.

## 4. Save a swipe decision

During an active round, use its `pairing.id`:

```http
POST /api/pairings/44/swipe
Content-Type: application/json

{ "decision": "accept" }
```

Allowed values are `accept` and `reject`. The same request can be sent again
with the other value to update the decision while that pairing is active.
Swipes for stale, future, transition, or completed rounds are rejected with
`409`.

Do not send a swipe when `pairing` is `null` or `is_bye` is `true`.

## 5. Show the final review

When `event_completed` is `true`, request:

```http
GET /api/swipes
```

Example response:

```json
{
  "decisions": [
    {
      "pairing_id": 44,
      "round_number": 2,
      "room_id": 1,
      "opponent": { "id": 9, "name": "Asha" },
      "decision": "accept"
    }
  ]
}
```

Use this list to show mutual connections: a participant appears only when both
people accepted the same pairing. One-sided accepts and rejects are not
returned by this endpoint.

## Error handling

- `401`: missing or expired login token; redirect to login.
- `403`: user lacks admin privileges or is not in the requested room.
- `404`: requested pairing does not belong to the user, or it does not exist.
- `409`: event has not started, the event was already started by an admin, or
  the swipe does not belong to the active pairing.
- `400`: invalid swipe decision or attempt to swipe a bye.
