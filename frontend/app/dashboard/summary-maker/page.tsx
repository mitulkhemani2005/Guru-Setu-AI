"use client"

import { useState } from "react"
import DashboardNavbar from "@/components/dashboard/dashboard-navbar"
import SummaryInputSection from "@/components/summary-maker/summary-input-section"
import SummaryOutput from "@/components/summary-maker/summary-output"

export default function SummaryMakerPage() {
  const [inputType, setInputType] = useState<"youtube" | "video">("youtube")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [uploadToClassroom, setUploadToClassroom] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleGenerateSummary = async () => {
    setError("")

    if (inputType === "youtube" && !youtubeUrl.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    if (inputType === "video" && !videoFile) {
      setError("Please upload a video file")
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()

      if (inputType === "youtube") {
        formData.append("youtube_url", youtubeUrl)
      } else {
        formData.append("video_file", videoFile!)
      }

      if (uploadToClassroom) {
        formData.append("upload_to_classroom", "true")
      }

      const response = await fetch("http://localhost:5000/classnotes/sendfile", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()

      if (data.status !== "success") throw new Error(data.error || "Failed to generate summary")

      const pdfResponse = await fetch(`http://localhost:5000/classnotes/download/${data.job_id}`)
      if (!pdfResponse.ok) throw new Error("Failed to download PDF")

      const pdfBlob = await pdfResponse.blob()
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)

      setSummary(
        `# Class Summary

Your summary has been generated successfully! ${
          data.classroom_link ? "\n\n✅ Posted to Google Classroom" : ""
        }

[Click here to download the PDF](${url})

The PDF contains the complete summary of the class content.`
      )
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the summary")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadPDF = () => {
    if (pdfUrl) window.open(pdfUrl, "_blank")
  }

  const handleReset = () => {
    setSummary(null)
    setYoutubeUrl("")
    setVideoFile(null)
    setError("")
  }

  if (summary) {
    return (
      <main className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="pt-20 px-4 md:px-8 pb-8">
          <SummaryOutput
            summary={summary}
            onDownload={handleDownloadPDF}
            onEdit={handleReset}
            uploadedToClassroom={uploadToClassroom}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardNavbar />
      <div className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2 animate-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Summary Maker
            </h1>
            <p className="text-foreground/60 text-lg">Generate summaries from YouTube videos or class recordings</p>
          </div>

          <div className="animate-in" style={{ animationDelay: "0.1s" } as any}>
            <SummaryInputSection
              inputType={inputType}
              onInputTypeChange={setInputType}
              youtubeUrl={youtubeUrl}
              onYoutubeUrlChange={setYoutubeUrl}
              videoFile={videoFile}
              onVideoFileChange={setVideoFile}
              uploadToClassroom={uploadToClassroom}
              onUploadToClassroomChange={setUploadToClassroom}
            />
          </div>

          {error && (
            <div className="animate-in p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive font-medium">
              {error}
            </div>
          )}

          <div className="animate-in" style={{ animationDelay: "0.2s" } as any}>
            <button
              onClick={handleGenerateSummary}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold 
                hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed 
                transition-all duration-300 hover:scale-105 text-lg"
            >
              {isProcessing ? "Generating Summary..." : "Generate Summary"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
