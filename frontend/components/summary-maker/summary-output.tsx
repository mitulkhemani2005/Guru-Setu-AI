"use client"

import { Button } from "@/components/ui/button"
import { Download, Edit3, CheckCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface SummaryOutputProps {
  summary: string
  onDownload: () => void
  onEdit: () => void
  uploadedToClassroom: boolean
}

export default function SummaryOutput({ summary, onDownload, onEdit, uploadedToClassroom }: SummaryOutputProps) {
  return (
    <div className="space-y-8">
      {/* Success Message */}
      {uploadedToClassroom && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold text-primary">Summary uploaded to Google Classroom</p>
            <p className="text-sm text-primary/80">Your students can now access the summary in their classroom</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button onClick={onDownload} className="flex items-center space-x-2">
          <Download size={18} />
          <span>Download PDF</span>
        </Button>
        <Button onClick={onEdit} variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Edit3 size={18} />
          <span>Generate Another</span>
        </Button>
      </div>

      {/* Summary Content */}
      <div className="bg-card rounded-xl border border-border p-8 prose prose-invert max-w-none">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  )
}
