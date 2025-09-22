"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RichTextEditorWithPreview } from "@/components/ui/rich-text-editor"
import { FileUpload } from "@/components/ui/file-upload"
import { BulkOperations, useBulkSelection, BulkSelectionCheckbox, commonBulkActions } from "@/components/ui/bulk-operations"
import { DataTablePagination, usePagination } from "@/components/ui/data-table-pagination"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  Download,
  Save,
  X,
  MessageSquare,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  priority: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  usageCount: number
}

const mockFAQs: FAQ[] = [
  {
    id: "1",
    question: "How do I reset my password?",
    answer: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your email.",
    category: "Account",
    tags: ["password", "login", "account"],
    priority: 1,
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    usageCount: 45,
  },
  {
    id: "2",
    question: "What are the system requirements?",
    answer: "The system requires a modern web browser (Chrome, Firefox, Safari, Edge) and a stable internet connection. No additional software installation is required.",
    category: "Technical",
    tags: ["requirements", "browser", "technical"],
    priority: 2,
    isActive: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    usageCount: 32,
  },
  {
    id: "3",
    question: "How do I contact support?",
    answer: "You can contact support through the help desk portal, email support@hannah.edu, or call our support hotline at (555) 123-4567 during business hours.",
    category: "Support",
    tags: ["support", "contact", "help"],
    priority: 1,
    isActive: true,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-22",
    usageCount: 28,
  },
]

export function CustomFAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddingFAQ, setIsAddingFAQ] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  const [newFAQ, setNewFAQ] = useState({
    question: "",
    answer: "",
    category: "",
    tags: "",
  })

  // Pagination
  const {
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
  } = usePagination(faqs.length, 10)

  // Bulk selection
  const {
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    handleClearSelection,
    isItemSelected,
  } = useBulkSelection(faqs)

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = filterCategory === "all" || faq.category === filterCategory
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && faq.isActive) ||
      (filterStatus === "inactive" && !faq.isActive)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const paginatedFAQs = filteredFAQs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAddFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      const faq: FAQ = {
        id: Date.now().toString(),
        question: newFAQ.question,
        answer: newFAQ.answer,
        category: newFAQ.category || "General",
        tags: newFAQ.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        priority: faqs.length + 1,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        usageCount: 0,
      }
      setFaqs([...faqs, faq])
      setNewFAQ({ question: "", answer: "", category: "", tags: "" })
      setIsAddingFAQ(false)
      alert("✅ FAQ added successfully!")
    }
  }

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq)
  }

  const handleUpdateFAQ = () => {
    if (editingFAQ) {
      setFaqs(faqs.map(faq => 
        faq.id === editingFAQ.id 
          ? { ...editingFAQ, updatedAt: new Date().toISOString().split('T')[0] }
          : faq
      ))
      setEditingFAQ(null)
      alert("✅ FAQ updated successfully!")
    }
  }

  const handleDeleteFAQ = (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs(faqs.filter(faq => faq.id !== id))
      alert("🗑️ FAQ deleted successfully!")
    }
  }

  const handleToggleStatus = (id: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
    ))
  }

  const handleBulkImport = (files: File[]) => {
    // Simulate CSV import
    console.log("Importing FAQ files:", files)
    alert(`📁 Importing ${files.length} file(s). This feature will process CSV files with Question, Answer, Category, Tags columns.`)
  }

  const bulkActions = [
    commonBulkActions.delete((ids) => {
      setFaqs(faqs.filter(faq => !ids.includes(faq.id)))
      handleClearSelection()
      alert(`🗑️ Deleted ${ids.length} FAQs`)
    }),
    {
      id: "activate",
      label: "Activate",
      icon: Eye,
      variant: "default" as const,
      onClick: (ids: string[]) => {
        setFaqs(faqs.map(faq => 
          ids.includes(faq.id) ? { ...faq, isActive: true } : faq
        ))
        handleClearSelection()
        alert(`✅ Activated ${ids.length} FAQs`)
      },
    },
    {
      id: "deactivate",
      label: "Deactivate",
      icon: X,
      variant: "outline" as const,
      onClick: (ids: string[]) => {
        setFaqs(faqs.map(faq => 
          ids.includes(faq.id) ? { ...faq, isActive: false } : faq
        ))
        handleClearSelection()
        alert(`❌ Deactivated ${ids.length} FAQs`)
      },
    },
    commonBulkActions.export((ids) => {
      const selectedFAQs = faqs.filter(faq => ids.includes(faq.id))
      console.log("Exporting FAQs:", selectedFAQs)
      alert(`📊 Exporting ${ids.length} FAQs to CSV...`)
    }),
  ]

  const categories = Array.from(new Set(faqs.map(faq => faq.category)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Custom FAQ Management</h1>
          <p className="text-muted-foreground">Manage frequently asked questions and custom responses</p>
        </div>
        <div className="flex gap-2">
          <FileUpload
            onFileSelect={handleBulkImport}
            accept=".csv,.xlsx,.json"
            multiple={false}
            maxSize={5}
          >
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </FileUpload>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("📊 Exporting all FAQs to CSV...")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button size="sm" onClick={() => setIsAddingFAQ(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </div>

      {/* Bulk Operations */}
      <BulkOperations
        selectedItems={selectedItems}
        totalItems={filteredFAQs.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        actions={bulkActions}
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs by question, answer, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ List */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ List ({filteredFAQs.length})</CardTitle>
          <CardDescription>Manage your frequently asked questions and custom responses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <BulkSelectionCheckbox
                    itemId="all"
                    selected={selectedItems.length === filteredFAQs.length && filteredFAQs.length > 0}
                    onSelectionChange={(_, selected) => handleSelectAll(selected)}
                  />
                </TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFAQs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell>
                    <BulkSelectionCheckbox
                      itemId={faq.id}
                      selected={isItemSelected(faq.id)}
                      onSelectionChange={handleSelectItem}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="font-medium truncate">{faq.question}</p>
                      <p className="text-sm text-muted-foreground truncate">{faq.answer}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{faq.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {faq.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {faq.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{faq.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{faq.usageCount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={faq.isActive ? "default" : "secondary"}>
                      {faq.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFAQ(faq)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(faq.id)}
                      >
                        {faq.isActive ? <X className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFAQ(faq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-4">
            <DataTablePagination
              totalItems={filteredFAQs.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add FAQ Dialog */}
      <Dialog open={isAddingFAQ} onOpenChange={setIsAddingFAQ}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
            <DialogDescription>Create a new frequently asked question and answer</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Question</label>
              <Input
                value={newFAQ.question}
                onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                placeholder="Enter the question..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Answer</label>
              <RichTextEditorWithPreview
                value={newFAQ.answer}
                onChange={(value) => setNewFAQ({ ...newFAQ, answer: value })}
                placeholder="Enter the answer..."
                minHeight={200}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={newFAQ.category} onValueChange={(value) => setNewFAQ({ ...newFAQ, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={newFAQ.tags}
                  onChange={(e) => setNewFAQ({ ...newFAQ, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingFAQ(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFAQ}>
                <Save className="h-4 w-4 mr-2" />
                Save FAQ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Dialog */}
      <Dialog open={!!editingFAQ} onOpenChange={() => setEditingFAQ(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>Update the frequently asked question and answer</DialogDescription>
          </DialogHeader>
          {editingFAQ && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question</label>
                <Input
                  value={editingFAQ.question}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Answer</label>
                <RichTextEditorWithPreview
                  value={editingFAQ.answer}
                  onChange={(value) => setEditingFAQ({ ...editingFAQ, answer: value })}
                  minHeight={200}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select 
                    value={editingFAQ.category} 
                    onValueChange={(value) => setEditingFAQ({ ...editingFAQ, category: value })}
                  >
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
                    value={editingFAQ.tags.join(", ")}
                    onChange={(e) => setEditingFAQ({ 
                      ...editingFAQ, 
                      tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                    })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingFAQ(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateFAQ}>
                  <Save className="h-4 w-4 mr-2" />
                  Update FAQ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
