"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Calendar,
  DollarSign,
  BookOpen,
  School,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  helpful: number
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
}

const mockFAQs: FAQItem[] = [
  {
    id: "1",
    question: "How do I pay my tuition fees?",
    answer: "You can pay tuition fees through the student portal, bank transfer, or at the finance office. Payment deadlines are typically at the beginning of each semester. Late payments may incur additional fees.",
    category: "Finance",
    tags: ["tuition", "payment", "fees"],
    helpful: 45,
  },
  {
    id: "2",
    question: "When are the final exams scheduled?",
    answer: "Final exams are typically scheduled during the last two weeks of each semester. The exact schedule is published 4 weeks before the exam period. Check the academic calendar for specific dates.",
    category: "Exams",
    tags: ["exams", "schedule", "finals"],
    helpful: 38,
  },
  {
    id: "3",
    question: "How do I register for courses?",
    answer: "Course registration opens during the designated registration period each semester. Log into the student portal, browse available courses, and add them to your schedule. Some courses may have prerequisites.",
    category: "Registration",
    tags: ["registration", "courses", "enrollment"],
    helpful: 52,
  },
  {
    id: "4",
    question: "What are the library hours?",
    answer: "The library is open Monday-Friday 8:00 AM - 10:00 PM, Saturday 9:00 AM - 6:00 PM, and Sunday 12:00 PM - 8:00 PM. Hours may vary during holidays and exam periods.",
    category: "Facilities",
    tags: ["library", "hours", "study"],
    helpful: 29,
  },
]

const quickActions: QuickAction[] = [
  {
    id: "1",
    title: "Exam Schedule",
    description: "View upcoming exam dates and times",
    icon: Calendar,
    action: () => alert("📅 Opening exam schedule..."),
  },
  {
    id: "2",
    title: "Tuition Fees",
    description: "Check fee status and payment options",
    icon: DollarSign,
    action: () => alert("💰 Opening fee information..."),
  },
  {
    id: "3",
    title: "Academic Calendar",
    description: "Important dates and deadlines",
    icon: BookOpen,
    action: () => alert("📚 Opening academic calendar..."),
  },
  {
    id: "4",
    title: "Course Catalog",
    description: "Browse available courses",
    icon: School,
    action: () => alert("🏫 Opening course catalog..."),
  },
  {
    id: "5",
    title: "Student Services",
    description: "Contact information and services",
    icon: Phone,
    action: () => alert("📞 Opening contact directory..."),
  },
  {
    id: "6",
    title: "Regulations",
    description: "Academic policies and rules",
    icon: FileText,
    action: () => alert("📋 Opening academic regulations..."),
  },
]

const chatShortcuts = [
  "Exam dates",
  "Payment deadline", 
  "Course registration",
  "Library hours",
  "Contact admin",
  "Academic calendar",
]

export function AcademicInfo() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", ...Array.from(new Set(mockFAQs.map(faq => faq.category)))]

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleChatShortcut = (shortcut: string) => {
    alert(`💬 Starting chat about: ${shortcut}`)
  }

  return (
    <div className="h-full bg-gray-50">
      <Tabs defaultValue="faq" className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Academic Information</h1>
                <p className="text-gray-600">Find answers to common questions and important information</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>

            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="quick">Quick Access</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="faq" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search FAQ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === "all" ? "All" : category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Chat Shortcuts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-500" />
                      Quick Chat Topics
                    </CardTitle>
                    <CardDescription>
                      Click to start a conversation with Hannah about these topics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {chatShortcuts.map((shortcut, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleChatShortcut(shortcut)}
                          className="text-sm"
                        >
                          💬 {shortcut}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <Card key={faq.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{faq.question}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{faq.category}</Badge>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{faq.helpful} found helpful</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {faq.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              👍 Helpful
                            </Button>
                            <Button variant="outline" size="sm">
                              💬 Ask Hannah
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredFAQs.length === 0 && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-500">Try adjusting your search or ask Hannah directly</p>
                      <Button className="mt-4">
                        💬 Chat with Hannah
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quick" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quickActions.map((action) => (
                    <Card key={action.id} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={action.action}>
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
                          <action.icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <Button variant="outline" size="sm" className="group-hover:border-blue-500 group-hover:text-blue-600">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <School className="h-5 w-5 text-blue-500" />
                        Academic Office
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>+84 (0)24 3869 2008</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>academic@university.edu.vn</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>Room 101, Administration Building</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        Finance Office
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>+84 (0)24 3869 2009</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>finance@university.edu.vn</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>Room 205, Administration Building</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Mon-Fri: 8:00 AM - 4:30 PM</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        Student Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>+84 (0)24 3869 2010</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>services@university.edu.vn</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>Room 150, Student Center</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Mon-Fri: 8:30 AM - 5:30 PM</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        Emergency Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>+84 (0)24 3869 2000</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>emergency@university.edu.vn</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>Security Office, Main Gate</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>24/7 Available</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Emergency Banner */}
                <Card className="mt-6 border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-900">Emergency Situations</p>
                        <p className="text-sm text-red-700">
                          For urgent matters outside office hours, call the emergency hotline or contact campus security.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
