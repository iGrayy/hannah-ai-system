"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Database, Shield, Bot } from "lucide-react"

export function AdminSystemConfig() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cấu hình hệ thống</h1>
          <p className="text-muted-foreground">Quản trị cài đặt và cấu hình hệ thống</p>
        </div>
        <Button>Lưu thay đổi</Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="ai">Phiên bản</TabsTrigger>
          <TabsTrigger value="kb-structure">Cấu trúc Kiến thức</TabsTrigger>
          <TabsTrigger value="database">Cơ sở dữ liệu</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cài đặt chung
              </CardTitle>
              <CardDescription>Cấu hình cơ bản của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">Tên hệ thống</Label>
                  <Input id="system-name" defaultValue="Hannah AI Assistant" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-version">Phiên bản</Label>
                  <Input id="system-version" defaultValue="1.0.0" disabled />
                </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="system-description">Mô tả hệ thống</Label>
                <Textarea
                  id="system-description"
                  defaultValue="AI Learning Assistant for Software Engineering Education"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance-mode">Chế độ bảo trì</Label>
                  <p className="text-sm text-muted-foreground">Bật chế độ bảo trì khi cập nhật hệ thống</p>
                </div>
                <Switch id="maintenance-mode" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Dữ liệu huấn luyện & tham số mô hình
              </CardTitle>
              <CardDescription>Quản lý dữ liệu huấn luyện và tham số mô hình</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-model">Chọn mô hình</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude">Claude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Nhiệt (Temperature)</Label>
                  <Input id="temperature" type="number" defaultValue="0.7" min="0" max="1" step="0.1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Số token tối đa</Label>
                <Input id="max-tokens" type="number" defaultValue="2048" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  defaultValue="You are Hannah, an AI assistant specialized in Software Engineering education..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Tải dữ liệu huấn luyện (CSV/JSON)</Label>
                <Input type="file" accept=".csv,.json" />
                <p className="text-xs text-muted-foreground">Tải dữ liệu huấn luyện để làm giàu mô hình (mô phỏng)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kb-structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Cấu trúc Knowledge Base
              </CardTitle>
              <CardDescription>Quản lý danh mục, chủ đề và phân cấp tri thức</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tạo danh mục</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Tên danh mục" />
                    <Button>Thêm</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Chủ đề</Label>
                  <Input placeholder="VD: Cấu trúc dữ liệu, Giải thuật..." />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Lưu ý: Đây là UI mô phỏng để quản lý cấu trúc KB.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Cấu hình cơ sở dữ liệu
              </CardTitle>
              <CardDescription>Cài đặt kết nối và hiệu năng cơ sở dữ liệu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label>Trạng thái kết nối</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Đã kết nối
                    </Badge>
                    <span className="text-sm text-muted-foreground">PostgreSQL 14.2</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Kích thước pool</Label>
                  <Input type="number" defaultValue="20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Lịch sao lưu</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hàng giờ</SelectItem>
                    <SelectItem value="daily">Hàng ngày</SelectItem>
                    <SelectItem value="weekly">Hàng tuần</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Cài đặt bảo mật
              </CardTitle>
              <CardDescription>Cấu hình bảo mật và tuân thủ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Xác thực hai lớp</Label>
                    <p className="text-sm text-muted-foreground">Yêu cầu 2FA cho tất cả tài khoản admin</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Thời gian hết hạn phiên</Label>
                    <p className="text-sm text-muted-foreground">Tự động đăng xuất khi không hoạt động</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 phút</SelectItem>
                      <SelectItem value="30">30 phút</SelectItem>
                      <SelectItem value="60">1 giờ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Ghi nhật ký kiểm toán</Label>
                    <p className="text-sm text-muted-foreground">Ghi lại mọi hành động của admin</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
