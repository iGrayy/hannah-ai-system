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
import { StudentDetailModal } from "./student-detail-modal"
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
  Users,
  Search,
  MessageSquare,
  Clock,
  TrendingUp,
  BookOpen,
  Brain,
  Award,
  AlertCircle,
  Send,
  FileText,
  Calendar,
  Activity,
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

interface StudentActivity {
  date: string
  questions: number
  sessions: number
  duration: number
}

const mockStudents: Student[] = [
  {
    id: "SV001",
    name: "Nguyen Van A",
    email: "nguyenvana@student.edu",
    class: "CS2023A",
    avatar: "/placeholder.svg",
    lastActive: "2 hours ago",
    questionsAsked: 45,
    progressScore: 85,
    status: "active",
    enrollmentDate: "2023-09-01",
    totalSessions: 23,
    avgSessionDuration: "25 min",
    knowledgeAreas: [
      { area: "Data Structures", mastery: 90 },
      { area: "Algorithms", mastery: 75 },
      { area: "OOP", mastery: 85 },
      { area: "Databases", mastery: 60 },
      { area: "Web Dev", mastery: 70 },
    ],
  },
  {
    id: "SV002",
    name: "Tran Thi B",
    email: "tranthib@student.edu",
    class: "CS2023A",
    avatar: "/placeholder.svg",
    lastActive: "1 day ago",
    questionsAsked: 12,
    progressScore: 45,
    status: "struggling",
    enrollmentDate: "2023-09-01",
    totalSessions: 8,
    avgSessionDuration: "15 min",
    knowledgeAreas: [
      { area: "Data Structures", mastery: 40 },
      { area: "Algorithms", mastery: 35 },
      { area: "OOP", mastery: 50 },
      { area: "Databases", mastery: 45 },
      { area: "Web Dev", mastery: 55 },
    ],
  },
  {
    id: "SV003",
    name: "Le Van C",
    email: "levanc@student.edu",
    class: "CS2023B",
    avatar: "/placeholder.svg",
    lastActive: "30 min ago",
    questionsAsked: 78,
    progressScore: 95,
    status: "excelling",
    enrollmentDate: "2023-09-01",
    totalSessions: 35,
    avgSessionDuration: "40 min",
    knowledgeAreas: [
      { area: "Data Structures", mastery: 95 },
      { area: "Algorithms", mastery: 92 },
      { area: "OOP", mastery: 98 },
      { area: "Databases", mastery: 88 },
      { area: "Web Dev", mastery: 90 },
    ],
  },
]

const activityData: StudentActivity[] = [
  { date: "Mon", questions: 12, sessions: 8, duration: 180 },
  { date: "Tue", questions: 15, sessions: 10, duration: 220 },
  { date: "Wed", questions: 8, sessions: 6, duration: 150 },
  { date: "Thu", questions: 18, sessions: 12, duration: 280 },
  { date: "Fri", questions: 22, sessions: 15, duration: 320 },
  { date: "Sat", questions: 6, sessions: 4, duration: 90 },
  { date: "Sun", questions: 4, sessions: 3, duration: 60 },
]

export function StudentMonitoring() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [classFilter, setClassFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [detailModalOpen, setDetailModalOpen] = useState(false)

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

  const filteredStudents = mockStudents.filter((student) => {
    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    const matchesClass = classFilter === "all" || student.class === classFilter
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesClass && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Monitoring</h1>
          <p className="text-slate-600">Track student progress and identify learning patterns</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("📊 Đang tạo báo cáo tiến độ học tập của sinh viên... Sẽ xuất file PDF sau 3 giây!")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            size="sm"
            onClick={() => {
              const message = prompt("Nhập tin nhắn gửi đến sinh viên:")
              if (message) {
                alert(`📧 Đã gửi tin nhắn đến tất cả sinh viên:\n\n"${message}"`)
              }
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-slate-600">
              <span className="text-green-500">+8</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-slate-600">
              <span className="text-green-500">91%</span> engagement rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-slate-600">
              <span className="text-green-500">+5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-slate-600">
              <span className="text-red-500">8%</span> of total students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Student List</CardTitle>
              <CardDescription>Monitor individual student progress and activity</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="struggling">Struggling</SelectItem>
                    <SelectItem value="excelling">Excelling</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="CS2023A">CS2023A</SelectItem>
                    <SelectItem value="CS2023B">CS2023B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Students Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="cursor-pointer hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>
                              {student.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-slate-500">{student.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.questionsAsked}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getProgressColor(student.progressScore)}`}>
                            {student.progressScore}%
                          </span>
                          <Progress value={student.progressScore} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>{student.lastActive}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student)
                            setDetailModalOpen(true)
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Student engagement patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="questions" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </div>
  )
}
