"use client"

import { useAuthStore } from "@/lib/store/auth.store"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { MetricCard } from "@/components/dashboard/metric-card"
import { LineChart } from "@/components/dashboard/line-chart"
import { BarChart } from "@/components/dashboard/bar-chart"
import {
  Package,
  Truck,
  TrendingUp,
  Activity,
} from "lucide-react"

export default function Home() {
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Panel de control
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Resumen general del sistema logístico
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total envíos"
          value="1,284"
          change="12.5%"
          changePositive
          icon={Package}
          accentColor="cyan"
        />
        <MetricCard
          title="Rutas activas"
          value="48"
          change="8.2%"
          changePositive
          icon={Truck}
          accentColor="emerald"
        />
        <MetricCard
          title="Ingresos mensuales"
          value="$284.5K"
          change="23.1%"
          changePositive
          icon={TrendingUp}
          accentColor="violet"
        />
        <MetricCard
          title="Uptime sistema"
          value="99.97%"
          change="0.02%"
          changePositive={false}
          icon={Activity}
          accentColor="cyan"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="group rounded-xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/80">Ingresos financieros</h3>
              <p className="text-xs text-white/30">Enero - Octubre 2026</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
              +23.1%
            </span>
          </div>
          <LineChart accentColor="emerald" />
        </div>

        <div className="group rounded-xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/80">Envíos por día</h3>
              <p className="text-xs text-white/30">Últimos 7 días</p>
            </div>
            <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-400">
              +8.5%
            </span>
          </div>
          <BarChart accentColor="violet" />
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-white/80">Estado del sistema</h3>
          <p className="text-xs text-white/30">Todos los módulos operativos</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "API REST", status: "Saludable", color: "text-emerald-400", dot: "bg-emerald-400" },
            { name: "Base de datos", status: "Conectado", color: "text-emerald-400", dot: "bg-emerald-400" },
            { name: "Cache", status: "Operativo", color: "text-emerald-400", dot: "bg-emerald-400" },
            { name: "Cola de tareas", status: "2 pendientes", color: "text-amber-400", dot: "bg-amber-400" },
          ].map((svc) => (
            <div key={svc.name} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
              <span className={cn("h-2 w-2 rounded-full", svc.dot)} />
              <div>
                <p className="text-sm text-white/70">{svc.name}</p>
                <p className={cn("text-xs", svc.color)}>{svc.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


