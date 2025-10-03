"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Database, MessageSquare, Settings, CheckCircle, AlertCircle, Search, Cpu } from "lucide-react"

const integrations = [
  {
    id: "nvidia-chatrtx",
    name: "NVIDIA ChatRTX",
    description: "AI Engine - Open source base model for Hannah AI",
    status: "connected",
    icon: Zap,
    category: "ai",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Primary database for structured data",
    status: "connected",
    icon: Database,
    category: "database",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description: "Document database for conversation logs",
    status: "connected",
    icon: Database,
    category: "database",
  },
  {
    id: "elasticsearch",
    name: "Elasticsearch",
    description: "Search engine for knowledge base retrieval",
    status: "connected",
    icon: Search,
    category: "search",
  },
  {
    id: "redis",
    name: "Redis",
    description: "In-memory caching for improved performance",
    status: "connected",
    icon: Cpu,
    category: "cache",
  },
  {
    id: "websockets",
    name: "WebSockets",
    description: "Real-time communication for chat interface",
    status: "connected",
    icon: MessageSquare,
    category: "communication",
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
          <TabsTrigger value="ai">AI Engine</TabsTrigger>
          <TabsTrigger value="database">Cơ sở dữ liệu</TabsTrigger>
          <TabsTrigger value="search">Tìm kiếm</TabsTrigger>
          <TabsTrigger value="communication">Giao tiếp</TabsTrigger>
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
                Cấu hình NVIDIA ChatRTX
              </CardTitle>
              <CardDescription>Cấu hình AI Engine cho Hannah Assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chatrtx-model">Model Path</Label>
                <Input
                  id="chatrtx-model"
                  placeholder="/path/to/chatrtx/model"
                  defaultValue="/opt/nvidia/chatrtx/models/llama2-7b"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpu-memory">GPU Memory (GB)</Label>
                <Input id="gpu-memory" type="number" defaultValue="8" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Số token tối đa</Label>
                <Input id="max-tokens" type="number" defaultValue="4096" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input id="temperature" type="number" step="0.1" defaultValue="0.7" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Trạng thái AI Engine</Label>
                  <p className="text-sm text-muted-foreground">NVIDIA ChatRTX đang hoạt động</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Đã kết nối
                </Badge>
              </div>
              <Button>Lưu cấu hình</Button>
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Cấu hình PostgreSQL
                </CardTitle>
                <CardDescription>Cơ sở dữ liệu chính cho dữ liệu có cấu trúc</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pg-host">Database Host</Label>
                  <Input id="pg-host" defaultValue="localhost" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pg-port">Port</Label>
                  <Input id="pg-port" type="number" defaultValue="5432" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pg-database">Database Name</Label>
                  <Input id="pg-database" defaultValue="hannah_db" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pg-username">Username</Label>
                  <Input id="pg-username" defaultValue="hannah_user" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pg-password">Password</Label>
                  <Input id="pg-password" type="password" defaultValue="***********" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Trạng thái PostgreSQL</Label>
                    <p className="text-sm text-muted-foreground">Kết nối hoạt động</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đã kết nối
                  </Badge>
                </div>
                <Button>Kiểm tra kết nối</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Cấu hình MongoDB
                </CardTitle>
                <CardDescription>Cơ sở dữ liệu cho conversation logs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mongo-uri">Connection URI</Label>
                  <Input id="mongo-uri" defaultValue="mongodb://localhost:27017/hannah_conversations" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mongo-database">Database Name</Label>
                  <Input id="mongo-database" defaultValue="hannah_conversations" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mongo-collection">Default Collection</Label>
                  <Input id="mongo-collection" defaultValue="chat_logs" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mongo-max-pool">Max Pool Size</Label>
                  <Input id="mongo-max-pool" type="number" defaultValue="10" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Trạng thái MongoDB</Label>
                    <p className="text-sm text-muted-foreground">Kết nối hoạt động</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đã kết nối
                  </Badge>
                </div>
                <Button>Kiểm tra kết nối</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Cấu hình Elasticsearch
                </CardTitle>
                <CardDescription>Search engine cho knowledge base retrieval</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="es-host">Elasticsearch Host</Label>
                  <Input id="es-host" defaultValue="localhost:9200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="es-index">Default Index</Label>
                  <Input id="es-index" defaultValue="hannah_knowledge_base" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="es-username">Username</Label>
                  <Input id="es-username" defaultValue="elastic" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="es-password">Password</Label>
                  <Input id="es-password" type="password" defaultValue="***********" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Trạng thái Elasticsearch</Label>
                    <p className="text-sm text-muted-foreground">Cluster đang hoạt động</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đã kết nối
                  </Badge>
                </div>
                <Button>Kiểm tra cluster</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Cấu hình Redis Cache
                </CardTitle>
                <CardDescription>In-memory caching cho hiệu suất tối ưu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="redis-host">Redis Host</Label>
                  <Input id="redis-host" defaultValue="localhost" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="redis-port">Port</Label>
                  <Input id="redis-port" type="number" defaultValue="6379" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="redis-db">Database Number</Label>
                  <Input id="redis-db" type="number" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="redis-ttl">Default TTL (seconds)</Label>
                  <Input id="redis-ttl" type="number" defaultValue="3600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Trạng thái Redis</Label>
                    <p className="text-sm text-muted-foreground">Cache server hoạt động</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đã kết nối
                  </Badge>
                </div>
                <Button>Xóa cache</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Cấu hình WebSockets
              </CardTitle>
              <CardDescription>Giao tiếp real-time cho giao diện chat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ws-server-url">WebSocket Server URL</Label>
                <Input id="ws-server-url" defaultValue="ws://localhost:8000/ws" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ws-reconnect-interval">Reconnect Interval (ms)</Label>
                <Input id="ws-reconnect-interval" type="number" defaultValue="5000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ws-max-reconnect">Max Reconnect Attempts</Label>
                <Input id="ws-max-reconnect" type="number" defaultValue="10" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Trạng thái WebSocket</Label>
                  <p className="text-sm text-muted-foreground">Đã kết nối</p>
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
      </Tabs>
    </div>
  )
}
