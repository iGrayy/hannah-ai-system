"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Lock, Users, Activity } from "lucide-react"

const securityEvents = [
  {
    id: 1,
    type: "login",
    user: "admin@hannah.edu",
    action: "Successful login",
    time: "2024-01-15 10:30",
    status: "success",
  },
  {
    id: 2,
    type: "failed_login",
    user: "unknown@test.com",
    action: "Failed login attempt",
    time: "2024-01-15 10:25",
    status: "warning",
  },
  {
    id: 3,
    type: "permission",
    user: "faculty@hannah.edu",
    action: "Accessed admin panel",
    time: "2024-01-15 10:20",
    status: "warning",
  },
  {
    id: 4,
    type: "data",
    user: "admin@hannah.edu",
    action: "Exported user data",
    time: "2024-01-15 10:15",
    status: "info",
  },
  {
    id: 5,
    type: "config",
    user: "admin@hannah.edu",
    action: "Updated system config",
    time: "2024-01-15 10:10",
    status: "success",
  },
]

const complianceChecks = [
  { name: "Data Encryption", status: "passed", description: "All data encrypted at rest and in transit" },
  { name: "Access Controls", status: "passed", description: "Role-based access control implemented" },
  { name: "Audit Logging", status: "passed", description: "All actions logged and monitored" },
  { name: "Password Policy", status: "warning", description: "Some users have weak passwords" },
  { name: "Session Management", status: "passed", description: "Secure session handling active" },
]

export function AdminSecurity() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bảo mật & Tuân thủ</h1>
        <p className="text-muted-foreground">Theo dõi sự kiện bảo mật và trạng thái tuân thủ</p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm bảo mật</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92/100</div>
            <p className="text-xs text-muted-foreground">Mức độ bảo mật xuất sắc</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phiên hoạt động</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Số người dùng đang đăng nhập</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đăng nhập thất bại</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">24 giờ gần nhất</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bật 2FA</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">Tài khoản admin đã bật</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <div className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Cảnh báo bảo mật</AlertTitle>
          <AlertDescription>
            Phát hiện 3 lần đăng nhập thất bại từ IP 192.168.1.100 trong 1 giờ qua.
            <Button variant="link" className="p-0 h-auto ml-2">
              Điều tra
            </Button>
          </AlertDescription>
        </Alert>
      </div>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle>Kiểm tra tuân thủ</CardTitle>
          <CardDescription>Trạng thái tuân thủ hiện tại theo các hạng mục bảo mật</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {check.status === "passed" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : check.status === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <div className="font-medium">{check.name}</div>
                    <div className="text-sm text-muted-foreground">{check.description}</div>
                  </div>
                </div>
                <Badge
                  variant={check.status === "passed" ? "secondary" : "destructive"}
                  className={
                    check.status === "passed"
                      ? "bg-green-100 text-green-800"
                      : check.status === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                  }
                >
                  {check.status === "passed" ? "Đạt" : check.status === "warning" ? "Cảnh báo" : "Không đạt"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Events Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sự kiện bảo mật gần đây
          </CardTitle>
          <CardDescription>Hoạt động và sự kiện liên quan đến bảo mật mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Hành động</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {event.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{event.user}</TableCell>
                  <TableCell>{event.action}</TableCell>
                  <TableCell className="text-muted-foreground">{event.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === "success"
                          ? "secondary"
                          : event.status === "warning"
                            ? "destructive"
                            : "outline"
                      }
                      className={
                        event.status === "success"
                          ? "bg-green-100 text-green-800"
                          : event.status === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
