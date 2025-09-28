"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DateRangePickerWithPresets } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
// Removed analytics imports - using simplified components instead
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  BookOpen,
  Brain,
  Calendar,
  Download,
  Target,
  AlertTriangle,
  Lightbulb,
  Bell,
  Settings,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown
} from "lucide-react"
import { DateRange } from "react-day-picker"

// Enhanced data structures for the new dashboard
const questionTrendData = [
  { month: "Jan", questions: 245, responses: 238, accuracy: 94.2 },
  { month: "Feb", questions: 312, responses: 301, accuracy: 95.1 },
  { month: "Mar", questions: 428, responses: 415, accuracy: 93.8 },
  { month: "Apr", questions: 389, responses: 378, accuracy: 94.7 },
  { month: "May", questions: 467, responses: 452, accuracy: 95.3 },
  { month: "Jun", questions: 523, responses: 508, accuracy: 96.1 },
]

const topicData = [
  { topic: "Data Structures", count: 89, difficulty: "Medium", avgTime: "12m" },
  { topic: "Algorithms", count: 76, difficulty: "Hard", avgTime: "18m" },
  { topic: "OOP Concepts", count: 65, difficulty: "Easy", avgTime: "8m" },
  { topic: "Database Design", count: 54, difficulty: "Medium", avgTime: "15m" },
  { topic: "Web Development", count: 43, difficulty: "Easy", avgTime: "10m" },
]

const questionTypeData = [
  { name: "Technical", value: 45, color: "#3b82f6", trend: "+12%" },
  { name: "Conceptual", value: 30, color: "#10b981", trend: "+8%" },
  { name: "Project Help", value: 25, color: "#f59e0b", trend: "-3%" },
]

const recentActivities = [
  { id: 1, type: "response", message: "AI response flagged for review", time: "2 phút trước", priority: "high" },
  { id: 2, type: "student", message: "Sinh viên Nguyễn Văn A cần hỗ trợ", time: "5 phút trước", priority: "medium" },
  { id: 3, type: "knowledge", message: "Cập nhật tài liệu mới: React Hooks", time: "10 phút trước", priority: "low" },
  { id: 4, type: "quality", message: "Độ chính xác AI giảm xuống 92%", time: "15 phút trước", priority: "high" },
]

const performanceMetrics = [
  { name: "Hôm nay", responses: 156, accuracy: 94.2, avgTime: "2.3m", satisfaction: 4.6 },
  { name: "Tuần này", responses: 1247, accuracy: 95.1, avgTime: "2.1m", satisfaction: 4.7 },
  { name: "Tháng này", responses: 4832, accuracy: 94.8, avgTime: "2.4m", satisfaction: 4.5 },
]

export function FacultyDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
Bạn có muốn tôi fix lỗi này và implement đầy đủ các tab còn thiếu không?          <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan về hoạt động giảng dạy và phân tích sinh viên</p>
        </div>
        <div className="flex gap-2">
          <DateRangePickerWithPresets
            date={dateRange}
            onDateChange={setDateRange}
            placeholder="Chọn khoảng thời gian"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("📊 Đang xuất báo cáo PDF... Sẽ tải xuống sau 3 giây!")}
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích sinh viên</TabsTrigger>
          <TabsTrigger value="knowledge-gaps">Khoảng trống kiến thức</TabsTrigger>
          <TabsTrigger value="insights">Insights & Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số câu hỏi</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sinh viên hoạt động</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8%</span> so với tuần trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Độ chính xác của AI</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <Progress value={94.2} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                Ưu tiên cao: 5
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng câu hỏi</CardTitle>
            <CardDescription>Khối lượng câu hỏi theo thời gian (tháng)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={questionTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="questions" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Question Types */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố loại câu hỏi</CardTitle>
            <CardDescription>Các loại câu hỏi sinh viên hay hỏi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={questionTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {questionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {questionTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Topics */}
      <Card>
          <CardHeader>
          <CardTitle>Chủ đề được hỏi nhiều nhất</CardTitle>
          <CardDescription>Top 5 chủ đề được hỏi nhiều</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topicData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="topic" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Duyệt phản hồi
            </CardTitle>
            <CardDescription>Kiểm tra phản hồi AI chờ giảng viên duyệt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">23</span>
              <Badge variant="destructive">Khẩn cấp</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Cập nhật kho tri thức
            </CardTitle>
            <CardDescription>Thêm nội dung mới và cập nhật tài liệu hiện có</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cập nhật gần nhất</span>
              <span className="text-sm">2 giờ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Phân tích sinh viên
            </CardTitle>
            <CardDescription>Xem tiến độ và mức độ tương tác chi tiết</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">342</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Advanced analytics have been simplified</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Use the simplified dashboard for basic analytics.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge-gaps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Gaps</CardTitle>
              <CardDescription>Knowledge gap analysis has been simplified</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Check the quality monitor for basic gap indicators.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
              <CardDescription>Advanced insights have been simplified</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Basic insights are available in the main dashboard.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
