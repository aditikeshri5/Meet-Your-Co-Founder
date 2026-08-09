from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash

from model import db, Participant


registration = Blueprint("registration", __name__)


@registration.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    if not name or not email or not phone or not password:
        return jsonify({
            "error": "All fields are required"
        }), 400

    existing = Participant.query.filter(
        (Participant.email == email) |
        (Participant.phone == phone)
    ).first()

    if existing:
        return jsonify({
            "error": "Email or phone already registered"
        }), 409

    password_hash = generate_password_hash(password)

    participant = Participant(
        name=name,
        email=email,
        phone=phone,
        password_hash=password_hash
    )

    db.session.add(participant)
    db.session.commit()

    return jsonify({
        "message": "Registration successful",
        "participant_id": participant.id
    }), 201