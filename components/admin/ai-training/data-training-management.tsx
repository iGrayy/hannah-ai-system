"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Play, Database, GraduationCap, CheckCircle, Clock, FileText, MessageSquare, Eye, Search, Edit, AlertCircle, Filter, X } from "lucide-react"

// Dữ liệu mô phỏng đại diện cho các nguồn với nội dung chi tiết được tổ chức theo học kỳ và môn học
const dataSources = {
  knowledgeBase: {
    name: "Kho tri thức",
    count: 1250,
    id: "kb",
    type: "documents",
    description: "Tài liệu học tập theo kỳ và môn học",
    format: "Văn bản dạng tài liệu",
    semesters: [
      {
        id: "ky1-2024",
        name: "Kỳ 1 - 2024",
        subjects: [
          {
            id: "cntt101",
            name: "Nhập môn Công nghệ thông tin",
            code: "CNTT101",
            credits: 3,
            documentCount: 45,
            trainingStatus: "completed",
            lastTrained: "2024-01-15",
            accuracy: 95.2,
            documents: [
              {
                id: 1,
                title: "Bài 1: Giới thiệu về Khoa học máy tính",
                content: "Khoa học máy tính (Computer Science) là một ngành khoa học nghiên cứu về thuật toán, cấu trúc dữ liệu...",
                type: "bài giảng",
                lastUpdated: "2024-01-10"
              },
              {
                id: 2,
                title: "Bài 2: Lịch sử phát triển máy tính",
                content: "Máy tính đã trải qua nhiều thế hệ phát triển từ máy tính cơ học đến máy tính điện tử hiện đại...",
                type: "bài giảng",
                lastUpdated: "2024-01-12"
              }
            ]
          },
          {
            id: "toan101",
            name: "Toán rời rạc",
            code: "TOAN101",
            credits: 4,
            documentCount: 38,
            trainingStatus: "in_progress",
            progress: 65,
            documents: [
              {
                id: 3,
                title: "Chương 1: Logic mệnh đề",
                content: "Logic mệnh đề là nền tảng của toán học và khoa học máy tính...",
                type: "lý thuyết",
                lastUpdated: "2024-01-08"
              }
            ]
          },
          {
            id: "anh101",
            name: "Tiếng Anh chuyên ngành",
            code: "ANH101",
            credits: 2,
            documentCount: 25,
            trainingStatus: "not_started",
            documents: [
              {
                id: 4,
                title: "Bài 1: Cơ bản về máy tính",
                content: "Giới thiệu về thuật ngữ máy tính và các khái niệm cơ bản...",
                type: "từ vựng",
                lastUpdated: "2024-01-05"
              }
            ]
          }
        ]
      },
      {
        id: "ky2-2024",
        name: "Kỳ 2 - 2024",
        subjects: [
          {
            id: "ctdl201",
            name: "Cấu trúc dữ liệu và Giải thuật",
            code: "CTDL201",
            credits: 4,
            documentCount: 52,
            trainingStatus: "completed",
            lastTrained: "2024-02-20",
            accuracy: 92.8,
            documents: [
              {
                id: 5,
                title: "Chương 1: Mảng và Danh sách",
                content: "Cấu trúc dữ liệu cơ bản: Array, Linked List, Stack, Queue...",
                type: "lý thuyết",
                lastUpdated: "2024-02-15"
              }
            ]
          },
          {
            id: "oop201",
            name: "Lập trình hướng đối tượng",
            code: "OOP201",
            credits: 3,
            documentCount: 41,
            trainingStatus: "failed",
            lastTrained: "2024-02-25",
            accuracy: 78.5,
            errorMessage: "Độ chính xác thấp, cần bổ sung dữ liệu",
            documents: [
              {
                id: 6,
                title: "Chương 1: Khái niệm OOP",
                content: "Lập trình hướng đối tượng với 4 tính chất: Encapsulation, Inheritance, Polymorphism, Abstraction...",
                type: "lý thuyết",
                lastUpdated: "2024-02-18"
              }
            ]
          }
        ]
      }
    ]
  },
  facultyResponses: {
    name: "Phản hồi được duyệt",
    count: 890,
    id: "faculty",
    type: "qa_pairs",
    description: "Câu hỏi và trả lời từ giảng viên đã được can thiệp và sửa đổi",
    format: "Cặp Q&A đã được faculty chỉnh sửa",
    qaItems: [
      {
        id: 1,
        question: "Khoa học máy tính nghiên cứu về những gì?",
        answer: "Khoa học máy tính nghiên cứu về thuật toán, cấu trúc dữ liệu, thiết kế hệ thống, lập trình, và ứng dụng công nghệ thông tin trong các lĩnh vực khác nhau.",
        faculty: "TS. Nguyễn Văn A",
        approvedDate: "2024-01-15",
        editedBy: "TS. Nguyễn Văn A",
        editDate: "2024-01-16",
        originalQuestion: "Khoa học máy tính là gì?",
        trainingStatus: "completed"
      },
      {
        id: 2,
        question: "Sự khác biệt giữa phần cứng và phần mềm trong hệ thống máy tính?",
        answer: "Phần cứng là các thành phần vật lý có thể sờ được như CPU, RAM, ổ cứng, bo mạch chủ. Phần mềm là các chương trình, ứng dụng, hệ điều hành chạy trên phần cứng để thực hiện các tác vụ cụ thể.",
        faculty: "TS. Nguyễn Văn A",
        approvedDate: "2024-01-16",
        editedBy: "TS. Nguyễn Văn A",
        editDate: "2024-01-17",
        originalQuestion: "Phần cứng và phần mềm khác gì?",
        trainingStatus: "completed"
      },
      {
        id: 3,
        question: "Logic mệnh đề trong toán học rời rạc có vai trò như thế nào?",
        answer: "Logic mệnh đề là hệ thống logic nghiên cứu các mệnh đề (câu có thể đúng hoặc sai) và mối quan hệ giữa chúng thông qua các phép toán logic như AND, OR, NOT, IMPLIES. Đây là nền tảng cho lập trình và thiết kế mạch số.",
        faculty: "PGS. Lê Thị B",
        approvedDate: "2024-01-12",
        editedBy: "PGS. Lê Thị B",
        editDate: "2024-01-14",
        originalQuestion: "Logic mệnh đề là gì?",
        trainingStatus: "in_progress"
      },
      {
        id: 4,
        question: "Computer virus hoạt động như thế nào và cách phòng chống?",
        answer: "Computer virus là chương trình độc hại được thiết kế để tự sao chép và lây lan sang các máy tính khác, thường gây hại cho dữ liệu hoặc chức năng hệ thống. Phòng chống bằng cách sử dụng antivirus, cập nhật hệ điều hành, không mở file đáng nghi.",
        faculty: "ThS. Trần Văn C",
        approvedDate: "2024-01-10",
        editedBy: "ThS. Trần Văn C",
        editDate: "2024-01-12",
        originalQuestion: "What is a computer virus?",
        trainingStatus: "not_started"
      },
      {
        id: 5,
        question: "Sự khác biệt cơ bản giữa Stack và Queue trong cấu trúc dữ liệu?",
        answer: "Stack hoạt động theo nguyên tắc LIFO (Last In First Out) - phần tử cuối vào sẽ ra đầu tiên, thường dùng cho quản lý lời gọi hàm, undo operations. Queue hoạt động theo FIFO (First In First Out) - phần tử đầu vào sẽ ra đầu tiên, dùng cho scheduling, BFS algorithm.",
        faculty: "TS. Nguyễn Văn A",
        approvedDate: "2024-02-18",
        editedBy: "TS. Nguyễn Văn A",
        editDate: "2024-02-20",
        originalQuestion: "Stack và Queue khác gì?",
        trainingStatus: "completed"
      },
      {
        id: 6,
        question: "Binary Search Tree có những ưu điểm và nhược điểm gì?",
        answer: "BST cho phép tìm kiếm, chèn, xóa với độ phức tạp O(log n) trong trường hợp cây cân bằng. Duyệt inorder cho kết quả đã sắp xếp. Nhược điểm: có thể bị suy biến thành danh sách liên kết (O(n)) nếu dữ liệu đã sắp xếp.",
        faculty: "TS. Nguyễn Văn A",
        approvedDate: "2024-02-20",
        editedBy: "TS. Nguyễn Văn A",
        editDate: "2024-02-22",
        originalQuestion: "BST có ưu điểm gì?",
        trainingStatus: "completed"
      },
      {
        id: 7,
        question: "Tại sao nên sử dụng lập trình hướng đối tượng thay vì lập trình cấu trúc?",
        answer: "OOP mang lại nhiều lợi ích: tái sử dụng code thông qua inheritance, dễ bảo trì và debug nhờ encapsulation, tính linh hoạt cao với polymorphism, mô hình hóa thế giới thực tốt hơn, hỗ trợ làm việc nhóm hiệu quả hơn.",
        faculty: "ThS. Trần Thị B",
        approvedDate: "2024-02-22",
        editedBy: "ThS. Trần Thị B",
        editDate: "2024-02-24",
        originalQuestion: "Tại sao cần OOP?",
        trainingStatus: "failed",
        errorMessage: "Cần bổ sung ví dụ cụ thể về Polymorphism"
      }
    ]
  },
}

export function DataTrainingManagement() {
  const [selectedSources, setSelectedSources] = useState({ kb: true, faculty: true })
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedQAs, setSelectedQAs] = useState<string[]>([])
  const [expandedSemesters, setExpandedSemesters] = useState<string[]>(["ky1-2024"])
  const [trainingStatus, setTrainingStatus] = useState("idle") // idle, running, completed
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("knowledge")
  const [knowledgeFilter, setKnowledgeFilter] = useState("all")
  const [qaFilter, setQaFilter] = useState("all")

  const handleSourceChange = (sourceId: string) => {
    setSelectedSources(prev => ({
      ...prev,
      [sourceId]: !prev[sourceId],
    }))
  }

  const toggleSemester = (semesterId: string) => {
    setExpandedSemesters(prev =>
      prev.includes(semesterId)
        ? prev.filter(id => id !== semesterId)
        : [...prev, semesterId]
    )
  }

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    )
  }

  const handleQAChange = (qaId: string) => {
    setSelectedQAs(prev =>
      prev.includes(qaId)
        ? prev.filter(id => id !== qaId)
        : [...prev, qaId]
    )
  }

  const handleTrainSubject = (subjectId: string) => {
    // Mô phỏng training cho môn học cụ thể
    console.log(`Đang training môn học: ${subjectId}`)
  }

  const handleTrainQA = (qaId: string) => {
    console.log("Đang training Q&A:", qaId)
    // Triển khai logic training Q&A
  }

  const handleStartTraining = () => {
    setTrainingStatus("running")
    setProgress(0)

    // Mô phỏng tiến trình training
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTrainingStatus("completed")
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Quản lý Huấn luyện Dữ liệu
          </h1>
          <p className="text-muted-foreground">Tinh chỉnh Hannah AI với dữ liệu giáo dục được tuyển chọn.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Cấu hình */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bước 1: Chọn nguồn dữ liệu */}
          <Card>
            <CardHeader>
              <CardTitle>Bước 1: Chọn nguồn dữ liệu</CardTitle>
              <CardDescription>Chọn dữ liệu sẽ được sử dụng để tinh chỉnh mô hình.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Nguồn Kho tri thức - Được tổ chức theo Học kỳ và Môn học */}
              <div className="border rounded-lg">
                <div className="flex items-center p-4 bg-blue-50">
                  <Checkbox
                    id="kb"
                    checked={selectedSources.kb}
                    onCheckedChange={() => handleSourceChange("kb")}
                    className="mr-4"
                  />
                  <Database className="h-6 w-6 mr-4 text-blue-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Label htmlFor="kb" className="font-medium text-lg">{dataSources.knowledgeBase.name}</Label>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Tài liệu
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{dataSources.knowledgeBase.description}</p>
                  </div>
                </div>

<<<<<<< HEAD
                {/* Hiển thị Học kỳ và Môn học */}
                {selectedSources.kb && (
                  <div className="p-4 space-y-4">
                    {dataSources.knowledgeBase.semesters.map((semester) => (
                      <div key={semester.id} className="border rounded-lg bg-gray-50">
                        <div
=======
                {/* Tab Navigation for Data Sources */}
                <div className="border-t">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="knowledge" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Kho tri thức
                      </TabsTrigger>
                      <TabsTrigger value="qa" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Phản hồi được duyệt
                      </TabsTrigger>
                    </TabsList>

                    {/* Knowledge Base Tab */}
                    <TabsContent value="knowledge" className="mt-4">
                      <div className="space-y-4">
                        {/* Filter for Knowledge Base */}
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <Filter className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Lọc theo trạng thái:</span>
                          <Select value={knowledgeFilter} onValueChange={setKnowledgeFilter}>
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tất cả</SelectItem>
                              <SelectItem value="completed">Đã training</SelectItem>
                              <SelectItem value="not_trained">Chưa training</SelectItem>
                              <SelectItem value="in_progress">Đang training</SelectItem>
                              <SelectItem value="failed">Thất bại</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Semester and Subject Display */}
                        {selectedSources.kb && (
                          <div className="space-y-4">
                            {dataSources.knowledgeBase.semesters.map((semester) => (
                              <div key={semester.id} className="border rounded-lg bg-gray-50">
                                <div
>>>>>>> 059ae12a92637655541c03a18e9207d86b3a8aae
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100"
                          onClick={() => toggleSemester(semester.id)}
                        >
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">{semester.name}</span>
                            <Badge variant="outline">{semester.subjects.length} môn</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {expandedSemesters.includes(semester.id) ? "Thu gọn" : "Mở rộng"}
                          </div>
                        </div>

                        {expandedSemesters.includes(semester.id) && (
                          <div className="p-3 space-y-3 bg-white">
                            {semester.subjects.map((subject) => (
                              <SubjectTrainingCard
                                key={subject.id}
                                subject={subject}
                                isSelected={selectedSubjects.includes(subject.id)}
                                onSelect={() => handleSubjectChange(subject.id)}
                                onTrain={() => handleTrainSubject(subject.id)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                      </div>
                    </TabsContent>

<<<<<<< HEAD
              {/* Nguồn Phản hồi Giảng viên - Hiển thị Q&A đơn giản */}
              <div className="border rounded-lg">
                <div className="flex items-center p-4 bg-green-50">
                  <Checkbox
                    id="faculty"
                    checked={selectedSources.faculty}
                    onCheckedChange={() => handleSourceChange("faculty")}
                    className="mr-4"
                  />
                  <MessageSquare className="h-6 w-6 mr-4 text-green-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Label htmlFor="faculty" className="font-medium text-lg">{dataSources.facultyResponses.name}</Label>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Q&A
                      </Badge>
                      <Badge variant="outline">{dataSources.facultyResponses.qaItems.length} câu hỏi</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{dataSources.facultyResponses.description}</p>
                  </div>
                </div>

                {/* Hiển thị Q&A trực tiếp cho Phản hồi Giảng viên */}
                {selectedSources.faculty && (
                  <div className="p-4 space-y-3">
                    {dataSources.facultyResponses.qaItems.map((qa) => (
                      <FacultyQACard
                        key={qa.id}
                        qa={qa}
                        isSelected={selectedQAs.includes(qa.id)}
                        onSelect={() => handleQAChange(qa.id)}
                        onTrain={() => handleTrainQA(qa.id)}
=======
                    {/* Faculty Q&A Tab */}
                    <TabsContent value="qa" className="mt-4">
                      <div className="space-y-4">
                        {/* Filter for Q&A */}
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <Filter className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Lọc theo trạng thái:</span>
                          <Select value={qaFilter} onValueChange={setQaFilter}>
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tất cả</SelectItem>
                              <SelectItem value="completed">Đã training</SelectItem>
                              <SelectItem value="not_trained">Chưa training</SelectItem>
                              <SelectItem value="in_progress">Đang training</SelectItem>
                              <SelectItem value="failed">Thất bại</SelectItem>
                            </SelectContent>
                          </Select>
                          {qaFilter !== "all" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setQaFilter("all")}
                              className="h-8 px-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        {/* Faculty Q&A Display */}
                        {selectedSources.faculty && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-3">
                              <MessageSquare className="h-5 w-5 text-green-500" />
                              <span className="font-medium text-lg">{dataSources.facultyResponses.name}</span>
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Q&A
                              </Badge>
                              <Badge variant="outline">
                                {dataSources.facultyResponses.qaItems.filter(qa => {
                                  if (qaFilter === "all") return true;
                                  if (qaFilter === "not_trained") return !qa.trainingStatus || qa.trainingStatus === "not_trained";
                                  return qa.trainingStatus === qaFilter;
                                }).length} / {dataSources.facultyResponses.qaItems.length} câu hỏi
                              </Badge>
                            </div>

                            {dataSources.facultyResponses.qaItems
                              .filter(qa => {
                                if (qaFilter === "all") return true;
                                if (qaFilter === "not_trained") return !qa.trainingStatus || qa.trainingStatus === "not_trained";
                                return qa.trainingStatus === qaFilter;
                              })
                              .map((qa) => (
                                <FacultyQACard
                                  key={qa.id}
                                  qa={qa}
                                  isSelected={selectedQAs.includes(qa.id)}
                                  onSelect={() => handleQAChange(qa.id)}
                                  onTrain={() => handleTrainQA(qa.id)}
>>>>>>> 059ae12a92637655541c03a18e9207d86b3a8aae
                      />
                              ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bước 2: Cấu hình Mô hình */}
          <Card>
            <CardHeader>
              <CardTitle>Bước 2: Cấu hình tham số mô hình</CardTitle>
              <CardDescription>Thiết lập các tham số cơ bản cho quá trình tinh chỉnh.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base-model">Mô hình gốc</Label>
                <Select defaultValue="chatrtx-mistral">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chatrtx-mistral">ChatRTX (Mistral-7B)</SelectItem>
                    <SelectItem value="gpt-4">GPT-4 (API)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="epochs">Số vòng huấn luyện</Label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 (Nhanh)</SelectItem>
                    <SelectItem value="5">5 (Cân bằng)</SelectItem>
                    <SelectItem value="10">10 (Kỹ lưỡng)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cột phải: Điều khiển Huấn luyện */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bước 3: Bắt đầu Huấn luyện</CardTitle>
              <CardDescription>Khởi động quá trình tinh chỉnh với dữ liệu và cấu hình đã chọn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trainingStatus === "idle" && (
                <Alert>
                  <AlertTitle>Sẵn sàng bắt đầu</AlertTitle>
                  <AlertDescription>Hệ thống đã sẵn sàng để bắt đầu quá trình huấn luyện.</AlertDescription>
                </Alert>
              )}

              {trainingStatus === "running" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Đang huấn luyện</Label>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {trainingStatus === "completed" && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Huấn luyện hoàn thành</AlertTitle>
                  <AlertDescription className="text-green-700">Mô hình đã được tinh chỉnh thành công.</AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                onClick={handleStartTraining}
                disabled={trainingStatus === 'running' || (!selectedSources.kb && !selectedSources.faculty)}
              >
                <Play className="h-4 w-4 mr-2" />
                {trainingStatus === 'running' ? 'Đang tinh chỉnh...' : 'Bắt đầu tinh chỉnh'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>



    </div>
  )
}



// Component cho thẻ Q&A của Giảng viên
function FacultyQACard({ qa, isSelected, onSelect, onTrain }: {
  qa: any
  isSelected: boolean
  onSelect: () => void
  onTrain: () => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'failed': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Đã huấn luyện'
      case 'in_progress': return 'Đang huấn luyện'
      case 'failed': return 'Huấn luyện thất bại'
      default: return 'Chưa huấn luyện'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      case 'failed': return <AlertCircle className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white hover:bg-gray-50">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className="mt-1"
        />

        <div className="flex-1 space-y-3">
          {/* Question */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Câu hỏi đã chỉnh sửa:</span>
            </div>
            <p className="text-sm font-medium text-gray-900 bg-blue-50 p-3 rounded-lg">
              {qa.question}
            </p>
            {qa.originalQuestion && (
              <p className="text-xs text-gray-500 mt-1 italic">
                Câu hỏi gốc: "{qa.originalQuestion}"
              </p>
            )}
          </div>

          {/* Câu trả lời */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">Trả lời:</span>
            </div>
            <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
              {qa.answer}
            </p>
          </div>

          {/* Thông tin Giảng viên và Chỉnh sửa */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Giảng viên: {qa.faculty}</span>
              <span>Chỉnh sửa bởi: {qa.editedBy}</span>
              <span>Ngày sửa: {qa.editDate}</span>
            </div>

            {/* Trạng thái Huấn luyện */}
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(qa.trainingStatus)}`}>
              {getStatusIcon(qa.trainingStatus)}
              {getStatusText(qa.trainingStatus)}
            </div>
          </div>

          {/* Thông báo Lỗi */}
          {qa.errorMessage && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              {qa.errorMessage}
            </div>
          )}
        </div>

        {/* Nút Hành động */}
        <div className="flex flex-col gap-2">
          {qa.trainingStatus !== 'in_progress' && (
            <Button
              variant={qa.trainingStatus === 'failed' ? 'default' : 'outline'}
              size="sm"
              onClick={onTrain}
            >
              <Brain className="h-3 w-3 mr-1" />
              {qa.trainingStatus === 'failed' ? 'Huấn luyện lại' : 'Huấn luyện'}
            </Button>
          )}

          <Button variant="ghost" size="sm">
            <Edit className="h-3 w-3 mr-1" />
            Sửa
          </Button>
        </div>
      </div>
    </div>
  )
}

// Component cho thẻ huấn luyện môn học
function SubjectTrainingCard({ subject, isSelected, onSelect, onTrain }: {
  subject: any
  isSelected: boolean
  onSelect: () => void
  onTrain: () => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'failed': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành'
      case 'in_progress': return 'Đang huấn luyện'
      case 'failed': return 'Thất bại'
      default: return 'Chưa huấn luyện'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      case 'failed': return <MessageSquare className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">{subject.name}</h4>
              <Badge variant="outline" className="text-xs">
                {subject.code} • {subject.credits} tín chỉ
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {subject.documentCount} tài liệu
              </span>
            </div>

            {/* Trạng thái Huấn luyện */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(subject.trainingStatus)}`}>
              {getStatusIcon(subject.trainingStatus)}
              {getStatusText(subject.trainingStatus)}
              {subject.trainingStatus === 'completed' && subject.accuracy && (
                <span className="ml-1">• {subject.accuracy}%</span>
              )}
              {subject.trainingStatus === 'in_progress' && subject.progress && (
                <span className="ml-1">• {subject.progress}%</span>
              )}
            </div>

            {/* Thông tin Bổ sung */}
            {subject.lastTrained && (
              <div className="text-xs text-muted-foreground mt-2">
                Lần cuối: {subject.lastTrained}
              </div>
            )}

            {subject.errorMessage && (
              <div className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">
                {subject.errorMessage}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          {subject.trainingStatus !== 'in_progress' && (
            <Button
              variant={subject.trainingStatus === 'failed' ? 'default' : 'outline'}
              size="sm"
              onClick={onTrain}
            >
              <Brain className="h-3 w-3 mr-1" />
              {subject.trainingStatus === 'failed' ? 'Huấn luyện lại' : 'Huấn luyện'}
            </Button>
          )}

          <Button variant="ghost" size="sm">
            <Eye className="h-3 w-3 mr-1" />
            Xem
          </Button>
        </div>
      </div>
    </div>
  )
}

// Component cho mục nguồn dữ liệu riêng lẻ
function DataSourceItem({ source, checked, onCheckedChange, onViewDetails }: {
  source: any
  checked: boolean
  onCheckedChange: () => void
  onViewDetails: () => void
}) {
  const Icon = source.id === "kb" ? Database : GraduationCap
  const iconColor = source.id === "kb" ? "text-blue-500" : "text-green-500"
  const TypeIcon = source.type === "documents" ? FileText : MessageSquare

  return (
    <div className="border rounded-lg">
      <div className="flex items-center p-4">
        <Checkbox id={source.id} checked={checked} onCheckedChange={onCheckedChange} className="mr-4" />
        <Icon className={`h-6 w-6 mr-4 ${iconColor}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Label htmlFor={source.id} className="font-medium">{source.name}</Label>
            <Badge variant="secondary" className="flex items-center gap-1">
              <TypeIcon className="h-3 w-3" />
              {source.type === "documents" ? "Tài liệu" : "Q&A"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {source.count} {source.type === "documents" ? "bài viết" : "cặp Q&A"} • {source.description}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Định dạng: {source.format}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onViewDetails} className="ml-2">
          <Eye className="h-4 w-4 mr-1" />
          Xem chi tiết
        </Button>
      </div>
    </div>
  )
}