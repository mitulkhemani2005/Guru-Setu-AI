from database import db

class User(db.Model):
    __bind_key__ = 'users_db'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100),nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)


class Schedule(db.Model):
    __bind_key__ = 'schedule_db'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    time = db.Column(db.DateTime, nullable=False)
    remind_before = db.Column(db.Integer, default=10)
    notified = db.Column(db.Boolean, default=False)
    email = db.Column(db.String(120), nullable=False)
