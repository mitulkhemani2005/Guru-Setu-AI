"use client"

import { useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface FileUploadSectionProps {
  uploadedFiles: File[]
  onFilesChange: (files: File[]) => void
}

export default function FileUploadSection({ uploadedFiles, onFilesChange }: FileUploadSectionProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isValidFile = (file: File) => {
    const isPDFext = file.name.toLowerCase().endsWith(".pdf")
    if (!isPDFext) {
      console.warn(`File ${file.name} does not have .pdf extension`)
      return false
    }
    // Some browsers leave file.type empty for PDFs; extension check is enough.
    return true
  }

  const addFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const ok = isValidFile(file)
      if (!ok) toast.error(`${file.name} is not a valid PDF file`)
      return ok
    })

    if (validFiles.length > 0) {
      onFilesChange([...uploadedFiles, ...validFiles])
      toast.success(`${validFiles.length} file${validFiles.length === 1 ? "" : "s"} uploaded successfully`)
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    const newFiles = Array.from(e.dataTransfer.files || [])
    if (newFiles.length) addFiles(newFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length) addFiles(files)
    // Reset the input so selecting the same file again still triggers onChange
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    onFilesChange(newFiles)
  }

  return (
    <div className="bg-card rounded-xl border border-border p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Step 1: Upload Study Material (Optional)</h2>
        {uploadedFiles.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {uploadedFiles.length} {uploadedFiles.length === 1 ? "file" : "files"} uploaded
          </p>
        )}
      </div>

      <div className="space-y-4">
        {uploadedFiles.length > 0 && (
          <div className="rounded-lg border border-border">
            <div className="divide-y divide-border">
              {uploadedFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between p-4 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeFile(index)}
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
          // Optional: allow pasting files (Ctrl+V) into the dropzone
          onPaste={(e) => {
            const items = Array.from(e.clipboardData?.files || [])
            if (items.length) addFiles(items)
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
          }}
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-medium text-foreground mb-1">
            {uploadedFiles.length === 0 ? "Drag & drop your study material" : "Add more study material"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">Supports PDF files only</p>

          {/* Use a normal button that programmatically opens the hidden input */}
          <Button type="button" onClick={() => inputRef.current?.click()}>
            Browse Files
          </Button>

          {/* Hidden input, triggered by button click */}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf,application/x-pdf"
            onChange={handleFileInput}
            multiple
            className="sr-only"
            id="file-input"
          />
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <Button onClick={() => onFilesChange([])} variant="outline" className="w-full">
          Clear All Files
        </Button>
      )}
    </div>
  )
}
