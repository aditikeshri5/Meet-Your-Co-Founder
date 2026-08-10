from app import app
from model import db, Room

with app.app_context():
    db.session.add_all([
        Room(room_number="A101", capacity=6),
        Room(room_number="A102", capacity=6),
        Room(room_number="B201", capacity=4),
    ])
    db.session.commit()