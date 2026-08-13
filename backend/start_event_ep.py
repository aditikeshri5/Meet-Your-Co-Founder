from flask import Blueprint, jsonify
from datetime import datetime, timezone

from model import db, Participant, Room, Round, Pairing
from matchmaking import assign_sides, generate_round_robin
from admin_auth import admin_required


events = Blueprint("events", __name__)


@events.route("/room/<int:room_id>/start-event", methods=["POST"])
@admin_required
def start_event(room_id):
    room = Room.query.get(room_id)
    if not room:
        return jsonify({"error": "Room not found"}), 404

    if room.current_round_id is not None:
        return jsonify({"error": "An event is already running for this room"}), 409

    participants = Participant.query.filter_by(room_id=room_id).order_by(Participant.id).all()
    if len(participants) < 2:
        return jsonify({"error": "Not enough participants in this room"}), 400

    participant_ids = [p.id for p in participants]
    side_a, side_b = assign_sides(participant_ids)
    schedule = generate_round_robin(side_a, side_b)

    first_round_obj = None

    for round_number, pairings in enumerate(schedule, start=1):
        round_obj = Round(
            room_id=room_id,
            round_number=round_number,
            # Store naive UTC because the database column is timezone-naive.
            started_at=datetime.now(timezone.utc).replace(tzinfo=None) if round_number == 1 else None
        )
        db.session.add(round_obj)
        db.session.flush()  # gets round_obj.id without a full commit yet

        if round_number == 1:
            first_round_obj = round_obj

        for a_id, b_id in pairings:
            db.session.add(Pairing(
                round_id=round_obj.id,
                participant_a_id=a_id,
                participant_b_id=b_id
            ))

    room.current_round_id = first_round_obj.id
    db.session.commit()

    return jsonify({
        "message": "Event started",
        "total_rounds": len(schedule),
        "current_round_id": first_round_obj.id
    }), 200
