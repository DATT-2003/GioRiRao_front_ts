import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import managementApi from "../managementApi"
import { IStaff } from "../managementTypes"
import { UserCircle, Mail, Phone, MapPin, Shield } from "lucide-react"

const InformationPage = () => {
  const { id } = useParams()
  const [staff, setStaff] = useState<IStaff | null>(null)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await managementApi.getStaffById(id!)
        setStaff(data)
      } catch (error) {
        console.error("Failed to fetch staff info:", error)
      }
    }

    fetchStaff()
  }, [id])

  if (!staff) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">Đang tải thông tin nhân viên...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-400">
          Hồ Sơ Nhân Viên
        </h1>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Avatar */}
          {staff.avatar ? (
            <img
              src={staff.avatar}
              alt={`Avatar of ${staff.name}`}
              className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-gray-600 rounded-full text-white text-sm">
              Không có ảnh
            </div>
          )}

          {/* Thông tin */}
          <div className="flex-1 space-y-4 text-base">
            <p className="flex items-center gap-3">
              <UserCircle className="w-5 h-5 text-blue-400" />
              <span>
                <strong>Họ tên:</strong> {staff.name}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-yellow-400" />
              <span>
                <strong>Email:</strong> {staff.email}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-400" />
              <span>
                <strong>Số điện thoại:</strong> {staff.phone}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-400" />
              <span>
                <strong>Địa chỉ:</strong> {staff.address}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>
                <strong>Vai trò:</strong> {staff.role}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InformationPage
