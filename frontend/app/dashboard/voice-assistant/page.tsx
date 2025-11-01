"use client"

import { useRef, useState } from "react"
import DashboardNavbar from "@/components/dashboard/dashboard-navbar"
import DynamicBubbles from "@/components/dynamic-bubbles"
import { Mic } from "lucide-react"

type ChatMsg = { role: "user" | "assistant"; content: string }

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [audioErr, setAudioErr] = useState("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const backendBase = "http://127.0.0.1:5000"
  const uploadURL = `${backendBase}/voice_upload`

  // Create/reuse one audio element
  const getAudioEl = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = "auto"
      audioRef.current.crossOrigin = "anonymous"
    }
    return audioRef.current
  }

  const startRecording = async () => {
    setTranscript("")
    setAudioErr("")
    audioChunksRef.current = []

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    mediaRecorderRef.current = recorder

    recorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data)
    }
    recorder.onstop = () => sendAudioToBackend()

    recorder.start()
    setIsListening(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsListening(false)
  }

  const toggleListening = () => {
    isListening ? stopRecording() : startRecording()
  }

  const sendAudioToBackend = async () => {
    try {
      setAudioErr("")
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
      const audioFile = new File([audioBlob], "voice.webm", { type: "audio/webm" })

      const formData = new FormData()
      formData.append("audio", audioFile)

      const res = await fetch(uploadURL, { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok || data.error) {
        setTranscript(data?.error || "Upload failed")
        return
      }

      const teacher_text: string = data.teacher_text || ""
      const assistant_text: string = data.assistant_text || ""
      const ttsPath: string = data.tts_audio || "" // e.g. "/voice/assistant_response.mp3"

      setTranscript(teacher_text)
      setMessages(prev => [
        ...prev,
        { role: "user", content: teacher_text },
        { role: "assistant", content: assistant_text },
      ])

      // --- Normalize URL + cache-bust so we don't replay stale file ---
      const isAbsolute = /^https?:\/\//i.test(ttsPath)
      const srcBase = backendBase.replace(/\/+$/, "")
      const srcPath = isAbsolute ? ttsPath : `${srcBase}${ttsPath.startsWith("/") ? "" : "/"}${ttsPath}`
      const cacheBust = `${srcPath}${srcPath.includes("?") ? "&" : "?"}t=${Date.now()}`

      const audio = getAudioEl()
      audio.src = cacheBust
      audio.currentTime = 0
      // On Safari, load() first improves reliability
      audio.load()

      try {
        // Because user clicked the mic button earlier, autoplay policy should allow this
        await audio.play()
      } catch (err: any) {
        // If this throws, you'll see exactly why (CORS, MIME, user gesture, etc.)
        setAudioErr(err?.message || "Failed to play audio")
        // As a fallback, you can show a manual play button if needed:
        // audio.controls = true
        // audio.play().catch(() => {})
        console.error("Audio play error:", err)
      }
    } catch (e: any) {
      setAudioErr(e?.message || "Unexpected error")
      console.error(e)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <DynamicBubbles />
      <DashboardNavbar />

      <div className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-2xl mx-auto h-[calc(100vh-120px)] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-8 py-8">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center space-y-8">
                <div className="flex items-end justify-center space-x-2 h-16">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-3 rounded-full bg-gradient-to-t from-primary to-primary/60"
                      style={{
                        height: "40px",
                        animation: isListening ? `wave 0.8s ease-in-out infinite` : "none",
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">Ready to listen</h2>
                  <p className="text-foreground/60 text-base">Click the microphone button below</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === "user" ? "bg-primary text-white" : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center pb-8">
            <button
              onClick={toggleListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 ${
                isListening ? "bg-red-500 animate-pulse" : "bg-gradient-to-br from-blue-600 to-blue-700 hover:shadow-blue-500/50"
              }`}
            >
              <Mic className="w-10 h-10 text-white" />
            </button>
          </div>

          {transcript && (
            <div className="text-center text-sm text-foreground/70 mb-2">{transcript}</div>
          )}
          {audioErr && (
            <div className="text-center text-sm text-red-500 mb-4">Audio error: {audioErr}</div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { height: 10px; }
          50% { height: 40px; }
        }
      `}</style>
    </main>
  )
}
