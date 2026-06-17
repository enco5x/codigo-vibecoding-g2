"use client"

import { motion } from "framer-motion"
import { Particles } from "./particles"
import { ArrowRight, Shield, BarChart3, Clock } from "lucide-react"

const headline = "Mueve más, gestiona menos."
const words = headline.split(" ")

const badges = [
  { icon: Shield, label: "Tracking en tiempo real" },
  { icon: BarChart3, label: "Dashboard inteligente" },
  { icon: Clock, label: "Ahorro de hasta 30%" },
]

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
}

const wordVariant = {
  hidden: { y: 60, opacity: 0, filter: "blur(8px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-1/4 -left-1/4 h-[600px] w-[600px] animate-[mesh-1_8s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-cyan-500/8 to-transparent blur-3xl" />
        <div className="absolute -right-1/4 top-0 h-[500px] w-[500px] animate-[mesh-2_10s_ease-in-out_infinite] rounded-full bg-gradient-to-bl from-violet-500/8 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] animate-[mesh-3_12s_ease-in-out_infinite] rounded-full bg-gradient-to-tr from-emerald-500/6 to-transparent blur-3xl" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.4\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
        />
        <Particles />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-24 pb-16 text-center lg:flex-row lg:text-left">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-500/8 px-4 py-1.5 text-xs font-medium text-cyan-400"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            Plataforma integral de logística
          </motion.div>

          <motion.h1
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariant}
                className="mr-[0.25em] inline-block text-white"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent"
            >
              Logística inteligente para empresas que no se detienen.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/35 lg:mx-0 lg:text-lg"
            style={{ fontFamily: "var(--font-source-sans)" }}
          >
            Optimiza tus operaciones logísticas con nuestra plataforma todo-en-uno.
            Tracking, rutas inteligentes y dashboard de KPIs en un solo lugar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          >
            <a
              href="#cta"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#F97316] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:bg-[#EA580C] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/35"
            >
              Solicitar demo gratuita
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#features"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-8 py-3.5 text-sm font-semibold text-white/60 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
            >
              Ver cómo funciona
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start"
          >
            {[
              { label: "+500", sub: "empresas activas", accent: "text-cyan-400" },
              { label: "30%", sub: "ahorro operativo", accent: "text-emerald-400" },
              { label: "99.9%", sub: "uptime garantizado", accent: "text-violet-400" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span
                  className={`text-2xl font-bold ${stat.accent}`}
                  style={{ fontFamily: "var(--font-lexend)" }}
                >
                  {stat.label}
                </span>
                <span className="text-xs text-white/25">{stat.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-12 flex-1 lg:mt-0"
        >
          <div className="relative mx-auto max-w-md lg:mx-0 lg:ml-auto">
            <div className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]">
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15">
                    <BarChart3 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold text-white/80"
                      style={{ fontFamily: "var(--font-lexend)" }}
                    >
                      Panel de control
                    </p>
                    <p className="text-[10px] text-white/25">Tiempo real</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Envíos activos", value: "1,284", bar: "w-3/4", color: "bg-cyan-400" },
                    { label: "Rutas en curso", value: "48", bar: "w-1/2", color: "bg-violet-400" },
                    { label: "Eficiencia", value: "94%", bar: "w-[94%]", color: "bg-emerald-400" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-white/35">{item.label}</span>
                        <span className="text-sm font-bold text-white/70">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-white/5">
                        <div className={`h-1 rounded-full ${item.color} ${item.bar} transition-all duration-500`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {badges.map((badge, i) => {
              const Icon = badge.icon
              const colors = [
                { bg: "bg-cyan-500/10 text-cyan-400", border: "border-cyan-500/20" },
                { bg: "bg-emerald-500/10 text-emerald-400", border: "border-emerald-500/20" },
                { bg: "bg-violet-500/10 text-violet-400", border: "border-violet-500/20" },
              ]
              return (
                <motion.div
                  key={badge.label}
                  animate={{ y: [0, -10 + i * 2, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4 + i * 0.5,
                    ease: "easeInOut",
                    delay: i * 1.2,
                  }}
                  className={`absolute ${
                    i === 0
                      ? "-top-3 -right-3"
                      : i === 1
                        ? "-bottom-2 -left-4"
                        : "top-1/3 -right-5"
                  }`}
                >
                  <div className={`flex items-center gap-2 rounded-xl border ${colors[i].border} ${colors[i].bg} px-3 py-2 backdrop-blur-sm`}>
                    <Icon className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap text-[10px] font-medium text-white/70">
                      {badge.label}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
