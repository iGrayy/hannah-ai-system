"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { PDFModal } from "@/components/ui/pdf-modal"
import {
  FileText,
  PlaySquare,
  FileImage,
  Sparkles,
  Search,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Tag,
  Calendar,
  BookOpen,
  GitCommit,
  History,
  Rocket,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Trash2,
  Copy,
  X,

  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  MoreVertical,
  Users
} from "lucide-react"

interface KnowledgeContent {
  id: string
  title: string
  description: string
  type: "document" | "tutorial" | "code" | "article" | "video" | "interactive" | "pdf"

  // Academic structure matching student resources
  semester?: string
  subjectCode?: string
  subjectName?: string
  specialization?: string

  // Content classification
  category: string
  tags: string[]
  prerequisites?: string[]

  // Status and metadata
  status: "draft" | "published" | "archived"
  author: string
  createdAt: string
  updatedAt: string

  // Content data
  content?: string
  mediaUrl?: string
  thumbnailUrl?: string
  chapters?: { title: string; startTime: number }[]
  transcriptUrl?: string
  embedUrl?: string
  fileUrl?: string
  tempFileUrl?: string // URL tạm thời cho file vừa upload
  fileSize?: string
  duration?: string
  pageCount?: number

  // Management
  editHistory?: EditHistoryItem[]
  editCount?: number
  views?: number
  rating?: number

  // Learning objectives
  learningObjectives?: string[]
  estimatedTime?: string
}

interface EditHistoryItem {
  id: string
  editedBy: string
  editedAt: string
  changes: string
  version: number
}

// Academic structure for organizing knowledge content
interface AcademicStructure {
  semesters: AcademicSemester[]
  specializations: AcademicSpecialization[]
}

interface AcademicSemester {
  id: string
  name: string
  year: number
  subjects: AcademicSubject[]
}

interface AcademicSpecialization {
  id: string
  name: string
  description: string
  subjects: AcademicSubject[]
}

interface AcademicSubject {
  id: string
  name: string
  code: string
  credits: number
  description: string
  prerequisites?: string[]
}

const mockKnowledgeContent: KnowledgeContent[] = [
  {
    id: "kb-1",
    title: "Hướng dẫn lập trình Java cơ bản",
    description: "Tài liệu hướng dẫn chi tiết về lập trình Java từ cơ bản đến nâng cao",
    type: "pdf",
    semester: "Kỳ 2 - Năm 1",
    subjectCode: "PRO192",
    subjectName: "Object-Oriented Programming",

    category: "Kỳ 2 - Năm 1",
    tags: ["java", "programming", "oop", "beginner"],
    status: "published",
    author: "TS. Nguyễn Văn A",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    mediaUrl: "/docs/java-guide.pdf",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    fileSize: "3.2 MB",
    pageCount: 120,
    editCount: 2,
    editHistory: [
      {
        id: "edit1",
        editedBy: "TS. Nguyễn Văn A",
        editedAt: "2024-01-18T10:30:00Z",
        changes: "Thêm bài tập thực hành về Inheritance và Polymorphism",
        version: 2
      },
      {
        id: "edit2",
        editedBy: "TS. Nguyễn Văn A",
        editedAt: "2024-01-10T09:00:00Z",
        changes: "Tạo tài liệu ban đầu",
        version: 1
      }
    ]
  },


]

export function MultimediaKnowledgeBase() {
  const [knowledgeContent, setKnowledgeContent] = useState<KnowledgeContent[]>(mockKnowledgeContent)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedContent, setSelectedContent] = useState<KnowledgeContent | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showEditHistory, setShowEditHistory] = useState(false)
  const [sortBy, setSortBy] = useState<"title" | "date">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<KnowledgeContent | null>(null)

  // Add new content to state
  const handleCreateContent = (newContent: Omit<KnowledgeContent, 'id' | 'createdAt' | 'updatedAt' | 'editHistory'>, uploadedFile?: File) => {
    const content: KnowledgeContent = {
      ...newContent,
      id: Date.now().toString(), // Simple ID generation for demo
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      editHistory: [{
        id: `edit-${Date.now()}`,
        editedBy: "Current User",
        editedAt: new Date().toISOString(),
        changes: "Tạo nội dung mới",
        version: 1
      }]
    }

    // Tạo URL tạm thời cho file PDF vừa upload để có thể xem ngay
    if (uploadedFile && newContent.type === 'pdf') {
      content.tempFileUrl = URL.createObjectURL(uploadedFile)
      // Cleanup URL sau 5 phút để tránh memory leak
      setTimeout(() => {
        if (content.tempFileUrl) {
          URL.revokeObjectURL(content.tempFileUrl)
        }
      }, 5 * 60 * 1000)
    }

    setKnowledgeContent(prev => [content, ...prev])
    setIsCreateModalOpen(false)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileImage className="h-5 w-5 text-rose-600" />
      case "interactive": return <Sparkles className="h-5 w-5 text-cyan-600" />
      default: return <FileText className="h-5 w-5 text-slate-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "published" ? (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
        <Rocket className="h-3 w-3 mr-1" />
        Published
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
        <GitCommit className="h-3 w-3 mr-1" />
        Draft
      </Badge>
    )
  }

  // Utility functions

  const handleEdit = (content: KnowledgeContent) => {
    setEditingContent(content)
    setIsEditModalOpen(true)
  }

  const handleDelete = (contentId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nội dung này?")) {
      console.log("Deleting content:", contentId)
    }
  }

  const handleDuplicate = (content: KnowledgeContent) => {
    console.log("Duplicating content:", content.id)
  }

  const filteredContent = knowledgeContent
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesType = selectedType === "all" || item.type === selectedType
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

      return matchesSearch && matchesType && matchesCategory
    })

  // Danh sách các kỳ học
  const semesterList = [
    "Kỳ 1", "Kỳ 2", "Kỳ 3", "Kỳ 4", "Kỳ 5",
    "Kỳ 6", "Kỳ 7", "Kỳ 8", "Kỳ 9"
  ]

  // Nhóm nội dung theo kỳ học
  const contentBySemester = useMemo(() => {
    const grouped: { [key: string]: KnowledgeContent[] } = {}

    // Khởi tạo tất cả các kỳ
    semesterList.forEach(semester => {
      grouped[semester] = []
    })

    // Phân loại nội dung vào các kỳ
    filteredContent.forEach(content => {
      if (content.semester) {
        // Trích xuất số kỳ từ format "Kỳ X - Năm Y"
        const semesterMatch = content.semester.match(/Kỳ (\d+)/)
        if (semesterMatch) {
          const semesterKey = `Kỳ ${semesterMatch[1]}`
          if (grouped[semesterKey]) {
            grouped[semesterKey].push(content)
          }
        }
      }
    })

    // Sắp xếp nội dung trong mỗi kỳ
    Object.keys(grouped).forEach(semesterName => {
      grouped[semesterName].sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case "title":
            comparison = a.title.localeCompare(b.title)
            break
          case "date":
            comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
            break

        }
        return sortOrder === "asc" ? comparison : -comparison
      })
    })

    return grouped
  }, [filteredContent, sortBy, sortOrder, semesterList])

  const totalContentCount = Object.values(contentBySemester).reduce((sum, contents) => sum + (contents as KnowledgeContent[]).length, 0)

  const categories = Array.from(new Set(knowledgeContent.map(item => item.category)))

  const renderMediaViewer = (content: KnowledgeContent) => {
    switch (content.type) {

      case "pdf":
        return (
          <div className="h-full flex flex-col">
            {/* PDF Toolbar - Compact */}
            <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">1 / {content.pageCount}</span>
                <Button size="sm" variant="outline">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm">100%</span>
                <Button size="sm" variant="outline">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* PDF Viewer - Full height */}
            <div className="flex-1 bg-white border border-[#e1e1e1] rounded-b-lg shadow-sm overflow-hidden">
              {content.fileUrl || content.tempFileUrl ? (
                <iframe
                  src={`${content.fileUrl || content.tempFileUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=100`}
                  className="w-full h-full border-0"
                  title={`${content.title} - PDF Viewer`}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-20 w-20 mx-auto mb-4 text-red-600" />
                    <p className="text-xl font-medium mb-2">Tài liệu PDF</p>
                    <p className="text-sm mb-2">
                      {content.fileSize} • {content.pageCount} trang
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Tài liệu sẽ được hiển thị tại đây
                    </p>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Tải xuống PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "interactive":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Interactive Content</h3>
              <Button size="sm" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>

            <div className="border rounded-lg bg-muted min-h-[500px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Sparkles className="h-16 w-16 mx-auto mb-4" />
                <p>Interactive Embed Placeholder</p>
                <p className="text-sm">URL: {content.embedUrl}</p>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{content.content}</div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kho tri thức</h1>
          <p className="text-muted-foreground">Quản lý nội dung đa phương tiện</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo nội dung mới
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-4xl !w-[90vw] !max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Tạo nội dung mới</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
              <CreateContentForm
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateContent}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm nội dung..."
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Loại nội dung" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="article">Bài viết</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="interactive">Tương tác</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as "title" | "date")}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Tiêu đề</SelectItem>
                    <SelectItem value="date">Ngày</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {totalContentCount} nội dung
              </span>
              {selectedItems.length > 0 && (
                <>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Sao chép ({selectedItems.length})
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa ({selectedItems.length})
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Display - Chia theo kỳ học */}
      <div className="space-y-8">
        {semesterList.map(semester => {
          const semesterContents = contentBySemester[semester] || []

          // Chỉ hiển thị section nếu có nội dung
          if (semesterContents.length === 0) return null

          return (
            <div key={semester} className="space-y-4">
              {/* Header của section */}
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {semester}
                </div>
                <span className="text-sm text-muted-foreground">
                  {semesterContents.length} nội dung
                </span>
              </div>

              {/* Nội dung của section */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {semesterContents.map((content) => (
                    <Card key={content.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(content.type)}
                            <CardTitle className="text-sm line-clamp-2">{content.title}</CardTitle>
                          </div>
                          {getStatusBadge(content.status)}
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {content.description}
                        </p>

                        {/* Hiển thị mã môn */}
                        <div className="mb-3">
                          <div className="text-xs text-green-600 font-medium">
                            {content.subjectCode && (
                              <span>Mã môn: {content.subjectCode}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {content.tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {content.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{content.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-end text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {content.updatedAt}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedContent(content)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(content)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {semesterContents.map((content) => (
                    <Card key={content.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {getTypeIcon(content.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium text-base line-clamp-1">{content.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {content.description}
                                </p>
                              </div>
                              {getStatusBadge(content.status)}
                            </div>

                            {/* Hiển thị mã môn */}
                            <div className="mb-3">
                              <div className="text-sm text-green-600 font-medium">
                                {content.subjectCode && (
                                  <span>Mã môn: {content.subjectCode}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {content.updatedAt}
                              </div>
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {content.category}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {content.tags.slice(0, 4).map((tag: string) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {content.tags.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{content.tags.length - 4}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedContent(content)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Xem
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(content)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Sửa
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDuplicate(content)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="!max-w-4xl !w-[90vw]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nội dung</DialogTitle>
          </DialogHeader>
          {editingContent && (
            <EditContentForm
              content={editingContent}
              onClose={() => {
                setIsEditModalOpen(false)
                setEditingContent(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Content Viewer Modal - Hiển thị đầy đủ thông tin + PDF */}
      {selectedContent && (
        <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
          <DialogContent className="!max-w-7xl !w-[98vw] !max-h-[95vh] overflow-hidden">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(selectedContent.type)}
                  <DialogTitle>{selectedContent.title}</DialogTitle>
                  {getStatusBadge(selectedContent.status)}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setEditingContent(selectedContent)
                    setIsEditModalOpen(true)
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditHistory(true)}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Lịch sử
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* PDF Viewer toàn màn hình - giống student resources */}
            <div className="h-[calc(95vh-120px)] overflow-hidden">
              {selectedContent.type === "pdf" ? (
                <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden relative">
                  {/* PDF Controls Bar */}
                  <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-2 z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">100%</span>
                        <Button variant="ghost" size="sm">
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">1 / {selectedContent.pageCount || '?'}</span>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* PDF Content */}
                  <div className="h-full pt-12">
                    {selectedContent.fileUrl || selectedContent.tempFileUrl ? (
                      <iframe
                        src={`${selectedContent.fileUrl || selectedContent.tempFileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=100`}
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
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống PDF
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                renderMediaViewer(selectedContent)
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit History Modal */}
      {showEditHistory && selectedContent && (
        <Dialog open={showEditHistory} onOpenChange={setShowEditHistory}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Lịch sử chỉnh sửa - {selectedContent.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedContent.editHistory && selectedContent.editHistory.length > 0 ? (
                selectedContent.editHistory.map((edit) => (
                  <div key={edit.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Phiên bản {edit.version}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(edit.editedAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{edit.changes}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có lịch sử chỉnh sửa</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}


    </div>
  )
}

function EditContentForm({ content, onClose }: { content: KnowledgeContent; onClose: () => void }) {
  const [title, setTitle] = useState(content.title)
  const [description, setDescription] = useState(content.description)
  const [category, setCategory] = useState(content.category)
  const [selectedTags, setSelectedTags] = useState<string[]>(content.tags)
  const [status, setStatus] = useState(content.status)
  const [contentText, setContentText] = useState(content.content || "")

  const availableTags = ["tutorial", "guide", "reference", "demo", "interactive", "pdf", "video", "manual", "faculty", "student", "beginner", "advanced"]

  const handleSave = () => {
    // Logic lưu thay đổi
    console.log("Saving changes:", {
      id: content.id,
      title,
      description,
      category,
      tags: selectedTags,
      status,
      content: contentText
    })
    onClose()
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-title">Tiêu đề</Label>
          <Input
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-category">Danh mục</Label>
          <Input
            id="edit-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Nhập danh mục..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Mô tả</Label>
        <Textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập mô tả..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Trạng thái</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as "draft" | "published")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Bản nháp</SelectItem>
            <SelectItem value="published">Đã xuất bản</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[60px]">
          {availableTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedTags(prev =>
                  prev.includes(tag)
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                )
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {content.type === "article" && (
        <div className="space-y-2">
          <Label htmlFor="edit-content">Nội dung</Label>
          <Textarea
            id="edit-content"
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="Nhập nội dung bài viết..."
            rows={10}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={handleSave}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  )
}

export default MultimediaKnowledgeBase

function CreateContentForm({
  onClose,
  onSubmit
}: {
  onClose: () => void
  onSubmit: (newContent: Omit<KnowledgeContent, 'id' | 'createdAt' | 'updatedAt' | 'editHistory'>) => void
}) {
  const [contentType, setContentType] = useState<string>("pdf")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedSemester, setSelectedSemester] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [pdfFile, setPdfFile] = useState<{ file: File; url: string } | null>(null)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)


  // Curriculum structure matching student resources
  const semesters = [
    {
      id: "sem1",
      name: "Kỳ 1 - Năm 1",
      subjects: [
        { id: "CSI104", name: "Introduction to computing", code: "CSI104" },
        { id: "PRF192", name: "Programming Fundamentals", code: "PRF192" },
        { id: "MAE101", name: "Mathematics for Engineering", code: "MAE101" },
        { id: "CEA201", name: "Computer Organization and Architecture", code: "CEA201" }
      ]
    },
    {
      id: "sem2",
      name: "Kỳ 2 - Năm 1",
      subjects: [
        { id: "PRO192", name: "Object-Oriented Programming", code: "PRO192" },
        { id: "MAD101", name: "Discrete mathematics", code: "MAD101" },
        { id: "OSG202", name: "Operating Systems", code: "OSG202" },
        { id: "NWC203c", name: "Computer Networking", code: "NWC203c" }
      ]
    },
    {
      id: "sem3",
      name: "Kỳ 3 - Năm 2",
      subjects: [
        { id: "WED201c", name: "Web Design", code: "WED201c" },
        { id: "CSD201", name: "Data Structures and Algorithms", code: "CSD201" },
        { id: "DBI202", name: "Database Systems", code: "DBI202" },
        { id: "LAB211", name: "OOP with Java Lab", code: "LAB211" }
      ]
    },
    {
      id: "sem4",
      name: "Kỳ 4 - Năm 2",
      subjects: [
        { id: "MAS291", name: "Statistics & Probability", code: "MAS291" },
        { id: "PRJ301", name: "Java Web application development", code: "PRJ301" }
      ]
    },
    {
      id: "sem5",
      name: "Kỳ 5 - Năm 3",
      subjects: [
        { id: "SWP391", name: "Software development project", code: "SWP391" },
        { id: "SWR302", name: "Software Requirements", code: "SWR302" },
        { id: "SWT301", name: "Software Testing", code: "SWT301" }
      ]
    },
    {
      id: "sem6",
      name: "Kỳ 6 - Năm 3",
      subjects: [
        { id: "SWD301", name: "Software Development", code: "SWD301" },
        { id: "IOT102", name: "Internet of Things", code: "IOT102" },
        { id: "AIE411", name: "Artificial Intelligence", code: "AIE411" }
      ]
    },
    {
      id: "sem7",
      name: "Kỳ 7 - Năm 4",
      subjects: [
        { id: "SWD392", name: "Software Architecture and Design", code: "SWD392" },
        { id: "PRN222", name: "Advanced Cross-Platform Application Programming With .NET", code: "PRN222" },
        { id: "PRU212", name: "C# Programming and Unity", code: "PRU212" }
      ]
    },
    {
      id: "sem8",
      name: "Kỳ 8 - Năm 4",
      subjects: [
        { id: "PRN232", name: "Building Cross-Platform Back-End Application With .NET", code: "PRN232" },
        { id: "PRM392", name: "Mobile Programming", code: "PRM392" },
        { id: "WDU203c", name: "The UI/UX Design", code: "WDU203c" }
      ]
    },
    {
      id: "sem9",
      name: "Kỳ 9 - Năm 5",
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
    "advanced", "beginner", "video", "pdf", "article", "faq", "help",
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

    const newContent: Omit<KnowledgeContent, 'id' | 'createdAt' | 'updatedAt' | 'editHistory'> = {
      title,
      description,
      type: "pdf",
      semester: selectedSemesterData?.name,
      subjectCode: selectedSubjectData?.code,
      subjectName: selectedSubjectData?.name,

      category: selectedSemesterData?.name || "General",
      tags: selectedTags,
      status: "draft",
      author: "Current User",
    }

    onSubmit(newContent)
  }

  return (
    <Tabs value={contentType} onValueChange={setContentType} className="space-y-4">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="pdf" className="flex items-center gap-2">
          <FileImage className="h-4 w-4" />
          PDF
        </TabsTrigger>
      </TabsList>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Tiêu đề</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="semester">Học kỳ</Label>
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
            <Label htmlFor="subject">Môn học</Label>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={!selectedSemester}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedSemester ? "Chọn môn học" : "Chọn học kỳ trước"} />
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
            placeholder="Mô tả ngắn gọn về nội dung..."
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags</Label>
          <Select onValueChange={handleTagSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn tags..." />
            </SelectTrigger>
            <SelectContent>
              {availableTags.map(tag => (
                <SelectItem
                  key={tag}
                  value={tag}
                  disabled={selectedTags.includes(tag)}
                >
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Display selected tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <span className="ml-1 text-xs">×</span>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Preview of selected course information */}
        {selectedSemester && selectedSubject && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Thông tin môn học được chọn</span>
            </div>
            <div className="text-sm text-blue-700">
              <p><strong>Học kỳ:</strong> {semesters.find(s => s.id === selectedSemester)?.name}</p>
              <p><strong>Môn học:</strong> {getSubjectsForSemester(selectedSemester).find(s => s.id === selectedSubject)?.code} - {getSubjectsForSemester(selectedSemester).find(s => s.id === selectedSubject)?.name}</p>
            </div>
          </div>
        )}



        <TabsContent value="pdf" className="space-y-4">
          <div>
            <Label htmlFor="pdf-upload">Upload PDF</Label>
            <FileUpload
              accept=".pdf,application/pdf"
              maxSize={50}
              maxFiles={1}
              onFileSelect={(files: File[]) => {
                if (files.length > 0) {
                  const file = files[0]
                  // Create object URL for preview
                  const fileUrl = URL.createObjectURL(file)
                  setPdfFile({ file, url: fileUrl })
                  console.log('PDF uploaded:', file.name)
                }
              }}
              className="mt-2"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Upload PDF</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Kéo thả file PDF hoặc click để chọn
                </p>
                <Button variant="outline" size="sm">
                  Chọn file PDF
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Chỉ hỗ trợ file PDF (tối đa 50MB)
                </p>
              </div>
            </FileUpload>

            {/* Preview uploaded PDF */}
            {pdfFile && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">{pdfFile.file.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {(pdfFile.file.size / (1024 * 1024)).toFixed(2)} MB
                    </Badge>
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
                      onClick={() => {
                        URL.revokeObjectURL(pdfFile.url)
                        setPdfFile(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  File đã sẵn sàng để tạo nội dung
                </p>
              </div>
            )}
          </div>
        </TabsContent>



        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            disabled={!selectedSemester || !selectedSubject || !title}
            onClick={handleSubmit}
          >
            Tạo nội dung
          </Button>
        </div>

        {/* PDF Modal for preview */}
        {pdfFile && (
          <PDFModal
            src={pdfFile.url}
            title={pdfFile.file.name}
            isOpen={isPdfModalOpen}
            onClose={() => setIsPdfModalOpen(false)}
          />
        )}
      </div>
    </Tabs>
  )
}
