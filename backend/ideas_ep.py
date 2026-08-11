# ideas_ep.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from model import db, Idea, Category, Participant


ideas = Blueprint("ideas", __name__)


@ideas.route("/idea", methods=["POST"])
@jwt_required()
def submit_idea():
    participant_id = get_jwt_identity()

    participant = Participant.query.get(participant_id)
    if not participant:
        return jsonify({"error": "Participant not found"}), 404

    # Enforce one idea per participant
    existing = Idea.query.filter_by(participant_id=participant_id).first()
    if existing:
        return jsonify({"error": "You have already submitted an idea"}), 409

    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    category_id = data.get("category_id")

    if not title or not description or not category_id:
        return jsonify({"error": "title, description, and category_id are required"}), 400

    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Invalid category_id"}), 400

    idea = Idea(
        participant_id=participant_id,
        category_id=category_id,
        title=title,
        description=description
    )

    db.session.add(idea)
    db.session.commit()

    return jsonify({
        "message": "Idea submitted successfully",
        "idea": {
            "id": idea.id,
            "title": idea.title,
            "description": idea.description,
            "category_id": idea.category_id
        }
    }), 201