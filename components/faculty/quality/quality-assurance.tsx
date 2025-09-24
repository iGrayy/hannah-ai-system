"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Flag,
  MessageSquare,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react"

interface Conversation {
  id: string
  student: {
    name: string
    id: string
    avatar: string
  }
  topic: string
  messagesCount: number
  duration: string
  qualityScore: number
  status: "active" | "flagged" | "completed" | "intervention_needed"
  lastActivity: string
  aiResponses: number
  humanInterventions: number
}

interface QualityMetric {
  name: string
  value: number
  change: number
  status: "good" | "warning" | "critical"
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    student: { name: "Nguyen Van A", id: "SV001", avatar: "/placeholder.svg" },
    topic: "Binary Search Trees",
    messagesCount: 12,
    duration: "25 min",
    qualityScore: 85,
    status: "active",
    lastActivity: "2 min ago",
    aiResponses: 6,
    humanInterventions: 0,
  },
  {
    id: "2",
    student: { name: "Tran Thi B", id: "SV002", avatar: "/placeholder.svg" },
    topic: "Database Normalization",
    messagesCount: 8,
    duration: "15 min",
    qualityScore: 45,
    status: "flagged",
    lastActivity: "5 min ago",
    aiResponses: 4,
    humanInterventions: 1,
  },
  {
    id: "3",
    student: { name: "Le Van C", id: "SV003", avatar: "/placeholder.svg" },
    topic: "Object-Oriented Programming",
    messagesCount: 20,
    duration: "45 min",
    qualityScore: 92,
    status: "completed",
    lastActivity: "1 hour ago",
    aiResponses: 10,
    humanInterventions: 0,
  },
]

const qualityMetrics: QualityMetric[] = [
  { name: "Average Response Accuracy", value: 87, change: +3, status: "good" },
  { name: "Student Satisfaction", value: 4.2, change: +0.1, status: "good" },
  { name: "Response Time (avg)", value: 2.3, change: -0.2, status: "good" },
  { name: "Intervention Rate", value: 12, change: +2, status: "warning" },
]

export function QualityAssurance() {
  const [selectedTab, setSelectedTab] = useState("monitoring")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>
      case "flagged":
        return <Badge className="bg-yellow-100 text-yellow-800">Flagged</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "intervention_needed":
        return <Badge className="bg-red-100 text-red-800">Needs Intervention</Badge>
      default:
        return null
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const handleViewDetails = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setIsDetailModalOpen(true)
  }

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter
    const matchesSearch = conv.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.topic.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quality Assurance</h1>
          <p className="text-slate-600">Monitor conversation quality and AI performance</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              alert("🔄 Đang làm mới dữ liệu...")
              setTimeout(() => alert("✅ Dữ liệu đã được cập nhật!"), 1000)
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => alert("🚩 Có 3 cuộc hội thoại được đánh dấu cần xem xét. Chuyển đến queue?")}
          >
            <Flag className="h-4 w-4 mr-2" />
            Review Flagged
          </Button>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {qualityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.name.includes("Time") ? `${metric.value}s` : 
                 metric.name.includes("Satisfaction") ? `${metric.value}/5` :
                 `${metric.value}%`}
              </div>
              <p className="text-xs text-slate-600">
                <span className={metric.change > 0 ? "text-green-500" : "text-red-500"}>
                  {metric.change > 0 ? "+" : ""}{metric.change}
                  {metric.name.includes("Time") ? "s" : 
                   metric.name.includes("Satisfaction") ? "" : "%"}
                </span> from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="metrics">Quality Metrics</TabsTrigger>
          <TabsTrigger value="intervention">Intervention Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Conversations</CardTitle>
              <CardDescription>Monitor ongoing and recent conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by student name or topic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="intervention_needed">Needs Intervention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conversations Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConversations.map((conversation) => (
                    <TableRow key={conversation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={conversation.student.avatar} />
                            <AvatarFallback>
                              {conversation.student.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{conversation.student.name}</div>
                            <div className="text-sm text-slate-500">{conversation.student.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{conversation.topic}</TableCell>
                      <TableCell>{conversation.messagesCount}</TableCell>
                      <TableCell>{conversation.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getQualityColor(conversation.qualityScore)}`}>
                            {conversation.qualityScore}%
                          </span>
                          <Progress value={conversation.qualityScore} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(conversation.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(conversation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {conversation.status === "flagged" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => alert(`🚩 Can thiệp vào cuộc hội thoại với ${conversation.student.name}\n\nLý do: Chất lượng phản hồi thấp (${conversation.qualityScore}%)`)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Metrics Dashboard</CardTitle>
              <CardDescription>Detailed quality analysis and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">Quality metrics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intervention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intervention Queue</CardTitle>
              <CardDescription>Conversations requiring human intervention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No conversations requiring intervention at the moment</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Conversation Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
          {selectedConversation && (
            <>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white/20">
                      <AvatarImage src={selectedConversation.student.avatar} />
                      <AvatarFallback className="bg-white/20 text-white font-bold">
                        {selectedConversation.student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{selectedConversation.student.name}</h2>
                      <p className="text-indigo-100">ID: {selectedConversation.student.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{selectedConversation.qualityScore}%</div>
                    <p className="text-indigo-100 text-sm">Quality Score</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                <div className="space-y-6">

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="text-center">
                        <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{selectedConversation.messagesCount}</p>
                        <p className="text-sm text-gray-600">Messages</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="text-center">
                        <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{selectedConversation.duration}</p>
                        <p className="text-sm text-gray-600">Duration</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="text-center">
                        <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{selectedConversation.aiResponses}</p>
                        <p className="text-sm text-gray-600">AI Responses</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="text-center">
                        <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{selectedConversation.humanInterventions}</p>
                        <p className="text-sm text-gray-600">Interventions</p>
                      </div>
                    </div>
                  </div>

                  {/* Conversation Topic & Status */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 text-white">
                      <h3 className="text-lg font-bold">📚 Conversation Overview</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Topic</h4>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedConversation.topic}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Status</h4>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(selectedConversation.status)}
                            <span className="text-sm text-gray-500">Last activity: {selectedConversation.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quality Analysis */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
                      <h3 className="text-lg font-bold">📊 Quality Analysis</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">Overall Quality Score</span>
                            <span className={`text-xl font-bold ${getQualityColor(selectedConversation.qualityScore)}`}>
                              {selectedConversation.qualityScore}%
                            </span>
                          </div>
                          <Progress value={selectedConversation.qualityScore} className="h-3" />
                          <p className="text-sm text-gray-500 mt-1">
                            {selectedConversation.qualityScore >= 80 ? "🏆 Excellent quality conversation" :
                             selectedConversation.qualityScore >= 60 ? "✅ Good quality, minor improvements needed" :
                             "⚠️ Needs attention and improvement"}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h5 className="font-semibold text-blue-800 mb-2">Response Accuracy</h5>
                            <div className="text-2xl font-bold text-blue-600">
                              {Math.min(selectedConversation.qualityScore + Math.floor(Math.random() * 10), 100)}%
                            </div>
                            <p className="text-sm text-blue-600">AI responses were accurate</p>
                          </div>

                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h5 className="font-semibold text-green-800 mb-2">Student Engagement</h5>
                            <div className="text-2xl font-bold text-green-600">
                              {Math.min(selectedConversation.qualityScore + Math.floor(Math.random() * 15), 100)}%
                            </div>
                            <p className="text-sm text-green-600">High student participation</p>
                          </div>

                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h5 className="font-semibold text-purple-800 mb-2">Learning Outcome</h5>
                            <div className="text-2xl font-bold text-purple-600">
                              {Math.min(selectedConversation.qualityScore + Math.floor(Math.random() * 8), 100)}%
                            </div>
                            <p className="text-sm text-purple-600">Effective knowledge transfer</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conversation Timeline */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white">
                      <h3 className="text-lg font-bold">💬 Conversation Timeline</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {/* Sample conversation messages */}
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedConversation.student.avatar} />
                            <AvatarFallback className="text-xs">
                              {selectedConversation.student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                            <p className="text-sm text-gray-800">
                              "Can you explain {selectedConversation.topic.toLowerCase()} concepts to me? I'm having trouble understanding the basics."
                            </p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Zap className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                            <p className="text-sm text-gray-800">
                              "I'd be happy to help you understand {selectedConversation.topic.toLowerCase()}! Let me break it down into key concepts..."
                            </p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago • AI Response</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedConversation.student.avatar} />
                            <AvatarFallback className="text-xs">
                              {selectedConversation.student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                            <p className="text-sm text-gray-800">
                              "That makes much more sense now! Can you give me a practical example?"
                            </p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                          </div>
                        </div>

                        <div className="text-center py-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View Full Conversation ({selectedConversation.messagesCount} messages)
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t bg-white p-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {selectedConversation.status === "flagged" && (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Review & Intervene
                      </Button>
                    )}
                    <Button
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Reviewed
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
