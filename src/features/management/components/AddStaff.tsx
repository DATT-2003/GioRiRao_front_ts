import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import managementApi from "../managementApi"
import { IStaff } from "../managementTypes"
import { useDispatch, useSelector } from "react-redux"
import { selectStoreFilter, setPopUpTab } from "../managementSlice"

const AddStaffForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState<
    Omit<IStaff, "_id" | "createdAt" | "updatedAt"> & { password: string }
  >({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "staffCashier",
    avatar: "",
    password: "",
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const { selectedStore } = useSelector(selectStoreFilter)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
    }
  }
  const handleBackToStore = () => dispatch(setPopUpTab("storeManagement"))
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => data.append(key, value))
    if (avatarFile) {
      data.append("avatar", avatarFile)
    }

    try {
      const datastaff = await managementApi.createStaff(data)
      //await managementApi.createStaff(data)
      await managementApi.updateStore(selectedStore, {
        $push: { staffs: datastaff._id },
      })
      alert("Tạo nhân viên thành công!")
      handleBackToStore
    } catch (error) {
      console.error("Error creating staff:", error)
      alert("Tạo thất bại.")
    }
  }

  return (
    <div className="h-screen flex flex-col items-center bg-gray-800 text-white">
      <h2 className=" mt-5 text-2xl font-semibold text-center mb-4">
        Thêm nhân viên mới
      </h2>
      {/* Scrollable form */}
      <form
        id="add-staff-form"
        onSubmit={handleSubmit}
        className=" flex-1 overflow-y-auto w-full max-w-md p-6 space-y-6 rounded-tl-xl rounded-tr-xl
 shadow-lg bg-gray-900"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Tên */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Tên:</label>
          <input
            name="name"
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Mật khẩu */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Mật khẩu:</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Điện thoại */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Điện thoại:</label>
          <input
            name="phone"
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Địa chỉ */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Địa chỉ:</label>
          <input
            name="address"
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Vai trò */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Vai trò:</label>
          <select
            name="role"
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="staffCashier">Thu ngân</option>
            <option value="staffBarista">Pha chế</option>
            <option value="staffWaiter">Phục vụ</option>
          </select>
        </div>

        {/* Avatar */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Ảnh đại diện:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 file:bg-gray-700 file:text-white file:border-none file:rounded file:px-4 file:py-2"
          />
        </div>
      </form>

      {/* Nút cố định */}
      <div className="w-full max-w-md p-4 bg-gray-900 flex justify-between gap-4 rounded-bl-xl rounded-br-xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-1/2 bg-gray-600 hover:bg-gray-700 transition text-white font-semibold py-2 px-4 rounded-lg"
        >
          Quay lại
        </button>
        <button
          type="submit"
          form="add-staff-form"
          className="w-1/2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-lg"
        >
          Tạo nhân viên
        </button>
      </div>
    </div>
  )
}

export default AddStaffForm
