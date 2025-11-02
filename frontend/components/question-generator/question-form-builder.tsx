"use client"

import React from 'react'
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Question = {
  difficulty: "easy" | "medium" | "hard"
  marks: string
  type: "short" | "long" | "mcq" | "fill in the blanks"
  question_text: string
}

interface QuestionFormBuilderProps {
  questions: Question[]
  onAddQuestion: () => void
  onRemoveQuestion: (index: number) => void
  onQuestionChange: (index: number, field: keyof Question, value: string) => void
}

export default function QuestionFormBuilder({
  questions,
  onAddQuestion,
  onRemoveQuestion,
  onQuestionChange,
}: QuestionFormBuilderProps) {
  const difficulties = ["easy", "medium", "hard"]
  const types = ["short", "long", "mcq", "fill in the blanks"]
  const maxWordsPerMark = 20 // Backend uses ~20 words per mark

  return (
    <div className="bg-card rounded-xl border border-border p-8 space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Step 2: Define Your Questions</h2>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="p-6 rounded-lg border border-border bg-muted/30 space-y-4 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Question {index + 1}</h3>
              {questions.length > 1 && (
                <button
                  onClick={() => onRemoveQuestion(index)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">Difficulty Level</label>
                <select
                  value={question.difficulty}
                  onChange={(e) => onQuestionChange(index, "difficulty", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  {difficulties.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Marks */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">Marks</label>
                <input
                  type="number"
                  min={0}
                  value={question.marks}
                  onChange={(e) => onQuestionChange(index, "marks", e.target.value)}
                  placeholder="5"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">Question Type</label>
                <select
                  value={question.type}
                  onChange={(e) => onQuestionChange(index, "type", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question Prompt */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">
                Question Prompt / Instructions
              </label>
              <textarea
                value={question.question_text}
                onChange={(e) => onQuestionChange(index, "question_text", e.target.value)}
                placeholder="Enter question details or hints for AI generation (optional)"
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
              {/* <p className="text-xs text-muted-foreground mt-1">Aim ~{maxWordsPerMark} words per mark in the generated output.</p> */}
            </div>
          </div>
        ))}
      </div>

      {/* Add Question Button */}
      <button
        onClick={onAddQuestion}
        className="w-full py-3 rounded-lg border border-dashed border-border text-foreground hover:bg-muted transition-colors font-medium flex items-center justify-center space-x-2"
      >
        <Plus size={20} />
        <span>Add Another Question</span>
      </button>
    </div>
  )
}
