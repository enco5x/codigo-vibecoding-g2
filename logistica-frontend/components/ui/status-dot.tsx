"use client"

import { cn } from "@/lib/utils"

type StatusVariant = "active" | "inactive" | "pending" | "warning" | "info"

interface StatusDotProps {
  variant?: StatusVariant
  label?: string
}

const variants: Record<StatusVariant, string> = {
  active: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]",
  inactive: "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.4)]",
  pending: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]",
  warning: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]",
  info: "bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.4)]",
}

const labelColors: Record<StatusVariant, string> = {
  active: "text-emerald-400",
  inactive: "text-red-400",
  pending: "text-amber-400",
  warning: "text-amber-400",
  info: "text-blue-400",
}

export function StatusDot({ variant = "info", label }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-1.5 w-1.5 rounded-full", variants[variant])} />
      {label && <span className={cn("text-xs font-medium", labelColors[variant])}>{label}</span>}
    </span>
  )
}
