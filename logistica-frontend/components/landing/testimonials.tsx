"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Carlos Mendoza",
    role: "Gerente de Supply Chain",
    company: "DistriRed México",
    content:
      "Redujimos nuestros costos operativos en un 28% durante el primer trimestre. El dashboard en tiempo real nos permite tomar decisiones inmediatas que antes nos tomaban días.",
    rating: 5,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    name: "María Fernanda López",
    role: "Directora de Operaciones",
    company: "LogiMax Colombia",
    content:
      "La integración con SAP fue increíblemente fluida. En dos semanas teníamos todo conectado. El equipo de soporte es excepcional.",
    rating: 5,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Andrés Silva",
    role: "CEO",
    company: "CargaExpress Chile",
    content:
      "Pasamos de 3 sistemas desconectados a una sola plataforma. La visibilidad que tenemos ahora de nuestra operación es total.",
    rating: 5,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Patricia Vargas",
    role: "Jefa de Logística",
    company: "RutaFácil Argentina",
    content:
      "La app para conductores nos cambió la vida. Las firmas digitales y la evidencia fotográfica eliminaron por completo las disputas con clientes.",
    rating: 4,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    name: "Roberto Jiménez",
    role: "VP Operaciones",
    company: "FleetPro Perú",
    content:
      "El ahorro en combustible superó nuestras expectativas. La optimización de rutas con IA nos dio un 32% de reducción en costos de transporte.",
    rating: 5,
    gradient: "from-emerald-500 to-teal-600",
  },
]

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [3, -3]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-3, 3]), {
    stiffness: 300,
    damping: 30,
  })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-violet-400"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Testimonios
          </span>
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-lexend)", color: "white" }}
          >
            Lo que dicen nuestros clientes
          </h2>
          <p
            className="mt-4 text-white/35"
            style={{ fontFamily: "var(--font-source-sans)" }}
          >
            Empresas de toda Latinoamérica confían en Logistica Web para transformar
            sus operaciones.
          </p>
        </motion.div>

        <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-6 break-inside-avoid"
            >
              <TiltCard className="group rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] sm:p-8">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${
                        j < t.rating
                          ? "fill-orange-400 text-orange-400"
                          : "fill-white/5 text-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className="mb-5 text-sm leading-relaxed text-white/50"
                  style={{ fontFamily: "var(--font-source-sans)" }}
                >
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-bold text-white`}
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold text-white/70"
                      style={{ fontFamily: "var(--font-lexend)" }}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs text-white/25">
                      {t.role} &middot; {t.company}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
