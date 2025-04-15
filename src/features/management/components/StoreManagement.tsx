import React, { useEffect, useState } from "react"
import { ICity, IArea, IStore, IStaff } from "../managementTypes"
import managementApi from "../managementApi"
import { useDispatch } from "react-redux"
import { setPopUpTab, setSelectedStoreStaffInfo } from "../managementSlice"
import { useNavigate } from "react-router-dom"

const StoreManagement = () => {
  const [cities, setCities] = useState<ICity[]>([])
  const [areas, setAreas] = useState<IArea[]>([])
  const [stores, setStores] = useState<IStore[]>([])

  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedArea, setSelectedArea] = useState<string>("")
  const [selectedStore, setSelectedStore] = useState<string>("")

  const [storeDetail, setStoreDetail] = useState<IStore | null>(null)
  const [manager, setManager] = useState<IStaff | null>(null)
  const [staffList, setStaffList] = useState<IStaff[]>([])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleCreateStore = () => navigate("/management/addstore")
  const handleUpdateStore = () => {
    if (storeDetail?._id) {
      navigate(`/management/editstore/${storeDetail._id}`)
    }
  }

  useEffect(() => {
    const fetchCities = async () => {
      const res = await managementApi.getCities()
      setCities(res)
    }
    fetchCities()
  }, [])

  useEffect(() => {
    if (!selectedCity) return
    const fetchAreas = async () => {
      const res = await managementApi.getAreasByCityId(selectedCity)
      setAreas(res)
      setSelectedArea("")
      setStores([])
      setSelectedStore("")
      setStoreDetail(null)
      setManager(null)
      setStaffList([])
    }
    fetchAreas()
  }, [selectedCity])

  useEffect(() => {
    if (!selectedArea) return
    const fetchStores = async () => {
      const res = await managementApi.getStoresByAreaId(selectedArea)
      setStores(res)
      setSelectedStore("")
      setStoreDetail(null)
      setManager(null)
      setStaffList([])
    }
    fetchStores()
  }, [selectedArea])

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

  return (
    <div className="p-6 space-y-6 bg-gray-800 text-white min-h-screen">
      <h1 className="text-2xl font-bold text-center">
        Trang Web Quản Lý Cửa Hàng
      </h1>

      {/* Bộ lọc */}
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tạo Cửa Hàng
          </button>

          {storeDetail && (
            <button
              onClick={handleUpdateStore}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Cập Nhật Cửa Hàng
            </button>
          )}
        </div>
      </div>

      {storeDetail && (
        <>
          {/* Thông tin chung và nhân viên */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Thông tin chung</h2>
              <p>
                <strong>Địa chỉ:</strong> {storeDetail.address}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {storeDetail.phone || "Chưa có"}
              </p>
              <p>
                <strong>Người quản lý:</strong>{" "}
                {manager ? (
                  <span
                    onClick={() => {
                      dispatch(
                        setSelectedStoreStaffInfo({
                          staffIds: storeDetail?.staffs || [],
                          managerId: storeDetail?.managerId || null,
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

            <div
              className="bg-gray-700 p-4 rounded shadow cursor-pointer"
              onClick={() => {
                dispatch(
                  setSelectedStoreStaffInfo({
                    staffIds: storeDetail?.staffs || [],
                    managerId: storeDetail?.managerId || null,
                  }),
                )
                dispatch(setPopUpTab("staffManagement"))
              }}
            >
              <h2 className="text-lg font-semibold mb-2">
                Danh Sách Nhân Viên
              </h2>
              <ul className="list-disc pl-5">
                {staffList.length > 0 ? (
                  staffList.map(staff => (
                    <li key={staff._id}>
                      <span className="">{staff.name}</span>
                    </li>
                  ))
                ) : (
                  <li>Không có nhân viên</li>
                )}
              </ul>
            </div>
          </div>

          {/* Thống kê và lịch làm việc */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Thống Kê</h2>
              <p>
                <strong>Doanh thu:</strong> ...
              </p>
              <p>
                <strong>Top sản phẩm:</strong> ...
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Lịch Làm Việc</h2>
              <ul className="list-disc pl-5">
                <li>T2: ...</li>
                <li>T3: ...</li>
                <li>T4: ...</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default StoreManagement
