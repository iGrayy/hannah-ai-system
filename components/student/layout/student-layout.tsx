"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
// Removed search/notification popovers in favor of account dropdown
 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { UserProfileModal } from "../profile/user-profile-modal"
import { useAuth } from "@/contexts/auth-context"
import {
  MessageSquare,
  BookOpen,
  Settings,
  User,
  Home,
  FileText,
  HelpCircle,
  Calendar,
  Code,
  Wrench,
  BarChart3,
  LogOut,
  Menu,
  X,
  FolderPlus,
} from "lucide-react"

interface StudentLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigationItems = [
  { id: "chat", label: "Trò chuyện với Hannah", icon: MessageSquare },
  { id: "resources", label: "Tài nguyên học tập", icon: BookOpen },
  { id: "projects", label: "Dự án", icon: FolderPlus },
]

export function StudentLayout({ children, activeTab, onTabChange }: StudentLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const { user, logout } = useAuth()
  // Removed search/notification UI on the top bar

  const handleLogout = () => {
    logout()
  }

  // No-op effects removed for simplified header

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-y-auto">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-6 w-6 p-0"
              >
                <Menu className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
               
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Student Info removed per request */}
        <div className="border-b border-gray-200" />

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'}`}
                onClick={() => {
                  onTabChange(item.id)
                  // Dispatch custom event for learning chat navigation
                  if (item.id === 'resources') {
                    window.dispatchEvent(new CustomEvent('navigate-to-resources', { detail: 'resources' }))
                  }
                }}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">{item.label}</span>}
              </Button>
            ))}
          </div>
        </nav>

        {/* Footer removed per request */}


      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top Bar with account dropdown on the right */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Bảng điều khiển'}
              </h2>
              <p className="text-sm text-gray-500">
                Chào mừng trở lại! Hannah có thể giúp gì cho bạn hôm nay?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user?.name?.split(' ').map(n => n[0]).join('') || 'SV'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user?.name || 'Nguyen Van A'}</p>
                      <p className="text-sm text-gray-500">SV001 • IT2023</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-50">
                  <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleLogout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-visible">
          {children}
        </div>
      </div>

      {/* Profile Modal */}
      <UserProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />
    </div>
  )
}
