"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpenCheck, CheckCircle2, Lock, MessageSquare, PlayCircle, Sparkles } from "lucide-react"
import { IntroductionContent } from "./introduction-content"
import { PDFModal } from "@/components/ui/pdf-modal"

type QuizQuestion = {
  id: string
  type: "mcq" | "short"
  question: string
  options?: string[]
}

type Chapter = {
  id: string
  title: string
  summary: string
  sections: {
    id: string
    title: string
    type: "document" | "quiz"
    completed: boolean
    locked: boolean
  }[]
  quiz: QuizQuestion[]
}

export interface LearningChatProps {
  subject: string
  topicId: string
  topicTitle: string
  onExit?: () => void
}

const mockChapters: Chapter[] = [
  {
    id: "c1",
    title: "Giới thiệu khái niệm nền tảng",
    summary: "Ôn nhanh các khái niệm cốt lõi, ví dụ trực quan và các lỗi thường gặp.",
    sections: [
      { id: "c1-doc", title: "Tài liệu học tập", type: "document", completed: false, locked: false },
      { id: "c1-quiz", title: "Kiểm tra kiến thức", type: "quiz", completed: false, locked: true }
    ],
    quiz: [
      { id: "q1", type: "mcq", question: "Khái niệm A là gì?", options: ["Định nghĩa 1", "Định nghĩa 2", "Định nghĩa 3", "Định nghĩa 4"] },
      { id: "q2", type: "short", question: "Hãy nêu một ví dụ thực tế cho khái niệm A." },
      { id: "q3", type: "mcq", question: "Chọn phát biểu đúng về A", options: ["Đúng 1", "Đúng 2", "Sai 1", "Sai 2"] },
    ],
  },
  {
    id: "c2",
    title: "Ứng dụng vào tình huống",
    summary: "Áp dụng vào bài tập nhỏ theo năng lực hiện tại. Có gợi ý từng bước nếu cần.",
    sections: [
      { id: "c2-doc", title: "Tài liệu học tập", type: "document", completed: false, locked: true },
      { id: "c2-quiz", title: "Kiểm tra kiến thức", type: "quiz", completed: false, locked: true }
    ],
    quiz: [
      { id: "q1", type: "mcq", question: "Tình huống nào phù hợp nhất để dùng A?", options: ["TH1", "TH2", "TH3", "TH4"] },
      { id: "q2", type: "short", question: "Tóm tắt quy trình giải một bài toán dùng A." },
      { id: "q3", type: "mcq", question: "Bước nào KHÔNG thuộc quy trình?", options: ["B1", "B2", "B3", "B4"] },
    ],
  },
  {
    id: "c3",
    title: "Nâng cao & mở rộng",
    summary: "Mở rộng kiến thức, lưu ý hiệu năng/ngoại lệ, và liên hệ với chủ đề kế tiếp.",
    sections: [
      { id: "c3-doc", title: "Tài liệu học tập", type: "document", completed: false, locked: true },
      { id: "c3-quiz", title: "Kiểm tra kiến thức", type: "quiz", completed: false, locked: true }
    ],
    quiz: [
      { id: "q1", type: "mcq", question: "Phát biểu nào đúng về tối ưu?", options: ["A", "B", "C", "D"] },
      { id: "q2", type: "short", question: "Nêu hai rủi ro khi áp dụng sai ngữ cảnh." },
      { id: "q3", type: "mcq", question: "Chọn cách kiểm chứng kết quả", options: ["X", "Y", "Z", "W"] },
    ],
  },
]

export function LearningChat({ subject, topicId, topicTitle, onExit }: LearningChatProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [activeSection, setActiveSection] = useState<string>("c1-doc")
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(["c1"]))
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({})
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizScore, setQuizScore] = useState<number | null>(null)
  // Middle panel is now a structured lesson content instead of chat
  const [qaMessages, setQaMessages] = useState<{ sender: "ai" | "user"; content: string }[]>([])
  const [qaInput, setQaInput] = useState("")
  const [qaTyping, setQaTyping] = useState(false)
  const [isPdfOpen, setIsPdfOpen] = useState(false)

  const chapters = mockChapters
  const currentChapter = chapters[activeChapterIndex]

  const progressPercent = useMemo(() => {
    const totalSections = chapters.reduce((acc, chapter) => acc + chapter.sections.length, 0)
    const completedCount = Object.keys(completedSections).filter(id => completedSections[id]).length
    return Math.round((completedCount / totalSections) * 100)
  }, [completedSections, chapters])

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId)
      } else {
        newSet.add(chapterId)
      }
      return newSet
    })
  }

  const handleSectionClick = (sectionId: string, chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId)
    const section = chapter?.sections.find(s => s.id === sectionId)
    const isCompleted = completedSections[sectionId]
    
    if (section && (!section.locked || isCompleted)) {
      setActiveSection(sectionId)
      setActiveChapterIndex(chapters.findIndex(c => c.id === chapterId))
      // Reset quiz score when switching sections
      setQuizScore(null)
    }
  }

  const handleCompleteSection = (sectionId: string) => {
    setCompletedSections(prev => ({ ...prev, [sectionId]: true }))
    
    // If completing document section, automatically switch to quiz section
    const currentChapter = chapters[activeChapterIndex]
    const currentSection = currentChapter.sections.find(s => s.id === sectionId)
    
    if (currentSection?.type === 'document') {
      // Find the quiz section in the same chapter
      const quizSection = currentChapter.sections.find(s => s.type === 'quiz')
      if (quizSection) {
        // Unlock quiz section
        const updatedChapters = chapters.map(chapter => ({
          ...chapter,
          sections: chapter.sections.map(section => 
            section.id === quizSection.id ? { ...section, locked: false } : section
          )
        }))
        
        // Switch to quiz section
        setActiveSection(quizSection.id)
      }
    }
  }

  const handleSubmitQA = () => {
    if (!qaInput.trim()) return
    const msg = { sender: "user" as const, content: qaInput.trim() }
    setQaMessages((prev) => [...prev, msg])
    setQaInput("")
    setQaTyping(true)
    setTimeout(() => {
      setQaMessages((prev) => [
        ...prev,
        { sender: "ai", content: "Giải đáp tự do: Đây là câu trả lời độc lập, không ảnh hưởng lộ trình." },
      ])
      setQaTyping(false)
    }, 700)
  }

  const handleSubmitQuiz = () => {
    // Mock chấm điểm: tính điểm theo số câu trả lời không rỗng
    const answered = currentChapter.quiz.filter((q) => !!quizAnswers[`${currentChapter.id}:${q.id}`])
    const score = Math.round((answered.length / currentChapter.quiz.length) * 100)
    setQuizScore(score)
    
    // If score >= 80%, unlock next chapter
    if (score >= 80) {
      handleQuizPassed()
    }
  }

  const handleQuizPassed = () => {
    // Mark quiz section as completed
    const currentSection = chapters[activeChapterIndex]?.sections.find(s => s.id === activeSection)
    if (currentSection) {
      setCompletedSections(prev => ({ ...prev, [currentSection.id]: true }))
    }
    
    // Auto advance to next chapter if available
    const nextChapterIndex = activeChapterIndex + 1
    if (nextChapterIndex < chapters.length) {
      const nextChapter = chapters[nextChapterIndex]
      if (nextChapter.sections.length > 0) {
        const firstSection = nextChapter.sections[0]
        
        // Unlock first section of next chapter
        const updatedChapters = chapters.map((chapter, index) => {
          if (index === nextChapterIndex) {
            return {
              ...chapter,
              sections: chapter.sections.map(section => 
                section.id === firstSection.id ? { ...section, locked: false } : section
              )
            }
          }
          return chapter
        })
        
        // Auto switch to next chapter's first section
        setTimeout(() => {
          setActiveChapterIndex(nextChapterIndex)
          setActiveSection(firstSection.id)
          setQuizScore(null) // Reset quiz score for new chapter
          setQuizAnswers({}) // Clear previous answers
          
          // Expand the next chapter in the sidebar
          setExpandedChapters(prev => new Set([...prev, nextChapter.id]))
        }, 1500) // Small delay to show success message
      } else {
        // No more chapters - course completed
        setTimeout(() => {
          setQuizScore(null)
          setQuizAnswers({})
        }, 2000)
      }
    }
  }

  const chapterContentMap: Record<string, {
    objectives: string[]
    sections: { title: string; content: string }[]
    keypoints: string[]
    exercises: string[]
  }> = {
    c1: {
      objectives: [
        "Hiểu định nghĩa và vai trò của khái niệm A",
        "Nhận diện lỗi thường gặp và cách tránh",
        "Áp dụng A vào ví dụ cơ bản",
      ],
      sections: [
        { title: "1. Động cơ và bối cảnh", content: "Tại sao cần A? Các tình huống xuất hiện trong thực tế học và làm bài." },
        { title: "2. Định nghĩa cốt lõi", content: "Diễn giải đơn giản + biểu đồ tư duy để ghi nhớ nhanh. Gắn với dữ liệu/đầu vào/đầu ra." },
        { title: "3. Lỗi thường gặp", content: "Phân tích 3 lỗi phổ biến, biểu hiện và cách sửa. Nêu ví dụ đối chiếu." },
      ],
      keypoints: ["A giúp đơn giản hóa bước X", "Cần chú ý điều kiện tiền đề", "Ưu/nhược so với phương án B"],
      exercises: ["Điền khuyết định nghĩa A", "Phân loại 5 ví dụ: có/không phải A", "Sửa lỗi cho đoạn mô tả sai"],
    },
    c2: {
      objectives: [
        "Biết chọn tình huống áp dụng A", 
        "Thực hành quy trình chuẩn 4 bước", 
        "Đánh giá kết quả"
      ],
      sections: [
        { title: "1. Khung quy trình", content: "Mô tả 4 bước áp dụng A từ phân tích đến kiểm chứng." },
        { title: "2. Ví dụ hướng dẫn", content: "Bài làm mẫu theo từng bước, có ghi chú quyết định quan trọng." },
        { title: "3. Biến thể & mẹo", content: "Các biến thể khi dữ liệu thiếu, mẹo tối giản để thi/kiểm tra." },
      ],
      keypoints: ["Chọn dữ liệu đầu vào đúng trọng tâm", "Theo dõi giả định", "Kiểm chứng bằng tiêu chí R"],
      exercises: ["Áp dụng quy trình cho case study ngắn", "Nhận xét kết quả: đạt/chưa đạt?", "Đề xuất cải tiến"],
    },
    c3: {
      objectives: [
        "Hiểu mở rộng của A", 
        "Nhận rủi ro khi lạm dụng", 
        "Liên hệ chủ đề kế tiếp"
      ],
      sections: [
        { title: "1. Tối ưu & hiệu năng", content: "Phân tích độ phức tạp/chi phí; khi nào tối ưu mang lại hiệu quả." },
        { title: "2. Trường hợp biên", content: "Các ngoại lệ và cách phòng tránh khi dữ liệu không chuẩn." },
        { title: "3. Kết nối kiến thức", content: "A liên hệ B/C như thế nào? Lộ trình học tiếp theo." },
      ],
      keypoints: ["Không tối ưu quá sớm", "Theo dõi metric cụ thể", "Hệ quả khi vi phạm giả định"],
      exercises: ["Tối ưu phương án ban đầu", "Nêu rủi ro và biện pháp", "Chuẩn bị cho chủ đề tiếp theo"],
    },
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="w-full flex items-center justify-between">
          <div>
             <h2 className="text-xl font-semibold text-gray-900">Môn học: JavaScript</h2>
          </div>
          <div className="flex items-center gap-2">
            {onExit && (
              <Button variant="outline" size="sm" onClick={onExit}>Quay lại</Button>
            )}
          </div>
        </div>
      </div>

      {/* 3 Columns */}
      <div className="flex-1 grid grid-cols-12 auto-rows-fr gap-4 p-4 w-full">
        {/* Left: Roadmap */}
        <div className="col-span-12 lg:col-span-3 h-full">
          <Card className="h-[calc(100vh-220px)] overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">Lộ trình học</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="mb-4">
                <Progress value={progressPercent} />
                <p className="text-xs text-gray-500 mt-1">Hoàn thành {progressPercent}%</p>
              </div>
              <div className="space-y-1">
                {chapters.map((ch, idx) => {
                  const isExpanded = expandedChapters.has(ch.id)
                  const chapterCompleted = ch.sections.every(section => completedSections[section.id])
                  
                  return (
                    <div key={ch.id} className="border rounded-lg">
                      {/* Chapter Header */}
                      <button
                        className="w-full p-3 text-left hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => toggleChapter(ch.id)}
                      >
                         <div className="flex items-center gap-2">
                           <Checkbox checked={chapterCompleted} disabled className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                           <div>
                             <div className="flex items-center gap-2">
                               <span className="text-sm font-medium">Chương {idx + 1}: {ch.title}</span>
                             </div>
                             <p className="text-xs text-gray-500 mt-1">{ch.summary}</p>
                           </div>
                         </div>
                        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {/* Chapter Sections */}
                      {isExpanded && (
                        <div className="border-t bg-gray-50">
                          {ch.sections.map((section) => {
                            const isActive = activeSection === section.id
                            const isCompleted = completedSections[section.id]
                            
                            return (
                               <button
                                 key={section.id}
                                 className={`w-full p-3 text-left hover:bg-gray-100 flex items-center gap-3 ${
                                   isActive ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                 } ${section.locked && !isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                 onClick={() => handleSectionClick(section.id, ch.id)}
                                 disabled={section.locked && !isCompleted}
                               >
                                 <div className="flex items-center gap-2">
                                   {section.locked && !isCompleted ? (
                                     <Lock className="h-4 w-4 text-gray-400" />
                                   ) : section.type === 'document' ? (
                                     <BookOpenCheck className="h-4 w-4 text-blue-600" />
                                   ) : (
                                     <CheckCircle2 className="h-4 w-4 text-green-600" />
                                   )}
                                   <span className={`text-sm ${section.locked && !isCompleted ? 'text-gray-400' : ''}`}>
                                     {section.title}
                                   </span>
                                   {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                                 </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

         {/* Middle: Document/Quiz Content */}
         <div className="col-span-12 lg:col-span-6 h-full">
          <Card className="h-[calc(100vh-220px)] flex flex-col overflow-hidden">
            <CardHeader className="border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {(() => {
                      const currentSection = chapters[activeChapterIndex]?.sections.find(s => s.id === activeSection)
                      return currentSection ? currentSection.title : "Chọn một mục để bắt đầu"
                    })()}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-4 overflow-hidden">
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-4 pr-4 pb-4">
                  {(() => {
                    const currentSection = chapters[activeChapterIndex]?.sections.find(s => s.id === activeSection)
                    
                    if (!currentSection) {
                      return (
                        <div className="flex items-center justify-center text-gray-500 min-h-[400px]">
                          <div className="text-center">
                            <BookOpenCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>Chọn một mục từ lộ trình học để bắt đầu</p>
                          </div>
                        </div>
                      )
                    }

                    if (currentSection.type === 'document') {
                      return (
                        <div className="space-y-4">
                          <div className="flex justify-end">
                            <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setIsPdfOpen(true)}>
                              Xem tài liệu
                            </Button>
                          </div>
                          {/* Introduction Content */}
                          <IntroductionContent />
                          
                          {/* Complete Button */}
                          <div className="pt-4 border-t">
                            <Button 
                              className="w-full"
                              onClick={() => handleCompleteSection(currentSection.id)}
                            >
                              Hoàn thành
                            </Button>
                          </div>
                        </div>
                      )
                } else {
                  // Quiz content
                  return (
                    <div className="space-y-4">
                      <div className="rounded border p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">Quiz kiểm tra</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">3-5 câu</Badge>
                            <Badge variant="secondary" className="text-xs">Yêu cầu: ≥80%</Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {currentChapter.quiz.map((q) => (
                            <div key={q.id} className="space-y-1">
                              <p className="text-sm font-medium">{q.question}</p>
                              {q.type === 'mcq' ? (
                                <div className="grid grid-cols-2 gap-2">
                                  {q.options?.map((op, idx) => (
                                    <Button
                                      key={idx}
                                      variant={quizAnswers[`${currentChapter.id}:${q.id}`] === op ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => setQuizAnswers((prev) => ({ ...prev, [`${currentChapter.id}:${q.id}`]: op }))}
                                    >
                                      {op}
                                    </Button>
                                  ))}
                                </div>
                              ) : (
                                <Input
                                  placeholder="Nhập câu trả lời ngắn"
                                  value={quizAnswers[`${currentChapter.id}:${q.id}`] || ''}
                                  onChange={(e) => setQuizAnswers((prev) => ({ ...prev, [`${currentChapter.id}:${q.id}`]: e.target.value }))}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={handleSubmitQuiz}>
                            <PlayCircle className="h-4 w-4 mr-1" />Nộp bài
                          </Button>
                          {quizScore !== null && (
                            <Badge className={quizScore >= 80 ? 'bg-green-600' : 'bg-red-600'}>
                              Điểm: {quizScore}%
                            </Badge>
                          )}
                        </div>
                        {quizScore !== null && (
                          <div className="mt-2 space-y-2">
                            {quizScore >= 80 ? (
                              <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                                <p className="text-green-800 font-medium">🎉 Chúc mừng! Bạn đã đạt yêu cầu!</p>
                                <p className="text-green-700 text-xs mt-1">
                                  {activeChapterIndex < chapters.length - 1 
                                    ? "Đang chuyển sang chương tiếp theo..." 
                                    : "Bạn đã hoàn thành tất cả các chương!"}
                                </p>
                              </div>
                            ) : (
                              <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                                <p className="text-red-800 font-medium">❌ Chưa đạt yêu cầu (cần ≥80%)</p>
                                <p className="text-red-700 text-xs mt-1">Vui lòng ôn tập lại và thử lại.</p>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="mt-2 text-xs"
                                  onClick={() => {
                                    setQuizScore(null)
                                    setQuizAnswers({})
                                  }}
                                >
                                  Thử lại
                                </Button>
                              </div>
                            )}
                            <p className="text-xs text-gray-600">
                              Giải thích đáp án sẽ hiển thị tại đây dựa trên bài làm của bạn.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }
                  })()}
                </div>
              </ScrollArea>
            </CardContent>
            {/* PDF Modal (global for this card) */}
            <PDFModal
              src="/CSI_01.pdf"
              title="CSI_01.pdf - Phần I. Introduction"
              isOpen={isPdfOpen}
              onClose={() => setIsPdfOpen(false)}
            />
          </Card>
        </div>

        {/* Right: Chat Input Only */}
        <div className="col-span-12 lg:col-span-3 h-full">
          <Card className="h-[calc(100vh-220px)] flex flex-col overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="text-base">Trò chuyện với AI</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 pt-4 overflow-hidden">
              <ScrollArea className="flex-1 rounded border p-3 bg-white h-full overflow-y-auto">
                <div className="space-y-3">
                  {qaMessages.length === 0 && (
                    <div className="space-y-3">
                      {/* Demo chat messages */}
                      <div className="flex justify-start">
                        <div className="max-w-[85%] flex items-start gap-2">
                          <div className="rounded-2xl px-3 py-2 text-sm bg-gray-100 text-gray-900">
                            Chào bạn! Tôi có thể giúp bạn hiểu rõ hơn về nội dung bài học. Bạn có câu hỏi gì không?
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="max-w-[85%] flex items-start gap-2 flex-row-reverse">
                          <div className="rounded-2xl px-3 py-2 text-sm bg-purple-600 text-white">
                            Khái niệm A là gì?
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="max-w-[85%] flex items-start gap-2">
                          <div className="rounded-2xl px-3 py-2 text-sm bg-gray-100 text-gray-900">
                            Khái niệm A là một phương pháp cơ bản giúp đơn giản hóa các bước xử lý phức tạp. Nó thường được sử dụng trong các tình huống cần tối ưu hóa quy trình.
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="max-w-[85%] flex items-start gap-2 flex-row-reverse">
                          <div className="rounded-2xl px-3 py-2 text-sm bg-purple-600 text-white">
                            Có ví dụ thực tế nào không?
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="max-w-[85%] flex items-start gap-2">
                          <div className="rounded-2xl px-3 py-2 text-sm bg-gray-100 text-gray-900">
                            Ví dụ: Khi bạn cần sắp xếp một danh sách số, thay vì viết code phức tạp, bạn có thể sử dụng khái niệm A để đơn giản hóa thành một vài dòng code ngắn gọn.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {qaMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`rounded-2xl px-3 py-2 text-sm ${m.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-900'}`}>{m.content}</div>
                      </div>
                    </div>
                  ))}
                  {qaTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] flex items-start gap-2">
                        <div className="rounded-2xl px-3 py-2 text-sm bg-gray-100 text-gray-900">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="flex items-end gap-2">
                <Textarea
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  placeholder="Hỏi bất kì điều gì về nội dung bài học..."
                  className="min-h-[44px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmitQA()
                    }
                  }}
                />
                <Button onClick={handleSubmitQA} disabled={!qaInput.trim()}><MessageSquare className="h-4 w-4 mr-1" />Gửi</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


