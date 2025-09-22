"use client"

import * as React from "react"
import { Upload, X, File, Image, FileText, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  onFileRemove?: (index: number) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  maxFiles?: number
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

interface UploadedFile {
  file: File
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  accept,
  multiple = false,
  maxSize = 10, // 10MB default
  maxFiles = 5,
  disabled = false,
  className,
  children,
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    return null
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles: File[] = []
    const errors: string[] = []

    fileArray.forEach((file) => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    if (maxFiles && uploadedFiles.length + validFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`)
      return
    }

    if (errors.length > 0) {
      alert(errors.join("\n"))
      return
    }

    // Simulate upload progress
    const newUploadedFiles = validFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }))

    setUploadedFiles((prev) => [...prev, ...newUploadedFiles])

    // Simulate upload progress
    newUploadedFiles.forEach((uploadedFile, index) => {
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.file === uploadedFile.file
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        )
      }, 100)

      setTimeout(() => {
        clearInterval(interval)
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.file === uploadedFile.file
              ? { ...f, progress: 100, status: "success" }
              : f
          )
        )
      }, 1000)
    })

    onFileSelect(validFiles)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return
    handleFiles(e.target.files)
  }

  const handleRemove = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    onFileRemove?.(index)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="h-4 w-4" />
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4" />
    if (file.type.includes("pdf") || file.type.includes("document"))
      return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "hover:border-primary/50 cursor-pointer"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        {children || (
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {dragActive ? "Drop files here" : "Upload files"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop files here, or click to select files
            </p>
            <Button variant="outline" size="sm" disabled={disabled}>
              Choose Files
            </Button>
            {(accept || maxSize) && (
              <p className="text-xs text-muted-foreground mt-2">
                {accept && `Accepted formats: ${accept}`}
                {accept && maxSize && " • "}
                {maxSize && `Max size: ${maxSize}MB`}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {uploadedFiles.map((uploadedFile, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 border rounded-lg"
            >
              {getFileIcon(uploadedFile.file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(uploadedFile.file.size)}
                </p>
                {uploadedFile.status === "uploading" && (
                  <Progress value={uploadedFile.progress} className="mt-1" />
                )}
                {uploadedFile.status === "error" && (
                  <p className="text-xs text-destructive mt-1">
                    {uploadedFile.error}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(index)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Simple file upload for single file
interface SimpleFileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSize?: number
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function SimpleFileUpload({
  onFileSelect,
  accept,
  maxSize = 10,
  disabled = false,
  placeholder = "Choose file...",
  className,
}: SimpleFileUploadProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    if (file && maxSize && file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleRemove = () => {
    setSelectedFile(null)
    onFileSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="flex-1"
      >
        <Upload className="h-4 w-4 mr-2" />
        {selectedFile ? selectedFile.name : placeholder}
      </Button>
      
      {selectedFile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  )
}
