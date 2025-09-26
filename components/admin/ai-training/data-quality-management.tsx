"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from "recharts"
import { formatNumber, getQualityColor } from "./utils"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Zap,
  Target,
  BarChart3,
  FileText,
  Settings,
  Brain,
  Users,
  Play,
  Pause
} from "lucide-react"

interface DataQualityManagementProps {
  onClose: () => void
}

interface QualityMetrics {
  overall: number
  completeness: number
  accuracy: number
  consistency: number
  validity: number
  uniqueness: number
  bias: number
  diversity: number
}

interface DataIssue {
  id: string
  type: "missing" | "duplicate" | "invalid" | "bias" | "outlier"
  severity: "high" | "medium" | "low"
  description: string
  affectedSamples: number
  recommendation: string
  autoFixable: boolean
}

interface QualityReport {
  id: string
  datasetName: string
  scanDate: string
  status: "completed" | "running" | "failed"
  metrics: QualityMetrics
  issues: DataIssue[]
  totalSamples: number
}

const mockQualityMetrics: QualityMetrics = {
  overall: 87.5,
  completeness: 92.3,
  accuracy: 89.1,
  consistency: 85.7,
  validity: 91.2,
  uniqueness: 88.9,
  bias: 82.4,
  diversity: 86.8
}

const mockIssues: DataIssue[] = [
  {
    id: "1",
    type: "duplicate",
    severity: "high",
    description: "Phát hiện 1,245 mẫu dữ liệu trùng lặp",
    affectedSamples: 1245,
    recommendation: "Loại bỏ các mẫu trùng lặp để tránh overfitting",
    autoFixable: true
  },
  {
    id: "2",
    type: "missing",
    severity: "medium",
    description: "Thiếu dữ liệu trong trường 'context' của 320 mẫu",
    affectedSamples: 320,
    recommendation: "Bổ sung context hoặc loại bỏ các mẫu không đầy đủ",
    autoFixable: false
  },
  {
    id: "3",
    type: "bias",
    severity: "medium",
    description: "Thiên lệch về chủ đề 'programming' (65% tổng dataset)",
    affectedSamples: 8950,
    recommendation: "Cân bằng dataset bằng cách thêm dữ liệu từ các chủ đề khác",
    autoFixable: false
  },
  {
    id: "4",
    type: "invalid",
    severity: "low",
    description: "Định dạng không hợp lệ trong 89 mẫu",
    affectedSamples: 89,
    recommendation: "Chuẩn hóa định dạng dữ liệu",
    autoFixable: true
  }
]

const mockReports: QualityReport[] = [
  {
    id: "1",
    datasetName: "CS Q&A Dataset v2.1",
    scanDate: "2024-01-15 16:30",
    status: "completed",
    metrics: mockQualityMetrics,
    issues: mockIssues,
    totalSamples: 15420
  },
  {
    id: "2",
    datasetName: "Student Conversations",
    scanDate: "2024-01-14 14:20",
    status: "completed",
    metrics: {
      overall: 91.2,
      completeness: 95.1,
      accuracy: 92.3,
      consistency: 89.7,
      validity: 93.8,
      uniqueness: 91.5,
      bias: 87.2,
      diversity: 90.1
    },
    issues: [],
    totalSamples: 8750
  }
]

const radarData = [
  { metric: 'Completeness', value: mockQualityMetrics.completeness },
  { metric: 'Accuracy', value: mockQualityMetrics.accuracy },
  { metric: 'Consistency', value: mockQualityMetrics.consistency },
  { metric: 'Validity', value: mockQualityMetrics.validity },
  { metric: 'Uniqueness', value: mockQualityMetrics.uniqueness },
  { metric: 'Diversity', value: mockQualityMetrics.diversity }
]

const trendData = [
  { date: "2024-01-01", quality: 82 },
  { date: "2024-01-08", quality: 85 },
  { date: "2024-01-15", quality: 88 },
  { date: "2024-01-22", quality: 91 },
  { date: "2024-01-29", quality: 89 },
  { date: "2024-02-05", quality: 93 }
]

const issueDistribution = [
  { name: "Trùng lặp", value: 35 },
  { name: "Thiếu dữ liệu", value: 25 },
  { name: "Format sai", value: 20 },
  { name: "Encoding", value: 15 },
  { name: "Khác", value: 5 }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

// ChatRTX Training Demo Component
export function ChatRTXTrainingDemo() {
  const [demoStep, setDemoStep] = useState(1)
  const [isRunning, setIsRunning] = useState(false)

  const demoSteps = [
    {
      title: "Khởi tạo ChatRTX Environment",
      description: "Thiết lập môi trường ChatRTX với NVIDIA GPU",
      status: "completed"
    },
    {
      title: "Load Base Model (Mistral-7B)",
      description: "Tải mô hình cơ sở Mistral-7B-Instruct",
      status: "completed"
    },
    {
      title: "Setup RAG Pipeline",
      description: "Cấu hình Retrieval-Augmented Generation",
      status: "running"
    },
    {
      title: "Fine-tuning với LoRA",
      description: "Tinh chỉnh mô hình với dữ liệu SE",
      status: "pending"
    },
    {
      title: "Testing & Validation",
      description: "Kiểm tra và xác thực mô hình",
      status: "pending"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">ChatRTX Training Demo</h2>
        <p className="text-muted-foreground">Mô phỏng quá trình huấn luyện Hannah AI với NVIDIA ChatRTX</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>NVIDIA RTX GPU</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>CUDA 12.1+</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>16GB+ VRAM</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>Python 3.10+</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                {step.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                {step.status === "running" && <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                {step.status === "pending" && <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />}
                <div>
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Training Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
            <div>[2024-01-15 16:30:15] INFO: Initializing ChatRTX environment...</div>
            <div>[2024-01-15 16:30:20] INFO: Loading Mistral-7B-Instruct model...</div>
            <div>[2024-01-15 16:30:45] INFO: Model loaded successfully (7.2GB VRAM)</div>
            <div>[2024-01-15 16:31:00] INFO: Setting up RAG pipeline...</div>
            <div>[2024-01-15 16:31:15] INFO: Indexing SE knowledge base...</div>
            <div>[2024-01-15 16:31:30] INFO: Vector embeddings created (25,420 documents)</div>
            <div>[2024-01-15 16:31:45] INFO: Starting LoRA fine-tuning...</div>
            <div>[2024-01-15 16:32:00] INFO: Epoch 1/5 - Loss: 0.245, Accuracy: 87.3%</div>
            <div>[2024-01-15 16:32:15] INFO: Epoch 2/5 - Loss: 0.198, Accuracy: 91.2%</div>
            <div className="text-yellow-400">[2024-01-15 16:32:30] WARN: GPU temperature: 78°C</div>
            <div>[2024-01-15 16:32:45] INFO: Epoch 3/5 - Loss: 0.156, Accuracy: 93.8%</div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause Demo
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Demo
            </>
          )}
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>
    </div>
  )
}

export function DataQualityManagement({ onClose }: DataQualityManagementProps) {
  const [reports] = useState(mockReports)
  const [selectedReport, setSelectedReport] = useState(reports[0])
  const [activeTab, setActiveTab] = useState("overview")
  const [scanInProgress, setScanInProgress] = useState(false)

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "duplicate":
        return <RefreshCw className="h-4 w-4 text-orange-500" />
      case "missing":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "invalid":
        return <Shield className="h-4 w-4 text-yellow-500" />
      case "bias":
        return <Users className="h-4 w-4 text-purple-500" />
      case "outlier":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Cao</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Trung bình</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Thấp</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getQualityColor = (score: number): string => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const startQualityScan = () => {
    setScanInProgress(true)
    // Simulate scan process
    setTimeout(() => {
      setScanInProgress(false)
    }, 3000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                Quản lý Chất lượng Dữ liệu
              </CardTitle>
              <CardDescription>Đánh giá, phân tích và cải thiện chất lượng dữ liệu huấn luyện</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedReport.id} onValueChange={(value) => setSelectedReport(reports.find(r => r.id === value) || reports[0])}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reports.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.datasetName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={startQualityScan} disabled={scanInProgress}>
                {scanInProgress ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Quét chất lượng
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[75vh]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="issues">Vấn đề</TabsTrigger>
              <TabsTrigger value="analysis">Phân tích</TabsTrigger>
              <TabsTrigger value="recommendations">Khuyến nghị</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Quality Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Điểm tổng thể</span>
                    </div>
                    <p className={`text-2xl font-bold mt-2 ${getQualityColor(selectedReport.metrics.overall)}`}>
                      {selectedReport.metrics.overall.toFixed(1)}%
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +2.3% so với lần quét trước
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Tính đầy đủ</span>
                    </div>
                    <p className={`text-2xl font-bold mt-2 ${getQualityColor(selectedReport.metrics.completeness)}`}>
                      {selectedReport.metrics.completeness.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Độ chính xác</span>
                    </div>
                    <p className={`text-2xl font-bold mt-2 ${getQualityColor(selectedReport.metrics.accuracy)}`}>
                      {selectedReport.metrics.accuracy.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Đa dạng</span>
                    </div>
                    <p className={`text-2xl font-bold mt-2 ${getQualityColor(selectedReport.metrics.diversity)}`}>
                      {selectedReport.metrics.diversity.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quality Radar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Biểu đồ chất lượng</CardTitle>
                    <CardDescription>Đánh giá đa chiều về chất lượng dữ liệu</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Quality Score"
                          dataKey="value"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin dataset</CardTitle>
                    <CardDescription>Chi tiết về dataset được phân tích</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Tên dataset:</span>
                        <p className="text-muted-foreground">{selectedReport.datasetName}</p>
                      </div>
                      <div>
                        <span className="font-medium">Tổng mẫu:</span>
                        <p className="text-muted-foreground">{formatNumber(selectedReport.totalSamples)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Ngày quét:</span>
                        <p className="text-muted-foreground">{selectedReport.scanDate}</p>
                      </div>
                      <div>
                        <span className="font-medium">Số vấn đề:</span>
                        <p className="text-muted-foreground">{selectedReport.issues.length}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tính nhất quán</span>
                          <span>{selectedReport.metrics.consistency.toFixed(1)}%</span>
                        </div>
                        <Progress value={selectedReport.metrics.consistency} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tính hợp lệ</span>
                          <span>{selectedReport.metrics.validity.toFixed(1)}%</span>
                        </div>
                        <Progress value={selectedReport.metrics.validity} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tính duy nhất</span>
                          <span>{selectedReport.metrics.uniqueness.toFixed(1)}%</span>
                        </div>
                        <Progress value={selectedReport.metrics.uniqueness} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hành động nhanh</CardTitle>
                  <CardDescription>Các công cụ cải thiện chất lượng dữ liệu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <RefreshCw className="h-6 w-6" />
                      <span className="font-medium">Loại bỏ trùng lặp</span>
                      <span className="text-xs text-muted-foreground">Tự động phát hiện và xóa</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Filter className="h-6 w-6" />
                      <span className="font-medium">Lọc dữ liệu</span>
                      <span className="text-xs text-muted-foreground">Loại bỏ mẫu không hợp lệ</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Zap className="h-6 w-6" />
                      <span className="font-medium">Chuẩn hóa</span>
                      <span className="text-xs text-muted-foreground">Định dạng thống nhất</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Download className="h-6 w-6" />
                      <span className="font-medium">Xuất báo cáo</span>
                      <span className="text-xs text-muted-foreground">Tải về chi tiết</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Issues Tab */}
            <TabsContent value="issues" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Vấn đề nghiêm trọng
                    </CardTitle>
                    <CardDescription>Các vấn đề cần xử lý ngay lập tức</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedReport.issues.filter(issue => issue.severity === "high").map((issue, index) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                        <h4 className="font-medium text-red-900">{issue.type}</h4>
                        <p className="text-sm text-red-700">{issue.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ảnh hưởng: {issue.affectedSamples} mẫu
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="h-5 w-5 text-yellow-500" />
                      Cảnh báo
                    </CardTitle>
                    <CardDescription>Các vấn đề cần theo dõi</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedReport.issues.filter(issue => issue.severity === "medium").map((issue, index) => (
                      <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2">
                        <h4 className="font-medium text-yellow-900">{issue.type}</h4>
                        <p className="text-sm text-yellow-700">{issue.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ảnh hưởng: {issue.affectedSamples} mẫu
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tất cả vấn đề</CardTitle>
                  <CardDescription>Danh sách chi tiết các vấn đề được phát hiện</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loại vấn đề</TableHead>
                        <TableHead>Mức độ</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Mẫu bị ảnh hưởng</TableHead>
                        <TableHead>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedReport.issues.map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{issue.type}</TableCell>
                          <TableCell>
                            <Badge variant={
                              issue.severity === "high" ? "destructive" :
                              issue.severity === "medium" ? "default" : "secondary"
                            }>
                              {issue.severity === "high" ? "Cao" :
                               issue.severity === "medium" ? "Trung bình" : "Thấp"}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{issue.description}</TableCell>
                          <TableCell>{issue.affectedSamples}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Sửa
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Phân tích xu hướng</CardTitle>
                    <CardDescription>Chất lượng dữ liệu theo thời gian</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="quality" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Phân bố vấn đề</CardTitle>
                    <CardDescription>Tỷ lệ các loại vấn đề</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={issueDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {issueDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thống kê chi tiết</CardTitle>
                  <CardDescription>Phân tích sâu về chất lượng dữ liệu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Phân bố độ dài</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Trung bình:</span>
                          <span>245 ký tự</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ngắn nhất:</span>
                          <span>12 ký tự</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dài nhất:</span>
                          <span>1,250 ký tự</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Ngôn ngữ</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Tiếng Việt:</span>
                          <span>78.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tiếng Anh:</span>
                          <span>21.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Khác:</span>
                          <span>0.3%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Chủ đề</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Lập trình:</span>
                          <span>45.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Thuật toán:</span>
                          <span>28.7%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Khác:</span>
                          <span>26.1%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Khuyến nghị ưu tiên cao
                    </CardTitle>
                    <CardDescription>Các hành động cần thực hiện ngay</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4 py-3">
                      <h4 className="font-medium text-green-900">Loại bỏ dữ liệu trùng lặp</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Phát hiện 1,247 mẫu trùng lặp (4.2% tổng dataset). Loại bỏ để cải thiện chất lượng training.
                      </p>
                      <Button size="sm" className="mt-2">
                        Thực hiện ngay
                      </Button>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4 py-3">
                      <h4 className="font-medium text-green-900">Chuẩn hóa định dạng</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Thống nhất định dạng cho 892 mẫu có format không nhất quán.
                      </p>
                      <Button size="sm" className="mt-2">
                        Chuẩn hóa
                      </Button>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4 py-3">
                      <h4 className="font-medium text-green-900">Bổ sung metadata</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Thêm thông tin metadata cho 2,156 mẫu thiếu thông tin ngữ cảnh.
                      </p>
                      <Button size="sm" className="mt-2">
                        Bổ sung
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      Cải thiện dài hạn
                    </CardTitle>
                    <CardDescription>Các hành động để nâng cao chất lượng</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-3">
                      <h4 className="font-medium text-blue-900">Tăng cường đa dạng</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Thu thập thêm dữ liệu cho các chủ đề ít được đại diện trong dataset.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4 py-3">
                      <h4 className="font-medium text-blue-900">Cải thiện chất lượng annotation</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Review và cải thiện chất lượng nhãn cho 567 mẫu có annotation không rõ ràng.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4 py-3">
                      <h4 className="font-medium text-blue-900">Thiết lập quy trình kiểm tra</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Xây dựng pipeline tự động kiểm tra chất lượng cho dữ liệu mới.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kế hoạch cải thiện</CardTitle>
                  <CardDescription>Lộ trình nâng cao chất lượng dataset</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">1</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Tuần 1-2: Làm sạch dữ liệu</h4>
                        <p className="text-sm text-muted-foreground">
                          Loại bỏ trùng lặp, chuẩn hóa format, xử lý missing values
                        </p>
                        <Progress value={75} className="mt-2" />
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">2</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Tuần 3-4: Cải thiện annotation</h4>
                        <p className="text-sm text-muted-foreground">
                          Review và cải thiện chất lượng nhãn, thêm metadata
                        </p>
                        <Progress value={30} className="mt-2" />
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">3</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Tuần 5-6: Tăng cường đa dạng</h4>
                        <p className="text-sm text-muted-foreground">
                          Thu thập dữ liệu bổ sung, cân bằng dataset
                        </p>
                        <Progress value={0} className="mt-2" />
                      </div>
                    </div>
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
