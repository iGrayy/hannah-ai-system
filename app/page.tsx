"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginPage } from "@/components/login-page"
import { AdminContent } from "@/components/admin-content"
import { TestUI } from "@/components/test-ui"
import { DebugUI } from "@/components/debug-ui"

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

  return <AdminContent />
}
