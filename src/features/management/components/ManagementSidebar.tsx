import React from "react"
import { useAppDispatch } from "../../../app/hooks"
import { setPopUpTab } from "../managementSlice"
import { Building2, Users } from "lucide-react"

const managementMenuItems = [
  { label: "Store Management", keyWord: "storeManagement", Icon: Building2 },
  { label: "Staff Management", keyWord: "staffManagement", Icon: Users },
]

const ManagementSidebar = () => {
  const dispatch = useAppDispatch()

  const handleTabActive = (tab: string) => {
    dispatch(setPopUpTab(tab))
  }

  return (
    <div className="w-[90%] h-[85%] bg-gray-900 text-white relative top-[70px] left-8 overflow-y-hidden rounded-lg">
      {managementMenuItems.map(item => (
        <div
          key={item.label}
          className="cursor-pointer hover:bg-rose-400 pl-1 py-8 flex items-center"
          onClick={() => handleTabActive(item.keyWord)}
        >
          <item.Icon className="w-5 h-5 text-gray-400 mr-2" />
          {item.label}
        </div>
      ))}
    </div>
  )
}

export default ManagementSidebar
