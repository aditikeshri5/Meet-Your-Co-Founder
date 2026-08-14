from app import app, db
from model import Room, Round
from datetime import datetime, timezone

print("Resetting the matchmaking timer for Room 1...")
with app.app_context():
    try:
        # Find the first round in Room 1
        first_round = Round.query.filter_by(room_id=1).order_by(Round.round_number).first()
        if not first_round:
            print("[ERROR] No rounds found in Room 1. Run test_matchmaking.py first.")
            exit(1)

        # Set Room's current round back to the first round
        room = Room.query.get(1)
        if room:
            room.current_round_id = first_round.id

        # Update the start time to exactly NOW (naive UTC)
        first_round.started_at = datetime.now(timezone.utc).replace(tzinfo=None)
        
        db.session.commit()
        print(f"\n[SUCCESS] Timer reset! Round 1 started at: {first_round.started_at} UTC.")
        print("Refresh your browser, and you will see the active 3-minute timer!")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        db.session.rollback()
