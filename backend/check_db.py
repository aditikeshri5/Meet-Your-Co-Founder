from app import app, db
from model import Participant, Room, Category, Idea, Round, Pairing, SwipeResponse

print("Connecting to Supabase...")
with app.app_context():
    try:
        # Participants
        participants = Participant.query.order_by(Participant.created_at.desc()).all()
        print(f"\n[PARTICIPANTS] Total: {len(participants)}")
        for p in participants[:5]:
            admin_tag = " [ADMIN]" if p.is_admin else ""
            room_tag = f" | Room: {p.room_id}" if p.room_id else " | No room"
            print(f"  - {p.name} ({p.email}){admin_tag}{room_tag}")
        if len(participants) > 5:
            print(f"  ... and {len(participants) - 5} more")

        # Rooms
        rooms = Room.query.all()
        print(f"\n[ROOMS] Total: {len(rooms)}")
        for r in rooms:
            round_tag = f" | Active Round ID: {r.current_round_id}" if r.current_round_id else " | No active event"
            print(f"  - {r.room_number} (capacity: {r.capacity}){round_tag}")

        # Categories
        categories = Category.query.order_by(Category.id).all()
        print(f"\n[CATEGORIES] Total: {len(categories)}")
        for c in categories:
            print(f"  {c.id}. {c.name}")

        # Ideas
        ideas = Idea.query.all()
        print(f"\n[IDEAS] Total: {len(ideas)}")
        for i in ideas[:5]:
            p = db.session.get(Participant, i.participant_id)
            c = db.session.get(Category, i.category_id)
            print(f"  - \"{i.title}\" by {p.name if p else '?'} [{c.name if c else '?'}]")

        # Rounds
        rounds_list = Round.query.all()
        print(f"\n[ROUNDS] Total: {len(rounds_list)}")

        # Pairings
        pairings = Pairing.query.all()
        print(f"[PAIRINGS] Total: {len(pairings)}")

        # Swipe Responses
        swipes = SwipeResponse.query.all()
        print(f"[SWIPE RESPONSES] Total: {len(swipes)}")
        accepts = sum(1 for s in swipes if s.decision == 'accept')
        rejects = sum(1 for s in swipes if s.decision == 'reject')
        if swipes:
            print(f"  Accepts: {accepts} | Rejects: {rejects}")

        print("\n[OK] All tables accessible. Database connection verified.")

    except Exception as e:
        print(f"\n[ERROR] {e}")
