"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Loader2, GraduationCap, Eye, EyeOff, Mail, Lock, UserPlus, KeyRound } from "lucide-react"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { login, isLoading, registerStudent, requestPasswordReset } = useAuth()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" })
  const [forgotEmail, setForgotEmail] = useState("")
  const [actionMessage, setActionMessage] = useState("")

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (!success) {
      setError("Email hoặc mật khẩu không đúng")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Card className={`w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-lg relative z-10 transform transition-all duration-1000 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-xl transform hover:scale-110 transition-transform duration-300">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent animate-fade-in">
            Hannah AI Assistant
          </CardTitle>
          <CardDescription className="text-slate-600 mt-2 animate-fade-in-delay">
            Đăng nhập vào hệ thống quản trị thông minh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="xxxxxx@hannah.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200" />
              </div>
            </div>
            <div className="space-y-2 group">
              <Label htmlFor="password" className="text-slate-700 font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-600" />
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50/50 animate-shake">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <span>Đăng nhập vào hệ thống</span>
                  {/* <div className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200"></div> */}
                </>
              )}
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="flex-1 bg-white text-blue-700 font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-blue-200 hover:bg-blue-50 group"
                disabled={isLoading}
              >
                <UserPlus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                Đăng ký
              </Button>

              <Button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                variant="outline"
                className="flex-1 text-slate-600 font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 hover:bg-slate-50 group"
                disabled={isLoading}
              >
                <KeyRound className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                Quên MK?
              </Button>
            </div>
          </form>

          <>
            <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quên mật khẩu</DialogTitle>
                  <DialogDescription>Nhập email để nhận liên kết đặt lại mật khẩu.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input id="forgot-email" type="email" placeholder="email@hannah.edu" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                </div>
                {actionMessage && <p className="text-sm text-slate-600">{actionMessage}</p>}
                <DialogFooter>
                  <Button
                    onClick={async () => {
                      setActionMessage("")
                      const ok = await requestPasswordReset(forgotEmail)
                      setActionMessage(ok ? "Đã gửi email đặt lại mật khẩu (mô phỏng)." : "Email không tồn tại trong hệ thống.")
                      if (ok) {
                        setTimeout(() => setIsForgotOpen(false), 900)
                      }
                    }}
                    className="bg-slate-700 text-white"
                  >
                    Gửi liên kết
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo tài khoản Student</DialogTitle>
                  <DialogDescription>Chỉ áp dụng cho vai trò Student (mô phỏng).</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Họ và tên</Label>
                    <Input id="reg-name" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" type="email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} placeholder="student@hannah.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-pass">Mật khẩu</Label>
                    <Input id="reg-pass" type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} placeholder="Tối thiểu 6 ký tự" />
                  </div>
                </div>
                {actionMessage && <p className="text-sm text-slate-600">{actionMessage}</p>}
                <DialogFooter>
                  <Button
                    onClick={async () => {
                      setActionMessage("")
                      const ok = await registerStudent(registerData)
                      setActionMessage(ok ? "Đăng ký thành công! Đang đăng nhập..." : "Đăng ký thất bại. Email có thể đã tồn tại hoặc dữ liệu không hợp lệ.")
                      if (ok) {
                        setTimeout(() => setIsRegisterOpen(false), 900)
                      }
                    }}
                    className="bg-slate-700 text-white"
                  >
                    Đăng ký
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        </CardContent>
      </Card>
    </div>
  )
}
