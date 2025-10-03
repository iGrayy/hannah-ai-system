"use client"

import { useState } from "react"
import { FixedAdminLayout } from "@/components/shared/layouts"
import { useAuth } from "@/contexts/auth-context"

// Import actual components
import { AdminUserManagement } from "../user-management/admin-user-management"
import { AdminSystemConfig } from "../system/admin-system-config"
import { AdminPerformance } from "../system/admin-performance"
import { AdminIntegrations } from "../system/admin-integrations"

import { AdminDashboard } from "./admin-dashboard"
import { KnowledgeBaseManagement } from "../knowledge/knowledge-base-management"


// Faculty components (will be imported from faculty module)
import { FacultyDashboard } from "../../faculty/dashboard/faculty-dashboard"
import { ResponseManagement } from "../../faculty/responses/response-management"
import { MultimediaKnowledgeBase } from "../../faculty/knowledge/knowledge-base"
import { StudentMonitoring } from "../../faculty/students/student-monitoring"
import { LearningProgressTracker } from "../../faculty/quality/learning-progress-tracker"
import { UserProfile } from "../../shared/common/user-profile"



export function AdminContent() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState(user?.role === "admin" ? "dashboard" : "dashboard")

  const renderContent = () => {
    if (user?.role === "faculty") {
      switch (activeSection) {
        case "dashboard":
          return <FacultyDashboard />
        case "responses":
          return <ResponseManagement />
        case "knowledge":
          return <MultimediaKnowledgeBase />
        case "quality":
          return <LearningProgressTracker />
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
        case "dashboard":
          return <AdminDashboard />
        case "users":
          return <AdminUserManagement />
        case "system":
          return <AdminSystemConfig />
        case "performance":
          return <AdminPerformance />
        case "integrations":
          return <AdminIntegrations />
        case "knowledge":
          return <KnowledgeBaseManagement />
        case "profile":
          return <UserProfile />
        default:
          return <AdminDashboard />
      }
    }
  }

  return (
    <FixedAdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </FixedAdminLayout>
  )
}
