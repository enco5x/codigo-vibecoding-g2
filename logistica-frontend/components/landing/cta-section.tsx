"use client"

import { motion } from "framer-motion"
import { ArrowRight, Mail } from "lucide-react"

export function CtaSection() {
  return (
    <section id="cta" className="relative overflow-hidden bg-black/20 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] sm:p-12 lg:p-16"
        >
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-bl from-orange-500/10 to-transparent blur-2xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-500/10 to-transparent blur-2xl" />

          <div className="relative">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400"
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              Comienza hoy
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-lexend)", color: "white" }}
            >
              ¿Listo para transformar tu logística?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mx-auto mt-4 max-w-lg text-white/35"
              style={{ fontFamily: "var(--font-source-sans)" }}
            >
              Déjanos tus datos y un experto te contactará en menos de 24 horas para
              mostrarte cómo Logistica Web puede impulsar tu operación.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-white/20" />
                <input
                  type="email"
                  placeholder="tu@empresa.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-10 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-cyan-500/50 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.15)]"
                  required
                />
              </div>
              <button
                type="submit"
                className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#F97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:bg-[#EA580C] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30"
              >
                Solicitar demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-4 text-xs text-white/15"
            >
              Sin compromiso &middot; Demo personalizada &middot; Soporte en español
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
