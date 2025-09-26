"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Award,
  Flame,
  Zap,
  BarChart3,
} from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

interface LearningPath {
  id: string
  title: string
  description: string
  totalLessons: number
  completedLessons: number
  estimatedTime: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
}

interface Recommendation {
  id: string
  title: string
  description: string
  type: "lesson" | "practice" | "project" | "resource"
  priority: "high" | "medium" | "low"
  estimatedTime: string
}

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "Bước đầu",
    description: "Complete your first lesson",
    icon: "🎯",
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: "2",
    title: "Chiến binh Code",
    description: "Write 100 lines of code",
    icon: "⚔️",
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: "3",
    title: "Bậc thầy chuỗi",
    description: "Study for 7 consecutive days",
    icon: "🔥",
    progress: 5,
    maxProgress: 7,
  },
  {
    id: "4",
    title: "Ninja JavaScript",
    description: "Thành thạo cơ bản JavaScript",
    icon: "🥷",
    progress: 8,
    maxProgress: 10,
  },
]

const mockLearningPaths: LearningPath[] = [
  {
    id: "1",
    title: "Cơ bản JavaScript",
    description: "Master the basics of JavaScript programming",
    totalLessons: 15,
    completedLessons: 12,
    estimatedTime: "4 weeks",
    difficulty: "beginner",
    category: "Lập trình",
  },
  {
    id: "2",
    title: "Phát triển React",
    description: "Xây dựng ứng dụng web hiện đại với React",
    totalLessons: 20,
    completedLessons: 5,
    estimatedTime: "6 weeks",
    difficulty: "intermediate",
    category: "Frontend",
  },
  {
    id: "3",
    title: "Database Design",
    description: "Learn to design and optimize databases",
    totalLessons: 12,
    completedLessons: 0,
    estimatedTime: "3 weeks",
    difficulty: "intermediate",
    category: "Backend",
  },
]

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Complete JavaScript Arrays lesson",
    description: "You're almost done with JavaScript fundamentals. Complete the arrays lesson to unlock the next module.",
    type: "lesson",
    priority: "high",
    estimatedTime: "30 min",
  },
  {
    id: "2",
    title: "Practice: Build a Todo App",
    description: "Apply your JavaScript knowledge by building a simple todo application.",
    type: "practice",
    priority: "medium",
    estimatedTime: "2 hours",
  },
  {
    id: "3",
    title: "Read: Modern JavaScript Features",
    description: "Learn about ES6+ features to write more modern JavaScript code.",
    type: "resource",
    priority: "low",
    estimatedTime: "45 min",
  },
]

export function ProgressTracking() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const overallProgress = 68
  const currentStreak = 5
  const totalAchievements = mockAchievements.filter(a => a.unlockedAt).length
  const weeklyGoal = 10 // hours
  const weeklyProgress = 7.5

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50"
      case "medium": return "border-l-yellow-500 bg-yellow-50"
      case "low": return "border-l-blue-500 bg-blue-50"
      default: return "border-l-gray-500 bg-gray-50"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson": return <BookOpen className="h-4 w-4" />
      case "practice": return <Target className="h-4 w-4" />
      case "project": return <Zap className="h-4 w-4" />
      case "resource": return <Star className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="h-full bg-gray-50">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Theo dõi tiến độ</h1>
                <p className="text-gray-600">Theo dõi hành trình học tập và thành tích của bạn</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span className="text-2xl font-bold text-gray-900">{currentStreak}</span>
                  </div>
                  <p className="text-sm text-gray-500">Chuỗi ngày học</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900">{totalAchievements}</span>
                  </div>
                  <p className="text-sm text-gray-500">Thành tích</p>
                </div>
              </div>
            </div>

            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="paths">Lộ trình học</TabsTrigger>
              <TabsTrigger value="achievements">Thành tích</TabsTrigger>
              <TabsTrigger value="recommendations">Gợi ý cho bạn</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="overview" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Progress Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tiến độ tổng thể</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{overallProgress}%</div>
                      <Progress value={overallProgress} className="mt-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        Tiến bộ tuyệt vời! Tiếp tục nhé!
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Mục tiêu tuần</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{weeklyProgress}h</div>
                      <Progress value={(weeklyProgress / weeklyGoal) * 100} className="mt-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {weeklyProgress} trên {weeklyGoal} giờ trong tuần
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Chuỗi hiện tại</CardTitle>
                      <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentStreak} ngày</div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Chuỗi dài nhất của bạn: 12 ngày
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Thành tích</CardTitle>
                      <Award className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalAchievements}</div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Còn {mockAchievements.length - totalAchievements} để mở khóa
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                    <CardTitle>Hoạt động gần đây</CardTitle>
                    <CardDescription>Hoạt động học tập trong tuần qua</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Hoàn thành bài "JavaScript Functions"</p>
                          <p className="text-xs text-gray-500">2 giờ trước</p>
                        </div>
                        <Badge variant="outline">+50 XP</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Bắt đầu mô-đun "React Components"</p>
                          <p className="text-xs text-gray-500">1 ngày trước</p>
                        </div>
                        <Badge variant="outline">New</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Mở khóa thành tích "Code Warrior"</p>
                          <p className="text-xs text-gray-500">2 ngày trước</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">🏆 Achievement</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="paths" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {mockLearningPaths.map((path) => (
                  <Card key={path.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {path.title}
                            <Badge className={getDifficultyColor(path.difficulty)}>
                              {path.difficulty}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {path.description}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {Math.round((path.completedLessons / path.totalLessons) * 100)}%
                          </p>
                          <p className="text-sm text-gray-500">Hoàn thành</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Progress value={(path.completedLessons / path.totalLessons) * 100} />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{path.completedLessons}/{path.totalLessons} bài đã hoàn thành</span>
                          <span>Ước tính {path.estimatedTime}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">
                            {path.completedLessons === 0 ? "Bắt đầu học" : "Tiếp tục"}
                          </Button>
                          <Button variant="outline" size="sm">
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockAchievements.map((achievement) => (
                    <Card key={achievement.id} className={`${achievement.unlockedAt ? 'border-yellow-200 bg-yellow-50' : 'opacity-60'}`}>
                      <CardHeader className="text-center">
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        {achievement.unlockedAt ? (
                          <div>
                            <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                              <Trophy className="h-3 w-3 mr-1" />
                              Unlocked
                            </Badge>
                            <p className="text-xs text-gray-500">
                              {achievement.unlockedAt.toLocaleDateString()}
                            </p>
                          </div>
                        ) : achievement.progress !== undefined ? (
                          <div>
                            <Progress value={(achievement.progress! / achievement.maxProgress!) * 100} className="mb-2" />
                            <p className="text-sm text-gray-600">
                              {achievement.progress} / {achievement.maxProgress}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="outline">Locked</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Recommended for You</h2>
                  <p className="text-gray-600">Personalized suggestions based on your progress and goals</p>
                </div>

                {mockRecommendations.map((rec) => (
                  <Card key={rec.id} className={`border-l-4 ${getPriorityColor(rec.priority)}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getTypeIcon(rec.type)}
                          <div>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {rec.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className="capitalize">
                            {rec.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {rec.estimatedTime}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex gap-2">
                          <Button size="sm">Bắt đầu ngay</Button>
                          <Button variant="outline" size="sm">Lưu để sau</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
