"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { KnowledgeItemDetailModal } from "./knowledge-item-detail-modal"
import { MultimediaKnowledgeBase } from "./multimedia-knowledge-base"
import { RichTextEditorWithPreview } from "@/components/ui/rich-text-editor"
import { FileUpload } from "@/components/ui/file-upload"
import { BulkOperations, useBulkSelection, BulkSelectionCheckbox, commonBulkActions } from "@/components/ui/bulk-operations"
import { DataTablePagination, usePagination } from "@/components/ui/data-table-pagination"
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  Eye,
  Folder,
  FileText,
  ImageIcon,
  Video,
  File,
  ChevronRight,
  ChevronDown,
  Save,
  X,
} from "lucide-react"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  type: "text" | "image" | "video" | "pdf" | "document" | "link"
  status: "draft" | "published" | "archived"
  author: string
  createdAt: string
  updatedAt: string
  views: number
  rating: number
}

interface Category {
  id: string
  name: string
  description: string
  itemCount: number
  children?: Category[]
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Cấu trúc dữ liệu & Giải thuật",
    description: "Các khái niệm CS cốt lõi",
    itemCount: 45,
    children: [
      { id: "1-1", name: "Mảng & Danh sách", description: "", itemCount: 12 },
      { id: "1-2", name: "Cây & Đồ thị", description: "", itemCount: 18 },
      { id: "1-3", name: "Sắp xếp & Tìm kiếm", description: "", itemCount: 15 },
    ],
  },
  {
    id: "2",
    name: "Lập trình Hướng đối tượng",
    description: "Nguyên lý và mẫu OOP",
    itemCount: 32,
    children: [
      { id: "2-1", name: "Kế thừa", description: "", itemCount: 8 },
      { id: "2-2", name: "Đa hình", description: "", itemCount: 10 },
      { id: "2-3", name: "Mẫu thiết kế", description: "", itemCount: 14 },
    ],
  },
  {
    id: "3",
    name: "Hệ quản trị CSDL",
    description: "Thiết kế và quản lý CSDL",
    itemCount: 28,
    children: [
      { id: "3-1", name: "Nền tảng SQL", description: "", itemCount: 15 },
      { id: "3-2", name: "Thiết kế CSDL", description: "", itemCount: 13 },
    ],
  },
]

const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: "1",
    title: "Giới thiệu về Cây tìm kiếm nhị phân",
    content:
      "A binary search tree (BST) is a hierarchical data structure that maintains sorted data in a way that allows for efficient insertion, deletion, and lookup operations. BSTs provide O(log n) average time complexity for search, insert, and delete operations when the tree is balanced.",
    category: "Cấu trúc dữ liệu & Giải thuật",
    tags: ["BST", "Cây", "Tìm kiếm"],
    type: "text",
    status: "published",
    author: "TS. Nguyễn",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    views: 1250,
    rating: 4.8
  },
  {
    id: "2",
    title: "Tính kế thừa trong Java",
    content:
      "Inheritance is a fundamental concept in object-oriented programming that allows a class to inherit properties and methods from another class. This mechanism promotes code reusability and establishes a hierarchical relationship between classes.",
    category: "Lập trình Hướng đối tượng",
    tags: ["Java", "Inheritance", "OOP"],
    type: "document",
    status: "published",
    author: "Prof. Tran",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-14",
    views: 890,
    rating: 4.6
  },
  {
    id: "3",
    title: "Các phép JOIN trong SQL",
    content:
      "SQL JOIN operations are used to combine rows from two or more tables based on a related column between them. Understanding different types of JOINs (INNER, LEFT, RIGHT, FULL OUTER) is crucial for effective database querying.",
    category: "Hệ quản trị CSDL",
    tags: ["SQL", "JOIN", "CSDL"],
    type: "video",
    status: "draft",
    author: "Dr. Le",
    createdAt: "2024-01-13",
    updatedAt: "2024-01-13",
    views: 456,
    rating: 4.2
  },
]

export function KnowledgeBase() {
  // Use the new multimedia knowledge base
  return <MultimediaKnowledgeBase />
}

export function KnowledgeBaseOld() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(mockKnowledgeItems)
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["1", "2", "3"]))
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "pdf":
        return <File className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "published" ? (
      <Badge variant="default" className="bg-green-600">
        Đã xuất bản
      </Badge>
    ) : (
      <Badge variant="secondary">Nháp</Badge>
    )
  }

  const renderCategoryTree = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id} className={`${level > 0 ? "ml-4" : ""}`}>
        <div
          className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
          onClick={() => {
            if (category.children) {
              toggleCategory(category.id)
            }
            setSelectedCategory(category.name)
          }}
        >
          {category.children &&
            (expandedCategories.has(category.id) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            ))}
          <Folder className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">{category.name}</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {category.itemCount}
          </Badge>
        </div>
        {category.children && expandedCategories.has(category.id) && (
          <div className="mt-1">{renderCategoryTree(category.children, level + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Quản lý kho tri thức</h1>
          <p className="text-muted-foreground">Quản lý nội dung và tài nguyên cho hệ thống tri thức của Hannah</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("📁 Chức năng import hàng loạt từ file Excel/CSV sẽ được triển khai sau!")}
          >
            <Upload className="h-4 w-4 mr-2" />
            Nhập khẩu hàng loạt
          </Button>
          <Button size="sm" onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm nội dung
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Tree Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Danh mục
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-1">
                <div
                  className={`flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer ${selectedCategory === "all" ? "bg-accent" : ""}`}
                  onClick={() => setSelectedCategory("all")}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">Tất cả</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {knowledgeItems.length}
                  </Badge>
                </div>
                {renderCategoryTree(categories)}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm nội dung, thẻ hoặc tác giả..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Lọc theo loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="text">Văn bản</SelectItem>
                    <SelectItem value="image">Hình ảnh</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="published">Đã xuất bản</SelectItem>
                    <SelectItem value="draft">Nháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Content List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Danh sách nội dung ({filteredItems.length})
                {selectedCategory !== "all" && (
                  <span className="text-base font-normal text-muted-foreground ml-2">trong {selectedCategory}</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(item.type)}
                          <h3 className="font-semibold">{item.title}</h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Tác giả {item.author}</span>
                          <span>Cập nhật {item.updatedAt}</span>
                          <div className="flex gap-1">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item)
                            setDetailModalOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa "${item.title}"?`)) {
                              alert(`🗑️ Đã xóa "${item.title}" khỏi knowledge base`)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Content Dialog */}
      <Dialog
        open={isAddingNew || editingItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingNew(false)
            setEditingItem(null)
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Chỉnh sửa nội dung" : "Thêm nội dung mới"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Cập nhật thông tin nội dung" : "Tạo nội dung mới cho kho tri thức"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Nội dung</TabsTrigger>
              <TabsTrigger value="metadata">Siêu dữ liệu</TabsTrigger>
              <TabsTrigger value="preview">Xem trước</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tiêu đề</label>
                <Input placeholder="Nhập tiêu đề nội dung..." defaultValue={editingItem?.title || ""} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Nội dung</label>
                <Textarea
                  placeholder="Nhập nội dung tại đây... (Hỗ trợ Markdown)"
                  className="min-h-64"
                  defaultValue={editingItem?.content || ""}
                />
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Danh mục</label>
                  <Select defaultValue={editingItem?.category || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Loại nội dung</label>
                  <Select defaultValue={editingItem?.type || "text"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Văn bản</SelectItem>
                      <SelectItem value="image">Hình ảnh</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Thẻ</label>
                <Input
                  placeholder="Nhập thẻ, cách nhau bởi dấu phẩy..."
                  defaultValue={editingItem?.tags.join(", ") || ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Trạng thái</label>
                <Select defaultValue={editingItem?.status || "draft"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Nháp</SelectItem>
                    <SelectItem value="published">Đã xuất bản</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/20">
                <h3 className="font-semibold mb-2">Xem trước</h3>
                <p className="text-sm text-muted-foreground">Bản xem trước nội dung sẽ hiển thị tại đây...</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingNew(false)
                setEditingItem(null)
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              {editingItem ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Knowledge Item Detail Modal */}
      <KnowledgeItemDetailModal
        item={selectedItem}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onSave={(item) => {
          // Update item in real app
          console.log("Saving item:", item)
        }}
        onDelete={(id) => {
          // Delete item in real app
          console.log("Deleting item:", id)
        }}
      />
    </div>
  )
}
