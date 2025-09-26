"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  Database, 
  Cpu, 
  HardDrive, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  Square,
  Settings,
  FileText,
  Code,
  Users,
  BookOpen
} from "lucide-react"

// Hannah AI Training Pipeline với ChatRTX
export interface HannahTrainingPipeline {
  // Phase 1: Data Collection & Preparation
  data_collection: {
    se_curriculum: SECurriculumData
    student_interactions: StudentInteractionData
    faculty_knowledge: FacultyKnowledgeData
    code_repositories: CodeRepositoryData
  }
  
  // Phase 2: Data Processing & RAG Setup
  data_processing: {
    text_preprocessing: TextPreprocessingConfig
    vector_embedding: VectorEmbeddingConfig
    knowledge_indexing: KnowledgeIndexingConfig
    quality_validation: QualityValidationConfig
  }
  
  // Phase 3: ChatRTX Integration
  chatrtx_integration: {
    model_setup: ChatRTXModelConfig
    rag_configuration: RAGConfiguration
    fine_tuning_setup: FineTuningConfig
    local_deployment: LocalDeploymentConfig
  }
  
  // Phase 4: Training & Optimization
  training_process: {
    base_model_loading: ModelLoadingConfig
    knowledge_injection: KnowledgeInjectionConfig
    fine_tuning_execution: FineTuningExecution
    performance_monitoring: PerformanceMonitoring
  }
}

// Software Engineering Curriculum Data
export interface SECurriculumData {
  courses: {
    programming_fundamentals: CourseContent
    data_structures_algorithms: CourseContent
    software_engineering: CourseContent
    database_systems: CourseContent
    web_development: CourseContent
    mobile_development: CourseContent
    system_design: CourseContent
  }
  
  learning_paths: {
    beginner_path: string[]
    intermediate_path: string[]
    advanced_path: string[]
    specialization_paths: Record<string, string[]>
  }
  
  assessment_criteria: {
    coding_standards: CodingStandard[]
    project_rubrics: ProjectRubric[]
    knowledge_checkpoints: KnowledgeCheckpoint[]
  }
}

export interface CourseContent {
  course_id: string
  title: string
  description: string
  modules: Module[]
  assignments: Assignment[]
  projects: Project[]
  resources: Resource[]
}

export interface Module {
  module_id: string
  title: string
  description: string
  content: string
  learning_objectives: string[]
  duration_hours: number
  prerequisites: string[]
}

export interface Assignment {
  assignment_id: string
  title: string
  description: string
  type: "homework" | "lab" | "project" | "quiz"
  due_date: string
  instructions: string[]
  rubric: string
  max_points: number
}

export interface Project {
  project_id: string
  title: string
  description: string
  type: "individual" | "group"
  duration_weeks: number
  technologies: string[]
  deliverables: string[]
  evaluation_criteria: string[]
}

export interface Resource {
  resource_id: string
  title: string
  type: "document" | "video" | "link" | "code"
  url: string
  description: string
  tags: string[]
}

// Data Processing Interfaces
export interface TextPreprocessingConfig {
  remove_html: boolean
  normalize_unicode: boolean
  remove_special_chars: boolean
  lowercase: boolean
  remove_stopwords: boolean
  stemming: boolean
  min_length: number
  max_length: number
  language: "vi" | "en" | "auto"
}

export interface VectorEmbeddingConfig {
  model_name: string
  dimension: number
  batch_size: number
  max_sequence_length: number
  pooling_strategy: "mean" | "cls" | "max"
  normalize_embeddings: boolean
}

export interface KnowledgeIndexingConfig {
  index_type: "faiss" | "chroma" | "pinecone"
  similarity_metric: "cosine" | "euclidean" | "dot_product"
  chunk_size: number
  chunk_overlap: number
  index_name: string
  metadata_fields: string[]
}

export interface QualityValidationConfig {
  min_quality_score: number
  check_duplicates: boolean
  check_completeness: boolean
  check_consistency: boolean
  validation_rules: ValidationRule[]
}

export interface ValidationRule {
  rule_id: string
  name: string
  description: string
  severity: "error" | "warning" | "info"
  condition: string
}

// ChatRTX Integration Interfaces
export interface ChatRTXModelConfig {
  base_model: "mistral-7b" | "llama2-7b" | "llama2-13b"
  model_path: string
  device: "cuda" | "cpu"
  precision: "fp16" | "fp32" | "int8" | "int4"
  max_memory_gb: number
  context_length: number
}

export interface RAGConfiguration {
  retrieval_top_k: number
  similarity_threshold: number
  rerank_model?: string
  prompt_template: string
  context_window_size: number
  enable_conversation_memory: boolean
}

export interface FineTuningConfig {
  method: "lora" | "qlora" | "full"
  lora_rank: number
  lora_alpha: number
  lora_dropout: number
  target_modules: string[]
  learning_rate: number
  batch_size: number
  epochs: number
  warmup_steps: number
}

export interface LocalDeploymentConfig {
  port: number
  host: string
  enable_api: boolean
  enable_web_ui: boolean
  max_concurrent_requests: number
  timeout_seconds: number
  log_level: "debug" | "info" | "warning" | "error"
}

// Training Process Interfaces
export interface ModelLoadingConfig {
  model_source: "huggingface" | "local" | "nvidia"
  model_id: string
  cache_dir: string
  load_in_8bit: boolean
  load_in_4bit: boolean
  device_map: "auto" | "balanced" | "sequential"
}

export interface KnowledgeInjectionConfig {
  injection_method: "rag" | "fine_tuning" | "hybrid"
  knowledge_sources: string[]
  injection_ratio: number
  update_frequency: "real_time" | "batch" | "manual"
}

export interface FineTuningExecution {
  optimizer: "adamw" | "sgd" | "adafactor"
  scheduler: "linear" | "cosine" | "polynomial"
  gradient_accumulation_steps: number
  max_grad_norm: number
  save_steps: number
  eval_steps: number
  logging_steps: number
}

export interface PerformanceMonitoring {
  metrics: string[]
  log_interval: number
  save_checkpoints: boolean
  early_stopping_patience: number
  validation_split: number
  test_split: number
}

// RAG Configuration for SE Knowledge
export interface RAGConfiguration {
  // Vector Database Setup
  vector_store: {
    type: "chromadb" | "faiss" | "pinecone"
    embedding_model: "sentence-transformers/all-MiniLM-L6-v2"
    dimension: 384 | 768 | 1024
    similarity_metric: "cosine" | "euclidean" | "dot_product"
  }
  
  // Document Processing
  document_processing: {
    chunk_size: 512
    chunk_overlap: 50
    text_splitter: "recursive" | "semantic" | "sentence"
    metadata_extraction: boolean
  }
  
  // Retrieval Configuration
  retrieval: {
    max_retrieved_docs: 5
    similarity_threshold: 0.7
    rerank_model?: string
    hybrid_search: boolean // Combine semantic + keyword search
  }
  
  // Context Management
  context_management: {
    max_context_length: 3000 // Leave room for response
    context_compression: boolean
    relevance_filtering: boolean
  }
}

// Training Data Pipeline Component
export function HannahTrainingPipeline() {
  const [currentPhase, setCurrentPhase] = useState<string>("data_collection")
  const [pipelineStatus, setPipelineStatus] = useState<"idle" | "running" | "completed" | "error">("idle")
  const [progress, setProgress] = useState<Record<string, number>>({
    data_collection: 0,
    data_processing: 0,
    chatrtx_integration: 0,
    training_process: 0
  })

  const phases = [
    {
      id: "data_collection",
      title: "Thu thập dữ liệu SE",
      description: "Collect Software Engineering curriculum and student data",
      icon: Database,
      tasks: [
        "Import SE curriculum content",
        "Collect student Q&A history", 
        "Gather faculty knowledge base",
        "Extract code examples and projects"
      ]
    },
    {
      id: "data_processing", 
      title: "Xử lý dữ liệu",
      description: "Process and prepare data for training",
      icon: Cpu,
      tasks: [
        "Text preprocessing and cleaning",
        "Generate vector embeddings",
        "Build knowledge index",
        "Validate data quality"
      ]
    },
    {
      id: "chatrtx_integration",
      title: "Tích hợp ChatRTX",
      description: "Setup ChatRTX model and RAG system",
      icon: Brain,
      tasks: [
        "Load base model (Mistral/Llama)",
        "Configure RAG pipeline",
        "Setup vector database",
        "Test local inference"
      ]
    },
    {
      id: "training_process",
      title: "Huấn luyện mô hình",
      description: "Fine-tune model with SE knowledge",
      icon: Zap,
      tasks: [
        "Inject SE knowledge via RAG",
        "Fine-tune with LoRA/QLoRA",
        "Monitor training metrics",
        "Validate model performance"
      ]
    }
  ]

  const startPipeline = async () => {
    setPipelineStatus("running")
    
    for (const phase of phases) {
      setCurrentPhase(phase.id)
      
      // Simulate phase execution
      for (let i = 0; i <= 100; i += 10) {
        setProgress(prev => ({ ...prev, [phase.id]: i }))
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }
    
    setPipelineStatus("completed")
  }

  const getPhaseStatus = (phaseId: string) => {
    if (pipelineStatus === "idle") return "pending"
    if (currentPhase === phaseId && pipelineStatus === "running") return "running"
    if (progress[phaseId] === 100) return "completed"
    return "pending"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-2 w-2 bg-gray-300 rounded-full" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Hannah AI Training Pipeline
          </h1>
          <p className="text-muted-foreground">
            Training pipeline với NVIDIA ChatRTX cho Software Engineering Education
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={startPipeline} 
            disabled={pipelineStatus === "running"}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Bắt đầu Training
          </Button>
          {pipelineStatus === "running" && (
            <Button variant="outline" onClick={() => setPipelineStatus("idle")}>
              <Square className="h-4 w-4 mr-2" />
              Dừng
            </Button>
          )}
        </div>
      </div>

      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Training Pipeline Overview</CardTitle>
          <CardDescription>
            4 giai đoạn chính để training Hannah AI với ChatRTX
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div key={phase.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(getPhaseStatus(phase.id))}
                  <phase.icon className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{phase.title}</h4>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Progress value={progress[phase.id]} className="flex-1" />
                    <span className="text-sm font-medium">{progress[phase.id]}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {progress[phase.id] === 100 ? "Hoàn thành" : 
                     getPhaseStatus(phase.id) === "running" ? "Đang xử lý..." : "Chờ"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Phase Information */}
      <Tabs value={currentPhase} onValueChange={setCurrentPhase}>
        <TabsList className="grid w-full grid-cols-4">
          {phases.map(phase => (
            <TabsTrigger key={phase.id} value={phase.id} className="text-xs">
              {phase.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {phases.map(phase => (
          <TabsContent key={phase.id} value={phase.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <phase.icon className="h-5 w-5" />
                  {phase.title}
                </CardTitle>
                <CardDescription>{phase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium">Các bước thực hiện:</h4>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* System Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu hệ thống cho ChatRTX</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Hardware tối thiểu
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• RTX 4060 Ti (16GB VRAM)</li>
                <li>• 32GB RAM</li>
                <li>• 100GB storage</li>
                <li>• Windows 11</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Hardware khuyến nghị
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• RTX 4090 (24GB VRAM)</li>
                <li>• 64GB RAM</li>
                <li>• 500GB NVMe SSD</li>
                <li>• Intel i9 / AMD Ryzen 9</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Software requirements
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• CUDA 12.1+</li>
                <li>• Python 3.10+</li>
                <li>• PyTorch 2.0+</li>
                <li>• Transformers 4.35+</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
