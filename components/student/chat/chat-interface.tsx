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
  Code,
  Share2,
  Flag,
  MoreVertical,
  Zap,
  Clock,
  CheckCircle,
  Trash2,
  Plus,
  Pencil,
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


export function ChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedSession, setSelectedSession] = useState("1")
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [codeSnippet, setCodeSnippet] = useState("")
  const [codeLanguage, setCodeLanguage] = useState("javascript")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastUserMessageRef = useRef<string>("")
  const [flagOpen, setFlagOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [renameValue, setRenameValue] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Render chat history in sidebar
  useEffect(() => {
    const container = document.getElementById('chat-history-container')
    if (!container) return

    const renderChatHistory = () => {
      container.innerHTML = sessions.map((session) => `
        <div class="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded-md ${
          selectedSession === session.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
        }" data-session-id="${session.id}">
          <div class="grid grid-cols-[1fr_auto] items-center gap-2">
            <div class="min-w-0">
              <h4 class="font-medium text-gray-900 truncate text-sm">${session.title}</h4>
              <p class="text-xs text-gray-500 truncate mt-1">${session.lastMessage}</p>
              <p class="text-xs text-gray-400 mt-1">${formatTime(session.timestamp)}</p>
            </div>
            <div class="flex items-center gap-2 ml-2 justify-end w-10">
              ${session.unread > 0 ? `<span class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 gap-1 border-transparent bg-blue-500 text-white text-xs">${session.unread}</span>` : ''}
              <button type="button" aria-label="Tùy chọn" class="h-6 w-6 p-0 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground" data-session-menu="${session.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
              </button>
            </div>
          </div>
        </div>
      `).join('')

      // Add new chat button
      container.innerHTML += `
        <div class="p-3 border-t border-gray-200 mt-2">
          <button class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-md px-3 py-2 text-sm font-medium flex items-center justify-center gap-2" id="new-chat-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"></polygon></svg>
            Cuộc trò chuyện mới
          </button>
        </div>
      `
    }

    renderChatHistory()

    // Add event listeners
    const handleSessionClick = (e: Event) => {
      const target = e.target as HTMLElement
      const sessionDiv = target.closest('[data-session-id]') as HTMLElement
      if (sessionDiv) {
        const sessionId = sessionDiv.getAttribute('data-session-id')
        if (sessionId) {
          setSelectedSession(sessionId)
        }
      }
    }

    const handleNewChat = () => {
      const id = Date.now().toString()
      const newSession: ChatSession = {
        id,
        title: `Cuộc trò chuyện mới`,
        lastMessage: "",
        timestamp: new Date(),
        unread: 0,
      }
      setSessions(prev => [newSession, ...prev])
      setSelectedSession(id)
      setMessages([])
      setIsTyping(false)
    }

    container.addEventListener('click', handleSessionClick)
    const newChatBtn = document.getElementById('new-chat-btn')
    newChatBtn?.addEventListener('click', handleNewChat)

    return () => {
      container.removeEventListener('click', handleSessionClick)
      newChatBtn?.removeEventListener('click', handleNewChat)
    }
  }, [sessions, selectedSession])

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
    // Update session preview
    setSessions(prev => prev.map(s => s.id === selectedSession ? ({ ...s, lastMessage: newMessage.content, timestamp: new Date(), unread: 0 }) : s))
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
      // Update session preview to latest assistant response
      setSessions(prev => prev.map(s => s.id === selectedSession ? ({ ...s, lastMessage: hannahResponse.content, timestamp: new Date() }) : s))
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
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center text-gray-500 min-h-[200px]">
              <div className="text-center">
                <p className="text-sm">Chào mừng trở lại! Hannah có thể giúp gì cho bạn hôm nay?</p>
              </div>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.sender === 'hannah' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="/hannah-avatar.png" />
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
          <div className="w-full">
            <div className="relative">
              <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                {/* Plus button like ChatGPT */}
                <button
                  type="button"
                  className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  title="Thêm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const message: Message = {
                      id: Date.now().toString(),
                      content: `📎 ${file.name} (${Math.round(file.size / 1024)} KB)` ,
                      sender: "user",
                      timestamp: new Date(),
                      type: "text",
                    }
                    setMessages(prev => [...prev, message])
                    setTimeout(() => {
                      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), content: "Đã nhận tệp. Mình sẽ xử lý nội dung tệp này! (demo)", sender: "hannah", timestamp: new Date(), type: "text" }])
                    }, 800)
                    // reset so selecting same file again still fires change
                    e.currentTarget.value = ""
                  }}
                />
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Hỏi Hannah về lập trình, dự án, bài tập hoặc thông tin học vụ..."
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-gray-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <div className="flex items-center gap-1">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    size="sm"
                    className="h-8 w-8 p-0 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    title="Gửi tin nhắn"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
                  title: (sessions.find((s: ChatSession) => s.id === selectedSession)?.title) || 'Cuộc trò chuyện',
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

      {/* Rename dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi tên cuộc trò chuyện</DialogTitle>
            <DialogDescription>Nhập tên mới cho cuộc trò chuyện.</DialogDescription>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Tên mới"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameOpen(false)}>Hủy</Button>
            <Button onClick={() => {
              const name = renameValue.trim()
              if (!name) return setRenameOpen(false)
              setSessions(prev => prev.map(s => s.id === selectedSession ? ({ ...s, title: name }) : s))
              setRenameOpen(false)
            }}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chia sẻ cuộc trò chuyện</DialogTitle>
            <DialogDescription>Đây là liên kết chia sẻ (demo). Bạn có thể sao chép để gửi cho người khác.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input readOnly value={`https://hannah.ai/share/${selectedSession}`} />
            <Button onClick={() => { navigator.clipboard?.writeText(`https://hannah.ai/share/${selectedSession}`); alert('📋 Đã sao chép liên kết (demo)') }}>Sao chép</Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setShareOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hồ sơ cá nhân (Cài đặt) */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hồ sơ cá nhân</DialogTitle>
            <DialogDescription>Thông tin tài khoản của bạn (demo).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">NB</span>
              <div>
                <p className="font-medium text-gray-900">Nguyen Van B</p>
                <p className="text-xs text-gray-500">nguyen.b@example.com</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Họ và tên</label>
                <Input value="Nguyen Van B" readOnly />
              </div>
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <Input value="nguyen.b@example.com" readOnly />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setProfileOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
