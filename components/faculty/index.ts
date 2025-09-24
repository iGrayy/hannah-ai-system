// Faculty Module Exports - Organized by Functionality

// 📋 Response Review - Review and approve Hannah's responses
export * from "./response-review"

// 💬 Custom Responses - Add custom responses to common questions
export * from "./custom-responses"

// 🔍 Quality Monitoring - Monitor conversation quality and accuracy
export * from "./quality-monitoring"

// 📚 Knowledge Management - Create and update specialized knowledge base content
export * from "./knowledge-management"

// 📊 Analytics - View analytics on student questions and concerns
export * from "./analytics"

// 🔍 Gap Analysis - Identify knowledge gaps among students (Future)
// export * from "./gap-analysis"

// 🚨 Intervention Flagging - Flag conversations requiring human intervention (Future)
// export * from "./intervention-flagging"

// ===== BACKWARD COMPATIBILITY =====
// Old imports still work during transition
export { FacultyDashboard } from "./dashboard/faculty-dashboard"
export { ResponseManagement } from "./response-management/response-management"
export { KnowledgeBase } from "./knowledge-base/knowledge-base"
export { StudentMonitoring } from "./student-monitoring/student-monitoring"
