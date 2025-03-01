import React, { useEffect, useState } from "react"
import { ITopping } from "../toppingTypes"
import toppingApi from "../toppingApi"
import EditToppingModal from "./EditToppingModal"
import AddToppingModal from "./AddToppingModal" // Import modal mới
import { Pen } from "lucide-react"

const ToppingManagement = () => {
  const [toppings, setToppings] = useState<ITopping[]>([])
  const [editingTopping, setEditingTopping] = useState<ITopping | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false) // State mở modal

  useEffect(() => {
    fetchToppings()
  }, [])

  const fetchToppings = async () => {
    const toppings = await toppingApi.getAllToppings()
    setToppings(toppings)
  }

  return (
    <div className="p-6 bg-gray-900 relative top-[70px] left-16 rounded-lg w-[90%] h-[85%] flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <p>Topping Management</p>
      </div>
      <div className="max-h-[100%] overflow-y-scroll hide-scrollbar grid grid-cols-4 gap-6">
        {/* Button Add New Topping */}
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded p-4 cursor-pointer hover:border-gray-400 w-full h-60"
          onClick={() => setShowCreateModal(true)} // Mở modal khi click
        >
          <span className="text-gray-500">+ Add new dish</span>
        </div>

        {/* Danh sách topping */}
        {toppings.map(topping => (
          <div
            className="border rounded-lg text-center w-full flex flex-col justify-center items-center h-[100%]"
            key={topping._id}
          >
            <div className="m-2 w-32 h-32 overflow-hidden rounded-full flex justify-center items-center">
              <img src={topping.thumbnail} alt="topping thumbnail" />
            </div>
            <div>
              <p className="mt-2">{topping.name}</p>
              <p className="mt-2 mb-2">{topping.price} VND</p>
            </div>
            <button
              className="rounded-lg rounded-md transition-transform duration-150 active:scale-95 bg-green-800 py-1 w-full flex items-center justify-center gap-2"
              onClick={() => setEditingTopping(topping)}
            >
              <Pen size={16} /> Edit
            </button>
          </div>
        ))}
      </div>

      {/* Modal Add Topping */}
      {showCreateModal && (
        <AddToppingModal
          onClose={() => setShowCreateModal(false)} // Đóng modal
          onCreate={fetchToppings} // Load lại danh sách topping sau khi thêm
        />
      )}

      {/* Modal Edit Topping */}
      {editingTopping && (
        <EditToppingModal
          topping={editingTopping}
          onClose={() => setEditingTopping(null)}
          onUpdate={fetchToppings}
        />
      )}
    </div>
  )
}

export default ToppingManagement
