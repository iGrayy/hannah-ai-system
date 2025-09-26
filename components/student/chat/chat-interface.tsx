"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Send,
  Paperclip,
  Code,
  Smile,
  Share2,
  Flag,
  MoreVertical,
  Zap,
  Clock,
  CheckCircle,
  Trash2,
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "hannah"
  timestamp: Date
  type: "text" | "code"
  language?: string
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  unread: number
}

const mockSessions: ChatSession[] = [
  {
    id: "1",
    title: "Cơ bản JavaScript",
    lastMessage: "Great! You're understanding closures well...",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unread: 0,
  },
  {
    id: "2", 
    title: "Component React",
    lastMessage: "Let me explain useEffect hook...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: 2,
  },
  {
    id: "3",
    title: "Database Design",
    lastMessage: "You: How do I normalize tables?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: 0,
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hi Hannah! I'm having trouble understanding JavaScript closures. Can you help explain?",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    type: "text",
  },
  {
    id: "2",
    content: "Of course! I'd be happy to help you understand closures. A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Let me show you with an example:",
    sender: "hannah",
    timestamp: new Date(Date.now() - 1000 * 60 * 9),
    type: "text",
  },
  {
    id: "3",
    content: `function outerFunction(x) {
  return function innerFunction(y) {
    return x + y;
  };
}

const addFive = outerFunction(5);
console.log(addFive(3)); // Output: 8`,
    sender: "hannah",
    timestamp: new Date(Date.now() - 1000 * 60 * 9),
    type: "code",
    language: "javascript",
  },
  {
    id: "4",
    content: "That makes sense! So the inner function 'remembers' the value of x even after outerFunction finishes?",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: "text",
  },
]

const quickActions = [
  "Giải thích đoạn mã",
  "Gỡ lỗi giúp tôi",
  "Hỗ trợ dự án",
  "Làm rõ bài tập",
  "Thông tin học vụ",
  "Thực hành tốt",
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedSession, setSelectedSession] = useState("1")
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [codeSnippet, setCodeSnippet] = useState("")
  const [codeLanguage, setCodeLanguage] = useState("javascript")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastUserMessageRef = useRef<string>("")
  const [flagOpen, setFlagOpen] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue("")
    lastUserMessageRef.current = newMessage.content
    
    // Simulate Hannah typing
    setIsTyping(true)
    setTimeout(() => {
      const hannahResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your question. Let me help you with that...",
        sender: "hannah",
        timestamp: new Date(),
        type: "text",
      }
      setMessages(prev => [...prev, hannahResponse])
      setIsTyping(false)
    }, 2000)
  }

  const handleFlagAiMessage = (aiMessage: Message) => {
    try {
      const stored = localStorage.getItem("hannah-flagged-responses")
      const list = stored ? JSON.parse(stored) : []
      const item = {
        id: Date.now().toString(),
        student: { name: "Sinh viên", id: "SV001", avatar: "/placeholder-user.jpg" },
        question: lastUserMessageRef.current || "(Không xác định)",
        aiResponse: aiMessage.content,
        confidence: 0.3,
        date: new Date().toISOString(),
        status: "pending",
        priority: "high",
      }
      list.unshift(item)
      localStorage.setItem("hannah-flagged-responses", JSON.stringify(list))
      alert("🚩 Đã báo sai/thiếu kiến thức. Phản hồi sẽ xuất hiện trong mục Faculty → Quản lý phản hồi.")
    } catch (e) {
      console.error("Flag error", e)
      alert("Không thể báo lỗi lúc này.")
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-full bg-white">
      {/* Chat Sessions Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Sessions Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Cuộc trò chuyện</h3>
          <p className="text-sm text-gray-500">Lịch sử chat của bạn với Hannah</p>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {mockSessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedSession === session.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => setSelectedSession(session.id)}
            >
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{session.title}</h4>
                  <p className="text-sm text-gray-500 truncate mt-1">{session.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTime(session.timestamp)}</p>
                </div>
                <div className="flex items-center gap-2 ml-2 justify-end w-10">
                  {session.unread > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      {session.unread}
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Tùy chọn"
                        className="h-6 w-6 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 z-50">
                      <DropdownMenuItem onClick={() => alert('🔗 Chia sẻ cuộc trò chuyện (mô phỏng)')}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Chia sẻ
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        const newName = prompt('Đổi tên cuộc trò chuyện:', session.title)
                        if (newName) alert('✅ Đã đổi tên (mô phỏng) thành: ' + newName)
                      }}>
                        <Smile className="h-4 w-4 mr-2" />
                        Đổi tên
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => confirm('Xóa cuộc trò chuyện này? (mô phỏng)') && alert('🗑️ Đã xóa (mô phỏng)')} className="text-red-600 focus:text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-t border-gray-200">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Zap className="h-4 w-4 mr-2" />
            Cuộc trò chuyện mới
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/hannah-avatar.png" />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  H
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">Hannah AI</h3>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Trực tuyến</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => alert('🔗 Chia sẻ đoạn chat (mô phỏng)')} title="Chia sẻ">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setFlagOpen(true)} title="Đánh dấu cần can thiệp">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.sender === 'hannah' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="/hannah-avatar.png" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                      H
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`rounded-2xl px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.type === 'code' ? (
                    <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{message.content}</pre>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                  {message.sender === 'hannah' && (
                    <div className="mt-1 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleFlagAiMessage(message)}
                        title="Báo sai/thiếu kiến thức"
                      >
                        🚩 Báo sai/thiếu
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/hannah-avatar.png" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                    H
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">Hannah đang nhập...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex gap-2 overflow-x-auto">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="whitespace-nowrap text-xs"
                onClick={() => setInputValue(action)}
              >
                {action}
              </Button>
            ))}
          </div>
        </div>

        {/* Code Snippet Input */}
        {showCodeInput && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Ngôn ngữ:</label>
                <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="Dán mã của bạn vào đây..."
                className="min-h-[120px] font-mono text-sm bg-gray-900 text-green-400 border-gray-600"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    if (codeSnippet.trim()) {
                      const codeMessage: Message = {
                        id: Date.now().toString(),
                        content: codeSnippet,
                        sender: "user",
                        timestamp: new Date(),
                        type: "code",
                        language: codeLanguage,
                      }
                      setMessages(prev => [...prev, codeMessage])
                      setCodeSnippet("")
                      setShowCodeInput(false)

                      // Hannah response
                      setTimeout(() => {
                        const response: Message = {
                          id: (Date.now() + 1).toString(),
                          content: `I can see your ${codeLanguage} code. Let me explain what this does and suggest improvements...`,
                          sender: "hannah",
                          timestamp: new Date(),
                          type: "text",
                        }
                        setMessages(prev => [...prev, response])
                      }, 1500)
                    }
                  }}
                  disabled={!codeSnippet.trim()}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Gửi mã
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowCodeInput(false)}>
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Hỏi Hannah về lập trình, dự án, bài tập hoặc thông tin học vụ..."
                className="min-h-[60px] max-h-32 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" title="Tải tệp lên">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCodeInput(!showCodeInput)}
                title="Chia sẻ đoạn mã"
                className={showCodeInput ? "bg-blue-100 border-blue-300" : ""}
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-blue-500 hover:bg-blue-600"
                title="Gửi tin nhắn"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={flagOpen} onOpenChange={setFlagOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đánh dấu cần can thiệp</DialogTitle>
            <DialogDescription>
              Đánh dấu cuộc trò chuyện cần sự can thiệp của con người. Thông tin sẽ được gửi đến giảng viên/phụ trách để xử lý.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setFlagOpen(false)}>Hủy</Button>
            <Button onClick={() => {
              try {
                const stored = typeof window !== 'undefined' ? localStorage.getItem('hannah-flagged-conversations') : null
                const list = stored ? JSON.parse(stored) : []
                const conversation = {
                  id: `${selectedSession}-${Date.now()}`,
                  sessionId: selectedSession,
                  title: (mockSessions.find((s: ChatSession) => s.id === selectedSession)?.title) || 'Cuộc trò chuyện',
                  flaggedAt: new Date().toISOString(),
                  messages,
                }
                list.unshift(conversation)
                localStorage.setItem('hannah-flagged-conversations', JSON.stringify(list))
                alert('✅ Đã đánh dấu cuộc trò chuyện (mô phỏng).')
              } catch {}
              setFlagOpen(false)
            }}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
