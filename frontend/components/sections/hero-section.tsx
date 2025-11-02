"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isClosing, setIsClosing] = useState(false)

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

  // reset closing flag when modal opens
  useEffect(() => {
    if (authModal) setIsClosing(false)
  }, [authModal])

  const handleSubmit = () => {
    // validate before submit
    const isFormValid = authModal === "register"
      ? username.trim() !== "" && email.trim() !== "" && password.trim() !== ""
      : username.trim() !== "" && password.trim() !== ""

    if (!isFormValid) {
      setError("Please fill all fields")
      return
    }

    if (authModal === "register") {
      localStorage.setItem("username", username)
      localStorage.setItem("email", email)
    } else {
      localStorage.setItem("username", username)
    }

    // play closing animation (soft) then navigate
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setAuthModal(null)
      window.location.href = "/dashboard"
    }, 1000)
  }

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4">
      {/* wrap page content so we can blur it without affecting the modal */}
      <div className={`w-full transition-all duration-700 ${authModal !== null || isClosing ? 'blur-sm' : ''}`}>
      {/* Background elements preserved */}
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

      <div className="max-w-4xl mx-auto text-center space-y-8 animate-scale-in">
        <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/30 backdrop-blur-sm">
          <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ✨ Welcome to the Future of Teaching
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
              Empower Your Teaching
            </span>
            <span className="block text-foreground">with AI Intelligence</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/60 max-w-2xl mx-auto">
            Guru Setu helps create lessons & feedback powered by AI.
          </p>
        </div>

        {/* Floating elements preserved */}
        <div className="relative h-32 pointer-events-none">
          <div className="floating-element absolute left-1/4 top-0 w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg blur-xl animate-float" />
          <div
            className="floating-element absolute right-1/4 bottom-0 w-20 h-20 bg-gradient-to-br from-secondary/30 to-accent/20 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* CTA */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => setAuthModal("register")}
            size="lg"
            className="h-12 px-8 text-lg font-semibold rounded-full shadow-lg bg-gradient-to-r from-primary to-secondary"
          >
            Get Started Free →
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full border-2 border-primary/40">
            Watch Demo
          </Button>
        </div>
      </div>

  </div>

  {(authModal !== null || isClosing) && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-[1000ms] ${authModal && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={(e) => {
            // close modal when clicking on the overlay (outside the dialog)
            if (e.target === e.currentTarget) {
              setIsClosing(true)
              setTimeout(() => {
                setIsClosing(false)
                setAuthModal(null)
              }, 1000)
            }
          }}
        >
          <div className={`bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-sm space-y-4 transform transition-all duration-[1000ms] ${authModal && !isClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
                <h2 className="text-xl font-bold text-center">
                  {authModal === "register" ? "Create Account" : "Login"}
                </h2>
                {/* wrap inputs in a form so Enter submits */}
                <form
                  className="space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                  }}
                >
                  <input
                    className="w-full p-2 rounded border"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(null) }}
                  />
                  {authModal === "register" && (
                    <input
                      className="w-full p-2 rounded border"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null) }}
                    />
                  )}
                  <input
                    className="w-full p-2 rounded border"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null) }}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}

                  {/* disable until all visible fields are filled */}
                  {(() => {
                    const isFormValid = authModal === "register"
                      ? username.trim() !== "" && email.trim() !== "" && password.trim() !== ""
                      : username.trim() !== "" && password.trim() !== ""
                    return (
                      <Button
                        type="submit"
                        className={`w-full ${!isFormValid ? "opacity-50 pointer-events-none" : ""}`}
                        disabled={!isFormValid}
                      >
                        Continue
                      </Button>
                    )
                  })()}
                </form>

                <button className="text-sm text-center w-full" onClick={() => setAuthModal(authModal === "register" ? "login" : "register")}>
                  {authModal === "register" ? "Already have an account? Login" : "New here? Register"}
                </button>
              </div>
        </div>
      )}
    </section>
  )
}