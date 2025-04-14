import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import managementApi from "../managementApi"
import { IStaff } from "../managementTypes"

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
    return <div className="p-6 text-white">Đang tải thông tin nhân viên...</div>
  }

  return (
    <div className="p-6 text-white bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Thông Tin Nhân Viên</h1>
      <div className="flex gap-6">
        {/* Ảnh đại diện */}
        {staff.avatar ? (
          <img
            src={staff.avatar}
            alt={`Avatar of ${staff.name}`}
            className="w-40 h-40 object-cover rounded-full border-4 border-white"
          />
        ) : (
          <div className="w-40 h-40 flex items-center justify-center bg-gray-600 rounded-full">
            Không có ảnh
          </div>
        )}

        {/* Thông tin chi tiết */}
        <div>
          <p>
            <strong>Họ tên:</strong> {staff.name}
          </p>
          <p>
            <strong>Email:</strong> {staff.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {staff.phone}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {staff.address}
          </p>
          <p>
            <strong>Vai trò:</strong> {staff.role}
          </p>
        </div>
      </div>
    </div>
  )
}

export default InformationPage
