"use client"

import { motion } from "framer-motion"
import { Building2, Settings, MapPin, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: Building2,
    number: "01",
    title: "Registra tu empresa",
    description:
      "Crea tu cuenta en minutos. Configura tu perfil, usuarios y permisos. Sin contratos largos ni instalaciones complejas.",
    accent: "bg-cyan-500/10 text-cyan-400",
    line: "bg-cyan-400",
  },
  {
    icon: Settings,
    number: "02",
    title: "Configura tu flota",
    description:
      "Añade tus vehículos, conductores y rutas. Integra dispositivos GPS y conecta con tus sistemas actuales.",
    accent: "bg-emerald-500/10 text-emerald-400",
    line: "bg-emerald-400",
  },
  {
    icon: MapPin,
    number: "03",
    title: "Activa el tracking",
    description:
      "Monitorea cada envío en tiempo real. Recibe alertas automáticas y mantén a tus clientes informados.",
    accent: "bg-violet-500/10 text-violet-400",
    line: "bg-violet-400",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Optimiza y crece",
    description:
      "Usa dashboards inteligentes y reportes automáticos para tomar decisiones basadas en datos reales.",
    accent: "bg-cyan-500/10 text-cyan-400",
    line: "bg-cyan-400",
  },
]

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-black/20 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
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
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Cómo funciona
          </span>
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-lexend)", color: "white" }}
          >
            Comienza en 4 pasos simples
          </h2>
          <p
            className="mt-4 text-white/35"
            style={{ fontFamily: "var(--font-source-sans)" }}
          >
            Implementa la plataforma en tiempo récord. Nuestro equipo de onboarding te
            acompaña en cada paso.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[23px] hidden w-px bg-gradient-to-b from-cyan-500/30 via-emerald-500/30 via-violet-500/30 to-cyan-500/30 md:block lg:left-[31px]" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isLeft = i % 2 === 0

              return (
                <motion.div
                  key={step.number}
                  variants={stepVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className={`relative flex flex-col gap-6 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                    <div className={`inline-block ${isLeft ? "md:mr-8" : "md:ml-8"}`}>
                      <span
                        className="mb-2 block text-xs font-semibold text-cyan-400"
                        style={{ fontFamily: "var(--font-lexend)" }}
                      >
                        Paso {step.number}
                      </span>
                      <h3
                        className="mb-3 text-xl font-bold tracking-tight sm:text-2xl"
                        style={{ fontFamily: "var(--font-lexend)", color: "white" }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="max-w-md text-sm leading-relaxed text-white/35"
                        style={{ fontFamily: "var(--font-source-sans)" }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-center">
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 ${step.accent} backdrop-blur-sm lg:h-16 lg:w-16`}>
                      <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                    </div>
                  </div>

                  <div className="flex-1" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
