"use client"

import { useState } from "react"
import DashboardNavbar from "@/components/dashboard/dashboard-navbar"
import FileUploadSection from "@/components/question-generator/file-upload-section"
import QuestionFormBuilder, { Question } from "@/components/question-generator/question-form-builder"
import GeneratedQuestionPaper from "@/components/question-generator/generated-question-paper"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface GeneratedQuestion {
  input: Question
  generated_question: string
}

export default function QuestionGeneratorPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [questions, setQuestions] = useState<Question[]>([
    { difficulty: "medium", marks: "2", type: "short", question_text: "" }
  ])
  const [generatedPaper, setGeneratedPaper] = useState<GeneratedQuestion[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddQuestion = () => {
    setQuestions([...questions, { difficulty: "medium", marks: "5", type: "short", question_text: "" }])
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleQuestionChange = (index: number, field: keyof Question, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setQuestions(updatedQuestions)
  }

  const handleGenerateQuestions = async () => {
    try {
      setIsLoading(true)

      const formData = new FormData()
      // append files with key 'pdfs' multiple times (Flask getlist('pdfs'))
      uploadedFiles.forEach((file) => {
        formData.append("pdfs", file, file.name)
      })

      formData.append("numQuestions", String(questions.length))

      // Append each question with names like difficulty_1, marks_1, type_1, question_1
      questions.forEach((q, idx) => {
        const i = idx + 1
        formData.append(`difficulty_${i}`, q.difficulty)
        formData.append(`marks_${i}`, q.marks)
        formData.append(`type_${i}`, q.type)
        formData.append(`question_${i}`, q.question_text || "")
      })

      const res = await fetch("http://localhost:5000/submit_question", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(body.error || `Request failed with status ${res.status}`)
      }

      const data = await res.json()
      // backend returns { generated_questions: [...] }
      const generated = data.generated_questions || data.generatedQuestions || []
      setGeneratedPaper(generated)
      toast.success("Questions generated successfully!")
    } catch (error: any) {
      console.error("Error generating questions:", error)
      toast.error("Failed to generate questions. " + (error?.message || ""))
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (generatedPaper) {
    const mappedQuestions = generatedPaper.map(q => ({
      difficulty: q.input.difficulty,
      marks: String(q.input.marks),
      type: q.input.type,
      question_text: q.generated_question
    }))

    return (
      <main className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="pt-20 px-4 md:px-8 pb-8 no-print">
          <GeneratedQuestionPaper
            questions={mappedQuestions}
            onPrint={handlePrint}
            onEdit={() => setGeneratedPaper(null)}
          />
        </div>
        <div className="hidden print:block">
          <GeneratedQuestionPaper
            questions={mappedQuestions}
            onPrint={handlePrint}
            onEdit={() => setGeneratedPaper(null)}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardNavbar />
      <div className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Question Paper Generator
            </h1>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Create customized question papers instantly by uploading your study material and defining
              question parameters.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* File Upload */}
            <FileUploadSection uploadedFiles={uploadedFiles} onFilesChange={setUploadedFiles} />

            {/* Question Form */}
            <QuestionFormBuilder
              questions={questions}
              onAddQuestion={handleAddQuestion}
              onRemoveQuestion={handleRemoveQuestion}
              onQuestionChange={handleQuestionChange}
            />

            {/* Generate Button */}
            <button
              onClick={handleGenerateQuestions}
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold
              hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating Questions..." : "Generate Question Paper"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
