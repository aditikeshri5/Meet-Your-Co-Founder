# seed_categories.py
from app import app
from model import db, Category

names = ["Technology", "Finance", "Healthcare", "Real Estate", "Retail",
         "Education", "Climate", "Transportation", "Media", "Legal"]

with app.app_context():
    for n in names:
        db.session.add(Category(name=n))
    db.session.commit()