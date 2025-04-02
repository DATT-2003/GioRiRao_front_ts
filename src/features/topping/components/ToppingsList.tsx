import React, { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { ITopping } from "../toppingTypes"
import toppingApi from "../toppingApi"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { selectDrinkId } from "../../drinks/drinkSlice"
import { addTopping } from "../../cart/cartSlice"
import drinkApi from "../../drinks/drinkApi"

const ToppingsList = () => {
  const drinkId = useAppSelector(selectDrinkId)
  const dispatch = useAppDispatch()

  const [toppings, setToppings] = useState<ITopping[]>([])

  useEffect(() => {
    const fetchToppings = async () => {
      const toppings = await toppingApi.getAllToppings()
      // console.log("toppings ToppingsList", toppings)
      setToppings(toppings)
    }

    fetchToppings()
  }, [])

  const handleAddTopping = (topping: ITopping) => {
    dispatch(addTopping({ drinkId, topping }))
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
      <div className="grid grid-cols-3 gap-4 place-items-center max-h-[500px] overflow-y-scroll hide-scrollbar p-4">
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
              className="bg-green-800 px-2 py-1 mt-2 rounded-full transition-transform duration-150 active:scale-95 "
              onClick={() => handleAddTopping(topping)}
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ToppingsList
