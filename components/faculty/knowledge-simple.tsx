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
  BookOpen,
  Eye
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

const categories = [
  'Programming Basics',
  'Database Design',
  'Web Development',
  'React Framework',
  'Authentication',
  'API Development',
  'Best Practices',
  'Troubleshooting'
]

export default function KnowledgeSimple() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [newItem, setNewItem] = useState({ 
    title: '', 
    content: '', 
    category: 'Programming Basics',
    tags: ''
  })

  // Mock data - replace with real API calls
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: '1',
      title: 'React Component Lifecycle',
      content: 'React components have several lifecycle methods that allow you to hook into different phases of a component\'s existence. The main phases are mounting, updating, and unmounting...',
      category: 'React Framework',
      tags: ['react', 'lifecycle', 'components'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'Database Normalization Rules',
      content: 'Database normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. The main normal forms are 1NF, 2NF, 3NF...',
      category: 'Database Design',
      tags: ['database', 'normalization', 'sql'],
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12'
    },
    {
      id: '3',
      title: 'RESTful API Design Principles',
      content: 'REST (Representational State Transfer) is an architectural style for designing networked applications. Key principles include statelessness, uniform interface...',
      category: 'API Development',
      tags: ['api', 'rest', 'http'],
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14'
    }
  ])

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddItem = () => {
    if (newItem.title.trim() && newItem.content.trim()) {
      const item: KnowledgeItem = {
        id: Date.now().toString(),
        title: newItem.title,
        content: newItem.content,
        category: newItem.category,
        tags: newItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      setKnowledgeItems([...knowledgeItems, item])
      setNewItem({ title: '', content: '', category: 'Programming Basics', tags: '' })
      setShowAddForm(false)
    }
  }

  const handleEditItem = (id: string, updatedItem: Partial<KnowledgeItem>) => {
    setKnowledgeItems(knowledgeItems.map(item => 
      item.id === id 
        ? { ...item, ...updatedItem, updatedAt: new Date().toISOString().split('T')[0] }
        : item
    ))
    setEditingId(null)
  }

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this knowledge item?')) {
      setKnowledgeItems(knowledgeItems.filter(item => item.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">Manage specialized knowledge content</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Knowledge
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge base..."
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

      {/* Add Knowledge Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Knowledge Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                placeholder="Enter knowledge title..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={newItem.content}
                onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                placeholder="Enter detailed content..."
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
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
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={newItem.tags}
                  onChange={(e) => setNewItem({...newItem, tags: e.target.value})}
                  placeholder="react, components, hooks"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddItem}>
                <Save className="h-4 w-4 mr-2" />
                Save Knowledge
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <KnowledgeCard
            key={item.id}
            item={item}
            isEditing={editingId === item.id}
            isPreview={previewId === item.id}
            onEdit={() => setEditingId(item.id)}
            onPreview={() => setPreviewId(previewId === item.id ? null : item.id)}
            onSave={(updatedItem) => handleEditItem(item.id, updatedItem)}
            onCancel={() => setEditingId(null)}
            onDelete={() => handleDeleteItem(item.id)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No knowledge items found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'Start by adding your first knowledge item'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function KnowledgeCard({ item, isEditing, isPreview, onEdit, onPreview, onSave, onCancel, onDelete }: {
  item: KnowledgeItem
  isEditing: boolean
  isPreview: boolean
  onEdit: () => void
  onPreview: () => void
  onSave: (updatedItem: Partial<KnowledgeItem>) => void
  onCancel: () => void
  onDelete: () => void
}) {
  const [editData, setEditData] = useState({
    title: item.title,
    content: item.content,
    category: item.category,
    tags: item.tags.join(', ')
  })

  if (isEditing) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Input
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            placeholder="Title"
          />
          <Textarea
            value={editData.content}
            onChange={(e) => setEditData({...editData, content: e.target.value})}
            rows={6}
            placeholder="Content"
          />
          <div className="grid grid-cols-2 gap-4">
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
            <Input
              value={editData.tags}
              onChange={(e) => setEditData({...editData, tags: e.target.value})}
              placeholder="Tags (comma-separated)"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onSave({
              ...editData,
              tags: editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            })} size="sm">
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
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{item.category}</Badge>
              {item.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
              <span className="text-xs text-muted-foreground ml-auto">Updated: {item.updatedAt}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPreview}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {(isPreview || !isPreview) && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isPreview ? item.content : `${item.content.substring(0, 150)}...`}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
