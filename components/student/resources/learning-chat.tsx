"use client"

import { useMemo, useState, useEffect } from "react"
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
import { BookOpenCheck, CheckCircle2, Lock, MessageSquare, PlayCircle, Sparkles, ChevronLeft, ChevronRight, GripVertical, FileText, Settings } from "lucide-react"
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
  onNavigateToResources?: () => void
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

export function LearningChat({ subject, topicId, topicTitle, onExit, onNavigateToResources }: LearningChatProps) {
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [panelWidths, setPanelWidths] = useState({ sidebar: 300, content: 600, chat: 300 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStartX, setResizeStartX] = useState(0)
  const [resizeStartWidths, setResizeStartWidths] = useState({ sidebar: 300, chat: 300 })

  const chapters = mockChapters
  const currentChapter = chapters[activeChapterIndex]

  // Listen for navigation events from sidebar
  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      if (event.detail === 'resources' && onNavigateToResources) {
        onNavigateToResources()
      }
    }

    window.addEventListener('navigate-to-resources', handleNavigation as EventListener)
    return () => {
      window.removeEventListener('navigate-to-resources', handleNavigation as EventListener)
    }
  }, [onNavigateToResources])

  // Resize handlers
  const handleMouseDown = (e: React.MouseEvent, panel: 'sidebar' | 'chat') => {
    e.preventDefault()
    setIsResizing(true)
    setResizeStartX(e.clientX)
    setResizeStartWidths({ sidebar: panelWidths.sidebar, chat: panelWidths.chat })
    
    const handleMouseMove = (e: MouseEvent) => {
      const containerWidth = window.innerWidth
      const deltaX = e.clientX - resizeStartX
      
      if (panel === 'sidebar') {
        const newSidebarWidth = resizeStartWidths.sidebar + deltaX
        const minWidth = 200
        const maxWidth = containerWidth * 0.5
        const clampedSidebarWidth = Math.max(minWidth, Math.min(maxWidth, newSidebarWidth))
        
        const remainingWidth = containerWidth - clampedSidebarWidth - panelWidths.chat - 2
        const minContentWidth = 400
        
        if (remainingWidth >= minContentWidth) {
          setPanelWidths(prev => ({
            ...prev,
            sidebar: clampedSidebarWidth,
            content: remainingWidth
          }))
        }
      } else if (panel === 'chat') {
        const newChatWidth = resizeStartWidths.chat - deltaX
        const minWidth = 250
        const maxWidth = containerWidth * 0.5
        const clampedChatWidth = Math.max(minWidth, Math.min(maxWidth, newChatWidth))
        
        const remainingWidth = containerWidth - panelWidths.sidebar - clampedChatWidth - 2
        const minContentWidth = 400
        
        if (remainingWidth >= minContentWidth) {
          setPanelWidths(prev => ({
            ...prev,
            chat: clampedChatWidth,
            content: remainingWidth
          }))
        }
      }
    }
    
    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

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
    <div className="h-screen w-screen flex flex-col bg-[#f3f3f3] overflow-hidden">
      {/* Header - Keep visible */}
      <div className="h-16 bg-white border-b border-[#e1e1e1] flex items-center px-4 flex-shrink-0">
        <h1 className="text-lg font-semibold text-[#333333]">Learning Platform</h1>
      </div>

      {/* VS Code Style Layout */}
      <div className="flex-1 flex h-full overflow-hidden">
        {/* Left: VS Code Style Sidebar */}
        <div 
          className="h-full transition-all duration-300 border-r border-[#e1e1e1]"
          style={{ width: sidebarCollapsed ? '60px' : `${panelWidths.sidebar}px` }}
        >
          <div className="h-full bg-[#f3f3f3] overflow-hidden flex flex-col">
            {/* VS Code Style Header */}
            <div className="p-3 border-b border-[#e1e1e1] flex flex-row items-center justify-between bg-[#f3f3f3]">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <BookOpenCheck className="h-4 w-4 text-[#007acc]" />
                  <span className="text-sm font-medium text-[#333333]">JavaScript</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-6 w-6 p-0 hover:bg-[#e1e1e1]"
                title={sidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
              >
                {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
              </Button>
            </div>
            <div className={`flex-1 overflow-y-auto p-2 ${sidebarCollapsed ? 'hidden' : ''}`}>
              
              <div className="mb-4 p-2 bg-white rounded border border-[#e1e1e1]">
                <div className="flex justify-between text-xs text-[#666666] mb-1">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#e1e1e1] rounded-full h-2">
                  <div 
                    className="bg-[#007acc] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
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
            </div>
            
            {/* Collapsed Sidebar Content */}
            {sidebarCollapsed && (
              <div className="p-3 space-y-3">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">JavaScript</h3>
                  <div className="text-xs text-gray-500 mb-3">
                    {progressPercent}% hoàn thành
                  </div>
                </div>
                
                <div className="space-y-2">
                  {chapters.slice(0, 3).map((chapter, index) => {
                    const chapterCompleted = chapter.sections.every(section => completedSections[section.id])
                    const isActive = activeChapterIndex === index
                    
                    return (
                      <div 
                        key={chapter.id}
                        className={`p-2 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${
                          isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => setSidebarCollapsed(false)}
                        title="Nhấp để mở rộng sidebar"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">
                            Chương {index + 1}
                          </span>
                          {chapterCompleted && (
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                        {isActive && (
                          <div className="mt-1 text-xs text-blue-600 font-medium">
                            Đang học
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          className="h-full w-1 cursor-col-resize hover:bg-[#007acc] transition-colors relative group"
          onMouseDown={(e) => handleMouseDown(e, 'sidebar')}
          style={{ cursor: isResizing ? 'col-resize' : 'col-resize' }}
        >
          <div className="absolute inset-0 w-2 -ml-0.5"></div>
        </div>

        {/* Middle: Clean Content Viewer */}
        <div 
          className="h-full transition-all duration-300 border-r border-[#e1e1e1]"
          style={{ width: `${panelWidths.content}px` }}
        >
          <div className="h-full bg-[#f7f7f7] flex flex-col overflow-hidden">
            {/* VS Code Style Header */}
            <div className="p-3 border-b border-[#e1e1e1] flex-shrink-0 bg-[#f3f3f3]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpenCheck className="h-4 w-4 text-[#007acc]" />
                  <h3 className="text-sm font-medium text-[#333333]">
                    {(() => {
                      const currentSection = chapters[activeChapterIndex]?.sections.find(s => s.id === activeSection)
                      return currentSection ? currentSection.title : "Select a lesson to begin"
                    })()}
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-4 pr-2 pb-4">
                  {(() => {
                    const currentSection = chapters[activeChapterIndex]?.sections.find(s => s.id === activeSection)
                    
                    if (!currentSection) {
                      return (
                        <div className="flex items-center justify-center text-[#666666] min-h-[400px]">
                          <div className="text-center">
                            <BookOpenCheck className="h-12 w-12 mx-auto mb-4 text-[#cccccc]" />
                            <p className="text-[#666666]">Select a lesson from the sidebar to begin</p>
                          </div>
                        </div>
                      )
                    }

                    if (currentSection.type === 'document') {
                      return (
                        <div className="space-y-4">
                          {/* Clean Content Cards */}
                          <div className="bg-white rounded-lg border border-[#e1e1e1] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-xl font-semibold text-[#333333]">Introduction to Computer Science</h2>
                              <Button 
                                size="sm" 
                                className="bg-[#007acc] text-white hover:bg-[#005a9e] border-0" 
                                onClick={() => setIsPdfOpen(true)}
                              >
                                View Document
                              </Button>
                            </div>
                            
                            <div className="prose prose-sm max-w-none">
                              <p className="text-[#666666] mb-4">
                                Welcome to the comprehensive introduction to Computer Science. This course covers fundamental concepts 
                                that every software engineer should understand.
                              </p>
                              
                              <div className="bg-[#f7f7f7] border-l-4 border-[#007acc] p-4 mb-4">
                                <h3 className="text-sm font-semibold text-[#333333] mb-2">Learning Objectives</h3>
                                <ul className="text-sm text-[#666666] space-y-1">
                                  <li>• Understand basic computer science principles</li>
                                  <li>• Learn fundamental programming concepts</li>
                                  <li>• Explore data structures and algorithms</li>
                                  <li>• Develop problem-solving skills</li>
                                </ul>
                              </div>
                              
                              <div className="bg-[#f7f7f7] border-l-4 border-[#28a745] p-4 mb-4">
                                <h3 className="text-sm font-semibold text-[#333333] mb-2">Skills You'll Gain</h3>
                                <div className="flex flex-wrap gap-2">
                                  <span className="px-2 py-1 bg-[#e3f2fd] text-[#1976d2] text-xs rounded">Programming</span>
                                  <span className="px-2 py-1 bg-[#e8f5e8] text-[#2e7d32] text-xs rounded">Algorithms</span>
                                  <span className="px-2 py-1 bg-[#fff3e0] text-[#f57c00] text-xs rounded">Data Structures</span>
                                  <span className="px-2 py-1 bg-[#fce4ec] text-[#c2185b] text-xs rounded">Problem Solving</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Complete Button Card */}
                          <div className="bg-white rounded-lg border border-[#e1e1e1] p-4 shadow-sm">
                            <Button 
                              className="w-full bg-[#28a745] text-white hover:bg-[#218838] border-0"
                              onClick={() => handleCompleteSection(currentSection.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Mark as Complete
                            </Button>
                          </div>
                        </div>
                      )
                } else {
                  // Quiz content
                  return (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg border border-[#e1e1e1] p-6 shadow-sm">
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
            </div>
            {/* PDF Modal (global for this card) */}
            <PDFModal
              src="/CSI_01.pdf"
              title="CSI_01.pdf - Phần I. Introduction"
              isOpen={isPdfOpen}
              onClose={() => setIsPdfOpen(false)}
            />
          </div>
        </div>

        {/* Invisible Resize Area */}
        <div 
          className="h-full w-1 cursor-col-resize hover:bg-gray-300 transition-colors"
          onMouseDown={(e) => handleMouseDown(e, 'chat')}
          style={{ cursor: isResizing ? 'col-resize' : 'default' }}
        />

        {/* Right: AI Chat Assistant */}
        <div 
          className="h-full transition-all duration-300"
          style={{ width: `${panelWidths.chat}px` }}
        >
          <div className="h-full bg-[#f3f3f3] flex flex-col overflow-hidden">
            {/* VS Code Style Header */}
            <div className="p-3 border-b border-[#e1e1e1] bg-[#f3f3f3]">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#007acc]" />
                <h3 className="text-sm font-medium text-[#333333]">AI Assistant</h3>
              </div>
            </div>
            <div className="flex-1 flex flex-col p-3 overflow-hidden">
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-3 pr-2">
                  {qaMessages.length === 0 && (
                    <div className="space-y-3">
                      {/* Terminal-like AI messages */}
                      <div className="bg-[#f7f7f7] border border-[#e1e1e1] rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-[#28a745] rounded-full"></div>
                          <span className="text-xs text-[#666666] font-mono">AI Assistant</span>
                        </div>
                        <p className="text-sm text-[#333333]">
                          Hello! I can help you understand the lesson content better. Do you have any questions?
                        </p>
                      </div>
                      
                      <div className="bg-[#007acc] text-white rounded p-3 ml-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-xs font-mono opacity-75">You</span>
                        </div>
                        <p className="text-sm">What is concept A?</p>
                      </div>
                      
                      <div className="bg-[#f7f7f7] border border-[#e1e1e1] rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-[#28a745] rounded-full"></div>
                          <span className="text-xs text-[#666666] font-mono">AI Assistant</span>
                        </div>
                        <p className="text-sm text-[#333333]">
                          Concept A is a fundamental method that helps simplify complex processing steps. It's commonly used in situations that require process optimization.
                        </p>
                      </div>
                      
                      <div className="bg-[#007acc] text-white rounded p-3 ml-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-xs font-mono opacity-75">You</span>
                        </div>
                        <p className="text-sm">Is there a real-world example?</p>
                      </div>
                      
                      <div className="bg-[#f7f7f7] border border-[#e1e1e1] rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-[#28a745] rounded-full"></div>
                          <span className="text-xs text-[#666666] font-mono">AI Assistant</span>
                        </div>
                        <p className="text-sm text-[#333333]">
                          Example: When you need to sort a list of numbers, instead of writing complex code, you can use concept A to simplify it into a few short lines of code.
                        </p>
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
              <div className="flex items-end gap-2 p-3 bg-white border border-[#e1e1e1] rounded">
                <Textarea
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  placeholder="Ask anything about the lesson content..."
                  className="min-h-[40px] border-0 focus-visible:ring-0 resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmitQA()
                    }
                  }}
                />
                <Button 
                  onClick={handleSubmitQA} 
                  disabled={!qaInput.trim()}
                  size="sm"
                  className="bg-[#007acc] text-white hover:bg-[#005a9e] border-0"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


