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
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload"
import { PDFModal } from "@/components/ui/pdf-modal"
import {
  Database,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  BookOpen,
  Tag,
  Users,
  BarChart3,
  FileText,
  Eye,
  Clock,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  GraduationCap,
  Check,
  X,
  MoreHorizontal
} from "lucide-react"

interface KnowledgeContent {
  id: string
  title: string
  description: string
  type: "pdf"
  subjectCode: string
  subjectName: string
  semester: string
  tags: string[]
  status: "pending" | "approved" | "rejected" | "draft"
  createdBy: string
  createdAt: string
  updatedAt: string
  fileUrl?: string
  fileSize?: string
  pageCount?: number
  viewCount: number
  downloadCount: number
}

interface KnowledgeStats {
  totalContent: number
  pendingApproval: number
  approvedContent: number
  rejectedContent: number
  totalViews: number
  totalDownloads: number
}

const mockContent: KnowledgeContent[] = [
  {
    id: "1",
    title: "PRO192 - Hướng dẫn OOP",
    description: "Tài liệu hướng dẫn chi tiết về lập trình hướng đối tượng với Java.",
    type: "pdf",
    subjectCode: "PRO192",
    subjectName: "Lập trình hướng đối tượng",
    semester: "Kỳ 2",
    tags: ["Java", "OOP", "PRO192"],
    status: "approved",
    createdBy: "TS. Nguyễn Văn A",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-12",
    fileUrl: "/documents/pro192-oop-guide.pdf",
    fileSize: "3.1 MB",
    pageCount: 88,
    viewCount: 450,
    downloadCount: 120
  },
  {
    id: "2",
    title: "DBI202 - Thiết kế CSDL",
    description: "Các nguyên tắc và kỹ thuật thiết kế cơ sở dữ liệu quan hệ.",
    type: "pdf",
    subjectCode: "DBI202",
    subjectName: "Hệ quản trị CSDL",
    semester: "Kỳ 3",
    tags: ["Database", "SQL", "DBI202"],
    status: "pending",
    createdBy: "ThS. Trần Thị B",
    createdAt: "2024-03-05",
    updatedAt: "2024-03-05",
    fileSize: "1.8 MB",
    pageCount: 50,
    viewCount: 32,
    downloadCount: 5
  },
  {
    id: "3",
    title: "SWE101 - Quy trình phát triển phần mềm",
    description: "Tổng quan về các mô hình và quy trình trong phát triển phần mềm.",
    type: "pdf",
    subjectCode: "SWE101",
    subjectName: "Nhập môn Kỹ thuật phần mềm",
    semester: "Kỳ 4",
    tags: ["Software Engineering", "Agile", "Scrum"],
    status: "approved",
    createdBy: "TS. Lê Văn C",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-21",
    fileUrl: "/documents/swe101-process.pdf",
    fileSize: "2.2 MB",
    pageCount: 65,
    viewCount: 312,
    downloadCount: 98
  },
  {
    id: "4",
    title: "CSD201 - Cấu trúc dữ liệu và giải thuật",
    description: "Bài giảng về cây và đồ thị.",
    type: "pdf",
    subjectCode: "CSD201",
    subjectName: "Cấu trúc dữ liệu và giải thuật",
    semester: "Kỳ 3",
    tags: ["Data Structures", "Graph", "Tree"],
    status: "rejected",
    createdBy: "ThS. Phạm Văn D",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-17",
    fileUrl: "/documents/csd201-graphs.pdf",
    fileSize: "4.5 MB",
    pageCount: 110,
    viewCount: 55,
    downloadCount: 12
  }
]

const mockStats: KnowledgeStats = {
  totalContent: 247,
  pendingApproval: 15,
  approvedContent: 198,
  rejectedContent: 34,
  totalViews: 12450,
  totalDownloads: 3420
}

export function KnowledgeBaseManagement() {
  const [content, setContent] = useState<KnowledgeContent[]>(mockContent)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContent, setSelectedContent] = useState<KnowledgeContent | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [semesterFilter, setSemesterFilter] = useState<string>("all")
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.createdBy.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesSemester = semesterFilter === "all" || item.semester === semesterFilter

    return matchesSearch && matchesStatus && matchesSemester
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Đã duyệt</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Chờ duyệt</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Từ chối</Badge>
      case "draft":
        return <Badge variant="secondary"><Edit className="h-3 w-3 mr-1" />Bản nháp</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "video":
        return <Eye className="h-4 w-4 text-blue-500" />
      case "document":
        return <BookOpen className="h-4 w-4 text-green-500" />
      case "link":
        return <Database className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleApprove = (id: string) => {
    setContent(prev => prev.map(item =>
      item.id === id ? { ...item, status: "approved" as const, updatedAt: new Date().toISOString().split('T')[0] } : item
    ))
  }

  const handleReject = (id: string) => {
    setContent(prev => prev.map(item =>
      item.id === id ? { ...item, status: "rejected" as const, updatedAt: new Date().toISOString().split('T')[0] } : item
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nội dung này?")) {
      setContent(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) return

    switch (action) {
      case "approve":
        setContent(prev => prev.map(item =>
          selectedItems.includes(item.id)
            ? { ...item, status: "approved" as const, updatedAt: new Date().toISOString().split('T')[0] }
            : item
        ))
        break
      case "reject":
        setContent(prev => prev.map(item =>
          selectedItems.includes(item.id)
            ? { ...item, status: "rejected" as const, updatedAt: new Date().toISOString().split('T')[0] }
            : item
        ))
        break
      case "delete":
        if (confirm(`Bạn có chắc chắn muốn xóa ${selectedItems.length} nội dung đã chọn?`)) {
          setContent(prev => prev.filter(item => !selectedItems.includes(item.id)))
        }
        break
    }
    setSelectedItems([])
    setShowBulkActions(false)
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredContent.map(item => item.id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý kho tri thức</h1>
          <p className="text-muted-foreground">
            Quản lý và phê duyệt nội dung tri thức của hệ thống Hannah
          </p>
        </div>
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <Button variant="outline" onClick={() => setShowBulkActions(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Thao tác hàng loạt ({selectedItems.length})
            </Button>
          )}
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm nội dung
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Tổng nội dung</span>
            </div>
            <p className="text-2xl font-bold mt-2">{mockStats.totalContent}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Chờ duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-2">{mockStats.pendingApproval}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Đã duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-2">{mockStats.approvedContent}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Từ chối</span>
            </div>
            <p className="text-2xl font-bold mt-2">{mockStats.rejectedContent}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Lượt xem</span>
            </div>
            <p className="text-2xl font-bold mt-2">{mockStats.totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium">Lượt tải</span>
            </div>
            <p className="text-2xl font-bold mt-2">{mockStats.totalDownloads.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm nội dung, môn học, tác giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                </SelectContent>
              </Select>

              <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Kỳ 1">Kỳ 1</SelectItem>
                  <SelectItem value="Kỳ 2">Kỳ 2</SelectItem>
                  <SelectItem value="Kỳ 3">Kỳ 3</SelectItem>
                  <SelectItem value="Kỳ 4">Kỳ 4</SelectItem>
                  <SelectItem value="Kỳ 5">Kỳ 5</SelectItem>
                  <SelectItem value="Kỳ 6">Kỳ 6</SelectItem>
                  <SelectItem value="Kỳ 7">Kỳ 7</SelectItem>
                  <SelectItem value="Kỳ 8">Kỳ 8</SelectItem>
                  <SelectItem value="Kỳ 9">Kỳ 9</SelectItem>
                </SelectContent>
              </Select>


            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách nội dung</CardTitle>
              <CardDescription>
                Hiển thị {filteredContent.length} / {content.length} nội dung
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                <Checkbox
                  checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                  className="mr-2"
                />
                Chọn tất cả
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Môn học</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thống kê</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="w-32">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems(prev => [...prev, item.id])
                        } else {
                          setSelectedItems(prev => prev.filter(id => id !== item.id))
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      {getTypeIcon(item.type)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.subjectCode}</p>
                      <p className="text-sm text-muted-foreground">{item.semester}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{item.viewCount} lượt xem</p>
                      <p className="text-muted-foreground">{item.downloadCount} lượt tải</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.updatedAt}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedContent(item)
                          setShowViewModal(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {item.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedContent(item)
                          setShowEditModal(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
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

      {/* View Content Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="!max-w-[50vw] h-[95vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedContent && getTypeIcon(selectedContent.type)}
              {selectedContent?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedContent?.subjectCode} - {selectedContent?.semester} | Tác giả: {selectedContent?.createdBy}
            </DialogDescription>
          </DialogHeader>

          {selectedContent && (
            <div className="h-[calc(95vh-120px)] overflow-hidden">
              {selectedContent.type === "pdf" ? (
                <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden relative">
                  {/* PDF Controls Bar */}
                  <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-2 z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{selectedContent.title}</span>
                        {getStatusBadge(selectedContent.status)}
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedContent.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                handleApprove(selectedContent.id)
                                setShowViewModal(false)
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Phê duyệt
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                handleReject(selectedContent.id)
                                setShowViewModal(false)
                              }}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Tải xuống
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* PDF Content */}
                  <div className="h-full pt-12">
                    {selectedContent.fileUrl ? (
                      <iframe
                        src={`${selectedContent.fileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=100`}
                        className="w-full h-full border-0"
                        title={`${selectedContent.title} - PDF Viewer`}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <FileText className="h-20 w-20 mx-auto mb-4 text-red-600" />
                          <p className="text-xl font-medium mb-2">Tài liệu PDF</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Tài liệu sẽ được hiển thị tại đây
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedContent.type === "video" ? (
                <div className="h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-center text-white">
                    <Eye className="h-20 w-20 mx-auto mb-4" />
                    <p className="text-xl font-medium mb-2">Video Content</p>
                    <p className="text-sm opacity-75">Video player sẽ được hiển thị tại đây</p>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BookOpen className="h-20 w-20 mx-auto mb-4" />
                    <p className="text-xl font-medium mb-2">Nội dung tài liệu</p>
                    <p className="text-sm mb-4">{selectedContent.description}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Modal */}
      <Dialog open={showBulkActions} onOpenChange={setShowBulkActions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thao tác hàng loạt</DialogTitle>
            <DialogDescription>
              Thực hiện thao tác trên {selectedItems.length} nội dung đã chọn
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleBulkAction("approve")}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Phê duyệt tất cả
              </Button>

              <Button
                variant="destructive"
                onClick={() => handleBulkAction("reject")}
              >
                <X className="h-4 w-4 mr-2" />
                Từ chối tất cả
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleBulkAction("delete")}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa tất cả
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="!max-w-[50vw] h-[60vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nội dung</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin tài liệu
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
            <div>
              <Label htmlFor="edit-title" className="text-base font-semibold">Tiêu đề *</Label>
              <Input
                id="edit-title"
                defaultValue={selectedContent?.title}
                placeholder="Nhập tiêu đề..."
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-semester" className="text-base font-semibold">Học kỳ *</Label>
                <Select defaultValue={selectedContent?.semester}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Chọn học kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kỳ 1">Kỳ 1</SelectItem>
                    <SelectItem value="Kỳ 2">Kỳ 2</SelectItem>
                    <SelectItem value="Kỳ 3">Kỳ 3</SelectItem>
                    <SelectItem value="Kỳ 4">Kỳ 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-subject" className="text-base font-semibold">Môn học *</Label>
                <Select defaultValue={selectedContent?.subjectCode}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRO192">PRO192 - Lập trình hướng đối tượng</SelectItem>
                    <SelectItem value="DBI202">DBI202 - Hệ quản trị CSDL</SelectItem>
                    <SelectItem value="SWE101">SWE101 - Nhập môn Kỹ thuật phần mềm</SelectItem>
                    <SelectItem value="CSD201">CSD201 - Cấu trúc dữ liệu và giải thuật</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-base font-semibold">Mô tả</Label>
              <Textarea
                id="edit-description"
                defaultValue={selectedContent?.description}
                placeholder="Nhập mô tả ngắn về nội dung..."
                className="min-h-[100px] mt-2"
              />
            </div>

            <div>
              <Label className="text-base font-semibold">Trạng thái</Label>
              <Select defaultValue={selectedContent?.status}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-semibold">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2 p-4 border rounded-md bg-gray-50">
                {selectedContent?.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                    {tag}
                    <X className="h-3 w-3 ml-1 cursor-pointer" />
                  </Badge>
                ))}
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm tag
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Hủy
              </Button>
              <Button onClick={() => setShowEditModal(false)}>
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Content Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="!max-w-[50vw] h-[70vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Tạo nội dung mới</DialogTitle>
            <DialogDescription>
              Thêm tài liệu PDF mới vào kho tri thức
            </DialogDescription>
          </DialogHeader>
          <CreateContentForm
            onClose={() => setShowAddModal(false)}
            onSubmit={(newContent, uploadedFile) => {
              const content: KnowledgeContent = {
                ...newContent,
                id: Date.now().toString(),
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0],
                viewCount: 0,
                downloadCount: 0,
                fileUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined
              }
              setContent(prev => [...prev, content])
              setShowAddModal(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateContentForm({
  onClose,
  onSubmit
}: {
  onClose: () => void
  onSubmit: (newContent: Omit<KnowledgeContent, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'downloadCount'>, uploadedFile?: File) => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedSemester, setSelectedSemester] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [pdfFile, setPdfFile] = useState<{ file: File; url: string } | null>(null)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)

  // Curriculum structure matching student resources
  const semesters = [
    {
      id: "sem1",
      name: "Kỳ 1",
      subjects: [
        { id: "CSI104", name: "Introduction to computing", code: "CSI104" },
        { id: "PRF192", name: "Programming Fundamentals", code: "PRF192" },
        { id: "MAE101", name: "Mathematics for Engineering", code: "MAE101" },
        { id: "CEA201", name: "Computer Organization and Architecture", code: "CEA201" }
      ]
    },
    {
      id: "sem2",
      name: "Kỳ 2",
      subjects: [
        { id: "PRO192", name: "Object-Oriented Programming", code: "PRO192" },
        { id: "MAD101", name: "Discrete mathematics", code: "MAD101" },
        { id: "OSG202", name: "Operating Systems", code: "OSG202" },
        { id: "NWC203c", name: "Computer Networking", code: "NWC203c" }
      ]
    },
    {
      id: "sem3",
      name: "Kỳ 3",
      subjects: [
        { id: "WED201c", name: "Web Design", code: "WED201c" },
        { id: "CSD201", name: "Data Structures and Algorithms", code: "CSD201" },
        { id: "DBI202", name: "Database Systems", code: "DBI202" },
        { id: "LAB211", name: "OOP with Java Lab", code: "LAB211" }
      ]
    },
    {
      id: "sem4",
      name: "Kỳ 4",
      subjects: [
        { id: "MAS291", name: "Statistics & Probability", code: "MAS291" },
        { id: "PRJ301", name: "Java Web application development", code: "PRJ301" }
      ]
    },
    {
      id: "sem5",
      name: "Kỳ 5",
      subjects: [
        { id: "SWP391", name: "Software development project", code: "SWP391" },
        { id: "SWR302", name: "Software Requirements", code: "SWR302" },
        { id: "SWT301", name: "Software Testing", code: "SWT301" }
      ]
    },
    {
      id: "sem6",
      name: "Kỳ 6",
      subjects: [
        { id: "SWD301", name: "Software Development", code: "SWD301" },
        { id: "IOT102", name: "Internet of Things", code: "IOT102" },
        { id: "AIE411", name: "Artificial Intelligence", code: "AIE411" }
      ]
    },
    {
      id: "sem7",
      name: "Kỳ 7",
      subjects: [
        { id: "SWD392", name: "Software Architecture and Design", code: "SWD392" },
        { id: "PRN222", name: "Advanced Cross-Platform Application Programming With .NET", code: "PRN222" },
        { id: "PRU212", name: "C# Programming and Unity", code: "PRU212" }
      ]
    },
    {
      id: "sem8",
      name: "Kỳ 8",
      subjects: [
        { id: "PRN232", name: "Building Cross-Platform Back-End Application With .NET", code: "PRN232" },
        { id: "PRM392", name: "Mobile Programming", code: "PRM392" },
        { id: "WDU203c", name: "The UI/UX Design", code: "WDU203c" }
      ]
    },
    {
      id: "sem9",
      name: "Kỳ 9",
      subjects: [
        { id: "SWD501", name: "Capstone Project", code: "SWD501" },
        { id: "PSK301", name: "Professional Skills for IT", code: "PSK301" },
        { id: "EAD401", name: "Enterprise Application Development", code: "EAD401" }
      ]
    }
  ]

  // Available tags
  const availableTags = [
    "manual", "faculty", "guide", "demo", "interactive", "features",
    "best-practices", "tips", "tutorial", "documentation", "getting-started",
    "advanced", "beginner", "pdf", "article", "faq", "help",
    "system", "integration", "api", "ui", "ux", "design", "development"
  ]

  const getSubjectsForSemester = (semesterId: string) => {
    const semester = semesters.find(s => s.id === semesterId)
    return semester ? semester.subjects : []
  }

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = () => {
    if (!title || !selectedSemester || !selectedSubject) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    const selectedSemesterData = semesters.find(s => s.id === selectedSemester)
    const selectedSubjectData = getSubjectsForSemester(selectedSemester).find(s => s.id === selectedSubject)

    const newContent: Omit<KnowledgeContent, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'downloadCount'> = {
      title,
      description,
      type: "pdf",
      semester: selectedSemesterData?.name || "",
      subjectCode: selectedSubjectData?.code || "",
      subjectName: selectedSubjectData?.name || "",
      tags: selectedTags,
      status: "draft",
      createdBy: "Admin",
      fileSize: pdfFile ? `${(pdfFile.file.size / (1024 * 1024)).toFixed(2)} MB` : undefined,
      pageCount: pdfFile ? Math.floor(Math.random() * 100) + 20 : undefined,
      fileUrl: pdfFile?.url
    }

    onSubmit(newContent, pdfFile?.file)
  }

  return (
    <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
      <div>
        <Label htmlFor="title">Tiêu đề *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="semester">Học kỳ *</Label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn học kỳ" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map(semester => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subject">Môn học *</Label>
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
            disabled={!selectedSemester}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn môn học" />
            </SelectTrigger>
            <SelectContent>
              {getSubjectsForSemester(selectedSemester).map(subject => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.code} - {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập mô tả ngắn về nội dung..."
          className="min-h-[80px]"
        />
      </div>

      <div>
        <Label>Tags</Label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1 p-2 border rounded-md min-h-[40px]">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="default" className="flex items-center gap-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
            {selectedTags.length === 0 && (
              <span className="text-muted-foreground text-sm">Chọn tags từ danh sách bên dưới</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-md">
            {availableTags.filter(tag => !selectedTags.includes(tag)).map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="pdf-upload">Tải lên file PDF</Label>
        <FileUpload
          accept=".pdf,application/pdf"
          maxSize={50}
          maxFiles={1}
          onFileSelect={(files) => {
            if (files.length > 0) {
              const file = files[0]
              const fileUrl = URL.createObjectURL(file)
              setPdfFile({ file, url: fileUrl })
            }
          }}
        />

        {pdfFile && (
          <div className="mt-2 p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">{pdfFile.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(pdfFile.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPdfModalOpen(true)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Xem trước
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPdfFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={handleSubmit}>
          Tạo nội dung
        </Button>
      </div>

      {pdfFile && (
        <PDFModal
          src={pdfFile.url}
          title={pdfFile.file.name}
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}
    </div>
  )
}
