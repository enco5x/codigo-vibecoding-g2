"use client"

import { useParams } from "next/navigation"
import { UserForm } from "@/components/users/user-form"

export default function EditUserPage() {
  const params = useParams<{ id: string }>()
  return <UserForm userId={Number(params.id)} />
}
