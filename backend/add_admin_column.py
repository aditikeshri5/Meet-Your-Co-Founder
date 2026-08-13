"""Add the Participant.is_admin column to an existing database once."""

from sqlalchemy import inspect, text

from app import app
from model import db


with app.app_context():
    inspector = inspect(db.engine)
    participant_columns = {column["name"] for column in inspector.get_columns("participants")}

    if "is_admin" not in participant_columns:
        with db.engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE participants "
                    "ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE"
                )
            )
        print("Added participants.is_admin")
    else:
        print("participants.is_admin already exists")
