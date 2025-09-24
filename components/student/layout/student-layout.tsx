"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserProfileModal } from "../profile/user-profile-modal"
import { useAuth } from "@/contexts/auth-context"
import {
  MessageSquare,
  BookOpen,
  Settings,
  User,
  Bell,
  Search,
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
} from "lucide-react"

interface StudentLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigationItems = [
  { id: "chat", label: "Chat with Hannah", icon: MessageSquare },
  { id: "resources", label: "Learning Resources", icon: BookOpen },
]

export function StudentLayout({ children, activeTab, onTabChange }: StudentLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex h-screen bg-gray-50">
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
                <div>
                  <h1 className="font-bold text-gray-900">Hannah AI</h1>
                  <p className="text-xs text-gray-500">Student Portal</p>
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

        {/* Student Info */}
        <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div
            className={`${isCollapsed ? 'flex justify-center' : 'flex items-center gap-3'} cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors`}
            onClick={() => setShowProfileModal(true)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'SV'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="font-medium text-gray-900">{user?.name || 'Nguyen Van A'}</p>
                <p className="text-sm text-gray-500">SV001 • IT2023</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'}`}
                onClick={() => onTabChange(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">{item.label}</span>}
              </Button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'}`}
              onClick={() => setShowProfileModal(true)}
            >
              <User className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Hồ sơ</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'}`}
            >
              <Settings className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Cài đặt</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} text-red-600 hover:text-red-700 hover:bg-red-50`}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Đăng xuất</span>}
            </Button>
          </div>
        </div>


      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500">
                Welcome back! How can Hannah help you today?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
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
