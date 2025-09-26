"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap,
  Brain,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  RefreshCw,
  GitCompare,
  Activity,
  Gauge
} from "lucide-react"

interface ModelPerformanceAnalyticsProps {
  onClose: () => void
}

interface ModelMetrics {
  id: string
  name: string
  version: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  latency: number
  throughput: number
  memoryUsage: number
  status: "active" | "testing" | "deprecated"
  deployedAt: string
  lastUpdated: string
}

interface PerformanceData {
  timestamp: string
  accuracy: number
  latency: number
  throughput: number
  errorRate: number
}

interface ABTestResult {
  id: string
  name: string
  modelA: string
  modelB: string
  status: "running" | "completed" | "paused"
  progress: number
  winnerModel?: string
  confidenceLevel: number
  sampleSize: number
  startDate: string
}

const mockModels: ModelMetrics[] = [
  {
    id: "1",
    name: "Hannah CS Assistant",
    version: "v2.1",
    accuracy: 0.924,
    precision: 0.918,
    recall: 0.931,
    f1Score: 0.924,
    latency: 145,
    throughput: 850,
    memoryUsage: 2.4,
    status: "active",
    deployedAt: "2024-01-15",
    lastUpdated: "2024-01-15 16:30"
  },
  {
    id: "2",
    name: "Hannah CS Assistant",
    version: "v2.0",
    accuracy: 0.912,
    precision: 0.905,
    recall: 0.919,
    f1Score: 0.912,
    latency: 160,
    throughput: 780,
    memoryUsage: 2.6,
    status: "testing",
    deployedAt: "2024-01-10",
    lastUpdated: "2024-01-14 14:20"
  }
]

const mockPerformanceData: PerformanceData[] = [
  { timestamp: "00:00", accuracy: 0.92, latency: 145, throughput: 850, errorRate: 0.02 },
  { timestamp: "04:00", accuracy: 0.924, latency: 142, throughput: 865, errorRate: 0.018 },
  { timestamp: "08:00", accuracy: 0.921, latency: 148, throughput: 840, errorRate: 0.022 },
  { timestamp: "12:00", accuracy: 0.926, latency: 140, throughput: 880, errorRate: 0.015 },
  { timestamp: "16:00", accuracy: 0.923, latency: 144, throughput: 855, errorRate: 0.019 },
  { timestamp: "20:00", accuracy: 0.925, latency: 143, throughput: 870, errorRate: 0.017 }
]

const mockABTests: ABTestResult[] = [
  {
    id: "1",
    name: "v2.1 vs v2.0 Performance Test",
    modelA: "v2.1",
    modelB: "v2.0", 
    status: "running",
    progress: 75,
    confidenceLevel: 0.89,
    sampleSize: 15420,
    startDate: "2024-01-14"
  },
  {
    id: "2",
    name: "Latency Optimization Test",
    modelA: "v2.1-optimized",
    modelB: "v2.1",
    status: "completed",
    progress: 100,
    winnerModel: "v2.1-optimized",
    confidenceLevel: 0.95,
    sampleSize: 8750,
    startDate: "2024-01-12"
  }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function ModelPerformanceAnalytics({ onClose }: ModelPerformanceAnalyticsProps) {
  const [models] = useState(mockModels)
  const [performanceData] = useState(mockPerformanceData)
  const [abTests] = useState(mockABTests)
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [timeRange, setTimeRange] = useState("24h")
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>
      case "testing":
        return <Badge className="bg-blue-100 text-blue-800">Đang thử nghiệm</Badge>
      case "deprecated":
        return <Badge className="bg-gray-100 text-gray-800">Ngừng sử dụng</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getABTestStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">Đang chạy</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Tạm dừng</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatLatency = (ms: number): string => {
    return `${ms}ms`
  }

  const formatThroughput = (rps: number): string => {
    return `${rps} req/s`
  }

  const formatMemory = (gb: number): string => {
    return `${gb}GB`
  }

  const pieData = [
    { name: 'Chính xác', value: selectedModel.accuracy * 100 },
    { name: 'Sai', value: (1 - selectedModel.accuracy) * 100 }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Phân tích Hiệu năng Mô hình
              </CardTitle>
              <CardDescription>Theo dõi và phân tích hiệu năng mô hình AI trong thời gian thực</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedModel.id} onValueChange={(value) => setSelectedModel(models.find(m => m.id === value) || models[0])}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} {model.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[75vh]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="performance">Hiệu năng</TabsTrigger>
              <TabsTrigger value="comparison">So sánh</TabsTrigger>
              <TabsTrigger value="abtesting">A/B Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Độ chính xác</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{(selectedModel.accuracy * 100).toFixed(1)}%</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +1.2% so với tuần trước
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Độ trễ</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{formatLatency(selectedModel.latency)}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      -5ms so với tuần trước
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Throughput</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{formatThroughput(selectedModel.throughput)}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +50 req/s so với tuần trước
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Bộ nhớ</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{formatMemory(selectedModel.memoryUsage)}</p>
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +0.2GB so với tuần trước
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Model Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Chi tiết mô hình</CardTitle>
                    <CardDescription>Thông tin chi tiết về mô hình đang chọn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Tên:</span>
                        <p className="text-muted-foreground">{selectedModel.name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Phiên bản:</span>
                        <p className="text-muted-foreground">{selectedModel.version}</p>
                      </div>
                      <div>
                        <span className="font-medium">Trạng thái:</span>
                        <div className="mt-1">{getStatusBadge(selectedModel.status)}</div>
                      </div>
                      <div>
                        <span className="font-medium">Triển khai:</span>
                        <p className="text-muted-foreground">{selectedModel.deployedAt}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Precision</span>
                          <span>{(selectedModel.precision * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={selectedModel.precision * 100} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Recall</span>
                          <span>{(selectedModel.recall * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={selectedModel.recall * 100} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>F1 Score</span>
                          <span>{(selectedModel.f1Score * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={selectedModel.f1Score * 100} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Phân bố độ chính xác</CardTitle>
                    <CardDescription>Tỷ lệ dự đoán chính xác vs sai</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-sm">Chính xác</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm">Sai</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
                  <CardDescription>Các sự kiện và cập nhật mô hình</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Mô hình v2.1 đã được triển khai thành công</span>
                      <span className="text-muted-foreground ml-auto">2 giờ trước</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <span>Bắt đầu A/B test giữa v2.1 và v2.0</span>
                      <span className="text-muted-foreground ml-auto">4 giờ trước</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span>Phát hiện tăng độ trễ trong 30 phút</span>
                      <span className="text-muted-foreground ml-auto">6 giờ trước</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              {/* Time Range Selector */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Hiệu năng theo thời gian</h3>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 giờ</SelectItem>
                    <SelectItem value="24h">24 giờ</SelectItem>
                    <SelectItem value="7d">7 ngày</SelectItem>
                    <SelectItem value="30d">30 ngày</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Độ chính xác theo thời gian</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} />
                        <Tooltip />
                        <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Độ trễ và Throughput</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="latency" stroke="#ef4444" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="throughput" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Error Rate */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tỷ lệ lỗi</CardTitle>
                  <CardDescription>Theo dõi tỷ lệ lỗi và sự cố</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
                      <Bar dataKey="errorRate" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">So sánh các phiên bản mô hình</CardTitle>
                  <CardDescription>Đánh giá hiệu năng giữa các phiên bản khác nhau</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Phiên bản</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Độ chính xác</TableHead>
                        <TableHead>Độ trễ</TableHead>
                        <TableHead>Throughput</TableHead>
                        <TableHead>Bộ nhớ</TableHead>
                        <TableHead>F1 Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {models.map((model) => (
                        <TableRow key={model.id}>
                          <TableCell className="font-medium">{model.version}</TableCell>
                          <TableCell>{getStatusBadge(model.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{(model.accuracy * 100).toFixed(1)}%</span>
                              {model.accuracy > 0.92 && <TrendingUp className="h-3 w-3 text-green-500" />}
                            </div>
                          </TableCell>
                          <TableCell>{formatLatency(model.latency)}</TableCell>
                          <TableCell>{formatThroughput(model.throughput)}</TableCell>
                          <TableCell>{formatMemory(model.memoryUsage)}</TableCell>
                          <TableCell>{(model.f1Score * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Biểu đồ so sánh</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={models.map(m => ({
                      version: m.version,
                      accuracy: m.accuracy * 100,
                      precision: m.precision * 100,
                      recall: m.recall * 100,
                      f1Score: m.f1Score * 100
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="version" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="accuracy" fill="#10b981" name="Accuracy" />
                      <Bar dataKey="precision" fill="#3b82f6" name="Precision" />
                      <Bar dataKey="recall" fill="#f59e0b" name="Recall" />
                      <Bar dataKey="f1Score" fill="#ef4444" name="F1 Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="abtesting" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">A/B Testing</CardTitle>
                  <CardDescription>Thử nghiệm và so sánh hiệu năng giữa các mô hình</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên thử nghiệm</TableHead>
                        <TableHead>Mô hình A</TableHead>
                        <TableHead>Mô hình B</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Tiến độ</TableHead>
                        <TableHead>Độ tin cậy</TableHead>
                        <TableHead>Kết quả</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {abTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="font-medium">{test.name}</TableCell>
                          <TableCell>{test.modelA}</TableCell>
                          <TableCell>{test.modelB}</TableCell>
                          <TableCell>{getABTestStatusBadge(test.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={test.progress} className="w-16" />
                              <span className="text-sm">{test.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{(test.confidenceLevel * 100).toFixed(0)}%</TableCell>
                          <TableCell>
                            {test.winnerModel ? (
                              <Badge className="bg-green-100 text-green-800">{test.winnerModel}</Badge>
                            ) : (
                              <span className="text-muted-foreground">Đang chạy</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* A/B Test Results */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Kết quả thử nghiệm hiện tại</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {abTests.filter(t => t.status === "running").length > 0 ? (
                      <div className="space-y-4">
                        {abTests.filter(t => t.status === "running").map((test) => (
                          <div key={test.id} className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">{test.name}</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">{test.modelA}</span>
                                <div className="mt-1">
                                  <Progress value={45} className="h-2" />
                                  <span className="text-xs text-muted-foreground">45% traffic</span>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">{test.modelB}</span>
                                <div className="mt-1">
                                  <Progress value={55} className="h-2" />
                                  <span className="text-xs text-muted-foreground">55% traffic</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-muted-foreground">
                              Mẫu: {test.sampleSize.toLocaleString()} • Độ tin cậy: {(test.confidenceLevel * 100).toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Không có thử nghiệm nào đang chạy
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lịch sử thử nghiệm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {abTests.filter(t => t.status === "completed").map((test) => (
                        <div key={test.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{test.name}</span>
                            <Badge className="bg-green-100 text-green-800">{test.winnerModel}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {test.modelA} vs {test.modelB} • {(test.confidenceLevel * 100).toFixed(0)}% tin cậy
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
