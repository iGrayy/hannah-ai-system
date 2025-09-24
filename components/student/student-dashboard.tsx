"use client"

import { useState } from "react"
import { StudentLayout } from "./layout/student-layout"
import { ChatInterface } from "./chat/chat-interface"
import { LearningResources } from "./resources/learning-resources"

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("chat")

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <ChatInterface />
      case "resources":
        return <LearningResources />
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
