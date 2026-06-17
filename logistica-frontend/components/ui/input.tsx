import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white/80 placeholder:text-white/30 transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white/60 focus-visible:border-cyan-500/40 focus-visible:ring-2 focus-visible:ring-cyan-500/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400/50 aria-invalid:ring-2 aria-invalid:ring-red-400/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
