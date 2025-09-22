"use client"

import * as React from "react"
import { Check, Minus, Trash2, Edit, Download, Archive, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface BulkOperationsProps {
  selectedItems: string[]
  totalItems: number
  onSelectAll: (selected: boolean) => void
  onClearSelection: () => void
  actions?: BulkAction[]
  className?: string
}

interface BulkAction {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  onClick: (selectedItems: string[]) => void
  disabled?: boolean
}

export function BulkOperations({
  selectedItems,
  totalItems,
  onSelectAll,
  onClearSelection,
  actions = [],
  className,
}: BulkOperationsProps) {
  const selectedCount = selectedItems.length
  const isAllSelected = selectedCount === totalItems && totalItems > 0
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalItems

  const handleSelectAll = () => {
    onSelectAll(!isAllSelected)
  }

  if (selectedCount === 0) {
    return null
  }

  return (
    <div className={cn("flex items-center justify-between p-3 bg-muted/50 border rounded-lg", className)}>
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={isAllSelected}
          ref={(el) => {
            if (el) el.indeterminate = isPartiallySelected
          }}
          onCheckedChange={handleSelectAll}
        />
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {selectedCount} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-6 px-2 text-xs"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {actions.slice(0, 3).map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "outline"}
            size="sm"
            onClick={() => action.onClick(selectedItems)}
            disabled={action.disabled}
            className="h-8"
          >
            {action.icon && <action.icon className="h-4 w-4 mr-1" />}
            {action.label}
          </Button>
        ))}

        {actions.length > 3 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.slice(3).map((action, index) => (
                <React.Fragment key={action.id}>
                  {index === 0 && actions.length > 3 && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={() => action.onClick(selectedItems)}
                    disabled={action.disabled}
                  >
                    {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </DropdownMenuItem>
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

// Hook for managing bulk selection
export function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])

  const handleSelectItem = (itemId: string, selected: boolean) => {
    setSelectedItems((prev) =>
      selected
        ? [...prev, itemId]
        : prev.filter((id) => id !== itemId)
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedItems(selected ? items.map((item) => item.id) : [])
  }

  const handleClearSelection = () => {
    setSelectedItems([])
  }

  const isItemSelected = (itemId: string) => selectedItems.includes(itemId)

  const getSelectedItems = () => items.filter((item) => selectedItems.includes(item.id))

  return {
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    handleClearSelection,
    isItemSelected,
    getSelectedItems,
  }
}

// Bulk selection checkbox for table rows
interface BulkSelectionCheckboxProps {
  itemId: string
  selected: boolean
  onSelectionChange: (itemId: string, selected: boolean) => void
  disabled?: boolean
}

export function BulkSelectionCheckbox({
  itemId,
  selected,
  onSelectionChange,
  disabled = false,
}: BulkSelectionCheckboxProps) {
  return (
    <Checkbox
      checked={selected}
      onCheckedChange={(checked) => onSelectionChange(itemId, !!checked)}
      disabled={disabled}
      aria-label={`Select item ${itemId}`}
    />
  )
}

// Common bulk actions
export const commonBulkActions = {
  delete: (onDelete: (ids: string[]) => void): BulkAction => ({
    id: "delete",
    label: "Delete",
    icon: Trash2,
    variant: "destructive",
    onClick: onDelete,
  }),
  
  edit: (onEdit: (ids: string[]) => void): BulkAction => ({
    id: "edit",
    label: "Edit",
    icon: Edit,
    variant: "outline",
    onClick: onEdit,
  }),
  
  export: (onExport: (ids: string[]) => void): BulkAction => ({
    id: "export",
    label: "Export",
    icon: Download,
    variant: "outline",
    onClick: onExport,
  }),
  
  archive: (onArchive: (ids: string[]) => void): BulkAction => ({
    id: "archive",
    label: "Archive",
    icon: Archive,
    variant: "outline",
    onClick: onArchive,
  }),
}

// Bulk operations toolbar for tables
interface TableBulkOperationsProps {
  selectedCount: number
  totalCount: number
  onSelectAll: (selected: boolean) => void
  onClearSelection: () => void
  actions: BulkAction[]
  className?: string
}

export function TableBulkOperations({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  actions,
  className,
}: TableBulkOperationsProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className={cn("flex items-center justify-between p-2 bg-primary/5 border-b", className)}>
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium">
          {selectedCount} of {totalCount} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-6 px-2 text-xs"
        >
          Clear selection
        </Button>
      </div>

      <div className="flex items-center space-x-1">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "ghost"}
            size="sm"
            onClick={() => action.onClick([])}
            disabled={action.disabled}
            className="h-7 px-2 text-xs"
          >
            {action.icon && <action.icon className="h-3 w-3 mr-1" />}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Example usage component
interface ExampleItem {
  id: string
  name: string
  status: string
}

interface BulkOperationsExampleProps {
  items: ExampleItem[]
}

export function BulkOperationsExample({ items }: BulkOperationsExampleProps) {
  const {
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    handleClearSelection,
    isItemSelected,
    getSelectedItems,
  } = useBulkSelection(items)

  const bulkActions: BulkAction[] = [
    commonBulkActions.delete((ids) => {
      console.log("Deleting items:", ids)
      alert(`Deleting ${ids.length} items`)
    }),
    commonBulkActions.export((ids) => {
      console.log("Exporting items:", ids)
      alert(`Exporting ${ids.length} items`)
    }),
    commonBulkActions.archive((ids) => {
      console.log("Archiving items:", ids)
      alert(`Archiving ${ids.length} items`)
    }),
  ]

  return (
    <div className="space-y-4">
      <BulkOperations
        selectedItems={selectedItems}
        totalItems={items.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        actions={bulkActions}
      />

      <div className="border rounded-lg">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 p-3 border-b last:border-b-0">
            <BulkSelectionCheckbox
              itemId={item.id}
              selected={isItemSelected(item.id)}
              onSelectionChange={handleSelectItem}
            />
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground">{item.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
