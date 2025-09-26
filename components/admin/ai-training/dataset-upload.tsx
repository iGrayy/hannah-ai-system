"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatFileSize, formatDataSize } from "./utils"
import { 
  Upload, 
  FileText, 
  Database, 
  CheckCircle, 
  AlertCircle,
  X,
  Download,
  Eye
} from "lucide-react"

interface DatasetUploadProps {
  onClose: () => void
  onUploadComplete: (dataset: any) => void
}

interface UploadFile {
  file: File
  progress: number
  status: "pending" | "uploading" | "processing" | "completed" | "error"
  preview?: any[]
  errors?: string[]
}

const DATASET_TYPES = [
  { value: "qa_pairs", label: "Cặp Hỏi - Đáp", description: "Cặp Câu hỏi - Trả lời cho huấn luyện" },
  { value: "conversations", label: "Hội thoại", description: "Dữ liệu hội thoại nhiều lượt" },
  { value: "documents", label: "Tài liệu", description: "Văn bản để trích xuất tri thức" },
  { value: "code_examples", label: "Ví dụ mã", description: "Mã nguồn kèm giải thích" }
]

const SAMPLE_DATA = {
  qa_pairs: [
    { question: "What is React?", answer: "React is a JavaScript library for building user interfaces..." },
    { question: "How does useState work?", answer: "useState is a React Hook that lets you add state to functional components..." }
  ],
  conversations: [
    { 
      messages: [
        { role: "user", content: "Can you explain recursion?" },
        { role: "assistant", content: "Recursion is a programming technique where a function calls itself..." },
        { role: "user", content: "Can you give me an example?" },
        { role: "assistant", content: "Sure! Here's a simple factorial function..." }
      ]
    }
  ]
}

export function DatasetUpload({ onClose, onUploadComplete }: DatasetUploadProps) {
  const [datasetInfo, setDatasetInfo] = useState({
    name: "",
    description: "",
    type: "",
    tags: ""
  })
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Info, 2: Upload, 3: Preview, 4: Complete



  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type === "application/json" || 
      file.type === "text/csv" || 
      file.name.endsWith('.jsonl')
    )

    const newUploadFiles: UploadFile[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: "pending"
    }))

    setUploadFiles(prev => [...prev, ...newUploadFiles])
    
    // Start processing files
    newUploadFiles.forEach((uploadFile, index) => {
      processFile(uploadFile, index)
    })
  }

  const processFile = async (uploadFile: UploadFile, index: number) => {
    // Update status to uploading
    setUploadFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, status: "uploading" } : f
    ))

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, progress } : f
      ))
    }

    // Process file content
    setUploadFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, status: "processing" } : f
    ))

    try {
      const text = await uploadFile.file.text()
      let data: any[] = []
      let errors: string[] = []

      if (uploadFile.file.name.endsWith('.json')) {
        data = JSON.parse(text)
      } else if (uploadFile.file.name.endsWith('.jsonl')) {
        data = text.split('\n').filter(line => line.trim()).map(line => JSON.parse(line))
      } else if (uploadFile.file.type === 'text/csv') {
        // Simple CSV parsing (in real app, use proper CSV parser)
        const lines = text.split('\n')
        const headers = lines[0].split(',')
        data = lines.slice(1).map(line => {
          const values = line.split(',')
          return headers.reduce((obj, header, i) => {
            obj[header.trim()] = values[i]?.trim()
            return obj
          }, {} as any)
        })
      }

      // Validate data structure
      if (datasetInfo.type === "qa_pairs") {
        data.forEach((item, i) => {
          if (!item.question || !item.answer) {
            errors.push(`Dòng ${i + 1}: Thiếu câu hỏi hoặc câu trả lời`)
          }
        })
      }

      setUploadFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: errors.length > 0 ? "error" : "completed",
          preview: data.slice(0, 5), // First 5 items for preview
          errors
        } : f
      ))

    } catch (error) {
      setUploadFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: "error",
          errors: ["Không thể phân tích tệp: " + (error as Error).message]
        } : f
      ))
    }
  }

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "uploading":
      case "processing":
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return datasetInfo.name && datasetInfo.type && datasetInfo.description
      case 2:
        return uploadFiles.length > 0 && uploadFiles.every(f => f.status === "completed")
      case 3:
        return true
      default:
        return false
    }
  }

  const handleComplete = () => {
    const totalItems = uploadFiles.reduce((sum, f) => sum + (f.preview?.length || 0), 0)
    
    const newDataset = {
      id: Date.now().toString(),
      name: datasetInfo.name,
      description: datasetInfo.description,
      type: datasetInfo.type,
      size: totalItems,
      lastUpdated: new Date().toLocaleString(),
      status: "ready",
      tags: datasetInfo.tags.split(',').map(t => t.trim()).filter(Boolean)
    }

    onUploadComplete(newDataset)
    onClose()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên Dataset *</Label>
              <Input
                id="name"
                value={datasetInfo.name}
                onChange={(e) => setDatasetInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="VD: Computer Science Q&A v2.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Loại Dataset *</Label>
              <Select 
                value={datasetInfo.type} 
                onValueChange={(value) => setDatasetInfo(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại dataset" />
                </SelectTrigger>
                <SelectContent>
                  {DATASET_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                value={datasetInfo.description}
                onChange={(e) => setDatasetInfo(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả nội dung và mục đích của dataset..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Thẻ (không bắt buộc)</Label>
              <Input
                id="tags"
                value={datasetInfo.tags}
                onChange={(e) => setDatasetInfo(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="programming, computer-science, beginner (phân cách bằng dấu phẩy)"
              />
            </div>

            {datasetInfo.type && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📋 Định dạng yêu cầu:</h4>
                <div className="text-sm text-blue-800">
                  {datasetInfo.type === "qa_pairs" && (
                    <div>
                      <p className="mb-2">JSON format với các trường:</p>
                      <code className="bg-white p-2 rounded block">
                        {JSON.stringify(SAMPLE_DATA.qa_pairs[0], null, 2)}
                      </code>
                    </div>
                  )}
                  {datasetInfo.type === "conversations" && (
                    <div>
                      <p className="mb-2">JSON format với messages array:</p>
                      <code className="bg-white p-2 rounded block text-xs">
                        {JSON.stringify(SAMPLE_DATA.conversations[0], null, 2)}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Kéo & thả tệp vào đây, hoặc bấm để chọn</p>
              <p className="text-sm text-muted-foreground mb-4">Hỗ trợ: JSON, JSONL, CSV</p>
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                Chọn tệp
              </Button>
              <input
                id="file-input"
                type="file"
                multiple
                accept=".json,.jsonl,.csv"
                className="hidden"
                onChange={(e) => handleFiles(Array.from(e.target.files || []))}
              />
            </div>

            {uploadFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Các tệp đã tải lên:</h4>
                {uploadFiles.map((uploadFile, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(uploadFile.status)}
                          <div>
                            <p className="font-medium">{uploadFile.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(uploadFile.file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {uploadFile.status === "uploading" && (
                            <div className="w-32">
                              <Progress value={uploadFile.progress} />
                            </div>
                          )}
                          {uploadFile.status === "completed" && (
                            <Badge variant="outline" className="text-green-600">
                              {formatDataSize(uploadFile.preview?.length || 0)}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {uploadFile.errors && uploadFile.errors.length > 0 && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
                          {uploadFile.errors.map((error, i) => (
                            <div key={i}>• {error}</div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 3:
        const totalItems = uploadFiles.reduce((sum, f) => sum + (f.preview?.length || 0), 0)
        return (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Dataset sẵn sàng!</h3>
              <p className="text-muted-foreground">Xử lý thành công {formatDataSize(totalItems)} từ {uploadFiles.length} tệp</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt Dataset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Tên:</span> {datasetInfo.name}</div>
                  <div><span className="font-medium">Loại:</span> {datasetInfo.type}</div>
                  <div><span className="font-medium">Tổng mục:</span> {formatDataSize(totalItems)}</div>
                  <div><span className="font-medium">Số tệp:</span> {uploadFiles.length}</div>
                </div>
              </CardContent>
            </Card>

            {uploadFiles[0]?.preview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Xem trước dữ liệu</CardTitle>
                  <CardDescription>Một vài mục đầu tiên từ dataset của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <pre className="text-sm">
                      {JSON.stringify(uploadFiles[0].preview, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
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
              <CardTitle className="text-xl flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-600" />
                Tải lên Dataset
              </CardTitle>
              <CardDescription>Thêm dữ liệu huấn luyện mới cho Hannah AI</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {["Thông tin", "Tải lên", "Xem trước"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${currentStep > index + 1 ? 'bg-green-500 text-white' :
                    currentStep === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {currentStep > index + 1 ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= index + 1 ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}>
                  {step}
                </span>
                {index < 2 && <div className="w-12 h-0.5 mx-4 bg-gray-300" />}
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
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
            disabled={currentStep === 1}
          >
            Quay lại
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Hủy</Button>
            {currentStep < 3 ? (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
              >
                Tiếp theo
              </Button>
            ) : (
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                Hoàn tất tải lên
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
