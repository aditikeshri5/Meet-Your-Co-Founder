from app import app, db
from model import Participant
from werkzeug.security import generate_password_hash

print("Resetting passwords for test users...")
with app.app_context():
    try:
        p1 = Participant.query.filter_by(email="aarav.sharma@example1.comtest").first()
        p2 = Participant.query.filter_by(email="aarav.sharma@example2.comtest").first()

        pw_hash = generate_password_hash("password")

        if p1:
            p1.password_hash = pw_hash
            print("Reset password for Aaravtest Sharma1")
        if p2:
            p2.password_hash = pw_hash
            print("Reset password for Aaravtest Sharma2")

        db.session.commit()
        print("\n[SUCCESS] Passwords reset successfully! You can now log in using 'password'.")
    except Exception as e:
        print(f"\n[ERROR] {e}")
