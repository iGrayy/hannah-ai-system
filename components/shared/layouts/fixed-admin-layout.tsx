"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Menu, User, Settings, LogOut, ChevronDown, Brain, GraduationCap, Database } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function FixedAdminLayout({ children, activeSection: propActiveSection, onSectionChange }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [localActiveSection, setLocalActiveSection] = useState(user?.role === "admin" ? "users" : "dashboard")
  const activeSection = propActiveSection || localActiveSection

  const facultyNavItems = [
    { id: "dashboard", label: "Bảng điều khiển & Phân tích" },
    { id: "responses", label: "Quản lý phản hồi" },
    { id: "knowledge", label: "Kho tri thức" },
    { id: "quality", label: "Đảm bảo chất lượng" },
    { id: "students", label: "Theo dõi sinh viên" },
  ]

  const adminNavItems = [
    { id: "dashboard", label: "Bảng điều khiển" },
    { id: "users", label: "Quản lý người dùng" },
    { id: "system", label: "Cấu hình hệ thống" },
    { id: "performance", label: "Giám sát hiệu năng" },
    { id: "analytics", label: "Phân tích & Báo cáo" },
    { id: "security", label: "Bảo mật & Tuân thủ" },
    { id: "integrations", label: "Kết nối tích hợp" },
    { id: "knowledge", label: "Quản lý kho tri thức" },
    { id: "content", label: "Quản lý nội dung" },
    { id: "ai-training", label: "Huấn luyện dữ liệu" },
  ]

  const currentNavItems = user?.role === "faculty" ? facultyNavItems : adminNavItems

  const handleSectionChange = (sectionId: string) => {
    console.log("[FIXED] Section changing to:", sectionId)
    if (onSectionChange) {
      onSectionChange(sectionId)
    } else {
      setLocalActiveSection(sectionId)
    }
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const toggleSidebar = () => {
    console.log("[FIXED] Toggle sidebar clicked, current state:", sidebarOpen)
    setSidebarOpen(!sidebarOpen)
  }

  const toggleDropdown = () => {
    console.log("[FIXED] Toggle dropdown clicked, current state:", dropdownOpen)
    setDropdownOpen(!dropdownOpen)
  }

  const handleLogout = () => {
    console.log("[FIXED] Logout clicked")
    setDropdownOpen(false)
    logout()
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header - Fixed */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200 px-4 py-3 z-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors"
              type="button"
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-3">
              <Brain className="h-7 w-7 text-slate-600" />
              <span className="text-xl font-bold text-slate-800">Hannah</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">AI Assistant</span>
            </div>
          </div>

          {/* Center */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-2 rounded-full shadow-sm">
              {user?.role === "faculty" ? (
              <>
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm font-medium">Mô-đun Giảng viên</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                <span className="text-sm font-medium">Mô-đun Quản trị viên</span>
              </>
            )}
          </div>

          {/* Right side - User dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              type="button"
            >
              <div className="h-9 w-9 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
                <span className="text-xs text-slate-600 capitalize font-medium">{user?.role}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500 hidden md:block" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl z-50">
                <div className="py-2">
                  <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-800">Tài khoản của tôi</p>
                    <p className="text-xs text-slate-600">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      handleSectionChange('profile')
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                  >
                    <User className="mr-3 h-4 w-4" />
                    Hồ sơ cá nhân
                  </button>
                  <button
                    onClick={() => {
                      console.log("Settings clicked")
                      setDropdownOpen(false)
                      alert("⚙️ Cài đặt hệ thống sẽ được triển khai sau!")
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Cài đặt hệ thống
                  </button>
                  <div className="border-t border-slate-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area - Flex */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed */}
        <aside
          className={`
            bg-white/95 backdrop-blur-sm shadow-lg border-r border-slate-200
            transition-all duration-500 ease-in-out flex-shrink-0
            ${sidebarOpen ? 'w-64' : 'w-0'}
            fixed lg:static top-[73px] left-0 z-40 h-[calc(100vh-73px)] lg:h-full
            ${!sidebarOpen ? 'overflow-hidden' : ''}
          `}
        >
          {sidebarOpen && (
            <div className="h-full flex flex-col w-64 animate-in fade-in-0 slide-in-from-left-4 duration-300">
              {/* Sidebar Header */}
              <div className="p-6 flex-shrink-0">
                <div className="mb-6 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200 animate-in fade-in-0 slide-in-from-top-2 duration-500 delay-100">
                  <h3 className="text-sm font-bold text-slate-700 mb-1">
                    {user?.role === "faculty" ? "Mô-đun Giảng viên" : "Mô-đun Quản trị viên"}
                  </h3>
                  <p className="text-xs text-slate-600">Quản lý hệ thống Hannah AI</p>
                </div>
              </div>

              {/* Sidebar Navigation - Scrollable */}
              <nav className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="space-y-2">
                  {currentNavItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => handleSectionChange(item.id)}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300
                        animate-in fade-in-0 slide-in-from-left-2 duration-400
                        ${activeSection === item.id
                          ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold shadow-md transform scale-105'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-800 hover:translate-x-1'
                        }
                      `}
                      style={{ animationDelay: `${200 + index * 50}ms` }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          )}
        </aside>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-white/95 backdrop-blur-sm">
          <div className="p-6">
            {children}
          </div>
        </main>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  )
}
