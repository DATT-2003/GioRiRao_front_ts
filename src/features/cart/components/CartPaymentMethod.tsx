import { Check } from "lucide-react"
import React, { useState } from "react"
import { methods } from "../staticData"
import orderApi from "../../order/orderApi"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  removeCartList,
  selectCartItems,
  selectCartTotalPrice,
  setIsCartComfirmationOpen,
  setIsPaymentSuccessOpen,
} from "../cartSlice"
import convertCartItemsToOrderDetails from "../../../utils/transformCarItemToOrderDetail"

const CartPaymentMethod = () => {
  const cartList = useAppSelector(selectCartItems)
  const cartTotalPrice = useAppSelector(selectCartTotalPrice)
  const dispatch = useAppDispatch()
  const [selectedMethod, setSelectedMethod] = useState("Cash")

  const handleComfirmPayment = async () => {
    const items = convertCartItemsToOrderDetails(cartList)
    const order = {
      createdBy: "677fa3d96ee79a6d5eed1f41",
      storeId: "6780d1c957dfc98e89675b55",
      items,
      paymentMethod: selectedMethod as "Cash" | "CARD" | "MOBILE_PAYMENT",
      total: cartTotalPrice,
    }
    const newOrder = await orderApi.createOrder(order)
    if (newOrder) {
      console.log("are you running", newOrder)
      dispatch(setIsCartComfirmationOpen({ isOpen: false }))
      dispatch(setIsPaymentSuccessOpen({ isOpen: true }))
      dispatch(removeCartList())
    } else {
      console.log("why you wrong", newOrder)
    }
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="">
        <div className="mb-5 pb-5 border-b border-gray-400 ">
          <h1>Payment</h1>
        </div>

        <div>
          <p className="mb-5">PaymentMethod</p>
          <div className="flex gap-4">
            {methods.map(method => (
              <button
                key={method.name}
                onClick={() => setSelectedMethod(method.name)}
                className={`relative flex flex-col items-center justify-center w-[120px] h-20 p-3 rounded-xl border-2 ${
                  selectedMethod === method.name
                    ? "border-red-400 bg-gray-800"
                    : "border-gray-600 bg-gray-700"
                } transition-all`}
              >
                <img src={method.icon} alt="" className="w-8" />
                <span className="mt-1">{method.name}</span>
                {selectedMethod === method.name && (
                  <Check
                    className="absolute top-2 right-2 text-white w-auto bg-red-400 rounded-lg"
                    size={15}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <button className="w-[48%] bg-gray-400 hover:bg-gray-500 h-10 rounded-lg mr-2">
          Back
        </button>
        <button
          className="w-[48%] bg-red-400 hover:bg-rose-400 h-10 rounded-lg box-shadow-custom"
          onClick={handleComfirmPayment}
        >
          Comfirm Payment
        </button>
      </div>
    </div>
  )
}

export default CartPaymentMethod
