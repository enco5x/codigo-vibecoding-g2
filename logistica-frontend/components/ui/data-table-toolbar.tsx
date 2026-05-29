"use client"

import type { ReactNode } from "react"
import { Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DataTableToolbarProps {
  title: string
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  onExport?: () => void
  action?: ReactNode
  children?: ReactNode
}

export function DataTableToolbar({
  title,
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  onExport,
  action,
  children,
}: DataTableToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        {action}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-lg border border-white/5 bg-white/[0.04] pl-9 pr-3 text-sm text-white/70 placeholder:text-white/30 outline-none transition-all duration-200 focus:border-cyan-500/30 focus:bg-white/[0.06] focus:shadow-[0_0_12px_rgba(6,182,212,0.06)]"
          />
        </div>

        {children}

        <div className="flex-1" />

        {onExport && (
          <Button
            onClick={onExport}
            className="bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.98]"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar datos
          </Button>
        )}
      </div>
    </div>
  )
}
