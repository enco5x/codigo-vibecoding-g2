"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  className?: string
}

function Checkbox({ checked, onCheckedChange, disabled, id, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded border border-white/20 transition-all duration-200 outline-none",
        checked
          ? "border-cyan-500 bg-cyan-500 text-white"
          : "bg-white/[0.04] hover:border-white/30",
        "focus-visible:ring-2 focus-visible:ring-cyan-500/30",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {checked && <Check className="size-3" />}
    </button>
  )
}

export { Checkbox }
