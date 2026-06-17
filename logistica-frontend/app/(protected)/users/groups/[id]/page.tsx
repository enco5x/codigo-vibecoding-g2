"use client"

import { useParams } from "next/navigation"
import { GroupForm } from "@/components/users/group-form"

export default function EditGroupPage() {
  const params = useParams<{ id: string }>()
  return <GroupForm groupId={Number(params.id)} />
}
