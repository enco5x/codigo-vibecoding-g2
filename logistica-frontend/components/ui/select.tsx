"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
}

function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white/80 transition-all duration-200 outline-none focus-visible:border-cyan-500/40 focus-visible:ring-2 focus-visible:ring-cyan-500/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
