// Admin Module Exports - Organized by Functionality

// 👥 User Management - Manage user accounts and permissions
export * from "./user-management"

// ⚙️ System Configuration - Configure system settings and integration
export * from "./system-configuration"

// 📈 Performance Monitoring - Monitor system performance and usage
export * from "./performance-monitoring"

// 🗂️ Knowledge Structure - Manage knowledge base structure (Future)
// export * from "./knowledge-structure"

// 📝 Content Versioning - Handle content versioning and updates (Future)
// export * from "./content-versioning"

// 📊 Reports & Analytics - Generate system reports and analytics (Future)
// export * from "./reports-analytics"

// 🤖 Model Management - Manage model parameters and training data (Future)
// export * from "./model-management"

// ===== BACKWARD COMPATIBILITY =====
// Old imports still work during transition
export { AdminDashboard } from "../admin-dashboard"
export { UserManagement } from "../user-management"
export { SystemConfiguration } from "../system-configuration"
