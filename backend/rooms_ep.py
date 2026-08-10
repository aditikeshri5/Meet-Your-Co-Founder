# rooms_ep.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from model import db, Participant, Room


rooms = Blueprint("rooms", __name__)


@rooms.route("/room", methods=["PATCH"])
@jwt_required()
def update_room():
    participant_id = get_jwt_identity()

    data = request.get_json()
    room_id = data.get("room_id")

    if not room_id:
        return jsonify({"error": "room_id is required"}), 400

    room = Room.query.get(room_id)
    if not room:
        return jsonify({"error": "Room not found"}), 404

    participant = Participant.query.get(participant_id)
    if not participant:
        return jsonify({"error": "Participant not found"}), 404

    participant.room_id = room_id
    db.session.commit()

    return jsonify({
        "message": "Room updated successfully",
        "participant_id": participant.id,
        "room_id": participant.room_id
    }), 200