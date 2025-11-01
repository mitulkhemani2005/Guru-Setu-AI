"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, FileText, Clock, Mic } from "lucide-react"
import { useState } from "react"
import VoiceAssistant from "@/components/dashboard/voice-assistant"

export default function DashboardNavbar() {
  const router = useRouter()
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false)

  const navItems = [
    { icon: BookOpen, label: "Question Generator", href: "/dashboard/question-generator" },
    { icon: FileText, label: "Summary Maker", href: "/dashboard/summary-maker" },
    { icon: Clock, label: "Scheduler", href: "/dashboard/scheduler" },
    { icon: Mic, label: "Voice Assistant", href: "/dashboard/voice-assistant" },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 bg-background border-b border-border flex items-center px-4 md:px-8 z-40">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-primary-foreground font-bold text-lg">GS</span>
            </div>
            <span className="font-bold text-foreground hidden sm:inline">Guru Setu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-all"
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center space-x-4">
            

            {/* Mobile Menu Icon */}
            <button className="lg:hidden p-2 text-foreground/60 hover:text-foreground">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {showVoiceAssistant && (
        <div className="fixed top-20 right-8 z-50">
          <VoiceAssistant isOpen={showVoiceAssistant} onClose={() => setShowVoiceAssistant(false)} />
        </div>
      )}
    </>
  )
}
