"use client"

import { useEffect, useRef } from "react"

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div
          className="text-center space-y-6 opacity-100 transition-opacity duration-1000"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About Guru Setu
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            Guru Setu is an innovative AI-powered learning platform designed to revolutionize education. We combine
            cutting-edge artificial intelligence with intuitive design to help teachers save time, create better
            content, and engage students more effectively.
          </p>
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            {[
              { number: "1000+", label: "Teachers Active", color: "from-primary" },
              { number: "50K+", label: "Questions Generated", color: "from-secondary" },
              { number: "99%", label: "Satisfaction Rate", color: "from-accent" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl bg-gradient-to-br ${stat.color} to-transparent opacity-10 border border-border/50 hover:border-primary/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg group cursor-pointer`}
              >
                <p
                  className={`text-3xl font-bold bg-gradient-to-r ${stat.color} to-primary/60 bg-clip-text text-transparent`}
                >
                  {stat.number}
                </p>
                <p className="text-foreground/60 mt-2">{stat.label}</p>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  )
}
