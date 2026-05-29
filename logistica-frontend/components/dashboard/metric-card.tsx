"use client"

import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change?: string
  changePositive?: boolean
  icon: LucideIcon
  accentColor?: "cyan" | "emerald" | "violet"
}

const accentMap = {
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    glow: "shadow-[0_0_12px_rgba(6,182,212,0.08)]",
    change: "text-cyan-400",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "shadow-[0_0_12px_rgba(52,211,153,0.08)]",
    change: "text-emerald-400",
  },
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    glow: "shadow-[0_0_12px_rgba(139,92,246,0.08)]",
    change: "text-violet-400",
  },
}

export function MetricCard({
  title,
  value,
  change,
  changePositive = true,
  icon: Icon,
  accentColor = "cyan",
}: MetricCardProps) {
  const accent = accentMap[accentColor]

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]",
      accent.glow
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-white/40 uppercase">
            {title}
          </p>
          <p className="text-2xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          accent.bg
        )}>
          <Icon className={cn("h-4 w-4", accent.text)} />
        </div>
      </div>
      {change && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn("text-xs font-medium", changePositive ? accent.change : "text-red-400")}>
            {changePositive ? "↑" : "↓"} {change}
          </span>
          <span className="text-xs text-white/30">vs mes anterior</span>
        </div>
      )}
    </div>
  )
}
