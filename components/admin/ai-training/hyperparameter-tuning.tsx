"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts"
import { 
  Target, 
  Play, 
  Pause, 
  Square, 
  TrendingUp, 
  BarChart3,
  Settings,
  Zap,
  Brain,
  Search,
  Shuffle,
  Eye,
  Download,
  Copy,
  Star,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"

interface HyperparameterTuningProps {
  onClose: () => void
}

interface TuningExperiment {
  id: string
  name: string
  status: "running" | "completed" | "failed" | "paused"
  method: "grid_search" | "random_search" | "bayesian"
  progress: number
  bestScore: number
  totalTrials: number
  completedTrials: number
  startTime: string
  estimatedEndTime?: string
  bestParams: Record<string, any>
}

interface TrialResult {
  id: string
  experimentId: string
  trialNumber: number
  parameters: Record<string, any>
  score: number
  status: "completed" | "failed" | "running"
  duration: number
  startTime: string
}

const mockExperiments: TuningExperiment[] = [
  {
    id: "1",
    name: "Learning Rate Optimization",
    status: "running",
    method: "bayesian",
    progress: 65,
    bestScore: 0.924,
    totalTrials: 50,
    completedTrials: 32,
    startTime: "2024-01-15 14:30",
    bestParams: {
      learning_rate: 0.0015,
      batch_size: 32,
      dropout: 0.1
    }
  },
  {
    id: "2",
    name: "Architecture Search",
    status: "completed",
    method: "grid_search",
    progress: 100,
    bestScore: 0.918,
    totalTrials: 24,
    completedTrials: 24,
    startTime: "2024-01-14 09:15",
    bestParams: {
      hidden_size: 768,
      num_layers: 12,
      num_heads: 12
    }
  }
]

const mockTrials: TrialResult[] = [
  {
    id: "1",
    experimentId: "1",
    trialNumber: 32,
    parameters: { learning_rate: 0.0015, batch_size: 32, dropout: 0.1 },
    score: 0.924,
    status: "completed",
    duration: 1800,
    startTime: "2024-01-15 16:20"
  },
  {
    id: "2",
    experimentId: "1",
    trialNumber: 31,
    parameters: { learning_rate: 0.002, batch_size: 16, dropout: 0.15 },
    score: 0.919,
    status: "completed",
    duration: 2100,
    startTime: "2024-01-15 15:45"
  },
  {
    id: "3",
    experimentId: "1",
    trialNumber: 30,
    parameters: { learning_rate: 0.001, batch_size: 64, dropout: 0.05 },
    score: 0.912,
    status: "completed",
    duration: 1650,
    startTime: "2024-01-15 15:10"
  }
]

const optimizationMethods = [
  {
    id: "grid_search",
    name: "Grid Search",
    description: "Tìm kiếm toàn bộ không gian tham số theo lưới",
    pros: ["Đảm bảo tìm được tối ưu trong phạm vi", "Dễ hiểu và triển khai"],
    cons: ["Chậm với nhiều tham số", "Không hiệu quả với không gian lớn"]
  },
  {
    id: "random_search",
    name: "Random Search", 
    description: "Tìm kiếm ngẫu nhiên trong không gian tham số",
    pros: ["Nhanh hơn Grid Search", "Hiệu quả với tham số ít quan trọng"],
    cons: ["Không đảm bảo tìm được tối ưu", "Có thể bỏ lỡ vùng tốt"]
  },
  {
    id: "bayesian",
    name: "Bayesian Optimization",
    description: "Sử dụng mô hình xác suất để tối ưu hóa thông minh",
    pros: ["Hiệu quả nhất", "Học từ thử nghiệm trước", "Ít thử nghiệm hơn"],
    cons: ["Phức tạp hơn", "Cần thời gian khởi tạo"]
  }
]

export function HyperparameterTuning({ onClose }: HyperparameterTuningProps) {
  const [experiments, setExperiments] = useState(mockExperiments)
  const [trials, setTrials] = useState(mockTrials)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedExperiment, setSelectedExperiment] = useState<TuningExperiment | null>(null)
  const [showNewExperiment, setShowNewExperiment] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Đang chạy</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Hoàn thành</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Thất bại</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800"><Pause className="h-3 w-3 mr-1" />Tạm dừng</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "grid_search":
        return <Badge variant="outline"><Search className="h-3 w-3 mr-1" />Grid Search</Badge>
      case "random_search":
        return <Badge variant="outline"><Shuffle className="h-3 w-3 mr-1" />Random Search</Badge>
      case "bayesian":
        return <Badge variant="outline"><Brain className="h-3 w-3 mr-1" />Bayesian</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const chartData = trials.map((trial, index) => ({
    trial: trial.trialNumber,
    score: trial.score,
    learning_rate: trial.parameters.learning_rate
  }))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-6 w-6 text-orange-600" />
                Tối ưu hóa Hyperparameter
              </CardTitle>
              <CardDescription>Tự động tìm kiếm tham số tối ưu cho mô hình AI</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowNewExperiment(true)}>
                <Play className="h-4 w-4 mr-2" />
                Thử nghiệm mới
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[75vh]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="experiments">Thử nghiệm</TabsTrigger>
              <TabsTrigger value="results">Kết quả</TabsTrigger>
              <TabsTrigger value="methods">Phương pháp</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Thử nghiệm đang chạy</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{experiments.filter(e => e.status === "running").length}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Hoàn thành</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{experiments.filter(e => e.status === "completed").length}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Điểm cao nhất</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                      {Math.max(...experiments.map(e => e.bestScore)).toFixed(3)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Tổng trials</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                      {experiments.reduce((sum, e) => sum + e.completedTrials, 0)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Experiments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thử nghiệm đang chạy</CardTitle>
                  <CardDescription>Theo dõi tiến độ các thử nghiệm tối ưu hóa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {experiments.filter(e => e.status === "running").map((experiment) => (
                      <div key={experiment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                          <div>
                            <h4 className="font-medium">{experiment.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {experiment.completedTrials}/{experiment.totalTrials} trials • 
                              Điểm tốt nhất: {experiment.bestScore.toFixed(3)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getMethodBadge(experiment.method)}
                          <div className="w-32">
                            <Progress value={experiment.progress} />
                          </div>
                          <span className="text-sm font-medium">{experiment.progress}%</span>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {experiments.filter(e => e.status === "running").length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Không có thử nghiệm nào đang chạy
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Biểu đồ hiệu năng</CardTitle>
                  <CardDescription>Điểm số theo từng trial</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="trial" />
                      <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experiments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Danh sách thử nghiệm</CardTitle>
                  <CardDescription>Quản lý các thử nghiệm tối ưu hóa hyperparameter</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên thử nghiệm</TableHead>
                        <TableHead>Phương pháp</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Tiến độ</TableHead>
                        <TableHead>Điểm tốt nhất</TableHead>
                        <TableHead>Trials</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {experiments.map((experiment) => (
                        <TableRow key={experiment.id}>
                          <TableCell className="font-medium">{experiment.name}</TableCell>
                          <TableCell>{getMethodBadge(experiment.method)}</TableCell>
                          <TableCell>{getStatusBadge(experiment.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={experiment.progress} className="w-16" />
                              <span className="text-sm">{experiment.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{experiment.bestScore.toFixed(3)}</TableCell>
                          <TableCell>{experiment.completedTrials}/{experiment.totalTrials}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              {experiment.status === "running" && (
                                <Button size="sm" variant="outline">
                                  <Pause className="h-3 w-3" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best Parameters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tham số tốt nhất</CardTitle>
                    <CardDescription>Cấu hình tham số đạt điểm cao nhất</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {experiments.length > 0 && (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">Điểm số: {Math.max(...experiments.map(e => e.bestScore)).toFixed(3)}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Từ thử nghiệm: {experiments.find(e => e.bestScore === Math.max(...experiments.map(e => e.bestScore)))?.name}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {Object.entries(experiments[0].bestParams).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm font-medium">{key}</span>
                              <span className="text-sm font-mono">{value}</span>
                            </div>
                          ))}
                        </div>

                        <Button className="w-full">
                          <Copy className="h-4 w-4 mr-2" />
                          Sao chép cấu hình
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Trial Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Kết quả trials</CardTitle>
                    <CardDescription>Chi tiết các lần thử nghiệm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {trials.map((trial) => (
                        <div key={trial.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Trial #{trial.trialNumber}</span>
                            <Badge variant={trial.score > 0.92 ? "default" : "outline"}>
                              {trial.score.toFixed(3)}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>LR: {trial.parameters.learning_rate} • Batch: {trial.parameters.batch_size}</div>
                            <div>Thời gian: {formatDuration(trial.duration)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Parameter Correlation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Phân tích tương quan tham số</CardTitle>
                  <CardDescription>Mối quan hệ giữa tham số và hiệu năng</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="learning_rate" name="Learning Rate" />
                      <YAxis dataKey="score" name="Score" domain={['dataMin - 0.01', 'dataMax + 0.01']} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter dataKey="score" fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="methods" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {optimizationMethods.map((method) => (
                  <Card key={method.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {method.id === "grid_search" && <Search className="h-5 w-5" />}
                        {method.id === "random_search" && <Shuffle className="h-5 w-5" />}
                        {method.id === "bayesian" && <Brain className="h-5 w-5" />}
                        {method.name}
                      </CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-600 mb-2">Ưu điểm:</h4>
                        <ul className="text-xs space-y-1">
                          {method.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-red-600 mb-2">Nhược điểm:</h4>
                        <ul className="text-xs space-y-1">
                          {method.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button variant="outline" className="w-full">
                        Sử dụng phương pháp này
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Configuration Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hướng dẫn cấu hình</CardTitle>
                  <CardDescription>Lời khuyên cho việc thiết lập tối ưu hóa hyperparameter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Tham số quan trọng cần tối ưu:</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          <span><strong>Learning Rate:</strong> Ảnh hưởng lớn nhất đến hiệu năng</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full" />
                          <span><strong>Batch Size:</strong> Cân bằng tốc độ và ổn định</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          <span><strong>Dropout:</strong> Kiểm soát overfitting</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span><strong>Weight Decay:</strong> Regularization</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Chiến lược tối ưu:</h4>
                      <ul className="text-sm space-y-2">
                        <li>1. Bắt đầu với Random Search để khám phá</li>
                        <li>2. Sử dụng Bayesian cho tối ưu hóa tinh</li>
                        <li>3. Grid Search cho vùng tham số nhỏ</li>
                        <li>4. Luôn theo dõi validation score</li>
                        <li>5. Lưu lại cấu hình tốt nhất</li>
                      </ul>
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
