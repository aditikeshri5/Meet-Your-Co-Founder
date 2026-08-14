from app import app, db
from model import Participant, Room, Round, Pairing, SwipeResponse
from datetime import datetime, timezone
from matchmaking import assign_sides, generate_round_robin

print("Setting up live matchmaking test state in Room 1 (with 4 participants for multiple rounds)...")
with app.app_context():
    try:
        # Reset matching state for Room 1
        room = Room.query.get(1)
        if not room:
            room = Room(id=1, room_number="Room 1", capacity=10)
            db.session.add(room)
            db.session.flush()

        room.current_round_id = None
        db.session.commit()

        # Delete existing swipe responses, pairings, and rounds in correct dependency order
        rounds = Round.query.filter_by(room_id=1).all()
        round_ids = [r.id for r in rounds]
        
        if round_ids:
            pairings = Pairing.query.filter(Pairing.round_id.in_(round_ids)).all()
            pairing_ids = [p.id for p in pairings]
            
            if pairing_ids:
                # Delete swipe responses first
                SwipeResponse.query.filter(SwipeResponse.pairing_id.in_(pairing_ids)).delete(synchronize_session=False)
            
            # Delete pairings
            Pairing.query.filter(Pairing.round_id.in_(round_ids)).delete(synchronize_session=False)
            
        # Delete rounds
        Round.query.filter_by(room_id=1).delete(synchronize_session=False)
        db.session.commit()

        # Enforce 4 test users exist and are checked into Room 1
        from werkzeug.security import generate_password_hash
        pw_hash = generate_password_hash("password")
        
        emails = [
            ("aarav.sharma@example1.comtest", "Aaravtest Sharma1"),
            ("aarav.sharma@example2.comtest", "Aaravtest Sharma2"),
            ("aarav.sharma@example3.comtest", "Aaravtest Sharma3"),
            ("aarav.sharma@example4.comtest", "Aaravtest Sharma4")
        ]

        participants = []
        for idx, (email, name) in enumerate(emails, start=1):
            p = Participant.query.filter_by(email=email).first()
            if not p:
                p = Participant(name=name, email=email, phone=f"123456789{idx}", password_hash=pw_hash, room_id=1)
                db.session.add(p)
                db.session.flush()
            p.room_id = 1
            p.password_hash = pw_hash # Sync all passwords to 'password'
            if idx == 1:
                p.is_admin = True
            participants.append(p)
        db.session.commit()

        # Reload participant objects
        participant_ids = [p.id for p in participants]
        
        # Generate pairings
        side_a, side_b = assign_sides(participant_ids)
        schedule = generate_round_robin(side_a, side_b)

        first_round_obj = None
        for round_number, pairings in enumerate(schedule, start=1):
            round_obj = Round(
                room_id=1,
                round_number=round_number,
                started_at=datetime.now(timezone.utc).replace(tzinfo=None) if round_number == 1 else None
            )
            db.session.add(round_obj)
            db.session.flush()

            if round_number == 1:
                first_round_obj = round_obj

            for a_id, b_id in pairings:
                db.session.add(Pairing(
                    round_id=round_obj.id,
                    participant_a_id=a_id,
                    participant_b_id=b_id
                ))

        room.current_round_id = first_round_obj.id
        db.session.commit()

        print("\n[SUCCESS] Matching test initialized with 4 participants!")
        for idx, p in enumerate(participants, start=1):
            print(f" - Participant {idx}: {p.name} ({p.email}) | Room: {p.room_id} | Admin: {p.is_admin}")
        print(f" - Generated {len(schedule)} total rounds (3 minutes active round + 15 seconds transition each)")
        print(f" - Timer for Round 1 started just now!")
        print("\nTest steps:")
        print(" 1. Log in as 'aarav.sharma@example1.comtest' with password 'password'")
        print(" 2. Go to 'Live Matching' tab -> watch the timer tick and opponent load.")
        print(" 3. Swipe Accept or Reject.")
        print(" 4. If you wait 3 minutes, it will automatically shift into a 15-second transition, then advance to Round 2 with a new opponent!")

    except Exception as e:
        print(f"\n[ERROR] {e}")
        db.session.rollback()
