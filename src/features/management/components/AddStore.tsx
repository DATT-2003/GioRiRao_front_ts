import React, { useEffect, useState } from "react"
import managementApi from "../managementApi"
import { IArea, ICity, IStaff } from "../managementTypes"

const AddStoreForm = () => {
  const [cities, setCities] = useState<ICity[]>([])
  const [areas, setAreas] = useState<IArea[]>([])
  const [staffs, setStaffs] = useState<IStaff[]>([])

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    cityId: "",
    areaId: "",
    managerId: "",
    staffs: [] as string[],
  })

  useEffect(() => {
    const fetchData = async () => {
      const [citiesData, staffsData] = await Promise.all([
        managementApi.getCities(),
        managementApi.getAllStaffs(),
      ])
      setCities(citiesData)
      setStaffs(staffsData)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (formData.cityId) {
      const fetchAreas = async () => {
        const areaList = await managementApi.getAreasByCityId(formData.cityId)
        setAreas(areaList)
      }
      fetchAreas()
    }
  }, [formData.cityId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { cityId, ...rest } = formData
    const payload = { ...rest }
    console.log("Payload:", payload)
    try {
      await managementApi.createStore(payload)
      alert("Tạo cửa hàng thành công!")
    } catch (error) {
      console.error("Lỗi tạo cửa hàng:", error)
      alert("Tạo cửa hàng thất bại.")
    }
  }

  const filteredManagers = staffs.filter(s => s.role === "storeManager")
  const staffOptions = staffs.filter(s => s.role !== "storeManager")

  return (
    <div className="max-h-screen overflow-y-auto bg-gray-900">
      {/* Tiêu đề cố định khi cuộn */}
      <div className="sticky top-0 bg-gray-900 z-20 w-full text-white py-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-center">Tạo Cửa Hàng Mới</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="text-white p-6 space-y-4 max-w-2xl mx-auto"
      >
        <div>
          <label className="block font-semibold mb-1">Tên cửa hàng</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 rounded bg-gray-700"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Địa chỉ</label>
          <input
            type="text"
            name="address"
            className="w-full p-2 rounded bg-gray-700"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            className="w-full p-2 rounded bg-gray-700"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 rounded bg-gray-700"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Thành phố</label>
          <select
            name="cityId"
            value={formData.cityId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          >
            <option value="">Chọn thành phố</option>
            {cities.map(city => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Khu vực</label>
          <select
            name="areaId"
            value={formData.areaId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          >
            <option value="">Chọn khu vực</option>
            {areas.map(area => (
              <option key={area._id} value={area._id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Người quản lý</label>
          <select
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          >
            <option value="">Chọn người quản lý</option>
            {filteredManagers.map(s => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Nhân viên</label>
          <div className="grid grid-cols-2 gap-4">
            {/* Danh sách nhân viên để chọn */}
            <div className="bg-gray-700 p-2 rounded">
              <p className="font-medium mb-1">Danh sách nhân viên</p>
              <ul className="max-h-40 overflow-y-auto text-sm">
                {staffOptions
                  .filter(s => !formData.staffs.includes(s._id!))
                  .map(s => (
                    <li
                      key={s._id}
                      className="cursor-pointer hover:bg-gray-600 p-1 rounded"
                      onDoubleClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          staffs: [...prev.staffs, s._id!],
                        }))
                      }
                    >
                      {s.name}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Danh sách đã chọn */}
            <div className="bg-gray-700 p-2 rounded">
              <p className="font-medium mb-1">Đã chọn</p>
              <ul className="max-h-40 overflow-y-auto text-sm">
                {formData.staffs.map(id => {
                  const staff = staffs.find(s => s._id === id)
                  return (
                    <li
                      key={id}
                      className="flex justify-between items-center p-1 bg-gray-600 rounded mb-1"
                    >
                      <span>{staff?.name || "Không rõ"}</span>
                      <button
                        type="button"
                        className="text-red-400 hover:text-red-600 ml-2"
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            staffs: prev.staffs.filter(sId => sId !== id),
                          }))
                        }
                      >
                        X
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-semibold"
        >
          Tạo Cửa Hàng
        </button>
      </form>
    </div>
  )
}

export default AddStoreForm
