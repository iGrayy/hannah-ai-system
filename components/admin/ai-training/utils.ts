// Utility functions for AI Training components

/**
 * Format file size in bytes to human readable format
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.2 MB", "500 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }
}

/**
 * Format dataset size (number of items) to human readable format
 * @param size - Number of items/samples
 * @returns Formatted string (e.g., "1.2K mục", "500 mục")
 */
export function formatDataSize(size: number): string {
  if (size < 1000) {
    return `${size} mục`
  } else if (size < 1000000) {
    return `${(size / 1000).toFixed(1)}K mục`
  } else {
    return `${(size / 1000000).toFixed(1)}M mục`
  }
}

/**
 * Format memory usage to human readable format
 * @param sizeGB - Size in GB
 * @returns Formatted string (e.g., "2.4 GB", "512 MB")
 */
export function formatMemorySize(sizeGB: number): string {
  if (sizeGB < 1) {
    return `${(sizeGB * 1024).toFixed(0)} MB`
  } else {
    return `${sizeGB.toFixed(1)} GB`
  }
}

/**
 * Format duration in seconds to human readable format
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "2h 30m", "45m", "30s")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m`
  } else {
    return `${remainingSeconds}s`
  }
}

/**
 * Format number to human readable format with K/M suffixes
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.2K", "2.5M")
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * Get quality score color class based on score
 * @param score - Quality score (0-100)
 * @returns CSS color class
 */
export function getQualityColor(score: number): string {
  if (score >= 90) return "text-green-600"
  if (score >= 80) return "text-yellow-600"
  return "text-red-600"
}

/**
 * Calculate estimated time remaining based on progress
 * @param startTime - Start time as ISO string
 * @param progress - Progress percentage (0-100)
 * @returns Estimated time remaining string
 */
export function estimateTimeRemaining(startTime: string, progress: number): string {
  if (progress === 0) return "Đang tính..."
  
  const elapsed = Date.now() - new Date(startTime).getTime()
  const remaining = (elapsed / progress) * (100 - progress)
  const minutes = Math.floor(remaining / (1000 * 60))
  
  if (minutes < 60) {
    return `~${minutes} phút`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `~${hours}h ${remainingMinutes}m`
  }
}

/**
 * Validate training configuration
 * @param config - Training configuration object
 * @returns Validation result with errors
 */
export function validateTrainingConfig(config: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.name?.trim()) {
    errors.push("Tên training session là bắt buộc")
  }

  if (!config.description?.trim()) {
    errors.push("Mô tả là bắt buộc")
  }

  if (!config.datasetIds || config.datasetIds.length === 0) {
    errors.push("Phải chọn ít nhất 1 dataset")
  }

  if (config.learningRate <= 0) {
    errors.push("Learning rate phải > 0")
  }

  if (config.batchSize <= 0) {
    errors.push("Batch size phải > 0")
  }

  if (config.epochs <= 0) {
    errors.push("Epochs phải > 0")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate dataset upload
 * @param file - File to validate
 * @returns Validation result
 */
export function validateDatasetFile(file: File): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const maxSize = 100 * 1024 * 1024 // 100MB
  const allowedTypes = ['.json', '.csv', '.txt', '.jsonl']

  if (file.size > maxSize) {
    errors.push(`Kích thước file không được vượt quá ${formatFileSize(maxSize)}`)
  }

  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!allowedTypes.includes(extension)) {
    errors.push(`Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`)
  }

  if (file.name.length > 255) {
    errors.push("Tên file quá dài (tối đa 255 ký tự)")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate model configuration
 * @param config - Model configuration
 * @returns Validation result
 */
export function validateModelConfig(config: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.modelType) {
    errors.push("Loại mô hình là bắt buộc")
  }

  if (config.learningRate && (config.learningRate <= 0 || config.learningRate > 1)) {
    errors.push("Learning rate phải trong khoảng (0, 1]")
  }

  if (config.batchSize && config.batchSize <= 0) {
    errors.push("Batch size phải > 0")
  }

  if (config.epochs && config.epochs <= 0) {
    errors.push("Epochs phải > 0")
  }

  if (config.maxLength && config.maxLength <= 0) {
    errors.push("Max length phải > 0")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate hyperparameter values
 * @param params - Hyperparameter object
 * @returns Validation result
 */
export function validateHyperparameters(params: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Learning rate validation
  if (params.learningRate !== undefined) {
    if (params.learningRate <= 0 || params.learningRate > 1) {
      errors.push("Learning rate phải trong khoảng (0, 1]")
    }
  }

  // Batch size validation
  if (params.batchSize !== undefined) {
    if (!Number.isInteger(params.batchSize) || params.batchSize <= 0) {
      errors.push("Batch size phải là số nguyên dương")
    }
  }

  // Dropout validation
  if (params.dropout !== undefined) {
    if (params.dropout < 0 || params.dropout >= 1) {
      errors.push("Dropout phải trong khoảng [0, 1)")
    }
  }

  // Weight decay validation
  if (params.weightDecay !== undefined) {
    if (params.weightDecay < 0) {
      errors.push("Weight decay phải >= 0")
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize user input to prevent XSS
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validate email format
 * @param email - Email string
 * @returns True if valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if value is within range
 * @param value - Value to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Debounce function for input validation
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
