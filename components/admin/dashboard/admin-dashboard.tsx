"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Zap,
  Shield,
  BarChart3,
  Download,
  Settings,
  Bell
} from "lucide-react"

interface SystemMetric {
  label: string
  value: string
  change: string
  trend: "up" | "down" | "stable"
  icon: React.ComponentType<any>
  color: string
}

interface SystemAlert {
  id: string
  type: "warning" | "error" | "info"
  title: string
  message: string
  timestamp: string
}

const systemMetrics: SystemMetric[] = [
  {
    label: "Tổng người dùng",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-500"
  },
  {
    label: "Câu hỏi hôm nay",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: MessageSquare,
    color: "text-green-500"
  },
  {
    label: "Nội dung KB",
    value: "5,678",
    change: "+3.1%",
    trend: "up",
    icon: BookOpen,
    color: "text-purple-500"
  },
  {
    label: "Uptime hệ thống",
    value: "99.9%",
    change: "0%",
    trend: "stable",
    icon: Activity,
    color: "text-orange-500"
  }
]

const systemAlerts: SystemAlert[] = [
  {
    id: "1",
    type: "warning",
    title: "Dung lượng database cao",
    message: "Database đã sử dụng 85% dung lượng. Cần xem xét mở rộng.",
    timestamp: "5 phút trước"
  },
  {
    id: "2",
    type: "info",
    title: "Cập nhật AI model",
    message: "Phiên bản mới của AI model đã sẵn sàng để triển khai.",
    timestamp: "2 giờ trước"
  },
  {
    id: "3",
    type: "error",
    title: "Lỗi integration",
    message: "Kết nối với OpenAI API gặp sự cố tạm thời.",
    timestamp: "1 ngày trước"
  }
]

const recentActivities = [
  {
    id: "1",
    action: "Người dùng mới đăng ký",
    user: "Nguyễn Văn A",
    timestamp: "2 phút trước",
    type: "user"
  },
  {
    id: "2",
    action: "Cập nhật knowledge base",
    user: "TS. Trần Thị B",
    timestamp: "15 phút trước",
    type: "content"
  },
  {
    id: "3",
    action: "Hoàn thành training AI model",
    user: "System",
    timestamp: "1 giờ trước",
    type: "system"
  },
  {
    id: "4",
    action: "Backup database thành công",
    user: "System",
    timestamp: "3 giờ trước",
    type: "system"
  }
]

export function AdminDashboard() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4 text-blue-500" />
      case "content":
        return <BookOpen className="h-4 w-4 text-green-500" />
      case "system":
        return <Settings className="h-4 w-4 text-gray-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bảng điều khiển Admin</h1>
          <p className="text-muted-foreground">
            Tổng quan hệ thống Hannah AI Learning Assistant
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt hệ thống
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className={`text-xs ${
                      metric.trend === "up" ? "text-green-600" : 
                      metric.trend === "down" ? "text-red-600" : "text-gray-600"
                    }`}>
                      {metric.change} so với tháng trước
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Tình trạng hệ thống
            </CardTitle>
            <CardDescription>
              Hiệu năng và tình trạng các thành phần hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Database Storage</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Response Time</span>
                <span>120ms</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Cảnh báo hệ thống
            </CardTitle>
            <CardDescription>
              Các thông báo và cảnh báo quan trọng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription>
              Các hoạt động và thay đổi mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-2">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Thao tác nhanh
            </CardTitle>
            <CardDescription>
              Các tác vụ quản trị thường dùng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Quản lý người dùng
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Backup database
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Cập nhật knowledge base
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Kiểm tra bảo mật
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Cấu hình AI model
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tóm tắt trạng thái hệ thống</CardTitle>
          <CardDescription>
            Tổng quan về tình trạng hoạt động của các module chính
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">AI Engine</p>
                <p className="text-sm text-muted-foreground">Hoạt động bình thường</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-muted-foreground">Cần chú ý dung lượng</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">API Services</p>
                <p className="text-sm text-muted-foreground">Hoạt động tốt</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
