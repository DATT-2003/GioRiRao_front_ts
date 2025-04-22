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

const StoreManagementForManager = () => {
  const [stores, setStores] = useState<IStore[]>([])
  const [storeDetail, setStoreDetail] = useState<IStore | null>(null)
  const [manager, setManager] = useState<IStaff | null>(null)
  const [staffList, setStaffList] = useState<IStaff[]>([])

  const [initialized, setInitialized] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleUpdateStore = () => {
    if (storeDetail?._id) {
      navigate(`/management/editstore/${storeDetail._id}`)
    }
  }

  // UseEffect to fetch stores by managerId
  useEffect(() => {
    const fetchStoreForManager = async () => {
      try {
        const userInfo = await authApi.getMeInfo()
        const { userId } = userInfo

        if (userId) {
          // Lấy danh sách cửa hàng mà Manager quản lý
          const stores = await managementApi.getStoreByManagerId(userId)
          setStores(stores)
          if (stores.length > 0) {
            setStoreDetail(stores[0]) // Hiển thị cửa hàng đầu tiên
          }
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng hoặc store:", err)
      }
    }

    fetchStoreForManager()
  }, [])

  // UseEffect to fetch store detail and staff info when store is selected
  useEffect(() => {
    const fetchStoreDetail = async () => {
      if (storeDetail) {
        setManager(null)
        setStaffList([])

        // Lấy thông tin manager của cửa hàng
        if (storeDetail.managerId) {
          const managerData = await managementApi.getStaffById(
            storeDetail.managerId,
          )
          setManager(managerData)
        }

        // Lấy danh sách nhân viên của cửa hàng
        if (storeDetail.staffs.length > 0) {
          const staffs = await Promise.all(
            storeDetail.staffs.map(id => managementApi.getStaffById(id)),
          )
          setStaffList(staffs)
        }
      }
    }

    fetchStoreDetail()
  }, [storeDetail])

  if (!storeDetail) {
    return <div className="text-white p-6">Đang tải thông tin cửa hàng...</div>
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <Building2 className="w-6 h-6" />
        Trang Web Quản Lý Cửa Hàng
      </h1>

      {/* Chỉ hiển thị nút cập nhật nếu có cửa hàng */}
      {storeDetail && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleUpdateStore}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Cập Nhật
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Thông tin chung */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl shadow-lg border border-gray-700 space-y-2">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-white mb-2">
            <MapPin className="w-5 h-5 text-blue-400" /> Thông Tin Chung
          </h2>
          <p className="text-gray-300">
            <span className="font-medium">Địa chỉ:</span> {storeDetail.address}
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

        {/* Thống kê doanh thu */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition duration-300 border border-gray-700">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-white">
            📊 Thống Kê Doanh Thu
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm text-white">
            <div className="space-y-1">
              <p className="font-medium text-gray-300">Doanh thu hôm nay:</p>
              <p className="text-green-400 font-semibold">5.000.000 VNĐ</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-300">Doanh thu tháng này:</p>
              <p className="text-yellow-400 font-semibold">70.000.000 VNĐ</p>
            </div>
          </div>

          <p className="text-right text-sm text-gray-400 mt-4 italic">
            Nhấn để xem chi tiết
          </p>
        </div>
      </div>
    </div>
  )
}

export default StoreManagementForManager
