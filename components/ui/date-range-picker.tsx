"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
  placeholder = "Pick a date range",
  disabled = false,
}: DateRangePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(date)

  React.useEffect(() => {
    setSelectedDate(date)
  }, [date])

  const handleDateChange = (newDate: DateRange | undefined) => {
    setSelectedDate(newDate)
    onDateChange?.(newDate)
  }

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) {
      return placeholder
    }

    if (dateRange.from && !dateRange.to) {
      return dateRange.from.toLocaleDateString()
    }

    if (dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
    }

    return placeholder
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(selectedDate)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedDate?.from}
            selected={selectedDate}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Preset date ranges
export const dateRangePresets = {
  today: {
    label: "Today",
    range: {
      from: new Date(),
      to: new Date(),
    },
  },
  yesterday: {
    label: "Yesterday",
    range: {
      from: new Date(Date.now() - 24 * 60 * 60 * 1000),
      to: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  },
  last7Days: {
    label: "Last 7 days",
    range: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
  },
  last30Days: {
    label: "Last 30 days",
    range: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
  },
  thisMonth: {
    label: "This month",
    range: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    },
  },
  lastMonth: {
    label: "Last month",
    range: {
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    },
  },
}

// Advanced Date Range Picker with presets
interface DateRangePickerWithPresetsProps extends DateRangePickerProps {
  showPresets?: boolean
  presets?: typeof dateRangePresets
}

export function DateRangePickerWithPresets({
  className,
  date,
  onDateChange,
  placeholder = "Pick a date range",
  disabled = false,
  showPresets = true,
  presets = dateRangePresets,
}: DateRangePickerWithPresetsProps) {
  const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(date)

  React.useEffect(() => {
    setSelectedDate(date)
  }, [date])

  const handleDateChange = (newDate: DateRange | undefined) => {
    setSelectedDate(newDate)
    onDateChange?.(newDate)
  }

  const handlePresetClick = (preset: { label: string; range: DateRange }) => {
    handleDateChange(preset.range)
  }

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) {
      return placeholder
    }

    if (dateRange.from && !dateRange.to) {
      return dateRange.from.toLocaleDateString()
    }

    if (dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
    }

    return placeholder
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(selectedDate)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {showPresets && (
              <div className="border-r p-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium mb-2">Presets</h4>
                  {Object.entries(presets).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetClick(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={selectedDate?.from}
                selected={selectedDate}
                onSelect={handleDateChange}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
