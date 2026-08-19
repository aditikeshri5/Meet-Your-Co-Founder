from app import app, db
from model import Participant, Room

print("Connecting to Supabase...")
with app.app_context():
    try:
        participants = Participant.query.all()
        print(f"\n[SUCCESS] Connection Successful! Found {len(participants)} participants in Supabase.")
        for p in participants:
            print(f" - {p.name} ({p.email})")
            
        # Check Rooms
        rooms = Room.query.all()
        print(f"\nFound {len(rooms)} rooms in Supabase.")
    except Exception as e:
        print(f"\n[ERROR] Error connecting: {e}")
