"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpenCheck, CheckCircle2, Lock, MessageSquare, PlayCircle, Sparkles } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
    summary:
      "Bài giảng cá nhân hóa: Ôn nhanh các khái niệm cốt lõi, ví dụ trực quan và các lỗi thường gặp dựa trên lịch sử học của bạn.",
    quiz: [
      { id: "q1", type: "mcq", question: "Khái niệm A là gì?", options: ["Định nghĩa 1", "Định nghĩa 2", "Định nghĩa 3", "Định nghĩa 4"] },
      { id: "q2", type: "short", question: "Hãy nêu một ví dụ thực tế cho khái niệm A." },
      { id: "q3", type: "mcq", question: "Chọn phát biểu đúng về A", options: ["Đúng 1", "Đúng 2", "Sai 1", "Sai 2"] },
    ],
  },
  {
    id: "c2",
    title: "Ứng dụng vào tình huống",
    summary:
      "Bài giảng cá nhân hóa: Áp dụng vào bài tập nhỏ theo năng lực hiện tại. Có gợi ý từng bước nếu cần.",
    quiz: [
      { id: "q1", type: "mcq", question: "Tình huống nào phù hợp nhất để dùng A?", options: ["TH1", "TH2", "TH3", "TH4"] },
      { id: "q2", type: "short", question: "Tóm tắt quy trình giải một bài toán dùng A." },
      { id: "q3", type: "mcq", question: "Bước nào KHÔNG thuộc quy trình?", options: ["B1", "B2", "B3", "B4"] },
    ],
  },
  {
    id: "c3",
    title: "Nâng cao & mở rộng",
    summary:
      "Bài giảng cá nhân hóa: Mở rộng kiến thức, lưu ý hiệu năng/ngoại lệ, và liên hệ với chủ đề kế tiếp.",
    quiz: [
      { id: "q1", type: "mcq", question: "Phát biểu nào đúng về tối ưu?", options: ["A", "B", "C", "D"] },
      { id: "q2", type: "short", question: "Nêu hai rủi ro khi áp dụng sai ngữ cảnh." },
      { id: "q3", type: "mcq", question: "Chọn cách kiểm chứng kết quả", options: ["X", "Y", "Z", "W"] },
    ],
  },
]

export function LearningChat({ subject, topicId, topicTitle, onExit }: LearningChatProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [completedChapters, setCompletedChapters] = useState<Record<string, boolean>>({})
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizScore, setQuizScore] = useState<number | null>(null)
  // Middle panel is now a structured lesson content instead of chat
  const [qaMessages, setQaMessages] = useState<{ sender: "ai" | "user"; content: string }[]>([])
  const [qaInput, setQaInput] = useState("")
  const [qaTyping, setQaTyping] = useState(false)

  const chapters = mockChapters
  const currentChapter = chapters[activeChapterIndex]
  const [activeTab, setActiveTab] = useState<"theory" | "quiz">("theory")
  const [theoryCompleted, setTheoryCompleted] = useState(false)

  const progressPercent = useMemo(() => {
    const total = chapters.length
    const done = chapters.filter((c) => completedChapters[c.id]).length
    return Math.round((done / total) * 100)
  }, [completedChapters, chapters.length])

  const isChapterUnlocked = (index: number) => {
    if (index === 0) return true
    const prev = chapters[index - 1]
    return !!completedChapters[prev.id]
  }

  const canMarkComplete = quizScore !== null && quizScore >= 70

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
  }

  const handleMarkChapterComplete = () => {
    if (!canMarkComplete) return
    setCompletedChapters((prev) => ({ ...prev, [currentChapter.id]: true }))
    setQuizScore(null)
    // Tự chuyển qua chương kế nếu có
    if (activeChapterIndex < chapters.length - 1) {
      setActiveChapterIndex((i) => i + 1)
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
      objectives: ["Biết chọn tình huống áp dụng A", "Thực hành quy trình chuẩn 4 bước", "Đánh giá kết quả"],
      sections: [
        { title: "1. Khung quy trình", content: "Mô tả 4 bước áp dụng A từ phân tích đến kiểm chứng." },
        { title: "2. Ví dụ hướng dẫn", content: "Bài làm mẫu theo từng bước, có ghi chú quyết định quan trọng." },
        { title: "3. Biến thể & mẹo", content: "Các biến thể khi dữ liệu thiếu, mẹo tối giản để thi/kiểm tra." },
      ],
      keypoints: ["Chọn dữ liệu đầu vào đúng trọng tâm", "Theo dõi giả định", "Kiểm chứng bằng tiêu chí R"],
      exercises: ["Áp dụng quy trình cho case study ngắn", "Nhận xét kết quả: đạt/chưa đạt?", "Đề xuất cải tiến"],
    },
    c3: {
      objectives: ["Hiểu mở rộng của A", "Nhận rủi ro khi lạm dụng", "Liên hệ chủ đề kế tiếp"],
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
            <h2 className="text-xl font-semibold text-gray-900">{topicTitle}</h2>
            <p className="text-sm text-gray-500">Môn học: {subject} • Chủ đề: {topicId}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Tiến độ {progressPercent}%</Badge>
            {onExit && (
              <Button variant="outline" size="sm" onClick={onExit}>Quay lại tài nguyên</Button>
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
              <CardDescription>Danh sách chương & tiến độ</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="mb-4">
                <Progress value={progressPercent} />
                <p className="text-xs text-gray-500 mt-1">Hoàn thành {progressPercent}%</p>
              </div>
              <div className="space-y-2">
                {chapters.map((ch, idx) => {
                  const unlocked = isChapterUnlocked(idx)
                  const completed = !!completedChapters[ch.id]
                  return (
                    <div key={ch.id} className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50">
                      <Checkbox checked={completed} disabled />
                      <button
                        className="flex-1 text-left"
                        onClick={() => unlocked && setActiveChapterIndex(idx)}
                        disabled={!unlocked}
                        aria-label={`Chương ${idx + 1}`}
                      >
                        <div className="flex items-center gap-2">
                          {unlocked ? <BookOpenCheck className="h-4 w-4 text-blue-600" /> : <Lock className="h-4 w-4 text-gray-400" />}
                          <span className={`text-sm ${!unlocked ? 'text-gray-400' : ''}`}>Chương {idx + 1}: {ch.title}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ch.summary}</p>
                      </button>
                      {completed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    </div>
                  )
                })}
              </div>
              <Separator className="my-4" />
              <div className="text-xs text-gray-500">
                Gợi ý: Nếu điểm quiz thấp, hệ thống sẽ đề xuất ôn tập trước khi mở chương tiếp theo.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle: Chapter Lesson Content + Summary + Quiz */}
        <div className="col-span-12 lg:col-span-6 h-full">
          <Card className="h-[calc(100vh-220px)] flex flex-col overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{`Chương ${activeChapterIndex + 1}: ${currentChapter.title}`}</CardTitle>
                  <CardDescription>Nội dung bài học có cấu trúc • Gia sư ảo</CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs flex items-center gap-1"><Sparkles className="h-3 w-3" />Cá nhân hóa</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 pt-4 overflow-hidden">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <TabsList>
                    <TabsTrigger value="theory">Lý thuyết</TabsTrigger>
                    <TabsTrigger
                      value="quiz"
                      onClick={(e) => {
                        if (!theoryCompleted) {
                          e.preventDefault()
                        }
                      }}
                      className={!theoryCompleted ? 'opacity-50 pointer-events-none' : ''}
                    >
                      Quiz
                    </TabsTrigger>
                  </TabsList>
                  {activeTab === 'theory' && (
                    <Button size="sm" onClick={() => { setTheoryCompleted(true); setActiveTab('quiz') }}>Tiếp tục</Button>
                  )}
                </div>

                <TabsContent value="theory" className="flex-1 flex flex-col overflow-hidden m-0 p-0">
                  {/* Personalized Summary */}
                  <div className="p-3 rounded border bg-muted/40">
                    <p className="text-sm text-gray-800">{currentChapter.summary}</p>
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" size="sm">Xem chi tiết</Button>
                      <Button variant="outline" size="sm">Ví dụ minh họa</Button>
                      <Button variant="outline" size="sm">Ôn nhanh</Button>
                    </div>
                  </div>
                  {/* Chapter structured content */}
                  <ScrollArea className="flex-1 rounded border p-4 bg-white overflow-y-auto">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm">Mục tiêu học tập</h4>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                          {(chapterContentMap[currentChapter.id]?.objectives || []).map((o, i) => (
                            <li key={i}>{o}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Nội dung chính</h4>
                        <Accordion type="single" collapsible className="w-full">
                          {(chapterContentMap[currentChapter.id]?.sections || []).map((s, i) => (
                            <AccordionItem key={i} value={`sec-${i}`}>
                              <AccordionTrigger className="text-sm">{s.title}</AccordionTrigger>
                              <AccordionContent>
                                <p className="text-sm text-gray-700 leading-relaxed">{s.content}</p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Điểm cần ghi nhớ</h4>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                          {(chapterContentMap[currentChapter.id]?.keypoints || []).map((k, i) => (
                            <li key={i}>{k}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Bài tập ngắn</h4>
                        <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                          {(chapterContentMap[currentChapter.id]?.exercises || []).map((e, i) => (
                            <li key={i}>{e}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="quiz" className="flex-1 flex flex-col overflow-hidden m-0 p-0">
                  <div className="rounded border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Quiz cuối chương</h4>
                      <Badge variant="outline" className="text-xs">3-5 câu</Badge>
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
                      <Button variant="outline" size="sm" onClick={handleSubmitQuiz}><PlayCircle className="h-4 w-4 mr-1" />Nộp bài</Button>
                      {quizScore !== null && (
                        <Badge className={quizScore >= 70 ? 'bg-green-600' : 'bg-amber-600'}>Điểm: {quizScore}</Badge>
                      )}
                      <div className="flex-1" />
                      <Button disabled={!canMarkComplete} onClick={handleMarkChapterComplete} size="sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Đánh dấu hoàn thành
                      </Button>
                    </div>
                    {quizScore !== null && (
                      <p className="text-xs text-gray-600 mt-2">Giải thích đáp án sẽ hiển thị tại đây dựa trên bài làm của bạn.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right: Free Q&A */}
        <div className="col-span-12 lg:col-span-3 h-full">
          <Card className="h-[calc(100vh-220px)] flex flex-col overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/hannah-avatar.png" />
                    <AvatarFallback>H</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">Trò chuyện với AI</CardTitle>
                    <CardDescription>Hỏi tự do, không ảnh hưởng lộ trình</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">Online</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 pt-4 overflow-hidden">
              {/* Quick prompts */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {["Giải thích lại", "Ví dụ thực tế", "Ôn tập nhanh", "Gợi ý bài tập"].map((p) => (
                  <Button key={p} variant="outline" size="sm" className="whitespace-nowrap text-xs" onClick={() => setQaInput(p)}>
                    {p}
                  </Button>
                ))}
              </div>
              <ScrollArea className="flex-1 rounded border p-3 bg-white h-full overflow-y-auto">
                <div className="space-y-3">
                  {qaMessages.length === 0 && (
                    <div className="text-xs text-gray-600">
                      <div className="rounded-md border p-4 bg-gray-50 min-h-[520px] flex flex-col">
                        <p className="font-medium text-gray-800">Gợi ý bắt đầu</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(
                            [
                              "Giải thích lại nội dung chính",
                              "Cho ví dụ thực tế dễ hiểu",
                              "Tóm tắt điểm quan trọng",
                            ] as string[]
                          ).map((s) => (
                            <Button key={s} size="sm" variant="outline" className="text-xs" onClick={() => setQaInput(s)}>
                              {s}
                            </Button>
                          ))}
                        </div>
                        {chapterContentMap[currentChapter.id]?.objectives?.length ? (
                          <>
                            <p className="mt-3 font-medium text-gray-800">Liên quan chương hiện tại</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {chapterContentMap[currentChapter.id].objectives.slice(0, 3).map((o, i) => {
                                const q = `Giải thích mục tiêu: ${o}`
                                return (
                                  <Button key={i} size="sm" variant="secondary" className="text-xs" onClick={() => setQaInput(q)}>
                                    {q}
                                  </Button>
                                )
                              })}
                              {chapterContentMap[currentChapter.id].sections.slice(0, 2).map((s, i) => {
                                const q = `Làm rõ phần: ${s.title}`
                                return (
                                  <Button key={`sec-${i}`} size="sm" variant="outline" className="text-xs" onClick={() => setQaInput(q)}>
                                    {q}
                                  </Button>
                                )
                              })}
                            </div>
                          </>
                        ) : null}
                        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-gray-400">
                          <div className="h-16 bg-white/60 rounded border" />
                          <div className="h-16 bg-white/60 rounded border" />
                          <div className="h-16 bg-white/60 rounded border" />
                        </div>
                        <div className="mt-auto pt-3 text-[11px] text-gray-500">Mẹo: Nhấn Enter để gửi, Shift + Enter để xuống dòng</div>
                      </div>
                    </div>
                  )}
                  {qaMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        {m.sender === 'ai' && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/hannah-avatar.png" />
                            <AvatarFallback>H</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`rounded-2xl px-3 py-2 text-sm ${m.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-900'}`}>{m.content}</div>
                      </div>
                    </div>
                  ))}
                  {qaTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] flex items-start gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/hannah-avatar.png" />
                          <AvatarFallback>H</AvatarFallback>
                        </Avatar>
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
                  placeholder="Nhập câu hỏi của bạn..."
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


