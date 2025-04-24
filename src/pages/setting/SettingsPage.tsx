import React from "react"
import SettingsSidebar from "../../features/settings/components/SettingsSidebar"
import DrinksManagement from "../../features/drinks/components/DrinksManagement"
import { useAppSelector } from "../../app/hooks"
import { selectPopUpTab } from "../../features/settings/settingSlice"
import { Divide } from "lucide-react"
import ToppingManagement from "../../features/topping/components/ToppingManagement"

const SettingsPage = () => {
  const activePopUp = useAppSelector(selectPopUpTab)

  return (
    <div className="flex h-screen bg-gray-800 relative overflow-hidden">
      <div className="absolute left-8 top-[25px]">
        <p className="text-2xl font-semibold">Settings</p>
      </div>
      {/* Left sidebar */}
      <div className="w-[28%]">
        <SettingsSidebar />
      </div>
      {/* Main content area */}
      <div className="w-[90%]">
        {activePopUp === "drinkManagement" && <DrinksManagement />}
        {activePopUp === "toppingManagement" && <ToppingManagement />}
      </div>
    </div>
  )
}

export default SettingsPage

/**
 * Theo giá trị setting side bar được ấn, thì main content sẽ hiển thị tương ứng
 * hoàn thành drinks management để thêm nước, sửa nước, xóa nước
 */
