from flask import Blueprint, request, jsonify
from flask_mail import Message
from datetime import datetime, timedelta, timezone
from apscheduler.schedulers.background import BackgroundScheduler
from models import db, Schedule
from flask import current_app

scheduler_bp = Blueprint("scheduler_bp", __name__, url_prefix="/scheduler")

scheduler = BackgroundScheduler()
flask_app = None

def init_scheduler(app):
    global flask_app
    flask_app = app
    scheduler.add_job(check_schedules, "interval", seconds=60)
    scheduler.start()

def check_schedules():
    with flask_app.app_context():
        now = datetime.now(timezone.utc)

        emails = db.session.query(Schedule.email).distinct().all()

        for (email,) in emails:
            tasks = Schedule.query.filter_by(email=email, notified=False).all()

            for task in tasks:
                schedule_time = task.time
                if schedule_time.tzinfo is None:
                    schedule_time = schedule_time.replace(tzinfo=timezone.utc)

                remind_time = schedule_time - timedelta(minutes=task.remind_before)

                if now >= remind_time:
                    try:
                        mail = current_app.extensions["mail"]
                        msg = Message(
                            subject=f"Reminder: {task.title}",
                            recipients=[task.email],
                            body=f"Reminder: {task.title}\nTime: {task.time} UTC"
                        )
                        mail.send(msg)
                        print(f"Email sent to {task.email}")

                    except Exception as e:
                        print(f"Mail error: {e}")

                    task.notified = True
                    db.session.commit()



@scheduler_bp.route("/add", methods=["POST"])
def add_schedule():
    data = request.get_json()

    dt = datetime.fromisoformat(data["time"]).replace(tzinfo=timezone.utc)
    task = Schedule(
        title=data["title"],
        time=dt,
        email=data["email"],
        remind_before=data.get("remind_before", 10)
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Reminder Scheduled"}), 201


@scheduler_bp.route("/<email>", methods=["GET"])
def get_user_schedule(email):
    tasks = Schedule.query.filter_by(email=email).all()
    return jsonify([{
        "id": t.id,
        "title": t.title,
        "time": t.time.isoformat(),
        "email": t.email,
        "remind_before": t.remind_before,
        "notified": t.notified
    } for t in tasks])


