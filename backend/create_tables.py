"""Create any database tables that do not yet exist."""

from app import app
from model import db


with app.app_context():
    db.create_all()
