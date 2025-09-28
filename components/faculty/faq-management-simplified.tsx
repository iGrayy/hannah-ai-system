'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  X,
  HelpCircle
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  createdAt: string
  updatedAt: string
}

const categories = [
  'General',
  'Technical',
  'Database',
  'React',
  'Authentication',
  'API',
  'Deployment'
]

export default function FAQManagementSimplified() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', category: 'General' })

  // Mock data - replace with real API calls
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'How do I connect to the database?',
      answer: 'You can connect to the database using the connection string provided in your environment variables...',
      category: 'Database',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    },
    {
      id: '2',
      question: 'What is React state management?',
      answer: 'React state management refers to how you handle and update data in your React components...',
      category: 'React',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12'
    },
    {
      id: '3',
      question: 'How to implement JWT authentication?',
      answer: 'JWT (JSON Web Token) authentication involves creating tokens for user sessions...',
      category: 'Authentication',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14'
    }
  ])

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddFAQ = () => {
    if (newFAQ.question.trim() && newFAQ.answer.trim()) {
      const faq: FAQ = {
        id: Date.now().toString(),
        question: newFAQ.question,
        answer: newFAQ.answer,
        category: newFAQ.category,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      setFaqs([...faqs, faq])
      setNewFAQ({ question: '', answer: '', category: 'General' })
      setShowAddForm(false)
    }
  }

  const handleEditFAQ = (id: string, updatedFAQ: Partial<FAQ>) => {
    setFaqs(faqs.map(faq => 
      faq.id === id 
        ? { ...faq, ...updatedFAQ, updatedAt: new Date().toISOString().split('T')[0] }
        : faq
    ))
    setEditingId(null)
  }

  const handleDeleteFAQ = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter(faq => faq.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <p className="text-muted-foreground">Manage frequently asked questions</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Add FAQ Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Question</label>
              <Input
                value={newFAQ.question}
                onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                placeholder="Enter the question..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Answer</label>
              <Textarea
                value={newFAQ.answer}
                onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                placeholder="Enter the answer..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={newFAQ.category} onValueChange={(value) => setNewFAQ({...newFAQ, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddFAQ}>
                <Save className="h-4 w-4 mr-2" />
                Save FAQ
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <FAQCard
            key={faq.id}
            faq={faq}
            isEditing={editingId === faq.id}
            onEdit={() => setEditingId(faq.id)}
            onSave={(updatedFAQ) => handleEditFAQ(faq.id, updatedFAQ)}
            onCancel={() => setEditingId(null)}
            onDelete={() => handleDeleteFAQ(faq.id)}
          />
        ))}
      </div>

      {filteredFAQs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No FAQs found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'Start by adding your first FAQ'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function FAQCard({ faq, isEditing, onEdit, onSave, onCancel, onDelete }: {
  faq: FAQ
  isEditing: boolean
  onEdit: () => void
  onSave: (updatedFAQ: Partial<FAQ>) => void
  onCancel: () => void
  onDelete: () => void
}) {
  const [editData, setEditData] = useState({
    question: faq.question,
    answer: faq.answer,
    category: faq.category
  })

  if (isEditing) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Input
            value={editData.question}
            onChange={(e) => setEditData({...editData, question: e.target.value})}
          />
          <Textarea
            value={editData.answer}
            onChange={(e) => setEditData({...editData, answer: e.target.value})}
            rows={4}
          />
          <Select value={editData.category} onValueChange={(value) => setEditData({...editData, category: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={() => onSave(editData)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={onCancel} size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-lg">{faq.question}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{faq.category}</Badge>
              <span className="text-xs text-muted-foreground">Updated: {faq.updatedAt}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{faq.answer}</p>
      </CardContent>
    </Card>
  )
}
