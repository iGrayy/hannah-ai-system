'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Settings
} from 'lucide-react'

interface DashboardStats {
  totalQuestions: number
  activeStudents: number
  accuracy: number
  pendingReviews: number
}

interface QuestionTrend {
  date: string
  count: number
}

interface TopTopic {
  topic: string
  count: number
  trend: 'up' | 'down' | 'stable'
}

export default function FacultyDashboardSimplified() {
  // Mock data - replace with real API calls
  const stats: DashboardStats = {
    totalQuestions: 1247,
    activeStudents: 89,
    accuracy: 87,
    pendingReviews: 12
  }

  const recentAlerts = [
    { id: 1, message: "Low accuracy detected in Database queries", severity: "warning", time: "2 hours ago" },
    { id: 2, message: "Student John Doe needs attention", severity: "info", time: "4 hours ago" },
    { id: 3, message: "New FAQ category suggested", severity: "info", time: "1 day ago" }
  ]

  const topTopics: TopTopic[] = [
    { topic: "Database Design", count: 45, trend: "up" },
    { topic: "React Components", count: 38, trend: "stable" },
    { topic: "API Integration", count: 32, trend: "down" },
    { topic: "Authentication", count: 28, trend: "up" }
  ]

  const quickActions = [
    { title: "Review Responses", icon: CheckCircle, href: "/faculty/responses", count: stats.pendingReviews },
    { title: "Manage FAQs", icon: HelpCircle, href: "/faculty/faq", count: null },
    { title: "Knowledge Base", icon: BookOpen, href: "/faculty/knowledge", count: null },
    { title: "Quality Monitor", icon: Settings, href: "/faculty/quality", count: null }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage AI teaching assistant</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents}</div>
            <p className="text-xs text-muted-foreground">+3 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
            <Progress value={stats.accuracy} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access key faculty functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = action.href}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-sm">{action.title}</span>
                {action.count && (
                  <Badge variant="destructive" className="text-xs">
                    {action.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Topics & Recent Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Question Topics</CardTitle>
            <CardDescription>Most frequently asked about</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{topic.topic}</span>
                    <Badge variant={topic.trend === 'up' ? 'default' : topic.trend === 'down' ? 'destructive' : 'secondary'}>
                      {topic.trend}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{topic.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>System notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                    alert.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
