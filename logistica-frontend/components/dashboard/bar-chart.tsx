"use client"

interface BarChartProps {
  accentColor?: "cyan" | "emerald" | "violet"
}

const colorMap = {
  cyan: "rgba(6,182,212,0.6)",
  emerald: "rgba(52,211,153,0.6)",
  violet: "rgba(139,92,246,0.6)",
}

const data = [
  { label: "Lun", value: 65 },
  { label: "Mar", value: 80 },
  { label: "Mié", value: 45 },
  { label: "Jue", value: 90 },
  { label: "Vie", value: 75 },
  { label: "Sáb", value: 50 },
  { label: "Dom", value: 30 },
]

export function BarChart({ accentColor = "violet" }: BarChartProps) {
  const color = colorMap[accentColor]
  const max = Math.max(...data.map((d) => d.value))

  return (
    <div>
      <div className="flex items-end justify-between gap-1.5" style={{ height: 120 }}>
        {data.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-t-sm transition-all duration-500"
              style={{
                height: `${(item.value / max) * 100}%`,
                background: `linear-gradient(to top, ${color}, ${color.replace("0.6", "0.3")})`,
                boxShadow: `0 0 8px ${color.replace("0.6", "0.15")}`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between">
        {data.map((item) => (
          <span key={item.label} className="flex-1 text-center text-[10px] text-white/30">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
