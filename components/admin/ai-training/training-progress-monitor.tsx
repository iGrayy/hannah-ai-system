"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { 
  Play, 
  Pause, 
  Square, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap,
  AlertCircle,
  CheckCircle,
  Activity
} from "lucide-react"

interface TrainingSession {
  id: string
  name: string
  status: "running" | "paused" | "completed" | "failed"
  progress: number
  currentEpoch: number
  totalEpochs: number
  accuracy: number
  loss: number
  learningRate: number
  startTime: string
  estimatedEndTime?: string
  logs: TrainingLog[]
  metrics: MetricPoint[]
}

interface TrainingLog {
  timestamp: string
  level: "info" | "warning" | "error"
  message: string
}

interface MetricPoint {
  epoch: number
  accuracy: number
  loss: number
  valAccuracy: number
  valLoss: number
}

interface TrainingProgressMonitorProps {
  session: TrainingSession
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onClose: () => void
}

export function TrainingProgressMonitor({ 
  session, 
  onPause, 
  onResume, 
  onStop, 
  onClose 
}: TrainingProgressMonitorProps) {
  const [currentSession, setCurrentSession] = useState(session)
  const [autoScroll, setAutoScroll] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (currentSession.status !== "running") return

    const interval = setInterval(() => {
      setCurrentSession(prev => {
        const newProgress = Math.min(prev.progress + Math.random() * 2, 100)
        const newEpoch = Math.floor((newProgress / 100) * prev.totalEpochs)
        const newAccuracy = Math.min(prev.accuracy + (Math.random() - 0.5) * 0.02, 1)
        const newLoss = Math.max(prev.loss - (Math.random() - 0.3) * 0.01, 0.01)

        // Add new log entry occasionally
        const newLogs = [...prev.logs]
        if (Math.random() < 0.3) {
          newLogs.push({
            timestamp: new Date().toLocaleTimeString(),
            level: Math.random() < 0.1 ? "warning" : "info",
            message: Math.random() < 0.5 
              ? `Epoch ${newEpoch}/${prev.totalEpochs} - Loss: ${newLoss.toFixed(4)}, Độ chính xác: ${(newAccuracy * 100).toFixed(2)}%`
              : `Đang xử lý batch ${Math.floor(Math.random() * 100) + 1}/100`
          })
        }

        // Add new metric point
        const newMetrics = [...prev.metrics]
        if (newEpoch > prev.currentEpoch) {
          newMetrics.push({
            epoch: newEpoch,
            accuracy: newAccuracy,
            loss: newLoss,
            valAccuracy: newAccuracy - Math.random() * 0.05,
            valLoss: newLoss + Math.random() * 0.02
          })
        }

        return {
          ...prev,
          progress: newProgress,
          currentEpoch: newEpoch,
          accuracy: newAccuracy,
          loss: newLoss,
          logs: newLogs.slice(-50), // Keep last 50 logs
          metrics: newMetrics
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [currentSession.status])

  const getStatusBadge = () => {
    switch (currentSession.status) {
      case "running":
        return <Badge className="bg-blue-100 text-blue-800"><Activity className="h-3 w-3 mr-1 animate-pulse" />Đang chạy</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800"><Pause className="h-3 w-3 mr-1" />Tạm dừng</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Hoàn thành</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Lỗi</Badge>
      default:
        return null
    }
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const estimatedTimeRemaining = () => {
    if (currentSession.progress === 0) return "Đang tính..."
    const elapsed = Date.now() - new Date(currentSession.startTime).getTime()
    const remaining = (elapsed / currentSession.progress) * (100 - currentSession.progress)
    const minutes = Math.floor(remaining / (1000 * 60))
    return `~${minutes} phút`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="h-6 w-6 text-purple-600" />
                {currentSession.name}
              </CardTitle>
              <CardDescription>Theo dõi tiến trình huấn luyện</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tiến độ tổng</span>
                  <span className="text-2xl font-bold">{currentSession.progress.toFixed(1)}%</span>
                </div>
                <Progress value={currentSession.progress} className="mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Epoch {currentSession.currentEpoch}/{currentSession.totalEpochs}</span>
                  <span>{estimatedTimeRemaining()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Độ chính xác</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold text-green-600">
                      {(currentSession.accuracy * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Mục tiêu: 95% • Xu hướng hiện tại: ↗️ Cải thiện
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Độ lỗi (Loss)</span>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="h-4 w-4 text-blue-500" />
                    <span className="text-2xl font-bold text-blue-600">
                      {currentSession.loss.toFixed(4)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Tốc độ học (LR): {currentSession.learningRate} • Giảm ↘️
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chỉ số huấn luyện</CardTitle>
                <CardDescription>Accuracy và Loss theo từng epoch</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={currentSession.metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#10b981" 
                      name="Độ chính xác huấn luyện"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="valAccuracy" 
                      stroke="#06b6d4" 
                      name="Độ chính xác kiểm định"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Đường cong Loss</CardTitle>
                <CardDescription>Loss huấn luyện và kiểm định</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={currentSession.metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="loss" 
                      stroke="#ef4444" 
                      name="Loss huấn luyện"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="valLoss" 
                      stroke="#f97316" 
                      name="Loss kiểm định"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Training Logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Nhật ký huấn luyện</CardTitle>
                  <CardDescription>Luồng kết quả theo thời gian thực</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={autoScroll}
                      onChange={(e) => setAutoScroll(e.target.checked)}
                      className="rounded"
                    />
                    Tự cuộn
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                {currentSession.logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 mb-1">
                    <span className="text-gray-500 text-xs">[{log.timestamp}]</span>
                    {getLogIcon(log.level)}
                    <span className={
                      log.level === "error" ? "text-red-400" :
                      log.level === "warning" ? "text-yellow-400" : "text-green-400"
                    }>
                      {log.message}
                    </span>
                  </div>
                ))}
                {currentSession.logs.length === 0 && (
                  <div className="text-gray-500 text-center py-8">
                    Đang chờ nhật ký huấn luyện...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>

        {/* Control Buttons */}
        <div className="border-t p-6 flex justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Bắt đầu: {new Date(currentSession.startTime).toLocaleString()}
          </div>

          <div className="flex gap-2">
            {currentSession.status === "running" && (
              <Button variant="outline" onClick={onPause}>
                <Pause className="h-4 w-4 mr-2" />
                Tạm dừng
              </Button>
            )}
            {currentSession.status === "paused" && (
              <Button variant="outline" onClick={onResume}>
                <Play className="h-4 w-4 mr-2" />
                Tiếp tục
              </Button>
            )}
            <Button variant="destructive" onClick={onStop}>
              <Square className="h-4 w-4 mr-2" />
              Dừng huấn luyện
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
