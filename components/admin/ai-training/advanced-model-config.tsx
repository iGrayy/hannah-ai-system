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
import { Slider } from "@/components/ui/slider"
import { 
  Settings, 
  Zap, 
  Brain, 
  Target, 
  TrendingUp, 
  Save,
  RotateCcw,
  Copy,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react"

interface AdvancedModelConfigProps {
  onClose: () => void
  onSave: (config: ModelConfig) => void
}

interface ModelConfig {
  // Architecture
  modelType: string
  hiddenSize: number
  numLayers: number
  numHeads: number
  intermediateSize: number
  
  // Training Parameters
  learningRate: number
  batchSize: number
  epochs: number
  warmupSteps: number
  maxGradNorm: number
  
  // Optimization
  optimizer: string
  weightDecay: number
  beta1: number
  beta2: number
  epsilon: number
  
  // Regularization
  dropoutRate: number
  attentionDropout: number
  layerNorm: boolean
  
  // Advanced Settings
  gradientAccumulation: number
  mixedPrecision: boolean
  dataParallel: boolean
  checkpointInterval: number
  
  // Custom Settings
  customParameters: Record<string, any>
  notes: string
}

const defaultConfig: ModelConfig = {
  modelType: "transformer",
  hiddenSize: 768,
  numLayers: 12,
  numHeads: 12,
  intermediateSize: 3072,
  learningRate: 0.001,
  batchSize: 32,
  epochs: 10,
  warmupSteps: 1000,
  maxGradNorm: 1.0,
  optimizer: "adam",
  weightDecay: 0.01,
  beta1: 0.9,
  beta2: 0.999,
  epsilon: 1e-8,
  dropoutRate: 0.1,
  attentionDropout: 0.1,
  layerNorm: true,
  gradientAccumulation: 1,
  mixedPrecision: false,
  dataParallel: false,
  checkpointInterval: 1000,
  customParameters: {},
  notes: ""
}

const modelPresets = {
  "small": {
    name: "Small Model",
    description: "Phù hợp cho thử nghiệm và dataset nhỏ",
    hiddenSize: 256,
    numLayers: 6,
    numHeads: 8,
    intermediateSize: 1024,
    batchSize: 64
  },
  "base": {
    name: "Base Model", 
    description: "Cấu hình cân bằng cho hầu hết trường hợp",
    hiddenSize: 768,
    numLayers: 12,
    numHeads: 12,
    intermediateSize: 3072,
    batchSize: 32
  },
  "large": {
    name: "Large Model",
    description: "Chất lượng cao cho dataset lớn",
    hiddenSize: 1024,
    numLayers: 24,
    numHeads: 16,
    intermediateSize: 4096,
    batchSize: 16
  }
}

export function AdvancedModelConfig({ onClose, onSave }: AdvancedModelConfigProps) {
  const [config, setConfig] = useState<ModelConfig>(defaultConfig)
  const [activeTab, setActiveTab] = useState("architecture")
  const [selectedPreset, setSelectedPreset] = useState<string>("")

  const updateConfig = (key: keyof ModelConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const applyPreset = (presetKey: string) => {
    const preset = modelPresets[presetKey as keyof typeof modelPresets]
    if (preset) {
      setConfig(prev => ({
        ...prev,
        hiddenSize: preset.hiddenSize,
        numLayers: preset.numLayers,
        numHeads: preset.numHeads,
        intermediateSize: preset.intermediateSize,
        batchSize: preset.batchSize
      }))
      setSelectedPreset(presetKey)
    }
  }

  const resetToDefaults = () => {
    setConfig(defaultConfig)
    setSelectedPreset("")
  }

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'hannah-model-config.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleSave = () => {
    onSave(config)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" />
                Cấu hình mô hình nâng cao
              </CardTitle>
              <CardDescription>Tùy chỉnh chi tiết tham số và kiến trúc mô hình AI</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportConfig}>
                <Download className="h-4 w-4 mr-2" />
                Xuất
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Model Presets */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Mẫu cấu hình</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(modelPresets).map(([key, preset]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all ${
                    selectedPreset === key ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => applyPreset(key)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{preset.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{preset.description}</p>
                    <div className="text-xs space-y-1">
                      <div>Hidden: {preset.hiddenSize} • Layers: {preset.numLayers}</div>
                      <div>Heads: {preset.numHeads} • Batch: {preset.batchSize}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="architecture">Kiến trúc</TabsTrigger>
              <TabsTrigger value="training">Huấn luyện</TabsTrigger>
              <TabsTrigger value="optimization">Tối ưu hóa</TabsTrigger>
              <TabsTrigger value="advanced">Nâng cao</TabsTrigger>
            </TabsList>

            <TabsContent value="architecture" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kiến trúc mô hình</CardTitle>
                  <CardDescription>Cấu hình cấu trúc và kích thước mô hình</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="model-type">Loại mô hình</Label>
                      <Select
                        value={config.modelType}
                        onValueChange={(value) => updateConfig('modelType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transformer">Transformer</SelectItem>
                          <SelectItem value="bert">BERT</SelectItem>
                          <SelectItem value="gpt">GPT</SelectItem>
                          <SelectItem value="t5">T5</SelectItem>
                          <SelectItem value="lstm">LSTM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hidden-size">Hidden Size</Label>
                      <Input
                        id="hidden-size"
                        type="number"
                        value={config.hiddenSize}
                        onChange={(e) => updateConfig('hiddenSize', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="num-layers">Số lớp (Layers)</Label>
                      <Input
                        id="num-layers"
                        type="number"
                        value={config.numLayers}
                        onChange={(e) => updateConfig('numLayers', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="num-heads">Số đầu Attention</Label>
                      <Input
                        id="num-heads"
                        type="number"
                        value={config.numHeads}
                        onChange={(e) => updateConfig('numHeads', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="intermediate-size">Intermediate Size</Label>
                      <Input
                        id="intermediate-size"
                        type="number"
                        value={config.intermediateSize}
                        onChange={(e) => updateConfig('intermediateSize', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Lưu ý về kiến trúc:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Hidden Size phải chia hết cho Số đầu Attention</li>
                          <li>• Intermediate Size thường gấp 4 lần Hidden Size</li>
                          <li>• Mô hình lớn hơn cần nhiều tài nguyên hơn</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="training" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tham số huấn luyện</CardTitle>
                  <CardDescription>Cấu hình quá trình huấn luyện mô hình</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="learning-rate">Tốc độ học (Learning Rate)</Label>
                      <Input
                        id="learning-rate"
                        type="number"
                        step="0.0001"
                        value={config.learningRate}
                        onChange={(e) => updateConfig('learningRate', parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batch-size">Batch Size</Label>
                      <Input
                        id="batch-size"
                        type="number"
                        value={config.batchSize}
                        onChange={(e) => updateConfig('batchSize', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="epochs">Số Epochs</Label>
                      <Input
                        id="epochs"
                        type="number"
                        value={config.epochs}
                        onChange={(e) => updateConfig('epochs', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warmup-steps">Warmup Steps</Label>
                      <Input
                        id="warmup-steps"
                        type="number"
                        value={config.warmupSteps}
                        onChange={(e) => updateConfig('warmupSteps', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-grad-norm">Max Gradient Norm</Label>
                      <Input
                        id="max-grad-norm"
                        type="number"
                        step="0.1"
                        value={config.maxGradNorm}
                        onChange={(e) => updateConfig('maxGradNorm', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Dropout Rate: {config.dropoutRate}</Label>
                      <Slider
                        value={[config.dropoutRate]}
                        onValueChange={([value]) => updateConfig('dropoutRate', value)}
                        max={0.5}
                        min={0}
                        step={0.01}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="layer-norm"
                        checked={config.layerNorm}
                        onCheckedChange={(checked) => updateConfig('layerNorm', checked)}
                      />
                      <Label htmlFor="layer-norm">Sử dụng Layer Normalization</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tối ưu hóa</CardTitle>
                  <CardDescription>Cấu hình optimizer và tham số tối ưu hóa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="optimizer">Optimizer</Label>
                      <Select
                        value={config.optimizer}
                        onValueChange={(value) => updateConfig('optimizer', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adam">Adam</SelectItem>
                          <SelectItem value="adamw">AdamW</SelectItem>
                          <SelectItem value="sgd">SGD</SelectItem>
                          <SelectItem value="rmsprop">RMSprop</SelectItem>
                          <SelectItem value="adagrad">Adagrad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight-decay">Weight Decay</Label>
                      <Input
                        id="weight-decay"
                        type="number"
                        step="0.001"
                        value={config.weightDecay}
                        onChange={(e) => updateConfig('weightDecay', parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="beta1">Beta 1</Label>
                      <Input
                        id="beta1"
                        type="number"
                        step="0.01"
                        value={config.beta1}
                        onChange={(e) => updateConfig('beta1', parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="beta2">Beta 2</Label>
                      <Input
                        id="beta2"
                        type="number"
                        step="0.001"
                        value={config.beta2}
                        onChange={(e) => updateConfig('beta2', parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="epsilon">Epsilon</Label>
                      <Input
                        id="epsilon"
                        type="number"
                        step="1e-9"
                        value={config.epsilon}
                        onChange={(e) => updateConfig('epsilon', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cài đặt nâng cao</CardTitle>
                  <CardDescription>Cấu hình tối ưu hóa hiệu năng và tính năng nâng cao</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gradient-accumulation">Gradient Accumulation Steps</Label>
                      <Input
                        id="gradient-accumulation"
                        type="number"
                        value={config.gradientAccumulation}
                        onChange={(e) => updateConfig('gradientAccumulation', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkpoint-interval">Checkpoint Interval</Label>
                      <Input
                        id="checkpoint-interval"
                        type="number"
                        value={config.checkpointInterval}
                        onChange={(e) => updateConfig('checkpointInterval', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="mixed-precision"
                        checked={config.mixedPrecision}
                        onCheckedChange={(checked) => updateConfig('mixedPrecision', checked)}
                      />
                      <Label htmlFor="mixed-precision">Mixed Precision Training</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="data-parallel"
                        checked={config.dataParallel}
                        onCheckedChange={(checked) => updateConfig('dataParallel', checked)}
                      />
                      <Label htmlFor="data-parallel">Data Parallel Training</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú cấu hình</Label>
                    <Textarea
                      id="notes"
                      value={config.notes}
                      onChange={(e) => updateConfig('notes', e.target.value)}
                      placeholder="Thêm ghi chú về cấu hình này..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>

        <div className="border-t p-6 flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Đặt lại
            </Button>
            <Button variant="outline" onClick={exportConfig}>
              <Download className="h-4 w-4 mr-2" />
              Xuất cấu hình
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Hủy</Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Lưu cấu hình
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
