"use client"

import { useState } from "react"
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
import { ResponseDetailModal } from "@/components/response-detail-modal"
import { CustomFAQManagement } from "@/components/custom-faq-management"
import { DateRangePickerWithPresets } from "@/components/ui/date-range-picker"
import { DataTablePagination, usePagination } from "@/components/ui/data-table-pagination"
import { BulkOperations, useBulkSelection, BulkSelectionCheckbox, commonBulkActions } from "@/components/ui/bulk-operations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    question: "Explain Object-Oriented Programming principles",
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

  const filteredResponses = responses.filter((response) => {
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
      label: "Approve Selected",
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
      label: "Reject Selected",
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
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
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
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
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
          <h1 className="text-3xl font-bold text-balance">Response Management</h1>
          <p className="text-muted-foreground">Review AI responses and manage custom FAQ content</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="responses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="responses">AI Response Review</TabsTrigger>
          <TabsTrigger value="faq">Custom FAQ Management</TabsTrigger>
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
            Filter Responses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by question content or student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Responses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePickerWithPresets
              date={dateRange}
              onDateChange={setDateRange}
              placeholder="Filter by date range"
            />
          </div>
        </CardContent>
      </Card>

      {/* Response List */}
      <Card>
        <CardHeader>
          <CardTitle>AI Responses ({filteredResponses.length})</CardTitle>
          <CardDescription>Click on any response to view details and take action</CardDescription>
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
                <TableHead>Student</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
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
              <span className="text-sm font-medium">Approved</span>
            </div>
            <p className="text-2xl font-bold mt-2">{responses.filter((r) => r.status === "approved").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Rejected</span>
            </div>
            <p className="text-2xl font-bold mt-2">{responses.filter((r) => r.status === "rejected").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">High Priority</span>
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
      </Tabs>
    </div>
  )
}
