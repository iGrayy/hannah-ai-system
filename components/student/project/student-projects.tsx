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
import { Plus, Search, Clock, FolderPlus, Settings, Trash2 } from "lucide-react"

interface ProjectItem {
  id: string
  name: string
  description: string
  updatedAt: string
}

const initialProjects: ProjectItem[] = [
  {
    id: "1",
    name: "Hannah AI",
    description: "Trợ lý học tập cho ngành Công nghệ phần mềm",
    updatedAt: "6 giờ trước",
  },
]

export function StudentProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects)
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("activity")
  const [open, setOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [settingsName, setSettingsName] = useState("")
  const [draft, setDraft] = useState({
    name: "",
    description: "",
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
      updatedAt: "vừa tạo",
    }
    setProjects(prev => [item, ...prev])
    setOpen(false)
    setDraft({ name: "", description: "" })
  }

  const openSettings = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId)
    setSelectedProjectId(projectId)
    setSettingsName(proj?.name || "")
    setSettingsOpen(true)
  }

  const renameProject = () => {
    if (!selectedProjectId) return
    setProjects(prev => prev.map(p => p.id === selectedProjectId ? { ...p, name: settingsName.trim() || p.name } : p))
    setSettingsOpen(false)
  }

  const deleteProject = () => {
    if (!selectedProjectId) return
    setProjects(prev => prev.filter(p => p.id !== selectedProjectId))
    setSettingsOpen(false)
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
                
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => openSettings(p.id)}>
                  <Settings className="h-4 w-4 mr-1" /> Cấu hình
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
            
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Hủy</Button>
              <Button onClick={createProject}>Tạo dự án</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog: rename or delete project */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cấu hình dự án</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proj-name">Đặt lại tên dự án</Label>
              <Input id="proj-name" value={settingsName} onChange={e => setSettingsName(e.target.value)} />
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setSettingsOpen(false)}>Đóng</Button>
              <div className="flex gap-2">
                <Button onClick={renameProject}>Lưu</Button>
                <Button variant="destructive" onClick={deleteProject} className="gap-1">
                  <Trash2 className="h-4 w-4" /> Xóa dự án
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


