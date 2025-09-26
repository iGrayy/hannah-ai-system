"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  FileText, 
  GitBranch, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Eye,
  Download,
  Upload,
  History,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  Tag
} from "lucide-react"

interface ContentItem {
  id: string
  title: string
  type: "article" | "document" | "video" | "image" | "code"
  category: string
  status: "draft" | "review" | "published" | "archived"
  version: string
  author: string
  lastModified: string
  size: string
  downloads: number
  views: number
}

interface ContentVersion {
  id: string
  contentId: string
  version: string
  author: string
  changes: string
  createdAt: string
  status: "current" | "previous"
}

const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "Giới thiệu về Binary Search Tree",
    type: "article",
    category: "Cấu trúc dữ liệu",
    status: "published",
    version: "v2.1",
    author: "TS. Nguyễn Văn A",
    lastModified: "2024-01-15",
    size: "2.3 MB",
    downloads: 245,
    views: 1250
  },
  {
    id: "2",
    title: "Hướng dẫn cài đặt Java Development Kit",
    type: "document",
    category: "Lập trình Java",
    status: "review",
    version: "v1.3",
    author: "ThS. Trần Thị B",
    lastModified: "2024-01-14",
    size: "5.7 MB",
    downloads: 89,
    views: 456
  },
  {
    id: "3",
    title: "Video: Thuật toán sắp xếp Quick Sort",
    type: "video",
    category: "Giải thuật",
    status: "draft",
    version: "v1.0",
    author: "Dr. Lê Văn C",
    lastModified: "2024-01-13",
    size: "125 MB",
    downloads: 12,
    views: 78
  },
  {
    id: "4",
    title: "Code mẫu: Implement Stack using Array",
    type: "code",
    category: "Cấu trúc dữ liệu",
    status: "published",
    version: "v1.2",
    author: "TS. Phạm Văn D",
    lastModified: "2024-01-12",
    size: "15 KB",
    downloads: 567,
    views: 2340
  }
]

const mockVersions: ContentVersion[] = [
  {
    id: "v1",
    contentId: "1",
    version: "v2.1",
    author: "TS. Nguyễn Văn A",
    changes: "Cập nhật ví dụ và thêm bài tập thực hành",
    createdAt: "2024-01-15",
    status: "current"
  },
  {
    id: "v2",
    contentId: "1",
    version: "v2.0",
    author: "TS. Nguyễn Văn A",
    changes: "Thêm phần giải thích chi tiết về độ phức tạp",
    createdAt: "2024-01-10",
    status: "previous"
  },
  {
    id: "v3",
    contentId: "1",
    version: "v1.0",
    author: "TS. Nguyễn Văn A",
    changes: "Phiên bản đầu tiên",
    createdAt: "2024-01-05",
    status: "previous"
  }
]

export function ContentManagement() {
  const [content, setContent] = useState<ContentItem[]>(mockContent)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showVersionHistory, setShowVersionHistory] = useState(false)

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Đã xuất bản</Badge>
      case "review":
        return <Badge className="bg-yellow-100 text-yellow-800">Đang duyệt</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Bản nháp</Badge>
      case "archived":
        return <Badge variant="secondary">Lưu trữ</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "document":
        return <FileText className="h-4 w-4 text-green-500" />
      case "video":
        return <FileText className="h-4 w-4 text-red-500" />
      case "image":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "code":
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus as any } : item
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nội dung này?")) {
      setContent(prev => prev.filter(item => item.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý nội dung</h1>
          <p className="text-muted-foreground">
            Quản lý phiên bản, cập nhật và kiểm duyệt nội dung hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Nhập nội dung
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm nội dung
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Tổng nội dung</span>
            </div>
            <p className="text-2xl font-bold mt-2">{content.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Đã xuất bản</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {content.filter(item => item.status === "published").length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Chờ duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {content.filter(item => item.status === "review").length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Bản nháp</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {content.filter(item => item.status === "draft").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Quản lý nội dung</TabsTrigger>
          <TabsTrigger value="versions">Lịch sử phiên bản</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách nội dung</CardTitle>
              <CardDescription>
                Quản lý tất cả nội dung trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm nội dung..."
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
                    <SelectItem value="published">Đã xuất bản</SelectItem>
                    <SelectItem value="review">Đang duyệt</SelectItem>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="archived">Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="article">Bài viết</SelectItem>
                    <SelectItem value="document">Tài liệu</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Phiên bản</TableHead>
                    <TableHead>Tác giả</TableHead>
                    <TableHead>Cập nhật</TableHead>
                    <TableHead>Thống kê</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground">{item.size}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type}</Badge>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          {item.version}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{item.author}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.lastModified}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{item.views} views</div>
                          <div>{item.downloads} downloads</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedContent(item)
                              setShowVersionHistory(true)
                            }}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                          <Select 
                            value={item.status} 
                            onValueChange={(value) => handleStatusChange(item.id, value)}
                          >
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Nháp</SelectItem>
                              <SelectItem value="review">Duyệt</SelectItem>
                              <SelectItem value="published">Xuất bản</SelectItem>
                              <SelectItem value="archived">Lưu trữ</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
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

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử phiên bản</CardTitle>
              <CardDescription>
                Theo dõi và quản lý các phiên bản của nội dung
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedContent ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-medium">Lịch sử phiên bản: {selectedContent.title}</h3>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Phiên bản</TableHead>
                        <TableHead>Tác giả</TableHead>
                        <TableHead>Thay đổi</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockVersions.filter(v => v.contentId === selectedContent.id).map((version) => (
                        <TableRow key={version.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <GitBranch className="h-4 w-4" />
                              {version.version}
                            </div>
                          </TableCell>
                          <TableCell>{version.author}</TableCell>
                          <TableCell className="max-w-xs truncate">{version.changes}</TableCell>
                          <TableCell>{version.createdAt}</TableCell>
                          <TableCell>
                            {version.status === "current" ? (
                              <Badge className="bg-green-100 text-green-800">Hiện tại</Badge>
                            ) : (
                              <Badge variant="secondary">Cũ</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              {version.status !== "current" && (
                                <Button variant="ghost" size="sm">
                                  Khôi phục
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Chọn một nội dung từ tab "Quản lý nội dung" để xem lịch sử phiên bản
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt quản lý nội dung</CardTitle>
              <CardDescription>
                Cấu hình quy trình duyệt và quản lý phiên bản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quy trình duyệt</Label>
                  <Select defaultValue="manual">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Tự động</SelectItem>
                      <SelectItem value="manual">Thủ công</SelectItem>
                      <SelectItem value="hybrid">Kết hợp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Số phiên bản lưu trữ</Label>
                  <Select defaultValue="10">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 phiên bản</SelectItem>
                      <SelectItem value="10">10 phiên bản</SelectItem>
                      <SelectItem value="20">20 phiên bản</SelectItem>
                      <SelectItem value="unlimited">Không giới hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Quy tắc tự động phân loại</Label>
                <Textarea 
                  placeholder="Nhập quy tắc phân loại nội dung tự động..."
                  className="min-h-[100px]"
                />
              </div>
              
              <Button>Lưu cài đặt</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Lịch sử phiên bản</DialogTitle>
            <DialogDescription>
              Chi tiết các phiên bản của nội dung đã chọn
            </DialogDescription>
          </DialogHeader>
          {/* Version history content would go here */}
        </DialogContent>
      </Dialog>
    </div>
  )
}
