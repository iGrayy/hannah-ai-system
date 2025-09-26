"use client"

import { useState } from "react"
import { StudentLayout } from "./layout/student-layout"
import { ChatInterface } from "./chat/chat-interface"
import { LearningResources } from "./resources/learning-resources"
import { StudentProjects } from "./project/student-projects"

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("chat")

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <ChatInterface />
      case "resources":
        return <LearningResources />
      case "projects":
        return <StudentProjects />
      default:
        return <ChatInterface />
    }
  }

  return (
    <StudentLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </StudentLayout>
  )
}
