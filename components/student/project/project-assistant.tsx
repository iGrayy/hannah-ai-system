"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  Bug,
  Lightbulb,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  MessageSquare,
} from "lucide-react"

interface ProjectIssue {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
  category: "bug" | "feature" | "question" | "help"
  createdAt: Date
  updatedAt: Date
  files?: string[]
  solution?: string
}

const mockIssues: ProjectIssue[] = [
  {
    id: "1",
    title: "React component not rendering properly",
    description: "My component shows undefined instead of the expected data. I think it's related to props passing.",
    status: "resolved",
    priority: "high",
    category: "bug",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    files: ["App.js", "UserCard.js"],
    solution: "The issue was with async data loading. Added proper loading states and null checks.",
  },
  {
    id: "2",
    title: "Database connection timeout",
    description: "Getting timeout errors when trying to connect to MySQL database. Connection works locally but fails on server.",
    status: "in-progress",
    priority: "high",
    category: "bug",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    files: ["config.js", "database.js"],
  },
  {
    id: "3",
    title: "How to implement user authentication?",
    description: "Need guidance on implementing secure user authentication with JWT tokens in my Node.js app.",
    status: "open",
    priority: "medium",
    category: "question",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
  },
]

export function ProjectAssistant() {
  const [issues, setIssues] = useState<ProjectIssue[]>(mockIssues)
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    category: "question" as const,
    priority: "medium" as const,
  })
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="h-4 w-4 text-red-500" />
      case "in-progress": return <Clock className="h-4 w-4 text-yellow-500" />
      case "resolved": return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bug": return <Bug className="h-4 w-4 text-red-500" />
      case "feature": return <Lightbulb className="h-4 w-4 text-blue-500" />
      case "question": return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "help": return <AlertCircle className="h-4 w-4 text-orange-500" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateIssue = () => {
    if (!newIssue.title.trim() || !newIssue.description.trim()) return

    const issue: ProjectIssue = {
      id: Date.now().toString(),
      ...newIssue,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setIssues(prev => [issue, ...prev])
    setNewIssue({
      title: "",
      description: "",
      category: "question",
      priority: "medium",
    })
  }

  return (
    <div className="h-full bg-gray-50">
      <Tabs defaultValue="issues" className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trợ lý dự án</h1>
                <p className="text-gray-600">Nhận hỗ trợ cho dự án và theo dõi vấn đề</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Vấn đề mới
              </Button>
            </div>

            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="issues">Vấn đề của tôi</TabsTrigger>
              <TabsTrigger value="create">Tạo vấn đề</TabsTrigger>
              <TabsTrigger value="help">Hỗ trợ nhanh</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="issues" className="h-full m-0">
            <div className="h-full flex flex-col p-6">
              <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm vấn đề..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="open">Mở</SelectItem>
                      <SelectItem value="in-progress">Đang xử lý</SelectItem>
                      <SelectItem value="resolved">Đã giải quyết</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Issues List */}
                <div className="flex-1 overflow-y-auto space-y-4">
                  {filteredIssues.map((issue) => (
                    <Card key={issue.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getCategoryIcon(issue.category)}
                              <CardTitle className="text-lg">{issue.title}</CardTitle>
                            </div>
                            <CardDescription className="line-clamp-2">
                              {issue.description}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(issue.status)}
                              <span className="text-sm capitalize">{issue.status === 'in-progress' ? 'Đang xử lý' : issue.status === 'open' ? 'Mở' : 'Đã giải quyết'}</span>
                            </div>
                            <Badge className={getPriorityColor(issue.priority)}>
                              {issue.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Đã tạo {issue.createdAt.toLocaleDateString()}</span>
                            {issue.files && (
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>{issue.files.length} tệp</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Xem
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Hỏi Hannah
                            </Button>
                          </div>
                        </div>
                        {issue.solution && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Giải pháp</span>
                            </div>
                            <p className="text-sm text-green-700">{issue.solution}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {filteredIssues.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
                      <p className="text-gray-500">Create your first issue or adjust your filters</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                    <CardTitle>Tạo vấn đề mới</CardTitle>
                    <CardDescription>
                      Mô tả vấn đề/câu hỏi của bạn, Hannah sẽ hỗ trợ bạn giải quyết
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tiêu đề vấn đề</label>
                      <Input
                        placeholder="Mô tả ngắn gọn vấn đề của bạn..."
                        value={newIssue.title}
                        onChange={(e) => setNewIssue(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Mô tả chi tiết</label>
                      <Textarea
                        placeholder="Cung cấp chi tiết về vấn đề: thông báo lỗi, bạn đã thử gì và mong đợi điều gì..."
                        className="min-h-32"
                        value={newIssue.description}
                        onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phân loại</label>
                        <Select value={newIssue.category} onValueChange={(value: any) => setNewIssue(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bug">🐛 Lỗi</SelectItem>
                            <SelectItem value="question">❓ Câu hỏi</SelectItem>
                            <SelectItem value="help">🆘 Hỗ trợ</SelectItem>
                            <SelectItem value="feature">💡 Tính năng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Mức độ ưu tiên</label>
                        <Select value={newIssue.priority} onValueChange={(value: any) => setNewIssue(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">🟢 Thấp</SelectItem>
                            <SelectItem value="medium">🟡 Trung bình</SelectItem>
                            <SelectItem value="high">🔴 Cao</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Tải tệp lên (Tùy chọn)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Kéo thả tệp vào đây hoặc <span className="text-blue-600">chọn tệp</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Hỗ trợ: .js, .py, .java, .cpp, .txt, .log (Tối đa 10MB)
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={handleCreateIssue}
                        disabled={!newIssue.title.trim() || !newIssue.description.trim()}
                        className="flex-1"
                      >
                        Tạo vấn đề
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Hỏi Hannah trực tiếp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="help" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Quick Help Cards */}
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <Bug className="h-12 w-12 text-red-500 mx-auto mb-2" />
                      <CardTitle>Gỡ lỗi mã của tôi</CardTitle>
                      <CardDescription>
                        Hỗ trợ tìm và sửa lỗi trong mã của bạn
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <Code className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                      <CardTitle>Review mã</CardTitle>
                      <CardDescription>
                        Nhận nhận xét về chất lượng mã và thực hành tốt
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                      <CardTitle>Gợi ý triển khai</CardTitle>
                      <CardDescription>
                        Nhận đề xuất cách triển khai tính năng
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
