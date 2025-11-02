from flask import Blueprint, request, jsonify, send_from_directory
import os
from dotenv import load_dotenv
import whisper
import google.generativeai as genai
from gtts import gTTS
from werkzeug.utils import secure_filename

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")

VOICE_BP = Blueprint("voice_bp", __name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Whisper STT Model
whisper_model = whisper.load_model("small")

# Gemini Config (Replace with env variable in prod)
genai.configure(api_key=gemini_api_key)

system_prompt = (
    "You are GURU SETU, a virtual AI assistant for teachers. "
    "Respond politely, briefly, and helpfully. Use prior conversation turns for context. "
    "Prefer concise, actionable answers. If unclear, ask a short clarifying question. "
    "You need to respond in same language in the language you get input"
    "dont give *, heavy punctuation, emoji, any symbols."    
)

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=system_prompt
)

chat = model.start_chat(history=[])

# ------------------ ROUTES ------------------

@VOICE_BP.route("/voice_upload", methods=["POST"])
def process_audio():
    """Receive audio, transcribe, generate response, produce TTS"""

    print("FILES:", request.files)
    print("FORM:", request.form)
    print("HEADERS:", request.headers)

    audio_file = request.files.get("audio")

    if not audio_file:
        print("no a proper audio file")
        return jsonify({"error": "No audio file sent"}), 400
    try:
        os.remove('./uploads/assistant_response.mp3')
        print('file removed')
    except:
        print('file not removed')
    filename = secure_filename(audio_file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(file_path)

    
    stt = whisper_model.transcribe(file_path)
    teacher_text = stt["text"]
    teacher_text = teacher_text.strip() if teacher_text else ""
    
    print("teacher text - ", teacher_text)

    if not teacher_text:
        return jsonify({"error": "No speech detected. Please speak again."}),400
    lang:str = stt["language"]

    ai = chat.send_message(teacher_text)
    assistant_text = ai.text or ""
    
    print(lang)
    
    tts_path = os.path.join(UPLOAD_FOLDER, "assistant_response.mp3")
    gTTS(text=assistant_text, lang=lang).save(tts_path)

    return jsonify({
        "teacher_text": teacher_text,
        "assistant_text": assistant_text,
        "tts_audio": "/voice/assistant_response.mp3"
    }),200


@VOICE_BP.route("/voice/<path:file>")
def serve_audio(file):
    """Serve generated voice file"""
    return send_from_directory(UPLOAD_FOLDER, file)
