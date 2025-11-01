// Types that match the Flask backend

export interface Question {
  difficulty: 'easy' | 'medium' | 'hard'
  marks: string
  type: 'short' | 'long' | 'mcq'
  question_text: string
}

export interface GeneratedQuestionResponse {
  input: Question
  generated_question: string
}

export interface APIResponse {
  generated_questions: GeneratedQuestionResponse[]
}