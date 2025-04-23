import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import managementApi from "../managementApi"
import { IArea, ICity, IStaff, IStore } from "../managementTypes"
import { MapPin, Phone, AtSign, User, Users2, Plus } from "lucide-react"

const UpdateStore = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [cities, setCities] = useState<ICity[]>([])
  const [areas, setAreas] = useState<IArea[]>([])
  const [staffs, setStaffs] = useState<IStaff[]>([])
  const [store, setStore] = useState<IStore | null>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState<IStore>({
    _id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    cityId: "",
    areaId: "",
    managerId: "",
    staffs: [],
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [citiesData, staffsData, storeData] = await Promise.all([
          managementApi.getCities(),
          managementApi.getAllStaffs(),
          managementApi.getStoreById(id!),
        ])
        if (!storeData) {
          console.warn("Không tìm thấy cửa hàng.")
          return
        }

        setCities(citiesData)
        setStaffs(staffsData)
        setStore(storeData)

        setFormData({
          _id: storeData._id,
          name: storeData.name || "",
          address: storeData.address || "",
          phone: storeData.phone || "",
          email: storeData.email || "",
          cityId: storeData.cityId || "",
          areaId: storeData.areaId || "",
          managerId: storeData.managerId || "",
          staffs: storeData.staffs || [],
        })

        setLoading(false)
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err)
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [id])

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
    try {
      const { cityId, ...payload } = formData
      await managementApi.updateStore(id!, payload)
      alert("Cập nhật cửa hàng thành công!")
      navigate("/management")
    } catch (error) {
      console.error("Lỗi cập nhật cửa hàng:", error)
      alert("Cập nhật cửa hàng thất bại.")
    }
  }

  const filteredManagers = staffs.filter(s => s.role === "storeManager")
  const staffOptions = staffs.filter(s => s.role !== "storeManager")

  if (loading || !store) {
    return <div className="text-white p-6">Đang tải dữ liệu cửa hàng...</div>
  }

  return (
    <div className="max-h-screen overflow-y-auto bg-gray-900">
      <div className="sticky top-0 bg-gray-900 z-20 w-full text-white py-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-center">
          Cập Nhật Cửa Hàng: {store.name}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="text-white p-6 space-y-6 max-w-2xl mx-auto"
      >
        <div>
          <label className="block font-semibold mb-1 flex items-center">
            <User className="w-5 h-5 mr-2 text-yellow-400" />
            Tên cửa hàng
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-yellow-400" />
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-yellow-400" />
            Số điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 flex items-center">
            <AtSign className="w-5 h-5 mr-2 text-yellow-400" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-yellow-400" />
            Thành phố
          </label>
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
          <label className="block font-semibold mb-1 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-yellow-400" />
            Khu vực
          </label>
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

        {/* <div>
          <label className="block font-semibold mb-1 flex items-center">
            <Users2 className="w-5 h-5 mr-2 text-yellow-400" />
            Người quản lý
          </label>
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
        </div> */}

        {/* <div>
          <label className="block font-semibold mb-1 flex items-center">
            <Users2 className="w-5 h-5 mr-2 text-yellow-400" />
            Nhân viên
          </label>
          <div className="grid grid-cols-2 gap-4">
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
        </div> */}

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white font-semibold flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Cập Nhật Cửa Hàng
        </button>
      </form>
    </div>
  )
}

export default UpdateStore
