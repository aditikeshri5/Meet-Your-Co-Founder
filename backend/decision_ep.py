from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity


decision = Blueprint("decision", __name__)


@decision.route(
    "/matches/<int:match_id>/decision",
    methods=["POST"]
)
@jwt_required()
def make_decision(match_id):

    participant_id = get_jwt_identity()

    data = request.get_json()

    user_decision = data.get("decision")

    if user_decision not in ["accept", "skip"]:
        return jsonify({
            "error": "Decision must be 'accept' or 'skip'"
        }), 400

    # Temporary implementation.
    # Match and decision database tables will be added later.

    return jsonify({
        "message": "Decision recorded",
        "participant_id": participant_id,
        "match_id": match_id,
        "decision": user_decision
    }), 200