"use client"

import { Trash2, Clock, Calendar, Bell } from "lucide-react"

interface Schedule {
  id: number
  title: string
  time: string // ISO string
  email: string
  remind_before: number
  notified: boolean
}

interface SchedulesListProps {
  schedules: Schedule[]
  onDeleteSchedule: (id: number) => void
}

export default function SchedulesList({ schedules, onDeleteSchedule }: SchedulesListProps) {
  const formatDateTime = (isoStr: string) => {
    const date = new Date(isoStr)
    return {
      date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    }
  }

  const getRemindBeforeText = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    if (minutes === 60) return "1h"
    return `${Math.floor(minutes / 60)}h`
  }

  const upcomingSchedules = schedules
    .filter(s => !s.notified) // Only show non-notified schedules
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      <h2 className="text-xl font-bold text-foreground">Upcoming Schedules</h2>

      {upcomingSchedules.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
          <p className="text-foreground/60">No upcoming schedules. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingSchedules.map((schedule) => {
            const { date, time } = formatDateTime(schedule.time)
            return (
              <div
                key={schedule.id}
                className="p-4 rounded-lg border border-border bg-muted/30 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{schedule.title}</h3>
                    <p className="text-sm text-foreground/60">{schedule.email}</p>
                  </div>
                  <button
                    onClick={() => onDeleteSchedule(schedule.id)}
                    className="p-2 text-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-primary" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-accent" />
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell size={16} className="text-blue-500" />
                    <span>Remind {getRemindBeforeText(schedule.remind_before)} before</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
