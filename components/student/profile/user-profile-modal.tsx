"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Settings,
  Camera,
  Save,
  Edit,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface UserProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProfileModal({ open, onOpenChange }: UserProfileModalProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+84 123 456 789",
    address: "Hà Nội, Việt Nam",
    bio: "Sinh viên năm 3 chuyên ngành Công nghệ thông tin. Đam mê lập trình và học hỏi công nghệ mới.",
    studentId: "SV001",
    class: "IT2023",
    major: "Công nghệ thông tin",
    year: "Năm 3",
    gpa: "3.75",
  })

  const handleSave = () => {
    // Save profile data
    setIsEditing(false)
    // In real app, this would call an API
    console.log("Saving profile:", profileData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Hồ sơ cá nhân</DialogTitle>
            <DialogDescription className="text-blue-100">
              Quản lý thông tin và cài đặt tài khoản của bạn
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="profile" className="h-full">
            <div className="border-b border-gray-200 px-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="profile">Thông tin</TabsTrigger>
                <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="profile" className="space-y-6 mt-0">
                {/* Profile Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                            {user?.name?.split(' ').map(n => n[0]).join('') || 'SV'}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                          variant="outline"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{profileData.name}</h3>
                            <p className="text-gray-600">{profileData.studentId} • {profileData.class}</p>
                          </div>
                          <Button
                            variant={isEditing ? "default" : "outline"}
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                          >
                            {isEditing ? (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Lưu
                              </>
                            ) : (
                              <>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </>
                            )}
                          </Button>
                        </div>



                        <p className="text-gray-700">{profileData.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin liên hệ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <Input
                            id="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <Input
                            id="address"
                            value={profileData.address}
                            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="bio">Giới thiệu</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>



              <TabsContent value="settings" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Cài đặt tài khoản</CardTitle>
                    <CardDescription>Quản lý tùy chọn và bảo mật tài khoản</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                        <Input id="current-password" type="password" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">Mật khẩu mới</Label>
                        <Input id="new-password" type="password" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                        <Input id="confirm-password" type="password" className="mt-1" />
                      </div>
                      <Button>Đổi mật khẩu</Button>
                    </div>
                  </CardContent>
                </Card>


              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 flex-shrink-0">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
