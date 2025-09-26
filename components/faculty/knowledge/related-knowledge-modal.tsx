"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  BookOpenCheck,
  Search,
  ExternalLink,
  Link2,
  PencilLine,
  FileText,
  PlaySquare,
  FileImage,
  Tag,
  Calendar,
  User,
  Eye,
  Sparkles,
} from "lucide-react"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  snippet: string
  type: "article" | "video" | "pdf" | "interactive"
  category: string
  tags: string[]
  status: "draft" | "published"
  author: string
  updatedAt: string
  relevanceScore: number
  highlightedText?: string
}

interface RelatedKnowledgeModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  responseId: string
  searchContext: string
  onAttachKnowledge?: (knowledgeIds: string[]) => void
}

const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: "kb-1",
    title: "Quy trình đặt lại mật khẩu",
    content: "Complete guide on how to reset passwords in the Hannah system...",
    snippet: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address...",
    type: "article",
    category: "Quản lý tài khoản",
    tags: ["password", "login", "security"],
    status: "published",
    author: "Dr. Smith",
    updatedAt: "2024-01-20",
    relevanceScore: 95,
    highlightedText: "reset password"
  },
  {
    id: "kb-2", 
    title: "System Requirements Video Tutorial",
    content: "Video explaining minimum system requirements for Hannah AI...",
    snippet: "This video covers browser compatibility, internet connection requirements, and troubleshooting...",
    type: "video",
    category: "Technical Support",
    tags: ["requirements", "browser", "tutorial"],
    status: "published",
    author: "Tech Team",
    updatedAt: "2024-01-18",
    relevanceScore: 87,
    highlightedText: "system requirements"
  },
  {
    id: "kb-3",
    title: "Contact Support Guide",
    content: "Comprehensive guide on how to reach support team...",
    snippet: "Multiple ways to contact our support team including email, phone, and help desk portal...",
    type: "article",
    category: "Support",
    tags: ["support", "contact", "help"],
    status: "published",
    author: "Support Team",
    updatedAt: "2024-01-22",
    relevanceScore: 78,
    highlightedText: "contact support"
  }
]

export function RelatedKnowledgeModal({
  isOpen,
  onOpenChange,
  responseId,
  searchContext,
  onAttachKnowledge
}: RelatedKnowledgeModalProps) {
  const [searchQuery, setSearchQuery] = useState(searchContext)
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(mockKnowledgeItems)
  const [attachedItems, setAttachedItems] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (isOpen && searchContext) {
      setSearchQuery(searchContext)
      // Simulate search with context
      const filtered = mockKnowledgeItems.filter(item =>
        item.title.toLowerCase().includes(searchContext.toLowerCase()) ||
        item.snippet.toLowerCase().includes(searchContext.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchContext.toLowerCase()))
      )
      setKnowledgeItems(filtered.sort((a, b) => b.relevanceScore - a.relevanceScore))
    }
  }, [isOpen, searchContext])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <PlaySquare className="h-4 w-4 text-violet-600" />
      case "pdf": return <FileImage className="h-4 w-4 text-rose-600" />
      case "interactive": return <Sparkles className="h-4 w-4 text-cyan-600" />
      default: return <FileText className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "published" ? (
      <Badge variant="default" className="bg-emerald-100 text-emerald-700 border-emerald-200">
        Published
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
        Draft
      </Badge>
    )
  }

  const handleAttachItem = (itemId: string) => {
    const newAttached = attachedItems.includes(itemId)
      ? attachedItems.filter(id => id !== itemId)
      : [...attachedItems, itemId]
    
    setAttachedItems(newAttached)
    onAttachKnowledge?.(newAttached)
  }

  const handleQuickEdit = (item: KnowledgeItem) => {
    setSelectedItem(item)
    setIsEditing(true)
  }

  const handleOpenFullKB = (itemId?: string) => {
    const url = itemId 
      ? `/faculty/knowledge?search=${encodeURIComponent(searchQuery)}&highlight=true&context=${responseId}&item=${itemId}`
      : `/faculty/knowledge?search=${encodeURIComponent(searchQuery)}&highlight=true&context=${responseId}`
    
    window.open(url, '_blank')
  }

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index} className="bg-amber-100 text-amber-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpenCheck className="h-5 w-5 text-indigo-600" />
            Liên quan trong Knowledge Base
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Left Panel - Search & Results */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm trong Knowledge Base..."
                className="pl-10"
              />
            </div>

            {/* Results */}
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {knowledgeItems.map((item) => (
                  <Card 
                    key={item.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedItem?.id === item.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                    } ${attachedItems.includes(item.id) ? 'border-emerald-300 bg-emerald-50' : ''}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(item.type)}
                            <h3 className="font-medium text-sm truncate">
                              {highlightText(item.title, searchQuery)}
                            </h3>
                            <div className="flex items-center gap-1 ml-auto">
                              <Badge variant="outline" className="text-xs">
                                {Math.round(item.relevanceScore)}%
                              </Badge>
                              {getStatusBadge(item.status)}
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {highlightText(item.snippet, searchQuery)}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                            {item.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 2 && (
                              <span className="text-xs">+{item.tags.length - 2}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAttachItem(item.id)
                            }}
                            className={`h-7 px-2 ${
                              attachedItems.includes(item.id) 
                                ? 'text-emerald-600 bg-emerald-100' 
                                : 'text-muted-foreground'
                            }`}
                          >
                            <Link2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {knowledgeItems.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BookOpenCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Chưa tìm thấy nội dung liên quan</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Thử tìm kiếm với từ khóa khác hoặc tạo bài KB mới
                      </p>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Tạo bài KB mới
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Preview */}
          {selectedItem && (
            <div className="w-96 flex flex-col border-l pl-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm">Chi tiết nội dung</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickEdit(selectedItem)}
                  >
                    <PencilLine className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenFullKB(selectedItem.id)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(selectedItem.type)}
                      <h4 className="font-medium">{selectedItem.title}</h4>
                    </div>
                    {getStatusBadge(selectedItem.status)}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Nội dung</label>
                      <p className="text-sm mt-1">{selectedItem.content}</p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Danh mục</label>
                      <Badge variant="secondary" className="mt-1">
                        {selectedItem.category}
                      </Badge>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Tags</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedItem.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {selectedItem.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {selectedItem.updatedAt}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {attachedItems.length > 0 && (
              <>
                <Link2 className="h-4 w-4" />
                <span>{attachedItems.length} mục đã liên kết</span>
              </>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleOpenFullKB()}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Mở KB đầy đủ
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Hoàn tất
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
