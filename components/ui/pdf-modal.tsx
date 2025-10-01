"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

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
        className="max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh] p-0 m-0 rounded-lg [&>button]:!bg-transparent [&>button]:!text-white [&>button]:!border-0 [&>button]:!hover:bg-gray-100 [&>button]:!hover:text-gray-800 [&>button]:!w-6 [&>button]:!h-6 [&>button]:!rounded-none [&>button]:!shadow-none [&>button]:!z-50 [&>button]:!top-4 [&>button]:!right-12 [&>button]:!font-bold [&>button]:!text-lg [&>button]:!border-0"
        style={{
          width: '90vw',
          height: '90vh',
          maxWidth: 'none',
          maxHeight: 'none'
        }}
      >
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
