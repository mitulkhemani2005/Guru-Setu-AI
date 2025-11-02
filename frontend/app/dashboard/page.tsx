"use client"
import { useMemo } from "react"
import { BookMarked, BarChart3, Clock, Mic } from "lucide-react"
import DashboardNavbar from "@/components/dashboard/dashboard-navbar"
import DynamicBubbles from "@/components/dynamic-bubbles"
import Link from "next/link"

const teacher = localStorage.getItem("username") || "Teacher"

export default function Dashboard() {
  const features = useMemo(
    () => [
      {
        id: "question-generator",
        title: "Question Generator",
        description: "Create custom question papers instantly with AI",
        icon: BarChart3,
        bgGradient: "from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900",
        borderColor: "border-blue-200 dark:border-blue-800",
        iconBgGradient: "from-blue-500 to-blue-600",
        href: "/dashboard/question-generator",
        delay: "0s",
      },
      {
        id: "summary-maker",
        title: "Summarizer Maker",
        description: "Summarize content and upload to Google Classroom",
        icon: BookMarked,
        bgGradient: "from-purple-100 to-pink-50 dark:from-purple-950 dark:to-pink-900",
        borderColor: "border-purple-200 dark:border-purple-800",
        iconBgGradient: "from-purple-500 to-pink-600",
        href: "/dashboard/summary-maker",
        delay: "0.1s",
      },
      {
        id: "scheduler",
        title: "Scheduler & Reminder",
        description: "Manage your schedule and get smart reminders",
        icon: Clock,
        bgGradient: "from-green-100 to-emerald-50 dark:from-green-950 dark:to-emerald-900",
        borderColor: "border-green-200 dark:border-green-800",
        iconBgGradient: "from-green-500 to-emerald-600",
        href: "/dashboard/scheduler",
        delay: "0.2s",
      },
      {
        id: "voice-assistant",
        title: "Voice Assistant",
        description: "Talk to your AI teaching companion",
        icon: Mic,
        bgGradient: "from-orange-100 to-red-50 dark:from-orange-950 dark:to-red-900",
        borderColor: "border-orange-200 dark:border-orange-800",
        iconBgGradient: "from-orange-500 to-red-600",
        href: "/dashboard/voice-assistant",
        delay: "0.3s",
      },
    ],
    [],
  )

  return (
    <main className="min-h-screen bg-background">
      <DynamicBubbles />
      <DashboardNavbar />
      <div className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Welcome Section */}
          <div className="space-y-4 animate-in">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Welcome back, {teacher}
            </h1>
            <p className="text-lg text-foreground/70">Choose a feature to get started</p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Link
                  key={feature.id}
                  href={feature.href}
                  className="group"
                  style={
                    {
                      animationDelay: feature.delay,
                    } as any
                  }
                >
                  <div
                    className={`relative h-full p-8 rounded-2xl border-2 ${feature.borderColor} ${feature.bgGradient} 
                      transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 
                      cursor-pointer animate-in overflow-hidden`}
                    style={
                      {
                        animationDelay: feature.delay,
                      } as any
                    }
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 group-hover:animate-pulse-glow transition-opacity" />

                    <div className="relative space-y-4">
                      {/* Icon */}
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.iconBgGradient} 
                          flex items-center justify-center shadow-lg group-hover:scale-110 
                          transition-transform duration-300 group-hover:animate-bounce-subtle`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-foreground/70 text-base leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Stats Section */}
          {/* <div className="mt-16 animate-in" style={{ animationDelay: "0.4s" } as any}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Teachers", value: "10K+", color: "from-primary to-primary/60" },
                { label: "Students", value: "50K+", color: "from-accent to-accent/60" },
                { label: "Satisfaction", value: "99%", color: "from-purple-500 to-purple-400" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-105"
                  style={
                    {
                      animationDelay: `${0.5 + idx * 0.1}s`,
                    } as any
                  }
                >
                  <p className="text-foreground/60 text-sm mb-3 font-medium">{stat.label}</p>
                  <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </main>
  )
}
