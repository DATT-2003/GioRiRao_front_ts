import React, { useState } from "react"
import managementApi from "../managementApi"
import { IStaff } from "../managementTypes"

const AddStaffForm = () => {
  const [formData, setFormData] = useState<
    Omit<IStaff, "_id" | "createdAt" | "updatedAt"> & { password: string }
  >({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "staffCashier",
    avatar: "",
    password: "", // 👉 Thêm field password
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => data.append(key, value))
    if (avatarFile) {
      data.append("avatar", avatarFile)
    }

    try {
      await managementApi.createStaff(data)
      alert("Tạo nhân viên thành công!")
    } catch (error) {
      console.error("Error creating staff:", error)
      alert("Tạo thất bại.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-800 p-4 rounded text-white"
    >
      <div>
        <label>Tên:</label>
        <input
          name="name"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>
      <div>
        <label>Mật khẩu:</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>
      <div>
        <label>Điện thoại:</label>
        <input
          name="phone"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>
      <div>
        <label>Địa chỉ:</label>
        <input
          name="address"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        />
      </div>
      <div>
        <label>Vai trò:</label>
        <select
          name="role"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        >
          <option value="storeManager">Quản lý</option>
          <option value="staffCashier">Thu ngân</option>
          <option value="staffBarista">Pha chế</option>
          <option value="staffWaiter">Phục vụ</option>
        </select>
      </div>
      <div>
        <label>Avatar:</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 rounded bg-gray-700"
        />
      </div>
      <button type="submit" className="bg-blue-500 px-4 py-2 rounded">
        Tạo nhân viên
      </button>
    </form>
  )
}

export default AddStaffForm
