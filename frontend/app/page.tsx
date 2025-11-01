"use client"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/sections/hero-section"
import AboutSection from "@/components/sections/about-section"
import FeaturesSection from "@/components/sections/features-section"
import DevelopersSection from "@/components/sections/developers-section"
import ContactSection from "@/components/sections/contact-section"
import Footer from "@/components/footer"
import DynamicBubbles from "@/components/dynamic-bubbles"

export default function LandingPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen bg-background">
      <DynamicBubbles />
      <Navbar />
      <HeroSection onGetStarted={handleGetStarted} />
      <AboutSection />
      <FeaturesSection />
      <DevelopersSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
