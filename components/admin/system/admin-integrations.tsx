"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Database, Mail, MessageSquare, Cloud, Settings, CheckCircle, AlertCircle } from "lucide-react"

const integrations = [
  {
    id: "openai",
    name: "OpenAI GPT",
    description: "AI language model for generating responses",
    status: "connected",
    icon: Zap,
    category: "ai",
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Database and authentication service",
    status: "connected",
    icon: Database,
    category: "database",
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Email delivery service",
    status: "disconnected",
    icon: Mail,
    category: "communication",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team communication and notifications",
    status: "connected",
    icon: MessageSquare,
    category: "communication",
  },
  {
    id: "aws",
    name: "AWS S3",
    description: "Cloud storage for files and media",
    status: "disconnected",
    icon: Cloud,
    category: "storage",
  },
]

export function AdminIntegrations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integration Hub</h1>
        <p className="text-muted-foreground">Manage third-party integrations and API connections</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="ai">AI Services</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <integration.icon className="h-5 w-5" />
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                    </div>
                    <Badge
                      variant={integration.status === "connected" ? "secondary" : "outline"}
                      className={integration.status === "connected" ? "bg-green-100 text-green-800" : ""}
                    >
                      {integration.status === "connected" ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Disconnected
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Switch
                      checked={integration.status === "connected"}
                      disabled={integration.status === "disconnected"}
                    />
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                OpenAI Configuration
              </CardTitle>
              <CardDescription>Configure AI model settings and API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  defaultValue="sk-***************************"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Default Model</Label>
                <Input id="model" defaultValue="gpt-4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input id="max-tokens" type="number" defaultValue="2048" />
              </div>
              <Button>Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Supabase Configuration
              </CardTitle>
              <CardDescription>Database connection and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supabase-url">Project URL</Label>
                <Input id="supabase-url" defaultValue="https://your-project.supabase.co" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supabase-key">Anon Key</Label>
                <Input id="supabase-key" type="password" defaultValue="eyJ***************************" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Connection Status</Label>
                  <p className="text-sm text-muted-foreground">Database connection active</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <Button>Test Connection</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  SendGrid Email
                </CardTitle>
                <CardDescription>Email delivery configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sendgrid-key">API Key</Label>
                  <Input id="sendgrid-key" type="password" placeholder="SG...." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input id="from-email" type="email" placeholder="noreply@hannah.edu" />
                </div>
                <Button>Connect SendGrid</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Slack Integration
                </CardTitle>
                <CardDescription>Team notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Webhook URL</Label>
                  <Input id="slack-webhook" defaultValue="https://hooks.slack.com/services/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slack-channel">Default Channel</Label>
                  <Input id="slack-channel" defaultValue="#hannah-alerts" />
                </div>
                <Button>Update Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                AWS S3 Storage
              </CardTitle>
              <CardDescription>Cloud storage for files and media</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aws-access-key">Access Key ID</Label>
                <Input id="aws-access-key" placeholder="AKIA..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aws-secret-key">Secret Access Key</Label>
                <Input id="aws-secret-key" type="password" placeholder="..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aws-bucket">Bucket Name</Label>
                <Input id="aws-bucket" placeholder="hannah-storage" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aws-region">Region</Label>
                <Input id="aws-region" defaultValue="us-east-1" />
              </div>
              <Button>Connect AWS S3</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
