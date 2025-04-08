import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchOrders,
  markAsDone,
} from "../../features/orderlist/orderSlice";
import { IOrder } from "../../features/orderlist/components/orderlistTypes";

const OrderListPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orderlist);

  useEffect(() => {
    const storeId = localStorage.getItem("storeId");

    if (storeId && /^[0-9a-fA-F]{24}$/.test(storeId)) {
      dispatch(fetchOrders(storeId));
    } else {
      console.error(" Invalid or missing storeId in localStorage");
    }
  }, [dispatch]);

  const handleCheckboxChange = (orderId: string) => {
    dispatch(markAsDone(orderId));
  };

  //  Sắp xếp đơn: PENDING trước, COMPLETED sau
  const sortedOrders = Array.isArray(orders)
  ? [...orders].sort((a, b) => {
      if (a.status === "PENDING" && b.status !== "PENDING") return -1;
      if (a.status !== "PENDING" && b.status === "PENDING") return 1;
      return 0;
    })
  : [];


  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Order Checklist</h1>

      {loading && <p className="text-gray-400">Loading orders...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}
      {!loading && sortedOrders.length === 0 && (<p className="text-gray-400">No orders found.</p>)}
        
      <div className="space-y-4">
        {sortedOrders.map((order: IOrder) => (
          <div
            key={order._id}
            className={`flex items-center justify-between p-4 rounded-lg transition ${
              order.status === "COMPLETED"
                ? "bg-gray-700 opacity-60"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <div>
              <p className="font-semibold text-lg">{order.code}</p>
              <p className="text-sm text-gray-400">
                Payment: {order.paymentMethod} | Total:{" "}
                {order.total.toLocaleString()}₫
              </p>
              <p className="text-xs text-gray-500">
                Created at: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={order.status === "COMPLETED"}
                  onChange={() => handleCheckboxChange(order._id)}
                  className="accent-pink-500 w-5 h-5"
                />
                <span className="text-sm">
                  {order.status === "COMPLETED"
                    ? "Completed"
                    : "Mark as done"}
                </span>
                
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderListPage;
