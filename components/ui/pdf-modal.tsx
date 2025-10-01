"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PDFModalProps {
  src: string
  title: string
  isOpen: boolean
  onClose: () => void
}

export function PDFModal({ src, title, isOpen, onClose }: PDFModalProps) {


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[98vw] max-h-[98vh] w-[98vw] h-[98vh] p-0 m-0 rounded-none"
        style={{
          position: 'fixed',
          top: '1vh',
          left: '1vw',
          width: '98vw',
          height: '98vh',
          maxWidth: 'none',
          maxHeight: 'none',
          transform: 'none'
        }}
      >
        {/* Floating mini title to save vertical space */}
        <div className="absolute top-2 left-3 z-10 text-[11px] text-gray-700 bg-white/80 backdrop-blur px-2 py-0.5 rounded border">
          Phần I. Introduction
        </div>
        
        <div className="flex-1 overflow-hidden min-h-0">
          <iframe
            src={`${src}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
            className="w-full h-full border-0 min-h-[70vh]"
            title={title}
          />
        </div>
        
      
      </DialogContent>
    </Dialog>
  )
}
