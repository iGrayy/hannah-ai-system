"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  BookOpen,
  HelpCircle,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Send,
} from "lucide-react"

interface AssignmentQuery {
  id: string
  question: string
  subject: string
  attachments?: string[]
  response?: string
  createdAt: Date
  status: "pending" | "answered"
}

const mockQueries: AssignmentQuery[] = [
  {
    id: "1",
    question: "Can you explain the difference between synchronous and asynchronous programming in JavaScript?",
    subject: "JavaScript",
    response: "Great question! Synchronous programming executes code line by line, waiting for each operation to complete before moving to the next. Asynchronous programming allows multiple operations to run concurrently without blocking the main thread...",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "answered",
  },
  {
    id: "2",
    question: "What are the key principles of database normalization and why is it important?",
    subject: "Database",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    status: "pending",
  },
]

const quickTopics = [
  "Explain this concept",
  "What is the difference between...",
  "How does this work?",
  "Best practices for...",
  "Common mistakes in...",
  "When should I use...",
]

export function AssignmentHelp() {
  const [queries, setQueries] = useState<AssignmentQuery[]>(mockQueries)
  const [newQuery, setNewQuery] = useState({
    question: "",
    subject: "",
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleSubmitQuery = () => {
    if (!newQuery.question.trim()) return

    const query: AssignmentQuery = {
      id: Date.now().toString(),
      question: newQuery.question,
      subject: newQuery.subject || "General",
      createdAt: new Date(),
      status: "pending",
      attachments: selectedFiles.length > 0 ? selectedFiles.map(f => f.name) : undefined,
    }

    setQueries(prev => [query, ...prev])
    setNewQuery({ question: "", subject: "" })
    setSelectedFiles([])

    // Simulate Hannah's response
    setTimeout(() => {
      setQueries(prev => prev.map(q => 
        q.id === query.id 
          ? { 
              ...q, 
              status: "answered" as const,
              response: "I understand your question about " + query.subject.toLowerCase() + ". Let me help clarify this concept for you. This is a fundamental topic that many students find challenging initially..."
            }
          : q
      ))
    }, 3000)
  }

  const handleQuickTopic = (topic: string) => {
    setNewQuery(prev => ({ ...prev, question: topic }))
  }

  return (
    <div className="h-full bg-gray-50">
      <Tabs defaultValue="ask" className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assignment Help</h1>
                <p className="text-gray-600">Get clarification and guidance on your assignments</p>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-amber-700 font-medium">
                  Hannah provides guidance, not direct solutions
                </span>
              </div>
            </div>

            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="ask">Ask Question</TabsTrigger>
              <TabsTrigger value="history">My Questions</TabsTrigger>
              <TabsTrigger value="tips">Study Tips</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="ask" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Disclaimer */}
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Important:</strong> Hannah will help you understand concepts and provide guidance, 
                    but won't solve assignments directly. This ensures you learn and maintain academic integrity.
                  </AlertDescription>
                </Alert>

                {/* Quick Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Quick Question Starters
                    </CardTitle>
                    <CardDescription>
                      Click on a template to get started with your question
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {quickTopics.map((topic, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="text-left h-auto p-3 justify-start"
                          onClick={() => handleQuickTopic(topic)}
                        >
                          <span className="text-sm">{topic}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Question Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ask Your Question</CardTitle>
                    <CardDescription>
                      Describe what you need help understanding or clarifying
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject/Topic</label>
                      <Input
                        placeholder="e.g., JavaScript, Database Design, Algorithms..."
                        value={newQuery.subject}
                        onChange={(e) => setNewQuery(prev => ({ ...prev, subject: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Question</label>
                      <Textarea
                        placeholder="Describe what you need help understanding. Be specific about which concepts are unclear or what you're struggling with..."
                        className="min-h-32"
                        value={newQuery.question}
                        onChange={(e) => setNewQuery(prev => ({ ...prev, question: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Upload Assignment (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex gap-2">
                            <Upload className="h-6 w-6 text-gray-400" />
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                            <FileText className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600">
                            Drop your assignment files here or <span className="text-blue-600">browse</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Supported: PDF, DOC, TXT, JPG, PNG (Max 10MB each)
                          </p>
                        </div>
                      </div>
                      {selectedFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText className="h-4 w-4" />
                              <span>{file.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={handleSubmitQuery}
                        disabled={!newQuery.question.trim()}
                        className="flex-1"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Ask Hannah
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat Instead
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {queries.map((query) => (
                  <Card key={query.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{query.subject}</Badge>
                            <Badge className={query.status === "answered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {query.status === "answered" ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Answered
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </>
                              )}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{query.question}</CardTitle>
                          <CardDescription>
                            Asked {query.createdAt.toLocaleDateString()} at {query.createdAt.toLocaleTimeString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    {query.response && (
                      <CardContent>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">H</span>
                            </div>
                            <span className="font-medium text-blue-900">Hannah's Response</span>
                          </div>
                          <p className="text-blue-800 text-sm leading-relaxed">{query.response}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Follow Up
                          </Button>
                          <Button variant="outline" size="sm">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Related Resources
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}

                {queries.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                    <p className="text-gray-500">Start by asking your first question!</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Effective Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-2">
                        <p>• Be specific about what you don't understand</p>
                        <p>• Include relevant context and background</p>
                        <p>• Ask about concepts, not for direct answers</p>
                        <p>• Mention what you've already tried</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        Study Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-2">
                        <p>• Break complex problems into smaller parts</p>
                        <p>• Practice with similar examples</p>
                        <p>• Explain concepts in your own words</p>
                        <p>• Connect new knowledge to what you know</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Academic Integrity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-2">
                        <p>• Use Hannah for understanding, not copying</p>
                        <p>• Always cite sources and assistance</p>
                        <p>• Focus on learning the process</p>
                        <p>• Ask for guidance, not solutions</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-purple-500" />
                        Getting Better Help
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-2">
                        <p>• Provide code snippets or examples</p>
                        <p>• Describe your thought process</p>
                        <p>• Ask follow-up questions</p>
                        <p>• Request additional resources</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
