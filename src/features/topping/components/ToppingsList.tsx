import React, { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { ITopping } from "../toppingTypes"
import toppingApi from "../toppingApi"
import CartItem from "../../cart/components/CartItem"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  selectDrinkId,
  selectDrinkIdCart,
  setIsDrinkDetailOpen,
} from "../../drinks/drinkSlice"
import { addTopping, removeCartItem } from "../../cart/cartSlice"
import drinkApi from "../../drinks/drinkApi"

const ToppingsList = () => {
  const id = useAppSelector(selectDrinkIdCart)
  const dispatch = useAppDispatch()

  const [toppings, setToppings] = useState<ITopping[]>([])

  useEffect(() => {
    const fetchToppings = async () => {
      const toppings = await toppingApi.getAllToppings()
      setToppings(toppings)
    }

    fetchToppings()
  }, [])

  const handleClose = () => {
    dispatch(setIsDrinkDetailOpen(false))
  }
  const handleAddTopping = (topping: ITopping) => {
    dispatch(addTopping({ id, topping }))
  }
  const handleRemoveCartItem = () => {
    if (id) {
      dispatch(removeCartItem({ id }))
      dispatch(setIsDrinkDetailOpen(false))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center bg-gray-700 rounded-lg pl-2">
        <Search />
        <input
          type="text"
          placeholder="Search for topping..."
          className="bg-gray-700 text-white px-4 py-2 rounded-md outline-none w-full"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 place-items-center max-h-[550px] overflow-y-scroll hide-scrollbar p-4">
        {toppings.map(topping => (
          <div
            className="border rounded-lg text-center w-40 py-5"
            key={topping._id}
          >
            <div className="w-14 h-14 mx-auto overflow-hidden rounded-full flex justify-center items-center">
              <img
                src={topping.thumbnail}
                alt="topping thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
            <p>{topping.name}</p>
            <p>{topping.price}</p>
            <button
              className="bg-green-800 px-2 py-1 mt-2 rounded-md transition-transform duration-150 active:scale-95 "
              onClick={() => handleAddTopping(topping)}
            >
              Add
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-10 w-full px-4">
        {/* Nút Back */}
        <button
          className="w-2/5 bg-gray-800 border-2 border-red-500 px-6 py-3 rounded-md text-white text-lg font-semibold hover:bg-red-600 transition"
          onClick={handleRemoveCartItem}
        >
          Delete
        </button>

        {/* Nút Confirm */}
        <button
          className="w-2/5 bg-red-500 px-6 py-3 rounded-md text-white text-lg font-semibold hover:bg-red-500 transition"
          onClick={handleClose}
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

export default ToppingsList
