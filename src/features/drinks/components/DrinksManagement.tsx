import React, { useEffect, useState } from "react"
import drinkApi from "../drinkApi"
import { IDrink } from "../drinkTypes"
import { Pen } from "lucide-react"
import AddDrinkModal from "./AddDrinkModal" // Import modal thêm mới
import EditDrinkModal from "./EditDrinkModal" // Import modal chỉnh sửa

const DrinksManagement = () => {
  const [drinks, setDrinks] = useState<IDrink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false) // State mở modal thêm mới
  const [drinkToEdit, setDrinkToEdit] = useState<IDrink | null>(null) // State cho modal chỉnh sửa

  useEffect(() => {
    fetchDrinks()
  }, [])

  const fetchDrinks = async () => {
    try {
      setLoading(true)
      const data = await drinkApi.getAllDrinks()
      setDrinks(data || [])
    } catch (err) {
      console.error("Error fetching drinks:", err)
      setError("Failed to load drinks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (drink: IDrink) => {
    setDrinkToEdit(drink)
  }

  return (
    <div className="p-6 bg-gray-900 relative top-[70px] left-16 rounded-lg w-[ô0%] h-[85%] flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-white text-xl font-semibold">Drink Management</p>
        </div>

        {/* Kiểm tra trạng thái loading / lỗi */}
        {loading ? (
          <p className="text-white">Loading drinks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Nút Add New Drink */}
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-all w-full h-64 bg-gray-800 text-white hover:bg-gray-700"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="text-gray-300 text-lg">+ Add new drink</span>
            </div>

            {/* Danh sách đồ uống */}
            {drinks.length > 0 ? (
              drinks.map(drink => (
                <div
                  key={drink._id}
                  className="border border-gray-700 rounded-lg text-center w-full flex flex-col justify-between items-center h-64 bg-gray-800 p-4 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="w-32 h-32 overflow-hidden rounded-md flex justify-center items-center border border-gray-600">
                    <img
                      src={drink.thumbnail || "https://via.placeholder.com/150"}
                      alt={drink.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-2 font-semibold text-white">{drink.name}</p>
                  <button
                    className="rounded-md transition-transform duration-150 active:scale-95 bg-green-800 hover:bg-green-700 py-2 w-full flex items-center justify-center text-white gap-2"
                    onClick={() => handleEdit(drink)}
                  >
                    <Pen size={16} /> Edit
                  </button>
                </div>
              ))
            ) : (
              <p className="text-white col-span-4 text-center">
                No drinks available
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal Add Drink */}
      {showCreateModal && (
        <AddDrinkModal
          onClose={() => setShowCreateModal(false)}
          onCreate={fetchDrinks} // Load lại danh sách khi thêm thành công
        />
      )}

      {/* Modal Edit Drink */}
      {drinkToEdit && (
        <EditDrinkModal
          drink={drinkToEdit}
          onClose={() => setDrinkToEdit(null)}
          onUpdate={fetchDrinks} // Load lại danh sách khi cập nhật thành công
        />
      )}
    </div>
  )
}

export default DrinksManagement
