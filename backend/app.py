import os
from dotenv import load_dotenv

from flask import Flask
from flask_jwt_extended import JWTManager

from model import db
from registration_ep import registration
from login_ep import login
from dashboard import dashboard
from swipe_response import swipes
from rooms_ep import rooms
from flask_cors import CORS
from ideas_ep import ideas
from start_event_ep import events
from current_round_ep import rounds





load_dotenv()



app = Flask(__name__)
allowed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_URL", "https://meet-your-co-founder-one.vercel.app").split(",")
    if origin.strip()
]
CORS(app, origins=allowed_origins)




app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]

db.init_app(app)
JWTManager(app)

app.register_blueprint(registration, url_prefix="/api/auth")
app.register_blueprint(login, url_prefix="/api/auth")
app.register_blueprint(dashboard, url_prefix="/api")
app.register_blueprint(swipes, url_prefix="/api")
app.register_blueprint(rooms, url_prefix="/api")
app.register_blueprint(ideas, url_prefix="/api")
app.register_blueprint(events, url_prefix="/api")
app.register_blueprint(rounds, url_prefix="/api")


@app.get("/health")
def health_check():
    return {"status": "ok"}, 200

# with app.app_context():
#     db.create_all()


if __name__ == "__main__":
    app.run(debug=True)
