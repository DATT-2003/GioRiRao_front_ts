import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import managementApi from "../managementApi"
import { IArea, ICity, IStaff } from "../managementTypes"

const AddStoreForm = () => {
  const navigate = useNavigate()

  const [cities, setCities] = useState<ICity[]>([])
  const [areas, setAreas] = useState<IArea[]>([])
  const [staffs, setStaffs] = useState<IStaff[]>([])

  const initialFormData = {
    name: "",
    address: "",
    phone: "",
    email: "",
    cityId: "",
    areaId: "",
    // managerId: "",
    // staffs: [] as string[],
  }

  const getInitialFormData = (): typeof initialFormData => {
    const savedData = localStorage.getItem("formData")
    return savedData
      ? JSON.parse(savedData)
      : {
          name: "",
          address: "",
          phone: "",
          email: "",
          cityId: "",
          areaId: "",
          // managerId: "",
          // staffs: [],
        }
  }

  const [formData, setFormData] = useState(getInitialFormData)

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData))
    console.log("Form data saved to localStorage:", formData)
  }, [formData])

  useEffect(() => {
    const fetchData = async () => {
      const citiesData = await managementApi.getCities()

      setCities(citiesData)
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
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { cityId, ...rest } = formData
    const payload = { ...rest }
    console.log("Payload:", payload)
    try {
      await managementApi.createStore(payload)
      alert("Tạo cửa hàng thành công!")
      // Reset formData
      const initialFormData = {
        name: "",
        address: "",
        phone: "",
        email: "",
        cityId: "",
        areaId: "",
        // managerId: "",
        // staffs: [] as string[],
      }
      setFormData(initialFormData)

      // Xoá khỏi localStorage
      localStorage.removeItem("formData")
      navigate("/management")
    } catch (error) {
      console.error("Lỗi tạo cửa hàng:", error)
      alert("Tạo cửa hàng thất bại.")
    }
  }

  const filteredManagers = staffs.filter(s => s.role === "storeManager")

  return (
    <div className="max-h-screen overflow-y-auto bg-gray-900">
      {/* Tiêu đề cố định */}
      <div className="sticky top-0 bg-gray-900 z-20 w-full text-white py-4 border-b border-gray-700 shadow-md">
        <h2 className="text-2xl font-bold text-center">Tạo Cửa Hàng Mới</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="text-white p-6 space-y-6 max-w-2xl mx-auto"
      >
        <div>
          <label className="block font-semibold mb-1 text-gray-300">
            Tên cửa hàng
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-300">
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-300">
            Số điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-300">
            Thành phố
          </label>
          <select
            name="cityId"
            value={formData.cityId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
          <label className="block font-semibold mb-1 text-gray-300">
            Khu vực
          </label>
          <select
            name="areaId"
            value={formData.areaId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Chọn khu vực</option>
            {areas.map(area => (
              <option key={area._id} value={area._id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quản lý */}
        {/* <div>
          <label className="block font-semibold mb-1 text-gray-300">
            Người quản lý
          </label>
          <div className="flex gap-2">
            <select
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Chọn người quản lý</option>
              {filteredManagers.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => navigate("/management/addstaff")}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded whitespace-nowrap shadow-sm transition"
            >
              + Nhân viên
            </button>
          </div>
        </div> */}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold shadow-md transition"
        >
          Tạo Cửa Hàng
        </button>
      </form>
    </div>
  )
}

export default AddStoreForm
