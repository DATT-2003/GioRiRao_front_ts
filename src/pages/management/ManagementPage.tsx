import React from "react"
import { useAppSelector } from "../../app/hooks"
import { selectPopUpTab } from "../../features/management/managementSlice"
import StoreManagement from "../../features/management/components/StoreManagement"
import StaffManagement from "../../features/management/components/StaffManagement"

const ManagementPage = () => {
  const activePopUp = useAppSelector(selectPopUpTab)

  return (
    <div className="flex flex-col h-screen bg-gray-800 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full h-full rounded-lg bg-gray-900">
          {activePopUp === "storeManagement" && <StoreManagement />}
          {activePopUp === "staffManagement" && <StaffManagement />}
        </div>
      </div>
    </div>
  )
}

export default ManagementPage
