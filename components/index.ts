// Hannah AI System - Component Exports
// Organized by module for better maintainability

// ===== ADMIN MODULE =====
export * from "./admin"

// ===== FACULTY MODULE =====
export * from "./faculty"

// ===== SHARED COMPONENTS =====
export * from "./shared"

// ===== BACKWARD COMPATIBILITY =====
// Keep existing imports working during transition

// Admin Components (Root level)
export { AdminDashboard } from "./admin-dashboard"
export { UserManagement } from "./user-management"
export { SystemConfiguration } from "./system-configuration"
export { PerformanceMonitoring } from "./performance-monitoring"
export { SecurityCompliance } from "./security-compliance"
export { IntegrationManagement } from "./integration-management"
export { ReportingAnalytics } from "./reporting-analytics"

// Faculty Components (Root level)
export { FacultyDashboard } from "./faculty-dashboard"
export { ResponseManagement } from "./response-management"
export { KnowledgeBase } from "./knowledge-base"
export { MultimediaKnowledgeBase } from "./multimedia-knowledge-base"
export { StudentMonitoring } from "./student-monitoring"
export { QualityAssurance } from "./quality-assurance"
export { CustomFAQManagement } from "./custom-faq-management"
export { RelatedKnowledgeModal } from "./related-knowledge-modal"

// Shared Components (Root level)
export { LoginForm } from "./login-form"
export { Sidebar } from "./sidebar"
export { Header } from "./header"
export { Navigation } from "./navigation"

// Modal Components
export { ResponseDetailModal } from "./response-detail-modal"
export { StudentDetailModal } from "./student-detail-modal"
export { KnowledgeItemDetailModal } from "./knowledge-item-detail-modal"
