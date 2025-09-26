"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Clock, Users, FolderPlus, Settings, Trash2 } from "lucide-react"

type ProjectVisibility = "private" | "course" | "public"

interface ProjectItem {
  id: string
  name: string
  description: string
  visibility: ProjectVisibility
  model: string
  updatedAt: string
}

const initialProjects: ProjectItem[] = [
  {
    id: "1",
    name: "Hannah AI",
    description: "Trợ lý học tập cho ngành Công nghệ phần mềm",
    visibility: "private",
    model: "Sonnet 4",
    updatedAt: "6 giờ trước",
  },
]

export function StudentProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects)
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("activity")
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({
    name: "",
    description: "",
    visibility: "private" as ProjectVisibility,
    model: "Sonnet 4",
  })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? projects.filter(p => p.name.toLowerCase().includes(q))
      : projects
    if (sort === "activity") return list
    if (sort === "az") return [...list].sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [projects, query, sort])

  const createProject = () => {
    if (!draft.name.trim()) return
    const item: ProjectItem = {
      id: Date.now().toString(),
      name: draft.name.trim(),
      description: draft.description.trim(),
      visibility: draft.visibility,
      model: draft.model,
      updatedAt: "vừa tạo",
    }
    setProjects(prev => [item, ...prev])
    setOpen(false)
    setDraft({ name: "", description: "", visibility: "private", model: "Sonnet 4" })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Dự án</h1>
          <p className="text-sm text-muted-foreground">Tạo và quản lý các dự án học tập của bạn</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo dự án mới
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm dự án..."
            className="pl-9"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activity">Hoạt động</SelectItem>
            <SelectItem value="az">Tên (A→Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="hover:bg-accent/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">{p.description || "Không có mô tả"}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> Cập nhật {p.updatedAt}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{p.model}</Badge>
                  <Badge variant="secondary">
                    {p.visibility === "private" ? "Riêng tư" : p.visibility === "course" ? "Trong lớp" : "Công khai"}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" /> Cấu hình
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5" /> Tạo dự án mới
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên dự án</Label>
              <Input id="name" value={draft.name} onChange={e => setDraft(v => ({ ...v, name: e.target.value }))} placeholder="VD: Trợ lý môn Cấu trúc dữ liệu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Mô tả</Label>
              <Textarea id="desc" rows={3} value={draft.description} onChange={e => setDraft(v => ({ ...v, description: e.target.value }))} placeholder="Mục tiêu, phạm vi, tài liệu sẽ tham chiếu..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Chế độ hiển thị</Label>
                <Select value={draft.visibility} onValueChange={(v: ProjectVisibility) => setDraft(prev => ({ ...prev, visibility: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Riêng tư</SelectItem>
                    <SelectItem value="course">Trong lớp</SelectItem>
                    <SelectItem value="public">Công khai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mô hình AI</Label>
                <Select value={draft.model} onValueChange={(v) => setDraft(prev => ({ ...prev, model: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sonnet 4">Sonnet 4</SelectItem>
                    <SelectItem value="Haiku">Thơ Haiku</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Hủy</Button>
              <Button onClick={createProject}>Tạo dự án</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


