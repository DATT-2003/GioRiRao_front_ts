import api from "../../../app/api";
import orderlistEndpoints from "./orderlistEndpoints";
import { IOrder } from "./orderlistTypes";

const orderlistApi = {
  async getPendingOrders(storeId: string): Promise<IOrder[]> {
    try {
      const res = await api.get(orderlistEndpoints.getPendingOrders(storeId));
      return res.data.order; // Assuming the response structure is { order: IOrder[] }
    } catch (err) {
      console.error(" Failed to fetch pending orders:", err);
      throw err;
    }
  },

  async markOrderAsDone(orderId: string): Promise<IOrder> {
    try {
      const res = await api.patch(orderlistEndpoints.updateOrderStatus(orderId), {
        status: "COMPLETED",
      });
      return res.data;
    } catch (err) {
      console.error(" Failed to mark order as done:", err);
      throw err;
    }
  },
};

export default orderlistApi;
