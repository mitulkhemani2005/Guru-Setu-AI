from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from routes.user import user_bp
from routes.voice_assist import VOICE_BP
from routes.question_Generator import question_bp
from routes.scheduler import scheduler_bp,init_scheduler
from database import db
import os
from dotenv import load_dotenv
from routes.classnotes import classnotes_bp
from flask_cors import CORS
load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")


app = Flask(__name__)
CORS(app) 

mail = Mail()  

# --- Multiple  Configs ---
app.config['SQLALCHEMY_BINDS'] = {
    'users_db': 'sqlite:///users.db',
    'schedule_db': 'sqlite:///schedule.db'
}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587   
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']


db.init_app(app)
mail.init_app(app) 

app.register_blueprint(user_bp)
app.register_blueprint(question_bp)
app.register_blueprint(VOICE_BP)
app.register_blueprint(scheduler_bp)
app.register_blueprint(classnotes_bp)

if __name__ == "__main__":
    with app.app_context():
        db.create_all(bind_key=['users_db','schedule_db'])
        init_scheduler(app)
    app.run(debug=True)
