"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table"
import {
  AlertTriangle,
  TrendingUp,
  Users,
  BarChart3,
  Download,
  BookOpen,
  MessageSquare,
  Bell,
  Mail,
  FileText,
  Target,
  CheckCircle,
  Settings,
  Calendar,
  Filter,
  Search,
  HelpCircle,
  Brain,
  Lightbulb,
  Flag,
  Eye,
  RefreshCw
} from "lucide-react"

// Types for Learning Progress Tracking
interface QuestionData {
  id: string
  question: string
  subject: "SE" | "IS" | "JS"
  topic: string
  chapter: string
  student_id: string
  student_name: string
  timestamp: string
  ai_confidence_score: number
  is_helpful: boolean
  frequency: number
  class_id: "L01" | "L02"
  assignment_score: number | null
}

interface KnowledgeGap {
  topic: string
  subject: string
  chapter: string
  questionCount: number
  studentCount: number
  avgConfidence: number
  difficulty: "high" | "medium" | "low"
  suggestions: string[]
  class_id: "L01" | "L02" | "all"
}

interface LearningMetric {
  name: string
  value: number
  change: number
  status: "good" | "warning" | "critical"
  unit: string
}

interface Alert {
  id: string
  type: "spike" | "low_confidence" | "gap_detected"
  title: string
  description: string
  severity: "high" | "medium" | "low"
  timestamp: string
  actionable: boolean
}

// Mock data for learning progress tracking
const mockQuestionData: QuestionData[] = [
  {
    id: "1",
    question: "Cây tìm kiếm nhị phân hoạt động như thế nào?",
    subject: "SE",
    topic: "Cấu trúc dữ liệu",
    chapter: "Chương 3",
    student_id: "ST001",
    student_name: "Nguyen Van A",
    timestamp: "2024-01-15T10:30:00Z",
    ai_confidence_score: 85,
    is_helpful: true,
    frequency: 12,
    class_id: "L01",
    assignment_score: 8.5
  },
  {
    id: "2",
    question: "Chuẩn hóa cơ sở dữ liệu là gì?",
    subject: "IS",
    topic: "Cơ sở dữ liệu",
    chapter: "Chương 2",
    student_id: "ST002",
    student_name: "Tran Thi B",
    timestamp: "2024-01-15T11:15:00Z",
    ai_confidence_score: 45,
    is_helpful: false,
    frequency: 25,
    class_id: "L02",
    assignment_score: 6.0
  },
  {
    id: "3",
    question: "Lập trình hướng đối tượng có ưu điểm gì?",
    subject: "SE",
    topic: "OOP",
    chapter: "Chương 1",
    student_id: "ST003",
    student_name: "Le Van C",
    timestamp: "2024-01-15T14:20:00Z",
    ai_confidence_score: 92,
    is_helpful: true,
    frequency: 8,
    class_id: "L01",
    assignment_score: 9.0
  },
  {
    id: "4",
    question: "Cách implement Stack và Queue?",
    subject: "SE",
    topic: "Cấu trúc dữ liệu",
    chapter: "Chương 3",
    student_id: "ST004",
    student_name: "Pham Van D",
    timestamp: "2024-01-16T09:30:00Z",
    ai_confidence_score: 78,
    is_helpful: true,
    frequency: 10,
    class_id: "L02",
    assignment_score: 7.5
  },
  {
    id: "5",
    question: "SQL JOIN hoạt động như thế nào?",
    subject: "IS",
    topic: "Database Queries",
    chapter: "Chương 3",
    student_id: "ST005",
    student_name: "Dao Van E",
    timestamp: "2024-01-17T10:15:00Z",
    ai_confidence_score: 35,
    is_helpful: false,
    frequency: 22,
    class_id: "L01",
    assignment_score: 5.0
  },
  {
    id: "6",
    question: "Promise và async/await khác nhau gì?",
    subject: "JS",
    topic: "Asynchronous Programming",
    chapter: "Chương 5",
    student_id: "ST006",
    student_name: "Bui Thi F",
    timestamp: "2024-01-18T13:45:00Z",
    ai_confidence_score: 55,
    is_helpful: true,
    frequency: 14,
    class_id: "L02",
    assignment_score: 7.0
  },
  {
    id: "7",
    question: "Thuật toán sắp xếp nào hiệu quả nhất?",
    subject: "SE",
    topic: "Algorithms",
    chapter: "Chương 5",
    student_id: "ST007",
    student_name: "Hoang Van G",
    timestamp: "2024-01-17T08:10:00Z",
    ai_confidence_score: 30,
    is_helpful: false,
    frequency: 20,
    class_id: "L01",
    assignment_score: 5.5
  },
  {
    id: "8",
    question: "Mô hình MVC trong web development?",
    subject: "SE",
    topic: "Web Architecture",
    chapter: "Chương 6",
    student_id: "ST008",
    student_name: "Vu Thi H",
    timestamp: "2024-01-17T15:30:00Z",
    ai_confidence_score: 40,
    is_helpful: false,
    frequency: 18,
    class_id: "L02",
    assignment_score: 6.5
  }
]

const knowledgeGaps: KnowledgeGap[] = [
  {
    topic: "Chuẩn hóa CSDL",
    subject: "IS",
    chapter: "Chương 2",
    questionCount: 45,
    studentCount: 23,
    avgConfidence: 52,
    difficulty: "high",
    suggestions: [
      "Tạo bài giảng bổ sung về các dạng chuẩn hóa",
      "Tổ chức buổi thảo luận nhóm",
      "Cung cấp thêm ví dụ thực tế"
    ],
    class_id: "all"
  },
  {
    topic: "Thuật toán sắp xếp",
    subject: "SE",
    chapter: "Chương 4",
    questionCount: 32,
    studentCount: 18,
    avgConfidence: 68,
    difficulty: "medium",
    suggestions: [
      "Làm bài tập thực hành thêm",
      "Visualize thuật toán bằng animation",
      "So sánh hiệu suất các thuật toán"
    ],
    class_id: "L01"
  },
  {
    topic: "Promise và Async/Await",
    subject: "JS",
    chapter: "Chương 5",
    questionCount: 28,
    studentCount: 15,
    avgConfidence: 71,
    difficulty: "medium",
    suggestions: [
      "Thực hành với API thực tế",
      "Giải thích callback hell",
      "Demo error handling"
    ],
    class_id: "L02"
  },
  {
    topic: "Database JOIN Operations",
    subject: "IS",
    chapter: "Chương 3",
    questionCount: 38,
    studentCount: 20,
    avgConfidence: 42,
    difficulty: "high",
    suggestions: [
      "Tạo diagram minh họa các loại JOIN",
      "Thực hành với database thực tế",
      "Bổ sung bài tập từ cơ bản đến nâng cao"
    ],
    class_id: "L01"
  },
  {
    topic: "Web Architecture Patterns",
    subject: "SE",
    chapter: "Chương 6",
    questionCount: 25,
    studentCount: 12,
    avgConfidence: 48,
    difficulty: "high",
    suggestions: [
      "So sánh các pattern phổ biến",
      "Demo ứng dụng thực tế",
      "Tạo case study chi tiết"
    ],
    class_id: "L02"
  }
]

const learningMetrics: LearningMetric[] = [
  { name: "Tổng số câu hỏi", value: 1247, change: +156, status: "good", unit: " câu" },
  { name: "Sinh viên tích cực", value: 89, change: +12, status: "good", unit: " người" },
  { name: "Độ tin cậy AI trung bình", value: 78, change: -3, status: "warning", unit: "%" },
  { name: "Chủ đề khó", value: 15, change: +2, status: "critical", unit: " chủ đề" }
]

// Chart data
const questionsByTimeData = [
  { name: 'T2', SE: 45, IS: 32, JS: 28 },
  { name: 'T3', SE: 52, IS: 38, JS: 35 },
  { name: 'T4', SE: 48, IS: 45, JS: 42 },
  { name: 'T5', SE: 61, IS: 41, JS: 38 },
  { name: 'T6', SE: 55, IS: 35, JS: 30 },
  { name: 'T7', SE: 42, IS: 30, JS: 28 },
  { name: 'CN', SE: 38, IS: 28, JS: 25 }
]

const subjectDistributionData = [
  { name: 'Software Engineering', value: 45, color: '#3B82F6' },
  { name: 'Information Systems', value: 35, color: '#10B981' },
  { name: 'JavaScript', value: 20, color: '#F59E0B' }
]

// Additional mock data for alerts and suggestions
const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "spike",
    title: "Tăng đột biến câu hỏi về Chuẩn hóa CSDL",
    description: "Số lượng câu hỏi về chủ đề này tăng 300% trong tuần qua",
    severity: "high",
    timestamp: "2024-01-16T08:00:00Z",
    actionable: true
  },
  {
    id: "2",
    type: "low_confidence",
    title: "Độ tin cậy AI thấp cho OOP",
    description: "AI chỉ đạt 45% độ tin cậy trung bình cho các câu hỏi về OOP",
    severity: "medium",
    timestamp: "2024-01-16T09:30:00Z",
    actionable: true
  }
]

export function LearningProgressTracker() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)

  // Helper functions
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyConfig = {
      high: { label: "Khó", variant: "destructive" as const },
      medium: { label: "Trung bình", variant: "default" as const },
      low: { label: "Dễ", variant: "secondary" as const },
    }
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig.medium
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // Filter questions based on search and subject
  const filteredQuestions = mockQuestionData.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === "all" || question.subject === subjectFilter
    return matchesSearch && matchesSubject
  })

  // Get popular questions (top 10 by frequency)
  const popularQuestions = [...mockQuestionData]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10)

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Theo dõi Tiến độ Học tập</h1>
            <p className="text-gray-600 mt-1">Phân tích và hỗ trợ quá trình học tập của sinh viên</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setTimeout(() => alert("✅ Dữ liệu đã được cập nhật!"), 1000)
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {learningMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.value}{metric.unit}
                    </p>
                    <p className={`text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}
                    </p>
                  </div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    metric.status === 'good' ? 'bg-green-100 text-green-600' :
                    metric.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {metric.status === 'good' ? <CheckCircle className="h-5 w-5" /> :
                     metric.status === 'warning' ? <AlertTriangle className="h-5 w-5" /> :
                     <Flag className="h-5 w-5" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 px-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Tổng quan & Phân tích</TabsTrigger>
          <TabsTrigger value="actions">Hành động & Hỗ trợ</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview & Analysis */}
        <TabsContent value="overview" className="space-y-6">
          {/* Question Frequency Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tần suất câu hỏi theo thời gian
              </CardTitle>
              <CardDescription>
                Số lượng câu hỏi được đặt mỗi tuần, phân loại theo môn học
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={questionsByTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="SE" fill="#3B82F6" name="Software Engineering" />
                  <Bar dataKey="IS" fill="#10B981" name="Information Systems" />
                  <Bar dataKey="JS" fill="#F59E0B" name="JavaScript" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Topic Distribution and Popular Questions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Topic Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Phân bố chủ đề
                </CardTitle>
                <CardDescription>
                  Tỷ lệ phần trăm câu hỏi theo từng môn học
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={subjectDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {subjectDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Popular Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Câu hỏi phổ biến
                </CardTitle>
                <CardDescription>
                  Top 10 câu hỏi được đặt nhiều nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularQuestions.slice(0, 5).map((question, index) => (
                    <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {question.question}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {question.subject}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {question.frequency} lần
                          </span>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${getConfidenceColor(question.ai_confidence_score)}`}>
                        {question.ai_confidence_score}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Knowledge Gap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Phân tích khoảng trống kiến thức
              </CardTitle>
              <CardDescription>
                Các chủ đề khó và số lượng sinh viên gặp khó khăn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {knowledgeGaps.map((gap, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900">{gap.topic}</h4>
                        {getDifficultyBadge(gap.difficulty)}
                        <Badge variant="outline">{gap.subject}</Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {gap.chapter}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{gap.questionCount}</div>
                        <div className="text-xs text-gray-500">Câu hỏi</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{gap.studentCount}</div>
                        <div className="text-xs text-gray-500">Sinh viên</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getConfidenceColor(gap.avgConfidence)}`}>
                          {gap.avgConfidence}%
                        </div>
                        <div className="text-xs text-gray-500">Độ tin cậy</div>
                      </div>
                    </div>

                    <Progress value={gap.avgConfidence} className="mb-3" />

                    <div className="text-sm text-gray-600">
                      <strong>Gợi ý:</strong> {gap.suggestions.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Actions & Support */}
        <TabsContent value="actions" className="space-y-6">
          {/* Alerts & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Cảnh báo & Thông báo
              </CardTitle>
              <CardDescription>
                Các vấn đề cần chú ý và hành động khuyến nghị
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${
                    alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                          <Badge variant={alert.severity === 'high' ? 'destructive' :
                                        alert.severity === 'medium' ? 'default' : 'secondary'}>
                            {alert.severity === 'high' ? 'Cao' :
                             alert.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                        <div className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      {alert.actionable && (
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actionable Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Gợi ý hành động
              </CardTitle>
              <CardDescription>
                Các hành động cụ thể để cải thiện hiệu quả học tập
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {knowledgeGaps.map((gap, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-semibold text-gray-900">{gap.topic}</h4>
                      <Badge variant="outline">{gap.subject}</Badge>
                    </div>
                    <div className="space-y-2">
                      {gap.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <Button size="sm" className="w-full">
                        Thực hiện hành động
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export & Reporting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Xuất báo cáo
                </CardTitle>
                <CardDescription>
                  Tạo và xuất báo cáo tiến độ học tập
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Loại báo cáo</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại báo cáo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Báo cáo hàng ngày</SelectItem>
                      <SelectItem value="weekly">Báo cáo hàng tuần</SelectItem>
                      <SelectItem value="monthly">Báo cáo hàng tháng</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Định dạng</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn định dạng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất báo cáo
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Cài đặt thông báo
                </CardTitle>
                <CardDescription>
                  Quản lý các thông báo và cảnh báo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser-notifications">Thông báo trình duyệt</Label>
                    <p className="text-sm text-gray-500">Nhận thông báo trực tiếp trên trình duyệt</p>
                  </div>
                  <Switch
                    id="browser-notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Thông báo email</Label>
                    <p className="text-sm text-gray-500">Gửi báo cáo qua email hàng tuần</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-threshold">Ngưỡng cảnh báo (%)</Label>
                  <Input
                    id="alert-threshold"
                    type="number"
                    placeholder="60"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500">
                    Cảnh báo khi độ tin cậy AI dưới ngưỡng này
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi báo cáo test
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}