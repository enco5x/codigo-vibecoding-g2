"use client"

import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import { Menu, X, Package } from "lucide-react"

const links = [
  { href: "#features", label: "Características" },
  { href: "#how-it-works", label: "Cómo funciona" },
  { href: "#testimonials", label: "Testimonios" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 50)
  })

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Package className="h-5 w-5 text-cyan-400" />
          </div>
          <span
            className="text-lg font-semibold tracking-tight text-white"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Logistica Web
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/40 transition-colors duration-200 hover:text-white/70"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cta"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:bg-[#EA580C] hover:-translate-y-0.5"
          >
            Solicitar demo
          </a>
        </nav>

        <button
          className="flex cursor-pointer items-center justify-center text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="border-t border-white/5 bg-[#0F172A]/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/70"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#cta"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#F97316] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:bg-[#EA580C]"
            >
              Solicitar demo
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
