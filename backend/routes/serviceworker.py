from flask import Flask, request, jsonify
from apscheduler.schedulers.background import BackgroundScheduler
from pywebpush import webpush, WebPushException
import json, time

app = Flask(__name__)
scheduler = BackgroundScheduler()
scheduler.start()

VAPID_KEYS = {
    "publicKey": "YOUR_PUBLIC_KEY",
    "privateKey": "YOUR_PRIVATE_KEY"
}

def send_push(subscription, title, message):
    try:
        webpush(
            subscription_info=subscription,
            data=json.dumps({"title": title, "body": message}),
            vapid_private_key=VAPID_KEYS["privateKey"],
            vapid_claims={"sub": "mailto:admin@example.com"}
        )
    except WebPushException as e:
        print("Push failed:", e)

@app.post("/schedule")
def schedule_reminder():
    data = request.json
    subscription = data["subscription"]
    reminder_time = data["time"]  # epoch timestamp in ms
    title = data["title"]
    body = data["body"]

    delay = (reminder_time / 1000) - time.time()

    scheduler.add_job(send_push, "date", run_date=time.time() + delay,
                      args=[subscription, title, body])

    return jsonify({"message": "Reminder scheduled!"})

if __name__ == "__main__":
    app.run(debug=True)
