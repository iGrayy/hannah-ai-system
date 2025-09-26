"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Database, 
  Filter, 
  Shuffle, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  BarChart3,
  FileText,
  Settings,
  Play,
  Pause,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Target
} from "lucide-react"

interface TrainingDataPipelineProps {
  onClose: () => void
}

interface DataPipeline {
  id: string
  name: string
  status: "idle" | "running" | "completed" | "error"
  progress: number
  inputDatasets: string[]
  outputDataset: string
  steps: PipelineStep[]
  createdAt: string
  lastRun: string
}

interface PipelineStep {
  id: string
  name: string
  type: "preprocessing" | "augmentation" | "validation" | "quality_check"
  status: "pending" | "running" | "completed" | "error"
  config: Record<string, any>
  metrics?: Record<string, number>
}

interface DataQualityMetrics {
  totalSamples: number
  validSamples: number
  duplicates: number
  missingData: number
  qualityScore: number
  biasScore: number
  diversityScore: number
}

const mockPipelines: DataPipeline[] = [
  {
    id: "1",
    name: "CS Q&A Data Processing",
    status: "completed",
    progress: 100,
    inputDatasets: ["cs-qa-raw", "student-questions"],
    outputDataset: "cs-qa-processed",
    steps: [
      { id: "1", name: "Text Cleaning", type: "preprocessing", status: "completed", config: {} },
      { id: "2", name: "Deduplication", type: "preprocessing", status: "completed", config: {} },
      { id: "3", name: "Quality Validation", type: "validation", status: "completed", config: {} },
      { id: "4", name: "Data Augmentation", type: "augmentation", status: "completed", config: {} }
    ],
    createdAt: "2024-01-15 10:30",
    lastRun: "2024-01-15 14:45"
  },
  {
    id: "2", 
    name: "Conversation Data Pipeline",
    status: "running",
    progress: 67,
    inputDatasets: ["conversations-raw"],
    outputDataset: "conversations-processed",
    steps: [
      { id: "1", name: "Format Standardization", type: "preprocessing", status: "completed", config: {} },
      { id: "2", name: "Context Validation", type: "validation", status: "running", config: {} },
      { id: "3", name: "Response Quality Check", type: "quality_check", status: "pending", config: {} }
    ],
    createdAt: "2024-01-14 09:15",
    lastRun: "2024-01-15 16:20"
  }
]

const mockQualityMetrics: DataQualityMetrics = {
  totalSamples: 15420,
  validSamples: 14890,
  duplicates: 230,
  missingData: 300,
  qualityScore: 92.5,
  biasScore: 85.2,
  diversityScore: 88.7
}

export function TrainingDataPipeline({ onClose }: TrainingDataPipelineProps) {
  const [pipelines, setPipelines] = useState(mockPipelines)
  const [selectedPipeline, setSelectedPipeline] = useState<DataPipeline | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [qualityMetrics] = useState(mockQualityMetrics)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">Đang chạy</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Lỗi</Badge>
      case "idle":
        return <Badge variant="outline">Chờ</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case "preprocessing":
        return <Filter className="h-4 w-4" />
      case "augmentation":
        return <Shuffle className="h-4 w-4" />
      case "validation":
        return <CheckCircle className="h-4 w-4" />
      case "quality_check":
        return <Target className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-600" />
                Quản lý Pipeline Dữ liệu Huấn luyện
              </CardTitle>
              <CardDescription>Xử lý, kiểm tra chất lượng và chuẩn bị dữ liệu cho huấn luyện AI</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Tạo Pipeline
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[75vh]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
              <TabsTrigger value="quality">Chất lượng dữ liệu</TabsTrigger>
              <TabsTrigger value="monitoring">Giám sát</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Data Quality Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Tổng mẫu</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{formatNumber(qualityMetrics.totalSamples)}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Mẫu hợp lệ</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{formatNumber(qualityMetrics.validSamples)}</p>
                    <p className="text-xs text-muted-foreground">
                      {((qualityMetrics.validSamples / qualityMetrics.totalSamples) * 100).toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Điểm chất lượng</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{qualityMetrics.qualityScore}%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Đa dạng</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{qualityMetrics.diversityScore}%</p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Pipelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pipelines đang hoạt động</CardTitle>
                  <CardDescription>Trạng thái các pipeline xử lý dữ liệu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pipelines.filter(p => p.status === "running").map((pipeline) => (
                      <div key={pipeline.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                          <div>
                            <h4 className="font-medium">{pipeline.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {pipeline.steps.filter(s => s.status === "completed").length}/{pipeline.steps.length} bước hoàn thành
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32">
                            <Progress value={pipeline.progress} />
                          </div>
                          <span className="text-sm font-medium">{pipeline.progress}%</span>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {pipelines.filter(p => p.status === "running").length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Không có pipeline nào đang chạy
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Pipeline "CS Q&A Data Processing" hoàn thành</span>
                      <span className="text-muted-foreground ml-auto">2 giờ trước</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Play className="h-4 w-4 text-blue-500" />
                      <span>Bắt đầu pipeline "Conversation Data Pipeline"</span>
                      <span className="text-muted-foreground ml-auto">4 giờ trước</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span>Phát hiện 230 mẫu trùng lặp trong dataset</span>
                      <span className="text-muted-foreground ml-auto">6 giờ trước</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pipelines" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Danh sách Pipelines</CardTitle>
                  <CardDescription>Quản lý và theo dõi các pipeline xử lý dữ liệu</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên Pipeline</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Tiến độ</TableHead>
                        <TableHead>Input Datasets</TableHead>
                        <TableHead>Lần chạy cuối</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pipelines.map((pipeline) => (
                        <TableRow key={pipeline.id}>
                          <TableCell className="font-medium">{pipeline.name}</TableCell>
                          <TableCell>{getStatusBadge(pipeline.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={pipeline.progress} className="w-16" />
                              <span className="text-sm">{pipeline.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {pipeline.inputDatasets.map((dataset, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {dataset}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {pipeline.lastRun}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              {pipeline.status === "idle" && (
                                <Button size="sm" variant="outline">
                                  <Play className="h-3 w-3" />
                                </Button>
                              )}
                              {pipeline.status === "running" && (
                                <Button size="sm" variant="outline">
                                  <Pause className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quality" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quality Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Chỉ số chất lượng dữ liệu</CardTitle>
                    <CardDescription>Đánh giá tổng thể chất lượng dữ liệu huấn luyện</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Điểm chất lượng tổng thể</span>
                        <span className="text-lg font-bold text-green-600">{qualityMetrics.qualityScore}%</span>
                      </div>
                      <Progress value={qualityMetrics.qualityScore} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Điểm bias</span>
                        <span className="text-lg font-bold text-orange-600">{qualityMetrics.biasScore}%</span>
                      </div>
                      <Progress value={qualityMetrics.biasScore} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Điểm đa dạng</span>
                        <span className="text-lg font-bold text-blue-600">{qualityMetrics.diversityScore}%</span>
                      </div>
                      <Progress value={qualityMetrics.diversityScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Data Issues */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vấn đề dữ liệu</CardTitle>
                    <CardDescription>Các vấn đề cần được xử lý</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Dữ liệu trùng lặp</span>
                      </div>
                      <Badge variant="outline">{formatNumber(qualityMetrics.duplicates)} mẫu</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Dữ liệu thiếu</span>
                      </div>
                      <Badge variant="outline">{formatNumber(qualityMetrics.missingData)} mẫu</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Dữ liệu hợp lệ</span>
                      </div>
                      <Badge variant="outline">{formatNumber(qualityMetrics.validSamples)} mẫu</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Quality Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hành động cải thiện chất lượng</CardTitle>
                  <CardDescription>Các công cụ để cải thiện chất lượng dữ liệu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <RefreshCw className="h-6 w-6" />
                      <span className="font-medium">Loại bỏ trùng lặp</span>
                      <span className="text-xs text-muted-foreground">Tự động phát hiện và xóa</span>
                    </Button>

                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Target className="h-6 w-6" />
                      <span className="font-medium">Kiểm tra bias</span>
                      <span className="text-xs text-muted-foreground">Phân tích độ thiên lệch</span>
                    </Button>

                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Zap className="h-6 w-6" />
                      <span className="font-medium">Tăng cường dữ liệu</span>
                      <span className="text-xs text-muted-foreground">Sinh dữ liệu mới</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Giám sát Pipeline</CardTitle>
                  <CardDescription>Theo dõi hiệu năng và trạng thái pipeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pipelines.map((pipeline) => (
                      <Card key={pipeline.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{pipeline.name}</h4>
                          {getStatusBadge(pipeline.status)}
                        </div>

                        <div className="space-y-2">
                          {pipeline.steps.map((step) => (
                            <div key={step.id} className="flex items-center gap-3 p-2 rounded border">
                              {getStepIcon(step.type)}
                              <span className="text-sm flex-1">{step.name}</span>
                              {getStatusBadge(step.status)}
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Tiến độ: {pipeline.progress}%</span>
                            <span>Cập nhật: {pipeline.lastRun}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
