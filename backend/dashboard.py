from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from model import Participant


dashboard = Blueprint("dashboard", __name__)


@dashboard.route("/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard():

    participant_id = get_jwt_identity()

    participant = Participant.query.get(participant_id)

    if not participant:
        return jsonify({
            "error": "Participant not found"
        }), 404

    return jsonify({
        "participant": {
            "id": participant.id,
            "name": participant.name,
            "email": participant.email,
            "phone": participant.phone,
            "room_id": participant.room_id,
            "is_admin": participant.is_admin
        }
    }), 200