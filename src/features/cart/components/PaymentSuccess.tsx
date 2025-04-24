import React, { useEffect } from "react"
import { CheckCircle, Download } from "lucide-react"
import { setIsPaymentSuccessOpen } from "../cartSlice"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { selectNewOrder } from "../../order/orderSlice"

const PaymentSuccess = () => {
  const dispatch = useAppDispatch()

  const newOrder = useAppSelector(selectNewOrder)

  // 🧪 Log ra dữ liệu để kiểm tra
  useEffect(() => {
    console.log("🧾 Đơn hàng vừa tạo:", newOrder)
  }, [newOrder])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(setIsPaymentSuccessOpen({ isOpen: false }))
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleClose = () => {
    dispatch(setIsPaymentSuccessOpen({ isOpen: false }))
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[999]"
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-gray-900 text-white h-full p-6 rounded-lg absolute top-0 right-0 z-[800] w-[40%]"
      >
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mt-10">Payment Success!</h2>
          <p className="text-gray-400 mt-2">
            Your payment has been successfully done.
          </p>
          <hr className="border-gray-700 my-4 w-[60%] mt-6" />
          <div className="mt-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-lg font-medium">Total Payment</p>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="text-green-500" size={28} />
                <span className="text-3xl font-bold">
                  {newOrder?.total.toLocaleString()} VND
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-12">
            <div className="bg-gray-900 p-4 rounded-lg border border-white min-w-[15%]">
              <p className="text-gray-400 text-sm">Payment Method</p>
              <p className="font-semibold">{newOrder?.paymentMethod}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-white min-w-[15%]">
              <p className="text-gray-400 text-sm">Store ID</p>
              <p className="font-semibold">{newOrder?.storeId}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-white min-w-[15%]">
              <p className="text-gray-400 text-sm">Created At</p>
              <p className="font-semibold">
                {newOrder?.createdAt
                  ? new Date(newOrder.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <button className="mt-12 flex items-center space-x-2 text-gray-300 hover:text-white">
            <Download size={20} />
            <span>Get PDF Receipt</span>
          </button>

          <div className="mt-6 flex space-x-4">
            <button
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
