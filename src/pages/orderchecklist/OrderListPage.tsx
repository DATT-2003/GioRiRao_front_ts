import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchOrders, markAsDone } from "../../features/orderlist/orderSlice"
import { IOrder } from "../../features/orderlist/components/orderlistTypes"
import OrderDetailModal from "../../features/orderlist/components/OrderDetailModal"
import authApi from "../../features/authentication/authApi"

const OrderListPage = () => {
  const dispatch = useAppDispatch()
  const { orders, loading, error } = useAppSelector(state => state.orderlist)
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const me = await authApi.getMeInfo()
      console.log("me", me)
      if (me.storeId) {
        dispatch(fetchOrders(me.storeId))
        console.log("res fetchOrders", orders)
      }
    }
    fetchData()
    console.log("co chay khoong vay cha")
  }, [dispatch])

  const sortedOrders = Array.isArray(orders)
    ? [...orders].sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1
        if (a.status !== "PENDING" && b.status === "PENDING") return 1
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
    : []

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <h1 className="text-3xl font-semibold mb-6">Order Checklist</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-destructive">Error: {error}</p>}

      {!loading && sortedOrders.length === 0 && (
        <p className="text-muted-foreground">No orders found for this store.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedOrders.map(order => (
          <div
            key={order._id}
            onClick={() => setSelectedOrder(order)}
            className={`rounded-xl border p-4 shadow-sm transition hover:shadow-md cursor-pointer ${
              order.status === "COMPLETED"
                ? "bg-muted text-muted-foreground"
                : "bg-card hover:bg-accent"
            }`}
          >
            <div className="font-semibold text-lg">{order.code}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleString()}
            </div>
            <div className="mt-2 text-sm font-medium">
              {order.status === "COMPLETED" ? "✅ Done" : "⏳ Waiting"}
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onMarkDone={orderId => dispatch(markAsDone(orderId))}
        />
      )}
    </div>
  )
}

export default OrderListPage
