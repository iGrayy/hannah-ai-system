"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Video,
  Image,
  Link,
  Calendar,
  User,
  Tag,
  Edit,
  Save,
  X,
  Eye,
  Download,
  Share,
  History,
} from "lucide-react"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  type: "text" | "image" | "video" | "pdf" | "document" | "link"
  category: string
  tags: string[]
  status: "draft" | "published" | "archived"
  author: string
  createdAt: string
  updatedAt: string
  views: number
  rating: number
}

interface KnowledgeItemDetailModalProps {
  item: KnowledgeItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (item: KnowledgeItem) => void
  onDelete?: (id: string) => void
}

export function KnowledgeItemDetailModal({
  item,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: KnowledgeItemDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState<KnowledgeItem | null>(null)

  if (!item) return null

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "image":
        return <Image className="h-4 w-4" />
      case "link":
        return <Link className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default:
        return null
    }
  }

  const handleEdit = () => {
    setEditedItem({ ...item })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedItem && onSave) {
      onSave(editedItem)
      alert(`✅ Đã cập nhật "${editedItem.title}" thành công!`)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedItem(null)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa "${item.title}"?`)) {
      if (onDelete) {
        onDelete(item.id)
        alert(`🗑️ Đã xóa "${item.title}" khỏi knowledge base`)
      }
      onOpenChange(false)
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/knowledge/${item.id}`
    navigator.clipboard.writeText(shareUrl)
    alert(`🔗 Đã copy link chia sẻ: ${shareUrl}`)
  }

  const handleDownload = () => {
    alert(`📥 Đang tải xuống "${item.title}"...`)
  }

  const currentItem = isEditing ? editedItem : item

  if (!currentItem) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(currentItem.type)}
            {isEditing ? "Chỉnh sửa nội dung" : "Chi tiết nội dung"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Cập nhật thông tin và nội dung" : "Xem chi tiết và quản lý nội dung knowledge base"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-6 py-2">
          {/* Header Info */}
          <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input
                      id="title"
                      value={editedItem?.title || ""}
                      onChange={(e) => setEditedItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Danh mục</Label>
                    <Select
                      value={editedItem?.category || ""}
                      onValueChange={(value) => setEditedItem(prev => prev ? { ...prev, category: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="algorithms">Algorithms</SelectItem>
                        <SelectItem value="databases">Databases</SelectItem>
                        <SelectItem value="web-development">Web Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2">{currentItem.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Tag className="h-4 w-4" />
                    <span>{currentItem.category}</span>
                    <span>•</span>
                    <User className="h-4 w-4" />
                    <span>{currentItem.author}</span>
                    <span>•</span>
                    <Calendar className="h-4 w-4" />
                    <span>{currentItem.updatedAt}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(currentItem.status)}
              <Badge variant="outline">
                <Eye className="h-3 w-3 mr-1" />
                {currentItem.views} views
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Nội dung</Label>
            {isEditing ? (
              <Textarea
                value={editedItem?.content || ""}
                onChange={(e) => setEditedItem(prev => prev ? { ...prev, content: e.target.value } : null)}
                rows={12}
                className="min-h-64"
                placeholder="Nhập nội dung..."
              />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {currentItem.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tags */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Tags</Label>
            {isEditing ? (
              <Input
                value={editedItem?.tags.join(", ") || ""}
                onChange={(e) => setEditedItem(prev => prev ? { 
                  ...prev, 
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                } : null)}
                placeholder="Nhập tags, phân cách bằng dấu phẩy"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentItem.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-semibold mb-2">Thông tin tạo</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Tác giả:</strong> {currentItem.author}</p>
                <p><strong>Ngày tạo:</strong> {currentItem.createdAt}</p>
                <p><strong>Cập nhật:</strong> {currentItem.updatedAt}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Thống kê</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Lượt xem:</strong> {currentItem.views}</p>
                <p><strong>Đánh giá:</strong> {currentItem.rating}/5 ⭐</p>
                <p><strong>Trạng thái:</strong> {currentItem.status}</p>
              </div>
            </div>
          </div>

          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t bg-white p-4 flex-shrink-0">
          <div className="flex justify-between">
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <Button variant="outline" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống
                  </Button>
                  <Button variant="outline" onClick={() => alert("📋 Lịch sử thay đổi sẽ được hiển thị")}>
                    <History className="h-4 w-4 mr-2" />
                    Lịch sử
                  </Button>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Đóng
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Xóa
                  </Button>
                  <Button onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
