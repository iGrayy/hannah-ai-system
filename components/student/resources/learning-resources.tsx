"use client"

import { useMemo, useState } from "react"
import { LearningChat } from "./learning-chat"
import { StudyAdvisorWidget } from "./study-advisor-widget"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Code,
  ExternalLink,
  Star,
  Clock,
  Users,
  Filter,
  Download,
  Play,
  ChevronDown,
  ChevronRight,
  GraduationCap,
} from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  type: "document" | "tutorial" | "code" | "article"
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  rating: number
  views: number
  thumbnail: string
  url: string
  tags: string[]
}

interface Subject {
  id: string
  name: string
  code: string
  credits: number
  description: string
  resources: Resource[]
  progress: number
  status: "completed" | "in-progress" | "not-started"
  isHighlighted?: boolean
  prerequisites?: string[]
}

interface RecentPost {
  id: string
  title: string
  subjectCode: string
  author: string
  date: string
  type: "exam" | "assignment" | "note"
}

interface Specialization {
  id: string
  name: string
  description: string
  subjects: Subject[]
}

interface Semester {
  id: string
  name: string
  year: number
  subjects: Subject[]
  isExpanded: boolean
  topicsCount: number
  postsCount: number
  recentPost?: RecentPost
  specializations?: Specialization[]
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "Hướng dẫn hoàn chỉnh Cơ bản JavaScript",
    description: "Master the basics of JavaScript including variables, functions, objects, and more. Perfect for beginners starting their programming journey.",
    type: "document",
    category: "JavaScript",
    difficulty: "beginner",
    duration: "2h 30m",
    rating: 4.8,
    views: 15420,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["javascript", "fundamentals", "programming"],
  },
  {
    id: "2",
    title: "Tìm hiểu sâu React Hooks",
    description: "Comprehensive tutorial on React Hooks including useState, useEffect, useContext, and custom hooks with practical examples.",
    type: "tutorial",
    category: "React",
    difficulty: "intermediate",
    duration: "1h 45m",
    rating: 4.9,
    views: 8930,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["react", "hooks", "frontend"],
  },
  {
    id: "3",
    title: "Nguyên lý Thiết kế Cơ sở dữ liệu",
    description: "Learn how to design efficient and scalable databases. Covers normalization, relationships, and best practices.",
    type: "document",
    category: "Cơ sở dữ liệu",
    difficulty: "intermediate",
    duration: "45m read",
    rating: 4.7,
    views: 12100,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["database", "sql", "design"],
  },
  {
    id: "4",
    title: "Triển khai Cấu trúc dữ liệu Python",
    description: "Complete implementation of common data structures in Python with explanations and time complexity analysis.",
    type: "code",
    category: "Python",
    difficulty: "advanced",
    duration: "3h 15m",
    rating: 4.6,
    views: 6750,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["python", "data-structures", "algorithms"],
  },
  {
    id: "5",
    title: "Thực hành tốt nhất Bảo mật Web",
    description: "Essential security practices for web developers. Learn about HTTPS, authentication, authorization, and common vulnerabilities.",
    type: "article",
    category: "Security",
    difficulty: "intermediate",
    duration: "30m read",
    rating: 4.8,
    views: 9840,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["security", "web", "best-practices"],
  },
  {
    id: "6",
    title: "Git Version Control Mastery",
    description: "From basic commits to advanced branching strategies. Everything you need to know about Git and GitHub.",
    type: "document",
    category: "Tools",
    difficulty: "beginner",
    duration: "1h 20m",
    rating: 4.7,
    views: 18200,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["git", "version-control", "github"],
  },
]

const mockSemesters: Semester[] = [
  {
    id: "sem1",
    name: "Kỳ 1",
    year: 1,
    isExpanded: false,
    topicsCount: 450,
    postsCount: 680,
    recentPost: {
      id: "post1",
      title: "Đề Thi FE",
      subjectCode: "MAE101 - SU25 - B5 - RE",
      author: "Misa",
      date: "3/9/25",
      type: "exam"
    },
    subjects: [
      {
        id: "sub1",
        name: "Introduction to computing",
        code: "CSI104",
        credits: 3,
        description: "Fundamentals of computer science and computing",
        progress: 85,
        status: "in-progress",
        resources: [mockResources[0]],
        isHighlighted: true
      },
      {
        id: "sub2",
        name: "Programming Fundamentals",
        code: "PRF192",
        credits: 4,
        description: "Basic programming concepts and problem solving",
        progress: 90,
        status: "in-progress",
        resources: [mockResources[1]],
        isHighlighted: true
      },
      {
        id: "sub3",
        name: "Mathematics for Engineering",
        code: "MAE101",
        credits: 3,
        description: "Mathematical foundations for engineering",
        progress: 75,
        status: "in-progress",
        resources: [mockResources[2]],
        isHighlighted: true
      },
      {
        id: "sub4",
        name: "Computer Organization and Architecture",
        code: "CEA201",
        credits: 3,
        description: "Computer hardware and system architecture",
        progress: 60,
        status: "in-progress",
        resources: [mockResources[3]]
      }
    ]
  },
  {
    id: "sem2",
    name: "Kỳ 2",
    year: 1,
    isExpanded: false,
    topicsCount: 420,
    postsCount: 650,
    recentPost: {
      id: "post2",
      title: "Đề Thi FE",
      subjectCode: "MAD101 - SU25 - B5 - RE",
      author: "Misa",
      date: "4/9/25",
      type: "exam"
    },
    subjects: [
      {
        id: "sub5",
        name: "Object-Oriented Programming",
        code: "PRO192",
        credits: 4,
        description: "OOP concepts and implementation",
        progress: 80,
        status: "in-progress",
        resources: [mockResources[4]],
        isHighlighted: true,
        prerequisites: ["PRF192"]
      },
      {
        id: "sub6",
        name: "Discrete mathematics",
        code: "MAD101",
        credits: 3,
        description: "Mathematical foundations for computer science",
        progress: 70,
        status: "in-progress",
        resources: [mockResources[5]],
        isHighlighted: true
      },
      {
        id: "sub7",
        name: "Operating Systems",
        code: "OSG202",
        credits: 3,
        description: "OS concepts and system programming",
        progress: 50,
        status: "in-progress",
        resources: [mockResources[0]]
      },
      {
        id: "sub8",
        name: "Computer Networking",
        code: "NWC203c",
        credits: 3,
        description: "Network protocols and communication",
        progress: 40,
        status: "in-progress",
        resources: [mockResources[1]]
      }
    ]
  },
  {
    id: "sem3",
    name: "Kỳ 3",
    year: 2,
    isExpanded: false,
    topicsCount: 380,
    postsCount: 520,
    recentPost: {
      id: "post3",
      title: "Đề Thi FE",
      subjectCode: "CSD201 - SU25 - B5 - RE",
      author: "Misa",
      date: "5/9/25",
      type: "exam"
    },
    subjects: [
      {
        id: "sub9",
        name: "Web Design",
        code: "WED201c",
        credits: 3,
        description: "Web design principles and frontend development",
        progress: 65,
        status: "in-progress",
        resources: [mockResources[5]],
        isHighlighted: true
      },
      {
        id: "sub10",
        name: "Data Structures and Algorithms",
        code: "CSD201",
        credits: 4,
        description: "Advanced data structures and algorithm design",
        progress: 55,
        status: "in-progress",
        resources: [mockResources[4]],
        isHighlighted: true,
        prerequisites: ["PRO192"]
      },
      {
        id: "sub11",
        name: "Database Systems",
        code: "DBI202",
        credits: 3,
        description: "Database design and management systems",
        progress: 45,
        status: "in-progress",
        resources: [mockResources[2]]
      },
      {
        id: "sub12",
        name: "OOP with Java Lab",
        code: "LAB211",
        credits: 2,
        description: "Practical Java programming laboratory",
        progress: 70,
        status: "in-progress",
        resources: [mockResources[3]],
        prerequisites: ["PRO192"]
      }
    ]
  },
  {
    id: "sem4",
    name: "Kỳ 4",
    year: 2,
    isExpanded: false,
    topicsCount: 320,
    postsCount: 420,
    recentPost: {
      id: "post4",
      title: "Đề Thi FE",
      subjectCode: "PRJ301 - SU25 - B5 - RE",
      author: "Misa",
      date: "6/9/25",
      type: "exam"
    },
    subjects: [
      {
        id: "sub13",
        name: "Statistics & Probability",
        code: "MAS291",
        credits: 3,
        description: "Statistical methods and probability theory",
        progress: 30,
        status: "in-progress",
        resources: [mockResources[0]],
        isHighlighted: true,
        prerequisites: ["MAE101", "MAC101"]
      },
      {
        id: "sub14",
        name: "Java Web application development",
        code: "PRJ301",
        credits: 4,
        description: "Web application development using Java",
        progress: 25,
        status: "in-progress",
        resources: [mockResources[1]],
        isHighlighted: true,
        prerequisites: ["DBI202", "PRO192"]
      }
    ]
  },
  {
    id: "sem5",
    name: "Kỳ 5",
    year: 3,
    isExpanded: false,
    topicsCount: 280,
    postsCount: 380,
    recentPost: {
      id: "post5",
      title: "Đề Thi FE",
      subjectCode: "SWP391 - SU25 - B5 - RE",
      author: "Misa",
      date: "7/9/25",
      type: "exam"
    },
    subjects: [
      {
        id: "sub15",
        name: "Software development project",
        code: "SWP391",
        credits: 4,
        description: "Capstone software development project",
        progress: 20,
        status: "in-progress",
        resources: [mockResources[4]],
        isHighlighted: true,
        prerequisites: ["SWE201c", "PRJ301"]
      },
      {
        id: "sub16",
        name: "Software Requirements",
        code: "SWR302",
        credits: 3,
        description: "Requirements engineering and analysis",
        progress: 15,
        status: "in-progress",
        resources: [mockResources[2]],
        prerequisites: ["SWE201c", "SWE102"]
      },
      {
        id: "sub17",
        name: "Software Testing",
        code: "SWT301",
        credits: 3,
        description: "Software testing methodologies and practices",
        progress: 10,
        status: "in-progress",
        resources: [mockResources[3]],
        prerequisites: ["SWE201c", "SWE102"]
      }
    ],
    specializations: [
      {
        id: "spec1",
        name: "Combo: Topic on .NET Programming",
        description: "Chủ đề lập trình .NET",
        subjects: [
          {
            id: "sub18",
            name: "Basic Cross-Platform Application Programming With .NET",
            code: "PRN212",
            credits: 3,
            description: "Cross-platform development with .NET framework",
            progress: 5,
            status: "in-progress",
            resources: [mockResources[0]],
            prerequisites: ["DBI202", "PRO192"]
          }
        ]
      },
      {
        id: "spec2",
        name: "Combo: Định hướng kỹ sư cầu nối Nhật (JS)",
        description: "Cam kết tham gia OJT tại Nhật",
        subjects: [
          {
            id: "sub19",
            name: "Japanese Bridge Engineer Orientation",
            code: "JSE301",
            credits: 3,
            description: "Orientation for Japanese bridge engineers",
            progress: 0,
            status: "not-started",
            resources: [mockResources[1]]
          }
        ]
      },
      {
        id: "spec3",
        name: "Combo: Định hướng kỹ sư cầu nối Hàn (KS)",
        description: "Korean Bridge Engineer Orientation",
        subjects: [
          {
            id: "sub20",
            name: "Korean Bridge Engineer Orientation",
            code: "KSE301",
            credits: 3,
            description: "Orientation for Korean bridge engineers",
            progress: 0,
            status: "not-started",
            resources: [mockResources[2]]
          }
        ]
      },
      {
        id: "spec4",
        name: "Combo: SE_COM10: Topic on Java",
        description: "Java chuyên sâu (Intensive Java)",
        subjects: [
          {
            id: "sub21",
            name: "Intensive Java Programming",
            code: "JAV301",
            credits: 3,
            description: "Advanced Java programming concepts",
            progress: 0,
            status: "not-started",
            resources: [mockResources[3]]
          }
        ]
      },
      {
        id: "spec5",
        name: "Combo: Topic on React/NodeJS",
        description: "Chủ đề React/NodeJS",
        subjects: [
          {
            id: "sub22",
            name: "React/NodeJS Development",
            code: "RND301",
            credits: 3,
            description: "Full-stack development with React and NodeJS",
            progress: 0,
            status: "not-started",
            resources: [mockResources[4]]
          }
        ]
      },
      {
        id: "spec6",
        name: "Combo: SAP",
        description: "SAP Enterprise Resource Planning",
        subjects: [
          {
            id: "sub23",
            name: "SAP ERP Systems",
            code: "SAP301",
            credits: 3,
            description: "SAP Enterprise Resource Planning systems",
            progress: 0,
            status: "not-started",
            resources: [mockResources[5]]
          }
        ]
      }
    ]
  },
  {
    id: "sem7",
    name: "Kỳ 7",
    year: 4,
    isExpanded: false,
    topicsCount: 200,
    postsCount: 280,
    recentPost: {
      id: "post6",
      title: "Đề Thi FE",
      subjectCode: "SWD392 - SU25 - B5 - RE",
      author: "Misa",
      date: "8/9/25",
      type: "exam"
    },
    subjects: [
      {
        id: "sub19",
        name: "Software Architecture and Design",
        code: "SWD392",
        credits: 3,
        description: "Software architecture patterns and design principles",
        progress: 0,
        status: "not-started",
        resources: [mockResources[0]],
        isHighlighted: true,
        prerequisites: ["PRO192", "SWE201c"]
      },
      {
        id: "sub20",
        name: "Advanced Cross-Platform Application Programming With .NET",
        code: "PRN222",
        credits: 3,
        description: "Advanced .NET cross-platform development",
        progress: 0,
        status: "not-started",
        resources: [mockResources[1]],
        prerequisites: ["PRN212", "PRN211"]
      },
      {
        id: "sub21",
        name: "C# Programming and Unity",
        code: "PRU212",
        credits: 3,
        description: "Game development with C# and Unity",
        progress: 0,
        status: "not-started",
        resources: [mockResources[2]],
        prerequisites: ["PRO192"]
      }
    ]
  },
  {
    id: "sem8",
    name: "Kỳ 8",
    year: 4,
    isExpanded: false,
    topicsCount: 150,
    postsCount: 200,
    recentPost: {
      id: "post7",
      title: "Đề Thi FE",
      subjectCode: "PRN232 - SU25 - B5 - RE",
      author: "Misa",
      date: "9/9/25",
      type: "exam"
    },
    subjects: [
      {
        id: "sub22",
        name: "Building Cross-Platform Back-End Application With .NET",
        code: "PRN232",
        credits: 3,
        description: "Backend development with .NET technologies",
        progress: 0,
        status: "not-started",
        resources: [mockResources[3]],
        isHighlighted: true,
        prerequisites: ["PRN221", "PRN222"]
      },
      {
        id: "sub23",
        name: "Mobile Programming",
        code: "PRM392",
        credits: 3,
        description: "Mobile application development",
        progress: 0,
        status: "not-started",
        resources: [mockResources[4]],
        prerequisites: ["PRO192"]
      },
      {
        id: "sub24",
        name: "The UI/UX Design",
        code: "WDU203c",
        credits: 3,
        description: "User interface and user experience design",
        progress: 0,
        status: "not-started",
        resources: [mockResources[5]]
      }
    ]
  }
]

const categories = ["Tất cả", "JavaScript", "React", "Python", "Database", "Security", "Tools"]
const difficulties = ["Tất cả", "beginner", "intermediate", "advanced"]
const types = ["Tất cả", "document", "tutorial", "code", "article"]

export function LearningResources() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [selectedDifficulty, setSelectedDifficulty] = useState("Tất cả")
  const [selectedType, setSelectedType] = useState("Tất cả")
  const [activeTopic, setActiveTopic] = useState<Resource | null>(null)
  const [semesters, setSemesters] = useState<Semester[]>(mockSemesters)
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null)

  const toggleSemester = (semesterId: string) => {
    setSemesters(prev => prev.map(sem => 
      sem.id === semesterId 
        ? { ...sem, isExpanded: !sem.isExpanded }
        : { ...sem, isExpanded: false }
    ))
    setSelectedSemester(selectedSemester === semesterId ? null : semesterId)
  }

  const getStatusColor = (status: string, prerequisites?: string[]) => {
    if (prerequisites && prerequisites.length > 0) {
      return "bg-red-100 text-red-800"
    }
    return "hidden"
  }

  const getStatusText = (status: string, prerequisites?: string[]) => {
    if (prerequisites && prerequisites.length > 0) {
      return `Yêu cầu: ${prerequisites.join(", ")}`
    }
    return ""
  }

  // Compute popular topics by tag frequency weighted by views
  const popularTopics = useMemo(() => {
    const score: Record<string, number> = {}
    for (const r of mockResources) {
      for (const t of r.tags) {
        const key = t.toLowerCase()
        score[key] = (score[key] || 0) + Math.max(1, Math.floor(r.views / 1000))
      }
    }
    const topics = Object.entries(score)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name]) => name)
    return topics
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="h-4 w-4" />
      case "tutorial": return <BookOpen className="h-4 w-4" />
      case "code": return <Code className="h-4 w-4" />
      case "article": return <FileText className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (activeTopic) {
    return (
      <LearningChat
        subject={activeTopic.category}
        topicId={activeTopic.id}
        topicTitle={activeTopic.title}
        onExit={() => setActiveTopic(null)}
        onNavigateToResources={() => setActiveTopic(null)}
      />
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Search & Filters */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm tài nguyên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === 'Tất cả' ? 'Tất cả' : difficulty === 'beginner' ? 'Cơ bản' : difficulty === 'intermediate' ? 'Trung cấp' : difficulty === 'advanced' ? 'Nâng cao' : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc khác
            </Button>
          </div>
          </div>

          {/* Popular topics */}
          {popularTopics.length > 0 && (
          <div className="mt-3">
              <div className="text-sm text-gray-600 mb-2">Chủ đề phổ biến</div>
              <div className="flex flex-wrap gap-2">
                {popularTopics.map((topic) => (
                  <button
                    key={topic}
                    className="px-3 py-1 text-xs rounded-full border hover:bg-gray-50 transition-colors"
                    onClick={() => setSearchTerm(topic)}
                    title={`Tìm nhanh theo chủ đề: ${topic}`}
                  >
                    #{topic}
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Semesters Vertical List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full">
          <div className="space-y-1">
            {semesters.map((semester) => (
              <div key={semester.id} className="space-y-1">
                {/* Semester Header - Horizontal Row */}
                <div 
                  className={`flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 ${
                    semester.isExpanded ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                  onClick={() => toggleSemester(semester.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{semester.name}</h3>
                      <p className="text-sm text-gray-500">Năm {semester.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {semester.subjects.length} môn
                    </Badge>
                    {semester.isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Subjects - Horizontal Scroll */}
                {semester.isExpanded && (
                  <div className="space-y-3 ml-4">
                    {/* Regular Subjects */}
                    {semester.subjects.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 px-2">
                          Các môn học trong {semester.name}:
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {semester.subjects.map((subject) => (
                            <Card key={subject.id} className="min-w-[500px] h-[280px] flex-shrink-0 hover:shadow-md transition-shadow flex flex-col">
                              {/* Fixed Header Section */}
                              <CardHeader className="pb-1 pt-3 px-3 flex-shrink-0">
                  <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base line-clamp-4 h-16 flex items-center">
                                      {subject.name}
                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                      {subject.code}
                                    </CardDescription>
                                  </div>
                                  <Badge className={getStatusColor(subject.status, subject.prerequisites)}>
                                    {getStatusText(subject.status, subject.prerequisites)}
                    </Badge>
                  </div>
                                <p className="text-sm text-gray-600 line-clamp-2 h-10 mt-2">
                                  {subject.description}
                                </p>
                </CardHeader>

                              {/* Flexible Content Section */}
                              <CardContent className="pt-1 px-3 pb-3 flex-1 flex flex-col">
                                {/* Progress Bar - Fixed Height */}
                                <div className="mb-2 flex-shrink-0">
                                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Tiến độ</span>
                                    <span>{subject.progress}%</span>
                      </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${subject.progress}%` }}
                                    ></div>
                      </div>
                    </div>


                                {/* Spacer to push button to bottom */}
                                <div className="flex-1"></div>

                                {/* Action Buttons - Fixed at Bottom */}
                                <div className="w-full flex-shrink-0">
                                  <Button 
                                    className="w-full" 
                                    size="sm" 
                                    onClick={() => {
                                      if (subject.resources.length > 0) {
                                        setActiveTopic(subject.resources[0])
                                      }
                                    }}
                                    disabled={subject.resources.length === 0}
                                  >
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Mở tài liệu
                                  </Button>
                      </div>
                              </CardContent>
                            </Card>
                    ))}
                      </div>
                    </div>
                    )}

                    {/* Specializations */}
                    {semester.specializations && semester.specializations.length > 0 && (
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700 px-2">
                          Các chuyên ngành hẹp:
                        </div>
                        {semester.specializations.map((specialization) => (
                          <div key={specialization.id} className="space-y-2">
                            <div className="text-sm font-semibold text-blue-700 px-2">
                              {specialization.name}
                            </div>
                            <div className="text-xs text-gray-600 px-2 mb-2">
                              {specialization.description}
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                              {specialization.subjects.map((subject) => (
                                <Card key={subject.id} className="min-w-[500px] h-[280px] flex-shrink-0 hover:shadow-md transition-shadow flex flex-col">
                                  {/* Fixed Header Section */}
                                  <CardHeader className="pb-1 pt-3 px-3 flex-shrink-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base line-clamp-2 h-10 flex items-center">
                                      {subject.name}
                                    </CardTitle>
                                        <CardDescription className="text-xs mt-1">
                                          {subject.code}
                                        </CardDescription>
                                      </div>
                                  <Badge className={`${getStatusColor(subject.status, subject.prerequisites)} whitespace-normal text-xs max-w-[120px]`}>
                                    {getStatusText(subject.status, subject.prerequisites)}
                                  </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 h-10 mt-2">
                                      {subject.description}
                                    </p>
                                  </CardHeader>

                                  {/* Flexible Content Section */}
                                  <CardContent className="pt-1 px-3 pb-3 flex-1 flex flex-col">
                                    {/* Progress Bar - Fixed Height */}
                                    <div className="mb-3 flex-shrink-0">
                                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Tiến độ</span>
                                        <span>{subject.progress}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                          style={{ width: `${subject.progress}%` }}
                                        ></div>
                    </div>
                  </div>


                                    {/* Spacer to push button to bottom */}
                                    <div className="flex-1"></div>

                                    {/* Action Buttons - Fixed at Bottom */}
                                    <div className="w-full flex-shrink-0">
                                      <Button 
                                        className="w-full" 
                                        size="sm" 
                                        onClick={() => {
                                          if (subject.resources.length > 0) {
                                            setActiveTopic(subject.resources[0])
                                          }
                                        }}
                                        disabled={subject.resources.length === 0}
                                      >
                      <BookOpen className="h-4 w-4 mr-2" />
                                        Mở tài liệu
                    </Button>
                  </div>
                </CardContent>
              </Card>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {semesters.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có kỳ học nào</h3>
              <p className="text-gray-500">Vui lòng liên hệ quản trị viên để được hỗ trợ</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Study Advisor */}
      <StudyAdvisorWidget />
    </div>
  )
}
