"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Users, Search, Edit, Trash2, Upload, UserPlus, Shield, Clock, Eye, Key, Settings } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "faculty" | "student"
  status: "active" | "inactive" | "awaiting_verification"
  department: string
  lastLogin: string
  createdAt: string
  avatar: string
  permissions: string[]
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Nguyen Van A",
    email: "nguyen.a@university.edu",
    role: "faculty",
    status: "active",
    department: "Computer Science",
    lastLogin: "2024-01-15 09:30",
    createdAt: "2023-09-01",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["review_responses", "manage_knowledge", "view_analytics"],
  },
  {
    id: "2",
    name: "Prof. Tran Thi B",
    email: "tran.b@university.edu",
    role: "admin",
    status: "active",
    department: "IT Administration",
    lastLogin: "2024-01-15 08:15",
    createdAt: "2023-08-15",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["full_access"],
  },
  {
    id: "3",
    name: "Le Van C",
    email: "le.c@student.university.edu",
    role: "student",
    status: "active",
    department: "Computer Science",
    lastLogin: "2024-01-15 14:20",
    createdAt: "2023-09-15",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["ask_questions", "view_responses"],
  },
  {
    id: "4",
    name: "Pham Thi D",
    email: "pham.d@university.edu",
    role: "faculty",
    status: "awaiting_verification",
    department: "Software Engineering",
    lastLogin: "Never",
    createdAt: "2024-01-10",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: [],
  },
]

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full system access and management",
    permissions: ["full_access", "user_management", "system_config", "security_settings"],
    userCount: 3,
  },
  {
    id: "2",
    name: "Faculty",
    description: "Teaching staff with content management access",
    permissions: ["review_responses", "manage_knowledge", "view_analytics", "student_monitoring"],
    userCount: 15,
  },
  {
    id: "3",
    name: "Student",
    description: "Students with basic interaction access",
    permissions: ["ask_questions", "view_responses", "access_materials"],
    userCount: 342,
  },
]

const allPermissions = [
  { id: "full_access", name: "Full Access", description: "Complete system access" },
  { id: "user_management", name: "User Management", description: "Create, edit, delete users" },
  { id: "system_config", name: "System Configuration", description: "Modify system settings" },
  { id: "security_settings", name: "Security Settings", description: "Manage security policies" },
  { id: "review_responses", name: "Review Responses", description: "Review AI responses" },
  { id: "manage_knowledge", name: "Manage Knowledge", description: "Edit knowledge base" },
  { id: "view_analytics", name: "View Analytics", description: "Access analytics dashboard" },
  { id: "student_monitoring", name: "Student Monitoring", description: "Monitor student progress" },
  { id: "ask_questions", name: "Ask Questions", description: "Interact with AI assistant" },
  { id: "view_responses", name: "View Responses", description: "See AI responses" },
  { id: "access_materials", name: "Access Materials", description: "View learning materials" },
]

export function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [activeTab, setActiveTab] = useState("users")

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRole && matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-600">
            Đang hoạt động
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Ngừng hoạt động</Badge>
      case "awaiting_verification":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-600">
            Chờ xác minh
          </Badge>
        )
      default:
        return null
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>
      case "faculty":
        return <Badge variant="default">Giảng viên</Badge>
      case "student":
        return <Badge variant="secondary">Sinh viên</Badge>
      default:
        return null
    }
  }

  const toggleUserStatus = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      const newStatus = user.status === "active" ? "inactive" : "active"
      const action = newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"

      if (confirm(`Bạn có chắc chắn muốn ${action} tài khoản của ${user.name}?`)) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, status: newStatus as "active" | "inactive" | "awaiting_verification" } : u,
          ),
        )
        alert(`✅ Đã ${action} tài khoản của ${user.name}`)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Quản lý người dùng</h1>
          <p className="text-muted-foreground">Quản lý tài khoản, vai trò và quyền truy cập cho hệ thống Hannah</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("📁 Chức năng import users từ CSV/Excel sẽ được triển khai sau!")}
          >
            <Upload className="h-4 w-4 mr-2" />
            Nhập người dùng
          </Button>
          <Button size="sm" onClick={() => setIsAddingUser(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Tổng người dùng</span>
            </div>
            <p className="text-2xl font-bold mt-2">{users.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Đang hoạt động</span>
            </div>
            <p className="text-2xl font-bold mt-2">{users.filter((u) => u.status === "active").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Chờ xác minh</span>
            </div>
            <p className="text-2xl font-bold mt-2">{users.filter((u) => u.status === "awaiting_verification").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Giảng viên</span>
            </div>
            <p className="text-2xl font-bold mt-2">{users.filter((u) => u.role === "faculty").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="roles">Vai trò & Quyền</TabsTrigger>
          <TabsTrigger value="audit">Nhật ký hệ thống</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm người dùng theo tên, email hoặc khoa..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Lọc theo vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả vai trò</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Người dùng ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Khoa</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Đăng nhập gần nhất</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-sm">{user.department}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chi tiết người dùng</DialogTitle>
                                <DialogDescription>Xem và chỉnh sửa thông tin người dùng và quyền truy cập</DialogDescription>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-6">
                                  <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                                      <AvatarFallback>
                                        {selectedUser.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                                      <p className="text-muted-foreground">{selectedUser.email}</p>
                                      <div className="flex gap-2 mt-2">
                                        {getRoleBadge(selectedUser.role)}
                                        {getStatusBadge(selectedUser.status)}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Khoa</label>
                                      <p className="text-sm text-muted-foreground">{selectedUser.department}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Ngày tạo</label>
                                      <p className="text-sm text-muted-foreground">{selectedUser.createdAt}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Quyền</label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {allPermissions.map((permission) => (
                                        <div key={permission.id} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={permission.id}
                                            checked={selectedUser.permissions.includes(permission.id)}
                                          />
                                          <label htmlFor={permission.id} className="text-sm">
                                            {permission.name}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex justify-between pt-4 border-t">
                                    <Button variant="outline">
                                      <Key className="h-4 w-4 mr-2" />
                                      Đặt lại mật khẩu
                                    </Button>
                                    <div className="flex gap-2">
                                      <Button variant="outline">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Sửa
                                      </Button>
                                      <Switch
                                        checked={selectedUser.status === "active"}
                                        onCheckedChange={() => toggleUserStatus(selectedUser.id)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {role.name}
                    <Badge variant="outline">{role.userCount} người dùng</Badge>
                  </CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quyền:</label>
                    <div className="space-y-1">
                      {role.permissions.map((permId) => {
                        const perm = allPermissions.find((p) => p.id === permId)
                        return perm ? (
                          <div key={permId} className="text-sm text-muted-foreground">
                            • {perm.name}
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Sửa
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Cấu hình
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nhật ký hệ thống</CardTitle>
              <CardDescription>Theo dõi hoạt động người dùng và thay đổi hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Đăng nhập thành công</p>
                    <p className="text-xs text-muted-foreground">Dr. Nguyen Van A đăng nhập từ 192.168.1.100</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 giờ trước</span>
                </div>
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cập nhật vai trò người dùng</p>
                    <p className="text-xs text-muted-foreground">Le Van C đổi vai trò từ Sinh viên sang Giảng viên</p>
                  </div>
                  <span className="text-xs text-muted-foreground">5 giờ trước</span>
                </div>
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nỗ lực đăng nhập thất bại</p>
                    <p className="text-xs text-muted-foreground">Nhiều lần thất bại cho admin@university.edu</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1 ngày trước</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
