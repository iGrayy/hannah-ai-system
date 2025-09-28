"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { ResponseDetailModal } from "./response-detail-modal"
import { CustomFAQManagement } from "./custom-faq-management"
import { DateRangePickerWithPresets } from "@/components/ui/date-range-picker"
import { DataTablePagination, usePagination } from "@/components/ui/data-table-pagination"
import { BulkOperations, useBulkSelection, BulkSelectionCheckbox, commonBulkActions } from "@/components/ui/bulk-operations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Flag,
  Calendar,
  User,
  Brain,
  AlertTriangle,
  Eye,
  Download,
} from "lucide-react"
import { DateRange } from "react-day-picker"

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
  priority: "low" | "medium" | "high"
}

const mockResponses: Response[] = [
  {
    id: "1",
    student: { name: "Nguyen Van A", id: "SV001", avatar: "/placeholder.svg?height=32&width=32" },
    question: "What is the difference between Stack and Queue data structures?",
    aiResponse:
      "Stack follows LIFO (Last In First Out) principle while Queue follows FIFO (First In First Out) principle. Stack operations are push/pop, Queue operations are enqueue/dequeue...",
    confidence: 95,
    date: "2024-01-15 14:30",
    status: "pending",
    priority: "medium",
  },
  {
    id: "2",
    student: { name: "Tran Thi B", id: "SV002", avatar: "/placeholder.svg?height=32&width=32" },
    question: "How to implement binary search algorithm?",
    aiResponse:
      "Binary search is a divide-and-conquer algorithm that works on sorted arrays. Here's the implementation: function binarySearch(arr, target) { let left = 0, right = arr.length - 1...",
    confidence: 88,
    date: "2024-01-15 13:45",
    status: "approved",
    priority: "low",
  },
  {
    id: "3",
    student: { name: "Le Van C", id: "SV003", avatar: "/placeholder.svg?height=32&width=32" },
    question: "Giải thích các nguyên lý Lập trình Hướng đối tượng",
    aiResponse:
      "OOP has four main principles: Encapsulation, Inheritance, Polymorphism, and Abstraction. Encapsulation bundles data and methods...",
    confidence: 72,
    date: "2024-01-15 12:20",
    status: "pending",
    priority: "high",
  },
]

export function ResponseManagement() {
  const [responses, setResponses] = useState<Response[]>(mockResponses)
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingResponse, setEditingResponse] = useState("")
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [flaggedConversations, setFlaggedConversations] = useState<any[]>([])
  const [convSearch, setConvSearch] = useState("")
  const [convStatus, setConvStatus] = useState<"all" | "handled" | "unhandled">("all")
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [feedbackText, setFeedbackText] = useState("")

  // Load flagged conversations from localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('hannah-flagged-conversations') : null
      setFlaggedConversations(raw ? JSON.parse(raw) : [])
    } catch {
      setFlaggedConversations([])
    }
  }, [])

  const generateSampleConversations = () => {
    const sample = [
      {
        id: `sample-1-${Date.now()}`,
        sessionId: 'sample-1',
        title: 'Giải thuật sắp xếp — câu trả lời lạc đề',
        flaggedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        messages: [
          { id: 'm1', sender: 'user', type: 'text', content: 'Hannah, giải thích QuickSort giúp mình với?', timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString() },
          { id: 'm2', sender: 'hannah', type: 'text', content: 'Dưới đây là hướng dẫn cài đặt Python...', timestamp: new Date(Date.now() - 1000 * 60 * 93).toISOString() },
          { id: 'm3', sender: 'user', type: 'text', content: 'Hình như bạn trả lời sai chủ đề rồi 😅', timestamp: new Date(Date.now() - 1000 * 60 * 92).toISOString() },
        ],
      },
      {
        id: `sample-2-${Date.now()}`,
        sessionId: 'sample-2',
        title: 'Thông tin tiêu cực cần kiểm duyệt',
        flaggedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        messages: [
          { id: 's1', sender: 'user', type: 'text', content: 'GPU là gì và dùng làm gì?', timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString() },
          { id: 's2', sender: 'hannah', type: 'text', content: '...', timestamp: new Date(Date.now() - 1000 * 60 * 33).toISOString() },
        ],
      },
    ]
    const merged = [...sample, ...flaggedConversations]
    persistConversations(merged)
  }

  const persistConversations = (list: any[]) => {
    setFlaggedConversations(list)
    try {
      localStorage.setItem('hannah-flagged-conversations', JSON.stringify(list))
    } catch {}
  }

  const filteredConversations = flaggedConversations.filter((c) => {
    const matchesTitle = c.title?.toLowerCase().includes(convSearch.toLowerCase())
    const isHandled = Boolean(c.handledAt)
    const matchesStatus = convStatus === 'all' || (convStatus === 'handled' ? isHandled : !isHandled)
    return matchesTitle && matchesStatus
  })

  const handleMarkHandled = (id: string) => {
    const updated = flaggedConversations.map((c) => c.id === id ? { ...c, handledAt: new Date().toISOString() } : c)
    persistConversations(updated)
  }

  const handleEditTitle = (id: string) => {
    const title = prompt('Nhập tiêu đề mới:')
    if (title && title.trim()) {
      const updated = flaggedConversations.map((c) => c.id === id ? { ...c, title: title.trim() } : c)
      persistConversations(updated)
    }
  }

  const handleOpenFeedback = (id: string) => {
    const found = flaggedConversations.find((c) => c.id === id)
    setActiveConvId(id)
    setFeedbackText(found?.facultyNote || "")
    setFeedbackOpen(true)
  }

  const handleSaveFeedback = () => {
    if (!activeConvId) return
    const updated = flaggedConversations.map((c) => c.id === activeConvId ? { ...c, facultyNote: feedbackText } : c)
    persistConversations(updated)
    setFeedbackOpen(false)
  }

  const handleDeleteConversation = (id: string) => {
    if (!confirm('Xóa cuộc trò chuyện đã gắn cờ này?')) return
    const updated = flaggedConversations.filter((c) => c.id !== id)
    persistConversations(updated)
  }

  // Pagination
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    handleItemsPerPageChange,
  } = usePagination(responses.length, 20)

  // Bulk selection
  const {
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    handleClearSelection,
    isItemSelected,
    getSelectedItems,
  } = useBulkSelection(responses)

  // Merge flagged responses from Student chat (localStorage) as pending items
  const flagged: Response[] = (() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('hannah-flagged-responses') : null
      if (!raw) return []
      const arr = JSON.parse(raw)
      return (arr as any[]).map((r, idx) => ({
        id: `flag-${r.id || idx}`,
        student: r.student,
        question: r.question,
        aiResponse: r.aiResponse,
        confidence: r.confidence || 0.3,
        date: r.date || new Date().toISOString(),
        status: 'pending',
        priority: 'high',
      }))
    } catch {
      return []
    }
  })()

  const combined = [...flagged, ...responses]

  const filteredResponses = combined.filter((response) => {
    const matchesStatus = filterStatus === "all" || response.status === filterStatus
    const matchesSearch =
      response.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.student.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Date range filter
    let matchesDate = true
    if (dateRange?.from) {
      const responseDate = new Date(response.date)
      matchesDate = responseDate >= dateRange.from
      if (dateRange.to) {
        matchesDate = matchesDate && responseDate <= dateRange.to
      }
    }

    return matchesStatus && matchesSearch && matchesDate
  })

  // Paginated responses
  const paginatedResponses = filteredResponses.slice(startIndex, endIndex)

  const handleApprove = (id: string) => {
    const response = responses.find(r => r.id === id)
    if (response) {
      setResponses((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r)))
      alert(`✅ Đã phê duyệt phản hồi cho câu hỏi: "${response.question}"`)
    }
  }

  const handleReject = (id: string) => {
    const response = responses.find(r => r.id === id)
    if (response) {
      const reason = prompt("Lý do từ chối (tùy chọn):")
      setResponses((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r)))
      alert(`❌ Đã từ chối phản hồi cho câu hỏi: "${response.question}"${reason ? `\nLý do: ${reason}` : ''}`)
    }
  }

  // Bulk actions
  const bulkActions = [
    commonBulkActions.delete((ids) => {
      setResponses((prev) => prev.filter((r) => !ids.includes(r.id)))
      handleClearSelection()
      alert(`🗑️ Đã xóa ${ids.length} phản hồi`)
    }),
    {
      id: "approve",
      label: "Phê duyệt đã chọn",
      icon: CheckCircle,
      variant: "default" as const,
      onClick: (ids: string[]) => {
        setResponses((prev) =>
          prev.map((r) => ids.includes(r.id) ? { ...r, status: "approved" as const } : r)
        )
        handleClearSelection()
        alert(`✅ Đã phê duyệt ${ids.length} phản hồi`)
      },
    },
    {
      id: "reject",
      label: "Từ chối đã chọn",
      icon: XCircle,
      variant: "destructive" as const,
      onClick: (ids: string[]) => {
        setResponses((prev) =>
          prev.map((r) => ids.includes(r.id) ? { ...r, status: "rejected" as const } : r)
        )
        handleClearSelection()
        alert(`❌ Đã từ chối ${ids.length} phản hồi`)
      },
    },
    commonBulkActions.export((ids) => {
      const selectedResponses = responses.filter(r => ids.includes(r.id))
      console.log("Exporting responses:", selectedResponses)
      alert(`📊 Đang xuất ${ids.length} phản hồi...`)
    }),
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Đang chờ duyệt
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã phê duyệt
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
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
        return (
          <Badge variant="destructive" className="text-xs">
            Cao
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Trung bình
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Thấp
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Quản lý phản hồi</h1>
          <p className="text-muted-foreground">Duyệt phản hồi AI và quản lý FAQ tùy chỉnh</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="responses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="responses">Duyệt phản hồi AI</TabsTrigger>
          <TabsTrigger value="faq">Quản lý FAQ tùy chỉnh</TabsTrigger>
          <TabsTrigger value="conversations">Quản lý cuộc trò chuyện</TabsTrigger>
        </TabsList>

        <TabsContent value="responses" className="space-y-6">

      {/* Bulk Operations */}
      <BulkOperations
        selectedItems={selectedItems}
        totalItems={filteredResponses.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        actions={bulkActions}
      />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Lọc phản hồi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo nội dung câu hỏi hoặc tên sinh viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phản hồi</SelectItem>
                <SelectItem value="pending">Đang chờ duyệt</SelectItem>
                <SelectItem value="approved">Đã phê duyệt</SelectItem>
                <SelectItem value="rejected">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePickerWithPresets
              date={dateRange}
              onDateChange={setDateRange}
              placeholder="Lọc theo khoảng thời gian"
            />
          </div>
        </CardContent>
      </Card>

      {/* Response List */}
      <Card>
        <CardHeader>
          <CardTitle>Phản hồi AI ({filteredResponses.length})</CardTitle>
          <CardDescription>Nhấp vào phản hồi để xem chi tiết và xử lý</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <BulkSelectionCheckbox
                    itemId="all"
                    selected={selectedItems.length === filteredResponses.length && filteredResponses.length > 0}
                    onSelectionChange={(_, selected) => handleSelectAll(selected)}
                  />
                </TableHead>
                <TableHead>Sinh viên</TableHead>
                <TableHead>Câu hỏi</TableHead>
                <TableHead>Độ tin cậy</TableHead>
                <TableHead>Ưu tiên</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResponses.map((response) => (
                <TableRow key={response.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <BulkSelectionCheckbox
                      itemId={response.id}
                      selected={isItemSelected(response.id)}
                      onSelectionChange={handleSelectItem}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={response.student.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {response.student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{response.student.name}</div>
                        <div className="text-xs text-muted-foreground">{response.student.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="truncate font-medium">{response.question}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {response.aiResponse.substring(0, 100)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${response.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{response.confidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(response.priority)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{response.date}</TableCell>
                  <TableCell>{getStatusBadge(response.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedResponse(response)
                          setDetailModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {response.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(response.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(response.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-4">
            <DataTablePagination
              totalItems={filteredResponses.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-2">{responses.filter((r) => r.status === "pending").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Đã phê duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-2">{responses.filter((r) => r.status === "approved").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Đã từ chối</span>
            </div>
            <p className="text-2xl font-bold mt-2">{responses.filter((r) => r.status === "rejected").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Ưu tiên cao</span>
            </div>
            <p className="text-2xl font-bold mt-2">{responses.filter((r) => r.priority === "high").length}</p>
          </CardContent>
        </Card>
      </div>

        {/* Response Detail Modal */}
        <ResponseDetailModal
          response={selectedResponse}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        </TabsContent>

        <TabsContent value="faq">
          <CustomFAQManagement />
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cuộc trò chuyện bị gắn cờ</CardTitle>
              <CardDescription>Danh sách các cuộc trò chuyện sinh viên đã đánh dấu cần can thiệp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm theo tiêu đề cuộc trò chuyện..."
                      value={convSearch}
                      onChange={(e) => setConvSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={convStatus} onValueChange={(v) => setConvStatus(v as any)}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="unhandled">Chưa xử lý</SelectItem>
                    <SelectItem value="handled">Đã xử lý</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredConversations.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  <p>Chưa có cuộc trò chuyện nào được đánh dấu.</p>
                  <Button className="mt-2" variant="secondary" size="sm" onClick={generateSampleConversations}>Tạo dữ liệu ví dụ</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredConversations.map((conv) => (
                    <Card key={conv.id} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{conv.title}</CardTitle>
                            <CardDescription>
                              Gắn cờ lúc: {new Date(conv.flaggedAt).toLocaleString()}
                              {conv.handledAt && (
                                <span className="ml-2 inline-flex items-center text-xs">
                                  <Badge variant="secondary">Đã xử lý</Badge>
                                </span>
                              )}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditTitle(conv.id)}>Đổi tiêu đề</Button>
                            <Button variant="outline" size="sm" onClick={() => handleOpenFeedback(conv.id)}>Thêm nhận xét</Button>
                            <Button variant="secondary" size="sm" onClick={() => handleMarkHandled(conv.id)}>Đánh dấu đã xử lý</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteConversation(conv.id)}>Xóa</Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64 border rounded">
                          <div className="p-3 space-y-3">
                            {(conv.messages || []).map((m: any) => (
                              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-lg p-2 text-sm ${m.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                  {m.type === 'code' ? (
                                    <pre className="whitespace-pre-wrap text-xs">{m.content}</pre>
                                  ) : (
                                    <span>{m.content}</span>
                                  )}
                                  <div className="text-[10px] opacity-70 mt-1">
                                    {new Date(m.timestamp).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {conv.facultyNote && (
                              <div className="mt-2 p-2 bg-amber-50 text-amber-900 rounded text-xs">
                                Nhận xét của giảng viên: {conv.facultyNote}
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback Dialog */}
          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm nhận xét</DialogTitle>
                <DialogDescription>Ghi chú để bổ sung dữ liệu hoặc báo cáo cho Quản trị viên.</DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Nhập nhận xét..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setFeedbackOpen(false)}>Hủy</Button>
                <Button onClick={handleSaveFeedback}>Lưu</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}
