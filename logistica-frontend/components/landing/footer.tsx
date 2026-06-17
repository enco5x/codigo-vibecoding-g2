"use client"

import { motion } from "framer-motion"
import { Package, Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  producto: [
    { label: "Características", href: "#features" },
    { label: "Precios", href: "#" },
    { label: "Integraciones", href: "#" },
    { label: "App móvil", href: "#" },
  ],
  recursos: [
    { label: "Documentación", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Webinars", href: "#" },
    { label: "API", href: "#" },
  ],
  empresa: [
    { label: "Sobre nosotros", href: "#" },
    { label: "Equipo", href: "#" },
    { label: "Clientes", href: "#" },
    { label: "Contacto", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-black/40 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <a href="#" className="mb-4 flex items-center gap-2.5">
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
            <p
              className="mb-6 max-w-xs text-sm leading-relaxed text-white/25"
              style={{ fontFamily: "var(--font-source-sans)" }}
            >
              Plataforma integral de gestión logística para empresas que buscan
              eficiencia, control y crecimiento en Latinoamérica.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Mail, href: "mailto:hola@logisticaweb.com" },
                { icon: Phone, href: "tel:+525512345678" },
                { icon: MapPin, href: "#" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/25 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {([
            { title: "Producto", links: footerLinks.producto },
            { title: "Recursos", links: footerLinks.recursos },
            { title: "Empresa", links: footerLinks.empresa },
          ] as const).map((col) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h4
                className="mb-4 text-sm font-semibold tracking-tight text-white/50"
                style={{ fontFamily: "var(--font-lexend)" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/25 transition-colors duration-200 hover:text-white/50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center">
          <p className="text-xs text-white/15">
            &copy; {new Date().getFullYear()} Logistica Web. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
