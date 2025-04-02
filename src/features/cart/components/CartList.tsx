import React from "react"
import CartItem from "./CartItem"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  selectCartItems,
  selectCartTotalPrice,
  setIsCartComfirmationOpen,
} from "../cartSlice"

const CartList = () => {
  const cartList = useAppSelector(selectCartItems)
  const cartTotalPrice = useAppSelector(selectCartTotalPrice)
  const dispatch = useAppDispatch()

  const handlePayment = (isOpen: boolean) => {
    console.log("are you runni")
    dispatch(setIsCartComfirmationOpen({ isOpen }))
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg flex flex-col justify-between h-[550px] overflow-y-scroll hide-scrollbar">
      <div className="mb-6">
        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-medium">Orders #34562</h2>
        </div>

        <div className="flex mb-5 text-[17px] pb-2 border-b">
          <p className="mr-[200px]">Item</p>
          <p className="mr-[25px]">Qty</p>
          <p>Price</p>
        </div>

        <div className="max-h-[300px] overflow-y-scroll hide-scrollbar">
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

      <div className="">
        <div className="flex justify-between mb-4">
          <span className="text-gray-400">Sub total</span>
          <span className="text-white">
            {cartTotalPrice ? cartTotalPrice : 0} VND
          </span>
        </div>
        <button
          className="w-full bg-rose-400 text-white py-3 rounded-lg"
          onClick={() => handlePayment(true)}
        >
          Continue to Payments
        </button>
      </div>
    </div>
  )
}

export default CartList
