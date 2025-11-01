"use client"

import { BarChart3, BookMarked, Cloud, Clock } from "lucide-react"

export default function StatsOverview() {
  const stats = [
    { icon: BarChart3, label: "Questions Generated", value: "248", color: "from-primary to-primary/60" },
    { icon: BookMarked, label: "Summaries Generated", value: "156", color: "from-accent to-accent/60" },
    { icon: Cloud, label: "Uploaded to Classroom", value: "142", color: "from-blue-500 to-blue-400" },
    { icon: Clock, label: "Upcoming Schedules", value: "12", color: "from-purple-500 to-purple-400" },
  ]

  return (
    <div></div>
    // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    //   {stats.map((stat, idx) => {
    //     const Icon = stat.icon
    //     return (
    //       <div
    //         key={idx}
    //         className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 group"
    //       >
    //         <div
    //           className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
    //         >
    //           <Icon className="w-6 h-6 text-white" />
    //         </div>
    //         <p className="text-foreground/60 text-sm mb-2">{stat.label}</p>
    //         <p className="text-3xl font-bold text-foreground">{stat.value}</p>
    //       </div>
    //     )
    //   })}
    // </div>
  )
}
