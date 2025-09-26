"use client"

import { useState } from "react"
import { TrainingWizard } from "./training-wizard"
import { TrainingProgressMonitor } from "./training-progress-monitor"
import { DatasetUpload } from "./dataset-upload"
import { ChatRTXTrainingDemo } from "./data-quality-management"
import { formatDataSize, validateTrainingConfig } from "./utils"
import { TrainingErrorBoundary, useErrorHandler, ErrorNotification, LoadingSpinner } from "./error-boundary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Brain, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Database, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Zap,
  Settings,
  Eye
} from "lucide-react"

interface TrainingSession {
  id: string
  name: string
  status: "running" | "completed" | "failed" | "paused"
  progress: number
  startTime: string
  endTime?: string
  datasetSize: number
  accuracy: number
  loss: number
}

interface Dataset {
  id: string
  name: string
  type: "qa_pairs" | "conversations" | "documents"
  size: number
  lastUpdated: string
  status: "ready" | "processing" | "error"
}

const mockTrainingSessions: TrainingSession[] = [
  {
    id: "1",
    name: "Hannah SE Knowledge Base Training (ChatRTX + LoRA)",
    status: "running",
    progress: 67,
    startTime: "2024-01-15 14:30",
    datasetSize: 25420,
    accuracy: 0.89,
    loss: 0.23
  },
  {
    id: "2",
    name: "Programming Concepts Fine-tuning (Mistral-7B)",
    status: "completed",
    progress: 100,
    startTime: "2024-01-14 09:15",
    endTime: "2024-01-14 11:45",
    datasetSize: 18750,
    accuracy: 0.94,
    loss: 0.08
  },
  {
    id: "3",
    name: "Student Q&A RAG Training (CodeLlama-7B)",
    status: "completed",
    progress: 100,
    startTime: "2024-01-13 16:20",
    endTime: "2024-01-13 18:45",
    datasetSize: 12300,
    accuracy: 0.91,
    loss: 0.12
  },
  {
    id: "4",
    name: "Database Systems Course Training",
    status: "failed",
    progress: 34,
    startTime: "2024-01-12 10:20",
    endTime: "2024-01-12 11:10",
    datasetSize: 8500,
    accuracy: 0.76,
    loss: 0.45
  }
]

const mockDatasets: Dataset[] = [
  {
    id: "1",
    name: "SE Curriculum Knowledge Base",
    type: "qa_pairs",
    size: 25420,
    lastUpdated: "2024-01-15 10:30",
    status: "ready"
  },
  {
    id: "2",
    name: "Student-Hannah Conversations",
    type: "conversations",
    size: 18750,
    lastUpdated: "2024-01-14 15:20",
    status: "ready"
  },
  {
    id: "3",
    name: "Programming Code Examples",
    type: "documents",
    size: 12300,
    lastUpdated: "2024-01-13 09:45",
    status: "ready"
  },
  {
    id: "4",
    name: "Faculty Approved Responses",
    type: "qa_pairs",
    size: 8900,
    lastUpdated: "2024-01-12 14:20",
    status: "ready"
  },
  {
    id: "5",
    name: "Assignment Help Guidelines",
    type: "documents",
    size: 5600,
    lastUpdated: "2024-01-11 16:45",
    status: "processing"
  }
]

export function AITrainingManagement() {
  const [trainingSessions, setTrainingSessions] = useState(mockTrainingSessions)
  const [datasets, setDatasets] = useState(mockDatasets)
  const [isStartingTraining, setIsStartingTraining] = useState(false)
  const [showTrainingWizard, setShowTrainingWizard] = useState(false)
  const [showDatasetUpload, setShowDatasetUpload] = useState(false)
  const [showChatRTXDemo, setShowChatRTXDemo] = useState(false)
  const [monitoringSession, setMonitoringSession] = useState<TrainingSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { error, handleError, clearError } = useErrorHandler()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Đang chạy</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Hoàn thành</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Thất bại</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Tạm dừng</Badge>
      // hỗ trợ dữ liệu cũ nếu có 'pending'
      case "pending" as any:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Đang chờ</Badge>
      default:
        return null
    }
  }

  const getDatasetTypeBadge = (type: string) => {
    switch (type) {
      case "qa_pairs":
        return <Badge variant="outline">Cặp Hỏi-Đáp</Badge>
      case "conversations":
        return <Badge variant="outline">Hội thoại</Badge>
      case "documents":
        return <Badge variant="outline">Tài liệu</Badge>
      default:
        return null
    }
  }

  const startNewTraining = () => {
    setShowTrainingWizard(true)
  }

  const handleTrainingComplete = (config: any) => {
    const newSession: TrainingSession = {
      id: Date.now().toString(),
      name: config.name,
      status: "running",
      progress: 0,
      startTime: new Date().toLocaleString(),
      datasetSize: config.datasetIds.length * 1000, // Mock calculation
      accuracy: 0,
      loss: 1.0
    }
    setTrainingSessions(prev => [newSession, ...prev])
    setShowTrainingWizard(false)
    setMonitoringSession(newSession)

    // Simulate ChatRTX training process
    simulateChatRTXTraining(newSession)
  }

  const simulateChatRTXTraining = async (session: TrainingSession) => {
    const phases = [
      { name: "Khởi tạo ChatRTX Model", duration: 3000 },
      { name: "Load SE Knowledge Base", duration: 5000 },
      { name: "Setup RAG Pipeline", duration: 4000 },
      { name: "Fine-tuning với LoRA", duration: 15000 },
      { name: "Validation & Testing", duration: 3000 }
    ]

    let totalProgress = 0
    const progressPerPhase = 100 / phases.length

    for (const phase of phases) {
      console.log(`Starting phase: ${phase.name}`)

      // Simulate phase progress
      for (let i = 0; i <= 100; i += 10) {
        const currentProgress = totalProgress + (i * progressPerPhase / 100)

        setTrainingSessions(prev => prev.map(s =>
          s.id === session.id
            ? {
                ...s,
                progress: Math.round(currentProgress),
                accuracy: Math.min(0.95, 0.3 + (currentProgress / 100) * 0.65),
                loss: Math.max(0.05, 1.0 - (currentProgress / 100) * 0.95)
              }
            : s
        ))

        await new Promise(resolve => setTimeout(resolve, phase.duration / 10))
      }

      totalProgress += progressPerPhase
    }

    // Complete training
    setTrainingSessions(prev => prev.map(s =>
      s.id === session.id
        ? {
            ...s,
            status: "completed" as const,
            progress: 100,
            endTime: new Date().toLocaleString(),
            accuracy: 0.94,
            loss: 0.08
          }
        : s
    ))
  }

  const handleDatasetUpload = (dataset: any) => {
    setDatasets(prev => [dataset, ...prev])
    setShowDatasetUpload(false)
  }

  return (
    <TrainingErrorBoundary>
      <div className="space-y-6">
        <ErrorNotification error={error} onDismiss={clearError} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Huấn luyện dữ liệu 
          </h1>
          <p className="text-muted-foreground">Huấn luyện dữ liệu và tối ưu Hannah AI</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowChatRTXDemo(true)} variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            ChatRTX Demo
          </Button>
          <Button onClick={startNewTraining}>
            <Play className="h-4 w-4 mr-2" />
            Bắt đầu huấn luyện
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Phiên đang chạy</span>
            </div>
            <p className="text-2xl font-bold mt-2">{trainingSessions.filter(s => s.status === "running").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Hoàn tất</span>
            </div>
            <p className="text-2xl font-bold mt-2">{trainingSessions.filter(s => s.status === "completed").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Dữ liệu huấn luyện</span>
            </div>
            <p className="text-2xl font-bold mt-2">{datasets.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Độ chính xác TB</span>
            </div>
            <p className="text-2xl font-bold mt-2">91.2%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Phiên huấn luyện</TabsTrigger>
          <TabsTrigger value="datasets">Dữ liệu huấn luyện</TabsTrigger>
          <TabsTrigger value="chatrtx">ChatRTX Setup</TabsTrigger>
          <TabsTrigger value="config">Cấu hình</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phiên huấn luyện</CardTitle>
              <CardDescription>Theo dõi và quản lý các phiên huấn luyện AI</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Tiến độ</TableHead>
                    <TableHead>Kích thước dữ liệu</TableHead>
                    <TableHead>Độ chính xác</TableHead>
                    <TableHead>Loss</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.name}</TableCell>
                      <TableCell>{getStatusBadge(session.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={session.progress} className="w-20" />
                          <span className="text-sm">{session.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDataSize(session.datasetSize)}</TableCell>
                      <TableCell>{(session.accuracy * 100).toFixed(1)}%</TableCell>
                      <TableCell>{session.loss.toFixed(3)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {session.status === "running" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setMonitoringSession(session)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          {session.status === "failed" && (
                            <Button size="sm" variant="outline">
                              <RotateCcw className="h-3 w-3" />
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

        <TabsContent value="datasets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dữ liệu huấn luyện</CardTitle>
              <CardDescription>Quản lý dữ liệu dùng cho huấn luyện AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div></div>
                <Button size="sm" onClick={() => setShowDatasetUpload(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Tải dữ liệu lên
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Kích thước</TableHead>
                    <TableHead>Cập nhật</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datasets.map((dataset) => (
                    <TableRow key={dataset.id}>
                      <TableCell className="font-medium">{dataset.name}</TableCell>
                      <TableCell>{getDatasetTypeBadge(dataset.type)}</TableCell>
                      <TableCell>{formatDataSize(dataset.size)}</TableCell>
                      <TableCell>{dataset.lastUpdated}</TableCell>
                      <TableCell>
                        <Badge variant={dataset.status === "ready" ? "default" : "secondary"}>
                          {dataset.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatrtx" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NVIDIA ChatRTX Setup</CardTitle>
              <CardDescription>Cấu hình và kiểm tra ChatRTX environment cho Hannah AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* System Requirements Check */}
                <div className="space-y-4">
                  <h4 className="font-medium">System Requirements Check</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">NVIDIA RTX GPU</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">RTX 4090 24GB</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">CUDA Version</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">12.1</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">System RAM</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">64GB</Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Python Environment</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">3.10.12</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">PyTorch</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">2.1.0+cu121</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Storage Space</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">120GB / 500GB</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Model Selection */}
                <div className="space-y-4">
                  <h4 className="font-medium">Available Models</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "Mistral-7B-Instruct", size: "13.5GB", status: "downloaded", recommended: true },
                      { name: "Llama2-7B-Chat", size: "13.5GB", status: "available", recommended: false },
                      { name: "CodeLlama-7B-Instruct", size: "13.5GB", status: "downloading", recommended: false }
                    ].map((model) => (
                      <Card key={model.name} className={`${model.recommended ? 'ring-2 ring-blue-500' : ''}`}>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-sm">{model.name}</h5>
                              {model.recommended && <Badge className="text-xs">Khuyến nghị</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">Size: {model.size}</p>
                            <div className="flex items-center gap-2">
                              {model.status === "downloaded" && <CheckCircle className="h-3 w-3 text-green-500" />}
                              {model.status === "downloading" && <Clock className="h-3 w-3 text-yellow-500" />}
                              {model.status === "available" && <Button size="sm" className="text-xs">Download</Button>}
                              <span className="text-xs capitalize">{model.status}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowChatRTXDemo(true)} className="bg-green-600 hover:bg-green-700">
                      <Play className="h-4 w-4 mr-2" />
                      Launch ChatRTX Demo
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Environment
                    </Button>
                    <Button variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Test Model Loading
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Cấu hình cơ bản
                </CardTitle>
                <CardDescription>Tham số huấn luyện cơ bản</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="learning-rate">Tốc độ học (Learning rate)</Label>
                    <Input id="learning-rate" defaultValue="0.001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-size">Batch size</Label>
                    <Input id="batch-size" defaultValue="32" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="epochs">Số epoch</Label>
                    <Input id="epochs" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model-type">Loại mô hình</Label>
                    <Select defaultValue="transformer">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transformer">Transformer</SelectItem>
                        <SelectItem value="lstm">LSTM</SelectItem>
                        <SelectItem value="bert">BERT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="training-notes">Ghi chú huấn luyện</Label>
                  <Textarea
                    id="training-notes"
                    placeholder="Thêm ghi chú cho cấu hình huấn luyện này..."
                    rows={3}
                  />
                </div>
                <Button>Lưu cấu hình cơ bản</Button>
              </CardContent>
            </Card>

            {/* Advanced Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Cấu hình nâng cao
                </CardTitle>
                <CardDescription>Tham số tối ưu hóa và kiến trúc mô hình</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="optimizer">Optimizer</Label>
                    <Select defaultValue="adam">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adam">Adam</SelectItem>
                        <SelectItem value="sgd">SGD</SelectItem>
                        <SelectItem value="rmsprop">RMSprop</SelectItem>
                        <SelectItem value="adamw">AdamW</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight-decay">Weight Decay</Label>
                    <Input id="weight-decay" defaultValue="0.01" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dropout">Dropout Rate</Label>
                    <Input id="dropout" defaultValue="0.1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warmup-steps">Warmup Steps</Label>
                    <Input id="warmup-steps" defaultValue="1000" />
                  </div>
                </div>
                <Button variant="outline">Cấu hình nâng cao</Button>
              </CardContent>
            </Card>
          </div>

          {/* Model Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Mẫu cấu hình có sẵn</CardTitle>
              <CardDescription>Chọn mẫu cấu hình phù hợp với mục đích sử dụng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">🚀 Huấn luyện nhanh</h4>
                    <p className="text-sm text-muted-foreground mb-3">Tối ưu cho tốc độ, phù hợp với dataset nhỏ</p>
                    <div className="text-xs space-y-1">
                      <div>• LR: 0.01 • Batch: 64</div>
                      <div>• Epochs: 5 • Optimizer: SGD</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">⚖️ Cân bằng</h4>
                    <p className="text-sm text-muted-foreground mb-3">Cân bằng giữa tốc độ và chất lượng</p>
                    <div className="text-xs space-y-1">
                      <div>• LR: 0.001 • Batch: 32</div>
                      <div>• Epochs: 10 • Optimizer: Adam</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">🎯 Chất lượng cao</h4>
                    <p className="text-sm text-muted-foreground mb-3">Tối ưu cho độ chính xác, dataset lớn</p>
                    <div className="text-xs space-y-1">
                      <div>• LR: 0.0001 • Batch: 16</div>
                      <div>• Epochs: 20 • Optimizer: AdamW</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showTrainingWizard && (
        <TrainingWizard
          onClose={() => setShowTrainingWizard(false)}
          onComplete={handleTrainingComplete}
        />
      )}

      {showDatasetUpload && (
        <DatasetUpload
          onClose={() => setShowDatasetUpload(false)}
          onUploadComplete={handleDatasetUpload}
        />
      )}

      {monitoringSession && (
        <TrainingProgressMonitor
          session={{
            ...monitoringSession,
            currentEpoch: Math.floor((monitoringSession.progress / 100) * 10),
            totalEpochs: 10,
            learningRate: 0.001,
            logs: [
              { timestamp: "14:30:15", level: "info", message: "Training started successfully" },
              { timestamp: "14:30:20", level: "info", message: "Loading dataset..." },
              { timestamp: "14:30:25", level: "info", message: "Epoch 1/10 started" }
            ],
            metrics: [
              { epoch: 1, accuracy: 0.65, loss: 0.8, valAccuracy: 0.62, valLoss: 0.85 },
              { epoch: 2, accuracy: 0.72, loss: 0.65, valAccuracy: 0.69, valLoss: 0.70 }
            ]
          }}
          onPause={() => console.log("Pause training")}
          onResume={() => console.log("Resume training")}
          onStop={() => {
            setMonitoringSession(null)
            console.log("Stop training")
          }}
          onClose={() => setMonitoringSession(null)}
        />
      )}

      {showChatRTXDemo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">ChatRTX Training Demo</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowChatRTXDemo(false)}>✕</Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[80vh]">
              <ChatRTXTrainingDemo />
            </div>
          </div>
        </div>
      )}
      </div>
    </TrainingErrorBoundary>
  )
}
