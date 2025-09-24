"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Code,
  ExternalLink,
  Star,
  Clock,
  Users,
  Filter,
  Download,
  Play,
} from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  type: "document" | "tutorial" | "code" | "article"
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  rating: number
  views: number
  thumbnail: string
  url: string
  tags: string[]
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals Complete Guide",
    description: "Master the basics of JavaScript including variables, functions, objects, and more. Perfect for beginners starting their programming journey.",
    type: "document",
    category: "JavaScript",
    difficulty: "beginner",
    duration: "2h 30m",
    rating: 4.8,
    views: 15420,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["javascript", "fundamentals", "programming"],
  },
  {
    id: "2",
    title: "React Hooks Deep Dive",
    description: "Comprehensive tutorial on React Hooks including useState, useEffect, useContext, and custom hooks with practical examples.",
    type: "tutorial",
    category: "React",
    difficulty: "intermediate",
    duration: "1h 45m",
    rating: 4.9,
    views: 8930,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["react", "hooks", "frontend"],
  },
  {
    id: "3",
    title: "Database Design Principles",
    description: "Learn how to design efficient and scalable databases. Covers normalization, relationships, and best practices.",
    type: "document",
    category: "Database",
    difficulty: "intermediate",
    duration: "45m read",
    rating: 4.7,
    views: 12100,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["database", "sql", "design"],
  },
  {
    id: "4",
    title: "Python Data Structures Implementation",
    description: "Complete implementation of common data structures in Python with explanations and time complexity analysis.",
    type: "code",
    category: "Python",
    difficulty: "advanced",
    duration: "3h 15m",
    rating: 4.6,
    views: 6750,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["python", "data-structures", "algorithms"],
  },
  {
    id: "5",
    title: "Web Security Best Practices",
    description: "Essential security practices for web developers. Learn about HTTPS, authentication, authorization, and common vulnerabilities.",
    type: "article",
    category: "Security",
    difficulty: "intermediate",
    duration: "30m read",
    rating: 4.8,
    views: 9840,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["security", "web", "best-practices"],
  },
  {
    id: "6",
    title: "Git Version Control Mastery",
    description: "From basic commits to advanced branching strategies. Everything you need to know about Git and GitHub.",
    type: "document",
    category: "Tools",
    difficulty: "beginner",
    duration: "1h 20m",
    rating: 4.7,
    views: 18200,
    thumbnail: "/placeholder.svg",
    url: "#",
    tags: ["git", "version-control", "github"],
  },
]

const categories = ["All", "JavaScript", "React", "Python", "Database", "Security", "Tools"]
const difficulties = ["All", "beginner", "intermediate", "advanced"]
const types = ["All", "document", "tutorial", "code", "article"]

export function LearningResources() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedType, setSelectedType] = useState("All")

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || resource.difficulty === selectedDifficulty
    const matchesType = selectedType === "All" || resource.type === selectedType

    return matchesSearch && matchesCategory && matchesDifficulty && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="h-4 w-4" />
      case "tutorial": return <BookOpen className="h-4 w-4" />
      case "code": return <Code className="h-4 w-4" />
      case "article": return <FileText className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header & Search */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Learning Resources</h1>
              <p className="text-gray-600">Curated materials to enhance your learning journey</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative">
                  <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-t-lg flex items-center justify-center">
                    <Button
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-gray-800">
                      {getTypeIcon(resource.type)}
                      <span className="ml-1 capitalize">{resource.type}</span>
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </CardTitle>
                    <Badge className={getDifficultyColor(resource.difficulty)}>
                      {resource.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {resource.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {resource.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {resource.views.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {resource.rating}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
