"use client"

import { useAuthStore } from "@/lib/store/auth.store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/auth/navbar"
import { Sidebar } from "@/components/layout/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const initialized = useAuthStore((s) => s.initialized)
  const init = useAuthStore((s) => s.init)
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push("/login")
    }
  }, [initialized, isAuthenticated, router])

  if (!initialized) return null

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 to-[#0B1120]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Navbar onToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
