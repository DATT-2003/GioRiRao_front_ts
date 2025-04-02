import React from "react"

const DrinksManagement = () => {
  return (
    <div className="p-6 bg-gray-900 relative top-[70px] left-16 rounded-lg w-[ô0%] h-[85%] flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4">
          <p>Drink Management</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Add New Dish */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded p-4 cursor-pointer hover:border-gray-400">
            <span className="text-gray-500">+ Add new dish</span>
          </div>

          {/* Example Dish Card */}
          <div className="border border-gray-200 rounded shadow p-4">
            <img
              src="https://via.placeholder.com/150"
              alt="Dish 1"
              className="w-full h-32 object-cover rounded mb-2"
            />
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">
                Spicy seasoned seafood noodles
              </h3>
              <span className="text-sm text-gray-600">$2.29</span>
            </div>
            <p className="text-xs text-gray-500">20 Bowls</p>
            <button className="mt-2 w-full px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
              Edit dish
            </button>
          </div>

          {/* Another Dish Card */}
          <div className="border border-gray-200 rounded shadow p-4">
            <img
              src="https://via.placeholder.com/150"
              alt="Dish 2"
              className="w-full h-32 object-cover rounded mb-2"
            />
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">
                Salted Pasta with mushroom sauce
              </h3>
              <span className="text-sm text-gray-600">$2.69</span>
            </div>
            <p className="text-xs text-gray-500">30 Bowls</p>
            <button className="mt-2 w-full px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
              Edit dish
            </button>
          </div>

          {/* More Dish Cards... */}
        </div>
      </div>

      <div className="flex justify-start mt-6 space-x-2">
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Discard Changes
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default DrinksManagement
