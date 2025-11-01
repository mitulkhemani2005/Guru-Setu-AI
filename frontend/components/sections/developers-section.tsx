"use client"

import { LinkedinIcon } from "lucide-react"

export default function DevelopersSection() {
  const developers = [
    {
      name: "Nitya Jain",
      role: "Machine Learning Developer",
      image: "/nityajain.jpg",
      linkedin: "https://www.linkedin.com/in/nitya-jain-88ab56279/",
    },
    {
      name: "Mitul Khemani",
      role: "Machine Learning Developer",
      image: "/mitulkhemani.jpg",
      linkedin: "https://www.linkedin.com/in/mitul-khemani/",
    },
    {
      name: "Naman Jain",
      role: "Backend Devloper",
      image: "/namanjain.jpg",
      linkedin: "https://www.linkedin.com/in/naman-jain-404512257/",
    },
    {
      name: "Shashwat Gupta",
      role: "Frontend Developer",
      image: "/shashwatgupta.jpg",
      linkedin: "https://www.linkedin.com/in/shashwat-gupta-8b582727b/",
    },
  ]

  return (
    <section id="developers" className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Meet Our Team
          </h2>
          <p className="text-lg text-foreground/60">Talented developers building the future of education</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {developers.map((dev, idx) => (
            <a key={idx} href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
              <div className="relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <img
                  src={dev.image || "/placeholder.svg"}
                  alt={dev.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <h3 className="font-bold text-lg text-white">{dev.name}</h3>
                  <p className="text-sm text-white/80">{dev.role}</p>
                  <div className="mt-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <LinkedinIcon className="w-4 h-4 text-white" />
                    <span className="text-xs text-white">View Profile</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
