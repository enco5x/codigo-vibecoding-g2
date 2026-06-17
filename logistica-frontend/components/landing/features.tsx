"use client"

import { motion } from "framer-motion"
import {
  MapPin,
  LayoutDashboard,
  Route,
  Blocks,
  Smartphone,
} from "lucide-react"

const features = [
  {
    icon: MapPin,
    title: "Tracking en tiempo real",
    description:
      "Monitorea tu flota y envíos con mapa interactivo. Geolocalización precisa, alertas de desvío y ETA dinámico.",
    accent: "cyan",
    featured: true,
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard de operaciones",
    description:
      "KPIs, alertas inteligentes y reportes automáticos. Visualiza el rendimiento de tu operación en tiempo real.",
    accent: "emerald",
    featured: false,
  },
  {
    icon: Route,
    title: "Rutas optimizadas con IA",
    description:
      "Reduce costos de combustible hasta un 30% con rutas inteligentes. Algoritmos de optimización multi-variable.",
    accent: "violet",
    featured: false,
  },
  {
    icon: Blocks,
    title: "Integración ERP / SAP",
    description:
      "Conecta con tus sistemas existentes. Compatible con SAP, Oracle, facturación electrónica y APIs REST.",
    accent: "cyan",
    featured: false,
  },
  {
    icon: Smartphone,
    title: "App móvil para conductores",
    description:
      "Firma digital, evidencia fotográfica y navegación GPS. Tus conductores siempre conectados.",
    accent: "emerald",
    featured: false,
  },
]

const accentMap: Record<string, { bg: string; text: string }> = {
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400" },
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Características
          </span>
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-lexend)", color: "white" }}
          >
            Todo lo que necesitas para gestionar tu logística
          </h2>
          <p
            className="mt-4 text-white/35"
            style={{ fontFamily: "var(--font-source-sans)" }}
          >
            Una plataforma completa diseñada para optimizar cada aspecto de tu cadena
            de suministro.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            const isFeatured = feature.featured
            const a = accentMap[feature.accent]

            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={`group rounded-xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] ${
                  isFeatured ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${a.bg} ${a.text}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3
                  className="mb-2 text-lg font-semibold tracking-tight text-white/80"
                  style={{ fontFamily: "var(--font-lexend)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-white/35"
                  style={{ fontFamily: "var(--font-source-sans)" }}
                >
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
