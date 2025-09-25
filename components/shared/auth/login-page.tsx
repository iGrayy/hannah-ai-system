"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Loader2, GraduationCap } from "lucide-react"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading, registerStudent, requestPasswordReset } = useAuth()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" })
  const [forgotEmail, setForgotEmail] = useState("")
  const [actionMessage, setActionMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (!success) {
      setError("Email hoặc mật khẩu không đúng")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
            Hannah AI Assistant
          </CardTitle>
          <CardDescription className="text-slate-600 mt-2">
            Đăng nhập vào hệ thống quản trị thông minh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hannah.edu hoặc faculty@hannah.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu (123456)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập vào hệ thống"
              )}
            </Button>

            <Button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="w-full bg-white text-slate-700 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-300 hover:bg-slate-50 mt-3"
              disabled={isLoading}
            >
              Đăng ký (Student)
            </Button>

            <button
              type="button"
              onClick={() => setIsForgotOpen(true)}
              className="w-full text-slate-600 hover:text-slate-800 underline mt-2 text-sm text-left"
            >
              Quên mật khẩu?
            </button>
          </form>

          <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-700 mb-3">🔑 Tài khoản demo:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                <span className="font-medium text-slate-700">Admin:</span>
                <span className="text-slate-600">admin@hannah.edu / 123456</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                <span className="font-medium text-slate-700">Faculty:</span>
                <span className="text-slate-600">faculty@hannah.edu / 123456</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                <span className="font-medium text-slate-700">Student:</span>
                <span className="text-slate-600">student@hannah.edu / 123456</span>
              </div>
            </div>
          </div>

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
