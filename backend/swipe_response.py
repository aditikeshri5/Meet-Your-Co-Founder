"""Mutable participant swipe decisions for event pairings."""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import or_

from model import db, Pairing, Participant, Round, SwipeResponse


swipes = Blueprint("swipes", __name__)
VALID_DECISIONS = {"accept", "reject"}


def _pairing_for_participant(pairing_id, participant_id):
    """Return a pairing only when the caller is one of its participants."""
    return Pairing.query.filter(
        Pairing.id == pairing_id,
        or_(
            Pairing.participant_a_id == participant_id,
            Pairing.participant_b_id == participant_id,
        ),
    ).first()


@swipes.route("/pairings/<int:pairing_id>/swipe", methods=["POST"])
@jwt_required()
def save_swipe(pairing_id):
    """Create or update the caller's decision for one of their pairings.

    Decisions deliberately remain editable after the event; the frontend can
    hide its editing controls once matching has ended.
    """
    participant_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    decision = data.get("decision")

    if decision not in VALID_DECISIONS:
        return jsonify({"error": "Decision must be 'accept' or 'reject'"}), 400

    pairing = _pairing_for_participant(pairing_id, participant_id)
    if pairing is None:
        return jsonify({"error": "Pairing not found for this participant"}), 404

    # A bye has no person to accept or reject.
    if pairing.participant_a_id is None or pairing.participant_b_id is None:
        return jsonify({"error": "Cannot make a decision for a bye"}), 400

    response = SwipeResponse.query.filter_by(
        pairing_id=pairing.id, participant_id=participant_id
    ).first()
    created = response is None
    if created:
        response = SwipeResponse(pairing_id=pairing.id, participant_id=participant_id)
        db.session.add(response)

    response.decision = decision
    db.session.commit()

    return jsonify({
        "message": "Decision saved",
        "pairing_id": pairing.id,
        "participant_id": participant_id,
        "decision": response.decision,
        "updated": not created,
    }), 200


@swipes.route("/swipes", methods=["GET"])
@jwt_required()
def list_my_swipes():
    """List all decisions the caller has made, for end-of-event review."""
    participant_id = int(get_jwt_identity())
    responses = (
        SwipeResponse.query
        .filter_by(participant_id=participant_id)
        .join(Pairing, SwipeResponse.pairing_id == Pairing.id)
        .join(Round, Pairing.round_id == Round.id)
        .order_by(Round.room_id, Round.round_number)
        .all()
    )

    decisions = []
    for response in responses:
        pairing = db.session.get(Pairing, response.pairing_id)
        opponent_id = (
            pairing.participant_b_id
            if pairing.participant_a_id == participant_id
            else pairing.participant_a_id
        )
        opponent = db.session.get(Participant, opponent_id)
        round_obj = db.session.get(Round, pairing.round_id)
        decisions.append({
            "pairing_id": pairing.id,
            "round_number": round_obj.round_number,
            "room_id": round_obj.room_id,
            "opponent": {"id": opponent.id, "name": opponent.name},
            "decision": response.decision,
        })

    return jsonify({"decisions": decisions}), 200
