"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginPage } from "@/components/shared/auth"
import { AdminContent } from "@/components/admin/dashboard"
import { StudentDashboard } from "@/components/student"
import { TestUI, DebugUI } from "@/components/shared/debug"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  // Temporary: Show test UI for debugging
  // return <DebugUI />

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  // Route based on user role
  if (user.role === "student") {
    return <StudentDashboard />
  }

  return <AdminContent />
}
