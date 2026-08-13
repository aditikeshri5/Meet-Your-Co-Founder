"""Add the unique swipe-response index to an existing PostgreSQL database."""

from sqlalchemy import text

from app import app
from model import db


with app.app_context():
    with db.engine.begin() as connection:
        connection.execute(text(
            "CREATE UNIQUE INDEX IF NOT EXISTS "
            "uq_swipe_response_pairing_participant "
            "ON swipe_responses (pairing_id, participant_id)"
        ))
    print("Swipe-response unique index is ready")
