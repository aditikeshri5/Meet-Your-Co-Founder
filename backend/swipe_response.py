"""Mutable participant swipe decisions for event pairings."""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import or_, select

from current_round_ep import get_room_phase
from model import db, Pairing, Participant, Room, Round, SwipeResponse


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
    """Create or update the caller's decision for the active pairing only."""
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

    pairing_round = db.session.get(Round, pairing.round_id)
    room = db.session.execute(
        select(Room).where(Room.id == pairing_round.room_id).with_for_update()
    ).scalar_one_or_none()
    if room is None:
        return jsonify({"error": "Room not found"}), 404

    current_round, phase, _, _ = get_room_phase(room)
    if current_round is None or phase != "active" or current_round.id != pairing.round_id:
        db.session.commit()
        return jsonify({"error": "Swipes are only allowed for the active pairing"}), 409

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
    """List only pairings where both participants accepted each other."""
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
        opponent_response = SwipeResponse.query.filter_by(
            pairing_id=pairing.id,
            participant_id=opponent_id,
            decision="accept",
        ).first()
        if response.decision != "accept" or opponent_response is None:
            continue

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
