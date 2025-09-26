"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function SimpleAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    console.log("[SIMPLE] Toggle sidebar clicked, current state:", sidebarOpen)
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = () => {
    console.log("[SIMPLE] Logout clicked")
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={toggleSidebar}
              variant="outline"
              size="sm"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Hannah AI</h1>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 p-2 bg-green-100 hover:bg-green-200"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-gray-500">{user?.role}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-gray-100">
                  <User className="mr-2 h-4 w-4" />
                  Hồ sơ
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100">
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`
            w-64 bg-white border-r border-gray-200 h-[calc(100vh-73px)]
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          style={{
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
          }}
        >
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              {user?.role === "faculty" ? "Mô-đun Giảng viên" : "Mô-đun Quản trị"}
            </h3>
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Bảng điều khiển
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Người dùng
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Cài đặt
              </Button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Nội dung chính</h2>
            <p>Trạng thái sidebar: {sidebarOpen ? "Mở" : "Đóng"}</p>
            <p>Người dùng: {user?.name} ({user?.role})</p>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
