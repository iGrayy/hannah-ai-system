"use client"

import { useState } from "react"
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
  User,
  BookOpen,
  FolderTree,
  GitCommit,
  History,
  Rocket,
  Play,
  Pause,
  Volume2,
  Maximize,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react"

interface MediaContent {
  id: string
  title: string
  description: string
  type: "article" | "pdf" | "interactive"
  category: string
  tags: string[]
  status: "draft" | "published"
  author: string
  createdAt: string
  updatedAt: string
  content?: string
  mediaUrl?: string
  thumbnailUrl?: string
  chapters?: { title: string; startTime: number }[]
  transcriptUrl?: string
  embedUrl?: string
  fileSize?: string
  duration?: string
  pageCount?: number
}

const mockMediaContent: MediaContent[] = [
  {
    id: "kb-2",
    title: "Faculty User Manual",
    description: "Comprehensive guide for faculty members",
    type: "pdf",
    category: "Documentation",
    tags: ["manual", "faculty", "guide"],
    status: "published",
    author: "Tech Team",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    mediaUrl: "/docs/faculty-manual.pdf",
    fileSize: "2.5 MB",
    pageCount: 45
  },
  {
    id: "kb-3",
    title: "Interactive System Demo",
    description: "Live demonstration of system features",
    type: "interactive",
    category: "Demo",
    tags: ["demo", "interactive", "features"],
    status: "published",
    author: "Demo Team",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-22",
    embedUrl: "https://demo.hannah.edu/interactive",
    thumbnailUrl: "/thumbnails/demo.jpg"
  },
  {
    id: "kb-4",
    title: "Best Practices Guide",
    description: "Article on best practices for using Hannah AI effectively",
    type: "article",
    category: "Best Practices",
    tags: ["best-practices", "tips", "guide"],
    status: "draft",
    author: "Dr. Johnson",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-22",
    content: "# Best Practices for Hannah AI\n\nThis guide covers the most effective ways to use Hannah AI..."
  }
]

export function MultimediaKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedContent, setSelectedContent] = useState<MediaContent | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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

  const filteredContent = mockMediaContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    
    return matchesSearch && matchesType && matchesCategory
  })

  const categories = Array.from(new Set(mockMediaContent.map(item => item.category)))

  const renderMediaViewer = (content: MediaContent) => {
    switch (content.type) {

      case "pdf":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Page 1 of {content.pageCount}</span>
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
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg bg-white min-h-[600px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileImage className="h-16 w-16 mx-auto mb-4" />
                <p>PDF Viewer Placeholder</p>
                <p className="text-sm">File size: {content.fileSize}</p>
              </div>
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
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">Quản lý nội dung đa phương tiện</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo nội dung mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo nội dung mới</DialogTitle>
            </DialogHeader>
            <CreateContentForm onClose={() => setIsCreateModalOpen(false)} />
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content) => (
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
              
              <div className="flex flex-wrap gap-1 mb-3">
                {content.tags.slice(0, 3).map(tag => (
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
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {content.author}
                </div>
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
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Viewer Modal */}
      {selectedContent && (
        <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
          <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(selectedContent.type)}
                  <DialogTitle>{selectedContent.title}</DialogTitle>
                  {getStatusBadge(selectedContent.status)}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                  <Button variant="outline" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    Lịch sử
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-auto">
              {renderMediaViewer(selectedContent)}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CreateContentForm({ onClose }: { onClose: () => void }) {
  const [contentType, setContentType] = useState<string>("article")
  
  return (
    <Tabs value={contentType} onValueChange={setContentType} className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="article" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Bài viết
        </TabsTrigger>

        <TabsTrigger value="pdf" className="flex items-center gap-2">
          <FileImage className="h-4 w-4" />
          PDF
        </TabsTrigger>
        <TabsTrigger value="interactive" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Tương tác
        </TabsTrigger>
      </TabsList>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" placeholder="Nhập tiêu đề..." />
          </div>
          <div>
            <Label htmlFor="category">Danh mục</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="getting-started">Getting Started</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="best-practices">Best Practices</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Mô tả</Label>
          <Textarea id="description" placeholder="Mô tả ngắn gọn về nội dung..." />
        </div>
        
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" placeholder="Nhập tags, cách nhau bằng dấu phẩy..." />
        </div>
        
        <TabsContent value="article" className="space-y-4">
          <div>
            <Label htmlFor="content">Nội dung</Label>
            <Textarea id="content" rows={8} placeholder="Nhập nội dung bài viết..." />
          </div>
        </TabsContent>
        

        
        <TabsContent value="pdf" className="space-y-4">
          <div>
            <Label htmlFor="pdf-upload">Upload PDF</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Kéa thả file PDF hoặc click để chọn</p>
              <p className="text-xs text-muted-foreground mt-1">Hỗ trợ PDF (tối đa 50MB)</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="interactive" className="space-y-4">
          <div>
            <Label htmlFor="embed-url">Embed URL</Label>
            <Input id="embed-url" placeholder="https://..." />
          </div>
          <div>
            <Label htmlFor="embed-type">Loại embed</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="codepen">CodePen</SelectItem>
                <SelectItem value="jsfiddle">JSFiddle</SelectItem>
                <SelectItem value="diagram">Diagram</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button>
            Tạo nội dung
          </Button>
        </div>
      </div>
    </Tabs>
  )
}
