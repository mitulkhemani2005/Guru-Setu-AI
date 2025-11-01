"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, Bell } from "lucide-react"

interface SchedulerFormProps {
  onAddSchedule: (schedule: { title: string; time: string; email: string; remind_before: number }) => void
}

export default function SchedulerForm({ onAddSchedule }: SchedulerFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    email: localStorage.getItem("userEmail"),
    remind_before: 10,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "remindBefore" ? Number.parseInt(value) : value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.time) newErrors.time = "Time is required"
    if (!localStorage.getItem("userEmail")) newErrors.email = "Email is required"
    if (!/\S+@\S+\.\S+/.test(localStorage.getItem("userEmail"))) newErrors.email = "Invalid email format"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Combine date and time into ISO string
    const datetime = new Date(`${formData.date}T${formData.time}:00`)
    
    onAddSchedule({
      title: formData.title,
      time: datetime.toISOString(),
      email: localStorage.getItem("userEmail"),
      remind_before: formData.remind_before
    })

    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      email: localStorage.getItem("userEmail"),
      remind_before: 10,
    })
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <h2 className="text-xl font-bold text-foreground">Create New Schedule</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2">Lesson Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Mathematics Class"
            className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none transition-colors ${
              errors.title ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
            }`}
          />
          {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
        </div>

        {/* Email */}
        {/* <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={localStorage.getItem("userEmail")}
            placeholder="your@email.com"
            className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none transition-colors ${
              errors.email ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
            }`}
          />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
        </div> */}

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2 flex items-center space-x-2">
            <Calendar size={16} />
            <span>Date</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none transition-colors ${
              errors.date ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
            }`}
          />
          {errors.date && <p className="text-sm text-destructive mt-1">{errors.date}</p>}
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2 flex items-center space-x-2">
            <Clock size={16} />
            <span>Time (UTC)</span>
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none transition-colors ${
              errors.time ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
            }`}
          />
          {errors.time && <p className="text-sm text-destructive mt-1">{errors.time}</p>}
        </div>

        {/* Remind Before */}
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2 flex items-center space-x-2">
                        <Bell size={16} />
            <span>Remind Before</span>
          </label>
          <select
            name="remind_before"
            value={formData.remind_before}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          Add Schedule
        </button>
      </form>
    </div>
  )
}
