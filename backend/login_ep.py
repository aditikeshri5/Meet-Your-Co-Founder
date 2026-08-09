from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token

from model import Participant


login = Blueprint("login", __name__)


@login.route("/login", methods=["POST"])
def login_user():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    participant = Participant.query.filter_by(
        email=email
    ).first()

    if not participant:
        return jsonify({
            "error": "Invalid credentials"
        }), 401

    if not check_password_hash(
        participant.password_hash,
        password
    ):
        return jsonify({
            "error": "Invalid credentials"
        }), 401

    token = create_access_token(
        identity=str(participant.id)
    )

    return jsonify({
        "message": "Login successful",
        "token": token,
        "participant_id": participant.id
    }), 200