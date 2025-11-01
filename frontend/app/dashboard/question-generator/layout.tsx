"use client"

import type { ReactNode } from "react"
import DynamicBubbles from "@/components/dynamic-bubbles"

export default function QuestionGeneratorLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DynamicBubbles />
      {children}
    </>
  )
}
