import React, { useEffect, useState } from "react"
import managementApi from "../managementApi"
import { IStaff } from "../managementTypes"
import { useDispatch, useSelector } from "react-redux"
import {
  setPopUpTab,
  selectPopUpTab,
  selectSelectedStoreStaffIds,
  selectSelectedManagerId,
} from "../managementSlice"
import { useNavigate } from "react-router-dom"
import {
  UserRoundCheck,
  Users2,
  ArrowLeft,
  Eye,
  Pencil,
  Plus,
} from "lucide-react"

const StaffManagement = () => {
  const [staffs, setStaffs] = useState<IStaff[]>([])
  const [manager, setManager] = useState<IStaff | null>(null)

  const selectedStoreStaffIds = useSelector(selectSelectedStoreStaffIds)
  const selectedManagerId = useSelector(selectSelectedManagerId)
  const activePopUp = useSelector(selectPopUpTab)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const staffPromises = selectedStoreStaffIds.map(id =>
          managementApi.getStaffById(id),
        )
        const staffData = await Promise.all(staffPromises)
        setStaffs(staffData)

        if (selectedManagerId) {
          const managerData =
            await managementApi.getStaffById(selectedManagerId)
          setManager(managerData)
        } else {
          setManager(null)
        }
      } catch (error) {
        console.error("Lỗi khi tải nhân viên/manager:", error)
      }
    }

    if (activePopUp === "staffManagement") {
      fetchStaffs()
    } else {
      setStaffs([])
      setManager(null)
    }
  }, [activePopUp, selectedStoreStaffIds, selectedManagerId])

  const handleCreateStaff = () => navigate("/management/addstaff")
  const handleViewStaff = (staffId: string) =>
    navigate(`/management/information/${staffId}`)
  const handleEditStaff = (staffId: string) =>
    navigate(`/management/editstaff/${staffId}`)
  const handleBackToStore = () => dispatch(setPopUpTab("storeManagement"))

  return (
    <div className="h-[85vh] flex flex-col bg-gray-900 text-white px-6 py-4 overflow-hidden rounded-lg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 pb-4 flex items-center justify-between border-b border-gray-700">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users2 className="w-6 h-6 text-blue-400" /> Quản Lý Nhân Viên
        </h1>
        <div className="flex items-center space-x-4">
          <p
            onClick={handleBackToStore}
            className="flex items-center gap-1 text-sm text-blue-400 cursor-pointer hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Quay về Store
          </p>
          <button
            onClick={handleCreateStaff}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tạo mới
          </button>
        </div>
      </div>

      {/* Nội dung */}
      <div className="flex-1 overflow-y-auto space-y-10 pb-4">
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {/* Store Manager */}
        <div className="bg-gray-800 p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserRoundCheck className="w-5 h-5 text-yellow-400" />
            Store Manager
          </h2>
          {manager ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-700 text-sm rounded-md overflow-hidden">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th className="border px-4 py-2">Tên</th>
                    <th className="border px-4 py-2">Số điện thoại</th>
                    <th className="border px-4 py-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-900 hover:bg-gray-800">
                    <td className="border px-4 py-2">{manager.name}</td>
                    <td className="border px-4 py-2">{manager.phone}</td>
                    <td className="border px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewStaff(manager._id)}
                          className="flex items-center p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="ml-2">View</span>
                        </button>
                        <button
                          onClick={() => handleEditStaff(manager._id)}
                          className="flex items-center p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="ml-2">Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Không có manager</p>
          )}
        </div>

        {/* Nhân viên khác */}
        <div className="bg-gray-800 p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-green-400" />
            Nhân viên khác
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 text-sm rounded-md overflow-hidden">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="border px-4 py-2">Tên</th>
                  <th className="border px-4 py-2">Số điện thoại</th>
                  <th className="border px-4 py-2">Vai trò</th>
                  <th className="border px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {staffs.map(s => (
                  <tr key={s._id} className="bg-gray-900 hover:bg-gray-800">
                    <td className="border px-4 py-2">{s.name}</td>
                    <td className="border px-4 py-2">{s.phone}</td>
                    <td className="border px-4 py-2 capitalize">{s.role}</td>
                    <td className="border px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewStaff(s._id)}
                          className="flex items-center p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="ml-2">View</span>
                        </button>
                        <button
                          onClick={() => handleEditStaff(s._id)}
                          className="flex items-center p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="ml-2">Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffManagement
