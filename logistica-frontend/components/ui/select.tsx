"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectItem {
  value: string
  label: string
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  required?: boolean
  items?: SelectItem[]
}

function Select({
  value,
  onValueChange,
  placeholder,
  disabled,
  className,
  id,
  name,
  required,
  items = [],
}: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const selected = items.find((item) => item.value === value)

  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <select
        id={id}
        name={name}
        required={required}
        value={value ?? ""}
        onChange={(e) => onValueChange?.(e.target.value)}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <button
        ref={triggerRef}
        type="button"
        id={id ? `${id}-trigger` : undefined}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={id ? `${id}-listbox` : undefined}
        aria-label={placeholder}
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(true)
          }
        }}
        className={cn(
          "flex h-9 w-full min-w-0 cursor-default items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white/80 transition-all duration-200 outline-none focus-visible:border-cyan-500/40 focus-visible:ring-2 focus-visible:ring-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-50",
          !selected && "text-white/30",
          className
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-white/40 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1 w-full min-w-0 rounded-lg border border-white/10 bg-[#12122a] p-1 shadow-lg shadow-black/40"
        >
          {items.length === 0 && (
            <div className="px-3 py-2 text-sm text-white/40">Sin opciones</div>
          )}
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              role="option"
              aria-selected={item.value === value}
              disabled={disabled}
              onClick={() => {
                onValueChange?.(item.value)
                setOpen(false)
                triggerRef.current?.focus()
              }}
              className={cn(
                "flex w-full cursor-default items-center rounded-md px-3 py-2 text-sm transition-colors outline-none",
                item.value === value
                  ? "bg-cyan-500/10 text-cyan-300"
                  : "text-white/80 hover:bg-cyan-500/15 hover:text-cyan-300"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { Select }
