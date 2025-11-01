from flask import Blueprint, render_template, request, jsonify, send_file
import shutil, datetime, traceback
from werkzeug.utils import secure_filename
from yt_dlp import YoutubeDL
import ffmpeg
from google import genai
import whisper
import os
import dotenv
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError

dotenv.load_dotenv()
model = whisper.load_model('tiny')

def audio_to_text (audio_path:str):
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    result = model.transcribe(audio_path)
    return result['text']


client = genai.Client(api_key =os.getenv("GEMINI_API_KEY")) 

def llmmodel(content: str):
    resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Give summary for this class teacher thought transctipt and I request not to give symbols and give response in simple english as I am going to directly convert your output to pdf the content of class is: {content}"
    )
    return resp.text


def save_text_as_pdf(text, filepath="../summary/class_summary.pdf"):

    c = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "Summary of class")

    c.setFont("Helvetica", 12)
    margin = 50
    max_width = width - 2 * margin
    wrapped_lines = simpleSplit(text, "Helvetica", 12, max_width)

    text_object = c.beginText(margin, height - 80)
    line_height = 14 

    for line in wrapped_lines:
        text_object.textLine(line)

    c.drawText(text_object)

    c.save()




classnotes_bp = Blueprint("classnotes_bp", __name__, url_prefix="/classnotes")

upload_folder = "uploads"
SCOPES = [
    'https://www.googleapis.com/auth/classroom.announcements',
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/drive.file'
]


def run_oauth_flow(creds_path, oauth_port=9000):
    flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
    creds = flow.run_local_server(port=oauth_port, access_type='offline', prompt='consent')
    return creds


def get_credentials():
    creds = None
    token_path = 'token.json'
    creds_path = 'credentials.json'

    if not os.path.exists(creds_path):
        raise FileNotFoundError("credentials.json missing. Download from Google Cloud Console.")

    if os.path.exists(token_path):
        try:
            creds = Credentials.from_authorized_user_file(token_path, SCOPES)
        except:
            creds = None

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            creds = run_oauth_flow(creds_path)

        with open(token_path, 'w') as f:
            f.write(creds.to_json())

    return creds


def get_or_save_course_id(service):
    course_file = "course_id.txt"
    if os.path.exists(course_file):
        return open(course_file).read().strip()

    courses = service.courses().list().execute().get('courses', [])
    if not courses:
        raise RuntimeError("No Google Classroom courses found.")

    cid = courses[0]['id']
    open(course_file, "w").write(cid)
    return cid


def upload_to_classroom(pdf_path):
    creds = get_credentials()
    drive = build('drive', 'v3', credentials=creds)
    classroom = build('classroom', 'v1', credentials=creds)

    course_id = get_or_save_course_id(classroom)

    media = MediaFileUpload(pdf_path, mimetype='application/pdf')
    uploaded = drive.files().create(
        body={'name': os.path.basename(pdf_path)}, media_body=media,
        fields='id'
    ).execute()

    file_id = uploaded.get('id')
    today = datetime.date.today().strftime("%d %b %Y")

    ann_body = {
        "text": f"PFA Class Notes ({today})",
        "materials": [{
            "driveFile":{
                    "driveFile": {"id": file_id},
                    "shareMode":"VIEW"
                }
            }],
        "state": "PUBLISHED"
    }

    classroom.courses().announcements().create(
        courseId=course_id, body=ann_body
    ).execute()

    return "Posted Successfully"


# @classnotes_bp.route("/")
# def home():
#     shutil.rmtree('uploads', ignore_errors=True)
#     shutil.rmtree('summary', ignore_errors=True)
#     os.makedirs("uploads", exist_ok=True)
#     os.makedirs("summary", exist_ok=True)
#     return render_template("indexdownload.html")


@classnotes_bp.route("/sendfile", methods=["POST"])
def generate_summary():
    shutil.rmtree('uploads', ignore_errors=True)
    shutil.rmtree('summary', ignore_errors=True)
    os.makedirs('uploads', exist_ok=True)
    os.makedirs('summary', exist_ok=True)

    youtube_link = request.form.get("youtube_url")
    video_file = request.files.get("video_file")
    classroom_upload = request.form.get("upload_to_classroom")

    video_path = "uploads/video.mp4"
    audio_path = "uploads/audio.mp3"
    summary_path = "summary/class_summary.pdf"

    try:
        if video_file:
            video_file.save(video_path)
        elif youtube_link:
            with YoutubeDL({'format': 'best', 'outtmpl': video_path}) as ydl:
                ydl.download([youtube_link])
        else:
            return jsonify({"error": "No video source"}), 400

        ffmpeg.input(video_path).output(audio_path).run(quiet=True, overwrite_output=True)
        transcript:str = audio_to_text(audio_path)
        summary = llmmodel(transcript)
        save_text_as_pdf(summary, summary_path)

        classroom_link = None
        if classroom_upload:
            classroom_link = upload_to_classroom(summary_path)

        return jsonify({"status": "success","job_id": "completed", "classroom_link": classroom_link}),200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@classnotes_bp.route("/download/<job_id>")
def download_file(job_id):
    return send_file("summary/class_summary.pdf", as_attachment=True)

