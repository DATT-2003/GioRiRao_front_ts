import React, { useEffect, useState } from "react"
import managementApi from "../managementApi"
import { IStaff } from "../managementTypes"
import { useDispatch, useSelector } from "react-redux"
import {
  setPopUpTab,
  selectSelectedStoreStaffIds,
  selectSelectedManagerId,
} from "../managementSlice"
import { useNavigate } from "react-router-dom"

const StaffManagement = () => {
  const [staffs, setStaffs] = useState<IStaff[]>([])
  const [manager, setManager] = useState<IStaff | null>(null)

  const selectedStoreStaffIds = useSelector(selectSelectedStoreStaffIds)
  const selectedManagerId = useSelector(selectSelectedManagerId)

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

    if (selectedStoreStaffIds.length > 0 || selectedManagerId) {
      fetchStaffs()
    }
  }, [selectedStoreStaffIds, selectedManagerId])

  const handleCreateStaff = () => navigate("/management/addstaff")
  const handleViewStaff = (staffId: string) =>
    navigate(`/management/staff/${staffId}`)
  const handleEditStaff = (staffId: string) =>
    navigate(`/management/editstaff/${staffId}`)
  const handleBackToStore = () => dispatch(setPopUpTab("storeManagement"))

  return (
    <div className="h-[85vh] flex flex-col bg-gray-900 text-white px-6 py-4 overflow-hidden mg-4 rounded-lg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản Lý Nhân Viên</h1>
        <div className="flex items-center space-x-4">
          <p
            onClick={handleBackToStore}
            className="text-sm text-blue-400 cursor-pointer hover:underline"
          >
            ← Quay về Store
          </p>
          <button
            onClick={handleCreateStaff}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
          >
            + Tạo mới nhân viên
          </button>
        </div>
      </div>

      {/* Nội dung */}
      <div className="flex-1 overflow-y-auto space-y-10 pb-4">
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {/* Store Manager */}
        <div className="bg-gray-800 p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Store Manager</h2>
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
                    <td className="border px-4 py-2 rounded-l-md">
                      {manager.name}
                    </td>
                    <td className="border px-4 py-2">{manager.phone}</td>
                    <td className="border px-4 py-2 rounded-r-md text-center">
                      <button
                        onClick={() => handleViewStaff(manager._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditStaff(manager._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
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
          <h2 className="text-xl font-semibold mb-4">Nhân viên khác</h2>
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
                    <td className="border px-4 py-2 rounded-l-md">{s.name}</td>
                    <td className="border px-4 py-2">{s.phone}</td>
                    <td className="border px-4 py-2">{s.role}</td>
                    <td className="border px-4 py-2 rounded-r-md text-center">
                      <button
                        onClick={() => handleViewStaff(s._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditStaff(s._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
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
