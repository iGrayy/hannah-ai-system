"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatDataSize } from "./utils"
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  FileText, 
  Database, 
  Settings, 
  Play,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface TrainingWizardProps {
  onClose: () => void
  onComplete: (config: TrainingConfig) => void
}

interface TrainingConfig {
  name: string
  description: string
  datasetIds: string[]

  // ChatRTX Configuration
  baseModel: "mistral-7b-instruct" | "llama2-7b-chat" | "codellama-7b-instruct"
  trainingMethod: "lora" | "qlora" | "full_fine_tuning"
  quantization: "4bit" | "8bit" | "fp16"

  // LoRA Parameters
  loraRank: number
  loraAlpha: number
  loraDropout: number

  // Training Parameters
  learningRate: number
  batchSize: number
  epochs: number
  validationSplit: number
  maxTokens: number

  // Hardware Settings
  gpuLayers: number
  useFlashAttention: boolean
}

const STEPS = [
  { id: 1, title: "Thông tin cơ bản", icon: FileText },
  { id: 2, title: "Chọn Dataset", icon: Database },
  { id: 3, title: "Cấu hình Model", icon: Settings },
  { id: 4, title: "Xác nhận & Bắt đầu", icon: Play }
]

const mockDatasets = [
  { id: "1", name: "SE Curriculum Knowledge Base", size: 25420, type: "qa_pairs", quality: 95, chatrtx_ready: true },
  { id: "2", name: "Student-Hannah Conversations", size: 18750, type: "conversations", quality: 88, chatrtx_ready: true },
  { id: "3", name: "Programming Code Examples", size: 12300, type: "documents", quality: 92, chatrtx_ready: true },
  { id: "4", name: "Faculty Approved Responses", size: 8900, type: "qa_pairs", quality: 94, chatrtx_ready: true },
  { id: "5", name: "Assignment Help Guidelines", size: 5600, type: "documents", quality: 90, chatrtx_ready: false },
  { id: "6", name: "Database Systems Course", size: 7200, type: "qa_pairs", quality: 91, chatrtx_ready: true }
]

export function TrainingWizard({ onClose, onComplete }: TrainingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [config, setConfig] = useState<TrainingConfig>({
    name: "",
    description: "",
    datasetIds: [],

    // ChatRTX defaults
    baseModel: "mistral-7b-instruct",
    trainingMethod: "qlora",
    quantization: "4bit",

    // LoRA defaults
    loraRank: 16,
    loraAlpha: 32,
    loraDropout: 0.1,

    // Training defaults
    learningRate: 2e-4,
    batchSize: 4,
    epochs: 5,
    validationSplit: 0.2,
    maxTokens: 4096,

    // Hardware defaults
    gpuLayers: 32,
    useFlashAttention: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const getDatasetTypeLabel = (type: string): string => {
    switch (type) {
      case "qa_pairs":
        return "Cặp Hỏi-Đáp"
      case "conversations":
        return "Hội thoại"
      case "documents":
        return "Tài liệu"
      case "code_examples":
        return "Ví dụ mã"
      default:
        return type
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!config.name.trim()) newErrors.name = "Tên training session là bắt buộc"
        if (!config.description.trim()) newErrors.description = "Mô tả là bắt buộc"
        break
      case 2:
        if (config.datasetIds.length === 0) newErrors.datasets = "Phải chọn ít nhất 1 dataset"
        break
      case 3:
        if (config.learningRate <= 0) newErrors.learningRate = "Learning rate phải > 0"
        if (config.batchSize <= 0) newErrors.batchSize = "Batch size phải > 0"
        if (config.epochs <= 0) newErrors.epochs = "Epochs phải > 0"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleDatasetToggle = (datasetId: string) => {
    setConfig(prev => ({
      ...prev,
      datasetIds: prev.datasetIds.includes(datasetId)
        ? prev.datasetIds.filter(id => id !== datasetId)
        : [...prev.datasetIds, datasetId]
    }))
  }

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      onComplete(config)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên Training Session *</Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="VD: Computer Science Q&A Training v2.0"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả mục đích và nội dung của phiên training này..."
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Gợi ý đặt tên:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Bao gồm chủ đề: "Programming Concepts Training"</li>
                <li>• Thêm version: "v1.0", "v2.1"</li>
                <li>• Ghi rõ mục đích: "Accuracy Improvement", "New Dataset Integration"</li>
              </ul>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Chọn Dataset để huấn luyện *</h3>
              <p className="text-sm text-muted-foreground">Chọn một hoặc nhiều dataset để huấn luyện mô hình</p>
              {errors.datasets && <p className="text-sm text-red-500 mt-1">{errors.datasets}</p>}
            </div>

            <div className="grid gap-4">
              {mockDatasets.map((dataset) => (
                <Card 
                  key={dataset.id} 
                  className={`cursor-pointer transition-all ${
                    config.datasetIds.includes(dataset.id) 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleDatasetToggle(dataset.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={config.datasetIds.includes(dataset.id)}
                          onCheckedChange={() => handleDatasetToggle(dataset.id)}
                        />
                        <div>
                          <h4 className="font-medium">{dataset.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDataSize(dataset.size)} • {getDatasetTypeLabel(dataset.type)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          Chất lượng: {dataset.quality}%
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {dataset.quality >= 90 ? "Xuất sắc" : 
                           dataset.quality >= 80 ? "Tốt" : "Khá"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {config.datasetIds.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">
                  ✅ Đã chọn {config.datasetIds.length} dataset
                </h4>
                <p className="text-sm text-green-800">
                  Tổng: {formatDataSize(mockDatasets
                    .filter(d => config.datasetIds.includes(d.id))
                    .reduce((sum, d) => sum + d.size, 0))}
                </p>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Cấu hình ChatRTX Training</h3>
              <p className="text-sm text-muted-foreground">
                Cấu hình model và tham số training cho Hannah AI với NVIDIA ChatRTX
              </p>
            </div>

            {/* Base Model Selection */}
            <div className="space-y-4">
              <h4 className="font-medium">Base Model Selection</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "mistral-7b-instruct", label: "Mistral-7B", desc: "Tốt nhất cho SE Q&A", size: "7B params" },
                  { value: "llama2-7b-chat", label: "Llama2-7B", desc: "Cân bằng performance", size: "7B params" },
                  { value: "codellama-7b-instruct", label: "CodeLlama-7B", desc: "Chuyên về code", size: "7B params" }
                ].map((model) => (
                  <Card
                    key={model.value}
                    className={`cursor-pointer transition-all ${
                      config.baseModel === model.value
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setConfig(prev => ({ ...prev, baseModel: model.value as any }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Checkbox checked={config.baseModel === model.value} />
                        <h5 className="font-medium">{model.label}</h5>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{model.desc}</p>
                      <Badge variant="outline" className="text-xs">{model.size}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Training Method */}
            <div className="space-y-4">
              <h4 className="font-medium">Training Method</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "qlora", label: "QLoRA", desc: "4-bit quantization + LoRA", memory: "~8GB VRAM" },
                  { value: "lora", label: "LoRA", desc: "Low-rank adaptation", memory: "~12GB VRAM" },
                  { value: "full_fine_tuning", label: "Full Fine-tuning", desc: "Train all parameters", memory: "~20GB VRAM" }
                ].map((method) => (
                  <Card
                    key={method.value}
                    className={`cursor-pointer transition-all ${
                      config.trainingMethod === method.value
                        ? 'ring-2 ring-green-500 bg-green-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setConfig(prev => ({ ...prev, trainingMethod: method.value as any }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Checkbox checked={config.trainingMethod === method.value} />
                        <h5 className="font-medium">{method.label}</h5>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{method.desc}</p>
                      <Badge variant="outline" className="text-xs">{method.memory}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* LoRA Configuration */}
            {(config.trainingMethod === "lora" || config.trainingMethod === "qlora") && (
              <div className="space-y-4">
                <h4 className="font-medium">LoRA Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loraRank">LoRA Rank (r)</Label>
                    <Select
                      value={config.loraRank.toString()}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, loraRank: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8 (Nhanh, ít memory)</SelectItem>
                        <SelectItem value="16">16 (Khuyến nghị)</SelectItem>
                        <SelectItem value="32">32 (Chất lượng cao)</SelectItem>
                        <SelectItem value="64">64 (Tốt nhất)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loraAlpha">LoRA Alpha (α)</Label>
                    <Input
                      id="loraAlpha"
                      type="number"
                      value={config.loraAlpha}
                      onChange={(e) => setConfig(prev => ({ ...prev, loraAlpha: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loraDropout">LoRA Dropout</Label>
                    <Input
                      id="loraDropout"
                      type="number"
                      step="0.01"
                      value={config.loraDropout}
                      onChange={(e) => setConfig(prev => ({ ...prev, loraDropout: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Training Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium">Training Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="learningRate">Tốc độ học (Learning Rate)</Label>
                  <Input
                    id="learningRate"
                    type="number"
                    step="0.0001"
                    value={config.learningRate}
                    onChange={(e) => setConfig(prev => ({ ...prev, learningRate: parseFloat(e.target.value) }))}
                    className={errors.learningRate ? "border-red-500" : ""}
                  />
                  {errors.learningRate && <p className="text-sm text-red-500">{errors.learningRate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchSize">Kích thước lô (Batch Size)</Label>
                  <Select
                    value={config.batchSize.toString()}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, batchSize: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 (Khuyến nghị cho QLoRA)</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="32">32</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="epochs">Số epoch</Label>
                  <Input
                    id="epochs"
                    type="number"
                    min="1"
                    value={config.epochs}
                    onChange={(e) => setConfig(prev => ({ ...prev, epochs: parseInt(e.target.value) }))}
                    className={errors.epochs ? "border-red-500" : ""}
                  />
                  {errors.epochs && <p className="text-sm text-red-500">{errors.epochs}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validationSplit">Tỉ lệ validation (%)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="validationSplit"
                      type="number"
                      min="0.1"
                      max="0.5"
                      step="0.05"
                      value={config.validationSplit}
                      onChange={(e) => setConfig(prev => ({ ...prev, validationSplit: parseFloat(e.target.value) }))}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">
                      {(config.validationSplit * 100).toFixed(0)}% data sẽ dùng để validation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">⚠️ Lưu ý:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Training có thể mất từ 30 phút đến vài giờ</li>
                <li>• Không tắt trình duyệt trong quá trình training</li>
                <li>• Có thể theo dõi tiến độ theo thời gian thực</li>
              </ul>
            </div>
          </div>
        )

      case 4:
        const selectedDatasets = mockDatasets.filter(d => config.datasetIds.includes(d.id))
        const totalItems = selectedDatasets.reduce((sum, d) => sum + d.size, 0)
        const estimatedTime = Math.ceil((totalItems * config.epochs) / (config.batchSize * 100)) // rough estimate

        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Sẵn sàng bắt đầu Training!</h3>
              <p className="text-muted-foreground">Xem lại thông tin và bắt đầu training session</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tóm tắt Training Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tên:</span>
                    <p className="text-muted-foreground">{config.name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Model:</span>
                    <p className="text-muted-foreground">{config.baseModel}</p>
                  </div>
                  <div>
                    <span className="font-medium">Dataset:</span>
                    <p className="text-muted-foreground">{selectedDatasets.length} dataset</p>
                  </div>
                  <div>
                    <span className="font-medium">Tổng dữ liệu:</span>
                    <p className="text-muted-foreground">{formatDataSize(totalItems)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Epochs:</span>
                    <p className="text-muted-foreground">{config.epochs}</p>
                  </div>
                  <div>
                    <span className="font-medium">Thời gian ước tính:</span>
                    <p className="text-muted-foreground">~{estimatedTime} phút</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🚀 Sẽ xảy ra gì tiếp theo:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Khởi tạo training environment</li>
                <li>Load và preprocess datasets</li>
                <li>Bắt đầu training với real-time monitoring</li>
                <li>Tự động save checkpoints</li>
                <li>Thông báo khi hoàn thành</li>
              </ol>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Trình hướng dẫn huấn luyện</CardTitle>
              <CardDescription>Tạo phiên huấn luyện mới cho Hannah AI</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${currentStep >= step.id 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'border-gray-300 text-gray-400'
                  }
                `}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStepContent()}
        </CardContent>

        <div className="border-t p-6 flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Hủy
            </Button>
            {currentStep < STEPS.length ? (
              <Button onClick={nextStep}>
                Tiếp theo
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Bắt đầu huấn luyện
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}