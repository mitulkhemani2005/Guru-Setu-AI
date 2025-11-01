"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import DashboardNavbar from "@/components/dashboard/dashboard-navbar"
import SchedulerForm from "@/components/scheduler/scheduler-form"
import SchedulesList from "@/components/scheduler/schedules-list"


interface Schedule {
  id: number
  title: string
  time: string // ISO string
  email: string
  remind_before: number
  notified: boolean
}

export default function SchedulerPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "" )
  // Fetch schedules for the current user
  const fetchSchedules = async () => {
    if (!userEmail) return

    try {
      const response = await fetch(`http://localhost:5000/scheduler/${userEmail}`)
      if (!response.ok) {
        throw new Error("Failed to fetch schedules")
      }
      const data = await response.json()
      setSchedules(data)
    } catch (error) {
      console.error("Error fetching schedules:", error)
      toast.error("Failed to load schedules")
    }
  }

  useEffect(() => {
    // In a real app, this would come from authentication
    const email = localStorage.getItem("userEmail")
    if (email) {
      setUserEmail(email)
    }
  }, [])

  useEffect(() => {
    fetchSchedules()
  }, [userEmail])

  const handleAddSchedule = async (newSchedule: {
    title: string
    time: string
    email: string
    remind_before: number
  }) => {
    try {
      const response = await fetch("http://localhost:5000/scheduler/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSchedule),
      })

      if (!response.ok) {
        throw new Error("Failed to create schedule")
      }

      toast.success("Schedule created successfully!")
      fetchSchedules() // Refresh the list
    } catch (error) {
      console.error("Error creating schedule:", error)
      toast.error("Failed to create schedule")
    }
  }

  const handleDeleteSchedule = async (id: number) => {
    // Note: Backend doesn't provide delete endpoint yet
    setSchedules(schedules.filter((s) => s.id !== id))
    toast.success("Schedule deleted")
  }

  // Email setup prompt if not set
  if (!userEmail) {
    return (
      <main className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="pt-20 px-4 md:px-8 pb-8">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Set Your Email</h2>
              <p className="text-foreground/60">Please enter your email to continue. This will be used for schedule reminders.</p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary transition-colors"
                onChange={(e) => {
                  const email = e.target.value
                  if (email && /\S+@\S+\.\S+/.test(email)) {
                    localStorage.setItem("userEmail", email)
                    setUserEmail(email)
                  }
                }}
              />
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardNavbar />
      <div className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2 animate-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Scheduler & Reminders
            </h1>
            <p className="text-foreground/60 text-lg">Plan your lessons and set email reminders</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <SchedulerForm onAddSchedule={handleAddSchedule} />
            </div>

            {/* Schedules List Section */}
            <div className="lg:col-span-2">
              <SchedulesList schedules={schedules} onDeleteSchedule={handleDeleteSchedule} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
