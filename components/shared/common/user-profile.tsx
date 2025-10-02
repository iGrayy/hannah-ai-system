"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Camera,
  Shield,
  Bell,
  Key,
  Activity,
  Award,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Common info
    name: user?.name || "",
    email: user?.email || "",
    phone: "+84 123 456 789",
    address: "Hà Nội, Việt Nam",
    bio:
      user?.role === "student"
        ? "Sinh viên năm 3 chuyên ngành Công nghệ thông tin. Đam mê lập trình và học hỏi công nghệ mới."
        : "Giảng viên ngành Công nghệ Thông tin với 10 năm kinh nghiệm giảng dạy.",
    department: "Khoa Công nghệ thông tin",
    position:
      user?.role === "student"
        ? "Sinh viên"
        : user?.role === "admin"
        ? "Quản trị viên"
        : "Giảng viên",
    joinDate: "2021-09-01",

    // Student specific info
    studentId: user?.role === "student" ? "SV001" : "",
    class: user?.role === "student" ? "IT2023" : "",
    major: user?.role === "student" ? "Công nghệ thông tin" : "",
    year: user?.role === "student" ? "Năm 3" : "",
    gpa: user?.role === "student" ? "3.75" : "",

    // Faculty specific info
    facultyId: user?.role === "faculty" ? "GV001" : "",
    specialization: user?.role === "faculty" ? "Trí tuệ nhân tạo" : "",
    academicRank: user?.role === "faculty" ? "Giảng viên" : "",
    researchAreas: user?.role === "faculty" ? "AI, Machine Learning" : "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    systemAlerts: true,
  });

  const handleSaveProfile = () => {
    alert("✅ Hồ sơ đã được cập nhật thành công!");
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    alert("🔑 Email đổi mật khẩu đã được gửi đến " + user?.email);
  };

  const handleUploadAvatar = () => {
    alert("📷 Chức năng upload ảnh sẽ được triển khai sau!");
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    alert(`🔔 Cài đặt thông báo "${key}" đã được ${value ? "bật" : "tắt"}`);
  };

  const handleDeleteAccount = () => {
    alert("⚠️ Tài khoản sẽ được xóa sau 30 ngày. Email xác nhận đã được gửi.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
          <p className="text-slate-600">
            Quản lý thông tin và cài đặt tài khoản của bạn
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                    onClick={handleUploadAvatar}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle>{profileData.name}</CardTitle>
              <CardDescription>{profileData.position}</CardDescription>
              <Badge className="w-fit mx-auto mt-2">
                {user?.role === "student"
                  ? "Sinh viên"
                  : user?.role === "admin"
                  ? "Quản trị viên"
                  : "Giảng viên"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-slate-500" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-500" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span>{profileData.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span>Tham gia từ {profileData.joinDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats removed per requirement */}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Thông tin</TabsTrigger>
              <TabsTrigger value="security">Bảo mật</TabsTrigger>
              <TabsTrigger value="notifications">Thông báo</TabsTrigger>
              {/* <TabsTrigger value="achievements">Thành tích</TabsTrigger> */}
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cơ bản của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Ngành/Phòng ban</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            department: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Giới thiệu</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                  {/* Role-specific Fields */}
                  {user?.role === "student" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Mã sinh viên</Label>
                        <Input
                          id="studentId"
                          value={profileData.studentId}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              studentId: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="class">Lớp</Label>
                        <Input
                          id="class"
                          value={profileData.class}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              class: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="major">Chuyên ngành</Label>
                        <Input
                          id="major"
                          value={profileData.major}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              major: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Năm học</Label>
                        <Input
                          id="year"
                          value={profileData.year}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              year: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gpa">Điểm trung bình</Label>
                        <Input
                          id="gpa"
                          value={profileData.gpa}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              gpa: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="facultyId">Mã giảng viên</Label>
                        <Input
                          id="facultyId"
                          value={profileData.facultyId || "GV001"}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              facultyId: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Chuyên môn</Label>
                        <Input
                          id="specialization"
                          value={
                            profileData.specialization || "Trí tuệ nhân tạo"
                          }
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              specialization: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Chức vụ</Label>
                        <Input
                          id="position"
                          value={profileData.position}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              position: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Khoa/Bộ môn</Label>
                        <Input
                          id="department"
                          value={profileData.department}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              department: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Bảo mật tài khoản
                  </CardTitle>
                  <CardDescription>
                    Quản lý mật khẩu và cài đặt bảo mật
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Mật khẩu</h3>
                      <p className="text-sm text-slate-600">
                        Thay đổi mật khẩu đăng nhập
                      </p>
                    </div>
                    <Button onClick={handleChangePassword}>
                      <Key className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Xác thực 2 bước</h3>
                      <p className="text-sm text-slate-600">
                        Tăng cường bảo mật với 2FA
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        alert("🔐 Chức năng 2FA sẽ được triển khai sau!")
                      }
                    >
                      Kích hoạt
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Phiên đăng nhập</h3>
                      <p className="text-sm text-slate-600">
                        Quản lý các thiết bị đã đăng nhập
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        alert("📱 Hiển thị 3 thiết bị đang hoạt động")
                      }
                    >
                      Xem chi tiết
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Xóa tài khoản</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Bạn có chắc chắn muốn xóa tài khoản?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Tất cả dữ liệu của
                            bạn sẽ bị xóa vĩnh viễn.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount}>
                            Xóa tài khoản
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Cài đặt thông báo
                  </CardTitle>
                  <CardDescription>
                    Tùy chỉnh các loại thông báo bạn muốn nhận
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email thông báo</h3>
                      <p className="text-sm text-slate-600">
                        Nhận thông báo qua email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push notifications</h3>
                      <p className="text-sm text-slate-600">
                        Thông báo đẩy trên trình duyệt
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("pushNotifications", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Thành tích & Huy hiệu
                  </CardTitle>
                  <CardDescription>
                    Các thành tích bạn đã đạt được
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Giảng viên xuất sắc</h3>
                        <p className="text-sm text-slate-600">
                          Đạt được tháng 12/2023
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Chuyên gia AI</h3>
                        <p className="text-sm text-slate-600">
                          Đạt được tháng 10/2023
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileModal({
  open,
  onOpenChange,
}: UserProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] overflow-hidden flex flex-col p-0">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Hồ sơ cá nhân
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Quản lý thông tin và cài đặt tài khoản của bạn
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto">
          <UserProfile />
        </div>

        <div className="border-t bg-gray-50 p-4 flex-shrink-0">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
