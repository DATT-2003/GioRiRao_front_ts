import React, { useEffect, useState } from "react"
import { Plus, Minus } from "lucide-react"
import { IDrink } from "../drinkTypes"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  selectCartItem,
  selectCartItemPriceIndex,
  updateQuantity,
} from "../../cart/cartSlice"
import { selectDrinkId } from "../drinkSlice"
import drinkApi from "../drinkApi"

interface DrinkItemDetailProps {
  drinkDetail: IDrink | null
}

const DrinkItemDetail = ({ drinkDetail }: DrinkItemDetailProps) => {
  const dispatch = useAppDispatch()
  const drinkId = useAppSelector(selectDrinkId)
  const cartItem = useAppSelector(cart => selectCartItem(cart, drinkId))
  const priceIndex = useAppSelector(cart =>
    selectCartItemPriceIndex(cart, drinkId),
  )

  const [quantity, setQuantity] = useState<number>(cartItem?.quantity ?? 1)

  const handleQuantity = async (quantity: number) => {
    const finalQuan = quantity + (cartItem?.quantity ?? 0)

    setQuantity(finalQuan)
    const drinkDetail = await drinkApi.getDrinkDetail(drinkId)

    dispatch(
      updateQuantity({
        drinkId,
        quantity: finalQuan,
        priceIndex: cartItem?.priceIndex!,
      }),
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setQuantity(+value) // Allow empty input temporarily
      return
    }

    const numValue = Number(value)
    console.log("numValue", numValue)
    if (numValue >= 1) {
      setQuantity(numValue)
      dispatch(
        updateQuantity({
          drinkId,
          quantity: numValue,
          priceIndex: cartItem?.priceIndex!,
        }),
      )
    }
  }

  return (
    <div className="flex justtify-between">
      <div className="flex justtify-between">
        <div className="w-14 h-14 mr-7 mt-7 overflow-hidden rounded-full">
          <img
            src={drinkDetail?.thumbnail}
            alt="drink image"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-7">
          <h2>{drinkDetail?.name}</h2>
          <h2>{cartItem?.drink?.customization[cartItem.priceIndex!].price}</h2>
        </div>
      </div>
      <div className="flex justify-center items-center ml-3">
        <button className="mx-3" onClick={() => handleQuantity(-1)}>
          <Minus />
        </button>
        <input
          type="text"
          className="w-12 h-12 bg-gray-700  text-center text-lg rounded-md"
          value={quantity}
          onChange={handleChange}
        />
        <button className="mx-3" onClick={() => handleQuantity(1)}>
          <Plus />
        </button>
      </div>
    </div>
  )
}

export default DrinkItemDetail

/**
 * Lấy dữ liệu cart item từ cart slice để hiển thị số lượng topping, giá,...z
 * chúng ta cần xác định cart item nào được chọn để hiển thị
 * Làm sao biết cart item nào được chọn
 * có thể xác định qua drinkId
 */
