"use client"

import { Clock, BookOpen, Users } from "lucide-react"

export default function UpcomingSchedule() {
  const schedules = [
    { id: 1, title: "Mathematics - Algebra Chapter 5", time: "Today, 2:00 PM", class: "10-A", students: 45 },
    { id: 2, title: "Physics - Laws of Motion", time: "Today, 4:30 PM", class: "11-B", students: 38 },
    { id: 3, title: "English - Shakespeare Literature", time: "Tomorrow, 10:00 AM", class: "12-A", students: 42 },
    { id: 4, title: "Chemistry - Periodic Table", time: "Tomorrow, 3:00 PM", class: "10-B", students: 40 },
  ]

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Upcoming Schedules</h2>
        <a href="/dashboard/scheduler" className="text-primary hover:underline text-sm font-medium">
          View All
        </a>
      </div>

      <div className="space-y-3">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/50"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{schedule.title}</h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-foreground/60">
                  <span className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{schedule.time}</span>
                  </span>
                  <span>Class {schedule.class}</span>
                  <span className="flex items-center space-x-1">
                    <Users size={14} />
                    <span>{schedule.students} students</span>
                  </span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm">
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
