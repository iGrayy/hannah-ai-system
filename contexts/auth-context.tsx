"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type UserRole = "admin" | "faculty" | "student"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  registerStudent: (params: { name: string; email: string; password: string }) => Promise<boolean>
  requestPasswordReset: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo - Enhanced user data with clearer role assignment
const mockUsers: User[] = [
  {
    id: "1",
    name: "Người dùng Quản trị",
    email: "admin@hannah.edu",
    role: "admin", // Default admin role for admin login
    avatar: "/faculty-avatar.jpg",
  },
  {
    id: "2",
    name: "Dr. Nguyen Van A",
    email: "faculty@hannah.edu",
    role: "faculty", // Default faculty role for faculty login
    avatar: "/faculty-avatar.jpg",
  },
  {
    id: "3",
    name: "Nguyen Van B",
    email: "student@hannah.edu",
    role: "student", // Student role for student login
    avatar: "/student-avatar.jpg",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("hannah-user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        console.log("[v0] Restored user from localStorage:", parsedUser.role)
        setUser(parsedUser)
      }
    } catch (error) {
      console.log("[v0] Error parsing stored user, clearing localStorage")
      localStorage.removeItem("hannah-user")
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      console.log("[v0] Syncing user to localStorage:", user.role)
      localStorage.setItem("hannah-user", JSON.stringify(user))
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication - in real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email)

    if (foundUser && password === "123456") {
      console.log(`[v0] User logged in: ${foundUser.email} with default role: ${foundUser.role}`)

      const userWithRole = {
        ...foundUser,
        role: foundUser.email.includes("admin") ? ("admin" as UserRole) :
              foundUser.email.includes("student") ? ("student" as UserRole) :
              ("faculty" as UserRole),
      }

      console.log(`[v0] Final role assigned: ${userWithRole.role}`)
      setUser(userWithRole)
      setIsLoading(false)
      return true
    }

    console.log("[v0] Login failed - invalid credentials")
    setIsLoading(false)
    return false
  }

  // Đăng ký (chỉ cho student) - mô phỏng
  const registerStudent: AuthContextType["registerStudent"] = async ({ name, email, password }) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mật khẩu demo tối thiểu 6 ký tự
      if (!email || !password || password.length < 6) {
        setIsLoading(false)
        return false
      }

      const newStudent: User = {
        id: Math.random().toString(36).slice(2),
        name: name || email.split("@")[0],
        email,
        role: "student",
        avatar: "/placeholder-user.jpg",
      }

      // Lưu localStorage danh sách student đã đăng ký (mô phỏng backend)
      const stored = localStorage.getItem("hannah-registered-students")
      const list: User[] = stored ? JSON.parse(stored) : []
      const exists = list.some((u) => u.email === email)
      if (exists) {
        setIsLoading(false)
        return false
      }
      const updated = [...list, newStudent]
      localStorage.setItem("hannah-registered-students", JSON.stringify(updated))

      // Tự động đăng nhập sau khi đăng ký
      setUser(newStudent)
      setIsLoading(false)
      return true
    } catch (e) {
      setIsLoading(false)
      return false
    }
  }

  // Quên mật khẩu - mô phỏng gửi email reset
  const requestPasswordReset: AuthContextType["requestPasswordReset"] = async (email: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Kiểm tra tồn tại trong mock hoặc danh sách đã đăng ký
      const inMock = mockUsers.some((u) => u.email === email)
      const stored = localStorage.getItem("hannah-registered-students")
      const list: User[] = stored ? JSON.parse(stored) : []
      const inRegistered = list.some((u) => u.email === email)

      setIsLoading(false)
      return inMock || inRegistered
    } catch (e) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    console.log("[v0] User logged out")
    setUser(null)
    localStorage.removeItem("hannah-user")
    window.location.href = "/"
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, registerStudent, requestPasswordReset }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
