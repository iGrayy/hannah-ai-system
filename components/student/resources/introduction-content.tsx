"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Target, Lightbulb, Users } from "lucide-react"

export function IntroductionContent() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Giới thiệu về Computer Science
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            Computer Science là một lĩnh vực nghiên cứu về các nguyên lý cơ bản của tính toán, 
            thiết kế và ứng dụng của hệ thống máy tính. Môn học này cung cấp nền tảng vững chắc 
            cho việc phát triển tư duy logic và kỹ năng giải quyết vấn đề.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                Mục tiêu học tập
              </h4>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• Hiểu các khái niệm cơ bản về thuật toán</li>
                <li>• Phát triển kỹ năng lập trình</li>
                <li>• Nắm vững cấu trúc dữ liệu</li>
                <li>• Áp dụng tư duy tính toán</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                Kỹ năng đạt được
              </h4>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• Tư duy logic và phân tích</li>
                <li>• Giải quyết vấn đề có hệ thống</li>
                <li>• Làm việc nhóm hiệu quả</li>
                <li>• Tự học và cập nhật kiến thức</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            Cấu trúc chương trình
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">Chương 1</Badge>
              <span className="text-sm">Giới thiệu khái niệm nền tảng</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">Chương 2</Badge>
              <span className="text-sm">Ứng dụng vào tình huống thực tế</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">Chương 3</Badge>
              <span className="text-sm">Nâng cao & mở rộng kiến thức</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-medium text-sm text-blue-800 mb-2">💡 Lưu ý quan trọng</h4>
        <p className="text-xs text-blue-700">
          Phần Introduction này là nền tảng cho toàn bộ khóa học. Hãy đọc kỹ tài liệu PDF 
          và ghi chú những điểm quan trọng để có thể tham khảo trong các chương tiếp theo.
        </p>
      </div>
    </div>
  )
}
