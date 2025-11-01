"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const { clientX, clientY } = e
      const rect = ref.current.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      const elements = ref.current.querySelectorAll(".floating-element")
      elements.forEach((el) => {
        const distance = Math.sqrt(Math.pow(x - rect.width / 2, 2) + Math.pow(y - rect.height / 2, 2))
        const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2)

        if (distance < 200) {
          const moveX = Math.cos(angle) * (200 - distance) * 0.1
          const moveY = Math.sin(angle) * (200 - distance) * 0.1
          ;(el as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`
        } else {
          ;(el as HTMLElement).style.transform = "translate(0, 0)"
        }
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-br from-secondary/30 to-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-scale-in">
        {/* Tag */}
        <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/30 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ✨ Welcome to the Future of Teaching
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-balance">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
              Empower Your Teaching
            </span>
            <span className="block text-foreground">with AI Intelligence</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/60 max-w-2xl mx-auto text-balance leading-relaxed">
            Guru Setu is your intelligent companion for creating engaging lessons, personalized student feedback, and
            data-driven insights—all powered by cutting-edge AI.
          </p>
        </div>

        {/* Floating Elements */}
        <div className="relative h-32 pointer-events-none">
          <div className="floating-element absolute left-1/4 top-0 w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg blur-xl animate-float" />
          <div
            className="floating-element absolute right-1/4 bottom-0 w-20 h-20 bg-gradient-to-br from-secondary/30 to-accent/20 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="h-12 px-8 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 animate-glow"
          >
            Get Started Free →
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-lg font-semibold rounded-full border-2 border-primary/40 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105 bg-transparent"
          >
            Watch Demo
          </Button>
        </div>

        {/* Stats Section
        <div className="pt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
          <div className="p-4 sm:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 group">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              1000
            </p>
            <p className="text-xs sm:text-sm text-foreground/60 mt-2">Teachers</p>
          </div>
          <div className="p-4 sm:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-secondary/50 transition-all duration-300 hover:scale-105 group">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              20K+
            </p>
            <p className="text-xs sm:text-sm text-foreground/60 mt-2">Students</p>
          </div>
          <div className="p-4 sm:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 group">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              100%
            </p>
            <p className="text-xs sm:text-sm text-foreground/60 mt-2">Satisfaction</p>
          </div>
        </div> */}
      </div>
    </section>
  )
}
