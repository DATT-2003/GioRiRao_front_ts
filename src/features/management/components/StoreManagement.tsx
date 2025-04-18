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
import { Building2, MapPin, Phone, Users, User2 } from "lucide-react"

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

  const [initialized, setInitialized] = useState(false)

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

  return (
    <div className=" p-6 space-y-6 min-h-screenh-[85vh] flex flex-col bg-gray-900 text-white px-6 py-4 overflow-hidden rounded-lg">
      <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <Building2 className="w-6 h-6" />
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

      {storeDetail && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* Thông tin chung */}
            <div className="bg-gray-800 p-4 rounded shadow space-y-2">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5" />
                Thông Tin Chung
              </h2>
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

            {/* Danh sách nhân viên */}
            <div
              className="bg-gray-800 p-4 rounded shadow space-y-2 cursor-pointer"
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
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Users className="w-5 h-5" />
                Danh Sách Nhân Viên
              </h2>
              <ul className="list-disc pl-5">
                {staffList.length > 0 ? (
                  staffList.map(staff => <li key={staff._id}>{staff.name}</li>)
                ) : (
                  <li>Không có nhân viên</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default StoreManagement
