import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  selectDrinkId,
  selectDrinkIdCart,
  setIsDrinkDetailOpen,
} from "../drinkSlice"
import drinkApi from "../drinkApi"
import { IDrink } from "../drinkTypes"
import DrinkItemDetail from "./DrinkItemDetail"
import ToppingsList from "../../topping/components/ToppingsList"
import {
  selectCartItem,
  updateNote,
  updatePriceIndex,
} from "../../cart/cartSlice"
import AddingToppingList from "../../topping/components/AddingToppingList"

const DrinkDetail = () => {
  const id = useAppSelector(selectDrinkIdCart)
  const drinkId = useAppSelector(selectDrinkId)
  const cartItem = useAppSelector(cart => selectCartItem(cart, id))
  const dispatch = useAppDispatch()
  const [drinkDetail, setDrinkDetail] = useState<IDrink | null>(null)

  useEffect(() => {
    async function loadDrinkDetail() {
      console.log("drinkid", drinkId)
      const drink = await drinkApi.getDrinkDetail(drinkId ? drinkId : "")
      setDrinkDetail(drink)
    }
    loadDrinkDetail()
  }, [drinkId])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(setIsDrinkDetailOpen(false))
      }
    }

    // Attach the event listener
    window.addEventListener("keydown", handleEscape)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleClose = () => {
    dispatch(setIsDrinkDetailOpen(false))
  }

  const handleDrinkPrice = (priceIndex: number) => {
    // console.log("are you running", priceIndex)
    dispatch(updatePriceIndex({ drinkId, priceIndex }))
  }

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    dispatch(updateNote({ id, note: value }))
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[999] "
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className=" bg-gray-900 text-white w-auto h-full p-6 rounded-lg absolute top-0 right-0 z-[1000]"
      >
        <div className="flex h-full">
          <div className="flex flex-col justify-between border-r border-gray-400 pr-5 ">
            <div>
              <div className="border-b border-gray-400 pb-2">
                <h1>Add Topping</h1>
              </div>

              <DrinkItemDetail drinkDetail={drinkDetail} />

              <input
                type="text"
                placeholder="Order Note"
                className="bg-gray-700 rounded-lg w-full pl-4 pr-2 py-2 mt-5"
                value={cartItem?.note}
                onChange={handleNoteChange}
              />

              <AddingToppingList />
            </div>
            <div></div>

            <div>
              <div className="grid grid-cols-3 gap-4 border-b border-gray-400 pb-2">
                {drinkDetail?.customization.map((item, index) => (
                  <button
                    className="text-center bg-gray-700 px-4 py-1.5 rounded-lg transition-colors duration-300 hover:bg-gray-800"
                    key={index}
                    onClick={() => handleDrinkPrice(index)}
                  >
                    <p>{item.size}</p>
                    <p>{item.price}</p>
                  </button>
                ))}
              </div>

              <div>
                <div className="flex justify-between my-3">
                  <p>Discount: </p>
                  <p>0 VND</p>
                </div>

                <div className="flex justify-between">
                  <p>Subtotal: </p>
                  <p>{cartItem?.price}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pl-5">
            <ToppingsList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DrinkDetail

/**
 * Nhiệm vụ sáng nay
 * 1. ấn vào giá tiền thì: tổng tiền hiển thị thay đổi, và tiền mặc định của nước thay đổi OKOKOKOK
 * 2. Khi ấn vào add topping thì: hiển thị topping item trong drinkitemdetail, và khi thoát ra, chúng ta cũng thấy topping item trong cartitem hiển thị ở cartlist chưa OKOKOK
 * 3. có thể xóa topping item ra khỏi drinkitem detail OKOKOK
 * 4. khi bấm vào cart item thì nó hiển thị lên drinkitemdetail
 */
