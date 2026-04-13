<div align="center">

# 🎓 Guru Setu — AI-Powered Teaching Assistant

**Empowering Educators with Artificial Intelligence**

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask)](https://flask.palletsprojects.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google)](https://ai.google.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

[Features](#-features) · [Architecture](#-architecture) · [Quick Start](#-quick-start) · [API Reference](#-api-reference) · [Team](#-team)

</div>

---

## 📖 About

**Guru Setu** (_Bridge to the Teacher_) is an AI-powered platform that helps teachers automate time-consuming tasks — generating question papers, summarizing lecture recordings, scheduling reminders, and interacting via a multilingual voice assistant. Built during a hackathon, it combines Google Gemini's generative AI, Whisper speech recognition, and RAG (Retrieval-Augmented Generation) techniques into a single, intuitive dashboard.

---

## ✨ Features

### 📝 AI Question Paper Generator

- Upload PDF study materials as context.
- Define question parameters — **difficulty** (easy / medium / hard), **marks**, and **type** (short / long / MCQ).
- Uses **RAG pipeline** (ChromaDB + Sentence Transformers) to ground questions in uploaded content.
- AI generates exam-ready questions via **Google Gemini 2.0 Flash**.
- Print-friendly output with one-click printing.

### 📄 Class Summary Maker

- Input a **YouTube URL** or upload a **video file** of a lecture.
- Extracts audio using **FFmpeg**, transcribes with **OpenAI Whisper**.
- Summarizes the transcript via **Google Gemini 2.5 Flash**.
- Generates a downloadable **PDF summary** (via ReportLab).
- Optionally uploads the PDF to **Google Classroom** as an announcement with a single click.

### ⏰ Scheduler & Email Reminders

- Create scheduled reminders with a title, date/time, and reminder offset (minutes before).
- Background scheduler (**APScheduler**) checks every 60 seconds for upcoming events.
- Sends **email reminders** via Gmail SMTP (Flask-Mail) before the scheduled time.
- Per-user schedule management with email-based filtering.

### 🎙️ Multilingual Voice Assistant

- Record voice via browser microphone.
- **Speech-to-Text** powered by OpenAI Whisper (small model) with automatic language detection.
- Conversational AI responses via **Google Gemini 2.5 Flash** with multi-turn chat memory.
- **Text-to-Speech** response playback via **gTTS** in the detected input language.
- Full-duplex chat interface with message history.

### 👤 User Management

- Registration and login with username, email, and password.
- Full CRUD operations (create, read, update, delete) on user accounts.
- Client-side session via localStorage.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)             │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐  │
│  │ Question  │ │ Summary  │ │Scheduler│ │  Voice   │  │
│  │ Generator │ │  Maker   │ │& Remind │ │Assistant │  │
│  └─────┬────┘ └─────┬────┘ └────┬───┘ └─────┬────┘  │
│        │            │           │            │       │
│        └────────────┴─────┬─────┴────────────┘       │
│                           │ HTTP / REST              │
└───────────────────────────┼──────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────┐
│                    Backend (Flask)                    │
│                           │                          │
│  ┌────────────────────────┴───────────────────────┐  │
│  │              Flask App (app.py)                 │  │
│  │  ┌──────┐ ┌──────────┐ ┌─────────┐ ┌────────┐ │  │
│  │  │ User │ │ Question │ │Classnotes│ │Scheduler│ │  │
│  │  │Routes│ │Generator │ │  Routes  │ │ Routes  │ │  │
│  │  └──┬───┘ └────┬─────┘ └────┬────┘ └───┬────┘ │  │
│  │     │          │            │           │      │  │
│  └─────┼──────────┼────────────┼───────────┼──────┘  │
│        │          │            │           │         │
│  ┌─────▼───┐ ┌────▼────┐ ┌────▼────┐ ┌───▼──────┐  │
│  │SQLite DB│ │ChromaDB │ │ Whisper │ │APScheduler│  │
│  │(Users & │ │  + RAG  │ │ + gTTS  │ │+ FlaskMail│  │
│  │Schedule)│ │Pipeline │ │+ FFmpeg │ │  (SMTP)   │  │
│  └─────────┘ └────┬────┘ └────┬────┘ └──────────┘  │
│                   │           │                      │
│              ┌────▼───────────▼────┐                 │
│              │  Google Gemini API  │                 │
│              │  (2.0 Flash / 2.5)  │                 │
│              └──────────┬──────────┘                 │
│                         │                            │
│              ┌──────────▼──────────┐                 │
│              │ Google Classroom API│                 │
│              │   + Drive API       │                 │
│              └─────────────────────┘                 │
└──────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer            | Technology                                                               |
| ---------------- | ------------------------------------------------------------------------ |
| **Frontend**     | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI, Lucide Icons |
| **Backend**      | Python 3.10+, Flask, Flask-SQLAlchemy, Flask-CORS, Flask-Mail            |
| **AI / ML**      | Google Gemini (2.0 Flash & 2.5 Flash), OpenAI Whisper (small & tiny)     |
| **RAG**          | ChromaDB (in-memory vector store), Sentence Transformers (MiniLM-L6-v2)  |
| **TTS**          | gTTS (Google Text-to-Speech)                                             |
| **Media**        | FFmpeg (audio extraction), yt-dlp (YouTube download)                     |
| **Database**     | SQLite (users + schedules via dual bind keys)                            |
| **Scheduling**   | APScheduler (BackgroundScheduler)                                        |
| **Integrations** | Google Classroom API, Google Drive API, Gmail SMTP                       |
| **PDF**          | ReportLab (generation), pypdf (parsing)                                  |

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+ & npm
- **FFmpeg** installed and available in PATH
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))
- **Google Cloud OAuth credentials** (for Classroom integration)

### 1. Clone the Repository

```bash
git clone https://github.com/mitulkhemani2005/Guru-Setu-AI.git
cd Guru-Setu-AI
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install flask flask-sqlalchemy flask-cors flask-mail python-dotenv
pip install google-generativeai google-genai
pip install openai-whisper gtts
pip install chromadb sentence-transformers pypdf
pip install apscheduler reportlab
pip install yt-dlp ffmpeg-python
pip install google-auth google-auth-oauthlib google-api-python-client
pip install pywebpush werkzeug
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password
```

> **Note:** For `MAIL_PASSWORD`, use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your regular password.

### 4. Google Classroom Setup (Optional)

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Google Classroom API** and **Google Drive API**.
3. Create OAuth 2.0 credentials (Web application type).
4. Download and save as `backend/credentials.json`.
5. On first use, a browser window will open for OAuth consent. The token is saved to `token.json`.

### 5. Start the Backend

```bash
cd backend
python app.py
```

The Flask server runs at `http://localhost:5000`.

### 6. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The Next.js app runs at `http://localhost:3000`.

### 7. Open in Browser

Navigate to **http://localhost:3000** — register/login and start using the dashboard!

---

## 📡 API Reference

### User Management

| Method   | Endpoint      | Description      |
| -------- | ------------- | ---------------- |
| `GET`    | `/users`      | List all users   |
| `GET`    | `/users/<id>` | Get user by ID   |
| `POST`   | `/user`       | Create new user  |
| `PUT`    | `/users/<id>` | Update user name |
| `DELETE` | `/users/<id>` | Delete user      |

**Create User Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

---

### Question Generator

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| `POST` | `/submit_question` | Generate questions from PDFs |

**Form Data:**
| Field | Type | Description |
|-------------------|--------|------------------------------------------|
| `pdfs` | File[] | PDF files for content context |
| `numQuestions` | int | Number of questions to generate |
| `difficulty_N` | string | `easy`, `medium`, or `hard` |
| `marks_N` | string | Marks for question N |
| `type_N` | string | `short`, `long`, or `mcq` |
| `question_N` | string | Hint/topic for question N |

---

### Class Summary Maker

| Method | Endpoint                        | Description                         |
| ------ | ------------------------------- | ----------------------------------- |
| `POST` | `/classnotes/sendfile`          | Generate summary from video/YouTube |
| `GET`  | `/classnotes/download/<job_id>` | Download generated PDF summary      |

**Form Data:**
| Field | Type | Description |
|-----------------------|--------|--------------------------------------------|
| `youtube_url` | string | YouTube video URL |
| `video_file` | File | Direct video file upload |
| `upload_to_classroom` | string | Set to `"true"` to post to Google Classroom|

---

### Scheduler & Reminders

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| `POST` | `/scheduler/add`     | Create a new schedule/reminder |
| `GET`  | `/scheduler/<email>` | Get all schedules for a user   |

**Add Schedule Body:**

```json
{
  "title": "Math Class",
  "time": "2026-04-15T10:00:00",
  "email": "teacher@example.com",
  "remind_before": 15
}
```

---

### Voice Assistant

| Method | Endpoint            | Description                         |
| ------ | ------------------- | ----------------------------------- |
| `POST` | `/voice_upload`     | Upload audio, get AI response + TTS |
| `GET`  | `/voice/<filename>` | Serve generated audio response file |

**Form Data:**
| Field | Type | Description |
|---------|------|--------------------------------|
| `audio` | File | Audio recording (e.g., WebM) |

**Response:**

```json
{
  "teacher_text": "What is photosynthesis?",
  "assistant_text": "Photosynthesis is the process...",
  "tts_audio": "/voice/assistant_response.mp3"
}
```

---

## 📂 Project Structure

```
GURU SETU/
├── backend/
│   ├── app.py                    # Flask application entry point
│   ├── database.py               # SQLAlchemy instance
│   ├── models.py                 # User & Schedule DB models
│   ├── credentials.json          # Google OAuth credentials
│   ├── token.json                # Cached OAuth token
│   ├── .env                      # Environment variables
│   ├── routes/
│   │   ├── user.py               # User CRUD endpoints
│   │   ├── question_Generator.py # RAG-based question generation
│   │   ├── classnotes.py         # Video → Summary → Classroom
│   │   ├── scheduler.py          # Schedule + email reminders
│   │   ├── voice_assist.py       # Voice AI assistant
│   │   ├── serviceworker.py      # Push notification service
│   │   └── serviceworker.js      # Browser push handler
│   ├── uploads/                  # Temporary file storage
│   └── summary/                  # Generated PDF summaries
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout with metadata
│   │   ├── globals.css           # Global styles & CSS variables
│   │   └── dashboard/
│   │       ├── page.tsx              # Feature selection dashboard
│   │       ├── question-generator/   # Question paper generator UI
│   │       ├── summary-maker/        # Summary creation UI
│   │       ├── scheduler/            # Scheduler & reminders UI
│   │       └── voice-assistant/      # Voice chat interface
│   ├── components/
│   │   ├── navbar.tsx            # Landing page navigation
│   │   ├── footer.tsx            # Landing page footer
│   │   ├── dynamic-bubbles.tsx   # Animated background effects
│   │   ├── sections/             # Landing page sections
│   │   │   ├── hero-section.tsx      # Auth modal + hero
│   │   │   ├── about-section.tsx     # About the platform
│   │   │   ├── features-section.tsx  # Feature highlights
│   │   │   ├── developers-section.tsx# Team showcase
│   │   │   └── contact-section.tsx   # Contact form
│   │   ├── dashboard/            # Dashboard-specific components
│   │   ├── question-generator/   # Question generator components
│   │   ├── summary-maker/        # Summary maker components
│   │   ├── scheduler/            # Scheduler components
│   │   └── ui/                   # Reusable UI library (57 components)
│   ├── lib/                      # Utility functions & API helpers
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript type definitions
│   └── public/                   # Static assets (logos, team photos)
│
└── README.md                     # This file
```

---

## 🔧 Configuration

### Database

The backend uses **dual SQLite databases** via Flask-SQLAlchemy bind keys:

| Bind Key      | Database File | Tables   |
| ------------- | ------------- | -------- |
| `users_db`    | `users.db`    | User     |
| `schedule_db` | `schedule.db` | Schedule |

Databases are auto-created on first run inside `backend/instance/`.

### Email (Gmail SMTP)

| Config Key     | Value            |
| -------------- | ---------------- |
| `MAIL_SERVER`  | `smtp.gmail.com` |
| `MAIL_PORT`    | `587`            |
| `MAIL_USE_TLS` | `True`           |

Requires a Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for authentication.

---

## 👥 Team

<table>
  <tr>
    <td align="center"><b>Nitya Jain</b><br/>Machine Learning Developer<br/><a href="https://www.linkedin.com/in/nitya-jain-88ab56279/">LinkedIn</a></td>
    <td align="center"><b>Mitul Khemani</b><br/>Machine Learning Developer<br/><a href="https://www.linkedin.com/in/mitul-khemani/">LinkedIn</a></td>
    <td align="center"><b>Naman Jain</b><br/>Backend Developer<br/><a href="https://www.linkedin.com/in/naman-jain-404512257/">LinkedIn</a></td>
    <td align="center"><b>Shashwat Gupta</b><br/>Frontend Developer<br/><a href="https://www.linkedin.com/in/shashwat-gupta-8b582727b/">LinkedIn</a></td>
  </tr>
</table>

---

## 📄 License

This project was built as part of a hackathon. Please contact the team for licensing and usage inquiries.

---

<div align="center">

**Built By Team Alpha Hacks**

_Bridging the gap between teachers and technology._

</div>
