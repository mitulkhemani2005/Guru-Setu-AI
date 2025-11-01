"use client"

import type React from "react"

import { useState } from "react"
import { Youtube, Upload, X } from "lucide-react"

interface SummaryInputSectionProps {
  inputType: "youtube" | "video"
  onInputTypeChange: (type: "youtube" | "video") => void
  youtubeUrl: string
  onYoutubeUrlChange: (url: string) => void
  videoFile: File | null
  onVideoFileChange: (file: File | null) => void
  uploadToClassroom: boolean
  onUploadToClassroomChange: (value: boolean) => void
}

export default function SummaryInputSection({
  inputType,
  onInputTypeChange,
  youtubeUrl,
  onYoutubeUrlChange,
  videoFile,
  onVideoFileChange,
  uploadToClassroom,
  onUploadToClassroomChange,
}: SummaryInputSectionProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith("video")) {
      onVideoFileChange(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onVideoFileChange(e.target.files[0])
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-8 space-y-8">
      {/* Input Type Selector */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Choose Input Source</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onInputTypeChange("youtube")}
            className={`p-4 rounded-lg border-2 transition-all font-semibold flex items-center justify-center space-x-2 ${
              inputType === "youtube"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground/60 hover:text-foreground"
            }`}
          >
            <Youtube size={20} />
            <span>YouTube URL</span>
          </button>
          <button
            onClick={() => onInputTypeChange("video")}
            className={`p-4 rounded-lg border-2 transition-all font-semibold flex items-center justify-center space-x-2 ${
              inputType === "video"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground/60 hover:text-foreground"
            }`}
          >
            <Upload size={20} />
            <span>Upload Video</span>
          </button>
        </div>
      </div>

      {/* YouTube URL Input */}
      {inputType === "youtube" && (
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2">YouTube URL</label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => onYoutubeUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary transition-colors"
          />
          <p className="text-sm text-foreground/50 mt-2">
            Paste the full YouTube URL of the video you want to summarize
          </p>
          {/* Google Classroom Upload Option */}
          <div className="mt-4">
            {/* <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uploadToClassroom}
                onChange={(e) => onUploadToClassroomChange(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground/70">Upload summary to Google Classroom</span>
            </label> */}
          </div>
        </div>
      )}

      {/* Video File Upload */}
      {inputType === "video" && (
        <div>
          {videoFile ? (
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{videoFile.name}</p>
                  <p className="text-sm text-foreground/60">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => onVideoFileChange(null)}
                className="p-2 hover:bg-destructive/20 rounded-lg transition-colors text-destructive"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragActive ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <Upload className="w-12 h-12 text-foreground/40 mx-auto mb-3" />
              <p className="text-lg font-semibold text-foreground mb-1">Drag & drop your video</p>
              <p className="text-foreground/60 text-sm mb-4">Supports MP4, WebM, and other video formats</p>
              <label className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Browse Files
                <input type="file" accept="video/*" onChange={handleFileInput} className="hidden" />
              </label>
            </div>
          )}
        </div>
      )}

      {/* Google Classroom Option */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={uploadToClassroom}
            onChange={(e) => onUploadToClassroomChange(e.target.checked)}
            className="w-4 h-4 rounded border-border accent-primary"
          />
          <span className="font-medium text-foreground">Upload Summary to Google Classroom</span>
        </label>
        <p className="text-sm text-foreground/60 ml-7">
          The generated summary will be automatically uploaded to your Google Classroom after generation
        </p>
      </div>
    </div>
  )
}
