import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  selectCartItem,
  selectCartItems,
  selectCartTotalPrice,
  setIsCartComfirmationOpen,
  updateNote,
  updatePriceIndex,
} from "../../cart/cartSlice"
import { selectDrinkId } from "../../drinks/drinkSlice"
import CartItem from "./CartItem"
import CartPaymentMethod from "./CartPaymentMethod"

const CartComfirmation = () => {
  const cartList = useAppSelector(selectCartItems)
  const cartTotalPrice = useAppSelector(selectCartTotalPrice)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(setIsCartComfirmationOpen({ isOpen: false }))
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
    dispatch(setIsCartComfirmationOpen({ isOpen: false }))
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[999] "
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className=" bg-gray-900 text-white h-full p-6 rounded-lg absolute top-0 right-0 z-[1000] w-[62%]"
      >
        <div className="flex h-full">
          <div className="flex flex-col justify-between border-r border-gray-400 pr-5 w-[50%]">
            <div>
              <div className="border-b border-gray-400 pb-2 mb-5">
                <h1>Comfirmation</h1>
              </div>

              <div className="max-h-[400px] overflow-y-scroll hide-scrollbar">
                {cartList?.map((item, index) => (
                  <CartItem
                    key={index}
                    drink={item.drink}
                    price={item.price}
                    quantity={item.quantity}
                    note={item.note}
                    toppings={item.toppings}
                  />
                ))}
              </div>
            </div>

            <div>
              <div>
                <div className="flex justify-between my-3">
                  <p>Discount: </p>
                  <p></p>
                </div>

                <div className="flex justify-between">
                  <p>Subtotal: </p>
                  <p>{cartTotalPrice}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pl-5 w-[50%]">
            <CartPaymentMethod />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartComfirmation