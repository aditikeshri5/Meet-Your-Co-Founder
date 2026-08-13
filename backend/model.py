from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Participant(db.Model):
    __tablename__ = "participants"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    phone = db.Column(
        db.String(20),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    room_id = db.Column(
        db.Integer,
        nullable=True
    )

    is_admin = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(20), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    current_round_id = db.Column(db.Integer, db.ForeignKey("rounds.id"), nullable=True)

    @property
    def current_round(self):
        if self.current_round_id is None:
            return None
        return db.session.get(Round, self.current_round_id)


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )


class Idea(db.Model):
    __tablename__ = "ideas"

    id = db.Column(db.Integer, primary_key=True)

    participant_id = db.Column(
        db.Integer,
        db.ForeignKey("participants.id"),
        nullable=False
    )

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=False
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

class Round(db.Model):
    __tablename__ = "rounds"

    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey("rooms.id"), nullable=False)
    round_number = db.Column(db.Integer, nullable=False)
    started_at = db.Column(db.DateTime, nullable=True)
    duration_seconds = db.Column(db.Integer, default=180)


class Pairing(db.Model):
    __tablename__ = "pairings"

    id = db.Column(db.Integer, primary_key=True)
    round_id = db.Column(db.Integer, db.ForeignKey("rounds.id"), nullable=False)
    participant_a_id = db.Column(db.Integer, db.ForeignKey("participants.id"), nullable=True)
    participant_b_id = db.Column(db.Integer, db.ForeignKey("participants.id"), nullable=True)


class SwipeResponse(db.Model):
    __tablename__ = "swipe_responses"
    __table_args__ = (
        db.UniqueConstraint("pairing_id", "participant_id", name="uq_swipe_response_pairing_participant"),
    )

    id = db.Column(db.Integer, primary_key=True)
    pairing_id = db.Column(db.Integer, db.ForeignKey("pairings.id"), nullable=False)
    participant_id = db.Column(db.Integer, db.ForeignKey("participants.id"), nullable=False)
    decision = db.Column(db.String(10), nullable=False)  # "accept" or "reject"
    created_at = db.Column(db.DateTime, server_default=db.func.now())
