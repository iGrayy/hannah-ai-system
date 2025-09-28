'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Flag,
  BarChart3
} from 'lucide-react'

interface QualityMetric {
  label: string
  value: number
  trend: 'up' | 'down' | 'stable'
  status: 'good' | 'warning' | 'critical'
}

interface QualityAlert {
  id: string
  message: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
  resolved: boolean
}

interface FlaggedConversation {
  id: string
  studentName: string
  topic: string
  reason: string
  timestamp: string
  status: 'pending' | 'reviewed' | 'resolved'
}

export default function QualityMonitorSimplified() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  // Mock data - replace with real API calls
  const overallAccuracy = 87
  
  const qualityMetrics: QualityMetric[] = [
    { label: 'Response Accuracy', value: 87, trend: 'up', status: 'good' },
    { label: 'Student Satisfaction', value: 92, trend: 'stable', status: 'good' },
    { label: 'Response Time', value: 78, trend: 'down', status: 'warning' },
    { label: 'Knowledge Coverage', value: 85, trend: 'up', status: 'good' }
  ]

  const recentAlerts: QualityAlert[] = [
    {
      id: '1',
      message: 'Low accuracy detected in Database queries (below 80%)',
      severity: 'high',
      timestamp: '2 hours ago',
      resolved: false
    },
    {
      id: '2',
      message: 'Multiple students asking about React hooks - knowledge gap?',
      severity: 'medium',
      timestamp: '4 hours ago',
      resolved: false
    },
    {
      id: '3',
      message: 'Response time increased by 15% today',
      severity: 'low',
      timestamp: '6 hours ago',
      resolved: true
    }
  ]

  const flaggedConversations: FlaggedConversation[] = [
    {
      id: '1',
      studentName: 'John Doe',
      topic: 'Database Design',
      reason: 'Contradictory information provided',
      timestamp: '1 hour ago',
      status: 'pending'
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      topic: 'React State',
      reason: 'Student expressed confusion',
      timestamp: '3 hours ago',
      status: 'pending'
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      topic: 'API Integration',
      reason: 'Low confidence score (45%)',
      timestamp: '5 hours ago',
      status: 'reviewed'
    }
  ]

  const timeframes = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quality Monitor</h1>
          <p className="text-muted-foreground">Monitor conversation quality and accuracy</p>
        </div>
        <div className="flex gap-2">
          {timeframes.map(timeframe => (
            <Button
              key={timeframe.value}
              variant={selectedTimeframe === timeframe.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe.value)}
            >
              {timeframe.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Overall Accuracy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Overall AI Accuracy
          </CardTitle>
          <CardDescription>Current system performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">{overallAccuracy}%</div>
            <div className="flex-1">
              <Progress value={overallAccuracy} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Target: 85% | Current: {overallAccuracy}%
              </p>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">+2% this week</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <div className="flex items-center gap-1">
                    {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                    {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                    <span className={`text-sm ${getStatusColor(metric.status)}`}>
                      {metric.value}%
                    </span>
                  </div>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts & Flagged Conversations */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Quality Alerts
            </CardTitle>
            <CardDescription>System-generated quality warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                    alert.severity === 'high' ? 'text-red-500' : 
                    alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{alert.message}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                        {alert.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      {alert.resolved && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flagged Conversations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Flagged Conversations
            </CardTitle>
            <CardDescription>Conversations requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {flaggedConversations.map((conversation) => (
                <div key={conversation.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <Flag className={`h-4 w-4 mt-0.5 ${
                    conversation.status === 'pending' ? 'text-red-500' : 'text-gray-400'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{conversation.studentName}</span>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{conversation.topic}</p>
                    <p className="text-sm">{conversation.reason}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={conversation.status === 'pending' ? 'destructive' : 'outline'} className="text-xs">
                        {conversation.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unresolved Alerts</p>
                <p className="text-2xl font-bold">{recentAlerts.filter(a => !a.resolved).length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold">{flaggedConversations.filter(c => c.status === 'pending').length}</p>
              </div>
              <Flag className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quality Score</p>
                <p className="text-2xl font-bold text-green-600">Good</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
