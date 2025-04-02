import React, { useEffect, useState } from "react"
import { ITopping } from "../toppingTypes"
import toppingApi from "../toppingApi"
import EditToppingModal from "./EditToppingModal"
import AddToppingModal from "./AddToppingModal"
import { Pen } from "lucide-react"

const ToppingManagement = () => {
  const [toppings, setToppings] = useState<ITopping[]>([])
  const [editingTopping, setEditingTopping] = useState<ITopping | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

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
        <p className="text-white text-xl font-semibold">Topping Management</p>
      </div>

      <div className="max-h-[100%] overflow-y-auto hide-scrollbar grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Button Add New Topping */}
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-all w-full h-64 bg-gray-800 text-white hover:bg-gray-700"
          onClick={() => setShowCreateModal(true)}
        >
          <span className="text-gray-300 text-lg">+ Add new topping</span>
        </div>

        {/* Danh sách topping */}
        {toppings.map(topping => (
          <div
            className="border border-gray-700 rounded-lg text-center w-full flex flex-col justify-between items-center h-64 bg-gray-800 p-4 shadow-md hover:shadow-lg transition-all"
            key={topping._id}
          >
            <div className="w-32 h-32 overflow-hidden rounded-full flex justify-center items-center border border-gray-600">
              <img
                src={topping.thumbnail}
                alt={topping.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-white">
              <p className="mt-2 font-semibold">{topping.name}</p>
              <p className="mt-1 mb-2 text-gray-400">{topping.price} VND</p>
            </div>
            <button
              className="rounded-md transition-transform duration-150 active:scale-95 bg-green-600 hover:bg-green-500 py-2 w-full flex items-center justify-center gap-2 text-white"
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
          onClose={() => setShowCreateModal(false)}
          onCreate={fetchToppings}
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
