"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { SimpleAdminLayout } from "@/components/simple-admin-layout"
import { FixedAdminLayout } from "@/components/fixed-admin-layout"
import { FacultyDashboard } from "@/components/faculty-dashboard"
import { AdminUserManagement } from "@/components/admin-user-management"
import { AdminSystemConfig } from "@/components/admin-system-config"
import { AdminPerformance } from "@/components/admin-performance"
import { AdminAnalytics } from "@/components/admin-analytics"
import { AdminSecurity } from "@/components/admin-security"
import { AdminIntegrations } from "@/components/admin-integrations"
import { ResponseManagement } from "@/components/response-management"
import { KnowledgeBase } from "@/components/knowledge-base"
import { QualityAssurance } from "@/components/quality-assurance"
import { StudentMonitoring } from "@/components/student-monitoring"
import { UserProfile } from "@/components/user-profile"
import { useAuth } from "@/contexts/auth-context"

export function AdminContent() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState(user?.role === "admin" ? "users" : "dashboard")

  const renderContent = () => {
    if (user?.role === "faculty") {
      switch (activeSection) {
        case "dashboard":
          return <FacultyDashboard />
        case "responses":
          return <ResponseManagement />
        case "knowledge":
          return <KnowledgeBase />
        case "quality":
          return <QualityAssurance />
        case "students":
          return <StudentMonitoring />
        case "profile":
          return <UserProfile />
        default:
          return <FacultyDashboard />
      }
    } else {
      // Admin role
      switch (activeSection) {
        case "users":
          return <AdminUserManagement />
        case "system":
          return <AdminSystemConfig />
        case "performance":
          return <AdminPerformance />
        case "analytics":
          return <AdminAnalytics />
        case "security":
          return <AdminSecurity />
        case "integrations":
          return <AdminIntegrations />
        case "profile":
          return <UserProfile />
        default:
          return <AdminUserManagement />
      }
    }
  }

  return (
    <FixedAdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </FixedAdminLayout>
  )
}
