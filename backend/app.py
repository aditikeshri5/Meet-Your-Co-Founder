import os
from dotenv import load_dotenv

from flask import Flask
from flask_jwt_extended import JWTManager

from model import db
from registration_ep import registration
from login_ep import login
from dashboard import dashboard
from decision_ep import decision

load_dotenv()



app = Flask(__name__)




app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]

db.init_app(app)
JWTManager(app)

app.register_blueprint(registration, url_prefix="/api/auth")
app.register_blueprint(login, url_prefix="/api/auth")
app.register_blueprint(dashboard, url_prefix="/api")
app.register_blueprint(decision, url_prefix="/api")

# with app.app_context():
#     db.create_all()


if __name__ == "__main__":
    app.run(debug=True)