"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  showItemsPerPage?: boolean
  showInfo?: boolean
  className?: string
}

export function DataTablePagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  showInfo = true,
  className,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  return (
    <div className={`flex items-center justify-between px-2 ${className}`}>
      <div className="flex items-center space-x-6 lg:space-x-8">
        {showItemsPerPage && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${itemsPerPage}`}
              onValueChange={(value) => {
                onItemsPerPageChange(Number(value))
                onPageChange(1) // Reset to first page when changing items per page
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showInfo && (
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={!canGoPrevious}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!canGoPrevious}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!canGoNext}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(totalPages)}
            disabled={!canGoNext}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showInfo && (
        <div className="text-xs text-muted-foreground">
          {totalItems === 0 ? (
            "No items"
          ) : (
            <>
              Showing {startItem} to {endItem} of {totalItems} entries
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Hook for pagination logic
export function usePagination(totalItems: number, initialItemsPerPage: number = 20) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(initialItemsPerPage)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Reset to page 1 if current page is out of bounds
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    handleItemsPerPageChange,
  }
}

// Simple pagination component for basic use cases
interface SimplePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: SimplePaginationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        Previous
      </Button>
      
      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        Next
      </Button>
    </div>
  )
}
