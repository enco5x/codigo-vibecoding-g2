"use client"

import { cn } from "@/lib/utils"

interface FormSectionProps {
  title: string
  description?: string
  className?: string
}

export function FormSection({ title, description, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-white/30">{description}</p>
      )}
      <div className="h-px bg-white/[0.04]" />
    </div>
  )
}
