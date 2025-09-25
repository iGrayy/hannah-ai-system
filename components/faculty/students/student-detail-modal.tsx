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
  X,
} from "lucide-react"

interface StudentDetail {
  id: string
  name: string
  email: string
  major?: string
  class?: string
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
  student: StudentDetail | null
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
    // Tạo email template với thông tin chi tiết
    const emailSubject = `Tin nhắn từ giảng viên - Về tiến độ học tập`
    const emailBody = `Chào ${student.name},

Tôi đã xem xét tiến độ học tập của bạn và muốn chia sẻ một số nhận xét:

📊 Tình hình hiện tại:
- Số câu hỏi đã hỏi: ${student.questionsAsked}
- Tổng số phiên học: ${student.totalSessions}
- Thời gian học trung bình: ${student.avgSessionDuration}
- Hoạt động gần nhất: ${student.lastActive}

💡 Nhận xét về các lĩnh vực kiến thức:
${student.knowledgeAreas.map(area =>
      `- ${area.area}: ${area.mastery}% ${area.mastery >= 80 ? '(Xuất sắc 🏆)' : area.mastery >= 60 ? '(Tốt ✅)' : '(Cần cải thiện ⚠️)'}`
    ).join('\n')}

Hãy liên hệ với tôi nếu bạn có bất kỳ câu hỏi nào.

Trân trọng,
Giảng viên`

    // Mở email client với template
    const mailtoLink = `mailto:${student.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    window.open(mailtoLink, '_blank')

    // Hiển thị confirmation
    alert(`📧 Đã mở email client để gửi tin nhắn đến ${student.name}`)
  }

  const handleScheduleMeeting = () => {
    // Tạo calendar event
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 1) // Ngày mai
    startDate.setHours(14, 0, 0, 0) // 2:00 PM

    const endDate = new Date(startDate)
    endDate.setHours(15, 0, 0, 0) // 3:00 PM

    const eventTitle = `Cuộc họp với sinh viên ${student.name}`
    const eventDescription = `Thảo luận về tiến độ học tập và hỗ trợ sinh viên.

📋 Nội dung cuộc họp:
- Đánh giá tiến độ học tập hiện tại
- Thảo luận về các khó khăn trong học tập
- Đưa ra kế hoạch cải thiện
- Q&A và hỗ trợ

👤 Thông tin sinh viên:
- Tên: ${student.name}
- ID: ${student.id}
- Ngành: ${student.major || (student as any).class || ''}
- Email: ${student.email}

📊 Tình hình học tập:
- Số câu hỏi: ${student.questionsAsked}
- Phiên học: ${student.totalSessions}
- Thời gian TB: ${student.avgSessionDuration}`

    // Tạo Google Calendar link
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(eventDescription)}&location=Phòng họp trực tuyến`

    // Mở Google Calendar
    window.open(googleCalendarUrl, '_blank')

    // Hiển thị confirmation
    alert(`📅 Đã mở Google Calendar để lên lịch họp với ${student.name} vào ngày mai lúc 2:00 PM`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-full h-[95vh] overflow-hidden flex flex-col p-0 gap-0 ">
        {/* Mobile-First Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white/20">
                <AvatarImage src={student.avatar} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    ID: {student.id}
                  </Badge>
                  {(student.major || (student as any).class) && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {student.major || (student as any).class}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20 self-start sm:self-center"
            >
              <X className="h-6 w-6" />
            </Button> */}
          </div>
        </div>

        {/* Mobile-First Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6 space-y-6">

            {/* Quick Stats - Mobile Optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{student.questionsAsked}</p>
                  <p className="text-sm text-gray-600">Câu hỏi</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-center">
                  <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{student.totalSessions}</p>
                  <p className="text-sm text-gray-600">Phiên học</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-gray-900">{student.avgSessionDuration}</p>
                  <p className="text-sm text-gray-600">Thời gian TB</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900">{student.lastActive}</p>
                  <p className="text-sm text-gray-600">Hoạt động cuối</p>
                </div>
              </div>
            </div>



            {/* Activity Charts - Mobile Stack */}
            <div className="space-y-6">
              {/* Line Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 sm:p-6 text-white">
                  <h3 className="text-lg sm:text-xl font-bold">📈 Hoạt động học tập</h3>
                  <p className="text-emerald-100 text-sm mt-1">Xu hướng câu hỏi theo thời gian</p>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockActivityData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: '#374151' }}
                          axisLine={{ stroke: '#d1d5db' }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: '#374151' }}
                          axisLine={{ stroke: '#d1d5db' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="questions"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
                          name="Số câu hỏi"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-4 sm:p-6 text-white">
                    <h3 className="text-lg sm:text-xl font-bold">⏰ Thời gian học tập</h3>
                    <p className="text-rose-100 text-sm mt-1">Phân tích thời gian học theo tuần</p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="h-64 sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockActivityData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: '#374151' }}
                            axisLine={{ stroke: '#d1d5db' }}
                          />
                          <YAxis
                            tick={{ fontSize: 11, fill: '#374151' }}
                            axisLine={{ stroke: '#d1d5db' }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '12px',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                              fontSize: '14px'
                            }}
                          />
                          <Bar
                            dataKey="hours"
                            fill="url(#colorGradient)"
                            radius={[4, 4, 0, 0]}
                            name="Giờ học"
                          />
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ec4899" />
                              <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile-Optimized Details */}
              <div className="space-y-6">

                {/* Recent Questions - Mobile Stack */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 sm:p-6 text-white">
                    <h3 className="text-lg sm:text-xl font-bold">💬 Câu hỏi gần đây</h3>
                    <p className="text-amber-100 text-sm mt-1">Lịch sử tương tác và đánh giá</p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {mockRecentQuestions.map((q) => (
                        <div key={q.id} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <p className="font-medium text-gray-800 line-clamp-2 mb-3 text-sm sm:text-base">{q.question}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-amber-700 font-medium bg-amber-100 px-2 py-1 rounded-full">{q.date}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(q.rating)].map((_, i) => (
                                <span key={i} className="text-amber-400 text-sm sm:text-base">⭐</span>
                              ))}
                              <span className="ml-1 text-xs sm:text-sm text-gray-600">({q.rating}/5)</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />
          </div>
        </div>

        {/* Enhanced Action Footer */}
        <div className="border-t bg-gradient-to-r from-gray-50 to-gray-100 p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            {/* Nút bên phải */}
            <div>
              <Button
                onClick={handleSendMessage}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
              >
                <Send className="h-4 w-4 mr-2" />
                💬 Gửi tin nhắn
              </Button>
            </div>
          </div>
          {/* Action Descriptions */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-2 text-xs text-gray-500 justify-center sm:justify-between">
              <span>💬 Tin nhắn: Mở email với template đánh giá tiến độ</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
