import React, { useEffect, useState } from "react"
import { ICity, IArea, IStore, IStaff } from "../managementTypes"
import managementApi from "../managementApi"
import { useDispatch, useSelector } from "react-redux"
import {
  setPopUpTab,
  setSelectedStoreStaffInfo,
  setStoreFilter,
  selectStoreFilter,
} from "../managementSlice"
import { useNavigate } from "react-router-dom"
import { Building2, MapPin, Users } from "lucide-react"
import authApi from "../../authentication/authApi"
import statisticApi from "../../statistic/statisticApi"

const StoreManagement = () => {
  const [cities, setCities] = useState<ICity[]>([])
  const [areas, setAreas] = useState<IArea[]>([])
  const [stores, setStores] = useState<IStore[]>([])

  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedArea, setSelectedArea] = useState<string>("")
  const [selectedStore, setSelectedStore] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [revenueData, setRevenueData] = useState<any[]>([])
  const currentMonth = new Date().getMonth() + 1

  const [storeDetail, setStoreDetail] = useState<IStore | null>(null)
  const [manager, setManager] = useState<IStaff | null>(null)
  const [staffList, setStaffList] = useState<IStaff[]>([])

  const [initialized, setInitialized] = useState(false)
  const [userRole, setUserRole] = useState<string>("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const storeFilter = useSelector(selectStoreFilter)

  const handleCreateStore = () => navigate("/management/addstore")
  const handleUpdateStore = () => {
    if (storeDetail?._id) {
      navigate(`/management/editstore/${storeDetail._id}`)
    }
  }

  useEffect(() => {
    const fetchStoreForManager = async () => {
      try {
        const userInfo = await authApi.getMeInfo()
        const { role, userId } = userInfo
        setUserRole(role)
        if (role === "storeManager" && userId) {
          const stores = await managementApi.getStoreByManagerId(userId)
          console.log("stores", stores)
          setStores(stores)
          if (stores.length > 0) {
            const store = stores[0]
            setSelectedCity(store.cityId)
            setSelectedArea(store.areaId)
            setSelectedStore(store._id)
          }
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng hoặc store:", err)
      }
    }

    fetchStoreForManager()
  }, [])

  useEffect(() => {
    if (storeFilter && !initialized) {
      setSelectedCity(storeFilter.selectedCity)
      setSelectedArea(storeFilter.selectedArea)
      setSelectedStore(storeFilter.selectedStore)
      setInitialized(true)
    }
  }, [storeFilter, initialized])

  useEffect(() => {
    if (selectedCity || selectedArea || selectedStore) {
      dispatch(setStoreFilter({ selectedCity, selectedArea, selectedStore }))
    }
  }, [selectedCity, selectedArea, selectedStore, dispatch])

  useEffect(() => {
    const fetchCities = async () => {
      const res = await managementApi.getCities()
      setCities(res)
    }
    fetchCities()
  }, [])

  useEffect(() => {
    if (!initialized || !selectedCity) return
    const fetchAreas = async () => {
      const res = await managementApi.getAreasByCityId(selectedCity)
      setAreas(res)
    }
    fetchAreas()
  }, [selectedCity, initialized])

  useEffect(() => {
    if (!initialized || !selectedArea) return
    const fetchStores = async () => {
      const res = await managementApi.getStoresByAreaId(selectedArea)
      setStores(res)
    }
    fetchStores()
  }, [selectedArea, initialized])

  useEffect(() => {
    const fetchStoreDetail = async () => {
      const store = stores.find(s => s._id === selectedStore)
      if (store) {
        setStoreDetail(store)
        setManager(null)
        setStaffList([])

        if (store.managerId) {
          const managerData = await managementApi.getStaffById(store.managerId)
          setManager(managerData)
        }

        if (store.staffs.length > 0) {
          const staffs = await Promise.all(
            store.staffs.map(id => managementApi.getStaffById(id)),
          )
          setStaffList(staffs)
        }
      } else {
        setStoreDetail(null)
        setManager(null)
        setStaffList([])
      }
    }

    if (selectedStore) {
      fetchStoreDetail()
    } else {
      setStoreDetail(null)
      setManager(null)
      setStaffList([])
    }
  }, [selectedStore, stores])
  useEffect(() => {
    const fetchRevenueOfYear = async () => {
      if (!selectedStore || !selectedYear) return

      try {
        const data = await statisticApi.getRevenueMonthOfYear(
          selectedStore,
          selectedYear,
        )
        console.log("Doanh thu theo năm:", data)
        setRevenueData(data) // data là một mảng 12 tháng, ví dụ [{month: 1, total: 1000000}, ...]
      } catch (err) {
        console.error("Lỗi khi lấy doanh thu theo năm:", err)
      }
    }

    fetchRevenueOfYear()
  }, [selectedStore, selectedYear])
  const currentMonthRevenue = revenueData.find(
    item => item.month === currentMonth,
  )
  const currentMonthTotal = currentMonthRevenue
    ? currentMonthRevenue.revenue
    : 0
  if (!userRole) {
    return (
      <div className="text-white p-6">Đang tải thông tin người dùng...</div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-900 text-white ">
      <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <Building2 className="w-6 h-6" />
        Trang Web Quản Lý Cửa Hàng
      </h1>

      {userRole !== "storeManager" && (
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold">Thành phố</label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full border rounded p-2 bg-gray-700 text-white"
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
            <label className="block font-semibold">Khu vực</label>
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="w-full border rounded p-2 bg-gray-700 text-white"
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
            <label className="block font-semibold">Cửa hàng</label>
            <select
              value={selectedStore}
              onChange={e => setSelectedStore(e.target.value)}
              className="w-full border rounded p-2 bg-gray-700 text-white"
            >
              <option value="">Chọn cửa hàng</option>
              {stores.map(store => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={handleCreateStore}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              + Tạo Cửa Hàng
            </button>

            {storeDetail && (
              <button
                onClick={handleUpdateStore}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Cập Nhật
              </button>
            )}
          </div>
        </div>
      )}

      {userRole === "storeManager" && storeDetail && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleUpdateStore}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Cập Nhật
          </button>
        </div>
      )}

      {storeDetail && (
        <div className="grid grid-cols-2 gap-4">
          {/* Thông tin chung */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl shadow-lg border border-gray-700 space-y-2">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white mb-2">
              <MapPin className="w-5 h-5 text-blue-400" /> Thông Tin Chung
            </h2>
            <p className="text-gray-300">
              <span className="font-medium">Địa chỉ:</span>{" "}
              {storeDetail.address}
            </p>
            <p className="text-gray-300">
              <span className="font-medium">Số điện thoại:</span>{" "}
              {storeDetail.phone || "Chưa có"}
            </p>
            <p className="text-gray-300">
              <span className="font-medium">Người quản lý:</span>{" "}
              {manager ? (
                <span
                  onClick={() => {
                    dispatch(
                      setSelectedStoreStaffInfo({
                        staffIds: storeDetail.staffs || [],
                        managerId: storeDetail.managerId || null,
                      }),
                    )
                    dispatch(setPopUpTab("staffManagement"))
                  }}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  {manager.name}
                </span>
              ) : (
                "Chưa có"
              )}
            </p>
          </div>

          {/* Danh sách nhân viên */}
          <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl shadow-lg border border-gray-700 space-y-2 cursor-pointer hover:shadow-xl transition duration-300"
            onClick={() => {
              dispatch(
                setSelectedStoreStaffInfo({
                  staffIds: storeDetail.staffs || [],
                  managerId: storeDetail.managerId || null,
                }),
              )
              dispatch(setPopUpTab("staffManagement"))
            }}
          >
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white mb-2">
              <Users className="w-5 h-5 text-teal-400" /> Danh Sách Nhân Viên
            </h2>
            <ul className="list-disc pl-5 text-gray-300 space-y-1">
              {staffList.length > 0 ? (
                staffList.map(staff => (
                  <li key={staff._id} className="hover:text-white">
                    {staff.name}
                  </li>
                ))
              ) : (
                <li>Không có nhân viên</li>
              )}
            </ul>
          </div>

          <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition duration-300 border border-gray-700"
            onClick={() => navigate("/statistics")}
          >
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-white">
              📊 Thống Kê Doanh Thu
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm text-white">
              <div className="space-y-1">
                <p className="font-medium text-gray-300">
                  Doanh thu tháng này:
                </p>
                <p className="text-yellow-400 font-semibold">
                  {currentMonthTotal.toLocaleString()} VNĐ
                </p>
              </div>
            </div>

            <p className="text-right text-sm text-gray-400 mt-4 italic">
              Nhấn để xem chi tiết
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreManagement
