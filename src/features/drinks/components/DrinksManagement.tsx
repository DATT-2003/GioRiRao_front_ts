import React, { useEffect, useState } from "react"
import drinkApi from "../drinkApi"
import { IDrink } from "../drinkTypes"
import { Pen } from "lucide-react"
import AddDrinkModal from "./AddDrinkModal"
import EditDrinkModal from "./EditDrinkModal"

const DrinksManagement = () => {
  const [drinks, setDrinks] = useState<IDrink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [drinkToEdit, setDrinkToEdit] = useState<IDrink | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

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

  const categories = Array.from(
    new Set(drinks.map(drink => drink.category)),
  ).filter(Boolean)

  const filteredDrinks =
    selectedCategory === "All"
      ? drinks
      : drinks.filter(drink => drink.category === selectedCategory)

  return (
    <div
      className="p-4 bg-gray-900 relative top-[70px] overflow-y-auto left-16 rounded-lg w-[90%] h-[85%] flex flex-col overflow-hidden"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Header: ẩn khi modal hiển thị */}
      {!showCreateModal && !drinkToEdit && (
        <div className="sticky top-0 bg-gray-900 z-10 p-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white text-xl font-semibold">Drink Management</p>
          </div>
          <div className="flex gap-2 mb-2 overflow-x-auto">
            <button
              className={`px-4 py-1 rounded ${
                selectedCategory === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900 text-gray-300"
              }`}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-1 rounded ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-900 text-gray-300"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nội dung danh sách đồ uống */}
      <div className="flex-grow">
        {loading ? (
          <p className="text-white">Loading drinks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Nút Add New Drink */}
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-all w-full h-64 bg-gray-800 text-white hover:bg-gray-700"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="text-gray-300 text-lg">+ Add new drink</span>
            </div>

            {/* Danh sách đồ uống */}
            {filteredDrinks.length > 0 ? (
              filteredDrinks.map(drink => (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <AddDrinkModal
            onClose={() => setShowCreateModal(false)}
            onCreate={fetchDrinks}
          />
        </div>
      )}

      {/* Modal Edit Drink */}
      {drinkToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <EditDrinkModal
            drink={drinkToEdit}
            onClose={() => setDrinkToEdit(null)}
            onUpdate={fetchDrinks}
          />
        </div>
      )}
    </div>
  )
}

export default DrinksManagement
