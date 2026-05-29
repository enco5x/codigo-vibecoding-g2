import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 placeholder:text-white/30 transition-all duration-200 outline-none focus-visible:border-cyan-500/40 focus-visible:ring-2 focus-visible:ring-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400/50 aria-invalid:ring-2 aria-invalid:ring-red-400/15",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
