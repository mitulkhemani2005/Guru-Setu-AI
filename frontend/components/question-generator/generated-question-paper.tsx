"use client"

import { Button } from "@/components/ui/button"
import { Printer, Edit3 } from "lucide-react"
import React from "react"

interface Question {
  difficulty: string
  marks: string
  type: string
  question_text: string
}

interface GeneratedQuestionPaperProps {
  questions: Question[]
  onPrint: () => void
  onEdit: () => void
}

export default function GeneratedQuestionPaper({ questions, onPrint, onEdit }: GeneratedQuestionPaperProps) {
  const totalMarks = questions.reduce((sum, q) => sum + Number.parseInt(q.marks || "0"), 0)

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap no-print">
        <Button onClick={onPrint} className="flex items-center space-x-2">
          <Printer size={18} />
          <span>Print Paper</span>
        </Button>
        <Button onClick={onEdit} variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Edit3 size={18} />
          <span>Edit Questions</span>
        </Button>
      </div>

      {/* Printable Paper */}
      <div id="print-area" className="bg-white text-black p-12 space-y-8" style={{ pageBreakAfter: "always" }}>
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-6">
          <h1 className="text-4xl font-bold mb-2">Question Paper</h1>
          <p className="text-gray-600">
            Date: {new Date().toLocaleDateString()} | Total Marks: {totalMarks}
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Instructions:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Read each question carefully before attempting.</li>
            <li>Write your answers clearly and legibly.</li>
            <li>The marks for each question are indicated in brackets.</li>
            <li>Answer all questions</li>
            <li>Write clearly and legibly</li>
            <li>Marks are indicated for each question</li>
            <li>Attempt questions in the order they appear</li>
          </ul>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {questions.map((question, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg inline-flex items-center gap-2">
                    Q{idx + 1}. 
                    <span className="text-sm font-normal text-gray-600">
                      ({question.type} • {question.difficulty})
                    </span>
                  </h3>
                  <p className="text-gray-800 leading-relaxed">{question.question_text}</p>
                </div>
                <span className="font-semibold text-lg">[{question.marks} marks]</span>
              </div>
              <div className="h-24 border-b border-gray-300" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center border-t-2 border-black pt-6 mt-8">
          <p className="text-sm text-gray-600">End of Question Paper</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 100% !important;
            height: 100% !important;
          }
          * {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          /* Remove all parent constraints and ensure full page printing */
          #print-area {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0.5in !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            break-inside: avoid;
            position: static !important;
          }
          /* Hide all non-print elements */
          nav, header, footer, .navbar, .dashboard-navbar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
