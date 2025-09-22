"use client"

import * as React from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  minHeight?: number
  showToolbar?: boolean
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  disabled = false,
  className,
  minHeight = 200,
  showToolbar = true,
}: RichTextEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [selectedText, setSelectedText] = React.useState("")
  const [selectionStart, setSelectionStart] = React.useState(0)
  const [selectionEnd, setSelectionEnd] = React.useState(0)

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      setSelectionStart(start)
      setSelectionEnd(end)
      setSelectedText(value.substring(start, end))
    }
  }

  const insertText = (before: string, after: string = "") => {
    if (!textareaRef.current) return

    const start = selectionStart
    const end = selectionEnd
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    
    onChange(newText)
    
    // Set cursor position after insertion
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = start + before.length + selectedText.length + after.length
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current.focus()
      }
    }, 0)
  }

  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return

    const start = selectionStart
    const newText = value.substring(0, start) + text + value.substring(selectionEnd)
    
    onChange(newText)
    
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = start + text.length
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current.focus()
      }
    }, 0)
  }

  const formatBold = () => insertText("**", "**")
  const formatItalic = () => insertText("*", "*")
  const formatUnderline = () => insertText("<u>", "</u>")
  const formatStrikethrough = () => insertText("~~", "~~")
  const formatCode = () => insertText("`", "`")
  const formatQuote = () => insertText("> ")
  const formatUnorderedList = () => insertText("- ")
  const formatOrderedList = () => insertText("1. ")
  const formatLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      if (selectedText) {
        insertText(`[${selectedText}](${url})`)
      } else {
        insertAtCursor(`[Link text](${url})`)
      }
    }
  }
  const formatImage = () => {
    const url = prompt("Enter image URL:")
    const alt = prompt("Enter alt text (optional):") || "Image"
    if (url) {
      insertAtCursor(`![${alt}](${url})`)
    }
  }

  const formatHeading = (level: string) => {
    const hashes = "#".repeat(parseInt(level))
    insertText(`${hashes} `)
  }

  const toolbarButtons = [
    {
      group: "format",
      buttons: [
        { icon: Bold, action: formatBold, tooltip: "Bold" },
        { icon: Italic, action: formatItalic, tooltip: "Italic" },
        { icon: Underline, action: formatUnderline, tooltip: "Underline" },
        { icon: Strikethrough, action: formatStrikethrough, tooltip: "Strikethrough" },
      ],
    },
    {
      group: "lists",
      buttons: [
        { icon: List, action: formatUnorderedList, tooltip: "Bullet List" },
        { icon: ListOrdered, action: formatOrderedList, tooltip: "Numbered List" },
        { icon: Quote, action: formatQuote, tooltip: "Quote" },
        { icon: Code, action: formatCode, tooltip: "Code" },
      ],
    },
    {
      group: "insert",
      buttons: [
        { icon: Link, action: formatLink, tooltip: "Insert Link" },
        { icon: Image, action: formatImage, tooltip: "Insert Image" },
      ],
    },
  ]

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {showToolbar && (
        <div className="border-b bg-muted/50 p-2">
          <div className="flex items-center space-x-1">
            {/* Heading Selector */}
            <Select onValueChange={formatHeading}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Heading" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Heading 1</SelectItem>
                <SelectItem value="2">Heading 2</SelectItem>
                <SelectItem value="3">Heading 3</SelectItem>
                <SelectItem value="4">Heading 4</SelectItem>
                <SelectItem value="5">Heading 5</SelectItem>
                <SelectItem value="6">Heading 6</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            {/* Format Buttons */}
            {toolbarButtons.map((group, groupIndex) => (
              <React.Fragment key={group.group}>
                {group.buttons.map((button, buttonIndex) => (
                  <Button
                    key={buttonIndex}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={button.action}
                    disabled={disabled}
                    title={button.tooltip}
                  >
                    <button.icon className="h-4 w-4" />
                  </Button>
                ))}
                {groupIndex < toolbarButtons.length - 1 && (
                  <Separator orientation="vertical" className="h-6" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        onMouseUp={handleSelectionChange}
        placeholder={placeholder}
        disabled={disabled}
        className="border-0 resize-none focus-visible:ring-0"
        style={{ minHeight: `${minHeight}px` }}
      />
    </div>
  )
}

// Simple markdown preview component
interface MarkdownPreviewProps {
  content: string
  className?: string
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
      .replace(/^#{6} (.+)$/gm, "<h6>$1</h6>")
      .replace(/^#{5} (.+)$/gm, "<h5>$1</h5>")
      .replace(/^#{4} (.+)$/gm, "<h4>$1</h4>")
      .replace(/^#{3} (.+)$/gm, "<h3>$1</h3>")
      .replace(/^#{2} (.+)$/gm, "<h2>$1</h2>")
      .replace(/^#{1} (.+)$/gm, "<h1>$1</h1>")
      .replace(/^\- (.+)$/gm, "<li>$1</li>")
      .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      .replace(/\n/g, "<br>")
  }

  return (
    <div
      className={cn("prose prose-sm max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
    />
  )
}

// Rich text editor with live preview
interface RichTextEditorWithPreviewProps extends RichTextEditorProps {
  showPreview?: boolean
}

export function RichTextEditorWithPreview({
  showPreview = true,
  ...props
}: RichTextEditorWithPreviewProps) {
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">("edit")

  if (!showPreview) {
    return <RichTextEditor {...props} />
  }

  return (
    <div className={props.className}>
      <div className="flex border-b">
        <Button
          variant={activeTab === "edit" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("edit")}
        >
          Edit
        </Button>
        <Button
          variant={activeTab === "preview" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </Button>
      </div>

      {activeTab === "edit" ? (
        <RichTextEditor {...props} className="" />
      ) : (
        <div className="border rounded-b-lg p-4" style={{ minHeight: `${props.minHeight || 200}px` }}>
          <MarkdownPreview content={props.value} />
        </div>
      )}
    </div>
  )
}
