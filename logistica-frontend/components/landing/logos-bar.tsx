"use client"

const logos = [
  "TechCorp", "LogiMax", "ShipNow", "DistriRed",
  "CargaExpress", "FleetPro", "RutaFácil", "EntregasYA",
]

export function LogosBar() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-black/20 py-12">
      <p
        className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/15"
        style={{ fontFamily: "var(--font-lexend)" }}
      >
        Empresas que confían en nosotros
      </p>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#1E293B] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#1E293B] to-transparent" />
        <div
          className="flex animate-[marquee_35s_linear_infinite] gap-20"
          style={{ width: "fit-content" }}
        >
          {[...logos, ...logos].map((name, i) => {
            const colors = ["text-cyan-400/25", "text-emerald-400/25", "text-violet-400/25", "text-orange-400/25"]
            return (
              <span
                key={`${name}-${i}`}
                className={`select-none text-lg font-semibold tracking-tight ${colors[i % colors.length]} transition-colors duration-200 hover:${colors[i % colors.length].replace("/25", "/50")}`}
                style={{ fontFamily: "var(--font-lexend)" }}
              >
                {name}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
