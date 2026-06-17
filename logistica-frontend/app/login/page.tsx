"use client"

import { useAuthStore } from "@/lib/store/auth.store"
import { LoginForm } from "@/components/auth/login-form"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard")
  }, [isAuthenticated, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1E293B] to-[#0F172A]">
      <LoginForm />
    </div>
  )
}
