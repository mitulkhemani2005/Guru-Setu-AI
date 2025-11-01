"use client"

import { BookOpen, Zap, Clock, Brain } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Question Generator",
      description: "Create custom question papers in seconds with AI-powered content generation",
    },
    {
      icon: Zap,
      title: "Smart Summaries",
      description: "Auto-generate lesson summaries from videos and study materials",
    },
    {
      icon: Clock,
      title: "Smart Scheduler",
      description: "Plan and schedule your lessons with intelligent reminders",
    },
    {
      icon: Brain,
      title: "Voice Assistant",
      description: "Interact with AI using natural voice commands",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-lg text-foreground/60">Everything you need to transform your teaching experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-lg flex items-center justify-center group-hover:from-primary/40 group-hover:to-secondary/20 transition-all duration-300 mb-4 group-hover:shadow-lg">
                  <Icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
