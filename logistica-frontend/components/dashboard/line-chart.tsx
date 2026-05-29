"use client"

interface LineChartProps {
  accentColor?: "cyan" | "emerald" | "violet"
}

const colorMap = {
  cyan: { stroke: "#22d3ee", fill: "rgba(6,182,212,0.08)", glow: "rgba(6,182,212,0.3)" },
  emerald: { stroke: "#34d399", fill: "rgba(52,211,153,0.08)", glow: "rgba(52,211,153,0.3)" },
  violet: { stroke: "#a78bfa", fill: "rgba(139,92,246,0.08)", glow: "rgba(139,92,246,0.3)" },
}

export function LineChart({ accentColor = "cyan" }: LineChartProps) {
  const c = colorMap[accentColor]

  const points = "0,120 40,100 80,110 120,70 160,80 200,50 240,60 280,30 320,45 360,20"
  const areaPoints = `0,120 ${points} 360,120`

  return (
    <div className="relative">
      <svg
        viewBox="0 0 360 130"
        className="h-32 w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.stroke} stopOpacity="0.15" />
            <stop offset="100%" stopColor={c.stroke} stopOpacity="0" />
          </linearGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <polygon points={areaPoints} fill="url(#lineGrad)" />
        <polyline
          points={points}
          fill="none"
          stroke={c.stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
        />
        {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map((x, i) => {
          const y = +(points.split(" ").find((p) => p.startsWith(`${x},`))?.split(",")[1] ?? 0)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill={c.stroke}
              className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )
        })}
      </svg>
      <div className="mt-2 flex justify-between">
        {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"].map((m) => (
          <span key={m} className="text-[10px] text-white/30">{m}</span>
        ))}
      </div>
    </div>
  )
}
