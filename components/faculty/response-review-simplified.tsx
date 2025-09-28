'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  CheckCircle, 
  XCircle, 
  Flag, 
  Search,
  User,
  MessageSquare,
  Clock
} from 'lucide-react'

interface PendingResponse {
  id: string
  studentName: string
  question: string
  aiResponse: string
  timestamp: string
  topic: string
  confidence: number
  flagged: boolean
}

export default function ResponseReviewSimplified() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedResponse, setSelectedResponse] = useState<PendingResponse | null>(null)
  const [reviewComment, setReviewComment] = useState('')

  // Mock data - replace with real API calls
  const pendingResponses: PendingResponse[] = [
    {
      id: '1',
      studentName: 'John Doe',
      question: 'How do I implement authentication in React?',
      aiResponse: 'To implement authentication in React, you can use libraries like Auth0, Firebase Auth, or implement your own using JWT tokens...',
      timestamp: '2024-01-15 14:30',
      topic: 'Authentication',
      confidence: 85,
      flagged: false
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      question: 'What is the difference between SQL and NoSQL databases?',
      aiResponse: 'SQL databases are relational and use structured query language, while NoSQL databases are non-relational...',
      timestamp: '2024-01-15 13:45',
      topic: 'Database',
      confidence: 92,
      flagged: false
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      question: 'How to optimize React performance?',
      aiResponse: 'React performance can be optimized through several techniques including memoization, lazy loading...',
      timestamp: '2024-01-15 12:20',
      topic: 'React',
      confidence: 78,
      flagged: true
    }
  ]

  const filteredResponses = pendingResponses.filter(response =>
    response.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    response.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    response.question.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleApprove = (responseId: string) => {
    console.log('Approving response:', responseId, 'Comment:', reviewComment)
    // API call to approve response
    setReviewComment('')
    setSelectedResponse(null)
  }

  const handleReject = (responseId: string) => {
    console.log('Rejecting response:', responseId, 'Comment:', reviewComment)
    // API call to reject response
    setReviewComment('')
    setSelectedResponse(null)
  }

  const handleFlag = (responseId: string) => {
    console.log('Flagging response for human intervention:', responseId)
    // API call to flag response
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Response Review</h1>
          <p className="text-muted-foreground">Review and approve AI responses</p>
        </div>
        <Badge variant="destructive" className="text-lg px-3 py-1">
          {pendingResponses.length} Pending
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name, topic, or question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Responses List */}
      <div className="grid gap-4">
        {filteredResponses.map((response) => (
          <Card key={response.id} className={`cursor-pointer transition-all ${
            selectedResponse?.id === response.id ? 'ring-2 ring-primary' : ''
          } ${response.flagged ? 'border-yellow-500' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {response.studentName}
                    {response.flagged && <Flag className="h-4 w-4 text-yellow-500" />}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {response.timestamp}
                    </span>
                    <Badge variant="outline">{response.topic}</Badge>
                    <Badge variant={response.confidence > 80 ? 'default' : 'secondary'}>
                      {response.confidence}% confidence
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">QUESTION:</h4>
                  <p className="text-sm">{response.question}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">AI RESPONSE:</h4>
                  <p className="text-sm bg-muted p-3 rounded">
                    {response.aiResponse.length > 200 
                      ? `${response.aiResponse.substring(0, 200)}...` 
                      : response.aiResponse
                    }
                  </p>
                </div>

                {selectedResponse?.id === response.id && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <label className="text-sm font-medium">Review Comment (optional):</label>
                      <Textarea
                        placeholder="Add your review comments..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApprove(response.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleReject(response.id)}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleFlag(response.id)}
                        className="flex items-center gap-2"
                      >
                        <Flag className="h-4 w-4" />
                        Flag for Human
                      </Button>
                    </div>
                  </div>
                )}

                {selectedResponse?.id !== response.id && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedResponse(response)}
                    className="w-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Review This Response
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResponses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No responses found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'All responses have been reviewed'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
