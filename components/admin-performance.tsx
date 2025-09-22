"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Activity, Server, Database, Zap, Clock, Users } from "lucide-react"

const performanceData = [
  { time: "00:00", cpu: 45, memory: 62, requests: 120 },
  { time: "04:00", cpu: 32, memory: 58, requests: 89 },
  { time: "08:00", cpu: 78, memory: 71, requests: 245 },
  { time: "12:00", cpu: 65, memory: 69, requests: 198 },
  { time: "16:00", cpu: 82, memory: 75, requests: 267 },
  { time: "20:00", cpu: 58, memory: 64, requests: 156 },
]

export function AdminPerformance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Performance Monitor</h1>
        <p className="text-muted-foreground">Real-time system performance and health metrics</p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Online
              </Badge>
              <span className="text-sm text-muted-foreground">99.9% uptime</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <Progress value={72} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CPU & Memory Usage</CardTitle>
            <CardDescription>Last 24 hours performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Volume</CardTitle>
            <CardDescription>API requests per hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Response Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Response</span>
              <span className="font-medium">245ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">95th Percentile</span>
              <span className="font-medium">892ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">99th Percentile</span>
              <span className="font-medium">1.2s</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Connections</span>
              <span className="font-medium">15/20</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Query Time (avg)</span>
              <span className="font-medium">12ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cache Hit Rate</span>
              <span className="font-medium">94.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Avg Generation Time</span>
              <span className="font-medium">1.8s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Success Rate</span>
              <span className="font-medium">98.7%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Token Usage</span>
              <span className="font-medium">2.1M/day</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
