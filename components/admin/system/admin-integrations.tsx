"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Database, Mail, MessageSquare, Cloud, Settings, CheckCircle, AlertCircle } from "lucide-react"

const integrations = [
  {
    id: "openai",
    name: "OpenAI GPT",
    description: "AI language model for generating responses",
    status: "connected",
    icon: Zap,
    category: "ai",
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Database and authentication service",
    status: "connected",
    icon: Database,
    category: "database",
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Email delivery service",
    status: "disconnected",
    icon: Mail,
    category: "communication",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team communication and notifications",
    status: "connected",
    icon: MessageSquare,
    category: "communication",
  },
  {
    id: "aws",
    name: "AWS S3",
    description: "Cloud storage for files and media",
    status: "disconnected",
    icon: Cloud,
    category: "storage",
  },
]

export function AdminIntegrations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kết nối tích hợp</h1>
        <p className="text-muted-foreground">Quản lý tích hợp bên thứ ba và kết nối API</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả tích hợp</TabsTrigger>
          <TabsTrigger value="ai">Phiên bản AI</TabsTrigger>
          <TabsTrigger value="database">Cơ sở dữ liệu</TabsTrigger>
          <TabsTrigger value="communication">Liên lạc</TabsTrigger>
          <TabsTrigger value="storage">Lưu trữ</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <integration.icon className="h-5 w-5" />
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                    </div>
                    <Badge
                      variant={integration.status === "connected" ? "secondary" : "outline"}
                      className={integration.status === "connected" ? "bg-green-100 text-green-800" : ""}
                    >
                      {integration.status === "connected" ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Đã kết nối
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Chưa kết nối
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Switch
                      checked={integration.status === "connected"}
                      disabled={integration.status === "disconnected"}
                    />
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Cấu hình
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Cấu hình OpenAI
              </CardTitle>
              <CardDescription>Cấu hình model AI và API key</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  defaultValue="sk-***************************"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model mặc định</Label>
                <Input id="model" defaultValue="gpt-4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Số token tối đa</Label>
                <Input id="max-tokens" type="number" defaultValue="2048" />
              </div>
              <Button>Lưu cấu hình</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Cấu hình Supabase
              </CardTitle>
              <CardDescription>Cài đặt và kết nối cơ sở dữ liệu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supabase-url">Project URL</Label>
                <Input id="supabase-url" defaultValue="https://your-project.supabase.co" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supabase-key">Anon Key</Label>
                <Input id="supabase-key" type="password" defaultValue="eyJ***************************" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Trạng thái kết nối</Label>
                  <p className="text-sm text-muted-foreground">Kết nối cơ sở dữ liệu hoạt động</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Đã kết nối
                </Badge>
              </div>
              <Button>Kiểm tra kết nối</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Gửi Email SendGrid
                </CardTitle>
              <CardDescription>Cấu hình gửi email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sendgrid-key">API Key</Label>
                  <Input id="sendgrid-key" type="password" placeholder="SG...." />
                </div>
                <div className="space-y-2">
                <Label htmlFor="from-email">Email gửi đi</Label>
                  <Input id="from-email" type="email" placeholder="noreply@hannah.edu" />
                </div>
                <Button>Kết nối SendGrid</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Tích hợp Slack
                </CardTitle>
              <CardDescription>Thông báo và cảnh báo cho nhóm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="slack-webhook">Webhook URL</Label>
                  <Input id="slack-webhook" defaultValue="https://hooks.slack.com/services/..." />
                </div>
                <div className="space-y-2">
                <Label htmlFor="slack-channel">Kênh mặc định</Label>
                  <Input id="slack-channel" defaultValue="#hannah-alerts" />
                </div>
                <Button>Cập nhật cài đặt</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Lưu trữ AWS S3
              </CardTitle>
              <CardDescription>Lưu trữ đám mây cho tệp và media</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aws-access-key">Access Key ID</Label>
                <Input id="aws-access-key" placeholder="AKIA..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aws-secret-key">Secret Access Key</Label>
                <Input id="aws-secret-key" type="password" placeholder="..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aws-bucket">Tên bucket</Label>
                <Input id="aws-bucket" placeholder="hannah-storage" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aws-region">Vùng</Label>
                <Input id="aws-region" defaultValue="us-east-1" />
              </div>
              <Button>Kết nối AWS S3</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
