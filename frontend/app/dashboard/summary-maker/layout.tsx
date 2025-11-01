"use client"

import type { ReactNode } from "react"
import VoiceAssistant from "@/components/dashboard/voice-assistant"
import DynamicBubbles from "@/components/dynamic-bubbles"

export default function SummaryMakerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DynamicBubbles />
      {children}
      <VoiceAssistant />
    </>
  )
}
