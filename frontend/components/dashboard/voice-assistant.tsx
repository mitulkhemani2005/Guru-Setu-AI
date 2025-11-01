"use client"

import { useState, useRef } from "react"
import { Mic, X, Send } from "lucide-react"

interface VoiceAssistantProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function VoiceAssistant({ isOpen = true, onClose }: VoiceAssistantProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcript, setTranscript] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Create audio context for visualization
  const setupAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = setupAudioContext()

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      const audioData: Blob[] = []

      recorder.ondataavailable = (e) => {
        audioData.push(e.data)
      }

      recorder.onstop = () => {
        // Simulate processing the audio
        setTranscript("Generate questions about algebra for class 10 students")
        setIsPlaying(true)

        // Simulate audio response playback
        setTimeout(() => {
          setIsPlaying(false)
        }, 3000)

        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Microphone access denied:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleSendMessage = () => {
    if (transcript.trim()) {
      // Simulate sending to backend
      console.log("Sending voice command:", transcript)
      setTranscript("")
      setIsPlaying(true)
      setTimeout(() => setIsPlaying(false), 2000)
    }
  }

  return (
    <>
      {/* Voice Assistant Widget */}
      {isOpen && (
        <div className="w-96 bg-card rounded-xl border border-border shadow-2xl overflow-hidden z-50 animate-in">
          {/* Header */}
          

          {/* Content */}
          
        </div>
      )}
    </>
  )
}
