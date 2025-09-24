"use client"

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
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  MessageSquare,
  Clock,
  TrendingUp,
  Award,
  Activity,
  Send,
  Phone,
} from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  class: string
  avatar: string
  lastActive: string
  questionsAsked: number
  progressScore: number
  status: "active" | "inactive" | "struggling" | "excelling"
  enrollmentDate: string
  totalSessions: number
  avgSessionDuration: string
  knowledgeAreas: {
    area: string
    mastery: number
  }[]
}

interface StudentDetailModalProps {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockActivityData = [
  { date: "Week 1", questions: 8, sessions: 5, hours: 2.5 },
  { date: "Week 2", questions: 12, sessions: 8, hours: 4.2 },
  { date: "Week 3", questions: 6, sessions: 4, hours: 1.8 },
  { date: "Week 4", questions: 15, sessions: 10, hours: 5.1 },
]

const mockRecentQuestions = [
  {
    id: 1,
    question: "How to implement binary search?",
    date: "2024-01-15 14:30",
    answered: true,
    rating: 5,
  },
  {
    id: 2,
    question: "Explain object-oriented programming",
    date: "2024-01-14 10:15",
    answered: true,
    rating: 4,
  },
  {
    id: 3,
    question: "What is database normalization?",
    date: "2024-01-13 16:45",
    answered: true,
    rating: 5,
  },
]

export function StudentDetailModal({ student, open, onOpenChange }: StudentDetailModalProps) {
  if (!student) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "struggling":
        return <Badge className="bg-red-100 text-red-800">Struggling</Badge>
      case "excelling":
        return <Badge className="bg-blue-100 text-blue-800">Excelling</Badge>
      default:
        return null
    }
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const handleSendMessage = () => {
    const message = prompt(`Gửi tin nhắn đến ${student.name}:`)
    if (message) {
      alert(`📧 Đã gửi tin nhắn đến ${student.name}:\n\n"${message}"`)
    }
  }

  const handleScheduleMeeting = () => {
    alert(`📅 Đã lên lịch cuộc họp với ${student.name}. Email xác nhận sẽ được gửi.`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Hồ sơ sinh viên: {student.name}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về tiến độ học tập và hoạt động
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-6 py-2">
          {/* Student Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={student.avatar} />
                <AvatarFallback className="text-lg">
                  {student.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-slate-600">{student.id} • {student.class}</p>
                <p className="text-sm text-slate-500">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(student.status)}
              <div className="text-right">
                <div className={`text-2xl font-bold ${getProgressColor(student.progressScore)}`}>
                  {student.progressScore}%
                </div>
                <p className="text-sm text-slate-600">Overall Progress</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats & Info */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thống kê nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Câu hỏi đã hỏi</span>
                    </div>
                    <span className="font-semibold">{student.questionsAsked}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Phiên học</span>
                    </div>
                    <span className="font-semibold">{student.totalSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Thời gian TB</span>
                    </div>
                    <span className="font-semibold">{student.avgSessionDuration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Hoạt động cuối</span>
                    </div>
                    <span className="font-semibold">{student.lastActive}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Questions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Câu hỏi gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockRecentQuestions.map((q) => (
                      <div key={q.id} className="p-3 border rounded-lg">
                        <p className="text-sm font-medium line-clamp-2">{q.question}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-500">{q.date}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(q.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">⭐</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Knowledge Areas */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bản đồ kiến thức</CardTitle>
                  <CardDescription>Mức độ thành thạo các lĩnh vực</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={student.knowledgeAreas}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="area" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Mastery"
                          dataKey="mastery"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chi tiết thành thạo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {student.knowledgeAreas.map((area, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{area.area}</span>
                          <span className="font-medium">{area.mastery}%</span>
                        </div>
                        <Progress value={area.mastery} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Activity Chart */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hoạt động theo tuần</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={mockActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="questions" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thời gian học</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={mockActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t bg-white p-4 flex-shrink-0">
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleScheduleMeeting}>
                <Calendar className="h-4 w-4 mr-2" />
                Lên lịch họp
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4 mr-2" />
                Gửi tin nhắn
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
