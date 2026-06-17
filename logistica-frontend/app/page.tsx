"use client"

import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { LogosBar } from "@/components/landing/logos-bar"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Testimonials } from "@/components/landing/testimonials"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-[#1E293B] to-[#020617]">
      <Nav />
      <Hero />
      <LogosBar />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
      <Footer />
    </div>
  )
}
