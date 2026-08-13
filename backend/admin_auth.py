"""Authorization helpers for routes restricted to event administrators."""

from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from model import db, Participant


def admin_required(view):
    """Require a valid JWT belonging to a participant marked as an admin."""
    @wraps(view)
    def wrapped(*args, **kwargs):
        verify_jwt_in_request()

        participant = db.session.get(Participant, int(get_jwt_identity()))
        if participant is None or not participant.is_admin:
            return jsonify({"error": "Admin access required"}), 403

        return view(*args, **kwargs)

    return wrapped
