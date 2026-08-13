"""Server-authoritative current-round endpoint and advancement logic."""

from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import or_, select

from model import db, Pairing, Participant, Room, Round


rounds = Blueprint("rounds", __name__)

# Fixed event timings. Change these values to change every room's timing.
ROUND_DURATION_SECONDS = 180
TRANSITION_SECONDS = 15


def _utc_now_naive():
    """Return UTC in the same timezone-naive form used by the database."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _as_utc(value):
    """Make a database timestamp safe to compare and send to the client."""
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _next_round(room_id, round_number):
    return (
        Round.query
        .filter(Round.room_id == room_id, Round.round_number > round_number)
        .order_by(Round.round_number)
        .first()
    )


def get_room_phase(room, now=None):
    """Return a locked room's active, transition, or completed state.

    The room row must be locked by the caller.  Using the previous expiry as
    the next start time prevents polling delays from stretching event timing.
    """
    now = now or _utc_now_naive()
    current_round = db.session.get(Round, room.current_round_id)
    if current_round is None:
        return None, "completed", None, None

    if current_round.started_at is None:
        current_round.started_at = now

    while True:
        active_ends_at = current_round.started_at + timedelta(
            seconds=current_round.duration_seconds or ROUND_DURATION_SECONDS
        )
        next_round = _next_round(room.id, current_round.round_number)

        if now < active_ends_at:
            return current_round, "active", active_ends_at, next_round

        if next_round is None:
            return current_round, "completed", active_ends_at, None

        transition_ends_at = active_ends_at + timedelta(seconds=TRANSITION_SECONDS)
        if now < transition_ends_at:
            return current_round, "transition", transition_ends_at, next_round

        if next_round.started_at is None:
            next_round.started_at = transition_ends_at
        room.current_round_id = next_round.id
        current_round = next_round


@rounds.route("/room/<int:room_id>/current-round", methods=["GET"])
@jwt_required()
def get_current_round(room_id):
    """Return the caller's current pairing, advancing the room if necessary."""
    participant_id = int(get_jwt_identity())
    participant = db.session.get(Participant, participant_id)
    if participant is None:
        return jsonify({"error": "Participant not found"}), 404
    if participant.room_id != room_id:
        return jsonify({"error": "You are not checked into this room"}), 403

    # Row locking ensures concurrent client polls cannot advance twice.
    room = db.session.execute(
        select(Room).where(Room.id == room_id).with_for_update()
    ).scalar_one_or_none()
    if room is None:
        return jsonify({"error": "Room not found"}), 404
    if room.current_round_id is None:
        return jsonify({"error": "Event has not started"}), 409

    current_round, phase, phase_ends_at, next_round = get_room_phase(room)
    event_completed = phase == "completed"
    pairing = None
    if phase == "active":
        pairing = Pairing.query.filter(
            Pairing.round_id == current_round.id,
            or_(
                Pairing.participant_a_id == participant_id,
                Pairing.participant_b_id == participant_id,
            ),
        ).first()

    if phase == "active" and pairing is None:
        db.session.rollback()
        return jsonify({"error": "No pairing found for this round"}), 404

    opponent_id = None if pairing is None else (
        pairing.participant_b_id if pairing.participant_a_id == participant_id
        else pairing.participant_a_id
    )
    opponent = db.session.get(Participant, opponent_id) if opponent_id else None
    now = _utc_now_naive()
    seconds_remaining = max(0, int((phase_ends_at - now).total_seconds()))

    response = {
        "room_id": room.id,
        "phase": phase,
        "transition_seconds": TRANSITION_SECONDS,
        "round": {
            "id": current_round.id,
            "number": current_round.round_number,
            "duration_seconds": current_round.duration_seconds,
            "started_at": _as_utc(current_round.started_at).isoformat(),
            "expires_at": _as_utc(phase_ends_at).isoformat(),
            "seconds_remaining": seconds_remaining,
        },
        "pairing": None if pairing is None else {
            "id": pairing.id,
            "is_bye": opponent is None,
            "opponent": None if opponent is None else {
                "id": opponent.id,
                "name": opponent.name,
            },
        },
        "next_round_number": None if next_round is None else next_round.round_number,
        "event_completed": event_completed,
    }
    db.session.commit()
    return jsonify(response), 200
