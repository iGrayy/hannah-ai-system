"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
 
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    if (searchOpen) {
      // Focus search input when popover opens
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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
                  <p className="text-xs text-gray-500">Cổng thông tin sinh viên</p>
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
                {navigationItems.find(item => item.id === activeTab)?.label || 'Bảng điều khiển'}
              </h2>
              <p className="text-sm text-gray-500">
                Chào mừng trở lại! Hannah có thể giúp gì cho bạn hôm nay?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Tìm kiếm"
                    onClick={() => setSearchOpen((v) => !v)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Tìm kiếm nhanh</h4>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none"
                        placeholder="Nhập từ khóa (VD: môn học, chủ đề, bài tập...)"
                        ref={searchInputRef}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">Gợi ý: "lịch thi", "học phần web", "điểm danh"</div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Thông báo"
                    onClick={() => setNotifOpen((v) => !v)}
                    className="relative"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0 overflow-hidden">
                  <div className="p-4 border-b">
                    <h4 className="text-sm font-semibold">Thông báo</h4>
                    <p className="text-xs text-muted-foreground">Bạn có 3 thông báo mới</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 hover:bg-accent/50 transition-colors">
                      <p className="text-sm font-medium">Lịch thi học kỳ</p>
                      <p className="text-xs text-muted-foreground mt-1">Lịch thi dự kiến đã được cập nhật. Kiểm tra ngay.</p>
                      <p className="text-[10px] text-muted-foreground mt-1">2 giờ trước</p>
                    </div>
                    <div className="p-4 hover:bg-accent/50 transition-colors">
                      <p className="text-sm font-medium">Phản hồi từ Hannah</p>
                      <p className="text-xs text-muted-foreground mt-1">Câu hỏi về "Component React" đã có phản hồi mới.</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Hôm nay</p>
                    </div>
                    <div className="p-4 hover:bg-accent/50 transition-colors">
                      <p className="text-sm font-medium">Tài nguyên mới</p>
                      <p className="text-xs text-muted-foreground mt-1">"Thiết kế CSDL nâng cao" vừa được thêm vào.</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Hôm qua</p>
                    </div>
                  </div>
                  <div className="p-3 border-t bg-muted/40 text-right">
                    <Button variant="outline" size="sm">Đánh dấu đã đọc</Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Chia sẻ"
                onClick={() => alert("🔗 Đã sao chép liên kết chia sẻ (mô phỏng)")}
              >
                
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
