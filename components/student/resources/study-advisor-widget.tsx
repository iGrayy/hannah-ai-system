"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Sparkles, X } from "lucide-react"

interface Msg { sender: "ai" | "user"; content: string }

export function StudyAdvisorWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { sender: "ai", content: "Chào bạn! Mình có thể tư vấn học gì tiếp theo và lộ trình phù hợp. Hãy nói mục tiêu hoặc môn bạn quan tâm nhé." },
  ])
  const lastRef = useRef<HTMLDivElement>(null)

  useEffect(() => { lastRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])

  const send = () => {
    if (!input.trim()) return
    const user = { sender: "user" as const, content: input.trim() }
    setMessages(prev => [...prev, user])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      const ai: Msg = {
        sender: "ai",
        content: "Gợi ý lộ trình: 1) Ôn nền tảng 1 tuần, 2) Chủ đề chính 2–3 tuần, 3) Ôn/quiz 1 tuần. Mình có thể tạo lộ trình theo tốc độ bạn muốn.",
      }
      setMessages(prev => [...prev, ai])
      setTyping(false)
    }, 700)
  }

  const quickPrompts = [
    "Mình muốn học React, bắt đầu từ đâu?",
    "Gợi ý lộ trình JavaScript trong 4 tuần",
    "Ôn tập trước khi thi: nên học phần nào?",
  ]

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 shadow-lg rounded-full h-12 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Tư vấn lộ trình
          <Badge className="ml-2 bg-white/90 text-gray-800">AI</Badge>
        </Button>
      )}

      {/* Popup panel */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 h-[480px] bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/hannah-avatar.png" />
                <AvatarFallback>H</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">Hannah • Tư vấn học tập</div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1"><span className="h-2 w-2 bg-green-500 rounded-full" />Online</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] flex items-center gap-1"><Sparkles className="h-3 w-3" />Cá nhân hóa</Badge>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="px-3 py-2 border-b">
            <div className="flex gap-2 overflow-x-auto">
              {quickPrompts.map((p) => (
                <Button key={p} size="sm" variant="outline" className="text-xs whitespace-nowrap" onClick={() => setInput(p)}>
                  {p}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${m.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-3 py-2 text-sm`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-3 py-2 text-sm text-gray-600 flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              )}
              <div ref={lastRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi lộ trình học / mục tiêu của bạn..."
                className="min-h-[44px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
              />
              <Button onClick={send} disabled={!input.trim()} className="bg-blue-500 hover:bg-blue-600">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


