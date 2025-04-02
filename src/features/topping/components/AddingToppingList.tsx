import React from "react"
import { Trash } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { removeTopping, selectToppings } from "../../cart/cartSlice"
import { selectDrinkId } from "../../drinks/drinkSlice"
import { ITopping } from "../toppingTypes"

const AddingToppingList = () => {
  const drinkId = useAppSelector(selectDrinkId)
  const toppings = useAppSelector(cart => selectToppings(cart, drinkId))
  const dispatch = useAppDispatch()

  const handleDeleteTopping = (topping: ITopping, drinkId: string) => {
    dispatch(removeTopping({ drinkId, topping }))
  }

  return (
    <div className="overflow-y-scroll hide-scrollbar mt-5 h-40">
      {toppings?.map((t, index) => (
        <div key={index} className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <div className="w-14 h-14 mr-3 overflow-hidden rounded-full">
              <img
                src={t.thumbnail}
                alt="toppings image"
                className="w-full h-full object-cover"
              />
            </div>
            <p>
              {t.name} <span>(+{t.price} VND)</span>
            </p>
          </div>

          <button onClick={() => handleDeleteTopping(t, drinkId)}>
            <Trash />
          </button>
        </div>
      ))}
    </div>
  )
}

export default AddingToppingList

/**
 * đã tạo được adding topping reducer trong cart slice
 * đã gọi adding topping trong topping list
 * chưa kiểm tra
 *
 * tiếp theo cần làm
 * lấy danh sách topping để hiển thị lên
 */
