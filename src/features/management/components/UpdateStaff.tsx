import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import managementApi from "../managementApi"
import { IStaff } from "../managementTypes"

export default function UpdateStaff() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [staff, setStaff] = useState<IStaff | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    email: string
    password: string
    phone: string
    address: string
    role: IStaff["role"]
  }>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "staffCashier",
  })

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await managementApi.getStaffById(id!)
        setStaff(data)
        setFormData({
          name: data.name,
          email: data.email,
          password: "",
          phone: data.phone,
          address: data.address,
          role: data.role,
        })
      } catch (err) {
        console.error("Error fetching staff:", err)
      }
    }

    if (id) fetchStaff()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { email, ...dataToUpdate } = formData
      await managementApi.updateStaff(id!, dataToUpdate)
      alert("Cập nhật nhân viên thành công!")
      navigate("/management")
    } catch (err) {
      console.error("Error updating staff:", err)
      alert("Cập nhật thất bại!")
    }
  }

  const handleDelete = async () => {
    const confirm = window.confirm("Bạn có chắc muốn xoá nhân viên này không?")
    if (!confirm) return

    try {
      await managementApi.deleteStaff(id!)
      alert("Xoá nhân viên thành công!")
      navigate("/management")
    } catch (err) {
      console.error("Error deleting staff:", err)
      alert("Xoá nhân viên thất bại!")
    }
  }

  if (!staff) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="max-w-xl mx-auto p-4">
        {/* Tiêu đề và ảnh đại diện */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Cập nhật nhân viên</h2>
          <img
            src={staff.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mật khẩu mới</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Để trống nếu không đổi"
              className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Vai trò</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
            >
              <option value="admin">Admin</option>
              <option value="storeManager">Store Manager</option>
              <option value="staffCashier">Thu ngân</option>
              <option value="staffBarista">Pha chế</option>
              <option value="staffWaiter">Phục vụ</option>
            </select>
          </div>

          {/* Các nút hành động */}
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/management")}
              className="text-sm text-blue-400 hover:underline"
            >
              ← Quay lại danh sách nhân viên
            </button>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Cập nhật
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Xoá
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
