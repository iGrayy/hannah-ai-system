"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  Users,
  MessageSquare,
  BookOpen,
  Settings,
  Shield,
  Activity,
  Bell,
  Search,
  ChevronDown,
  Menu,
  Brain,
  GraduationCap,
  Database,
  Zap,
  LogOut,
  User,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function AdminLayout({ children, activeSection: propActiveSection, onSectionChange }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [localActiveSection, setLocalActiveSection] = useState(user?.role === "admin" ? "users" : "dashboard")
  const activeSection = propActiveSection || localActiveSection

  console.log("[v0] AdminLayout - activeSection:", activeSection, "user role:", user?.role)

  const facultyNavItems = [
    { id: "dashboard", label: "Bảng điều khiển & Phân tích", icon: BarChart3 },
    { id: "responses", label: "Response Management", icon: MessageSquare },
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
    { id: "quality", label: "Quality Assurance", icon: Shield },
    { id: "students", label: "Student Monitoring", icon: GraduationCap },
  ]

  const adminNavItems = [
    { id: "users", label: "User Management", icon: Users },
    { id: "system", label: "System Configuration", icon: Settings },
    { id: "performance", label: "Performance Monitor", icon: Activity },
    { id: "analytics", label: "Advanced Analytics", icon: BarChart3 },
    { id: "security", label: "Security & Compliance", icon: Shield },
    { id: "integrations", label: "Integration Hub", icon: Zap },
  ]

  const currentNavItems = user?.role === "faculty" ? facultyNavItems : adminNavItems

  const handleSectionChange = (sectionId: string) => {
    console.log("[v0] Section changing to:", sectionId)
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
    console.log("[DEBUG] Toggle sidebar clicked, current state:", sidebarOpen)
    setSidebarOpen(!sidebarOpen)
    console.log("[DEBUG] New sidebar state will be:", !sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              type="button"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <span className="text-base md:text-lg font-semibold">Hannah</span>
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                AI Assistant
              </Badge>
            </div>
          </div>

          <div className="ml-4 md:ml-8 flex items-center gap-2 md:gap-4">
            <Badge variant="outline" className="gap-1 md:gap-2 text-xs">
              {user?.role === "faculty" ? (
                <>
                  <GraduationCap className="h-3 w-3" />
                  <span className="hidden sm:inline">Faculty Module</span>
                  <span className="sm:hidden">Faculty</span>
                </>
              ) : (
                <>
                  <Database className="h-3 w-3" />
                  <span className="hidden sm:inline">Mô-đun Quản trị viên</span>
                  <span className="sm:hidden">QTV</span>
                </>
              )}
            </Badge>
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-48 lg:w-64 rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => console.log("[DEBUG] Dropdown trigger clicked")}
                  type="button"
                >
                  <Avatar className="h-6 w-6 md:h-8 md:w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs bg-gray-200">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg z-[100]">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    console.log("[DEBUG] Logout clicked")
                    logout()
                  }}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={`
            fixed lg:static top-16 left-0 w-64 h-[calc(100vh-4rem)]
            border-r border-gray-200 bg-white z-50 overflow-y-auto
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          style={{
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 300ms ease-in-out'
          }}
        >
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {user?.role === "faculty" ? "Mô-đun Giảng viên" : "Mô-đun Quản trị viên"}
              </h3>
            </div>
            <nav className="space-y-1">
              {currentNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3 h-10"
                  onClick={() => handleSectionChange(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
        </aside>

        <main
          className={`
            flex-1 p-4 md:p-6 transition-all duration-300 ease-in-out
            lg:ml-64
          `}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
