"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Database, 
  FolderTree, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  BookOpen,
  Tag,
  Users,
  BarChart3,
  FileText,
  Eye,
  GitBranch,
  Clock
} from "lucide-react"

interface KnowledgeCategory {
  id: string
  name: string
  description: string
  parentId?: string
  level: number
  itemCount: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

interface KnowledgeStructure {
  totalCategories: number
  totalItems: number
  activeCategories: number
  pendingReview: number
}

const mockCategories: KnowledgeCategory[] = [
  {
    id: "1",
    name: "Cấu trúc dữ liệu & Giải thuật",
    description: "Các khái niệm CS cốt lõi",
    level: 0,
    itemCount: 45,
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15"
  },
  {
    id: "1-1",
    name: "Mảng & Danh sách",
    description: "Cấu trúc dữ liệu tuyến tính",
    parentId: "1",
    level: 1,
    itemCount: 12,
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12"
  },
  {
    id: "1-2",
    name: "Cây & Đồ thị",
    description: "Cấu trúc dữ liệu phi tuyến",
    parentId: "1",
    level: 1,
    itemCount: 18,
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-14"
  },
  {
    id: "2",
    name: "Lập trình Hướng đối tượng",
    description: "Nguyên lý và mẫu OOP",
    level: 0,
    itemCount: 32,
    status: "active",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16"
  },
  {
    id: "3",
    name: "Hệ quản trị CSDL",
    description: "Database management systems",
    level: 0,
    itemCount: 28,
    status: "inactive",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-10"
  }
]

const mockStructure: KnowledgeStructure = {
  totalCategories: 15,
  totalItems: 247,
  activeCategories: 12,
  pendingReview: 8
}

export function KnowledgeBaseManagement() {
  const [categories, setCategories] = useState<KnowledgeCategory[]>(mockCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | null>(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    parentId: ""
  })

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
      case "inactive":
        return <Badge variant="secondary">Không hoạt động</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category: KnowledgeCategory = {
        id: Date.now().toString(),
        name: newCategory.name,
        description: newCategory.description,
        parentId: newCategory.parentId || undefined,
        level: newCategory.parentId ? 1 : 0,
        itemCount: 0,
        status: "active",
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      
      setCategories(prev => [...prev, category])
      setNewCategory({ name: "", description: "", parentId: "" })
      setIsAddingCategory(false)
    }
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      setCategories(prev => prev.filter(cat => cat.id !== id && cat.parentId !== id))
    }
  }

  const toggleCategoryStatus = (id: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id 
        ? { ...cat, status: cat.status === "active" ? "inactive" : "active" as "active" | "inactive" }
        : cat
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Knowledge Base</h1>
          <p className="text-muted-foreground">
            Quản lý cấu trúc, danh mục và tổ chức tri thức của hệ thống Hannah
          </p>
        </div>
        <Button onClick={() => setIsAddingCategory(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Tổng danh mục</span>
            </div>
            <p className="text-2xl font-bold mt-2">{mockStructure.totalCategories}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Tổng nội dung</span>
            </div>
            <p className="text-2xl font-bold mt-2">{mockStructure.totalItems}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Đang hoạt động</span>
            </div>
            <p className="text-2xl font-bold mt-2">{mockStructure.activeCategories}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Chờ duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-2">{mockStructure.pendingReview}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="structure" className="space-y-4">
        <TabsList>
          <TabsTrigger value="structure">Cấu trúc KB</TabsTrigger>
          <TabsTrigger value="categories">Quản lý danh mục</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu trúc Knowledge Base</CardTitle>
              <CardDescription>
                Xem và quản lý cấu trúc phân cấp của knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.filter(cat => cat.level === 0).map(category => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FolderTree className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="outline">{category.itemCount} items</Badge>
                        {getStatusBadge(category.status)}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    
                    {/* Subcategories */}
                    <div className="ml-6 space-y-2">
                      {categories.filter(cat => cat.parentId === category.id).map(subcat => (
                        <div key={subcat.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{subcat.name}</span>
                            <Badge variant="outline" className="text-xs">{subcat.itemCount}</Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteCategory(subcat.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý danh mục</CardTitle>
              <CardDescription>
                Thêm, sửa, xóa và quản lý trạng thái các danh mục
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm danh mục..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên danh mục</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Cấp độ</TableHead>
                    <TableHead>Số items</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Cập nhật</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {category.level > 0 && <span className="text-muted-foreground">└─</span>}
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Level {category.level}</Badge>
                      </TableCell>
                      <TableCell>{category.itemCount}</TableCell>
                      <TableCell>{getStatusBadge(category.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{category.updatedAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleCategoryStatus(category.id)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt Knowledge Base</CardTitle>
              <CardDescription>
                Cấu hình các tham số và quy tắc cho knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Độ sâu tối đa</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 cấp</SelectItem>
                      <SelectItem value="3">3 cấp</SelectItem>
                      <SelectItem value="4">4 cấp</SelectItem>
                      <SelectItem value="5">5 cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tự động phân loại</Label>
                  <Select defaultValue="enabled">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Bật</SelectItem>
                      <SelectItem value="disabled">Tắt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Quy tắc phân loại tự động</Label>
                <Textarea 
                  placeholder="Nhập các quy tắc phân loại tự động..."
                  className="min-h-[100px]"
                />
              </div>
              
              <Button>Lưu cài đặt</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Category Dialog */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm danh mục mới</DialogTitle>
            <DialogDescription>
              Tạo danh mục mới cho knowledge base
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tên danh mục *</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="VD: Cấu trúc dữ liệu"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả ngắn về danh mục..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Danh mục cha (tùy chọn)</Label>
              <Select 
                value={newCategory.parentId} 
                onValueChange={(value) => setNewCategory(prev => ({ ...prev, parentId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục cha" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(cat => cat.level === 0).map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddCategory}>
                Thêm danh mục
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
