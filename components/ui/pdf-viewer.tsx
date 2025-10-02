"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { PDFModal } from "./pdf-modal"

interface PDFViewerProps {
  src: string
  title?: string
  className?: string
}

export function PDFViewer({ src, title = "Tài liệu PDF", className = "" }: PDFViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-gray-700">
            Phần I. Introduction
          </CardTitle>
          <Button
            variant="default"
            size="sm"
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Xem chi tiết
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full h-96 overflow-auto bg-gray-50">
          <iframe
            src={`${src}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            className="w-full h-full border-0"
            title={title}
          />
        </div>
        <div className="p-2 bg-gray-50 border-t text-xs text-gray-600 text-center">
          Click "Xem chi tiết" để mở tài liệu trong popup lớn với đầy đủ điều khiển
        </div>
      </CardContent>
      
      {/* PDF Modal */}
      <PDFModal
        src={src}
        title={title}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  )
}
