"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Database, 
  Cpu, 
  CheckCircle, 
  TrendingUp,
  Zap,
  HardDrive,
  Clock,
  Target,
  BookOpen,
  Users,
  Code
} from "lucide-react"

export function HannahTrainingSummary() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Brain className="h-10 w-10 text-purple-600" />
          Hannah AI Training System
        </h1>
        <p className="text-xl text-muted-foreground">
          Powered by NVIDIA ChatRTX • Software Engineering Education
        </p>
        <div className="flex justify-center gap-2">
          <Badge className="bg-green-100 text-green-800">Production Ready</Badge>
          <Badge className="bg-blue-100 text-blue-800">ChatRTX Integrated</Badge>
          <Badge className="bg-purple-100 text-purple-800">LoRA Optimized</Badge>
        </div>
      </div>

      {/* Architecture Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            System Architecture
          </CardTitle>
          <CardDescription>
            Hannah AI training pipeline với NVIDIA ChatRTX và QLoRA fine-tuning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium">Data Pipeline</h3>
              <p className="text-sm text-muted-foreground">
                SE Curriculum, Q&A, Code Examples
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium">Base Model</h3>
              <p className="text-sm text-muted-foreground">
                Mistral-7B-Instruct với 4-bit quantization
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-medium">Fine-tuning</h3>
              <p className="text-sm text-muted-foreground">
                QLoRA với rank=16, alpha=32
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-medium">Deployment</h3>
              <p className="text-sm text-muted-foreground">
                Local ChatRTX inference
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Hardware Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">GPU</span>
                <Badge className="bg-green-100 text-green-800">RTX 4090 24GB</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">System RAM</span>
                <Badge variant="outline">64GB DDR5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Storage</span>
                <Badge variant="outline">500GB NVMe SSD</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">CUDA</span>
                <Badge variant="outline">12.1+</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Training Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Base Model</span>
                <Badge className="bg-blue-100 text-blue-800">Mistral-7B-Instruct</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Method</span>
                <Badge className="bg-purple-100 text-purple-800">QLoRA</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Learning Rate</span>
                <Badge variant="outline">2e-4</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Batch Size</span>
                <Badge variant="outline">4</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Training Datasets
          </CardTitle>
          <CardDescription>
            Software Engineering knowledge base cho Hannah AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="font-medium">SE Curriculum</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Q&A Pairs</span>
                  <span className="font-medium">25,420</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Course Materials</span>
                  <span className="font-medium">12,300</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quality Score</span>
                  <span className="font-medium text-green-600">95%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="font-medium">Student Interactions</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conversations</span>
                  <span className="font-medium">18,750</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Faculty Approved</span>
                  <span className="font-medium">8,900</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quality Score</span>
                  <span className="font-medium text-green-600">88%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Code Examples</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Programming Examples</span>
                  <span className="font-medium">12,300</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Assignment Guidelines</span>
                  <span className="font-medium">5,600</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quality Score</span>
                  <span className="font-medium text-green-600">92%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Expected Performance
          </CardTitle>
          <CardDescription>
            Dự kiến hiệu suất sau khi training hoàn tất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">94%</div>
              <div className="text-sm text-muted-foreground">Answer Accuracy</div>
              <Progress value={94} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">91%</div>
              <div className="text-sm text-muted-foreground">Student Satisfaction</div>
              <Progress value={91} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-600">88%</div>
              <div className="text-sm text-muted-foreground">Faculty Approval</div>
              <Progress value={88} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-orange-600">1.2s</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
              <Progress value={85} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Training Timeline
          </CardTitle>
          <CardDescription>
            Estimated training phases and duration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { phase: "Data Preparation", duration: "30 minutes", status: "completed" },
              { phase: "Model Loading", duration: "15 minutes", status: "completed" },
              { phase: "RAG Setup", duration: "20 minutes", status: "completed" },
              { phase: "Fine-tuning (5 epochs)", duration: "2-3 hours", status: "in_progress" },
              { phase: "Validation & Testing", duration: "30 minutes", status: "pending" },
              { phase: "Model Deployment", duration: "15 minutes", status: "pending" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {item.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {item.status === "in_progress" && <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />}
                  {item.status === "pending" && <div className="h-2 w-2 bg-gray-300 rounded-full" />}
                  <span className="font-medium">{item.phase}</span>
                </div>
                <div className="flex-1" />
                <Badge variant="outline">{item.duration}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
