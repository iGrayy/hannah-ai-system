"use client"

import * as React from "react"
import { ChevronRight, ChevronDown, GripVertical, Plus, Edit, Trash2, Folder, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  type?: "folder" | "item"
  data?: any
}

interface SortableTreeProps {
  data: TreeNode[]
  onDataChange?: (data: TreeNode[]) => void
  onNodeSelect?: (node: TreeNode) => void
  onNodeAdd?: (parentId: string | null) => void
  onNodeEdit?: (node: TreeNode) => void
  onNodeDelete?: (node: TreeNode) => void
  selectedNodeId?: string
  className?: string
}

interface TreeItemProps {
  node: TreeNode
  level: number
  onToggle: (nodeId: string) => void
  onSelect: (node: TreeNode) => void
  onAdd?: (parentId: string) => void
  onEdit?: (node: TreeNode) => void
  onDelete?: (node: TreeNode) => void
  isExpanded: boolean
  isSelected: boolean
  isDragging?: boolean
  onDragStart?: (node: TreeNode) => void
  onDragEnd?: () => void
  onDrop?: (draggedNode: TreeNode, targetNode: TreeNode) => void
}

function TreeItem({
  node,
  level,
  onToggle,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  isExpanded,
  isSelected,
  isDragging,
  onDragStart,
  onDragEnd,
  onDrop,
}: TreeItemProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editName, setEditName] = React.useState(node.name)
  const [dragOver, setDragOver] = React.useState(false)

  const hasChildren = node.children && node.children.length > 0
  const isFolder = node.type === "folder" || hasChildren

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", node.id)
    onDragStart?.(node)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const draggedNodeId = e.dataTransfer.getData("text/plain")
    if (draggedNodeId !== node.id) {
      // Handle drop logic here
      console.log(`Dropped ${draggedNodeId} onto ${node.id}`)
    }
  }

  const handleEditSubmit = () => {
    if (editName.trim() && editName !== node.name) {
      onEdit?.({ ...node, name: editName.trim() })
    }
    setIsEditing(false)
    setEditName(node.name)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditName(node.name)
  }

  return (
    <div className="select-none">
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors",
              isSelected && "bg-accent",
              dragOver && "bg-primary/10 border-primary border-dashed border-2",
              isDragging && "opacity-50"
            )}
            style={{ paddingLeft: `${level * 20 + 8}px` }}
            onClick={() => onSelect(node)}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
            
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggle(node.id)
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div className="w-4" />
            )}

            {isFolder ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )
            ) : (
              <div className="h-4 w-4 rounded-sm bg-muted border" />
            )}

            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleEditSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditSubmit()
                  if (e.key === "Escape") handleEditCancel()
                }}
                className="h-6 text-sm flex-1"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm flex-1 truncate">{node.name}</span>
            )}
          </div>
        </ContextMenuTrigger>
        
        <ContextMenuContent>
          {isFolder && (
            <ContextMenuItem onClick={() => onAdd?.(node.id)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => onDelete?.(node)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeItemContainer
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onSelect={onSelect}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              isExpanded={false} // Will be determined by parent
              isSelected={false} // Will be determined by parent
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Container component to handle expanded/selected state
function TreeItemContainer(props: Omit<TreeItemProps, "isExpanded" | "isSelected">) {
  // This would typically come from parent state
  const isExpanded = false // Placeholder
  const isSelected = false // Placeholder
  
  return (
    <TreeItem
      {...props}
      isExpanded={isExpanded}
      isSelected={isSelected}
    />
  )
}

export function SortableTree({
  data,
  onDataChange,
  onNodeSelect,
  onNodeAdd,
  onNodeEdit,
  onNodeDelete,
  selectedNodeId,
  className,
}: SortableTreeProps) {
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set())
  const [draggedNode, setDraggedNode] = React.useState<TreeNode | null>(null)

  const handleToggle = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const handleDragStart = (node: TreeNode) => {
    setDraggedNode(node)
  }

  const handleDragEnd = () => {
    setDraggedNode(null)
  }

  const handleDrop = (draggedNode: TreeNode, targetNode: TreeNode) => {
    // Implement drag and drop logic here
    console.log("Drop:", draggedNode, "onto", targetNode)
  }

  return (
    <div className={cn("space-y-1", className)}>
      {data.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          level={0}
          onToggle={handleToggle}
          onSelect={onNodeSelect || (() => {})}
          onAdd={onNodeAdd}
          onEdit={onNodeEdit}
          onDelete={onNodeDelete}
          isExpanded={expandedNodes.has(node.id)}
          isSelected={selectedNodeId === node.id}
          isDragging={draggedNode?.id === node.id}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
}

// Example usage component
export function SortableTreeExample() {
  const [treeData, setTreeData] = React.useState<TreeNode[]>([
    {
      id: "1",
      name: "Documents",
      type: "folder",
      children: [
        {
          id: "1-1",
          name: "Academic Policies",
          type: "folder",
          children: [
            { id: "1-1-1", name: "Grading Policy", type: "item" },
            { id: "1-1-2", name: "Attendance Policy", type: "item" },
          ],
        },
        { id: "1-2", name: "Course Catalog", type: "item" },
      ],
    },
    {
      id: "2",
      name: "FAQ",
      type: "folder",
      children: [
        { id: "2-1", name: "General Questions", type: "item" },
        { id: "2-2", name: "Technical Support", type: "item" },
      ],
    },
    {
      id: "3",
      name: "Resources",
      type: "folder",
      children: [
        { id: "3-1", name: "Study Guides", type: "item" },
        { id: "3-2", name: "Video Tutorials", type: "item" },
      ],
    },
  ])

  const [selectedNode, setSelectedNode] = React.useState<string>()

  const handleNodeAdd = (parentId: string | null) => {
    const newNode: TreeNode = {
      id: Date.now().toString(),
      name: "New Item",
      type: "item",
    }

    if (parentId) {
      // Add as child - implement recursive update logic
      console.log("Adding child to", parentId)
    } else {
      // Add as root
      setTreeData([...treeData, newNode])
    }
  }

  const handleNodeEdit = (node: TreeNode) => {
    // Implement edit logic
    console.log("Editing node", node)
  }

  const handleNodeDelete = (node: TreeNode) => {
    if (confirm(`Delete "${node.name}"?`)) {
      // Implement delete logic
      console.log("Deleting node", node)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Knowledge Base Structure</h3>
        <Button size="sm" onClick={() => handleNodeAdd(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Root Item
        </Button>
      </div>
      
      <SortableTree
        data={treeData}
        onDataChange={setTreeData}
        onNodeSelect={(node) => setSelectedNode(node.id)}
        onNodeAdd={handleNodeAdd}
        onNodeEdit={handleNodeEdit}
        onNodeDelete={handleNodeDelete}
        selectedNodeId={selectedNode}
      />
    </div>
  )
}
