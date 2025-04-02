import React, { useState } from "react"
import { ITopping } from "../toppingTypes"
import toppingApi from "../toppingApi"

interface EditToppingModalProps {
  topping: ITopping
  onClose: () => void
  onUpdate: () => void
}

const EditToppingModal: React.FC<EditToppingModalProps> = ({
  topping,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState(topping.name)
  const [price, setPrice] = useState(topping.price)

  const handleUpdate = async () => {
    await toppingApi.updateTopping(topping._id, { name, price })
    onUpdate()
    onClose()
  }

  const handleDelete = async () => {
    await toppingApi.deleteTopping(topping._id)
    onUpdate()
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Topping</h2>

        <label className="block text-gray-300 mb-1">Topping Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded mb-3 focus:outline-none focus:border-blue-400"
        />

        <label className="block text-gray-300 mb-1">Price (VND)</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded mb-4 focus:outline-none focus:border-blue-400"
        />

        <div className="flex justify-between">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-all"
            onClick={handleUpdate}
          >
            Update
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditToppingModal
