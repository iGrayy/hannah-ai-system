"use client"

import { useState } from "react"
import { TrainingWizard } from "./training-wizard"
import { TrainingProgressMonitor } from "./training-progress-monitor"
import { DatasetUpload } from "./dataset-upload"
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
    name: "Computer Science Q&A Training",
    status: "running",
    progress: 67,
    startTime: "2024-01-15 14:30",
    datasetSize: 15420,
    accuracy: 0.89,
    loss: 0.23
  },
  {
    id: "2", 
    name: "General Knowledge Update",
    status: "completed",
    progress: 100,
    startTime: "2024-01-14 09:15",
    endTime: "2024-01-14 11:45",
    datasetSize: 8750,
    accuracy: 0.94,
    loss: 0.18
  },
  {
    id: "3",
    name: "Programming Concepts Training",
    status: "failed",
    progress: 34,
    startTime: "2024-01-13 16:20",
    endTime: "2024-01-13 17:10",
    datasetSize: 12300,
    accuracy: 0.76,
    loss: 0.45
  }
]

const mockDatasets: Dataset[] = [
  {
    id: "1",
    name: "CS Q&A Dataset",
    type: "qa_pairs",
    size: 15420,
    lastUpdated: "2024-01-15 10:30",
    status: "ready"
  },
  {
    id: "2",
    name: "Student Conversations",
    type: "conversations", 
    size: 8750,
    lastUpdated: "2024-01-14 15:20",
    status: "ready"
  },
  {
    id: "3",
    name: "Course Materials",
    type: "documents",
    size: 12300,
    lastUpdated: "2024-01-13 09:45",
    status: "processing"
  }
]

export function AITrainingManagement() {
  const [trainingSessions, setTrainingSessions] = useState(mockTrainingSessions)
  const [datasets, setDatasets] = useState(mockDatasets)
  const [isStartingTraining, setIsStartingTraining] = useState(false)
  const [showTrainingWizard, setShowTrainingWizard] = useState(false)
  const [showDatasetUpload, setShowDatasetUpload] = useState(false)
  const [monitoringSession, setMonitoringSession] = useState<TrainingSession | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Running</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>
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
        return <Badge variant="outline">Q&A Pairs</Badge>
      case "conversations":
        return <Badge variant="outline">Conversations</Badge>
      case "documents":
        return <Badge variant="outline">Documents</Badge>
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
  }

  const handleDatasetUpload = (dataset: any) => {
    setDatasets(prev => [dataset, ...prev])
    setShowDatasetUpload(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Huấn luyện dữ liệu 
          </h1>
          <p className="text-muted-foreground">Huấn luyện dữ liệu và tối ưu Hannah AI</p>
        </div>
        <Button onClick={startNewTraining}>
          <Play className="h-4 w-4 mr-2" />
          Bắt đầu huấn luyện
        </Button>
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
              <span className="text-sm font-medium">Training Data</span>
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
                      <TableCell>{session.datasetSize.toLocaleString()}</TableCell>
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
              <CardTitle>Training Data</CardTitle>
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
                      <TableCell>{dataset.size.toLocaleString()} mục</TableCell>
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

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cấu hình huấn luyện
              </CardTitle>
              <CardDescription>Cấu hình tham số huấn luyện AI</CardDescription>
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
              <Button>Lưu cấu hình</Button>
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
    </div>
  )
}
