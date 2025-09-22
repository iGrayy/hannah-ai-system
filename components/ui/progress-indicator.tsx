"use client"

import * as React from "react"
import { Check, Clock, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Step {
  id: string
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed" | "error"
  optional?: boolean
}

interface ProgressIndicatorProps {
  steps: Step[]
  currentStep?: string
  orientation?: "horizontal" | "vertical"
  showProgress?: boolean
  className?: string
}

export function ProgressIndicator({
  steps,
  currentStep,
  orientation = "horizontal",
  showProgress = true,
  className,
}: ProgressIndicatorProps) {
  const currentStepIndex = currentStep ? steps.findIndex(step => step.id === currentStep) : -1
  const completedSteps = steps.filter(step => step.status === "completed").length
  const progressPercentage = (completedSteps / steps.length) * 100

  const getStepIcon = (step: Step, index: number) => {
    switch (step.status) {
      case "completed":
        return <Check className="h-4 w-4 text-white" />
      case "in-progress":
        return <Loader2 className="h-4 w-4 text-white animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-white" />
      default:
        return <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
    }
  }

  const getStepColor = (step: Step) => {
    switch (step.status) {
      case "completed":
        return "bg-green-500 border-green-500"
      case "in-progress":
        return "bg-blue-500 border-blue-500"
      case "error":
        return "bg-red-500 border-red-500"
      default:
        return "bg-muted border-muted-foreground/20"
    }
  }

  const getConnectorColor = (fromStep: Step, toStep: Step) => {
    if (fromStep.status === "completed") {
      return "bg-green-500"
    }
    return "bg-muted"
  }

  if (orientation === "vertical") {
    return (
      <div className={cn("space-y-4", className)}>
        {showProgress && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedSteps} of {steps.length} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  getStepColor(step)
                )}
              >
                {getStepIcon(step, index)}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mt-2 h-8 w-0.5",
                    getConnectorColor(step, steps[index + 1])
                  )}
                />
              )}
            </div>
            <div className="flex-1 min-w-0 pb-8">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium">{step.title}</h3>
                {step.optional && (
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                )}
                <Badge
                  variant={
                    step.status === "completed"
                      ? "default"
                      : step.status === "error"
                      ? "destructive"
                      : step.status === "in-progress"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {step.status.replace("-", " ")}
                </Badge>
              </div>
              {step.description && (
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Horizontal orientation
  return (
    <div className={cn("w-full", className)}>
      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps} of {steps.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}

      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-2">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2",
                  getStepColor(step)
                )}
              >
                {getStepIcon(step, index)}
              </div>
              <div className="text-center max-w-24">
                <div className="flex items-center justify-center space-x-1">
                  <h3 className="text-xs font-medium truncate">{step.title}</h3>
                  {step.optional && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      Opt
                    </Badge>
                  )}
                </div>
                <Badge
                  variant={
                    step.status === "completed"
                      ? "default"
                      : step.status === "error"
                      ? "destructive"
                      : step.status === "in-progress"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs mt-1"
                >
                  {step.status.replace("-", " ")}
                </Badge>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  getConnectorColor(step, steps[index + 1])
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// Simple progress steps component
interface SimpleProgressStepsProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function SimpleProgressSteps({
  steps,
  currentStep,
  className,
}: SimpleProgressStepsProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center space-y-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2",
                index < currentStep
                  ? "bg-green-500 border-green-500"
                  : index === currentStep
                  ? "bg-blue-500 border-blue-500"
                  : "bg-muted border-muted-foreground/20"
              )}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <span className="text-sm font-medium text-muted-foreground">
                  {index + 1}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-center max-w-20 truncate">
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-2",
                index < currentStep ? "bg-green-500" : "bg-muted"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// Example usage
export function ProgressIndicatorExample() {
  const [steps, setSteps] = React.useState<Step[]>([
    {
      id: "1",
      title: "Account Setup",
      description: "Create your account and verify email",
      status: "completed",
    },
    {
      id: "2",
      title: "Profile Information",
      description: "Add your personal and academic information",
      status: "completed",
    },
    {
      id: "3",
      title: "Course Selection",
      description: "Choose your courses for the semester",
      status: "in-progress",
    },
    {
      id: "4",
      title: "Payment",
      description: "Complete tuition payment",
      status: "pending",
      optional: true,
    },
    {
      id: "5",
      title: "Confirmation",
      description: "Review and confirm your enrollment",
      status: "pending",
    },
  ])

  const simulateProgress = () => {
    setSteps(currentSteps => {
      const newSteps = [...currentSteps]
      const inProgressIndex = newSteps.findIndex(step => step.status === "in-progress")
      const pendingIndex = newSteps.findIndex(step => step.status === "pending")
      
      if (inProgressIndex !== -1) {
        newSteps[inProgressIndex].status = "completed"
        if (pendingIndex !== -1) {
          newSteps[pendingIndex].status = "in-progress"
        }
      }
      
      return newSteps
    })
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Vertical Progress Indicator</h3>
        <ProgressIndicator
          steps={steps}
          currentStep="3"
          orientation="vertical"
          showProgress={true}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Horizontal Progress Indicator</h3>
        <ProgressIndicator
          steps={steps}
          currentStep="3"
          orientation="horizontal"
          showProgress={true}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Simple Progress Steps</h3>
        <SimpleProgressSteps
          steps={["Setup", "Profile", "Courses", "Payment", "Confirm"]}
          currentStep={2}
        />
      </div>

      <button
        onClick={simulateProgress}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Simulate Progress
      </button>
    </div>
  )
}
