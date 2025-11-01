import { Question, GeneratedQuestionResponse, APIResponse } from "@/types/question-generator"

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:5000"

export async function generateQuestions(files: File[], questions: Question[]): Promise<GeneratedQuestionResponse[]> {
  const formData = new FormData()
  
  // Add files
  files.forEach(file => {
    formData.append('pdfs', file)
  })

  // Add number of questions
  formData.append('numQuestions', questions.length.toString())

  // Add each question's data
  questions.forEach((q, i) => {
    formData.append(`difficulty_${i + 1}`, q.difficulty.toLowerCase())
    formData.append(`marks_${i + 1}`, q.marks)
    formData.append(`type_${i + 1}`, q.type.toLowerCase())
    formData.append(`question_${i + 1}`, q.question_text)
  })

  const response = await fetch(`${FLASK_API_URL}/submit_question`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to generate questions')
  }

  const data = await response.json()
  return data.generated_questions
}