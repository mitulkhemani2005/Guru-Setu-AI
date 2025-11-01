from flask import jsonify, request, Blueprint
from database import db
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader
from google import genai
from google.genai import types
import chromadb
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
question_bp = Blueprint('question_bp', __name__, url_prefix="/")

# Ensure uploads folder exists
UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

Chroma_client = chromadb.Client()
client = genai.Client(api_key=gemini_api_key)
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


@question_bp.route('/submit_question', methods=["POST"])
def submit_question():
    try:
        pdf_files = request.files.getlist('pdfs')
        uploaded_pdf_names = []

        # Save PDFs
        for pdf in pdf_files:
            if pdf.filename != '':
                filename = secure_filename(pdf.filename)
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                pdf.save(file_path)
                uploaded_pdf_names.append(filename)

        form_data = request.form.to_dict()
        num_questions = int(request.form.get('numQuestions', 0))

        questions = []
        for i in range(1, num_questions + 1):
            q = {
                'difficulty': form_data.get(f'difficulty_{i}'),
                'marks': form_data.get(f'marks_{i}'),
                'type': form_data.get(f'type_{i}'),
                'question_text': form_data.get(f'question_{i}')
            }
            questions.append(q)

        return generate_question(uploaded_pdf_names, questions)

    except Exception as e:
        return jsonify({"error": str(e)}), 500



def generate_question(pdf_names, questions):
    try:
        collection = Chroma_client.get_or_create_collection(name='pdftext')

        # Insert PDF text into Chroma
        for pdf in pdf_names:
            reader = PdfReader(os.path.join(UPLOAD_FOLDER, pdf))
            page_no = 1
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    text = text.replace('\n', ' ')
                    embed = embedding_model.encode([text]).tolist()
                    collection.add(
                        ids=[f'{pdf}_page_{page_no}'],
                        documents=[text],
                        embeddings=embed
                    )
                    page_no += 1

        generated_questions = []

        # Generate questions
        for q in questions:
            q_diff = q.get('difficulty', 'medium')
            q_marks = q.get('marks', 1)
            q_type = q.get('type', 'short')
            q_text = q.get('question_text', '')

            rag = collection.query(
                query_texts=[q_text],
                n_results=1
            )

            try:
                context = rag['documents'][0][0]
            except:
                context = ""
            print(context)
            prompt = f"""
You are a professor. Create a question based on:

Difficulty: {q_diff}
Marks: {q_marks}
Type: {q_type}
Hint: {q_text}
Context: {context}

Rules:
- 1 mark → ~20 words, 2 marks → ~40 words
- Language complexity matches difficulty
- Output only the question text
"""

            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    thinking_config=types.ThinkingConfig(thinking_budget=0)
                )
            )

            question_generated = response.text.strip() if hasattr(response, "text") else ""

            generated_questions.append({
                "input": q,
                "generated_question": question_generated
            })

        return jsonify({"generated_questions": generated_questions}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
