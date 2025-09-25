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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  MessageSquare,
  Calendar,
  TrendingUp,
  Edit,
  Save,
  X,
  BookOpenCheck,
} from "lucide-react"
import { RelatedKnowledgeModal } from "../knowledge/related-knowledge-modal"

interface Response {
  id: string
  student: {
    name: string
    id: string
    avatar: string
  }
  question: string
  aiResponse: string
  confidence: number
  date: string
  status: "pending" | "approved" | "rejected"
  priority: "high" | "medium" | "low"
}

interface ResponseDetailModalProps {
  response: Response | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function ResponseDetailModal({
  response,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ResponseDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedResponse, setEditedResponse] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [relatedKnowledgeOpen, setRelatedKnowledgeOpen] = useState(false)

  if (!response) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Đang chờ duyệt
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã phê duyệt
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Đã từ chối
          </Badge>
        )
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Ưu tiên cao</Badge>
      case "medium":
        return <Badge variant="secondary">Ưu tiên trung bình</Badge>
      case "low":
        return <Badge variant="outline">Ưu tiên thấp</Badge>
      default:
        return null
    }
  }

  const handleEdit = () => {
    setEditedResponse(response.aiResponse)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    alert(`✅ Đã cập nhật phản hồi cho câu hỏi: "${response.question}"`)
    setIsEditing(false)
  }

  const handleApprove = () => {
    onApprove(response.id)
    onOpenChange(false)
  }

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(response.id)
      onOpenChange(false)
      setRejectReason("")
    } else {
      alert("Vui lòng nhập lý do từ chối")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chi tiết phản hồi AI
          </DialogTitle>
          <DialogDescription>
            Xem xét và phê duyệt phản hồi của Hannah AI
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-6 py-2">
          {/* Thông tin sinh viên */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={response.student.avatar} />
                <AvatarFallback>
                  {response.student.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{response.student.name}</h3>
                <p className="text-sm text-slate-600">{response.student.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(response.status)}
              {getPriorityBadge(response.priority)}
            </div>
          </div>

          {/* Câu hỏi */}
          <div>
            <Label className="text-base font-semibold flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              Câu hỏi của sinh viên
            </Label>
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-slate-800">{response.question}</p>
            </div>
          </div>

          {/* Phản hồi của AI */}
          <div>
            <Label className="text-base font-semibold flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4" />
              Phản hồi của Hannah AI
              <Badge variant="outline" className="ml-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                Độ tin cậy {response.confidence}%
              </Badge>
            </Label>
            
            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editedResponse}
                  onChange={(e) => setEditedResponse(e.target.value)}
                  rows={8}
                  className="min-h-32"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500 relative">
                <p className="text-slate-800 whitespace-pre-wrap">{response.aiResponse}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-sm">
                <strong>Thời gian:</strong> {response.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-500" />
              <span className="text-sm">
                <strong>Độ tin cậy:</strong> {response.confidence}%
              </span>
            </div>
          </div>

          {/* Lý do từ chối (nếu từ chối) */}
          {response.status === "pending" && (
            <div>
              <Label htmlFor="reject-reason" className="text-sm font-medium">
                Lý do từ chối (tùy chọn)
              </Label>
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối phản hồi này..."
                rows={3}
                className="mt-1"
              />
            </div>
          )}

          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t bg-white p-4 flex-shrink-0">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
              <Button
                variant="outline"
                onClick={() => setRelatedKnowledgeOpen(true)}
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              >
                <BookOpenCheck className="h-4 w-4 mr-2" />
                Bổ sung kiến thức
              </Button>
            </div>

            {response.status === "pending" && (
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleReject}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Từ chối
                </Button>
                <Button onClick={handleApprove}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Phê duyệt
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Related Knowledge Modal */}
      <RelatedKnowledgeModal
        isOpen={relatedKnowledgeOpen}
        onOpenChange={setRelatedKnowledgeOpen}
        responseId={response.id}
        searchContext={response.question}
        onAttachKnowledge={(knowledgeIds) => {
          console.log("Attached knowledge items:", knowledgeIds)
          // Handle knowledge attachment logic here
        }}
      />
    </Dialog>
  )
}
