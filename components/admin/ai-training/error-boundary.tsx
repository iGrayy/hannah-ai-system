"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class TrainingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Training component error:", error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Lỗi trong thành phần Training
            </CardTitle>
            <CardDescription className="text-red-600">
              Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-red-100 p-3 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Chi tiết lỗi (Development):</h4>
                <pre className="text-xs text-red-700 overflow-auto">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={this.handleReset} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
              <Button onClick={() => window.location.reload()}>
                Tải lại trang
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// Hook for error handling in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    console.error("Training error:", error)
    setError(error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}

// Async error handler for training operations
export async function handleTrainingOperation<T>(
  operation: () => Promise<T>,
  onError?: (error: Error) => void
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error("Training operation failed:", err)
    onError?.(err)
    return null
  }
}

// Validation error class
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

// Training-specific error types
export class TrainingConfigError extends Error {
  constructor(message: string, public config?: any) {
    super(message)
    this.name = "TrainingConfigError"
  }
}

export class DatasetError extends Error {
  constructor(message: string, public datasetId?: string) {
    super(message)
    this.name = "DatasetError"
  }
}

export class ModelError extends Error {
  constructor(message: string, public modelId?: string) {
    super(message)
    this.name = "ModelError"
  }
}

// Error notification component
export function ErrorNotification({ 
  error, 
  onDismiss 
}: { 
  error: Error | null
  onDismiss: () => void 
}) {
  if (!error) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Lỗi
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-red-600 mb-3">{error.message}</p>
          <Button size="sm" variant="outline" onClick={onDismiss}>
            Đóng
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Loading state component
export function LoadingSpinner({ message = "Đang tải..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

// Retry component
export function RetryComponent({ 
  onRetry, 
  error,
  retryCount = 0,
  maxRetries = 3
}: { 
  onRetry: () => void
  error: Error
  retryCount?: number
  maxRetries?: number
}) {
  const canRetry = retryCount < maxRetries

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <span className="font-medium text-yellow-800">Thao tác thất bại</span>
        </div>
        <p className="text-sm text-yellow-700 mb-3">{error.message}</p>
        {canRetry && (
          <Button size="sm" onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại ({retryCount + 1}/{maxRetries})
          </Button>
        )}
        {!canRetry && (
          <p className="text-xs text-yellow-600">
            Đã thử {maxRetries} lần. Vui lòng liên hệ hỗ trợ.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
